"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { buildSkull, type MeshData, type SkullFrame, type SkullParams } from "@/lib/skull";

export interface SkullItem {
  /** Cache key. Change it whenever params change. */
  key: string;
  params: SkullParams;
}

type Built = ReturnType<typeof buildSkull>;
const cache = new Map<string, Built>();

function remember(key: string, b: Built) {
  cache.set(key, b);
  if (cache.size > 80) cache.delete(cache.keys().next().value as string);
}

/** Quick, coarse build on the main thread, for instant feedback. */
function getCoarse(item: SkullItem): Built {
  const key = `${item.key}@${COARSE}`;
  let b = cache.get(key);
  if (!b) {
    b = buildSkull(item.params, COARSE);
    remember(key, b);
  }
  return b;
}

// One shared worker produces the detailed meshes.
let worker: Worker | null = null;
let seq = 0;
const pending = new Map<number, { key: string; done: (b: Built) => void }[]>();
const inflight = new Map<string, number>();

function requestFine(item: SkullItem, done: (b: Built) => void) {
  const key = `${item.key}@${FINE}`;
  const hit = cache.get(key);
  if (hit) return done(hit);
  if (!worker) {
    worker = new Worker(new URL("../lib/skull.worker.ts", import.meta.url));
    worker.onmessage = (e: MessageEvent<{ id: number; built: Built }>) => {
      const waiters = pending.get(e.data.id) ?? [];
      pending.delete(e.data.id);
      for (const w of waiters) {
        inflight.delete(w.key);
        remember(w.key, e.data.built);
        w.done(e.data.built);
      }
    };
  }
  const running = inflight.get(key);
  if (running !== undefined) {
    pending.get(running)?.push({ key, done });
    return;
  }
  const id = ++seq;
  inflight.set(key, id);
  pending.set(id, [{ key, done }]);
  worker.postMessage({ id, params: item.params, cell: FINE });
}

function toGeometry(m: MeshData): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(m.positions, 3));
  g.setAttribute("normal", new THREE.BufferAttribute(m.normals, 3));
  g.setAttribute("color", new THREE.BufferAttribute(m.colors, 3));
  g.setIndex(new THREE.BufferAttribute(m.indices, 1));
  return g;
}

const NOISE = /* glsl */ `
  varying vec3 vObj;
  uniform vec3 uC;
  uniform vec3 uR;
  uniform float uSut;
  float h13(vec3 p) {
    p = fract(p * 0.1031);
    p += dot(p, p.zyx + 31.32);
    return fract((p.x + p.y) * p.z);
  }
  float vnoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(h13(i), h13(i + vec3(1, 0, 0)), f.x), mix(h13(i + vec3(0, 1, 0)), h13(i + vec3(1, 1, 0)), f.x), f.y),
      mix(mix(h13(i + vec3(0, 0, 1)), h13(i + vec3(1, 0, 1)), f.x), mix(h13(i + vec3(0, 1, 1)), h13(i + vec3(1, 1, 1)), f.x), f.y),
      f.z);
  }
  float fbm(vec3 p) {
    return 0.5 * vnoise(p) + 0.25 * vnoise(p * 2.03) + 0.125 * vnoise(p * 4.01) + 0.0625 * vnoise(p * 8.1);
  }
  float lineMask(float d, float w) {
    float aa = max(w, fwidth(d) * 1.6);
    return (1.0 - smoothstep(aa * 0.35, aa, abs(d))) * min(1.0, w / aa * 1.4);
  }
  // Cranial sutures, drawn as wandering seams on the braincase.
  float sutures(vec3 p) {
    if (uSut < 0.5) return 0.0;
    vec3 q = (p - uC) / uR;
    float shell = smoothstep(0.86, 0.93, length(q)) * (1.0 - smoothstep(1.16, 1.24, length(q)));
    float w1 = 0.016 * sin(q.z * 70.0 + 2.5 * sin(q.z * 23.0)) + 0.008 * sin(q.z * 171.0);
    float w2 = 0.016 * sin(q.x * 64.0 + 2.5 * sin(q.y * 27.0)) + 0.008 * sin(q.x * 150.0 + q.y * 90.0);
    float cor = 0.15 * abs(q.x) + 0.122 * q.y + q.z - 0.698;
    float lam = 0.2 * abs(q.x) + 0.478 * q.y + q.z + 0.567;
    float s = lineMask(q.x + w1, 0.014) * step(cor, 0.0) * step(0.0, lam) * step(0.2, q.y);
    s = max(s, lineMask(cor + w2, 0.014) * step(-0.12, q.y));
    s = max(s, lineMask(lam + w2, 0.014) * step(-0.42, q.y) * step(q.z, -0.2));
    return s * shell;
  }
  float boneHeight(vec3 p) {
    return fbm(p * 26.0) * 0.7 - sutures(p) * 1.2;
  }
  vec3 bumpNormal(vec3 pos, vec3 nrm, vec2 dH) {
    vec3 sx = dFdx(pos);
    vec3 sy = dFdy(pos);
    vec3 r1 = cross(sy, nrm);
    vec3 r2 = cross(nrm, sx);
    float det = dot(sx, r1);
    vec3 g = sign(det) * (dH.x * r1 + dH.y * r2);
    return normalize(abs(det) * nrm - g);
  }
`;

/** Standard material with procedural bone grain, blotches and sutures. */
function boneMaterial(frame: SkullFrame | null): THREE.MeshStandardMaterial {
  const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.7, metalness: 0 });
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uC = { value: new THREE.Vector3(0, frame?.cy ?? 0, frame?.cz ?? 0) };
    shader.uniforms.uR = { value: new THREE.Vector3(frame?.rx ?? 1, frame?.ry ?? 1, frame?.rz ?? 1) };
    shader.uniforms.uSut = { value: frame ? 1 : 0 };
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vObj;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvObj = position;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\n" + NOISE)
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
        float blotch = fbm(vObj * 5.0);
        float seam = sutures(vObj);
        diffuseColor.rgb *= mix(vec3(0.9, 0.84, 0.74), vec3(1.03, 1.02, 1.0), smoothstep(0.25, 0.7, blotch));
        diffuseColor.rgb *= 1.0 - 0.05 * fbm(vObj * 40.0);
        diffuseColor.rgb *= mix(vec3(1.0), vec3(0.5, 0.42, 0.34), seam);`,
      )
      .replace(
        "#include <normal_fragment_maps>",
        `#include <normal_fragment_maps>
        float bh = boneHeight(vObj);
        normal = bumpNormal(-vViewPosition, normal, vec2(dFdx(bh), dFdy(bh)) * 0.0045);`,
      )
      .replace(
        "#include <roughnessmap_fragment>",
        `#include <roughnessmap_fragment>
        roughnessFactor = clamp(roughnessFactor - 0.16 + 0.3 * fbm(vObj * 12.0), 0.3, 1.0);`,
      );
  };
  return mat;
}

const FINE = 0.019;
const COARSE = 0.05;

export default function SkullViewer({
  items,
  showJaw = true,
  spin = true,
  yaw: yaw0 = -0.72,
  className = "",
}: {
  items: SkullItem[];
  showJaw?: boolean;
  spin?: boolean;
  /** Starting rotation in radians; 0 faces the camera. */
  yaw?: number;
  className?: string;
}) {
  const mount = useRef<HTMLDivElement>(null);
  const api = useRef<{
    setItems: (items: SkullItem[]) => void;
    setJaw: (on: boolean) => void;
    setSpin: (on: boolean) => void;
  } | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      // No WebGL: show the text fallback on the next tick.
      queueMicrotask(() => setFailed(true));
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 60);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8fa398, 0.75));
    const key = new THREE.DirectionalLight(0xfff1dc, 2.6);
    key.position.set(-2.5, 3.2, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xbfe9d3, 1.2);
    rim.position.set(3.5, 1.5, -3);
    scene.add(rim);

    const toothMat = new THREE.MeshStandardMaterial({
      color: 0xfbf7ec,
      roughness: 0.35,
    });
    const toothGeo = new RoundedBoxGeometry(1, 1, 1, 3, 0.32);

    const root = new THREE.Group();
    scene.add(root);

    // Soft contact shadows so the skulls sit on something.
    const sc = document.createElement("canvas");
    sc.width = sc.height = 128;
    const sg = sc.getContext("2d")!;
    const grad = sg.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(20,45,32,0.34)");
    grad.addColorStop(0.55, "rgba(20,45,32,0.1)");
    grad.addColorStop(1, "rgba(20,45,32,0)");
    sg.fillStyle = grad;
    sg.fillRect(0, 0, 128, 128);
    const shadowTex = new THREE.CanvasTexture(sc);
    const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false });
    const shadowGeo = new THREE.PlaneGeometry(2.5, 2.5);
    let shadows: THREE.Mesh[] = [];
    let groups: THREE.Group[] = [];
    let jawOn = showJaw;
    let spinning = spin;
    let yaw = yaw0;
    let pitch = 0.06;
    let current: SkullItem[] = [];
    let refine = 0;
    let disposed = false;

    const clear = () => {
      groups.forEach((g) => {
        g.traverse((o) => {
          const m = o as THREE.Mesh;
          if (m.geometry && m.geometry !== toothGeo) m.geometry.dispose();
          if (m.material && m.material !== toothMat) (m.material as THREE.Material).dispose();
        });
        root.remove(g);
      });
      groups = [];
      shadows.forEach((s) => scene.remove(s));
      shadows = [];
    };

    const layout = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      const n = Math.max(1, groups.length);
      const spacing = 2.35;
      groups.forEach((g, i) => {
        g.position.x = (i - (n - 1) / 2) * spacing;
        if (shadows[i]) shadows[i].position.set(g.position.x, -1.17, 0);
      });
      const halfW = (n * spacing) / 2 + 0.05;
      const halfH = 1.32;
      const tan = Math.tan((camera.fov * Math.PI) / 360);
      const dist = Math.max(halfH / tan, halfW / (tan * camera.aspect));
      camera.position.set(0, 0.12, dist + 1.2);
      camera.lookAt(0, -0.02, 0);
      camera.updateProjectionMatrix();
    };

    const build = (meshes: Built[]) => {
      clear();
      for (const b of meshes) {
        const g = new THREE.Group();
        const pivot = new THREE.Group();
        const f = b.frame;
        // centre the skull between brow and occiput, crown and chin
        pivot.position.set(0, -(f.cy + f.ry + f.yTeeth - 0.3) / 2, -(f.snoutZ + f.cz - f.rz) / 2);
        pivot.add(new THREE.Mesh(toGeometry(b.cranium), boneMaterial(b.frame)));
        const jaw = new THREE.Group();
        jaw.name = "jaw";
        jaw.add(new THREE.Mesh(toGeometry(b.mandible), boneMaterial(null)));
        const upper = new THREE.InstancedMesh(toothGeo, toothMat, b.teeth.length / 2);
        const lower = new THREE.InstancedMesh(toothGeo, toothMat, b.teeth.length / 2);
        const m4 = new THREE.Matrix4();
        const q = new THREE.Quaternion();
        const up = new THREE.Vector3(0, 1, 0);
        let u = 0;
        let l = 0;
        const half = b.teeth.length / 2;
        b.teeth.forEach((t, i) => {
          q.setFromAxisAngle(up, t.yaw);
          m4.compose(new THREE.Vector3(...t.pos), q, new THREE.Vector3(...t.size));
          if (i < half) upper.setMatrixAt(u++, m4);
          else lower.setMatrixAt(l++, m4);
        });
        pivot.add(upper);
        jaw.add(lower);
        jaw.visible = jawOn;
        pivot.add(jaw);
        g.add(pivot);
        root.add(g);
        groups.push(g);
        const sh = new THREE.Mesh(shadowGeo, shadowMat);
        sh.rotation.x = -Math.PI / 2;
        scene.add(sh);
        shadows.push(sh);
      }
      layout();
    };

    api.current = {
      setItems(next) {
        current = next;
        window.clearTimeout(refine);
        const fine = next.map((n) => cache.get(`${n.key}@${FINE}`));
        if (fine.every(Boolean)) {
          build(fine as Built[]);
          return;
        }
        build(next.map(getCoarse));
        // Ask for detail once the selection has settled for a moment.
        refine = window.setTimeout(() => {
          const got: (Built | undefined)[] = next.map(() => undefined);
          next.forEach((n, i) =>
            requestFine(n, (b) => {
              got[i] = b;
              if (current === next && !disposed && got.every(Boolean)) build(got as Built[]);
            }),
          );
        }, 120);
      },
      setJaw(on) {
        jawOn = on;
        root.traverse((o) => {
          if (o.name === "jaw") o.visible = on;
        });
      },
      setSpin(on) {
        spinning = on;
      },
    };

    const ro = new ResizeObserver(layout);
    ro.observe(el);

    let dragging = false;
    let lx = 0;
    let ly = 0;
    const dom = renderer.domElement;
    dom.style.touchAction = "pan-y";
    const down = (e: PointerEvent) => {
      dragging = true;
      spinning = false;
      lx = e.clientX;
      ly = e.clientY;
      dom.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      yaw += (e.clientX - lx) * 0.009;
      pitch = THREE.MathUtils.clamp(pitch + (e.clientY - ly) * 0.006, -1.2, 1.2);
      lx = e.clientX;
      ly = e.clientY;
    };
    const upH = () => {
      dragging = false;
    };
    dom.addEventListener("pointerdown", down);
    dom.addEventListener("pointermove", move);
    dom.addEventListener("pointerup", upH);
    dom.addEventListener("pointercancel", upH);

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      if (spinning) yaw += 0.0035;
      for (const g of groups) {
        g.rotation.set(pitch, yaw, 0);
      }
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(refine);
      ro.disconnect();
      io.disconnect();
      clear();
      toothMat.dispose();
      toothGeo.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTex.dispose();
      renderer.dispose();
      dom.remove();
      api.current = null;
    };
    // The scene is created once; props are pushed through `api` below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sig = items.map((i) => i.key).join("|");
  useEffect(() => {
    api.current?.setItems(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig]);
  useEffect(() => {
    api.current?.setJaw(showJaw);
  }, [showJaw]);
  useEffect(() => {
    api.current?.setSpin(spin);
  }, [spin]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mount}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        role="img"
        aria-label="Rotatable 3D skull model"
      />
      {failed ? (
        <p className="absolute inset-0 grid place-items-center text-sm text-[var(--muted)]">
          3D needs WebGL, which is switched off in this browser.
        </p>
      ) : null}
    </div>
  );
}

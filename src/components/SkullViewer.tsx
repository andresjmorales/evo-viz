"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { buildSkull, type MeshData, type SkullParams } from "@/lib/skull";

export interface SkullItem {
  /** Cache key. Change it whenever params change. */
  key: string;
  params: SkullParams;
}

type Built = ReturnType<typeof buildSkull>;
const cache = new Map<string, Built>();

function getBuilt(item: SkullItem, cell: number): Built {
  const key = `${item.key}@${cell}`;
  let b = cache.get(key);
  if (!b) {
    b = buildSkull(item.params, cell);
    cache.set(key, b);
    if (cache.size > 60) cache.delete(cache.keys().next().value as string);
  }
  return b;
}

function toGeometry(m: MeshData): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(m.positions, 3));
  g.setAttribute("normal", new THREE.BufferAttribute(m.normals, 3));
  g.setAttribute("color", new THREE.BufferAttribute(m.colors, 3));
  g.setIndex(new THREE.BufferAttribute(m.indices, 1));
  return g;
}

const FINE = 0.024;
const COARSE = 0.044;

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

    const boneMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.66,
      metalness: 0,
    });
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

    const clear = () => {
      groups.forEach((g) => {
        g.traverse((o) => {
          const m = o as THREE.Mesh;
          if (m.geometry && m.geometry !== toothGeo) m.geometry.dispose();
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

    const build = (cell: number) => {
      clear();
      for (const item of current) {
        const b = getBuilt(item, cell);
        const g = new THREE.Group();
        const pivot = new THREE.Group();
        const f = b.frame;
        // centre the skull between brow and occiput, crown and chin
        pivot.position.set(0, -(f.cy + f.ry + f.yTeeth - 0.3) / 2, -(f.snoutZ + f.cz - f.rz) / 2);
        pivot.add(new THREE.Mesh(toGeometry(b.cranium), boneMat));
        const jaw = new THREE.Group();
        jaw.name = "jaw";
        jaw.add(new THREE.Mesh(toGeometry(b.mandible), boneMat));
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
        const allFine = next.every((n) => cache.has(`${n.key}@${FINE}`));
        if (allFine) build(FINE);
        else {
          build(COARSE);
          refine = window.setTimeout(() => build(FINE), 140);
        }
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
      cancelAnimationFrame(raf);
      window.clearTimeout(refine);
      ro.disconnect();
      io.disconnect();
      clear();
      boneMat.dispose();
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

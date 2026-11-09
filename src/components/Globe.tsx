"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { geoEquirectangular, geoGraticule10, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology } from "topojson-specification";
import { sites } from "@/data/fossils";
import { migrations } from "@/data/migrations";
import { taxa } from "@/data/taxa";
import { latLonToVec3, spherePath } from "@/lib/geo";
import { taxonGlow } from "@/lib/palette";
import { timeStore } from "@/lib/timeStore";

const taxonById = Object.fromEntries(taxa.map((t) => [t.id, t]));

const ARC_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const ARC_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uProgress;
  uniform float uOpacity;
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    if (vUv.x > uProgress) discard;
    float flow = 0.72 + 0.28 * sin(vUv.x * 70.0 - uTime * 3.0);
    float head = smoothstep(0.12, 0.0, uProgress - vUv.x) * step(uProgress, 0.999);
    vec3 col = mix(uColor, vec3(1.0), head * 0.7);
    gl_FragColor = vec4(col, uOpacity * (flow + head));
  }
`;

const GLOBE_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const GLOBE_FRAG = /* glsl */ `
  uniform sampler2D uMap;
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vec3 base = texture2D(uMap, vUv).rgb;
    float light = max(dot(vNormal, normalize(vec3(-0.45, 0.55, 0.7))), 0.0);
    float shade = mix(0.5, 1.12, pow(light, 0.85));
    float rim = pow(1.0 - max(vNormal.z, 0.0), 3.0);
    vec3 col = base * shade + vec3(0.35, 0.95, 0.68) * rim * 0.22;
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;
const ATMO_FRAG = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    float i = pow(max(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 4.0);
    gl_FragColor = vec4(0.3, 0.85, 0.6, 1.0) * i * 0.9;
  }
`;

function dotTexture(ring = false): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  if (ring) {
    g.strokeStyle = "#fff";
    g.lineWidth = 3;
    g.beginPath();
    g.arc(32, 32, 27, 0, Math.PI * 2);
    g.stroke();
  } else {
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.32, "rgba(255,255,255,1)");
    grad.addColorStop(0.42, "rgba(255,255,255,0.35)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

async function earthTexture(size: number): Promise<THREE.Texture> {
  const res = await fetch("/geo/land-50m.json");
  const topo = (await res.json()) as Topology;
  const land = feature(topo, topo.objects.land);
  const w = size;
  const h = size / 2;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const projection = geoEquirectangular()
    .translate([w / 2, h / 2])
    .scale(w / (2 * Math.PI));
  const path = geoPath(projection, ctx);

  const ocean = ctx.createLinearGradient(0, 0, 0, h);
  ocean.addColorStop(0, "#0d4a3a");
  ocean.addColorStop(0.5, "#0a3d30");
  ocean.addColorStop(1, "#0d4a3a");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, w, h);

  ctx.beginPath();
  path(geoGraticule10());
  ctx.strokeStyle = "rgba(190, 255, 225, 0.07)";
  ctx.lineWidth = w / 2600;
  ctx.stroke();

  // Soft shelf glow around the coasts, then the land itself.
  ctx.beginPath();
  path(land);
  ctx.shadowColor = "rgba(90, 230, 170, 0.5)";
  ctx.shadowBlur = w / 160;
  ctx.fillStyle = "#22805a";
  ctx.fill();
  ctx.shadowBlur = 0;
  const landFill = ctx.createLinearGradient(0, 0, 0, h);
  landFill.addColorStop(0, "#3f9f78");
  landFill.addColorStop(0.5, "#22805a");
  landFill.addColorStop(1, "#3c9a74");
  ctx.fillStyle = landFill;
  ctx.fill();
  ctx.strokeStyle = "rgba(205, 255, 230, 0.55)";
  ctx.lineWidth = w / 3200;
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export interface GlobeProps {
  /** Emphasise one taxon; others dim. */
  highlight: string | null;
  /** [lat, lon] the camera should drift toward. */
  focus: [number, number];
  onPickTaxon: (id: string) => void;
}

export default function Globe({ highlight, focus, onPickTaxon }: GlobeProps) {
  const mount = useRef<HTMLDivElement>(null);
  const labelLayer = useRef<HTMLDivElement>(null);
  const highlightRef = useRef(highlight);
  const flyTo = useRef<THREE.Vector3 | null>(null);
  const pickRef = useRef(onPickTaxon);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    highlightRef.current = highlight;
  }, [highlight]);
  useEffect(() => {
    pickRef.current = onPickTaxon;
  }, [onPickTaxon]);
  useEffect(() => {
    flyTo.current = latLonToVec3(focus[0], focus[1]).normalize();
  }, [focus]);

  useEffect(() => {
    const el = mount.current;
    const layer = labelLayer.current;
    if (!el || !layer) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      // No WebGL: show the text fallback on the next tick.
      queueMicrotask(() => setFailed(true));
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
    const DIST = 3.9;
    camera.position.copy(latLonToVec3(8, 24).multiplyScalar(DIST));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.55;
    controls.minPolarAngle = 0.25;
    controls.maxPolarAngle = Math.PI - 0.25;
    controls.addEventListener("start", () => {
      flyTo.current = null;
    });

    const globeMat = new THREE.ShaderMaterial({
      uniforms: { uMap: { value: null } },
      vertexShader: GLOBE_VERT,
      fragmentShader: GLOBE_FRAG,
    });
    const globe = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 64), globeMat);
    globe.visible = false;
    scene.add(globe);

    const atmo = new THREE.Mesh(
      new THREE.SphereGeometry(1.16, 64, 48),
      new THREE.ShaderMaterial({
        vertexShader: GLOBE_VERT,
        fragmentShader: ATMO_FRAG,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    );
    scene.add(atmo);

    let disposed = false;
    earthTexture(window.innerWidth < 700 ? 2048 : 4096)
      .then((tex) => {
        if (disposed) return;
        globeMat.uniforms.uMap.value = tex;
        globe.visible = true;
        setReady(true);
      })
      .catch(() => setFailed(true));

    // Routes
    const dot = dotTexture();
    const ring = dotTexture(true);
    const arcs = migrations.map((m) => {
      const pts = spherePath(m.path, 1.012, 180);
      const curve = new THREE.CatmullRomCurve3(pts);
      const color = new THREE.Color(taxonGlow(m.taxonId));
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: color },
          uProgress: { value: 0 },
          uOpacity: { value: 1 },
          uTime: { value: 0 },
        },
        vertexShader: ARC_VERT,
        fragmentShader: ARC_FRAG,
        transparent: true,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 180, 0.0075, 6, false),
        mat,
      );
      scene.add(mesh);
      const head = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: dot,
          color,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
      );
      head.scale.setScalar(0.09);
      scene.add(head);
      return { m, curve, mat, mesh, head };
    });

    // Sites
    const siteObjs = sites.map((s) => {
      const pos = latLonToVec3(s.lat, s.lon, 1.014);
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: dot, transparent: true, depthWrite: false }),
      );
      sprite.position.copy(pos);
      scene.add(sprite);
      const pulse = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: ring, transparent: true, depthWrite: false }),
      );
      pulse.position.copy(pos);
      scene.add(pulse);
      const label = document.createElement("button");
      label.type = "button";
      label.className = "globe-label";
      label.textContent = s.name;
      layer.appendChild(label);
      const obj = { s, pos, sprite, pulse, label, taxonId: s.taxonIds[0] };
      label.addEventListener("click", () => pickRef.current(obj.taxonId));
      return obj;
    });

    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      // Keep the whole sphere in view on narrow or short containers.
      camera.fov = w / h < 1 ? 32 / Math.max(0.62, w / h) : 32;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    const tmp = new THREE.Vector3();
    const camDir = new THREE.Vector3();
    const clock = new THREE.Clock();
    let raf = 0;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const t = clock.getElapsedTime();
      const ka = timeStore.ka;
      const hl = highlightRef.current;

      if (flyTo.current) {
        camDir.copy(camera.position).normalize();
        const ang = camDir.angleTo(flyTo.current);
        if (ang < 0.01) flyTo.current = null;
        else {
          camDir.lerp(flyTo.current, Math.min(1, 0.035 + 0.02 / ang)).normalize();
          camera.position.copy(camDir.multiplyScalar(DIST));
        }
      }
      controls.update();
      camDir.copy(camera.position).normalize();

      for (const a of arcs) {
        const { m } = a;
        const p = THREE.MathUtils.clamp(
          (m.startKa - ka) / (m.startKa - m.endKa),
          0,
          1,
        );
        const taxon = taxonById[m.taxonId];
        const gone = taxon && ka < taxon.rangeEndKa;
        const dim = hl && hl !== m.taxonId;
        const base = gone ? 0.22 : p >= 1 ? 0.7 : 1;
        a.mesh.visible = p > 0;
        a.mat.uniforms.uProgress.value = p;
        a.mat.uniforms.uOpacity.value = dim ? base * 0.18 : base;
        a.mat.uniforms.uTime.value = gone ? 0 : t;
        const moving = p > 0 && p < 1;
        a.head.visible = moving;
        if (moving) {
          a.curve.getPointAt(p, a.head.position);
          a.head.position.multiplyScalar(1.006);
          a.head.material.opacity = dim ? 0.2 : 0.95;
          a.head.scale.setScalar(0.085 + 0.02 * Math.sin(t * 5));
        }
      }

      const w = el.clientWidth;
      const h = el.clientHeight;
      const placed: [number, number][] = [];
      for (const o of siteObjs) {
        const [from, to] = o.s.ka;
        const seen = ka <= from;
        const active = seen && ka >= to;
        const alive = o.s.taxonIds.find((id) => {
          const tx = taxonById[id];
          return tx && ka <= tx.rangeStartKa && ka >= tx.rangeEndKa;
        });
        o.taxonId = alive ?? o.s.taxonIds[0];
        const dim = hl && !o.s.taxonIds.includes(hl);
        o.sprite.visible = seen;
        o.pulse.visible = active && !dim;
        let showLabel = false;
        if (seen) {
          o.sprite.material.color.set(active ? taxonGlow(o.taxonId) : "#d9f5e6");
          o.sprite.material.opacity = (active ? 1 : 0.42) * (dim ? 0.3 : 1);
          o.sprite.scale.setScalar(active ? 0.05 : 0.026);
          if (active) {
            const k = (t * 0.7 + o.pos.x * 3) % 1;
            o.pulse.material.color.set(taxonGlow(o.taxonId));
            o.pulse.material.opacity = (1 - k) * 0.8;
            o.pulse.scale.setScalar(0.04 + k * 0.1);
          }
          const facing = tmp.copy(o.pos).normalize().dot(camDir);
          if (active && !dim && facing > 0.35) {
            tmp.copy(o.pos).project(camera);
            const x = (tmp.x * 0.5 + 0.5) * w;
            const y = (-tmp.y * 0.5 + 0.5) * h;
            const clash = placed.some(
              ([px, py]) => Math.abs(px - x) < 92 && Math.abs(py - y) < 17,
            );
            if (!clash) {
              placed.push([x, y]);
              showLabel = true;
              o.label.style.transform = `translate(${x + 9}px, ${y - 9}px)`;
              o.label.style.setProperty("--c", taxonGlow(o.taxonId));
            }
          }
        }
        o.label.style.opacity = showLabel ? "1" : "0";
        o.label.style.pointerEvents = showLabel ? "auto" : "none";
      }

      renderer.render(scene, camera);
    };
    frame();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        mesh.geometry?.dispose?.();
        const mat = mesh.material as THREE.Material | undefined;
        mat?.dispose?.();
      });
      dot.dispose();
      ring.dispose();
      (globeMat.uniforms.uMap.value as THREE.Texture | null)?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      layer.replaceChildren();
    };
  }, []);

  return (
    <div className="relative h-full w-full select-none">
      <div
        ref={mount}
        className={`absolute inset-0 cursor-grab transition-opacity duration-700 active:cursor-grabbing ${
          ready ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Interactive globe showing fossil sites and dispersal routes"
        role="img"
      />
      <div
        ref={labelLayer}
        className="pointer-events-none absolute inset-0 overflow-hidden"
      />
      {failed ? (
        <p className="absolute inset-0 grid place-items-center px-8 text-center text-sm text-white/70">
          The 3D globe needs WebGL, which this browser has switched off.
        </p>
      ) : null}
    </div>
  );
}

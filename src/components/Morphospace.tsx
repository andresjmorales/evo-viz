"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { MorphParams } from "@/data/types";

function lerpMorph(a: MorphParams, b: MorphParams, t: number): MorphParams {
  const mix = (x: number, y: number) => x + (y - x) * t;
  return {
    vault: mix(a.vault, b.vault),
    brow: mix(a.brow, b.brow),
    prognathism: mix(a.prognathism, b.prognathism),
    faceWidth: mix(a.faceWidth, b.faceWidth),
    nuchal: mix(a.nuchal, b.nuchal),
    chin: mix(a.chin, b.chin),
    capacity: mix(a.capacity, b.capacity),
  };
}

function buildSkull(m: MorphParams): THREE.Group {
  const g = new THREE.Group();
  const bone = new THREE.MeshStandardMaterial({
    color: 0xd8c4a0,
    roughness: 0.62,
    metalness: 0.04,
  });
  const dark = new THREE.MeshStandardMaterial({
    color: 0x3a2e24,
    roughness: 0.5,
  });

  const cap = 0.85 + m.capacity * 0.55;
  const vault = 0.7 + m.vault * 0.55;
  const cranium = new THREE.Mesh(
    new THREE.SphereGeometry(1, 48, 36),
    bone,
  );
  cranium.scale.set(1.05 * cap, vault * cap, 1.2 * cap);
  cranium.position.set(0, 0.15 + m.vault * 0.15, 0);
  g.add(cranium);

  const brow = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.12, 12, 28, Math.PI), bone);
  brow.rotation.x = Math.PI / 2;
  brow.rotation.z = Math.PI;
  brow.position.set(0, 0.15, 0.72 * cap);
  brow.scale.set(0.9 + m.faceWidth * 0.3, 0.6 + m.brow * 0.9, 0.7 + m.brow);
  g.add(brow);

  const face = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), bone);
  face.scale.set(0.55 + m.faceWidth * 0.35, 0.55, 0.35 + m.prognathism * 0.55);
  face.position.set(0, -0.35, 0.55 + m.prognathism * 0.35);
  g.add(face);

  const jaw = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), bone);
  jaw.scale.set(0.5 + m.faceWidth * 0.25, 0.22, 0.4 + m.prognathism * 0.25);
  jaw.position.set(0, -0.72, 0.35 + m.prognathism * 0.2 + m.chin * 0.12);
  g.add(jaw);

  const chin = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), bone);
  chin.scale.set(1 + m.chin, 0.8 + m.chin, 1.4);
  chin.position.set(0, -0.82, 0.55 + m.chin * 0.25);
  chin.visible = m.chin > 0.2;
  g.add(chin);

  const nuchal = new THREE.Mesh(new THREE.SphereGeometry(0.35, 20, 16), bone);
  nuchal.scale.set(1.1, 0.6, 0.8 + m.nuchal);
  nuchal.position.set(0, -0.15, -0.85 * cap - m.nuchal * 0.15);
  g.add(nuchal);

  const orbitL = new THREE.Mesh(new THREE.CircleGeometry(0.13, 20), dark);
  const orbitR = orbitL.clone();
  orbitL.position.set(-0.22, -0.05, 0.78 * cap);
  orbitR.position.set(0.22, -0.05, 0.78 * cap);
  g.add(orbitL, orbitR);

  return g;
}

export function Morphospace({
  a,
  b,
  blend,
  label,
}: {
  a: MorphParams;
  b?: MorphParams;
  blend?: number;
  label: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const morph = useMemo(
    () => (b ? lerpMorph(a, b, blend ?? 0) : a),
    [a, b, blend],
  );

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x14110e);
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 40);
    camera.position.set(2.4, 0.6, 3.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xfff1d6, 1.35);
    light.position.set(3, 4, 5);
    scene.add(light, new THREE.AmbientLight(0x6b5a48, 0.55));
    const fill = new THREE.DirectionalLight(0x88a0b8, 0.35);
    fill.position.set(-4, 1, -2);
    scene.add(fill);

    const skull = buildSkull(morph);
    scene.add(skull);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 0, 0);

    const resize = () => {
      const w = el.clientWidth || 320;
      const h = el.clientHeight || 240;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      controls.update();
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === el) {
        el.removeChild(renderer.domElement);
      }
    };
  }, [morph]);

  return (
    <div className="space-y-1">
      <div ref={host} className="h-64 w-full overflow-hidden rounded-md border border-stone-700" />
      <p className="text-[11px] text-stone-500">
        Schematic morphospace for {label}. Not a fossil scan. Drag to orbit.
        Vault, brow, prognathism, and chin are educational sliders encoded per taxon.
      </p>
    </div>
  );
}

export function MorphospaceKeyed({
  a,
  b,
  blend,
  label,
}: {
  a: MorphParams;
  b?: MorphParams;
  blend?: number;
  label: string;
}) {
  const key = JSON.stringify({ a, b, blend });
  return <Morphospace key={key} a={a} b={b} blend={blend} label={label} />;
}

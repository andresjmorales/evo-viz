"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { sites } from "@/data/fossils";
import { taxa } from "@/data/taxa";
import { isAlive } from "@/data/story";
import { taxonColor } from "@/lib/palette";

function paintEarth(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 512;
  const g = c.getContext("2d")!;
  g.fillStyle = "#c8e6d6";
  g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = "#1f8a4c";
  const land: [number, number][][] = [
    // North America
    [[150, 70], [250, 50], [300, 90], [280, 170], [220, 200], [170, 160], [140, 110]],
    // South America
    [[230, 220], [270, 230], [280, 320], [250, 400], [220, 360], [210, 260]],
    // Africa
    [[490, 190], [560, 180], [590, 250], [570, 340], [530, 390], [500, 350], [475, 250]],
    // Europe
    [[500, 90], [560, 70], [590, 110], [540, 140], [500, 130]],
    // Asia
    [[590, 80], [780, 70], [860, 120], [840, 190], [720, 200], [620, 170], [580, 130]],
    // India
    [[700, 200], [740, 210], [730, 260], [700, 240]],
    // Australia
    [[800, 310], [870, 300], [890, 350], [840, 380], [790, 350]],
    // Greenland
    [[320, 40], [370, 30], [380, 70], [330, 80]],
  ];
  for (const poly of land) {
    g.beginPath();
    poly.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
    g.closePath();
    g.fill();
  }
  return new THREE.CanvasTexture(c);
}

function latLonToVec(lat: number, lon: number, r: number): THREE.Vector3 {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

export function LivingGlobe({
  ka,
  focusTaxonId,
  compact = false,
}: {
  ka: number;
  focusTaxonId?: string | null;
  compact?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const kaRef = useRef(ka);
  const focusRef = useRef(focusTaxonId);

  useEffect(() => {
    kaRef.current = ka;
    focusRef.current = focusTaxonId;
  }, [ka, focusTaxonId]);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf3f7f2);
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 40);
    camera.position.set(0.4, 0.5, 3.1);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true });
      if (!renderer.getContext()) throw new Error("no webgl");
    } catch {
      el.innerHTML =
        '<p class="p-4 text-sm text-[var(--muted)]">Spin the story with the time slider. WebGL is off in this browser.</p>';
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 48),
      new THREE.MeshStandardMaterial({
        map: paintEarth(),
        roughness: 0.86,
        metalness: 0.02,
      }),
    );
    scene.add(earth);
    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const sun = new THREE.DirectionalLight(0xffffff, 0.65);
    sun.position.set(3, 2, 4);
    scene.add(sun);

    const dots = new THREE.Group();
    scene.add(dots);
    const markers = sites.map((site) => {
      const color = taxonColor(site.taxonIds[0] ?? "sapiens");
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.028, 10, 10),
        new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.2 }),
      );
      mesh.position.copy(latLonToVec(site.lat, site.lon, 1.02));
      mesh.userData = { site };
      dots.add(mesh);
      return mesh;
    });

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 2.1;
    controls.maxDistance = 4.2;

    const resize = () => {
      const w = el.clientWidth || 360;
      const h = el.clientHeight || 280;
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
      earth.rotation.y += 0.0012;
      const now = kaRef.current;
      const focus = focusRef.current;
      for (const mesh of markers) {
        const site = mesh.userData.site as (typeof sites)[number];
        const live = site.taxonIds.some((id) => {
          const t = taxa.find((x) => x.id === id);
          return t ? isAlive(t.rangeStartKa, t.rangeEndKa, now) : false;
        });
        const focused = focus ? site.taxonIds.includes(focus) : live;
        mesh.visible = live;
        mesh.scale.setScalar(focused ? 1.5 : 1);
      }
      controls.update();
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === el) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-3xl border border-[var(--line)] bg-white">
      <div
        ref={host}
        className={compact ? "h-[200px] w-full md:h-[240px]" : "h-[280px] w-full md:h-[340px]"}
      />
      <p className="px-4 pb-3 text-[11px] text-[var(--muted)]">
        Drag to spin. Dots appear when a site&apos;s species is alive on the
        slider. Continents are schematic.
      </p>
    </div>
  );
}

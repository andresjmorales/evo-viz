// Checks that dispersal routes stay on land.
//
// Every route in src/data/migrations.ts is sampled along its great-circle
// segments and tested against the Natural Earth land polygons. A segment may
// only cross water if its starting waypoint index is listed in the route's
// `sea` array (or the route is marked sea: "all").
//
// Run with: npm run check:routes
import { readFileSync } from "node:fs";
import { geoContains, geoDistance, geoInterpolate } from "d3-geo";
import { feature } from "topojson-client";

const MAX_WET_KM = 60; // tolerance for coarse coastlines, rivers and lagoons
const topo = JSON.parse(readFileSync(new URL("../public/geo/land-50m.json", import.meta.url), "utf8"));
const land = feature(topo, topo.objects.land);
const src = readFileSync(new URL("../src/data/migrations.ts", import.meta.url), "utf8");

let failures = 0;
for (const m of src.matchAll(/id: "([\w-]+)",[\s\S]*?path: \[([\s\S]*?)\n    \],([\s\S]*?)status:/g)) {
  const [, id, pathText, rest] = m;
  if (/sea: "all"/.test(rest)) continue;
  const sea = new Set((rest.match(/sea: \[([\d, ]*)\]/)?.[1] ?? "").split(",").filter(Boolean).map(Number));
  const pts = [...pathText.matchAll(/\[(-?[\d.]+), (-?[\d.]+)\]/g)].map((p) => [Number(p[2]), Number(p[1])]);
  for (let i = 0; i < pts.length - 1; i++) {
    if (sea.has(i)) continue;
    const km = geoDistance(pts[i], pts[i + 1]) * 6371;
    const n = Math.max(4, Math.ceil(km / 15));
    const at = geoInterpolate(pts[i], pts[i + 1]);
    let wet = 0;
    for (let k = 0; k <= n; k++) if (!geoContains(land, at(k / n))) wet++;
    const wetKm = (wet / (n + 1)) * km;
    if (wetKm > MAX_WET_KM) {
      failures++;
      const f = (p) => `[${p[1]}, ${p[0]}]`;
      console.log(`${id}: segment ${i} ${f(pts[i])} -> ${f(pts[i + 1])} crosses about ${Math.round(wetKm)} km of water`);
    }
  }
}
if (failures) {
  console.log(`\n${failures} segment(s) leave the land. Add waypoints, or list the segment's start index in "sea".`);
  process.exit(1);
}
console.log("All routes stay on land outside their marked crossings.");

"use client";

import { migrationsForTaxon, sitesForTaxon } from "@/data/catalog";
import { siteById } from "@/data/fossils";
import type { Taxon } from "@/data/types";
import { StatusBadge } from "./StatusBadge";

const W = 1000;
const H = 420;

function project(lat: number, lon: number): [number, number] {
  const x = ((lon + 180) / 360) * W;
  const y = ((75 - lat) / 130) * H;
  return [x, y];
}

const LAND: { d: string; name: string }[] = [
  {
    name: "Americas",
    d: "M168 70c20 8 28 30 32 58 6 36-8 70-6 108 2 28 18 48 14 78-6 22-28 28-48 22-22-8-38-38-42-70-6-48 4-88 8-128 2-22 18-48 42-68z",
  },
  {
    name: "Africa",
    d: "M470 168c28-8 52 4 62 28 12 28 8 58 18 88 8 22-2 48-22 58-24 12-48 2-62-18-18-26-28-58-32-92-2-28 8-52 36-64z",
  },
  {
    name: "Eurasia",
    d: "M468 78c40-18 90-22 140-12 48 10 92 8 130 28 28 14 48 38 44 64-6 22-32 28-58 24-30-4-48 12-78 8-28-4-58-18-88-16-32 2-52-18-72-32-16-12-22-32-18-64z",
  },
  {
    name: "Australia",
    d: "M780 268c28-4 48 10 52 28 4 18-8 32-28 36-22 4-42-8-48-24-4-16 6-36 24-40z",
  },
];

export function MigrationMap({
  taxon,
  activeTheories,
}: {
  taxon: Taxon | null;
  activeTheories: string[];
}) {
  const sites = taxon ? sitesForTaxon(taxon.id) : [];
  const moves = taxon ? migrationsForTaxon(taxon.id) : [];
  const swamidass = activeTheories.includes("swamidass");
  const [lx, ly] = project(32.5, 35.5);

  return (
    <div className="flex h-[220px] border-t border-stone-800 bg-[#0c1214] md:h-[260px]">
      <div className="relative min-w-0 flex-1">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img">
          <title>Fossil sites and inferred movements</title>
          <rect width={W} height={H} fill="#0c1214" />
          {LAND.map((land) => (
            <path
              key={land.name}
              d={land.d}
              fill="#1b2420"
              stroke="#2a3a32"
              strokeWidth="1.2"
            />
          ))}
          {moves.map((m) => {
            const from = siteById[m.fromSiteId];
            const to = siteById[m.toSiteId];
            if (!from || !to) return null;
            const pts = [project(from.lat, from.lon)];
            for (const [lat, lon] of m.via ?? []) pts.push(project(lat, lon));
            pts.push(project(to.lat, to.lon));
            return (
              <polyline
                key={m.id}
                points={pts.map((p) => p.join(",")).join(" ")}
                fill="none"
                stroke={taxon?.color ?? "#c4a574"}
                strokeWidth="2.2"
                strokeDasharray={m.status === "settled" || m.status === "strong" ? undefined : "6 4"}
                opacity="0.85"
              />
            );
          })}
          {sites.map((s) => {
            const [x, y] = project(s.lat, s.lon);
            return (
              <g key={s.id}>
                <circle cx={x} cy={y} r="5" fill={taxon?.color ?? "#e8dcc4"} />
                <text
                  x={x + 8}
                  y={y - 6}
                  fill="#d6c7a8"
                  fontSize="11"
                  className="hidden md:block"
                >
                  {s.name}
                </text>
              </g>
            );
          })}
          {swamidass ? (
            <g>
              <circle
                cx={lx}
                cy={ly}
                r="46"
                fill="#e0a85c22"
                stroke="#e0a85c"
                strokeDasharray="4 3"
              />
              <circle cx={lx} cy={ly} r="4" fill="#e0a85c" />
              <text x={lx + 10} y={ly - 10} fill="#e0a85c" fontSize="11">
                GAE wave (Near East)
              </text>
            </g>
          ) : null}
        </svg>
        <p className="pointer-events-none absolute bottom-1 left-2 text-[10px] text-stone-500">
          Schematic continents. Dots are fossil or genetic sites, not a complete atlas.
        </p>
      </div>
      <aside className="hidden w-72 shrink-0 overflow-auto border-l border-stone-800 p-3 text-xs text-stone-400 lg:block">
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500">
          {taxon ? `${taxon.name} on the map` : "Select a species"}
        </div>
        {taxon && moves.length === 0 && sites.length === 0 ? (
          <p className="mt-2">No plotted sites for this taxon yet.</p>
        ) : null}
        {moves.map((m) => (
          <div key={m.id} className="mt-2 border-b border-stone-800/80 pb-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-stone-200">{m.label}</span>
              <StatusBadge status={m.status} />
            </div>
            <p className="mt-1 leading-relaxed">{m.notes}</p>
          </div>
        ))}
        {sites.map((s) => (
          <div key={s.id} className="mt-1 text-stone-500">
            {s.name}
          </div>
        ))}
      </aside>
    </div>
  );
}

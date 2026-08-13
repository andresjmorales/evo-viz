const POINTS = [
  { id: "afarensis", label: "afarensis", ka: 3200, cc: 450 },
  { id: "habilis", label: "habilis", ka: 1800, cc: 600 },
  { id: "erectus", label: "erectus", ka: 1000, cc: 950 },
  { id: "heidelbergensis", label: "heidelberg.", ka: 400, cc: 1250 },
  { id: "neanderthal", label: "Neanderthal", ka: 80, cc: 1450 },
  { id: "sapiens", label: "sapiens", ka: 20, cc: 1350 },
];

export function BrainChart({ highlight }: { highlight?: string }) {
  const w = 420;
  const h = 180;
  const pad = { l: 36, r: 12, t: 16, b: 28 };
  const xs = POINTS.map((p) => Math.log10(p.ka + 10));
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const x = (ka: number) =>
    pad.l +
    ((Math.log10(ka + 10) - minX) / (maxX - minX)) * (w - pad.l - pad.r);
  const y = (cc: number) =>
    pad.t + (1 - (cc - 350) / (1500 - 350)) * (h - pad.t - pad.b);
  const d = POINTS.map((p, i) => `${i === 0 ? "M" : "L"} ${x(p.ka)} ${y(p.cc)}`).join(
    " ",
  );

  return (
    <figure className="rounded-2xl border border-[var(--line)] bg-white p-3">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-44 w-full">
        <path d={d} fill="none" stroke="#1f7a4d" strokeWidth="2.4" />
        {POINTS.map((p) => (
          <g key={p.id}>
            <circle
              cx={x(p.ka)}
              cy={y(p.cc)}
              r={highlight === p.id ? 6 : 4}
              fill={highlight === p.id ? "#0f4d32" : "#1f7a4d"}
            />
            <text
              x={x(p.ka)}
              y={y(p.cc) - 8}
              textAnchor="middle"
              fontSize="8"
              fill="#163226"
            >
              {p.label}
            </text>
          </g>
        ))}
        <text x="4" y="14" fontSize="8" fill="#4a6656">
          cc
        </text>
        <text x={w - 28} y={h - 6} fontSize="8" fill="#4a6656">
          now
        </text>
      </svg>
      <figcaption className="px-1 text-[11px] leading-snug text-[var(--muted)]">
        Typical cranial capacity, not a ladder. Neanderthals often sit above
        living sapiens. Brains got larger, then the face got smaller.
      </figcaption>
    </figure>
  );
}

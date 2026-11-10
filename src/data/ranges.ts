import { sites } from "./fossils";
import { migrations } from "./migrations";
import { taxa } from "./taxa";

/**
 * A rough "known range" for each species, drawn on the globe as a soft glow.
 *
 * Nobody knows the true range of an extinct species: fossils only form and
 * survive in a few kinds of place. So the glow is built from what is dated:
 * a patch around every fossil site, patches along each dispersal route as the
 * route reaches them, and a few hand-placed patches for regions with many
 * sites that this project does not list one by one. A patch is bright while
 * its evidence is dated to that moment and fades to a faint trace afterwards,
 * for as long as the species survives anywhere.
 *
 * Read it as "this species is known from about here", not as a border.
 */
export interface RangePatch {
  taxonId: string;
  lat: number;
  lon: number;
  /** Radius in degrees of arc. */
  r: number;
  /** Dated evidence for this patch runs from `fromKa` to `toKa`. */
  fromKa: number;
  toKa: number;
}

/** Shown for the ape population both chimpanzees and humans descend from. */
export const APE_ANCESTOR = "ape-ancestor";
export const APE_ANCESTOR_UNTIL_KA = 5600;

const endOf = Object.fromEntries(taxa.map((t) => [t.id, t.rangeEndKa]));
const startOf = Object.fromEntries(taxa.map((t) => [t.id, t.rangeStartKa]));

const EXTRA: RangePatch[] = [
  // Neanderthal heartland: hundreds of sites across Europe and western Asia.
  ...(
    [
      [40, -4], [45, 1.5], [50, 5], [43, 12], [45, 19], [49, 15], [45, 34], [41, 44], [33, 36], [39, 67],
    ] as [number, number][]
  ).map(([lat, lon]) => ({ taxonId: "neanderthal", lat, lon, r: 5.5, fromKa: 250, toKa: 42 })),
  // Homo erectus across eastern and southern Africa.
  ...(
    [
      [4, 36], [-3, 35.5], [10.5, 40.5], [-26, 27.7], [-14, 31],
    ] as [number, number][]
  ).map(([lat, lon]) => ({ taxonId: "erectus", lat, lon, r: 5.5, fromKa: 1900, toKa: 900 })),
  // Early Homo sapiens across Africa (see the "pan-African origin" question).
  ...(
    [
      [31, -7], [8, 38], [-2, 36], [-26, 28], [-33, 21], [12, 8], [-12, 28],
    ] as [number, number][]
  ).map(([lat, lon]) => ({ taxonId: "sapiens", lat, lon, r: 6, fromKa: 300, toKa: 0 })),
  // The African apes our lineage split from. No fossil of this population is known.
  ...(
    [
      [14, 18], [6, 22], [2, 32], [-4, 27], [8, 38], [9, 8],
    ] as [number, number][]
  ).map(([lat, lon]) => ({ taxonId: APE_ANCESTOR, lat, lon, r: 8, fromKa: 9000, toKa: 6400 })),
];

function build(): RangePatch[] {
  const out: RangePatch[] = [...EXTRA];
  for (const s of sites) {
    for (const id of s.taxonIds) {
      const from = Math.min(s.ka[0], startOf[id] ?? s.ka[0]);
      const to = Math.max(s.ka[1], endOf[id] ?? s.ka[1]);
      if (from <= to) continue;
      out.push({ taxonId: id, lat: s.lat, lon: s.lon, r: 6, fromKa: from, toKa: to });
    }
  }
  for (const m of migrations) {
    const n = m.path.length;
    m.path.forEach(([lat, lon], i) => {
      const reached = m.startKa - (i / Math.max(1, n - 1)) * (m.startKa - m.endKa);
      out.push({ taxonId: m.taxonId, lat, lon, r: 5, fromKa: reached, toKa: Math.min(reached, m.endKa) });
    });
  }
  return out;
}

export const RANGE_PATCHES = build();

/**
 * How strongly to draw a patch at a moment: 0 before its evidence starts,
 * 1 while dated evidence is current, a faint trace afterwards until the
 * species is gone. `grow` (0..1) is how far the patch has spread.
 */
export function patchState(p: RangePatch, ka: number): { strength: number; grow: number } {
  if (ka > p.fromKa) return { strength: 0, grow: 0 };
  const grow = Math.min(1, (p.fromKa - ka) / (p.fromKa * 0.03 + 2));
  const end = p.taxonId === APE_ANCESTOR ? APE_ANCESTOR_UNTIL_KA : (endOf[p.taxonId] ?? 0);
  if (ka < end) {
    const gone = Math.max(0, 1 - (end - ka) / (end * 0.04 + 2));
    return { strength: 0.4 * gone, grow: 1 };
  }
  if (ka >= p.toKa) return { strength: grow, grow };
  // after the dated evidence here: settle to a faint trace
  const settle = Math.min(1, (p.toKa - ka) / (p.toKa * 0.08 + 4));
  return { strength: 1 - 0.55 * settle, grow: 1 };
}

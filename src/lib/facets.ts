/**
 * Geometry for drawing knapped stone: an outline is broken into flake scars
 * that run from the edge toward a central ridge, each shaded by which way it
 * faces. Used by the tool drawings and the knapping animation.
 */
export type Pt = [number, number];

export interface Facet {
  d: string;
  fill: string;
}

const LIGHT: Pt = [-0.55, -0.83]; // from the upper left

/** Deterministic 0..1 noise from an integer. */
export function hash(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function closestOnSpine(p: Pt, spine: Pt[]): Pt {
  if (spine.length === 1) return spine[0];
  let best: Pt = spine[0];
  let bd = Infinity;
  for (let i = 0; i < spine.length - 1; i++) {
    const [ax, ay] = spine[i];
    const [bx, by] = spine[i + 1];
    const vx = bx - ax;
    const vy = by - ay;
    const t = Math.min(1, Math.max(0, ((p[0] - ax) * vx + (p[1] - ay) * vy) / (vx * vx + vy * vy || 1)));
    const q: Pt = [ax + vx * t, ay + vy * t];
    const d = (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2;
    if (d < bd) {
      bd = d;
      best = q;
    }
  }
  return best;
}

export function polyPath(pts: Pt[]): string {
  return pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ") + " Z";
}

export function centroid(pts: Pt[]): Pt {
  let x = 0;
  let y = 0;
  for (const p of pts) {
    x += p[0];
    y += p[1];
  }
  return [x / pts.length, y / pts.length];
}

export interface StoneTone {
  /** hue, saturation %, lightness % of the fresh stone */
  h: number;
  s: number;
  l: number;
}

export const FLINT: StoneTone = { h: 205, s: 9, l: 52 };
export const BASALT: StoneTone = { h: 215, s: 7, l: 40 };
export const QUARTZITE: StoneTone = { h: 32, s: 16, l: 56 };
export const OCHRE: StoneTone = { h: 12, s: 62, l: 44 };
export const OBSIDIAN: StoneTone = { h: 220, s: 10, l: 26 };

export function tone({ h, s, l }: StoneTone, dl = 0): string {
  return `hsl(${h} ${s}% ${Math.min(92, Math.max(8, l + dl)).toFixed(1)}%)`;
}

/**
 * Flake scars for the edges of `outline`. `knapped[i]` says whether the edge
 * from vertex i to i+1 has been flaked (default: all). Long edges are split
 * into several scars of uneven depth.
 */
export function stoneFacets(
  outline: Pt[],
  spine: Pt[],
  stone: StoneTone,
  opts: { knapped?: boolean[]; scar?: number; depth?: number; seed?: number } = {},
): Facet[] {
  const { knapped, scar = 22, depth = 0.72, seed = 1 } = opts;
  const c = centroid(outline);
  const out: Facet[] = [];
  const n = outline.length;
  for (let i = 0; i < n; i++) {
    if (knapped && !knapped[i]) continue;
    const a = outline[i];
    const b = outline[(i + 1) % n];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (len < 1.5) continue;
    // outward normal
    let nx = (b[1] - a[1]) / len;
    let ny = -(b[0] - a[0]) / len;
    const mx = (a[0] + b[0]) / 2;
    const my = (a[1] + b[1]) / 2;
    if (nx * (mx - c[0]) + ny * (my - c[1]) < 0) {
      nx = -nx;
      ny = -ny;
    }
    const parts = Math.max(1, Math.round(len / scar));
    for (let k = 0; k < parts; k++) {
      const id = seed * 131 + Math.round(mx * 7 + my * 13) + k * 17;
      const t0 = k / parts;
      const t1 = (k + 1) / parts;
      const p0: Pt = [a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0];
      const p1: Pt = [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1];
      const pm: Pt = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
      const s = closestOnSpine(pm, spine);
      const dep = depth * (0.62 + 0.38 * hash(id));
      const tip: Pt = [pm[0] + (s[0] - pm[0]) * dep, pm[1] + (s[1] - pm[1]) * dep];
      // a rounded scar: the edge, then a curve through the tip
      const d = `M${p0[0].toFixed(1)} ${p0[1].toFixed(1)} L${p1[0].toFixed(1)} ${p1[1].toFixed(1)} Q${(p1[0] + (tip[0] - pm[0]) * 0.9).toFixed(1)} ${(p1[1] + (tip[1] - pm[1]) * 0.9).toFixed(1)} ${tip[0].toFixed(1)} ${tip[1].toFixed(1)} Q${(p0[0] + (tip[0] - pm[0]) * 0.9).toFixed(1)} ${(p0[1] + (tip[1] - pm[1]) * 0.9).toFixed(1)} ${p0[0].toFixed(1)} ${p0[1].toFixed(1)} Z`;
      const lit = nx * LIGHT[0] + ny * LIGHT[1];
      out.push({ d, fill: tone(stone, lit * 15 + (hash(id + 5) - 0.5) * 9) });
    }
  }
  return out;
}

/** Keep the part of a polygon on the inner side of the line a→b (the side `inside` is on). */
export function clipPoly(
  poly: Pt[],
  flags: boolean[],
  a: Pt,
  b: Pt,
  inside: Pt,
  keepInner = true,
): { poly: Pt[]; flags: boolean[]; chord: [Pt, Pt] | null } {
  const side = (p: Pt) => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
  const sgn = (Math.sign(side(inside)) || 1) * (keepInner ? 1 : -1);
  const isIn = (p: Pt) => side(p) * sgn >= 0;
  const cut = (p: Pt, q: Pt): Pt => {
    const sp = side(p);
    const sq = side(q);
    const t = sp / (sp - sq);
    return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  };
  const outP: Pt[] = [];
  const outF: boolean[] = [];
  const hits: Pt[] = [];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    const f = flags[i];
    const pin = isIn(p);
    const qin = isIn(q);
    if (pin && qin) {
      outP.push(p);
      outF.push(f);
    } else if (pin && !qin) {
      const x = cut(p, q);
      outP.push(p, x);
      outF.push(f, true);
      hits.push(x);
    } else if (!pin && qin) {
      const x = cut(p, q);
      outP.push(x);
      outF.push(f);
      hits.push(x);
    }
  }
  return { poly: outP, flags: outF, chord: hits.length >= 2 ? [hits[0], hits[1]] : null };
}

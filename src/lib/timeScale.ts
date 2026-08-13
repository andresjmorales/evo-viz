/** Piecewise time axis: older time is compressed so the last 300 ka is readable. */

const SEGMENTS = [
  { fromKa: 7200, toKa: 2000, weight: 0.2 },
  { fromKa: 2000, toKa: 400, weight: 0.26 },
  { fromKa: 400, toKa: 50, weight: 0.24 },
  { fromKa: 50, toKa: 0, weight: 0.3 },
] as const;

export const TIME_MIN_KA = 0;
export const TIME_MAX_KA = 7200;
export const TIMELINE_WIDTH = 2800;

export function kaToX(ka: number, width = TIMELINE_WIDTH): number {
  const clamped = Math.min(TIME_MAX_KA, Math.max(TIME_MIN_KA, ka));
  let acc = 0;
  for (const seg of SEGMENTS) {
    const span = seg.fromKa - seg.toKa;
    if (clamped <= seg.fromKa && clamped >= seg.toKa) {
      const t = (seg.fromKa - clamped) / span;
      return (acc + t * seg.weight) * width;
    }
    acc += seg.weight;
  }
  return width;
}

export function xToKa(x: number, width = TIMELINE_WIDTH): number {
  const t = Math.min(1, Math.max(0, x / width));
  let acc = 0;
  for (const seg of SEGMENTS) {
    const next = acc + seg.weight;
    if (t <= next || next >= 0.999) {
      const local = (t - acc) / seg.weight;
      return seg.fromKa - local * (seg.fromKa - seg.toKa);
    }
    acc = next;
  }
  return 0;
}

export const AXIS_TICKS_KA = [
  7000, 6000, 5000, 4000, 3000, 2000, 1500, 1000, 700, 500, 300, 200, 100, 50,
  20, 10, 5, 0,
];

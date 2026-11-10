import data from "@/data/climate.json";

/**
 * Global climate through time.
 *
 * `d18o` is the LR04 benthic oxygen-isotope stack (Lisiecki & Raymo 2005):
 * higher values mean more ice and colder deep water. `sea` is global sea
 * level in metres relative to today: the Spratt & Lisiecki (2016) stack back
 * to 798 ka, and before that a linear scaling of LR04 fitted to the stack
 * (a rough guide only). Nothing is available before 5.32 Ma.
 */
const D18O = data.d18o as [number, number][];
const SEA = data.sea as [number, number][];

function interp(series: [number, number][], ka: number): number | null {
  if (ka < series[0][0] || ka > series[series.length - 1][0]) return null;
  let lo = 0;
  let hi = series.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (series[mid][0] <= ka) lo = mid;
    else hi = mid;
  }
  const [t0, v0] = series[lo];
  const [t1, v1] = series[hi];
  return t1 === t0 ? v0 : v0 + ((v1 - v0) * (ka - t0)) / (t1 - t0);
}

/** Sea level in metres relative to today (negative = lower). */
export function seaLevel(ka: number): number {
  return interp(SEA, ka) ?? 0;
}

/** Benthic δ18O in per mil, or null outside the record. */
export function d18o(ka: number): number | null {
  return interp(D18O, ka);
}

export const CLIMATE_START_KA = D18O[D18O.length - 1][0];
export const D18O_SERIES = D18O;
export const SEA_SERIES = SEA;
/** How far back the sea-level figures rest on direct reconstructions. */
export const SEA_MEASURED_TO_KA = 798;

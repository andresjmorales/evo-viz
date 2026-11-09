/**
 * Full-body silhouettes from PhyloPic (phylopic.org). All are public domain
 * (CC0 or Public Domain Mark). They are life restorations, so soft tissue,
 * hair and posture are informed guesses.
 */
export interface Figure {
  src: string;
  /** width / height of the artwork */
  aspect: number;
  /** Set when the drawing is of a close relative rather than this taxon. */
  proxyFor?: string;
  credit: string;
}

const K = "T. Michael Keesey, PhyloPic, public domain";

const F: Record<string, Figure> = {
  ardipithecus: { src: "/figures/ardipithecus.svg", aspect: 727 / 1536, credit: K },
  anamensis: { src: "/figures/anamensis.svg", aspect: 439 / 1536, credit: K },
  afarensis: { src: "/figures/afarensis.svg", aspect: 906 / 1536, credit: K },
  africanus: { src: "/figures/africanus.svg", aspect: 476 / 1536, credit: K },
  sediba: { src: "/figures/sediba.svg", aspect: 856 / 1536, credit: K },
  boisei: { src: "/figures/boisei.svg", aspect: 366 / 1536, credit: K },
  robustus: { src: "/figures/robustus.svg", aspect: 506 / 1536, credit: K },
  habilis: { src: "/figures/habilis.svg", aspect: 875 / 1536, credit: K },
  rudolfensis: { src: "/figures/rudolfensis.svg", aspect: 869 / 1536, credit: K },
  erectus: { src: "/figures/erectus.svg", aspect: 750 / 1536, credit: K },
  floresiensis: { src: "/figures/floresiensis.svg", aspect: 707 / 1536, credit: K },
  naledi: { src: "/figures/naledi.svg", aspect: 991 / 1536, credit: K },
  antecessor: { src: "/figures/antecessor.svg", aspect: 353 / 1536, credit: K },
  heidelbergensis: { src: "/figures/heidelbergensis.svg", aspect: 519 / 1536, credit: K },
  neanderthal: { src: "/figures/neanderthal.svg", aspect: 620 / 1536, credit: K },
  longi: { src: "/figures/longi.svg", aspect: 817 / 1536, credit: "PhyloPic, CC0" },
  sapiens: { src: "/figures/sapiens.svg", aspect: 560 / 1536, credit: K },
};

const PROXY: Record<string, string> = {
  sahelanthropus: "ardipithecus",
  orrorin: "ardipithecus",
  denisovan: "longi",
};

export function figureFor(taxonId: string): Figure | undefined {
  if (F[taxonId]) return F[taxonId];
  const p = PROXY[taxonId];
  return p ? { ...F[p], proxyFor: p } : undefined;
}

/** Midpoint adult stature in cm, used to draw figures to a common scale. */
export const STATURE_CM: Record<string, number> = {
  sahelanthropus: 115,
  orrorin: 118,
  ardipithecus: 120,
  anamensis: 125,
  afarensis: 128,
  africanus: 127,
  sediba: 130,
  boisei: 130,
  robustus: 120,
  habilis: 130,
  rudolfensis: 150,
  erectus: 168,
  floresiensis: 106,
  naledi: 146,
  antecessor: 168,
  heidelbergensis: 170,
  neanderthal: 163,
  denisovan: 168,
  longi: 172,
  sapiens: 170,
};

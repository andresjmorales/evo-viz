export interface Silhouette {
  taxonId: string;
  src: string;
  credit: string;
  flip?: boolean;
}

export const SILHOUETTES: Silhouette[] = [
  {
    taxonId: "afarensis",
    src: "/silhouettes/lucy.svg",
    credit: "Original teaching drawing, evo-viz, CC0",
  },
  {
    taxonId: "erectus",
    src: "/silhouettes/erectus.svg",
    credit: "T. Michael Keesey, PhyloPic, CC0",
  },
  {
    taxonId: "neanderthal",
    src: "/silhouettes/neanderthal.svg",
    credit: "T. Michael Keesey, PhyloPic, CC0",
  },
  {
    taxonId: "sapiens",
    src: "/silhouettes/sapiens.svg",
    credit: "T. Michael Keesey, PhyloPic, CC0",
  },
];

const FALLBACK: Record<string, string> = {
  sahelanthropus: "afarensis",
  orrorin: "afarensis",
  ardipithecus: "afarensis",
  anamensis: "afarensis",
  boisei: "afarensis",
  robustus: "afarensis",
  africanus: "afarensis",
  sediba: "afarensis",
  habilis: "afarensis",
  rudolfensis: "afarensis",
  heidelbergensis: "neanderthal",
  antecessor: "erectus",
  floresiensis: "erectus",
  naledi: "erectus",
  denisovan: "neanderthal",
  longi: "neanderthal",
};

export function silhouetteFor(taxonId: string): Silhouette | undefined {
  const id = FALLBACK[taxonId] ?? taxonId;
  return SILHOUETTES.find((s) => s.taxonId === id);
}

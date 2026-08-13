import type { Taxon } from "@/data/types";

/** One green-family scale so the atlas does not look like a bag of earth tones. */
const COLORS: Record<string, string> = {
  sahelanthropus: "#7aa35a",
  orrorin: "#6f9b52",
  ardipithecus: "#5f9248",
  anamensis: "#3f8f5a",
  afarensis: "#2f9e5d",
  africanus: "#24965a",
  sediba: "#1d8a52",
  boisei: "#2f6b48",
  robustus: "#3a7a52",
  habilis: "#1aa37a",
  rudolfensis: "#12967a",
  erectus: "#0d8a6a",
  flox: "#14856a",
  floresiensis: "#1b7d62",
  naledi: "#157a58",
  antecessor: "#1f8f7a",
  heidelbergensis: "#16806c",
  neanderthal: "#1d6b8a",
  denisovan: "#2a8a7a",
  longi: "#3a9a82",
  sapiens: "#157a3f",
};

export function taxonColor(taxon: Taxon | string): string {
  const id = typeof taxon === "string" ? taxon : taxon.id;
  if (COLORS[id]) return COLORS[id];
  return typeof taxon === "string" ? "#157a3f" : taxon.color;
}

export const GREEN = {
  ink: "#163226",
  deep: "#0f4d32",
  mid: "#1f7a4d",
  bright: "#22a05a",
  soft: "#e7f5ec",
  line: "#cfe0d4",
  paper: "#ffffff",
  page: "#f3f7f2",
};

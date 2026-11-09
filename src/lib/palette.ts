import { taxa } from "@/data/taxa";
import type { Status } from "@/data/types";

/**
 * One hue per lineage. `ink` is for white backgrounds, `glow` for the dark
 * globe. Green is reserved for the brand and for our own species.
 */
export const LANE_COLORS: { ink: string; glow: string; soft: string }[] = [
  { ink: "#6f7c90", glow: "#c2cee0", soft: "#eef1f5" }, // stem hominins
  { ink: "#c58a09", glow: "#ffd166", soft: "#fdf4dc" }, // Australopithecus
  { ink: "#9a5a2e", glow: "#f0a878", soft: "#f8ebe1" }, // Paranthropus
  { ink: "#e2562d", glow: "#ff9370", soft: "#fde9e2" }, // early Homo
  { ink: "#cf3d88", glow: "#ff86c3", soft: "#fbe6f1" }, // erectus grade
  { ink: "#8556d6", glow: "#c6a6ff", soft: "#efe8fb" }, // Middle Pleistocene
  { ink: "#2a78e4", glow: "#86b9ff", soft: "#e4eefc" }, // Neanderthals
  { ink: "#0b9aa8", glow: "#62e4ee", soft: "#def5f7" }, // Denisovans
  { ink: "#0c9a56", glow: "#caff70", soft: "#e2f6ea" }, // sapiens
];

const laneOf: Record<string, number> = Object.fromEntries(
  taxa.map((t) => [t.id, t.lane]),
);

export function taxonColor(id: string): string {
  return LANE_COLORS[laneOf[id] ?? 8].ink;
}
export function taxonGlow(id: string): string {
  return LANE_COLORS[laneOf[id] ?? 8].glow;
}
export function taxonSoft(id: string): string {
  return LANE_COLORS[laneOf[id] ?? 8].soft;
}

export const STATUS_COLOR: Record<Status, { fg: string; bg: string; dot: string }> = {
  settled: { fg: "#0a6b3c", bg: "#e2f6ea", dot: "#0c9a56" },
  strong: { fg: "#1f6f73", bg: "#e0f3f2", dot: "#17a398" },
  contested: { fg: "#8a5a00", bg: "#fdf1d3", dot: "#e0a200" },
  shaky: { fg: "#a2441a", bg: "#fde8dc", dot: "#e8703a" },
  speculative: { fg: "#6a45b8", bg: "#efe8fb", dot: "#8f65e0" },
};

export const THEORY_COLOR: Record<string, string> = {
  consensus: "#0c9a56",
  swamidass: "#e0a200",
  craig: "#2a78e4",
  kemp: "#cf3d88",
  alexander: "#0b9aa8",
  walton: "#8556d6",
  biologos: "#e2562d",
};

import type { Status } from "@/data/types";

export function formatKa(ka: number): string {
  if (ka >= 1000) {
    const ma = ka / 1000;
    return Number.isInteger(ma) ? `${ma} Ma` : `${ma.toFixed(1)} Ma`;
  }
  if (ka >= 1) return `${Math.round(ka)} ka`;
  if (ka > 0) return `${Math.round(ka * 1000)} years ago`;
  return "present";
}

export function formatRange(startKa: number, endKa: number): string {
  if (endKa === 0) return `${formatKa(startKa)} – present`;
  return `${formatKa(startKa)} – ${formatKa(endKa)}`;
}

export const STATUS_LABEL: Record<Status, string> = {
  settled: "Settled",
  strong: "Strong",
  contested: "Contested",
  shaky: "Shaky",
  speculative: "Speculative",
};

export const STATUS_BLURB: Record<Status, string> = {
  settled:
    "Multiple independent lines of evidence, broad specialist agreement.",
  strong:
    "Well supported, though some details or wording remain under discussion.",
  contested: "Active scientific debate with more than one live model.",
  shaky: "Limited fossils, dates, or samples; alternatives remain easy to hold.",
  speculative:
    "A hypothesis with little direct evidence, offered as a reading rather than a finding.",
};

export function commonsFileUrl(filename: string, width = 800): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=${width}`;
}

export function sketchfabEmbed(modelId: string): string {
  return `https://sketchfab.com/models/${modelId}/embed?autostart=0&ui_theme=dark&ui_infos=0&ui_watermark_link=0`;
}

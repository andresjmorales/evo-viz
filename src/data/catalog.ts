import { claims } from "./claims";
import { fossils } from "./fossils";
import { migrations } from "./migrations";
import { sites } from "./fossils";
import { sources } from "./sources";
import { taxa } from "./taxa";
import { theories } from "./theories";
import type { Claim, Fossil, Migration, Site, Source, Taxon, Theory } from "./types";

export function getTaxon(id: string): Taxon | undefined {
  return taxa.find((t) => t.id === id);
}

export function getClaim(id: string): Claim | undefined {
  return claims.find((c) => c.id === id);
}

export function getTheory(id: string): Theory | undefined {
  return theories.find((t) => t.id === id);
}

export function getFossil(id: string): Fossil | undefined {
  return fossils.find((f) => f.id === id);
}

export function getSource(id: string): Source | undefined {
  return sources.find((s) => s.id === id);
}

export function getSite(id: string): Site | undefined {
  return sites.find((s) => s.id === id);
}

export function fossilsForTaxon(taxonId: string): Fossil[] {
  return fossils.filter((f) => f.taxonId === taxonId);
}

export function migrationsForTaxon(taxonId: string): Migration[] {
  return migrations.filter((m) => m.taxonId === taxonId);
}

export function claimsForTaxon(taxonId: string): Claim[] {
  return claims.filter((c) => c.taxonIds?.includes(taxonId));
}

export function sitesForTaxon(taxonId: string): Site[] {
  return sites.filter((s) => s.taxonIds.includes(taxonId));
}

export function searchAll(query: string): {
  taxa: Taxon[];
  claims: Claim[];
  theories: Theory[];
  fossils: Fossil[];
} {
  const q = query.trim().toLowerCase();
  if (q.length < 2) {
    return { taxa: [], claims: [], theories: [], fossils: [] };
  }
  const hit = (text: string) => text.toLowerCase().includes(q);
  return {
    taxa: taxa.filter(
      (t) =>
        hit(t.name) ||
        hit(t.summary) ||
        hit(t.nickname ?? "") ||
        hit(t.commonName ?? ""),
    ),
    claims: claims.filter((c) => hit(c.question) || hit(c.summary)),
    theories: theories.filter(
      (t) => hit(t.name) || hit(t.author) || hit(t.summary),
    ),
    fossils: fossils.filter(
      (f) => hit(f.name) || hit(f.site) || hit(f.notes) || hit(f.specimen ?? ""),
    ),
  };
}

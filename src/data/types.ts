export type Status =
  | "settled"
  | "strong"
  | "contested"
  | "shaky"
  | "speculative";

export type SourceKind =
  | "paper"
  | "review"
  | "book"
  | "video"
  | "museum"
  | "database"
  | "essay";

export interface Source {
  id: string;
  title: string;
  authors?: string;
  year?: number;
  kind: SourceKind;
  url: string;
  note?: string;
}

export interface MorphParams {
  vault: number;
  brow: number;
  prognathism: number;
  faceWidth: number;
  nuchal: number;
  chin: number;
  capacity: number;
}

export interface Claim {
  id: string;
  question: string;
  summary: string;
  status: Status;
  statusRationale: string;
  taxonIds?: string[];
  sourceIds: string[];
  relatedClaimIds?: string[];
  featured?: boolean;
}

export interface Taxon {
  id: string;
  name: string;
  commonName?: string;
  nickname?: string;
  rangeStartKa: number;
  rangeEndKa: number;
  rangeStartUncertain?: boolean;
  rangeEndUncertain?: boolean;
  lane: number;
  color: string;
  parentId?: string;
  cranialCapacityCc?: [number, number];
  heightCm?: [number, number];
  sites: string[];
  regions: string[];
  summary: string;
  anatomy: string;
  behavior: string;
  discovery: string;
  claimIds: string[];
  fossilIds: string[];
  migrationIds: string[];
  morph: MorphParams;
}

export interface FossilImage {
  filename: string;
  credit: string;
  license: string;
}

export interface FossilViewer {
  type: "smithsonian" | "sketchfab";
  url?: string;
  modelId?: string;
  caption: string;
  credit: string;
}

export interface Fossil {
  id: string;
  taxonId: string;
  name: string;
  specimen?: string;
  site: string;
  region: string;
  ageKa: number;
  notes: string;
  image?: FossilImage;
  viewers: FossilViewer[];
}

export interface Site {
  id: string;
  name: string;
  lat: number;
  lon: number;
  taxonIds: string[];
}

export interface Migration {
  id: string;
  taxonId: string;
  label: string;
  startKa: number;
  endKa: number;
  fromSiteId: string;
  toSiteId: string;
  via?: [number, number][];
  status: Status;
  notes: string;
  sourceIds: string[];
}

export interface TheoryOverlay {
  startKa: number;
  endKa: number;
  taxonId?: string;
  region: string;
  label: string;
  kind: "pair" | "band" | "wave";
}

export interface Theory {
  id: string;
  name: string;
  author: string;
  year?: number;
  kind: "scientific" | "theistic-evolution" | "related";
  shortLabel: string;
  color: string;
  summary: string;
  howToRead: string;
  overlay?: TheoryOverlay;
  coversTaxonIds?: string[];
  genealogicalWave?: boolean;
  claims: string[];
  critiques: string[];
  sourceIds: string[];
  status: Status;
  statusRationale: string;
}

export interface Lane {
  id: number;
  label: string;
}

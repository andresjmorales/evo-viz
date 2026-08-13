"use client";

import { taxonColor } from "@/lib/palette";

const ALIAS: Record<string, string> = {
  sahelanthropus: "afarensis",
  orrorin: "afarensis",
  ardipithecus: "afarensis",
  anamensis: "afarensis",
  africanus: "afarensis",
  sediba: "afarensis",
  boisei: "afarensis",
  robustus: "afarensis",
  rudolfensis: "habilis",
  floresiensis: "erectus",
  naledi: "erectus",
  antecessor: "heidelbergensis",
  longi: "denisovan",
};

const FACE: Record<string, string> = {
  afarensis: "Tiny vault, a projecting muzzle, no chin. An ape brain on walking legs.",
  erectus: "Long low vault, a heavy brow shelf, receding forehead, almost no chin.",
  neanderthal: "Long vault, midface pushed forward, an occipital bun, still no chin.",
  sapiens: "High globular vault, a small tucked face, and a true chin.",
  heidelbergensis: "A large brain already, but still a thick continuous brow.",
  denisovan: "Wide face, large brain. Fossils are still scarce, so this is a sketch.",
  habilis: "A little more brain than an australopith, still a small projecting face.",
};

function profileId(id: string) {
  return ALIAS[id] ?? id;
}

/** Side-view teaching drawings. Face is to the left. Not scans. */
function Skull({ id, color, outline = false }: { id: string; color: string; outline?: boolean }) {
  const key = profileId(id);
  const fill = outline ? "none" : color;
  const stroke = outline ? color : "rgba(15,77,50,0.25)";
  const sw = outline ? 2.4 : 1;

  if (key === "sapiens") {
    return (
      <g fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round">
        <path d="M78 22c22-6 44 8 48 30 3 16-4 30-16 38-6 4-8 10-6 16 2 8 0 14-10 16-16 4-34 2-46-6-8-6-8-16-2-22 4-4 6-10 2-16-6-10-4-24 8-32 8-6 14-18 22-24z" />
        <path d="M52 78c-8 4-16 14-14 22 2 8 12 12 22 10 6-1 10-6 12-12" fill={outline ? "none" : color} />
        <circle cx="44" cy="72" r="3.2" fill={outline ? color : "#163226"} stroke="none" />
      </g>
    );
  }
  if (key === "neanderthal") {
    return (
      <g fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round">
        <path d="M86 28c24-2 42 16 40 36-1 12-8 20-4 28 4 8 2 16-10 20-18 6-40 8-56 2-10-4-12-14-6-20 4-4 4-10-2-16-8-10-6-22 6-30 10-8 20-18 32-20z" />
        <path d="M48 70c-6 2-18 8-20 16-2 10 8 16 20 16 8 0 14-4 18-10" />
        <path d="M118 48c8 4 12 12 10 18-6 2-12 0-16-6" />
        <circle cx="40" cy="74" r="3.2" fill={outline ? color : "#163226"} stroke="none" />
      </g>
    );
  }
  if (key === "erectus") {
    return (
      <g fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round">
        <path d="M84 36c22 0 38 14 36 32-1 10-6 16 0 24 4 8 0 16-12 18-18 4-40 4-56-4-8-4-10-14-4-20 4-4 2-10-4-16-8-10-4-22 10-28 10-4 20-8 30-6z" />
        <path d="M42 68c-10 6-20 12-18 22 2 8 14 12 26 8 8-2 12-8 14-14" />
        <rect x="38" y="62" width="28" height="6" rx="2" />
        <circle cx="36" cy="76" r="3" fill={outline ? color : "#163226"} stroke="none" />
      </g>
    );
  }
  if (key === "afarensis") {
    return (
      <g fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round">
        <path d="M90 48c16 2 24 16 20 28-2 8-8 12-4 18 4 6-2 12-14 14-16 2-32 0-44-8-8-6-8-14-2-18 4-4 2-8-4-14-8-8-2-18 12-22 10-4 24-2 36 2z" />
        <path d="M40 78c-12 8-22 16-16 26 6 8 22 8 34 2 8-4 12-10 12-16" />
        <circle cx="34" cy="82" r="2.8" fill={outline ? color : "#163226"} stroke="none" />
      </g>
    );
  }
  if (key === "habilis") {
    return (
      <g fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round">
        <path d="M86 40c18 0 30 14 28 30-1 10-8 14-4 22 4 6-2 12-14 14-16 2-34 0-46-8-8-5-8-14-2-18 4-4 2-10-2-16-6-10-2-20 12-24 8-4 20-4 28 0z" />
        <path d="M44 74c-10 6-18 14-14 22 4 8 18 8 28 2" />
        <circle cx="38" cy="78" r="3" fill={outline ? color : "#163226"} stroke="none" />
      </g>
    );
  }
  if (key === "heidelbergensis") {
    return (
      <g fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round">
        <path d="M82 30c22-2 40 12 40 32 0 12-6 18-2 26 4 8 0 16-12 18-18 4-40 6-56-2-8-4-10-14-4-20 4-4 4-10-2-16-8-10-4-22 10-28 8-6 16-12 26-10z" />
        <rect x="40" y="60" width="30" height="7" rx="2" />
        <circle cx="38" cy="74" r="3" fill={outline ? color : "#163226"} stroke="none" />
      </g>
    );
  }
  return (
    <g fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round">
      <path d="M84 32c22 0 40 14 38 34-1 12-8 18-2 26 4 8 0 14-12 18-18 6-40 6-56-2-8-4-10-14-4-20 4-4 4-10-2-16-8-10-4-22 10-28 8-6 18-14 28-12z" />
      <circle cx="40" cy="74" r="3" fill={outline ? color : "#163226"} stroke="none" />
    </g>
  );
}

export function CranialProfile({
  taxonId,
  label,
  compareId,
}: {
  taxonId: string;
  label: string;
  compareId?: string | null;
}) {
  return (
    <div className="space-y-2">
      <svg viewBox="0 0 160 130" className="h-52 w-full rounded-2xl bg-[var(--green-soft)]">
        <text x="10" y="18" className="fill-[var(--muted)]" fontSize="9">
          face ←
        </text>
        <Skull id={taxonId} color={taxonColor(taxonId)} />
        {compareId ? <Skull id={compareId} color={taxonColor(compareId)} outline /> : null}
      </svg>
      <p className="text-[12px] leading-relaxed text-[var(--muted)]">
        <strong className="text-[var(--ink)]">Cranial profile</strong> of {label}
        {compareId ? ", with the second species as an outline" : ""}. A teaching
        drawing, not a fossil scan. {FACE[profileId(taxonId)] ?? ""}
      </p>
    </div>
  );
}

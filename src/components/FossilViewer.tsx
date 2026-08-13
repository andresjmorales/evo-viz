"use client";

import type { Fossil } from "@/data/types";
import { commonsFileUrl, sketchfabEmbed } from "@/lib/format";

export function FossilViewer({ fossil }: { fossil: Fossil }) {
  const sketch = fossil.viewers.find((v) => v.type === "sketchfab" && v.modelId);
  const smith = fossil.viewers.find((v) => v.type === "smithsonian" && v.url);

  return (
    <div className="space-y-3">
      {fossil.image ? (
        <figure className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--green-soft)]">
          {/* Wikimedia FilePath; license on the Commons file page */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={commonsFileUrl(fossil.image.filename, 900)}
            alt={fossil.name}
            className="max-h-64 w-full object-contain"
          />
          <figcaption className="px-2 py-1 text-[10px] text-[var(--muted)]">
            {fossil.image.credit} ({fossil.image.license})
          </figcaption>
        </figure>
      ) : null}

      {sketch?.modelId ? (
        <div>
          <iframe
            title={sketch.caption}
            src={sketchfabEmbed(sketch.modelId)}
            className="h-72 w-full rounded-2xl border border-[var(--line)] bg-[#111]"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            allowFullScreen
          />
          <p className="mt-1 text-[11px] leading-snug text-[var(--muted)]">
            {sketch.caption}. {sketch.credit} Drag to rotate.
          </p>
        </div>
      ) : null}

      {smith?.url ? (
        <a
          href={smith.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[12px] text-[var(--deep)] underline decoration-[var(--green)]/40 underline-offset-2 hover:decoration-[var(--green)]"
        >
          Open Smithsonian 3D viewer: {smith.caption}
        </a>
      ) : null}

      {!sketch && !fossil.image ? (
        <p className="text-sm text-[var(--muted)]">
          No public rotatable scan is bundled for this specimen. Use the
          cranial profile drawing, or follow museum links in Sources.
        </p>
      ) : null}
    </div>
  );
}

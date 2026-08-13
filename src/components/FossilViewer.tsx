"use client";

import type { Fossil } from "@/data/types";
import { commonsFileUrl, sketchfabEmbed } from "@/lib/format";

export function FossilViewer({ fossil }: { fossil: Fossil }) {
  const sketch = fossil.viewers.find((v) => v.type === "sketchfab" && v.modelId);
  const smith = fossil.viewers.find((v) => v.type === "smithsonian" && v.url);

  return (
    <div className="space-y-3">
      {fossil.image ? (
        <figure className="overflow-hidden rounded-md border border-stone-300 bg-stone-200">
          {/* Wikimedia FilePath; license on the Commons file page */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={commonsFileUrl(fossil.image.filename, 900)}
            alt={fossil.name}
            className="max-h-64 w-full object-contain"
          />
          <figcaption className="px-2 py-1 text-[10px] text-stone-600">
            {fossil.image.credit} ({fossil.image.license})
          </figcaption>
        </figure>
      ) : null}

      {sketch?.modelId ? (
        <div>
          <iframe
            title={sketch.caption}
            src={sketchfabEmbed(sketch.modelId)}
            className="h-72 w-full rounded-md border border-stone-700 bg-black"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            allowFullScreen
          />
          <p className="mt-1 text-[11px] leading-snug text-stone-500">
            {sketch.caption}. {sketch.credit} Drag to rotate.
          </p>
        </div>
      ) : null}

      {smith?.url ? (
        <a
          href={smith.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[12px] text-amber-800 underline decoration-amber-800/40 underline-offset-2 hover:decoration-amber-800"
        >
          Open Smithsonian 3D viewer: {smith.caption}
        </a>
      ) : null}

      {!sketch && !fossil.image ? (
        <p className="text-sm text-stone-600">
          No public rotatable scan is bundled for this specimen. Use the
          morphospace schematic, or follow museum links in Sources.
        </p>
      ) : null}
    </div>
  );
}

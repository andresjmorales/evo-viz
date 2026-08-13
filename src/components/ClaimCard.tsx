import { StatusBadge } from "./StatusBadge";
import type { Claim, Source } from "@/data/types";
import { getSource } from "@/data/catalog";

export function ClaimCard({
  claim,
  onOpen,
  compact = false,
}: {
  claim: Claim;
  onOpen?: (id: string) => void;
  compact?: boolean;
}) {
  const sources = claim.sourceIds
    .map((id) => getSource(id))
    .filter((s): s is Source => Boolean(s));

  return (
    <article className="rounded-md border border-stone-300 bg-[#f7f0e2] p-3 text-stone-800 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={() => onOpen?.(claim.id)}
          className="text-left font-serif text-[15px] leading-snug text-stone-900 hover:underline"
        >
          {claim.question}
        </button>
        <StatusBadge status={claim.status} />
      </div>
      {!compact ? (
        <p className="mt-2 text-[13px] leading-relaxed text-stone-700">
          {claim.summary}
        </p>
      ) : (
        <p className="mt-1 line-clamp-3 text-[12px] leading-relaxed text-stone-600">
          {claim.summary}
        </p>
      )}
      <p className="mt-2 text-[11px] italic text-stone-500">{claim.statusRationale}</p>
      <ol className="mt-2 space-y-0.5 text-[11px] text-stone-600">
        {sources.slice(0, compact ? 3 : 8).map((s, i) => (
          <li key={s.id}>
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-stone-400 underline-offset-2 hover:decoration-stone-700"
            >
              [{i + 1}] {s.authors ? `${s.authors}. ` : ""}
              {s.title}
              {s.year ? ` (${s.year})` : ""}
            </a>
          </li>
        ))}
      </ol>
    </article>
  );
}

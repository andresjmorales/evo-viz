import type { Status } from "@/data/types";
import { STATUS_BLURB, STATUS_LABEL } from "@/lib/format";

const TONE: Record<Status, string> = {
  settled: "bg-emerald-100 text-emerald-900 ring-emerald-300",
  strong: "bg-sky-100 text-sky-900 ring-sky-300",
  contested: "bg-amber-100 text-amber-900 ring-amber-300",
  shaky: "bg-orange-100 text-orange-900 ring-orange-300",
  speculative: "bg-violet-100 text-violet-900 ring-violet-300",
};

export function StatusBadge({
  status,
  showHint = false,
}: {
  status: Status;
  showHint?: boolean;
}) {
  return (
    <span className="inline-flex flex-col gap-1">
      <span
        className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ring-1 ${TONE[status]}`}
        title={STATUS_BLURB[status]}
      >
        {STATUS_LABEL[status]}
      </span>
      {showHint ? (
        <span className="max-w-prose text-[11px] leading-snug text-[var(--muted)]">
          {STATUS_BLURB[status]}
        </span>
      ) : null}
    </span>
  );
}

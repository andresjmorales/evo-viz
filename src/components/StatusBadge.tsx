import type { Status } from "@/data/types";
import { STATUS_BLURB, STATUS_LABEL } from "@/lib/format";

const TONE: Record<Status, string> = {
  settled: "bg-emerald-900/70 text-emerald-100 ring-emerald-700/80",
  strong: "bg-sky-900/70 text-sky-100 ring-sky-700/80",
  contested: "bg-amber-900/70 text-amber-100 ring-amber-700/80",
  shaky: "bg-orange-950/80 text-orange-100 ring-orange-800/80",
  speculative: "bg-fuchsia-950/70 text-fuchsia-100 ring-fuchsia-800/70",
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
        <span className="max-w-prose text-[11px] leading-snug text-stone-500">
          {STATUS_BLURB[status]}
        </span>
      ) : null}
    </span>
  );
}

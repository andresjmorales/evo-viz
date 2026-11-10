"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { getClaim } from "@/data/catalog";
import { migrations } from "@/data/migrations";
import { CHAPTERS, chapterIndexForKa, isAlive } from "@/data/story";
import { taxa } from "@/data/taxa";
import { seaLevel } from "@/lib/climate";
import { taxonGlow } from "@/lib/palette";
import { timeStore, useKaSelector, usePlaying } from "@/lib/timeStore";
import { Scrubber } from "./Scrubber";
import { StatusBadge, shortName, type OpenFn } from "./ui";

const Globe = dynamic(() => import("./Globe"), { ssr: false });

const aliveIds = (ka: number) =>
  taxa
    .filter((t) => isAlive(t.rangeStartKa, t.rangeEndKa, ka))
    .map((t) => t.id)
    .join(",");

const routeIds = (ka: number) =>
  migrations
    .filter((m) => ka <= m.startKa && ka >= m.endKa)
    .map((m) => m.id)
    .join(",");

export function TimeMachine({ onOpen }: { onOpen: OpenFn }) {
  const chapterIdx = useKaSelector(chapterIndexForKa, 0);
  const alive = useKaSelector(aliveIds, aliveIds(7200));
  const routes = useKaSelector(routeIds, "");
  const playing = usePlaying();
  const sea = useKaSelector((k) => Math.round(seaLevel(k) / 5) * 5, 0);
  const [hover, setHover] = useState<string | null>(null);
  const chapter = CHAPTERS[chapterIdx];
  const claim = chapter.claimId ? getClaim(chapter.claimId) : undefined;

  const aliveTaxa = useMemo(
    () => (alive ? alive.split(",").map((id) => taxa.find((t) => t.id === id)!) : []),
    [alive],
  );
  const activeRoutes = useMemo(
    () => (routes ? routes.split(",").map((id) => migrations.find((m) => m.id === id)!) : []),
    [routes],
  );

  // Start the story on arrival unless the visitor prefers stillness.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => {
      if (window.scrollY < 200 && timeStore.ka > 7000) timeStore.play();
    }, 1400);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section
      id="story"
      className="hero-bg relative mx-2 overflow-hidden rounded-[28px] text-white sm:mx-4"
    >
      <div className="mx-auto grid max-w-[1320px] gap-2 px-5 pt-8 sm:px-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:pt-8">
        <div className="relative z-10 flex flex-col lg:py-4">
          <p className="kicker text-[var(--mint)]">
            Chapter {chapterIdx + 1} of {CHAPTERS.length} · {chapter.kicker}
          </p>
          <div key={chapter.id} className="fade-up">
            <h1 className="display mt-4 text-[38px] leading-[1.03] sm:text-[52px] xl:text-[58px]">
              {chapter.title}
            </h1>
            <p className="mt-5 max-w-[520px] text-[16.5px] leading-[1.6] text-white/80">
              {chapter.body}
            </p>
            {claim ? (
              <button
                type="button"
                onClick={() => onOpen({ kind: "claim", id: claim.id })}
                className="group mt-5 flex max-w-[520px] items-center gap-3 rounded-2xl bg-white/[0.07] px-4 py-3 text-left ring-1 ring-white/10 transition hover:bg-white/[0.12]"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] text-white/55">How do we know?</span>
                  <span className="mt-0.5 block text-[14px] font-medium leading-snug">
                    {claim.question}
                  </span>
                </span>
                <StatusBadge status={claim.status} dark />
                <span className="text-white/50 transition group-hover:translate-x-0.5 group-hover:text-white">→</span>
              </button>
            ) : null}
          </div>

          <div className="mt-7 lg:mt-auto lg:pt-8">
            <p className="text-[12px] text-white/55">
              Alive at this moment
              <span className="ml-2 rounded-full bg-white/10 px-1.5 py-0.5 tabular-nums text-white/80">
                {aliveTaxa.length}
              </span>
            </p>
            <div className="mt-2.5 flex min-h-[68px] flex-wrap content-start gap-1.5">
              {aliveTaxa.length === 0 ? (
                <span className="text-[13px] text-white/50">
                  A gap in the fossil record. Nothing is securely dated to this moment.
                </span>
              ) : null}
              {aliveTaxa.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onMouseEnter={() => setHover(t.id)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(t.id)}
                  onBlur={() => setHover(null)}
                  onClick={() => onOpen({ kind: "taxon", id: t.id })}
                  className="fade-up inline-flex items-center gap-2 rounded-full bg-white/[0.08] py-1.5 pl-2.5 pr-3 text-[13px] ring-1 ring-white/10 transition hover:bg-white/[0.16]"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: taxonGlow(t.id), boxShadow: `0 0 10px ${taxonGlow(t.id)}` }}
                  />
                  <em>{shortName(t.name)}</em>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative -mx-5 h-[min(92vw,460px)] sm:mx-0 sm:h-[520px] lg:h-[clamp(430px,calc(100vh-335px),640px)]">
          <Globe
            highlight={hover}
            focus={chapter.focus}
            onPickTaxon={(id) => onOpen({ kind: "taxon", id })}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-1 flex flex-wrap justify-center gap-1.5 px-4">
            {activeRoutes.slice(0, 3).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onOpen({ kind: "route", id: m.id })}
                className="fade-up pointer-events-auto inline-flex items-center gap-2 rounded-full bg-[#031e14]/75 px-3 py-1.5 text-[12px] ring-1 ring-white/15 backdrop-blur transition hover:bg-[#031e14]"
              >
                <span className="h-[3px] w-4 rounded-full" style={{ background: taxonGlow(m.taxonId) }} />
                {m.label}
                <StatusBadge status={m.status} dark compact />
              </button>
            ))}
          </div>
          <p
            className={`pointer-events-none absolute left-4 top-2 flex items-center gap-2 rounded-full bg-[#031e14]/60 px-2.5 py-1 text-[11px] text-white/70 ring-1 ring-white/10 transition-opacity duration-500 sm:left-6 ${
              sea <= -10 ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="h-2 w-2 rounded-sm" style={{ background: "#9cc79a" }} />
            Sea level {Math.abs(sea)} m lower: pale land was dry
          </p>
          <p className="pointer-events-none absolute right-4 top-2 hidden text-[11px] text-white/40 sm:block">
            Drag to spin{playing ? "" : " · press play or drag the timeline"}
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1320px] px-5 pb-6 pt-4 sm:px-10 sm:pb-7">
        <Scrubber />
      </div>
    </section>
  );
}

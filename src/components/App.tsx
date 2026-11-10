"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { Dna } from "./Dna";
import { FamilyTree } from "./FamilyTree";
import { GoFurther } from "./GoFurther";
import { Questions, Theories } from "./Questions";
import { Quiz } from "./Quiz";
import { ShortVersion } from "./ShortVersion";
import { SkullLab } from "./SkullLab";
import { TimeMachine } from "./TimeMachine";
import { Workspace, useWorkspace } from "./Workspace";

export const NAV = [
  ["/#story", "Story"],
  ["/#tree", "Family tree"],
  ["/#skulls", "Skulls"],
  ["/#dna", "DNA"],
  ["/#questions", "Evidence"],
  ["/#quiz", "Test yourself"],
  ["/#adam", "Adam & Eve"],
  ["/read", "Field notes"],
] as const;

export function App() {
  return (
    <Workspace nav={NAV}>
      <Sections />
    </Workspace>
  );
}

function Sections() {
  const { open, selectedTaxon } = useWorkspace();
  const [activeTheories, setActiveTheories] = useState<string[]>([]);
  const [skull, setSkull] = useState("neanderthal");
  const toggleTheory = useCallback(
    (id: string) =>
      setActiveTheories((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id])),
    [],
  );
  return (
    <>
      <main>
        <TimeMachine onOpen={open} />
        <ShortVersion onOpen={open} />
        <FamilyTree onOpen={open} selectedId={selectedTaxon} activeTheories={activeTheories} onToggleTheory={toggleTheory} />
        <SkullLab onOpen={open} a={skull} onChangeA={setSkull} />
        <Dna />
        <Questions onOpen={open} />
        <Quiz onOpen={open} />
        <Theories onOpen={open} activeTheories={activeTheories} onToggleTheory={toggleTheory} />
        <GoFurther />
      </main>
      <Footer />
    </>
  );
}

export function Footer() {
  return (
    <footer className="mx-auto max-w-[1240px] px-5 py-14 text-[13px] leading-relaxed text-[var(--faint)] sm:px-8">
      <div className="grid gap-8 md:grid-cols-[2fr_3fr]">
        <div>
          <p className="display text-[20px] text-[var(--ink)]">evo-viz</p>
          <p className="mt-2 max-w-[360px]">
            A teaching and research companion to human origins. Grades are
            editorial readings of the literature. Some will be wrong, and the
            footnotes are there so you can check.
          </p>
          <Link href="/about" className="mt-3 inline-block font-medium text-[var(--green)] hover:underline">
            Method, sources and credits →
          </Link>
        </div>
        <p>
          Coastlines: Natural Earth (public domain). Silhouettes: T. Michael
          Keesey and contributors, PhyloPic (public domain). Scanned casts:
          Digital Atlas of Ancient Life, Cornell (CC BY-NC-SA), embedded from
          Sketchfab; Smithsonian Human Origins Program scans are linked. The
          in-app skulls are procedural teaching models. Dates and brain
          volumes are rounded mid-range figures from the cited literature. Sea
          level is shown as it is today; during ice ages it was up to 120
          metres lower, joining Java to Asia and New Guinea to Australia.
        </p>
      </div>
    </footer>
  );
}

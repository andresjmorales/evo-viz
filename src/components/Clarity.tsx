"use client";

import { Rich } from "./Popups";
import { SectionHeading, type OpenFn, type PanelTarget } from "./ui";

interface Item {
  q: string;
  short: string;
  body: string;
  more?: { label: string; target?: PanelTarget; href?: string };
}

/**
 * Questions people commonly bring to evolution, many of them from readers
 * weighing it against their faith. Each states what the science holds.
 */
const ITEMS: Item[] = [
  {
    q: "Did humans come from monkeys?",
    short: "We share ancestors with them. Chimpanzees are our cousins, and neither of us is the other’s parent.",
    body: "Living apes and monkeys have been evolving for exactly as long as we have. Humans and chimpanzees descend from a population of apes that lived roughly seven million years ago and was neither one. The relationship is that of cousins who share grandparents.",
    more: { label: "Was our ancestor a chimpanzee?", target: { kind: "claim", id: "not-a-chimp" } },
  },
  {
    q: "If we came from apes, why are there still apes?",
    short: "Because evolution branches. One population can split and both halves carry on.",
    body: "When a population divides, each part follows its own course. One branch of African apes led to us, others to chimpanzees and gorillas. In the same way, some Europeans emigrated to the Americas and there are still Europeans.",
    more: { label: "See the branching", href: "#short" },
  },
  {
    q: "Isn’t evolution only a theory?",
    short: "In science a theory is an explanation that has survived a great deal of testing, like the theory of gravity or germ theory.",
    body: "Everyday speech uses “theory” for a hunch. Scientists use it for a framework that ties many facts together and makes predictions that could have failed. Evolution predicted that fossils would appear in a consistent order and that DNA would group species the same way anatomy does. Both were checked long after Darwin, and both held.[@chimp-genome-2005] The details are argued constantly, which is why this site grades its claims; common descent itself is as well supported as anything in biology.",
  },
  {
    q: "Is evolution just random chance?",
    short: "Mutation is random. Selection is the opposite of random.",
    body: "New variants arise without regard to whether they are useful. What happens next depends on how well they work: variants that help their carriers leave more descendants spread, and harmful ones fade. Chance supplies the raw material and a consistent filter shapes it. The beetle panel in the section above shows the filter at work.",
    more: { label: "Try it", href: "#how" },
  },
  {
    q: "Where are the transitional fossils?",
    short: "In museum drawers, by the thousand. Several are on this page.",
    body: "Ardi has a pelvis for walking above a foot built for grasping.[@white-2009] Lucy walked upright with an ape-sized brain.[@johanson-1976] The Dmanisi people had long legs, simple tools and brains half the size of ours.[@lordkipanidze-2013] Each new find does create two smaller gaps on either side of it, so the record will never be seamless. What matters is that the forms found fall where common descent says they should.",
    more: { label: "Every species on one timeline", href: "#tree" },
  },
  {
    q: "Small changes, certainly. But a new kind of creature?",
    short: "Large differences are small ones added up, and our own chromosomes record it.",
    body: "No barrier has been found that stops small inherited changes from accumulating. Humans have one pair of chromosomes fewer than other great apes, and our chromosome 2 carries the remains of two ape chromosomes fused end to end, exactly where a merger would leave them.[@ijdo-1991] Overall our DNA differs from a chimpanzee’s at a little over one letter in a hundred,[@chimp-genome-2005] about what the measured mutation rate predicts for the time available.[@kong-2012]",
  },
  {
    q: "Does evolution have a goal? Are we its high point?",
    short: "It has no direction built in. It fits populations to their circumstances, whatever those are.",
    body: "The old picture of a ladder climbing toward humans is misleading. Homo floresiensis and Homo naledi kept small brains long after larger ones existed elsewhere.[@brown-2004,dirks-2017] Bacteria are as evolved as we are. Whether history as a whole has a purpose is a question for philosophy and theology; biology describes the mechanism and is silent on that.",
  },
  {
    q: "Does evolution explain how life, or the universe, began?",
    short: "No. It starts once there are living things that reproduce.",
    body: "Evolution explains how life diversified. How the first living cell arose is a separate research field with far less settled answers, and the origin of the universe belongs to physics. Someone can accept everything on this page and hold any view on those two questions.",
  },
  {
    q: "Does “survival of the fittest” mean the strong ought to win?",
    short: "Fitness means leaving descendants. It is a description, and never a moral instruction.",
    body: "The phrase was coined by the philosopher Herbert Spencer and is easily misread. In biology the fittest are whoever leaves the most surviving offspring, which very often means the most cooperative. Humans are the outstanding example: we care for the injured, share food and raise children together, and Neanderthals did much of the same.[@zilhao-2010] What nature does and what people should do are different kinds of question.",
    more: { label: "How human were Neanderthals?", target: { kind: "claim", id: "neanderthal-mind" } },
  },
  {
    q: "Does accepting evolution mean giving up belief in God?",
    short: "Many scientists and many churches hold both. The science itself does not rule on the question.",
    body: "Evolution describes how living things came to be as they are. Whether a creator stands behind that process is outside what its methods can test. The geneticist who wrote the famous line “nothing in biology makes sense except in the light of evolution” was a lifelong Orthodox Christian and said so in the same essay.[@dobzhansky-1973] A range of Christian thinkers have set out how they read Genesis alongside the evidence.[@venema-2017,walton-2015]",
    more: { label: "Six ways of placing Adam and Eve", href: "#adam" },
  },
  {
    q: "Has genetics ruled out Adam and Eve?",
    short: "It rules out one version and leaves others open.",
    body: "Human genetic diversity is too great to have passed through a single couple at any point in the last several hundred thousand years, so a pair who were the sole biological source of all people is excluded for that period.[@li-durbin-2011] A couple who lived among others and are ancestors of everyone alive today is a different matter: the mathematics of family trees makes that possible within a few thousand years.[@rohde-2004,swamidass-2019] A much older pair is also not excluded by the genetic data.",
    more: { label: "Could everyone descend from a recent couple?", target: { kind: "claim", id: "swamidass-gae" } },
  },
  {
    q: "Don’t scientists themselves disagree about evolution?",
    short: "About how it happened, all the time. About whether it happened, no.",
    body: "Researchers argue over which fossil belongs to which species, how much drift matters compared with selection, and when particular lineages split. Those disputes are how the field corrects itself, and this site marks them as contested or shaky where they are. None of them is about whether living things share common ancestors.",
    more: { label: "See what is settled and what is not", href: "#questions" },
  },
];

export function Clarity({ onOpen }: { onOpen: OpenFn }) {
  return (
    <section id="clarity" className="mx-auto max-w-[1240px] px-5 pt-24 sm:px-8">
      <SectionHeading kicker="Common questions" title="What evolution says, and what it leaves alone">
        Most people meet evolution as a slogan. These are the questions that
        come up most often, including from readers weighing it against their
        faith. Each gets a direct answer and a pointer to the evidence.
      </SectionHeading>

      <div className="mt-9 grid items-start gap-3 lg:grid-cols-2">
        {ITEMS.map((it) => (
          <details key={it.q} className="group rounded-2xl border border-[var(--line)] bg-white open:border-[#b9d3c4]">
            <summary className="flex cursor-pointer list-none items-start gap-3 p-5 [&::-webkit-details-marker]:hidden">
              <span className="min-w-0 flex-1">
                <span className="display block text-[19px] leading-snug text-[var(--ink)]">{it.q}</span>
                <span className="mt-1.5 block text-[14.5px] leading-relaxed text-[var(--muted)]">{it.short}</span>
              </span>
              <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--panel)] text-[var(--muted)] transition group-open:rotate-45 group-open:bg-[var(--green-soft)] group-open:text-[var(--green)]" aria-hidden>
                <svg width="12" height="12" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 1v10M1 6h10" /></svg>
              </span>
            </summary>
            <div className="px-5 pb-5">
              <p className="border-t border-[var(--line)] pt-4 text-[14.5px] leading-[1.7] text-[var(--ink)]">
                <Rich text={it.body} />
              </p>
              {it.more ? (
                it.more.target ? (
                  <button type="button" onClick={() => onOpen(it.more!.target!)} className="mt-3 text-[13px] font-semibold text-[var(--green)] hover:underline">
                    {it.more.label} →
                  </button>
                ) : (
                  <a href={it.more.href} className="mt-3 inline-block text-[13px] font-semibold text-[var(--green)] hover:underline">
                    {it.more.label} →
                  </a>
                )
              ) : null}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { Reader } from "@/components/Reader";

export const metadata: Metadata = {
  title: "Field notes · evo-viz",
  description:
    "The whole atlas as one long read: eight chapters, every species and every graded question, with sources in the margin and hover notes on names and terms.",
};

export default function ReadPage() {
  return <Reader />;
}

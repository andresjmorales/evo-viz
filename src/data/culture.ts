import type { Status } from "./types";

/**
 * Technology and behaviour through time, drawn as a lane under the family
 * tree. A matching start and end marks a single dated find. Dates are for
 * the oldest well-accepted evidence; the behaviour itself may be older.
 */
export interface CultureItem {
  id: string;
  /** Row within the lane, top to bottom. */
  row: number;
  label: string;
  startKa: number;
  endKa: number;
  status: Status;
  summary: string;
  sourceIds: string[];
  claimId?: string;
}

export const CULTURE_ROWS = [
  "Stone tools",
  "",
  "Fire and hunting",
  "",
  "Symbols and art",
  "",
];

export const culture: CultureItem[] = [
  {
    id: "lomekwian",
    row: 0,
    label: "Lomekwi tools",
    startKa: 3300,
    endKa: 3300,
    status: "contested",
    summary:
      "Large stones struck to detach flakes, found at Lomekwi 3 on the west side of Lake Turkana and dated to 3.3 million years, older than any fossil of Homo.[@harmand-2015] If the dates and the association hold, toolmaking began with an australopith or with Kenyanthropus. Some archaeologists question whether the pieces came from the dated layer.",
    sourceIds: ["harmand-2015"],
    claimId: "tools-who",
  },
  {
    id: "oldowan",
    row: 0,
    label: "Oldowan",
    startKa: 2600,
    endKa: 1700,
    status: "settled",
    summary:
      "Sharp flakes knocked from cobbles, and the battered cores left behind. The oldest come from Gona and Ledi-Geraru in Ethiopia at about 2.6 million years.[@semaw-1997,braun-2019] They were used to cut meat from bones and break them for marrow. Simple as they look, making one takes an understanding of stone fracture that no living ape shows without training.",
    sourceIds: ["semaw-1997", "braun-2019"],
    claimId: "tools-who",
  },
  {
    id: "acheulean",
    row: 1,
    label: "Acheulean handaxes",
    startKa: 1760,
    endKa: 200,
    status: "settled",
    summary:
      "Large tools shaped on both faces to a planned, symmetrical form: handaxes, cleavers and picks. The oldest are from Kokiselei in Kenya at 1.76 million years.[@lepre-2011] The design then lasted more than 1.5 million years across Africa, Europe and western Asia, the longest-lived technology people have ever had. It is usually linked to Homo erectus and later Middle Pleistocene humans.",
    sourceIds: ["lepre-2011"],
  },
  {
    id: "msa",
    row: 0,
    label: "Middle Stone Age and Mousterian",
    startKa: 320,
    endKa: 40,
    status: "strong",
    summary:
      "Handaxes give way to smaller tools struck from carefully prepared cores, many of them hafted onto spears. In Africa this is the Middle Stone Age, in place by about 320 thousand years ago at Olorgesailie, where it comes with pigment and obsidian carried from far away.[@brooks-2018] In Europe and western Asia the equivalent is the Mousterian, made mainly by Neanderthals.",
    sourceIds: ["brooks-2018", "mcbrearty-2000"],
    claimId: "behavior-revolution",
  },
  {
    id: "upper-palaeolithic",
    row: 1,
    label: "Upper Palaeolithic",
    startKa: 50,
    endKa: 12,
    status: "settled",
    summary:
      "Long blades, bone and antler points, needles, ornaments and, later, spear-throwers. It arrives in Europe with Homo sapiens; at Bacho Kiro in Bulgaria the makers are dated to about 45 thousand years ago.[@hublin-2020] The African Later Stone Age covers similar ground and its components appear earlier.[@mcbrearty-2000]",
    sourceIds: ["hublin-2020", "mcbrearty-2000"],
    claimId: "behavior-revolution",
  },
  {
    id: "fire-early",
    row: 2,
    label: "First secure hearths",
    startKa: 1000,
    endKa: 1000,
    status: "strong",
    summary:
      "Ash and burnt bone lie deep inside Wonderwerk Cave in South Africa in a layer about a million years old, too far from the entrance for a wildfire.[@berna-2012] At Gesher Benot Ya‘aqov in Israel, clusters of burnt flint mark hearths at about 790 thousand years.[@goren-inbar-2004] Older claims exist but are hard to tell from natural burning.",
    sourceIds: ["berna-2012", "goren-inbar-2004"],
    claimId: "fire",
  },
  {
    id: "fire-habitual",
    row: 2,
    label: "Habitual fire",
    startKa: 400,
    endKa: 0,
    status: "strong",
    summary:
      "From about 400 thousand years ago hearths become a regular feature of sites in Europe and the Levant, which suggests people could make or reliably keep fire.[@roebroeks-2011] Before that the evidence is so patchy that some argue early humans lived in cold Europe largely without it.",
    sourceIds: ["roebroeks-2011"],
    claimId: "fire",
  },
  {
    id: "spears",
    row: 3,
    label: "Wooden spears",
    startKa: 200,
    endKa: 200,
    status: "strong",
    summary:
      "Several carefully shaped spruce and pine spears were preserved in waterlogged sediment at Schöningen in Germany alongside butchered horses.[@thieme-1997] They are weighted like javelins and show planned, cooperative hunting of large animals. Long dated to 300 thousand years or more, they were re-dated in 2025 to about 200 thousand, which would make their makers Neanderthals.[@hutson-2025]",
    sourceIds: ["thieme-1997", "hutson-2025"],
  },
  {
    id: "burial",
    row: 3,
    label: "Burial",
    startKa: 100,
    endKa: 0,
    status: "strong",
    summary:
      "Bodies placed in dug graves appear at Skhul and Qafzeh in the Levant about 100 thousand years ago. The oldest known burial in Africa is a child laid on its side at Panga ya Saidi in Kenya about 78 thousand years ago.[@martinon-torres-2021] Several Neanderthal skeletons are also argued to be burials. Much older claims, including for Homo naledi, are disputed.",
    sourceIds: ["martinon-torres-2021"],
    claimId: "naledi-burial",
  },
  {
    id: "pigment",
    row: 4,
    label: "Pigment",
    startKa: 300,
    endKa: 0,
    status: "strong",
    summary:
      "Lumps of red and black mineral, some ground to powder, turn up at Olorgesailie in Kenya by about 300 thousand years ago.[@brooks-2018] Pigment has practical uses, such as in glue and hide-working, so on its own it does not prove symbolism. Neanderthals in Iberia used it too, with perforated shells.[@zilhao-2010]",
    sourceIds: ["brooks-2018", "zilhao-2010"],
    claimId: "behavior-revolution",
  },
  {
    id: "beads",
    row: 5,
    label: "Shell beads",
    startKa: 142,
    endKa: 142,
    status: "strong",
    summary:
      "Thirty-three sea-snail shells from Bizmoune Cave in Morocco were pierced, strung and worn, at least 142 thousand years ago.[@sehasseh-2021] Ornaments are among the clearest signs of symbolic behaviour, because their only use is to say something about the wearer to other people.",
    sourceIds: ["sehasseh-2021"],
    claimId: "behavior-revolution",
  },
  {
    id: "engraving",
    row: 5,
    label: "Engraved ochre",
    startKa: 77,
    endKa: 77,
    status: "settled",
    summary:
      "A block of ochre from Blombos Cave on the South African coast was ground flat and incised with a deliberate cross-hatched pattern about 77 thousand years ago.[@henshilwood-2002] It is abstract, repeated on other pieces, and has no obvious practical purpose.",
    sourceIds: ["henshilwood-2002"],
    claimId: "oldest-art",
  },
  {
    id: "figurative-art",
    row: 5,
    label: "Paintings of animals and people",
    startKa: 51,
    endKa: 0,
    status: "settled",
    summary:
      "The oldest dated pictures of recognisable things are on cave walls in Sulawesi, Indonesia: a scene with human-like figures and a pig at least 51 thousand years old,[@oktaviana-2024] and a life-sized pig at least 45 thousand.[@brumm-2021] The famous European painted caves are younger. All are the work of Homo sapiens.",
    sourceIds: ["oktaviana-2024", "brumm-2021"],
    claimId: "oldest-art",
  },
  {
    id: "hafting",
    row: 3,
    label: "Glued and hafted tools",
    startKa: 70,
    endKa: 70,
    status: "strong",
    summary:
      "Stone points from Sibudu Cave in South Africa, about 70 thousand years old, carry traces of a glue made by mixing plant gum with red ochre and heating it, a recipe that takes planning and several steps held in mind at once.[@wadley-2009] Neanderthals made a different adhesive, birch tar, and used it to back a flint flake found off the Dutch coast.[@niekus-2019]",
    sourceIds: ["wadley-2009", "niekus-2019"],
    claimId: "neanderthal-mind",
  },
  {
    id: "farming",
    row: 1,
    label: "Farming",
    startKa: 11.5,
    endKa: 0,
    status: "settled",
    summary:
      "From about 11,500 years ago people in several parts of the world independently began to cultivate plants and herd animals: wheat and sheep in southwest Asia, rice and millet in China, maize and squash in the Americas, and others.[@larson-2014] Almost everything in recorded history follows from it, yet it covers the last fifth of one percent of the time since our lineage parted from the chimpanzees’.",
    sourceIds: ["larson-2014"],
  },
];

export const cultureById = Object.fromEntries(culture.map((c) => [c.id, c]));

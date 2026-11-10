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
  /** Species linked to this behaviour. `maybe` marks a likely or argued link. */
  makers: { id: string; maybe?: boolean }[];
  /** Key of the drawing in ToolArt. */
  art: ToolArtKey;
}

export type ToolArtKey =
  | "lomekwi" | "chopper" | "handaxe" | "levallois" | "blade" | "hearth" | "spear"
  | "grave" | "ochre" | "beads" | "engraved" | "painting" | "hafted" | "wheat"
  | "bone" | "bow" | "raft" | "logs" | "cord" | "pot" | "hook" | "flute" | "shell";

/** Lane rows, top to bottom. A label starts a group; "" continues the one above. */
export const CULTURE_ROWS = [
  "Stone tools",
  "",
  "Fire and hunting",
  "",
  "",
  "Craft and travel",
  "",
  "Symbols and art",
  "",
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
    makers: [{ id: "afarensis", maybe: true }],
    art: "lomekwi",
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
    makers: [{ id: "habilis" }, { id: "rudolfensis" }, { id: "erectus" }, { id: "boisei", maybe: true }, { id: "robustus", maybe: true }],
    art: "chopper",
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
    makers: [{ id: "erectus" }, { id: "heidelbergensis" }, { id: "neanderthal", maybe: true }],
    art: "handaxe",
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
    makers: [{ id: "sapiens" }, { id: "neanderthal" }, { id: "heidelbergensis", maybe: true }, { id: "naledi", maybe: true }, { id: "denisovan", maybe: true }],
    art: "levallois",
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
    makers: [{ id: "sapiens" }],
    art: "blade",
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
    makers: [{ id: "erectus" }],
    art: "hearth",
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
    makers: [{ id: "heidelbergensis" }, { id: "neanderthal" }, { id: "sapiens" }],
    art: "hearth",
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
    makers: [{ id: "neanderthal" }, { id: "heidelbergensis", maybe: true }],
    art: "spear",
  },
  {
    id: "burial",
    row: 9,
    label: "Burial",
    startKa: 100,
    endKa: 0,
    status: "strong",
    summary:
      "Bodies placed in dug graves appear at Skhul and Qafzeh in the Levant about 100 thousand years ago. The oldest known burial in Africa is a child laid on its side at Panga ya Saidi in Kenya about 78 thousand years ago.[@martinon-torres-2021] Several Neanderthal skeletons are also argued to be burials. Much older claims, including for Homo naledi, are disputed.",
    sourceIds: ["martinon-torres-2021"],
    claimId: "naledi-burial",
    makers: [{ id: "sapiens" }, { id: "neanderthal" }, { id: "naledi", maybe: true }],
    art: "grave",
  },
  {
    id: "pigment",
    row: 7,
    label: "Pigment",
    startKa: 300,
    endKa: 0,
    status: "strong",
    summary:
      "Lumps of red and black mineral, some ground to powder, turn up at Olorgesailie in Kenya by about 300 thousand years ago.[@brooks-2018] Pigment has practical uses, such as in glue and hide-working, so on its own it does not prove symbolism. Neanderthals in Iberia used it too, with perforated shells.[@zilhao-2010]",
    sourceIds: ["brooks-2018", "zilhao-2010"],
    claimId: "behavior-revolution",
    makers: [{ id: "sapiens" }, { id: "neanderthal" }],
    art: "ochre",
  },
  {
    id: "beads",
    row: 8,
    label: "Shell beads",
    startKa: 142,
    endKa: 142,
    status: "strong",
    summary:
      "Thirty-three sea-snail shells from Bizmoune Cave in Morocco were pierced, strung and worn, at least 142 thousand years ago.[@sehasseh-2021] Ornaments are among the clearest signs of symbolic behaviour, because their only use is to say something about the wearer to other people.",
    sourceIds: ["sehasseh-2021"],
    claimId: "behavior-revolution",
    makers: [{ id: "sapiens" }, { id: "neanderthal" }],
    art: "beads",
  },
  {
    id: "engraving",
    row: 8,
    label: "Engraved ochre",
    startKa: 77,
    endKa: 77,
    status: "settled",
    summary:
      "A block of ochre from Blombos Cave on the South African coast was ground flat and incised with a deliberate cross-hatched pattern about 77 thousand years ago.[@henshilwood-2002] It is abstract, repeated on other pieces, and has no obvious practical purpose.",
    sourceIds: ["henshilwood-2002"],
    claimId: "oldest-art",
    makers: [{ id: "sapiens" }],
    art: "engraved",
  },
  {
    id: "figurative-art",
    row: 8,
    label: "Paintings of animals and people",
    startKa: 51,
    endKa: 0,
    status: "settled",
    summary:
      "The oldest dated pictures of recognisable things are on cave walls in Sulawesi, Indonesia: a scene with human-like figures and a pig at least 51 thousand years old,[@oktaviana-2024] and a life-sized pig at least 45 thousand.[@brumm-2021] The famous European painted caves are younger. All are the work of Homo sapiens.",
    sourceIds: ["oktaviana-2024", "brumm-2021"],
    claimId: "oldest-art",
    makers: [{ id: "sapiens" }],
    art: "painting",
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
    makers: [{ id: "sapiens" }, { id: "neanderthal" }],
    art: "hafted",
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
    makers: [{ id: "sapiens" }],
    art: "wheat",
  },
  {
    id: "bone-tools",
    row: 3,
    label: "Shaped bone tools",
    startKa: 1500,
    endKa: 1500,
    status: "strong",
    summary:
      "Twenty-seven tools made from the limb bones of elephants and hippos, flaked to shape the way stone was, come from a single layer at Olduvai Gorge in Tanzania about 1.5 million years old.[@de-la-torre-2025] Until this find, systematic bone toolmaking was thought to begin more than a million years later. The makers are not identified, but Homo erectus lived at Olduvai at the time.",
    sourceIds: ["de-la-torre-2025"],
    makers: [{ id: "erectus", maybe: true }],
    art: "bone",
  },
  {
    id: "bow",
    row: 4,
    label: "Bow and arrow",
    startKa: 64,
    endKa: 0,
    status: "strong",
    summary:
      "No bow this old survives; wood rarely does. The case rests on small stone tips. At Sibudu Cave in South Africa, pieces about 64 thousand years old carry impact fractures and traces of glue and blood in the places an arrowhead would.[@lombard-2010] At Grotte Mandrin in France, tiny points about 54 thousand years old are too small and light for anything but arrows, and they arrive with the first Homo sapiens there.[@metz-2023] A bow stores energy in the arms of the archer and lets a hunter kill from a distance.",
    sourceIds: ["lombard-2010", "metz-2023"],
    makers: [{ id: "sapiens" }],
    art: "bow",
  },
  {
    id: "flores-crossing",
    row: 5,
    label: "Crossing to Flores",
    startKa: 1020,
    endKa: 1020,
    status: "strong",
    summary:
      "Stone tools at Wolo Sege on the island of Flores are about a million years old.[@brumm-2010] Flores was never joined to the mainland, even when the sea was at its lowest, so some early human crossed open water to get there, probably an ancestor of Homo floresiensis. Whether they meant to, on rafts, or were swept across on vegetation after a storm or tsunami, nobody knows.",
    sourceIds: ["brumm-2010"],
    claimId: "sea-level-routes",
    makers: [{ id: "erectus", maybe: true }, { id: "floresiensis" }],
    art: "raft",
  },
  {
    id: "wood-structure",
    row: 5,
    label: "Notched logs",
    startKa: 476,
    endKa: 476,
    status: "strong",
    summary:
      "Two logs at Kalambo Falls in Zambia were joined by cutting a notch in one so the other sat across it, at least 476 thousand years ago.[@barham-2023] It is the oldest known woodwork used to build something, perhaps a platform by the river. Waterlogging preserved it; most wooden technology from this time has simply rotted away. Which species made it is unknown.",
    sourceIds: ["barham-2023"],
    makers: [{ id: "heidelbergensis", maybe: true }],
    art: "logs",
  },
  {
    id: "sahul",
    row: 5,
    label: "Voyage to Australia",
    startKa: 65,
    endKa: 65,
    status: "contested",
    summary:
      "Even with the sea at its lowest, reaching Australia and New Guinea from Asia meant a chain of open-water crossings, so people who did it must have had boats or rafts. Madjedbebe rock shelter in northern Australia has artefacts dated to about 65 thousand years ago,[@clarkson-2017] which makes this the oldest firm sign of seafaring by Homo sapiens. Other researchers read the evidence as pointing to about 50 thousand years instead.[@oconnell-2018]",
    sourceIds: ["clarkson-2017", "oconnell-2018"],
    claimId: "sea-level-routes",
    makers: [{ id: "sapiens" }],
    art: "raft",
  },
  {
    id: "pottery",
    row: 5,
    label: "Pottery",
    startKa: 20,
    endKa: 0,
    status: "strong",
    summary:
      "Fired clay pots from Xianrendong Cave in southern China are about 20 thousand years old, made by hunter-gatherers ten thousand years before farming reached the region.[@wu-2012] Cooking in pots makes it possible to boil food, render fat and soften tough plants.",
    sourceIds: ["wu-2012"],
    makers: [{ id: "sapiens" }],
    art: "pot",
  },
  {
    id: "cord",
    row: 6,
    label: "Twisted cord",
    startKa: 50,
    endKa: 50,
    status: "strong",
    summary:
      "A fragment of three-ply cord, twisted from the inner bark of a conifer, was found on a stone tool at Abri du Maras in France, in a layer about 41 to 52 thousand years old and made by Neanderthals.[@hardy-2020] Cord leads to bags, nets, snares and clothing, and making it means keeping track of several twists at once.",
    sourceIds: ["hardy-2020"],
    claimId: "neanderthal-mind",
    makers: [{ id: "neanderthal" }],
    art: "cord",
  },
  {
    id: "flute",
    row: 6,
    label: "Flutes",
    startKa: 35,
    endKa: 35,
    status: "settled",
    summary:
      "A flute carved from the wing bone of a griffon vulture, with five finger holes, was found at Hohle Fels in southwestern Germany, together with pieces of ivory flutes, in layers more than 35 thousand years old.[@conard-2009] They are the oldest musical instruments known. Singing and drumming leave no trace and are probably far older.",
    sourceIds: ["conard-2009"],
    makers: [{ id: "sapiens" }],
    art: "flute",
  },
  {
    id: "fishhooks",
    row: 6,
    label: "Fishhooks",
    startKa: 23,
    endKa: 23,
    status: "strong",
    summary:
      "Fishhooks ground from sea-snail shell were found at Sakitari Cave on Okinawa, Japan, dated to about 23 thousand years ago, among the oldest known.[@fujita-2016] Reaching and living on small islands like Okinawa took boats and a good knowledge of the sea.",
    sourceIds: ["fujita-2016"],
    makers: [{ id: "sapiens" }],
    art: "hook",
  },
  {
    id: "engraved-shell",
    row: 8,
    label: "Engraved shell",
    startKa: 500,
    endKa: 500,
    status: "strong",
    summary:
      "A freshwater mussel shell from Trinil on Java, where the first Homo erectus was found, carries a zigzag line cut with a sharp point between about 430 and 540 thousand years ago.[@joordens-2015] Other shells from the site were pierced to open them and one was used as a tool. The zigzag is the oldest known deliberate geometric mark. What it meant, if anything, is unknown.",
    sourceIds: ["joordens-2015"],
    claimId: "oldest-art",
    makers: [{ id: "erectus" }],
    art: "shell",
  },
];

export const cultureById = Object.fromEntries(culture.map((c) => [c.id, c]));

/** Culture items linked to a species, oldest first. */
export function cultureForTaxon(taxonId: string) {
  return culture
    .filter((c) => c.makers.some((m) => m.id === taxonId))
    .map((c) => ({ c, maybe: !!c.makers.find((m) => m.id === taxonId)?.maybe }))
    .sort((a, b) => b.c.startKa - a.c.startKa);
}

const APE_KIT =
  "No tools have been found with this species. Chimpanzees strip twigs to fish for termites, crack nuts with stones and sponge water with chewed leaves, and different groups do it differently;[@whiten-1999] early hominins very probably did at least as much. Tools of wood, leaf and unmodified stone almost never survive or cannot be told from natural objects.";

/** What can be said about tools for each species, linked items aside. */
export const TOOL_NOTES: Record<string, { text: string; sourceIds: string[] }> = {
  sahelanthropus: { text: APE_KIT, sourceIds: ["whiten-1999"] },
  orrorin: { text: APE_KIT, sourceIds: ["whiten-1999"] },
  ardipithecus: { text: APE_KIT, sourceIds: ["whiten-1999"] },
  anamensis: { text: APE_KIT, sourceIds: ["whiten-1999"] },
  afarensis: {
    text: "No stone tools are found with Lucy’s species itself. Two animal bones from Dikika in Ethiopia, about 3.4 million years old, carry marks that the finders read as cuts and blows from stone, which would mean afarensis butchered meat;[@mcpherron-2010] others think trampling made the marks. The Lomekwi tools, slightly younger, are from its time and region.[@harmand-2015]",
    sourceIds: ["mcpherron-2010", "harmand-2015"],
  },
  africanus: { text: APE_KIT, sourceIds: ["whiten-1999"] },
  sediba: {
    text: "No tools were found with the skeletons. The hand pairs a long, strong thumb and short fingers, suited to a precise grip, with features for climbing, so it may have been able to make tools.[@kivell-2011]",
    sourceIds: ["kivell-2011"],
  },
  floresiensis: {
    text: "Simple stone flakes are found throughout the layers with Homo floresiensis at Liang Bua, made in much the same way as tools on Flores a million years earlier.[@brumm-2010]",
    sourceIds: ["brumm-2010"],
  },
  longi: {
    text: "The Harbin skull was found on its own, without tools or other remains. What this lineage made is not yet known; if it is the same population as the Denisovans, as protein and DNA recovered from the skull now suggest,[@fu-2025-proteome,fu-2025-mtdna] the Denisova Cave tools would be theirs.",
    sourceIds: ["fu-2025-proteome", "fu-2025-mtdna"],
  },
};

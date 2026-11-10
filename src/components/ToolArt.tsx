import type { ReactNode } from "react";
import type { ToolArtKey } from "@/data/culture";
import {
  BASALT,
  FLINT,
  OCHRE,
  QUARTZITE,
  hash,
  polyPath,
  stoneFacets,
  tone,
  type Pt,
  type StoneTone,
} from "@/lib/facets";

/**
 * Shaded drawings of each tool or behaviour on a 120-unit grid, lit from the
 * upper left. They show the typical form of each kind of object, not a
 * particular specimen. Stone is drawn with the same flake-scar renderer the
 * knapping animation uses.
 */

const INK = "#2b3440";

export function Stone({
  outline,
  spine,
  stone = FLINT,
  base,
  knapped,
  scar,
  depth,
  seed = 1,
  speckle = false,
  speckleBox,
}: {
  outline: Pt[];
  spine: Pt[];
  stone?: StoneTone;
  /** Fill under the scars: the worn outer skin of a cobble, or the stone itself. */
  base?: string;
  knapped?: boolean[];
  scar?: number;
  depth?: number;
  seed?: number;
  speckle?: boolean;
  /** Fixed area to scatter speckles over, so they stay put when the outline changes. */
  speckleBox?: [number, number, number, number];
}) {
  const d = polyPath(outline);
  const id = `st${seed}-${Math.round(outline[0][0] * 10)}-${outline.length}`;
  const facets = stoneFacets(outline, spine, stone, { knapped, scar, depth, seed });
  const xs = outline.map((p) => p[0]);
  const ys = outline.map((p) => p[1]);
  const [x0, x1, y0, y1] = speckleBox ?? [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  return (
    <g>
      <clipPath id={id}>
        <path d={d} />
      </clipPath>
      <path d={d} fill={base ?? tone(stone, 4)} />
      <g clipPath={`url(#${id})`}>
        {speckle
          ? Array.from({ length: speckleBox ? 130 : 46 }, (_, i) => (
              <circle
                key={i}
                cx={x0 + hash(i * 3 + seed) * (x1 - x0)}
                cy={y0 + hash(i * 7 + seed + 2) * (y1 - y0)}
                r={0.5 + hash(i) * 0.9}
                fill={hash(i + 9) > 0.5 ? "#fff" : "#3a2f22"}
                opacity={0.22}
              />
            ))
          : null}
        {facets.map((f, i) => (
          <path key={i} d={f.d} fill={f.fill} stroke={tone(stone, -20)} strokeWidth={0.5} strokeLinejoin="round" />
        ))}
        {/* soft shading toward the lower right */}
        <path d={d} fill="url(#ta-shade)" />
      </g>
      <path d={d} fill="none" stroke={INK} strokeWidth={1.1} strokeLinejoin="round" opacity={0.75} />
    </g>
  );
}

const Shadow = ({ cx = 60, cy = 110, rx = 38, ry = 5 }: { cx?: number; cy?: number; rx?: number; ry?: number }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#0d2118" opacity={0.13} />
);

const WOOD = "#8a5a33";
const WOOD_D = "#5e3b20";
const WOOD_L = "#b98552";
const IVORY = "#efe6cf";
const IVORY_D = "#c9b98f";

function ropeBeads(n: number, x0: number, y0: number, x1: number, y1: number, sag: number, r = 5.5) {
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const x = x0 + (x1 - x0) * t;
    const y = y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * sag;
    return (
      <ellipse
        key={i}
        cx={x}
        cy={y}
        rx={r * 1.25}
        ry={r * 0.62}
        transform={`rotate(-38 ${x} ${y})`}
        fill={["#c9a66b", "#b08a4f", "#d8ba84"][i % 3]}
        stroke="#7a5a2c"
        strokeWidth={0.5}
      />
    );
  });
}

const ART: Record<ToolArtKey, ReactNode> = {
  lomekwi: (
    <>
      <Shadow rx={44} />
      <Stone
        outline={[[20, 76], [26, 44], [46, 24], [78, 20], [100, 38], [104, 70], [88, 96], [52, 102], [28, 94]]}
        spine={[[56, 58], [72, 66]]}
        stone={BASALT}
        base="#8a7964"
        knapped={[false, true, true, true, true, false, false, false, false]}
        scar={34}
        depth={0.62}
        seed={3}
        speckle
      />
    </>
  ),
  chopper: (
    <>
      <Shadow rx={42} cy={108} />
      <Stone
        outline={[[20, 72], [24, 88], [38, 100], [60, 104], [82, 100], [96, 88], [100, 72], [93, 58], [84, 63], [75, 50], [65, 58], [55, 47], [45, 57], [35, 50], [26, 59]]}
        spine={[[40, 84], [80, 84]]}
        stone={QUARTZITE}
        base="#b29c7c"
        knapped={[false, false, false, false, false, false, true, true, true, true, true, true, true, true, true]}
        scar={40}
        depth={0.58}
        seed={5}
        speckle
      />
      <Stone outline={[[86, 16], [106, 22], [103, 38], [92, 42], [82, 32]]} spine={[[94, 30]]} stone={QUARTZITE} scar={40} depth={0.8} seed={8} />
    </>
  ),
  handaxe: (
    <>
      <Shadow rx={30} cy={113} />
      <Stone
        outline={[[60, 8], [74, 28], [84, 50], [88, 72], [84, 92], [72, 105], [60, 108], [48, 105], [36, 92], [32, 72], [36, 50], [46, 28]]}
        spine={[[60, 26], [60, 92]]}
        scar={13}
        depth={0.84}
        seed={2}
      />
    </>
  ),
  levallois: (
    <>
      <Shadow rx={34} cy={112} />
      <Stone
        outline={[[60, 10], [94, 94], [78, 104], [60, 107], [42, 104], [26, 94]]}
        spine={[[60, 38], [60, 98]]}
        scar={30}
        depth={0.97}
        seed={4}
      />
      <path d="M60 10 L60 60 L44 104 M60 60 L76 104" fill="none" stroke={tone(FLINT, -24)} strokeWidth={0.9} />
    </>
  ),
  blade: (
    <>
      <Shadow rx={34} cy={113} />
      {/* a long blade with two ridges */}
      <path d="M34 108 L36 34 Q40 12 48 9 Q54 22 55 44 L52 108 Z" fill={tone(FLINT, 6)} />
      <path d="M34 108 L36 34 Q40 12 48 9 L41 40 L39 108 Z" fill={tone(FLINT, 18)} />
      <path d="M52 108 L55 44 Q54 22 48 9 L48 40 L47 108 Z" fill={tone(FLINT, -8)} />
      <path d="M34 108 L36 34 Q40 12 48 9 Q54 22 55 44 L52 108 Z" fill="none" stroke={INK} strokeWidth={1.1} strokeLinejoin="round" opacity={0.75} />
      {/* a bone point with a split base */}
      <path d="M78 108 L80 40 L84 8 L88 40 L90 108 L84 98 Z" fill={IVORY} stroke="#8c7b52" strokeWidth={1} strokeLinejoin="round" />
      <path d="M84 8 L88 40 L90 108 L84 98 Z" fill={IVORY_D} opacity={0.7} />
      <path d="M82 50 L82 92 M86 46 L86 94" stroke="#8c7b52" strokeWidth={0.5} opacity={0.6} />
    </>
  ),
  hearth: (
    <>
      <ellipse cx={60} cy={92} rx={48} ry={14} fill="#2b2118" opacity={0.2} />
      <circle cx={60} cy={62} r={40} fill="url(#ta-glow)" />
      <rect x={28} y={84} width={62} height={8} rx={4} fill={WOOD_D} transform="rotate(-12 60 88)" />
      <rect x={30} y={84} width={62} height={8} rx={4} fill={WOOD} transform="rotate(14 60 88)" />
      <path d="M60 14 C74 34 84 46 82 64 C80 82 70 90 60 90 C48 90 37 82 37 66 C37 54 44 48 48 36 C52 44 54 48 58 50 C60 38 60 26 60 14 Z" fill="#e2562d" />
      <path d="M61 34 C70 48 76 56 74 68 C72 82 66 88 60 88 C52 88 45 82 45 71 C45 63 50 59 52 52 C55 58 57 60 60 61 C61 52 61 43 61 34 Z" fill="#f59a23" />
      <path d="M61 56 C66 64 69 68 68 75 C67 83 64 87 60 87 C55 87 52 83 52 77 C52 72 55 70 56 66 C58 69 59 70 60 71 C61 66 61 61 61 56 Z" fill="#ffd866" />
      {[
        [22, 92, 11, 8],
        [40, 100, 12, 8],
        [62, 103, 12, 8],
        [83, 99, 12, 8],
        [99, 91, 10, 7.5],
      ].map(([x, y, rx, ry], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={["#8d9399", "#797f86", "#9aa0a5", "#82888e", "#8d9399"][i]} stroke={INK} strokeWidth={0.9} />
          <ellipse cx={x - rx * 0.25} cy={y - ry * 0.35} rx={rx * 0.45} ry={ry * 0.3} fill="#fff" opacity={0.25} />
        </g>
      ))}
    </>
  ),
  spear: (
    <>
      <ellipse cx={58} cy={110} rx={46} ry={3.5} fill="#0d2118" opacity={0.12} />
      <g transform="rotate(-42 60 60)">
        <path d="M-8 57.4 L96 56.6 L122 60 L96 63.4 L-8 62.6 Z" fill={WOOD_L} stroke={WOOD_D} strokeWidth={0.9} strokeLinejoin="round" />
        <path d="M-8 60 L122 60 L96 63.4 L-8 62.6 Z" fill={WOOD} opacity={0.75} />
        <path d="M92 56.7 L122 60 L92 63.3 Z" fill="#3f2a18" opacity={0.75} />
        <path d="M0 59 L60 58.6 M10 61.4 L84 61.2 M30 58 L40 58" stroke={WOOD_D} strokeWidth={0.4} opacity={0.6} />
        <path d="M36 57 q1.5 3 0 6 M70 57 q1.5 3 0 6" stroke={WOOD_D} strokeWidth={0.6} fill="none" opacity={0.7} />
      </g>
    </>
  ),
  grave: (
    <>
      <ellipse cx={60} cy={64} rx={54} ry={38} fill="#b89a74" />
      <ellipse cx={60} cy={66} rx={47} ry={31} fill="#6f5238" />
      <ellipse cx={60} cy={69} rx={44} ry={27} fill="#5b4330" />
      {/* a body laid on its side, knees drawn up */}
      <g fill="none" stroke={IVORY} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M40 62 C50 70 62 72 74 68" />
        <path d="M74 68 L88 58 L80 80" />
        <path d="M80 80 L92 82" />
        <path d="M46 66 L52 80 L64 76" />
        <path d="M50 67 L60 58 L68 62" />
      </g>
      <g stroke={IVORY} strokeWidth={1.4} strokeLinecap="round" opacity={0.9}>
        <path d="M50 64 L49 72 M55 67 L54 75 M60 69 L59 76 M65 70 L65 76" />
      </g>
      <ellipse cx={33} cy={57} rx={8.5} ry={7.5} fill={IVORY} />
      <circle cx={30.5} cy={57} r={1.6} fill="#5b4330" />
      {Array.from({ length: 16 }, (_, i) => (
        <circle key={i} cx={30 + hash(i) * 60} cy={54 + hash(i + 40) * 30} r={0.9 + hash(i + 3)} fill="#b23a22" opacity={0.75} />
      ))}
    </>
  ),
  ochre: (
    <>
      <Shadow rx={40} cy={108} />
      <path d="M18 106 C34 100 50 104 62 102 C54 108 30 110 18 106 Z" fill="#b23a22" opacity={0.55} />
      <Stone
        outline={[[26, 86], [38, 40], [70, 20], [92, 44], [88, 84], [56, 100]]}
        spine={[[60, 60]]}
        stone={OCHRE}
        scar={60}
        depth={0.9}
        seed={7}
      />
      {/* the face worn flat by grinding */}
      <path d="M38 40 L70 20 L78 30 L46 52 Z" fill={tone(OCHRE, 16)} stroke={tone(OCHRE, -18)} strokeWidth={0.6} />
      <path d="M44 42 L70 25 M47 46 L74 28 M42 39 L66 24" stroke={tone(OCHRE, -14)} strokeWidth={0.6} opacity={0.8} />
    </>
  ),
  beads: (
    <>
      <path d="M8 26 C22 86 98 86 112 26" fill="none" stroke="#9a7a4a" strokeWidth={1.6} />
      {[
        [20, 52, -62],
        [36, 68, -36],
        [60, 74, 0],
        [84, 68, 36],
        [100, 52, 62],
      ].map(([x, y, r], i) => (
        <g key={i} transform={`rotate(${r} ${x} ${y})`}>
          <path d={`M${x - 9} ${y + 2} C${x - 10} ${y - 9} ${x + 10} ${y - 9} ${x + 9} ${y + 2} C${x + 7} ${y + 12} ${x - 7} ${y + 12} ${x - 9} ${y + 2} Z`} fill="#eadcc0" stroke="#8c7450" strokeWidth={1} />
          <path d={`M${x - 6} ${y + 5} C${x - 2} ${y + 9} ${x + 4} ${y + 8} ${x + 7} ${y + 3}`} fill="none" stroke="#b79b6c" strokeWidth={1.4} />
          <path d={`M${x - 7} ${y - 1} C${x - 3} ${y - 6} ${x + 3} ${y - 6} ${x + 7} ${y - 1}`} fill="none" stroke="#fff" strokeWidth={1.2} opacity={0.7} />
          <circle cx={x} cy={y - 3.5} r={2} fill="#4a3a26" />
        </g>
      ))}
    </>
  ),
  engraved: (
    <>
      <Shadow rx={46} cy={96} ry={6} />
      <path d="M12 44 L100 30 L108 70 L20 86 Z" fill={tone(OCHRE, 2)} />
      <path d="M20 86 L108 70 L106 80 L22 96 Z" fill={tone(OCHRE, -16)} />
      <path d="M12 44 L20 86 L22 96 L14 54 Z" fill={tone(OCHRE, -10)} />
      <g stroke="#f3c9b4" strokeWidth={1.1} strokeLinecap="round" opacity={0.95}>
        <path d="M18 52 L102 38 M21 68 L105 53 M23 80 L106 65" />
        <path d="M26 50 L40 78 M42 47 L56 75 M58 45 L72 72 M74 42 L88 69 M90 40 L102 62" />
        <path d="M26 78 L42 47 M42 76 L58 45 M58 73 L74 42 M74 70 L90 40 M90 67 L102 46" />
      </g>
      <path d="M12 44 L100 30 L108 70 L106 80 L22 96 L14 54 Z" fill="none" stroke={INK} strokeWidth={1} strokeLinejoin="round" opacity={0.6} />
    </>
  ),
  painting: (
    <>
      <path d="M8 22 C30 10 90 8 112 20 C118 50 116 86 108 104 C80 114 36 112 12 102 C4 76 4 46 8 22 Z" fill="#cdb38b" />
      <path d="M8 22 C30 10 90 8 112 20 C118 50 116 86 108 104 C80 114 36 112 12 102 C4 76 4 46 8 22 Z" fill="url(#ta-shade)" />
      {Array.from({ length: 30 }, (_, i) => (
        <circle key={i} cx={12 + hash(i) * 96} cy={18 + hash(i + 50) * 84} r={0.8 + hash(i + 7) * 1.4} fill="#8f7650" opacity={0.3} />
      ))}
      {/* a pig in red ochre */}
      <path d="M16 68 C20 50 34 44 52 46 C62 47 68 44 74 40 L79 43 L77 50 C83 55 84 64 78 70 L78 84 L73 84 L71 73 L40 75 L38 86 L33 86 L32 75 C24 75 18 73 16 68 Z" fill="#9c2f1c" />
      <path d="M74 40 L72 33 M77 50 L84 51 M16 68 L11 63" stroke="#9c2f1c" strokeWidth={1.8} strokeLinecap="round" />
      <path d="M40 46 L42 41 M46 46 L48 41 M52 46 L54 42 M58 46 L60 42" stroke="#9c2f1c" strokeWidth={1.3} strokeLinecap="round" />
      <path d="M24 62 C34 56 48 56 62 60" stroke="#6d1f12" strokeWidth={1} fill="none" opacity={0.6} />
      {/* a hand stencil: pigment blown around a hand held to the wall */}
      <circle cx={92} cy={82} r={19} fill="url(#ta-spray)" />
      <path d="M86 96 L85 84 L80 78 L82 76 L87 80 L86 68 L88.5 68 L90 78 L91 66 L93.5 66 L94 78 L96 68 L98.5 68.5 L97.5 80 L100 73 L102 74 L100 86 L99 96 Z" fill="#cdb38b" />
    </>
  ),
  hafted: (
    <>
      <ellipse cx={58} cy={111} rx={44} ry={3.5} fill="#0d2118" opacity={0.12} />
      <g transform="rotate(-42 60 60)">
        <path d="M-10 56.5 L80 56.5 L80 63.5 L-10 63.5 Z" fill={WOOD_L} stroke={WOOD_D} strokeWidth={0.9} />
        <path d="M-10 60 L80 60 L80 63.5 L-10 63.5 Z" fill={WOOD} opacity={0.75} />
        <Stone outline={[[70, 50], [96, 53], [124, 60], [96, 67], [70, 70]]} spine={[[76, 60], [112, 60]]} scar={12} depth={0.85} seed={6} />
        {/* dark glue and a sinew wrapping */}
        <path d="M62 54.5 L80 51 L80 69 L62 65.5 Z" fill="#33261c" />
        {[58, 62, 66, 70, 74].map((x) => (
          <path key={x} d={`M${x} 53.5 L${x + 4} 66.5`} stroke="#d9c29a" strokeWidth={2.2} strokeLinecap="round" />
        ))}
      </g>
    </>
  ),
  wheat: (
    <>
      <Shadow rx={22} cy={113} ry={3.5} />
      <path d="M60 112 C60 90 60 70 60 52" stroke="#9a8a3c" strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <path d="M60 96 C70 90 82 92 92 102 C80 100 70 100 60 100 Z" fill="#a9b04a" />
      <path d="M60 84 C50 78 38 80 28 90 C40 88 50 88 60 88 Z" fill="#b6bb55" />
      {[58, 46, 34, 22].map((y, i) => (
        <g key={y}>
          <ellipse cx={51} cy={y} rx={5.2} ry={8.5} transform={`rotate(-24 51 ${y})`} fill="#e3b53e" stroke="#a37a16" strokeWidth={0.8} />
          <ellipse cx={69} cy={y} rx={5.2} ry={8.5} transform={`rotate(24 69 ${y})`} fill="#d9a62d" stroke="#a37a16" strokeWidth={0.8} />
          <ellipse cx={60} cy={y - 6} rx={5} ry={8.5} fill="#efc758" stroke="#a37a16" strokeWidth={0.8} />
          <path d={`M47 ${y - 7} L${40 - i} ${y - 24} M73 ${y - 7} L${80 + i} ${y - 24} M60 ${y - 14} L60 ${y - 30}`} stroke="#b8922c" strokeWidth={0.7} />
        </g>
      ))}
    </>
  ),
  bone: (
    <>
      <ellipse cx={58} cy={104} rx={46} ry={4} fill="#0d2118" opacity={0.12} />
      <g transform="rotate(-32 60 60)">
        <path d="M2 50 C-6 46 -4 36 5 38 C10 34 18 38 17 46 L20 51 L88 51 L104 46 L118 50 L108 58 L120 64 L104 70 L88 69 L20 69 L17 74 C18 82 10 86 5 82 C-4 84 -6 74 2 70 C-2 64 -2 56 2 50 Z" fill={IVORY} stroke="#8c7b52" strokeWidth={1.1} strokeLinejoin="round" />
        <path d="M20 62 L88 62 L104 70 L88 69 L20 69 L17 74 C18 82 10 86 5 82 C-4 84 -6 74 2 70 Z" fill={IVORY_D} opacity={0.6} />
        {/* flake scars at the worked end */}
        <path d="M88 51 L104 46 L100 56 Z M104 46 L118 50 L108 58 L100 56 Z M108 58 L120 64 L104 70 L99 62 Z M88 69 L104 70 L99 62 L90 62 Z" fill="#d8c79c" stroke="#8c7b52" strokeWidth={0.6} strokeLinejoin="round" />
        <path d="M26 56 L80 56" stroke="#fff" strokeWidth={2} strokeLinecap="round" opacity={0.6} />
      </g>
    </>
  ),
  bow: (
    <>
      <path d="M34 8 L34 112" stroke="#d9c9a4" strokeWidth={1} />
      <path d="M34 8 C74 26 74 94 34 112" fill="none" stroke={WOOD_D} strokeWidth={5.6} strokeLinecap="round" />
      <path d="M34 8 C74 26 74 94 34 112" fill="none" stroke={WOOD_L} strokeWidth={2.4} strokeLinecap="round" />
      <path d="M58 52 L61 68" stroke="#d9c29a" strokeWidth={6.5} strokeLinecap="butt" />
      {/* arrow */}
      <path d="M12 60 L100 60" stroke="#c9a468" strokeWidth={2.2} />
      <path d="M12 60 L4 53 L18 57 Z M12 60 L4 67 L18 63 Z" fill="#e9e3d3" stroke="#8c7b52" strokeWidth={0.6} />
      <path d="M96 60 L92 56 M96 60 L92 64" stroke="#33261c" strokeWidth={2} />
      <g>
        <path d="M98 55 L116 60 L98 65 Z" fill={tone(FLINT, 8)} stroke={INK} strokeWidth={0.8} strokeLinejoin="round" />
        <path d="M98 60 L116 60 L98 65 Z" fill={tone(FLINT, -10)} />
      </g>
    </>
  ),
  raft: (
    <>
      <clipPath id="ta-raft">
        <rect x={2} y={2} width={116} height={114} rx={14} />
      </clipPath>
      <g clipPath="url(#ta-raft)">
      <path d="M0 76 C10 70 20 82 30 76 C40 70 50 82 60 76 C70 70 80 82 90 76 C100 70 110 82 120 76 L120 120 L0 120 Z" fill="#7fb7c9" />
      <path d="M0 92 C10 86 20 98 30 92 C40 86 50 98 60 92 C70 86 80 98 90 92 C100 86 110 98 120 92 L120 120 L0 120 Z" fill="#5c9db3" />
      {/* bamboo lashed side by side */}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x={14 + i * 3} y={58 + i * 5} width={86} height={6.5} rx={3.2} fill={["#c9b86a", "#b9a655", "#d2c278", "#bba95a", "#c5b364"][i]} stroke="#6f6228" strokeWidth={0.7} />
          <path d={`M${40 + i * 3} ${58 + i * 5} v6.5 M${70 + i * 3} ${58 + i * 5} v6.5`} stroke="#6f6228" strokeWidth={0.8} />
        </g>
      ))}
      <path d="M30 56 L44 86 M84 56 L98 86" stroke="#7a5a2c" strokeWidth={2.4} strokeLinecap="round" />
      {/* a paddler */}
      <circle cx={62} cy={32} r={5.5} fill="#3b2f26" />
      <path d="M62 38 L60 58 L72 62 M61 44 L74 48 L78 40" stroke="#3b2f26" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M84 24 L72 76" stroke={WOOD} strokeWidth={2} strokeLinecap="round" />
      <path d="M72 76 L68 90 L74 91 Z" fill={WOOD} stroke={WOOD_D} strokeWidth={0.6} />
      <path d="M0 106 C10 100 20 112 30 106 C40 100 50 112 60 106 C70 100 80 112 90 106 C100 100 110 112 120 106" fill="none" stroke="#fff" strokeWidth={1.2} opacity={0.5} />
      </g>
    </>
  ),
  logs: (
    <>
      <Shadow rx={48} cy={100} ry={6} />
      {/* lower log */}
      <g transform="rotate(-10 60 74)">
        <rect x={6} y={64} width={104} height={20} rx={3} fill={WOOD} stroke={WOOD_D} strokeWidth={1} />
        <rect x={6} y={64} width={104} height={7} rx={3} fill={WOOD_L} opacity={0.6} />
        <path d="M14 72 L60 71 M30 78 L96 77 M20 68 L44 68" stroke={WOOD_D} strokeWidth={0.6} opacity={0.6} />
        <ellipse cx={110} cy={74} rx={4.5} ry={10} fill="#d9b98a" stroke={WOOD_D} strokeWidth={1} />
        <ellipse cx={110} cy={74} rx={2.4} ry={5.5} fill="none" stroke={WOOD} strokeWidth={0.8} />
        {/* the cut notch */}
        <path d="M46 64 C48 74 66 74 68 64 Z" fill="#e4c898" stroke={WOOD_D} strokeWidth={0.9} />
        <path d="M50 66 L52 70 M56 66 L57 71 M62 66 L62 70" stroke={WOOD} strokeWidth={0.7} />
      </g>
      {/* upper log lying across it, seated in the notch */}
      <g transform="rotate(64 58 58)">
        <rect x={10} y={50} width={100} height={17} rx={3} fill="#9a6a3f" stroke={WOOD_D} strokeWidth={1} />
        <rect x={10} y={50} width={100} height={6} rx={3} fill="#c4935c" opacity={0.6} />
        <path d="M18 60 L70 59 M40 63 L100 62" stroke={WOOD_D} strokeWidth={0.6} opacity={0.6} />
        <ellipse cx={10} cy={58.5} rx={4} ry={8.5} fill="#d9b98a" stroke={WOOD_D} strokeWidth={1} />
      </g>
    </>
  ),
  cord: (
    <>
      <path d="M14 82 C40 92 80 92 106 82" stroke="#0d2118" strokeWidth={5} opacity={0.1} fill="none" strokeLinecap="round" />
      {ropeBeads(19, 12, 66, 108, 66, 7, 6)}
      <path d="M8 62 L2 56 M8 66 L0 66 M9 70 L3 76 M112 62 L118 56 M112 66 L120 66 M111 70 L117 76" stroke="#b08a4f" strokeWidth={1.2} strokeLinecap="round" />
      {/* the three plies it is twisted from */}
      <g opacity={0.9}>
        <path d="M34 22 C44 14 52 30 62 22 C72 14 80 30 90 22" fill="none" stroke="#c9a66b" strokeWidth={2.4} strokeLinecap="round" />
        <path d="M34 28 C44 20 52 36 62 28 C72 20 80 36 90 28" fill="none" stroke="#b08a4f" strokeWidth={2.4} strokeLinecap="round" />
        <path d="M34 34 C44 26 52 42 62 34 C72 26 80 42 90 34" fill="none" stroke="#d8ba84" strokeWidth={2.4} strokeLinecap="round" />
      </g>
    </>
  ),
  pot: (
    <>
      <Shadow rx={34} cy={110} />
      <path d="M36 20 L84 20 L80 30 C98 40 104 60 98 80 C92 100 76 110 60 110 C44 110 28 100 22 80 C16 60 22 40 40 30 Z" fill="url(#ta-clay)" stroke="#5e3b20" strokeWidth={1.2} strokeLinejoin="round" />
      <ellipse cx={60} cy={20} rx={24} ry={5.5} fill="#3b2617" stroke="#5e3b20" strokeWidth={1.2} />
      <path d="M38 22 C46 28 74 28 82 22" fill="none" stroke="#c98d5c" strokeWidth={1.4} />
      {/* cord-marked surface */}
      <g stroke="#7a4a28" strokeWidth={0.9} opacity={0.55} strokeLinecap="round">
        {[44, 52, 60, 68, 76, 84].map((y, r) =>
          Array.from({ length: 9 }, (_, i) => {
            const half = [32, 37, 39, 38, 34, 27][r];
            const x = 60 - half + (i + 0.5) * ((half * 2) / 9);
            return <path key={`${y}-${i}`} d={`M${x} ${y} l3 4`} />;
          }),
        )}
      </g>
      <path d="M26 84 C34 104 50 110 60 110 C70 110 86 104 94 84 C84 98 72 102 60 102 C48 102 36 98 26 84 Z" fill="#2b1c12" opacity={0.45} />
      <path d="M34 44 C30 54 29 64 31 74" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.3} />
    </>
  ),
  hook: (
    <>
      <Shadow rx={30} cy={110} ry={4} />
      <path d="M72 16 C74 40 76 60 72 78 C68 96 50 102 38 92 C30 85 30 74 36 66" fill="none" stroke="#8c7b52" strokeWidth={11} strokeLinecap="round" />
      <path d="M72 16 C74 40 76 60 72 78 C68 96 50 102 38 92 C30 85 30 74 36 66" fill="none" stroke="url(#ta-pearl)" strokeWidth={8.6} strokeLinecap="round" />
      <path d="M70 20 C72 42 73 60 69 76 C66 90 54 95 44 90" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" opacity={0.75} />
      {/* line tied at the notched shank */}
      <path d="M66 20 L78 18 M66 24 L78 22" stroke="#7a5a2c" strokeWidth={1.6} strokeLinecap="round" />
      <path d="M73 14 C78 8 86 6 96 4" fill="none" stroke="#9a7a4a" strokeWidth={1.3} />
    </>
  ),
  flute: (
    <>
      <ellipse cx={60} cy={104} rx={46} ry={4} fill="#0d2118" opacity={0.12} />
      <g transform="rotate(-36 60 60)">
        <rect x={2} y={52} width={116} height={15} rx={6} fill={IVORY} stroke="#8c7b52" strokeWidth={1.1} />
        <rect x={2} y={60} width={116} height={7} rx={3.5} fill={IVORY_D} opacity={0.65} />
        <path d="M10 55.5 L108 55.5" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" opacity={0.7} />
        {[34, 50, 66, 82, 98].map((x) => (
          <g key={x}>
            <ellipse cx={x} cy={59.5} rx={3.6} ry={3} fill="#3b2f26" />
            <path d={`M${x - 3.6} ${59.5} a3.6 3 0 0 1 7.2 0`} fill="none" stroke="#8c7b52" strokeWidth={0.8} />
          </g>
        ))}
        <ellipse cx={117} cy={59.5} rx={2.6} ry={5.6} fill="#5a4a36" />
        {/* the V-shaped mouth end */}
        <path d="M2 54 L9 59.5 L2 65 Z" fill="#f7f1e2" stroke="#8c7b52" strokeWidth={0.8} />
        <path d="M22 53 v2 M25 53 v2 M28 53 v2" stroke="#8c7b52" strokeWidth={0.7} />
      </g>
    </>
  ),
  shell: (
    <>
      <Shadow rx={44} cy={104} ry={5} />
      <path d="M10 66 C10 40 36 22 64 22 C92 22 112 40 112 60 C112 82 88 98 56 98 C32 98 10 86 10 66 Z" fill="url(#ta-shell)" stroke="#4a3a26" strokeWidth={1.2} />
      {/* growth lines */}
      <g fill="none" stroke="#3b2f1e" strokeWidth={0.7} opacity={0.45}>
        <path d="M18 66 C20 46 40 32 64 31 C86 30 102 44 104 60" />
        <path d="M27 66 C29 51 44 40 64 39 C82 38 94 49 96 60" />
        <path d="M36 66 C38 55 49 47 64 47 C77 47 86 54 88 61" />
        <path d="M46 66 C47 60 54 55 64 55 C72 55 78 59 79 63" />
      </g>
      {/* the engraved zigzag */}
      <path d="M26 76 L36 60 L45 78 L55 61 L64 79 L74 62 L83 78 L93 63" fill="none" stroke="#f1e6cf" strokeWidth={1.7} strokeLinejoin="round" strokeLinecap="round" />
      <path d="M26 77 L36 61 L45 79 L55 62 L64 80 L74 63 L83 79 L93 64" fill="none" stroke="#2b2114" strokeWidth={0.6} strokeLinejoin="round" opacity={0.6} />
      <path d="M24 46 C34 34 50 28 66 28" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" opacity={0.3} />
    </>
  ),
};

/** Gradients shared by the drawings. Ids repeat across instances with identical content. */
function Defs() {
  return (
    <defs>
      <linearGradient id="ta-shade" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
        <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.2" />
      </linearGradient>
      <radialGradient id="ta-glow">
        <stop offset="0" stopColor="#ffb648" stopOpacity="0.55" />
        <stop offset="1" stopColor="#ffb648" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="ta-spray">
        <stop offset="0.35" stopColor="#9c2f1c" stopOpacity="0.9" />
        <stop offset="1" stopColor="#9c2f1c" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="ta-clay" x1="0" y1="0" x2="1" y2="0.3">
        <stop offset="0" stopColor="#c98d5c" />
        <stop offset="0.55" stopColor="#a8693d" />
        <stop offset="1" stopColor="#7a4a28" />
      </linearGradient>
      <linearGradient id="ta-pearl" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f7f1e2" />
        <stop offset="0.5" stopColor="#e6dcc2" />
        <stop offset="1" stopColor="#cdbf9c" />
      </linearGradient>
      <linearGradient id="ta-shell" x1="0" y1="0" x2="0.6" y2="1">
        <stop offset="0" stopColor="#a8926a" />
        <stop offset="0.6" stopColor="#7d6947" />
        <stop offset="1" stopColor="#5a4a30" />
      </linearGradient>
    </defs>
  );
}

export function ToolArt({
  art,
  size = 64,
  className = "",
}: {
  art: ToolArtKey;
  size?: number;
  className?: string;
}) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 120 120" className={className}>
      <Defs />
      {ART[art]}
    </svg>
  );
}

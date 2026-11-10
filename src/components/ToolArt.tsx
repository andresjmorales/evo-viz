import type { ReactNode } from "react";
import type { ToolArtKey } from "@/data/culture";

/**
 * Simple outline drawings of each tool or behaviour, drawn on a 64-unit grid.
 * They are schematic: shapes follow the typical form of each kind of object,
 * not a particular specimen.
 */
const ART: Record<ToolArtKey, ReactNode> = {
  lomekwi: (
    <>
      <path d="M12 40 L16 22 L28 13 L44 15 L54 27 L52 44 L38 52 L22 51 Z" />
      <path d="M16 22 L26 30 L28 13 M26 30 L44 15 M26 30 L32 51 M44 34 L54 27 M44 34 L38 52 M26 30 L44 34" opacity="0.55" />
    </>
  ),
  chopper: (
    <>
      <path d="M10 38 C10 50 22 56 32 56 C44 56 54 50 54 38 L49 33 L45 37 L40 29 L35 35 L30 28 L25 35 L19 30 L15 36 Z" />
      <path d="M19 30 L22 40 M30 28 L31 40 M40 29 L38 40 M49 33 L46 40" opacity="0.55" />
      <path d="M44 10 L56 14 L52 23 L42 19 Z" />
    </>
  ),
  handaxe: (
    <>
      <path d="M32 6 C40 16 49 32 48 44 C47 54 40 58 32 58 C24 58 17 54 16 44 C15 32 24 16 32 6 Z" />
      <path d="M32 6 L30 22 L22 30 M30 22 L40 28 M22 30 L24 44 L32 58 M40 28 L42 44 L32 58 M24 44 L42 44 M30 22 L32 36 L24 44 M32 36 L42 44" opacity="0.55" />
    </>
  ),
  levallois: (
    <>
      <path d="M32 6 L50 52 C44 57 20 57 14 52 Z" />
      <path d="M32 6 L32 32 L22 54 M32 32 L42 54 M32 32 L18 46 M32 32 L46 46" opacity="0.55" />
    </>
  ),
  blade: (
    <>
      <path d="M20 58 L22 14 C24 8 28 6 30 6 C32 10 33 14 32 22 L30 58 Z" />
      <path d="M26 8 L25 58" opacity="0.55" />
      <path d="M42 58 L44 20 L46 6 L48 20 L50 58 Z" />
      <path d="M43 28 L49 28 M43 40 L49 40" opacity="0.55" />
    </>
  ),
  hearth: (
    <>
      <path d="M32 12 C38 20 42 24 42 32 C42 38 37 42 32 42 C27 42 22 38 22 32 C22 26 26 24 28 18 C30 22 31 24 33 25 C33 20 32 16 32 12 Z" />
      <path d="M32 42 C35 40 36 36 34 32 C32 35 29 36 29 39" opacity="0.55" />
      <ellipse cx="13" cy="48" rx="6" ry="4" />
      <ellipse cx="25" cy="52" rx="6" ry="4" />
      <ellipse cx="39" cy="52" rx="6" ry="4" />
      <ellipse cx="51" cy="48" rx="6" ry="4" />
      <path d="M20 46 L44 46" opacity="0.55" />
    </>
  ),
  spear: (
    <>
      <path d="M8 58 L52 14" />
      <path d="M52 14 L60 4 L55 16 Z" />
      <path d="M11 57 L9 55 M31 37 L33 35" opacity="0.55" />
    </>
  ),
  grave: (
    <>
      <ellipse cx="32" cy="38" rx="27" ry="15" />
      <circle cx="18" cy="33" r="5" />
      <path d="M22 37 C30 42 36 42 42 38 M30 41 L36 46 L44 44 M42 38 L48 34 L44 30 M27 39 L28 33 L36 34" />
    </>
  ),
  ochre: (
    <>
      <path d="M14 50 L22 22 L40 12 L50 26 L46 48 L28 56 Z" />
      <path d="M22 22 L32 30 L40 12 M32 30 L46 48" opacity="0.55" />
      <path d="M26 36 L36 32 M27 40 L38 36 M28 44 L39 40" opacity="0.7" />
    </>
  ),
  beads: (
    <>
      <path d="M6 18 C14 46 50 46 58 18" opacity="0.55" />
      {[
        [13, 31],
        [22, 38],
        [32, 41],
        [42, 38],
        [51, 31],
      ].map(([x, y]) => (
        <g key={x}>
          <path d={`M${x - 5} ${y + 1} C${x - 5} ${y - 6} ${x + 5} ${y - 6} ${x + 5} ${y + 1} C${x + 4} ${y + 7} ${x - 4} ${y + 7} ${x - 5} ${y + 1} Z`} />
          <circle cx={x} cy={y - 1} r="1.4" />
        </g>
      ))}
    </>
  ),
  engraved: (
    <>
      <path d="M6 24 L54 16 L58 40 L10 48 Z" />
      <path d="M12 30 L52 23 M13 41 L55 34 M16 28 L22 44 M24 27 L30 43 M32 25 L38 41 M40 24 L46 40 M48 22 L53 38 M16 44 L24 27 M24 43 L32 25 M32 42 L40 24 M40 40 L48 22" opacity="0.75" />
    </>
  ),
  painting: (
    <>
      <path d="M8 46 C12 30 22 26 34 28 C42 29 46 26 50 22 L54 24 L52 30 C56 34 56 42 50 46 L50 54 L46 54 L45 47 L22 48 L20 56 L16 56 L16 48 C12 48 9 48 8 46 Z" />
      <path d="M50 22 L48 16 M52 30 L57 31" />
      <circle cx="49" cy="27" r="0.8" />
      <path d="M14 42 C20 38 30 38 40 40" opacity="0.55" />
    </>
  ),
  hafted: (
    <>
      <path d="M6 60 L36 22" />
      <path d="M10 60 L39 24" />
      <path d="M36 22 L52 6 L44 26 Z" />
      <path d="M33 22 L41 28 M30 26 L38 32 M27 30 L35 34" />
    </>
  ),
  wheat: (
    <>
      <path d="M32 60 L32 14" />
      {[18, 26, 34, 42].map((y) => (
        <g key={y}>
          <path d={`M32 ${y + 4} C26 ${y + 2} 24 ${y - 2} 25 ${y - 6} C29 ${y - 4} 32 ${y} 32 ${y + 4} Z`} />
          <path d={`M32 ${y + 4} C38 ${y + 2} 40 ${y - 2} 39 ${y - 6} C35 ${y - 4} 32 ${y} 32 ${y + 4} Z`} />
        </g>
      ))}
      <path d="M32 14 C30 10 31 7 32 4 C33 7 34 10 32 14 Z" />
      <path d="M32 50 C38 48 44 50 48 56" opacity="0.55" />
    </>
  ),
  bone: (
    <>
      <path d="M8 50 C4 46 6 40 11 41 C12 36 18 36 19 41 L42 22 L46 12 L52 9 L50 18 L56 16 L48 28 C46 30 44 30 43 29 L23 46 C27 49 25 55 20 54 C20 58 13 58 12 54 C9 55 7 53 8 50 Z" />
      <path d="M46 12 L46 22 M50 18 L45 24" opacity="0.55" />
    </>
  ),
  bow: (
    <>
      <path d="M18 6 C40 18 40 46 18 58" />
      <path d="M18 6 L18 58" opacity="0.7" />
      <path d="M8 32 L56 32" />
      <path d="M56 32 L49 28 L51 32 L49 36 Z" />
      <path d="M8 32 L4 28 M8 32 L4 36 M12 32 L8 28 M12 32 L8 36" opacity="0.7" />
    </>
  ),
  raft: (
    <>
      <path d="M8 34 L56 34 L52 42 L12 42 Z" />
      <path d="M16 34 L16 42 M24 34 L24 42 M32 34 L32 42 M40 34 L40 42 M48 34 L48 42" opacity="0.55" />
      <path d="M30 34 L30 10 L46 30 Z" />
      <path d="M4 50 C10 46 14 54 20 50 C26 46 30 54 36 50 C42 46 46 54 52 50 C56 47 58 50 60 50" />
      <path d="M10 58 C16 54 20 62 26 58 C32 54 36 62 42 58" opacity="0.55" />
    </>
  ),
  logs: (
    <>
      <path d="M4 44 L60 30 L60 38 L4 52 Z" />
      <path d="M22 14 L30 12 L44 58 L36 60 Z" />
      <path d="M28 38 C30 35 34 34 36 36" />
      <ellipse cx="60" cy="34" rx="2" ry="4" opacity="0.55" />
    </>
  ),
  cord: (
    <>
      <path d="M8 40 C14 28 20 28 24 34 C28 40 34 40 38 34 C42 28 48 28 56 22" />
      <path d="M8 26 C14 36 20 40 24 34 C28 28 34 28 38 34 C42 40 48 40 56 34" />
      <path d="M8 33 C14 32 20 34 24 34 C30 34 34 34 38 34 C44 34 50 30 56 28" opacity="0.55" />
    </>
  ),
  pot: (
    <>
      <path d="M20 10 L44 10 L42 16 C52 22 54 34 50 44 C46 54 38 58 32 58 C26 58 18 54 14 44 C10 34 12 22 22 16 Z" />
      <path d="M16 28 L48 28 M14 36 L50 36" opacity="0.55" />
      <path d="M20 30 L24 34 L28 30 L32 34 L36 30 L40 34 L44 30" opacity="0.55" />
    </>
  ),
  hook: (
    <>
      <path d="M40 6 L40 38 C40 50 34 56 26 56 C18 56 14 50 14 44 C14 40 16 38 18 36 L22 42" />
      <path d="M36 6 L44 6 L44 12 L36 12 Z" />
      <path d="M22 42 L18 44 L18 36" />
    </>
  ),
  flute: (
    <>
      <path d="M10 46 L50 14 C53 12 56 14 56 17 C56 19 54 20 53 21 L14 52 C11 54 8 52 8 50 C8 48 9 47 10 46 Z" />
      <circle cx="22" cy="39" r="1.8" />
      <circle cx="29" cy="33.5" r="1.8" />
      <circle cx="36" cy="28" r="1.8" />
      <circle cx="43" cy="22.5" r="1.8" />
      <ellipse cx="54" cy="17.5" rx="1.6" ry="2.2" opacity="0.55" />
    </>
  ),
  shell: (
    <>
      <path d="M8 36 C8 22 22 12 36 12 C50 12 58 22 58 32 C58 44 46 52 30 52 C18 52 8 46 8 36 Z" />
      <path d="M14 28 C20 20 30 16 40 17" opacity="0.4" />
      <path d="M18 38 L23 30 L27 40 L32 31 L36 41 L41 32 L46 42" />
      <circle cx="44" cy="22" r="2.5" opacity="0.7" />
    </>
  ),
};

export function ToolArt({
  art,
  size = 64,
  className = "",
  strokeWidth = 1.8,
}: {
  art: ToolArtKey;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {ART[art]}
    </svg>
  );
}

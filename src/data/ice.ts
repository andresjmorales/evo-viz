/**
 * Approximate outlines of the ice sheets at the last glacial maximum, about
 * 21 thousand years ago, as [lon, lat] rings. They are simplified by hand
 * from the published reconstructions: Dyke (2004) for North America, Hughes
 * et al. (2016, DATED-1) for Eurasia, and the global summaries of Clark et
 * al. (2009) and Batchelor et al. (2019). Errors of a few degrees are likely,
 * especially offshore.
 *
 * The globe grows and shrinks these shapes with sea level: at the lowest
 * seas the outlines are drawn in full; as sea level rises the ice retreats
 * toward each sheet's centre. Separate sheets are listed separately so that
 * a gap can open between them, as the ice-free corridor did between the
 * Cordilleran and Laurentide sheets. Real retreat was uneven and earlier
 * glaciations had different shapes, so treat it as a sketch of scale.
 */
export interface IceSheet {
  id: string;
  name: string;
  ring: [number, number][];
}

export const ICE_SHEETS: IceSheet[] = [
  {
    id: "cordilleran",
    name: "Cordilleran",
    ring: [
      [-166, 54.5], [-160, 56], [-150, 58.5], [-140, 58.5], [-134, 54], [-130, 50],
      [-126, 47.5], [-122, 46.8], [-119, 48], [-115, 48.8], [-113.5, 50.5], [-116, 54.5],
      [-121, 58], [-126, 61], [-132, 63], [-138, 63.5], [-145, 62.5], [-152, 62],
      [-156, 60], [-162, 57.5],
    ],
  },
  {
    id: "laurentide",
    name: "Laurentide and Innuitian",
    ring: [
      [-113, 48.8], [-110, 48.5], [-104, 47.5], [-98, 45], [-95, 43], [-93.6, 41.6],
      [-91, 43], [-89, 42], [-88.5, 40], [-86, 39.5], [-84, 39.2], [-82, 40], [-80, 41.2],
      [-77, 41.6], [-74, 40.6], [-70, 41.3], [-66, 42.5], [-62, 43.5], [-57, 45],
      [-52, 46.5], [-52, 50], [-55, 54], [-58, 57], [-61, 60], [-63, 62], [-62, 66],
      [-64, 67], [-68, 70.5], [-74, 73.5], [-78, 76.5], [-73, 78.5], [-67, 80.5],
      [-62, 82.3], [-70, 83.2], [-90, 82], [-105, 79.5], [-120, 77.5], [-125, 74],
      [-130, 70.5], [-136, 68.5], [-133, 65.5], [-127, 62], [-121, 58.5], [-117, 55],
      [-114.5, 51],
    ],
  },
  {
    id: "greenland",
    name: "Greenland",
    ring: [
      [-44, 59], [-50, 61.5], [-54, 64], [-56, 67], [-58, 70], [-62, 74], [-70, 77],
      [-72, 79], [-60, 82.5], [-40, 83.8], [-20, 82.5], [-12, 80], [-14, 75], [-18, 72],
      [-22, 69], [-28, 67.5], [-35, 65], [-40, 62.5],
    ],
  },
  {
    id: "iceland",
    name: "Iceland",
    ring: [[-25, 63.5], [-25.5, 66.8], [-13, 67], [-11.5, 64.5], [-18, 62.6]],
  },
  {
    id: "british-irish",
    name: "British–Irish",
    ring: [
      [-11, 51.5], [-6.3, 49.9], [-4.5, 51.5], [-3, 52], [-1.5, 53], [0.5, 53], [2, 55],
      [2.5, 58], [-1, 61.2], [-4, 60], [-9, 58.5], [-11, 56], [-12, 54],
    ],
  },
  {
    id: "eurasian",
    name: "Scandinavian and Barents–Kara",
    ring: [
      [3, 57], [6, 56], [8, 55.8], [9.3, 55.5], [10, 54.5], [12, 53.8], [14, 52.8],
      [17, 52.3], [20, 53], [23, 54], [26, 54.5], [29, 55.5], [32, 56.5], [35, 58],
      [38, 60.5], [42, 62], [45, 63.8], [50, 65.5], [55, 67], [60, 68], [63, 69.5],
      [68, 72], [74, 75.5], [80, 79], [78, 81.3], [60, 81.8], [40, 81.5], [20, 81.5],
      [10, 80.5], [8, 78], [12, 75], [15, 72], [11, 69], [6, 66], [2, 63], [0, 61],
      [1.5, 58.5],
    ],
  },
  {
    id: "alps",
    name: "Alps",
    ring: [
      [5.3, 45], [6, 46.6], [8.5, 47.7], [11, 47.9], [13.5, 47.7], [15.5, 47.2],
      [14.5, 46.3], [11.5, 46], [9, 45.7], [7, 44.2],
    ],
  },
  {
    id: "patagonia",
    name: "Patagonian",
    ring: [
      [-72.5, -38.5], [-71, -38.5], [-70.8, -42], [-71, -46], [-71.5, -50], [-70, -52.5],
      [-67.5, -54.5], [-65.5, -55.2], [-68, -56], [-72, -54.5], [-75, -52], [-76, -48],
      [-75, -44.5], [-74, -41.5], [-73.5, -39],
    ],
  },
];

/** Ice that is still there today, drawn whatever the sea level. */
export const PRESENT_ICE_CLIP = {
  greenland: [
    [-74, 78], [-67, 80.5], [-62, 82.3], [-50, 84], [-20, 84], [-10, 81], [-17, 70],
    [-30, 67], [-42, 59], [-50, 60], [-58, 66], [-66, 75],
  ] as [number, number][],
  /** Everything south of this latitude. */
  antarcticaLat: -60,
};

/** Fraction of the full glacial ice to draw for a given fall in sea level, in metres. */
export function iceFraction(drop: number): number {
  return Math.min(1, Math.max(0, (drop - 10) / 115));
}

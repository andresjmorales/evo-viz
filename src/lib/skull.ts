import { taxa } from "@/data/taxa";

/**
 * A procedural skull. Each species is a short list of proportions (brain
 * volume, brow size, how far the jaw projects, and so on). Those numbers
 * drive a signed-distance field that is meshed with surface nets.
 *
 * It is a teaching model: the proportions follow published descriptions but
 * no real specimen is being reproduced.
 */
export interface SkullParams {
  cc: number;
  vault: number;
  brow: number;
  prog: number;
  faceW: number;
  nuchal: number;
  chin: number;
  crest: number;
  bun: number;
  tooth: number;
  face: number;
  canine: number;
}

const EXTRA: Record<string, Partial<SkullParams>> = {
  sahelanthropus: { cc: 360, face: 0.9, canine: 0.5, tooth: 1.0 },
  orrorin: { cc: 370, face: 0.9, canine: 0.6, tooth: 1.0 },
  ardipithecus: { cc: 325, face: 0.86, canine: 0.5, tooth: 0.95 },
  anamensis: { cc: 370, face: 0.98, canine: 0.65, tooth: 1.15 },
  afarensis: { cc: 450, face: 1.0, canine: 0.5, tooth: 1.2, crest: 0.15 },
  africanus: { cc: 460, face: 0.98, canine: 0.3, tooth: 1.25 },
  sediba: { cc: 430, face: 0.9, canine: 0.2, tooth: 1.0 },
  boisei: { cc: 500, face: 1.2, canine: 0.05, tooth: 1.7, crest: 1 },
  robustus: { cc: 490, face: 1.12, canine: 0.05, tooth: 1.55, crest: 0.7 },
  habilis: { cc: 610, face: 0.92, canine: 0.2, tooth: 1.1 },
  rudolfensis: { cc: 750, face: 1.06, canine: 0.2, tooth: 1.25 },
  erectus: { cc: 950, face: 1.0, canine: 0.15, tooth: 1.05, crest: 0.08 },
  floresiensis: { cc: 405, face: 0.8, canine: 0.1, tooth: 0.9 },
  naledi: { cc: 530, face: 0.86, canine: 0.1, tooth: 0.9 },
  antecessor: { cc: 1050, face: 0.98, canine: 0.1, tooth: 1.0 },
  heidelbergensis: { cc: 1230, face: 1.1, canine: 0.1, tooth: 1.0 },
  neanderthal: { cc: 1480, face: 1.12, canine: 0.1, tooth: 1.0, bun: 1 },
  denisovan: { cc: 1350, face: 1.12, canine: 0.1, tooth: 1.25, bun: 0.3 },
  longi: { cc: 1420, face: 1.14, canine: 0.1, tooth: 1.25, bun: 0.2 },
  sapiens: { cc: 1350, face: 0.92, canine: 0.05, tooth: 0.9 },
};

export function skullParams(taxonId: string): SkullParams {
  const t = taxa.find((x) => x.id === taxonId) ?? taxa[taxa.length - 1];
  const m = t.morph;
  return {
    cc: 600,
    vault: m.vault,
    brow: m.brow,
    prog: m.prognathism,
    faceW: m.faceWidth,
    nuchal: m.nuchal,
    chin: m.chin,
    crest: 0,
    bun: 0,
    tooth: 1,
    face: 1,
    canine: 0.2,
    ...EXTRA[t.id],
  };
}

export function lerpParams(a: SkullParams, b: SkullParams, t: number): SkullParams {
  const out = {} as SkullParams;
  (Object.keys(a) as (keyof SkullParams)[]).forEach((k) => {
    out[k] = a[k] + (b[k] - a[k]) * t;
  });
  return out;
}

// ---------- signed distance helpers ----------

function smin(a: number, b: number, k: number): number {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
}
function smax(a: number, b: number, k: number): number {
  return -smin(-a, -b, k);
}
/** Approximate ellipsoid distance (exact on the surface, good nearby). */
function ell(
  x: number, y: number, z: number,
  cx: number, cy: number, cz: number,
  rx: number, ry: number, rz: number,
): number {
  const px = (x - cx) / rx;
  const py = (y - cy) / ry;
  const pz = (z - cz) / rz;
  const k0 = Math.sqrt(px * px + py * py + pz * pz);
  const qx = px / rx;
  const qy = py / ry;
  const qz = pz / rz;
  const k1 = Math.sqrt(qx * qx + qy * qy + qz * qz);
  return k1 < 1e-9 ? -Math.min(rx, ry, rz) : (k0 * (k0 - 1)) / k1;
}
function cap(
  x: number, y: number, z: number,
  ax: number, ay: number, az: number,
  bx: number, by: number, bz: number,
  r: number,
): number {
  const pax = x - ax, pay = y - ay, paz = z - az;
  const bax = bx - ax, bay = by - ay, baz = bz - az;
  let h = (pax * bax + pay * bay + paz * baz) / (bax * bax + bay * bay + baz * baz);
  h = h < 0 ? 0 : h > 1 ? 1 : h;
  const dx = pax - bax * h, dy = pay - bay * h, dz = paz - baz * h;
  return Math.sqrt(dx * dx + dy * dy + dz * dz) - r;
}

/** Landmarks shared by the cranium, the jaw and the teeth. */
export interface SkullFrame {
  k: number;
  cy: number; cz: number;
  rx: number; ry: number; rz: number;
  zF: number; yO: number; fw: number; fs: number;
  yBase: number;
  snoutZ: number; snoutY: number;
  yTeeth: number;
  arcW: number; arcL: number; arcP: number;
  zJoint: number; yJoint: number;
}

export function frame(p: SkullParams): SkullFrame {
  const k = Math.cbrt(p.cc / 1350);
  const rx = k * (0.63 + 0.07 * p.vault);
  const ry = k * (0.5 + 0.17 * p.vault);
  const rz = k * (0.97 - 0.11 * p.vault);
  const cy = 0.08 + ry * 0.42;
  const cz = -0.2 - 0.12 * k;
  const zF = cz + rz * 0.84 - 0.07 * p.vault;
  const yO = cy - ry * 0.36 - 0.02;
  const fw = (0.82 + 0.34 * p.faceW) * (0.9 + 0.1 * p.face);
  const fs = p.face;
  const snoutY = yO - 0.5 * fs;
  const snoutZ = zF + 0.03 + 0.4 * p.prog;
  const yTeeth = snoutY - 0.2 * fs;
  return {
    k, cy, cz, rx, ry, rz, zF, yO, fw, fs,
    yBase: cy - ry * 0.88,
    snoutY, snoutZ, yTeeth,
    arcW: 0.27 + 0.045 * p.tooth + 0.03 * p.faceW,
    arcL: 0.5 + 0.2 * p.prog + 0.08 * p.tooth,
    arcP: 2 + 1.6 * Math.min(1, p.prog * 1.4),
    zJoint: zF - 0.62 - 0.05 * p.prog,
    yJoint: yO - 0.28,
  };
}

/** Rounded box, half-sizes (bx, by, bz), corner radius r. */
function rbox(
  x: number, y: number, z: number,
  cx: number, cy: number, cz: number,
  bx: number, by: number, bz: number,
  r: number,
): number {
  const qx = Math.abs(x - cx) - bx + r;
  const qy = Math.abs(y - cy) - by + r;
  const qz = Math.abs(z - cz) - bz + r;
  const ox = Math.max(qx, 0), oy = Math.max(qy, 0), oz = Math.max(qz, 0);
  return Math.sqrt(ox * ox + oy * oy + oz * oz) + Math.min(Math.max(qx, qy, qz), 0) - r;
}

/** Where the brow sits; shared by the mesh and its shading. */
export function browZ(p: SkullParams, f: SkullFrame): number {
  return f.zF + 0.15 + 0.08 * p.brow + 0.05 * p.prog;
}

export function craniumSDF(p: SkullParams, f: SkullFrame) {
  const browR = 0.012 + 0.066 * p.brow;
  const constrict = 1 - 0.75 * p.vault;
  const fossa = Math.max(0, (p.vault - 0.6) * 2.5 - p.bun);
  const ox = 0.3 * f.fw; // orbit centre
  const ow = 0.165 * (0.8 + 0.2 * f.fw);
  const oh = 0.15;
  const bz = browZ(p, f);
  const by = f.yO + oh + 0.035;
  const faceZ = f.zF - 0.06 + 0.1 * p.prog;
  const zx = 0.5 * f.fw; // cheekbone
  const zz = f.zF + 0.0 + 0.08 * p.faceW;
  const archX = Math.max(f.rx * 0.84, zx) + 0.05;
  const noseHalfW = 0.085 + 0.04 * p.faceW;
  const noseY = f.yO - 0.3 * f.fs;
  // How far the middle of the face stands forward of the cheeks.
  const midface = f.zF + 0.13 + 0.2 * p.prog;
  return (x0: number, y: number, z: number): number => {
    const x = Math.abs(x0);
    // braincase, slightly flattened at the sides like a real vault
    let d = ell(x, y, z, 0, f.cy, f.cz, f.rx, f.ry, f.rz);
    d = smin(d, ell(x, y, z, 0, f.cy + f.ry * 0.12, f.cz - f.rz * 0.28,
      f.rx * 1.02, f.ry * 0.82, f.rz * 0.66), 0.12);
    // forehead: a frontal boss in tall vaults
    if (p.vault > 0.6) {
      d = smin(d, ell(x, y, z, 0, f.cy + f.ry * 0.1, f.cz + f.rz * 0.42,
        f.rx * 0.8, f.ry * 0.74, f.rz * 0.44 + 0.1 * (p.vault - 0.6)), 0.1);
    }
    // occipital bun and nuchal torus
    if (p.bun > 0.05) {
      d = smin(d, ell(x, y, z, 0, f.cy - f.ry * 0.25, f.cz - f.rz * 0.86,
        0.3 * f.k, 0.22 * f.k, 0.22 * f.k * p.bun + 0.02), 0.12);
    }
    const yN = f.cy - f.ry * 0.45;
    const zN = f.cz - f.rz * 0.84;
    d = smin(d, cap(x, y, z, 0, yN, zN, f.rx * 0.62, yN + 0.03, zN + f.rz * 0.34,
      0.012 + 0.05 * p.nuchal), 0.07);
    // sagittal crest
    if (p.crest > 0.2) {
      d = smin(d, ell(x, y, z, 0, f.cy + f.ry * 0.9, f.cz - f.rz * 0.3,
        0.022, 0.02 + 0.13 * p.crest, f.rz * 0.52), 0.045);
    }
    // skull base behind the face
    const cut = Math.max(y - f.yBase, z - (f.zF - 0.3));
    d = smax(d, -cut, 0.14);
    // mastoid process
    d = smin(d, ell(x, y, z, f.rx * 0.76, f.yBase + 0.0, f.cz + 0.1, 0.075, 0.13, 0.095), 0.07);

    // ---- face ----
    // orbital plate and upper face
    d = smin(d, rbox(x, y, z, 0, f.yO - 0.12 * f.fs, faceZ, 0.5 * f.fw, 0.36 * f.fs, 0.2 + 0.05 * p.prog, 0.16), 0.11);
    // midface around the nose
    d = smin(d, ell(x, y, z, 0, f.yO - 0.27 * f.fs, midface - 0.2,
      0.24 + 0.06 * p.faceW, 0.3 * f.fs, 0.2), 0.09);
    // maxilla and tooth-bearing arch
    d = smin(d, ell(x, y, z, 0, f.snoutY + 0.02, f.snoutZ - 0.25,
      f.arcW + 0.065, 0.2 * f.fs, 0.27 + 0.1 * p.prog), 0.08);
    d = smin(d, ell(x, y, z, 0, f.yTeeth + 0.11, f.snoutZ - 0.03 - f.arcL * 0.5,
      f.arcW + 0.03, 0.12, f.arcL * 0.5), 0.1);
    // cheekbone
    d = smin(d, ell(x, y, z, zx, f.yO - 0.2 * f.fs, zz, 0.115, 0.15 * f.fs, 0.1), 0.075);
    d = smin(d, cap(x, y, z, zx - 0.06, f.yO - 0.33 * f.fs, zz - 0.02, f.arcW + 0.03, f.snoutY - 0.02, f.snoutZ - 0.36, 0.05), 0.07);
    // lateral orbital rim
    d = smin(d, cap(x, y, z, ox + ow + 0.015, f.yO + oh, bz - 0.2, zx - 0.02, f.yO - 0.12 * f.fs, zz + 0.02, 0.04), 0.05);
    // zygomatic arch: a flat bar standing clear of the braincase
    {
      const sy = (y - (f.yJoint + 0.05)) / 1.5;
      d = smin(d, cap(x, sy, z, zx + 0.05, (f.yO - 0.24 * f.fs - f.yJoint - 0.05) / 1.5, zz - 0.06,
        archX, 0, f.zJoint + 0.12, 0.028), 0.045);
      // root of the arch on the temporal bone
      d = smin(d, cap(x, sy, z, archX, 0, f.zJoint + 0.12, f.rx * 0.8, 0.01, f.zJoint - 0.02, 0.034), 0.05);
    }
    // brow ridge, arched over each orbit
    d = smin(d, cap(x, y, z, 0, by - 0.03, bz, ox - 0.05, by + 0.012, bz, browR), 0.07);
    d = smin(d, cap(x, y, z, ox - 0.05, by + 0.012, bz, ox + ow * 0.6, by + 0.005, bz - 0.05, browR * 0.95), 0.07);
    d = smin(d, cap(x, y, z, ox + ow * 0.6, by + 0.005, bz - 0.05, ox + ow + 0.02, by - 0.07, bz - 0.15, browR * 0.75 + 0.008), 0.07);
    // nasal bones
    const bridge = 0.07 * (1 - p.prog) * (0.3 + 0.7 * p.vault);
    d = smin(d, cap(x, y, z, 0, f.yO + 0.07, bz - 0.03, 0, noseY + 0.2 * f.fs, midface + bridge - 0.01, 0.032), 0.05);

    // ---- hollows ----
    // temporal fossa between braincase and cheekbone
    d = smax(d, -ell(x, y, z, zx + 0.0, f.yO - 0.12, f.zF - 0.37,
      0.07 + 0.08 * constrict, 0.25, 0.17 + 0.05 * constrict), 0.09);
    // orbits: squarish openings that narrow toward the back
    d = smax(d, -rbox(x, y, z, ox, f.yO, bz - 0.07, ow, oh, 0.17, 0.09), 0.022);
    // pear-shaped nasal opening
    d = smax(d, -ell(x, y, z, 0, noseY + 0.05 * f.fs, midface, noseHalfW * 0.55, 0.15 * f.fs, 0.2), 0.02);
    d = smax(d, -ell(x, y, z, 0, noseY - 0.07 * f.fs, midface, noseHalfW, 0.08 * f.fs, 0.2), 0.025);
    d = smax(d, -ell(x, y, z, 0, noseY - 0.02 * f.fs, midface - 0.22, noseHalfW * 1.25, 0.14 * f.fs, 0.2), 0.03);
    // hollow below the cheek (deep in sapiens, absent in Neanderthals)
    if (fossa > 0.05) {
      d = smax(d, -ell(x, y, z, 0.26 * f.fw, f.yO - 0.36 * f.fs, midface + 0.03,
        0.1, 0.09 * f.fs, 0.045 + 0.05 * fossa), 0.07);
    }
    // palate
    d = smax(d, -ell(x, y, z, 0, f.yTeeth + 0.0, f.snoutZ - 0.05 - f.arcL * 0.5,
      f.arcW - 0.055, 0.11, f.arcL * 0.5), 0.035);
    return d;
  };
}

export function mandibleSDF(p: SkullParams, f: SkullFrame) {
  const robust = 0.85 + 0.25 * (p.tooth - 1) + 0.1 * p.faceW;
  const yT = f.yTeeth - 0.1; // top of the tooth-bearing edge
  const half = 0.14 * robust * f.fs; // half the height of the body
  const yM = yT - half + 0.01;
  const zFront = f.snoutZ - 0.05;
  // jaw joint, tucked under the root of the cheek arch
  const jx = Math.max(f.rx * 0.78, 0.5 * f.fw) - 0.03;
  const jy = f.yJoint - 0.01;
  const jz = f.zJoint + 0.02;
  // angle of the jaw
  const gx = jx - 0.08;
  const gy = yM - half * 0.4;
  const gz = jz + 0.02 + 0.12 * p.prog;
  // ramus: a plate from the angle to the joint, in its own tilted frame
  const ry0 = (gy + jy) / 2 - 0.03;
  const rz0 = (gz + jz) / 2 + 0.11;
  const rh = (jy - gy) / 2 - 0.02;
  const lean = Math.atan2(jz - gz, jy - gy);
  const cs = Math.cos(lean), sn = Math.sin(lean);
  const rw = 0.12 * robust;
  const thick = 0.062 * robust;
  return (x0: number, y: number, z: number): number => {
    const x = Math.abs(x0);
    // body: a tall, narrow bar following the tooth row
    const sy = (y - yM) / 2.1;
    let d = cap(x, sy, z, 0, 0, zFront - 0.015, f.arcW * 0.6, 0, zFront - 0.09, thick);
    d = smin(d, cap(x, sy, z, f.arcW * 0.6, 0, zFront - 0.09, f.arcW + 0.02, 0, zFront - 0.4, thick * 0.95), 0.04);
    d = smin(d, cap(x, sy, z, f.arcW + 0.02, 0, zFront - 0.4, gx - 0.02, 0, rz0 + 0.02, thick * 0.9), 0.04);
    // ramus plate
    const dy = y - ry0, dz = z - rz0;
    const ly = dy * cs + dz * sn;
    const lz = -dy * sn + dz * cs;
    const lx = x - (gx + (jx - gx) * Math.min(1, Math.max(0, (ly + rh) / (2 * rh))));
    let r = smax(rbox(lx, ly, lz, 0, 0, 0, 0.036, rh, rw, 0.034),
      ell(lx, ly, lz, 0, 0.02, 0, 0.2, rh * 1.22, rw * 1.18), 0.05);
    // notch between the coronoid process and the condyle
    r = smax(r, -ell(lx, ly, lz, 0, rh + 0.03, -0.005, 0.2, 0.13, rw * 0.5), 0.04);
    // coronoid tip
    r = smin(r, cap(lx, ly, lz, 0, rh - 0.1, rw - 0.045, 0, rh + 0.07, rw - 0.02, 0.03), 0.04);
    // condyle: a neck and a head that sits in the joint
    r = smin(r, cap(lx, ly, lz, 0, rh - 0.1, -rw + 0.05, 0, rh + 0.04, -rw + 0.045, 0.036), 0.04);
    r = smin(r, ell(lx, ly, lz, 0, rh + 0.06, -rw + 0.045, 0.085, 0.042, 0.045), 0.03);
    d = smin(d, r, 0.1);
    // rounded angle of the jaw
    d = smin(d, ell(x, y, z, gx, gy + 0.05, gz + 0.02, 0.04, 0.09, 0.09), 0.06);
    // symphysis: sloping back in early forms, a chin in sapiens
    const back = 0.1 * (1 - p.chin);
    d = smin(d, cap(x, y, z, 0, yT - 0.035, zFront - 0.02, 0, yM - half * 0.75, zFront - 0.02 - back,
      thick * 0.95), 0.05);
    if (p.chin > 0.3) {
      d = smin(d, ell(x, y, z, 0, yM - half * 0.62, zFront + 0.0, 0.1, 0.06, 0.06 * p.chin), 0.07);
      d = smin(d, ell(x, y, z, 0.08, yM - half * 0.8, zFront - 0.015, 0.045, 0.04, 0.045 * p.chin), 0.05);
    }
    return d;
  };
}

export interface ToothSpec {
  pos: [number, number, number];
  size: [number, number, number];
  yaw: number;
}

/** Upper and lower tooth rows as oriented boxes along the dental arcade. */
export function teeth(p: SkullParams, f: SkullFrame): ToothSpec[] {
  const out: ToothSpec[] = [];
  // widths along the arcade for I1 I2 C P3 P4 M1 M2 M3
  const widths = [0.066, 0.052, 0.058, 0.052, 0.052, 0.078, 0.08, 0.072].map(
    (w, i) => w * (i >= 3 ? p.tooth : 0.9 + 0.1 * p.tooth),
  );
  const zFront = f.snoutZ - 0.03;
  const arc = (s: number): [number, number] => {
    // s in 0..1 from midline to the last molar
    const xx = f.arcW * Math.pow(Math.sin((s * Math.PI) / 2), 0.8);
    const zz = zFront - f.arcL * Math.pow(s, f.arcP > 3 ? 1.5 : 1.75);
    return [xx, zz];
  };
  // arc length lookup
  const N = 200;
  const len: number[] = [0];
  let prev = arc(0);
  for (let i = 1; i <= N; i++) {
    const c = arc(i / N);
    len.push(len[i - 1] + Math.hypot(c[0] - prev[0], c[1] - prev[1]));
    prev = c;
  }
  const at = (dist: number) => {
    let i = 0;
    while (i < N && len[i] < dist) i++;
    const s = i / N;
    const a = arc(Math.max(0, s - 0.01));
    const b = arc(Math.min(1, s + 0.01));
    return { c: arc(s), yaw: Math.atan2(b[0] - a[0], -(b[1] - a[1])) };
  };
  const total = widths.reduce((a, b) => a + b, 0);
  const scale = Math.min(1, (len[N] * 0.98) / total);
  for (const row of [1, -1] as const) {
    let dist = 0.004;
    widths.forEach((w0, i) => {
      const w = w0 * scale;
      const { c, yaw } = at(dist + w / 2);
      dist += w;
      const molar = i >= 3;
      const canine = i === 2;
      const h = (molar ? 0.075 : 0.1) * (canine ? 1 + 0.9 * p.canine : 1) * (row === 1 ? 1 : 0.92);
      const depth = molar ? w * 0.95 : canine ? 0.055 : 0.034;
      const inset = row === 1 ? 0 : 0.022;
      const y = row === 1 ? f.yTeeth - h / 2 + 0.03 : f.yTeeth - 0.1 + h / 2 - 0.035;
      for (const side of [1, -1]) {
        out.push({
          pos: [side * (c[0] - inset * Math.cos(yaw)), y, c[1] - inset * 0.6],
          size: [depth, h, w * 0.93],
          yaw: side * yaw,
        });
      }
    });
  }
  return out;
}

// ---------- meshing ----------

export interface MeshData {
  positions: Float32Array;
  normals: Float32Array;
  colors: Float32Array;
  indices: Uint32Array;
}

export interface Bounds { x: number; y0: number; y1: number; z0: number; z1: number }

/**
 * Naive surface nets: one vertex per cell that the surface crosses, placed at
 * the average of the edge crossings. Gives smooth, evenly sized quads.
 */
export function meshSDF(
  sdf: (x: number, y: number, z: number) => number,
  occluder: (x: number, y: number, z: number) => number,
  shade: (x: number, y: number, z: number) => number,
  BOUNDS: Bounds,
  cell: number,
  tint: [number, number, number],
): MeshData {
  // The skull is symmetric, so only half the grid is evaluated.
  const hx = Math.ceil(BOUNDS.x / cell);
  const nx = 2 * hx + 1;
  const ny = Math.ceil((BOUNDS.y1 - BOUNDS.y0) / cell) + 1;
  const nz = Math.ceil((BOUNDS.z1 - BOUNDS.z0) / cell) + 1;
  const field = new Float32Array(nx * ny * nz);
  const X = (i: number) => (i - hx) * cell;
  const Y = (j: number) => BOUNDS.y0 + j * cell;
  const Z = (k: number) => BOUNDS.z0 + k * cell;
  const idx = (i: number, j: number, k: number) => i + nx * (j + ny * k);
  for (let k = 0; k < nz; k++)
    for (let j = 0; j < ny; j++)
      for (let i = hx; i < nx; i++) {
        const v0 = sdf(X(i), Y(j), Z(k));
        field[idx(i, j, k)] = v0;
        field[idx(2 * hx - i, j, k)] = v0;
      }

  const vertIndex = new Int32Array(nx * ny * nz).fill(-1);
  const pos: number[] = [];
  const corners = [
    [0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0],
    [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1],
  ];
  const edges = [
    [0, 1], [2, 3], [4, 5], [6, 7],
    [0, 2], [1, 3], [4, 6], [5, 7],
    [0, 4], [1, 5], [2, 6], [3, 7],
  ];
  const v = new Float32Array(8);
  for (let k = 0; k < nz - 1; k++)
    for (let j = 0; j < ny - 1; j++)
      for (let i = 0; i < nx - 1; i++) {
        let mask = 0;
        for (let c = 0; c < 8; c++) {
          v[c] = field[idx(i + corners[c][0], j + corners[c][1], k + corners[c][2])];
          if (v[c] < 0) mask |= 1 << c;
        }
        if (mask === 0 || mask === 255) continue;
        let sx = 0, sy = 0, sz = 0, n = 0;
        for (const [a, b] of edges) {
          if (v[a] < 0 === v[b] < 0) continue;
          const t = v[a] / (v[a] - v[b]);
          sx += corners[a][0] + (corners[b][0] - corners[a][0]) * t;
          sy += corners[a][1] + (corners[b][1] - corners[a][1]) * t;
          sz += corners[a][2] + (corners[b][2] - corners[a][2]) * t;
          n++;
        }
        vertIndex[idx(i, j, k)] = pos.length / 3;
        pos.push(X(i) + (sx / n) * cell, Y(j) + (sy / n) * cell, Z(k) + (sz / n) * cell);
      }

  const tris: number[] = [];
  const quad = (a: number, b: number, c: number, d: number, flip: boolean) => {
    if (a < 0 || b < 0 || c < 0 || d < 0) return;
    if (flip) tris.push(a, c, b, a, d, c);
    else tris.push(a, b, c, a, c, d);
  };
  for (let k = 1; k < nz - 1; k++)
    for (let j = 1; j < ny - 1; j++)
      for (let i = 1; i < nx - 1; i++) {
        const s0 = field[idx(i, j, k)] < 0;
        if (s0 !== field[idx(i + 1, j, k)] < 0)
          quad(vertIndex[idx(i, j - 1, k - 1)], vertIndex[idx(i, j, k - 1)],
            vertIndex[idx(i, j, k)], vertIndex[idx(i, j - 1, k)], !s0);
        if (s0 !== field[idx(i, j + 1, k)] < 0)
          quad(vertIndex[idx(i - 1, j, k - 1)], vertIndex[idx(i - 1, j, k)],
            vertIndex[idx(i, j, k)], vertIndex[idx(i, j, k - 1)], !s0);
        if (s0 !== field[idx(i, j, k + 1)] < 0)
          quad(vertIndex[idx(i - 1, j - 1, k)], vertIndex[idx(i, j - 1, k)],
            vertIndex[idx(i, j, k)], vertIndex[idx(i - 1, j, k)], !s0);
      }

  const count = pos.length / 3;
  const positions = new Float32Array(pos);
  const normals = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const e = cell * 0.6;
  for (let i = 0; i < count; i++) {
    const x = positions[i * 3], y = positions[i * 3 + 1], z = positions[i * 3 + 2];
    let gx = sdf(x + e, y, z) - sdf(x - e, y, z);
    let gy = sdf(x, y + e, z) - sdf(x, y - e, z);
    let gz = sdf(x, y, z + e) - sdf(x, y, z - e);
    const l = Math.hypot(gx, gy, gz) || 1;
    gx /= l; gy /= l; gz /= l;
    normals[i * 3] = gx; normals[i * 3 + 1] = gy; normals[i * 3 + 2] = gz;
    // cavity shading: how much open space is there along the normal?
    let ao = 0;
    for (const h of [0.07, 0.18, 0.38]) {
      const o = occluder(x + gx * h, y + gy * h, z + gz * h) / h;
      ao += o < 0 ? 0 : o > 1 ? 1 : o;
    }
    ao = (0.26 + 0.74 * Math.pow(ao / 3, 1.7)) * shade(x, y, z);
    // Shadows in bone are warm, so crevices drift toward brown instead of grey.
    colors[i * 3] = tint[0] * Math.pow(ao, 0.8);
    colors[i * 3 + 1] = tint[1] * Math.pow(ao, 1.0);
    colors[i * 3 + 2] = tint[2] * Math.pow(ao, 1.3);
  }
  return { positions, normals, colors, indices: new Uint32Array(tris) };
}

export function buildSkull(p: SkullParams, cell = 0.026) {
  const f = frame(p);
  const cr = craniumSDF(p, f);
  const mn = mandibleSDF(p, f);
  const both = (x: number, y: number, z: number) => Math.min(cr(x, y, z), mn(x, y, z));
  const bone: [number, number, number] = [0.95, 0.89, 0.76];
  // Darken the insides of the eye sockets and nose, which open into the skull.
  const bz = browZ(p, f);
  const ox = 0.3 * f.fw;
  const midface = f.zF + 0.13 + 0.2 * p.prog;
  const hollow = (x0: number, y: number, z: number) => {
    const x = Math.abs(x0);
    const inOrbit =
      Math.hypot((x - ox) / 0.17, (y - f.yO) / 0.155) < 1 && z < bz && z > bz - 0.4;
    const inNose =
      Math.hypot(x / 0.14, (y - (f.yO - 0.31 * f.fs)) / (0.17 * f.fs)) < 1 && z > midface - 0.42;
    if (!inOrbit && !inNose) return 1;
    const front = inOrbit ? bz - 0.1 : midface - 0.05;
    const depth = (front - z) / 0.2;
    return 1 - 0.8 * Math.min(1, Math.max(0, depth));
  };
  const plain = () => 1;
  return {
    frame: f,
    cranium: meshSDF(cr, both, hollow, {
      x: Math.max(f.rx, 0.5 * f.fw + 0.2) + 0.08,
      y0: f.yTeeth - 0.08, y1: f.cy + f.ry + 0.2,
      z0: f.cz - f.rz - 0.32, z1: f.snoutZ + 0.2,
    }, cell, bone),
    mandible: meshSDF(mn, both, plain, {
      x: Math.max(f.rx, 0.5 * f.fw) + 0.14,
      y0: f.yTeeth - 0.62 * Math.max(1, f.fs), y1: f.yJoint + 0.2,
      z0: f.zJoint - 0.3, z1: f.snoutZ + 0.14,
    }, cell, bone),
    teeth: teeth(p, f),
  };
}

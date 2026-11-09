import * as THREE from "three";

const RAD = Math.PI / 180;

/** Matches the UV layout of THREE.SphereGeometry with an equirectangular map. */
export function latLonToVec3(lat: number, lon: number, r = 1): THREE.Vector3 {
  const phi = (lon + 180) * RAD;
  const theta = (90 - lat) * RAD;
  return new THREE.Vector3(
    -r * Math.sin(theta) * Math.cos(phi),
    r * Math.cos(theta),
    r * Math.sin(theta) * Math.sin(phi),
  );
}

/**
 * A smooth path over the sphere through [lat, lon] waypoints. Segments are
 * great-circle interpolated first so the spline never cuts through the globe.
 */
export function spherePath(
  waypoints: [number, number][],
  radius: number,
  samples = 160,
): THREE.Vector3[] {
  const dense: THREE.Vector3[] = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    const a = latLonToVec3(waypoints[i][0], waypoints[i][1]);
    const b = latLonToVec3(waypoints[i + 1][0], waypoints[i + 1][1]);
    const angle = a.angleTo(b);
    const steps = Math.max(2, Math.ceil(angle / (4 * RAD)));
    for (let s = 0; s < steps; s++) {
      dense.push(slerp(a, b, s / steps));
    }
  }
  const lastWp = waypoints[waypoints.length - 1];
  dense.push(latLonToVec3(lastWp[0], lastWp[1]));
  const curve = new THREE.CatmullRomCurve3(dense, false, "centripetal");
  return curve
    .getSpacedPoints(samples)
    .map((p) => p.normalize().multiplyScalar(radius));
}

function slerp(a: THREE.Vector3, b: THREE.Vector3, t: number): THREE.Vector3 {
  const omega = a.angleTo(b);
  if (omega < 1e-5) return a.clone();
  const s = Math.sin(omega);
  return a
    .clone()
    .multiplyScalar(Math.sin((1 - t) * omega) / s)
    .add(b.clone().multiplyScalar(Math.sin(t * omega) / s));
}

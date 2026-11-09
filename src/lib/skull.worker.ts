import { buildSkull, type SkullParams } from "./skull";

/** Builds skull meshes off the main thread so the page never stalls. */
self.onmessage = (e: MessageEvent<{ id: number; params: SkullParams; cell: number }>) => {
  const { id, params, cell } = e.data;
  const built = buildSkull(params, cell);
  const transfer = [built.cranium, built.mandible].flatMap((m) => [
    m.positions.buffer,
    m.normals.buffer,
    m.colors.buffer,
    m.indices.buffer,
  ]);
  (self as unknown as Worker).postMessage({ id, built }, transfer);
};

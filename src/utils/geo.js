import { MASK_W, MASK_H, MASK_B64 } from "../data/landMask";

/**
 * Land/sea lookup shared by the hero globe and the "Global reach" map.
 *
 * The mask ships bit-packed (see scripts/generate-globe-mask.mjs) and is
 * unpacked once, on first use, into one byte per cell - 64KB that turns every
 * lookup in the render loop into a single array read.
 */

let grid = null;

export function getLandGrid() {
  if (grid) return grid;
  const bin = atob(MASK_B64);
  grid = new Uint8Array(MASK_W * MASK_H);
  for (let i = 0; i < grid.length; i++) {
    grid[i] = (bin.charCodeAt(i >> 3) >> (i & 7)) & 1;
  }
  return grid;
}

/** True if the 1-degree cell containing (lat, lon) is land. Degrees in, any range of lon. */
export function isLand(g, lat, lon) {
  let row = (90 - lat) | 0;
  if (row < 0) row = 0;
  else if (row >= MASK_H) row = MASK_H - 1;
  let col = ((lon + 180) % 360 + 360) % 360 | 0;
  if (col >= MASK_W) col = MASK_W - 1;
  return g[row * MASK_W + col] === 1;
}

export const DEG = Math.PI / 180;

/** Unit vector for a latitude/longitude, y up, lon 0 facing +z. */
export function toVec(lat, lon) {
  const b = lat * DEG;
  const l = lon * DEG;
  const c = Math.cos(b);
  return [c * Math.sin(l), Math.sin(b), c * Math.cos(l)];
}

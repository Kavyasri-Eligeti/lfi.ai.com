// The modular field: a 6 × 5 grid of tiles derived from the three modules of
// the Linkfields mark. The brand tiles sit at the centre, in the same
// arrangement as the logo (tall yellow leaf, orange over blue).
// Kinds: 'leaf' (large bottom-right corner), 'leaf2' (large top-left corner),
// 'tile' (plain), 'ghost' (outline only), and the brand modules 'y', 'o', 'b'.
export const FIELD_COLS = 6;
export const FIELD_ROWS = 5;

export const FIELD_TILES = [
  'tile', 'leaf', 'tile', 'tile', 'leaf2', 'tile',
  'tile', 'tile', 'y', 'o', 'tile', 'leaf',
  'leaf2', 'tile', /* y continues */ 'b', 'tile', 'tile',
  'tile', 'leaf', 'tile', 'tile', 'ghost', 'tile',
  'tile', 'tile', 'leaf2', 'tile', 'tile', 'tile',
];

export const isBrandTile = (kind) => kind === 'y' || kind === 'o' || kind === 'b';

// Grid cell of every tile in FIELD_TILES order, accounting for the yellow
// leaf spanning two rows.
export function fieldCells() {
  const taken = new Set();
  const cells = [];
  let cursor = 0;
  FIELD_TILES.forEach((kind) => {
    while (taken.has(cursor)) cursor += 1;
    const col = cursor % FIELD_COLS;
    const row = Math.floor(cursor / FIELD_COLS);
    const rows = kind === 'y' ? 2 : 1;
    for (let r = 0; r < rows; r += 1) taken.add(cursor + r * FIELD_COLS);
    cells.push({ kind, col, row, rows });
    cursor += 1;
  });
  return cells;
}

// Resting height of a tile (px in the CSS tier, scene units × 40 in WebGL)
// and its wave amplitude.
export const restHeight = (kind) => (isBrandTile(kind) ? 34 : kind === 'ghost' ? 0 : 4);
export const waveHeight = (kind, i, phase) =>
  kind === 'ghost' || isBrandTile(kind) ? 0 : (Math.sin(phase + i * 0.55) + 1) * 7;

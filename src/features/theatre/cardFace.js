// Draws a card's face (title, symbol or logo, tagline) to a transparent
// canvas. The WebGL card shader paints its flowing surface underneath and
// glitches this layer in and out.
export const FACE_W = 1024;
export const FACE_H = 640;
const FONT = '"Share Tech Mono", ui-monospace, Menlo, Consolas, monospace';

const images = new Map();
function loadImage(src) {
  if (!images.has(src)) {
    images.set(
      src,
      new Promise((resolve) => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      })
    );
  }
  return images.get(src);
}

let fontReady = null;
const ensureFont = () => {
  if (!fontReady) {
    fontReady = document.fonts?.load ? document.fonts.load(`64px ${FONT}`).catch(() => null) : Promise.resolve();
  }
  return fontReady;
};

function roundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

// Break text into at most `maxLines` lines that fit `width` at the current font.
function wrap(g, text, width, maxLines) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  words.forEach((w) => {
    const next = line ? `${line} ${w}` : w;
    if (g.measureText(next).width <= width || !line) line = next;
    else {
      lines.push(line);
      line = w;
    }
  });
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = `${kept[maxLines - 1].replace(/\s*\S*$/, '')}…`;
    return kept;
  }
  return lines;
}

// Largest size (down to `min`) at which the title fits in `maxLines`.
function fitTitle(g, text, width, maxLines, max, min) {
  for (let size = max; size >= min; size -= 4) {
    g.font = `${size}px ${FONT}`;
    const lines = wrap(g, text, width, 99);
    if (lines.length <= maxLines && lines.every((l) => g.measureText(l).width <= width)) return { size, lines };
  }
  g.font = `${min}px ${FONT}`;
  return { size: min, lines: wrap(g, text, width, maxLines) };
}

export async function drawCardFace(card) {
  await ensureFont();
  const c = document.createElement('canvas');
  c.width = FACE_W;
  c.height = FACE_H;
  const g = c.getContext('2d');
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillStyle = '#fff';
  const cx = FACE_W / 2;
  const accent = card.palette[0];

  let top = 150;

  // Kicker
  g.font = `26px ${FONT}`;
  g.fillStyle = 'rgba(255,255,255,0.72)';
  g.fillText(card.kicker.toUpperCase(), cx, 78);

  // Official platform logos: a row of tiles
  if (card.logos?.length) {
    const imgs = await Promise.all(card.logos.map((l) => loadImage(l.src)));
    const h = 104;
    const box = 62;
    const tiles = imgs.map((img, i) => {
      const ratio = img ? (img.naturalWidth || 1) / (img.naturalHeight || 1) : 1;
      const w = ratio >= 1 ? Math.min(box * ratio, 170) : box * ratio;
      const lh = ratio >= 1 ? w / ratio : box;
      return { img, w, lh, tw: Math.max(h, w + 40), dark: card.logos[i].tile === 'dark' };
    });
    const gap = 18;
    const total = tiles.reduce((n, t) => n + t.tw, 0) + gap * (tiles.length - 1);
    let x = cx - total / 2;
    const y = top - 34;
    tiles.forEach((t) => {
      g.shadowColor = 'rgba(0,0,0,0.5)';
      g.shadowBlur = 24;
      roundRect(g, x, y, t.tw, h, 22);
      g.fillStyle = t.dark ? '#0b1118' : '#ffffff';
      g.fill();
      g.shadowBlur = 0;
      if (t.img) g.drawImage(t.img, x + (t.tw - t.w) / 2, y + (h - t.lh) / 2, t.w, t.lh);
      x += t.tw + gap;
    });
    top += 130;
  } else if (card.code) {
    const s = 112;
    const x = cx - s / 2;
    const y = top - 20;
    roundRect(g, x, y, s, s, 24);
    g.fillStyle = 'rgba(8,12,20,0.75)';
    g.fill();
    g.lineWidth = 3;
    g.strokeStyle = accent;
    g.stroke();
    g.font = `20px ${FONT}`;
    g.fillStyle = 'rgba(255,255,255,0.6)';
    g.textAlign = 'left';
    g.fillText(String(card.index ?? '').padStart(2, '0'), x + 14, y + 22);
    g.textAlign = 'center';
    g.font = `56px ${FONT}`;
    g.fillStyle = '#fff';
    g.shadowColor = accent;
    g.shadowBlur = 24;
    g.fillText(card.code, cx, y + s / 2 + 6);
    g.shadowBlur = 0;
    top += 130;
  } else if (card.logo) {
    const img = await loadImage(card.logo);
    const s = 150;
    const x = cx - s / 2;
    const y = top - 30;
    g.shadowColor = 'rgba(0,0,0,0.5)';
    g.shadowBlur = 30;
    roundRect(g, x, y, s, s, 32);
    g.fillStyle = '#ffffff';
    g.fill();
    g.shadowBlur = 0;
    if (img) {
      const box = 96;
      const ratio = (img.naturalWidth || 1) / (img.naturalHeight || 1);
      const w = ratio >= 1 ? box : box * ratio;
      const h = ratio >= 1 ? box / ratio : box;
      g.drawImage(img, cx - w / 2, y + s / 2 - h / 2, w, h);
    }
    top += 170;
  } else {
    top += 40;
  }

  // Title
  g.fillStyle = '#ffffff';
  const marked = card.code || card.logo || card.logos?.length;
  const maxLines = marked ? 2 : 3;
  const { size, lines } = fitTitle(g, card.title.toUpperCase(), FACE_W - 140, maxLines, marked ? 92 : 120, 48);
  const lh = size * 1.04;
  const titleTop = top + (marked ? 10 : 30);
  g.shadowColor = 'rgba(255,255,255,0.35)';
  g.shadowBlur = 18;
  lines.forEach((l, i) => g.fillText(l, cx, titleTop + lh * (i + 0.5)));
  g.shadowBlur = 0;

  // Tagline
  if (card.text) {
    g.font = `28px ${FONT}`;
    g.fillStyle = 'rgba(255,255,255,0.7)';
    const tl = wrap(g, card.text.toUpperCase(), FACE_W - 200, 2);
    const y0 = Math.min(FACE_H - 80, titleTop + lh * lines.length + 40);
    tl.forEach((l, i) => g.fillText(l, cx, y0 + i * 38));
  }

  // Footer hint
  g.font = `22px ${FONT}`;
  g.fillStyle = 'rgba(255,255,255,0.55)';
  g.textAlign = 'right';
  g.fillText('EXPLORE ->', FACE_W - 56, FACE_H - 44);
  return c;
}

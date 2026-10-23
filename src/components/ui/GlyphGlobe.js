import React, { useEffect, useRef } from "react";
import { getLandGrid, isLand, toVec, DEG } from "../../utils/geo";
import { locations } from "../../data/profile";
import { prefersReducedMotion } from "../../motion";
import "./GlyphGlobe.css";

/* ==========================================================================
   The hero globe.

   Art direction is midjourney.com's landing field: monospace type set on CRT
   scanlines, the whole screen bowed by barrel distortion, characters that
   scramble under the cursor. Here the type IS the planet - every land cell of
   the Earth is a glyph, and the glyphs spell out Linkfields' own vocabulary
   (portfolios, products, office cities), so the words travel across the
   continents as the globe turns.

   Layers, back to front, all on one 2D canvas:
     1. scanlines            - drawn once per resize to an offscreen canvas
     2. ambient type field   - sparse, slow, outside the sphere
     3. orbit rings (back)   - text on two tilted ellipses
     4. the sphere           - graticule dots on the oceans, words on land
     5. arcs                 - dashed great circles out of the HQ
     6. orbit rings (front)
     7. office markers + labels

   Why Canvas 2D and not WebGL: the scene is a few thousand sprites a frame,
   which drawImage from a glyph atlas handles in a couple of milliseconds, and
   it costs no 3D library in the bundle. The per-cell sphere geometry is
   precomputed on resize, so a frame is array reads, one atan2/asin per land
   candidate, and blits.

   Budget rules: the loop stops when the canvas is off screen or the tab is
   hidden, device pixel ratio is capped at 2, and reduced motion gets one
   static frame and nothing else.
   ========================================================================== */

const STREAM =
  "exploring innovation·digital transformation·intelligent enterprise platforms·data & ai·talent advisory & gcc·cyber security·linkworks·testoriumz·vajrax·vector x·textiq·finsight·edupilot·inteliconvo·johannesburg·hyderabad·dubai·london·new york·melbourne·modernise·automate·operate·integrate·engage·understand·predict·govern·advise·staff·scale·protect·validate·";
const SCRAMBLE = "abcdefghijklmnopqrstuvwxyz0123456789#%&*+=/<>{}[]:;~^";
const EXTRA = "·.:+";

/* Atlas colour rows. */
const COLORS = [
  "#c6d6ff", // 0 cool land
  "#ffb15a", // 1 warm land (the deck's orange glow, lit from the right)
  "#ffd600", // 2 yellow - lens + markers
  "#ff7800", // 3 orange
  "#7aa2ff", // 4 blue
  "#6c82b8", // 5 dim - graticule + field
];
const TONE_HEX = { yellow: "#ffd600", orange: "#ff7800", blue: "#6f9bff" };

const BARREL = 0.075;

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const smooth = (a, b, v) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
/* Integer hash -> [0,1). Deterministic per cell, so the field is stable. */
const hash = (n) => {
  n = (n ^ 61) ^ (n >>> 16);
  n = n + (n << 3);
  n = n ^ (n >>> 4);
  n = Math.imul(n, 0x27d4eb2d);
  n = n ^ (n >>> 15);
  return (n >>> 0) / 4294967296;
};

export default function GlyphGlobe({ className = "", introDelay = 0.3 }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const reduce = prefersReducedMotion();
    const land = getLandGrid();

    /* --- glyph set ----------------------------------------------------- */
    const chars = Array.from(new Set((STREAM + SCRAMBLE + EXTRA).split("")));
    const charIndex = {};
    chars.forEach((c, i) => (charIndex[c] = i));
    const streamIdx = STREAM.split("").map((c) => charIndex[c]);
    const scrambleIdx = SCRAMBLE.split("").map((c) => charIndex[c]);
    const DOT = charIndex["·"];
    const PERIOD = charIndex["."];
    const SL = streamIdx.length;

    /* --- state that survives resizes ----------------------------------- */
    const S = {
      w: 0,
      h: 0,
      dpr: 1,
      cw: 8,
      ch: 13,
      cols: 0,
      rows: 0,
      cx: 0,
      cy: 0,
      R: 0,
      atlas: null,
      static: null,
      // Disc cells: undistorted unit-sphere coordinates + draw positions.
      n: 0,
      vx: null,
      vy: null,
      vz: null,
      dx: null,
      dy: null,
      row: null,
      id: null,
      // Ambient field cells.
      field: [],
      // View.
      lonC: 20, // start over Africa
      latC: 8,
      spin: 7, // deg/s
      vel: 0,
      tiltTarget: 8,
      // Pointer.
      px: -9999,
      py: -9999,
      lens: 0,
      dragging: false,
      lastX: 0,
      lastY: 0,
      // Time.
      t0: 0,
      last: 0,
      raf: 0,
      visible: true,
    };

    /* Barrel distortion: pulls the corners in so every scanline bows, the
       way a curved tube does. Applied to draw positions only; the sphere is
       sampled in flat space. */
    const warpX = (x, y) => {
      const nx = (x - S.w / 2) / (S.w / 2);
      const ny = (y - S.h / 2) / (S.h / 2);
      const f = 1 - BARREL * (nx * nx + ny * ny) + BARREL * 0.5;
      return S.w / 2 + nx * f * (S.w / 2);
    };
    const warpY = (x, y) => {
      const nx = (x - S.w / 2) / (S.w / 2);
      const ny = (y - S.h / 2) / (S.h / 2);
      const f = 1 - BARREL * (nx * nx + ny * ny) + BARREL * 0.5;
      return S.h / 2 + ny * f * (S.h / 2);
    };

    /* --- atlas: every glyph in every colour, pre-rasterised ------------- */
    const buildAtlas = () => {
      const { cw, ch, dpr } = S;
      const a = document.createElement("canvas");
      a.width = Math.ceil(chars.length * cw * dpr);
      a.height = Math.ceil(COLORS.length * ch * dpr);
      const g = a.getContext("2d");
      g.scale(dpr, dpr);
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.font = `500 ${Math.round(ch * 0.84)}px "IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace`;
      COLORS.forEach((col, r) => {
        g.fillStyle = col;
        chars.forEach((c, i) => {
          g.fillText(c, i * cw + cw / 2, r * ch + ch / 2 + 0.5);
        });
      });
      S.atlas = a;
    };

    /* --- static layer: scanlines --------------------------------------- */
    const buildStatic = () => {
      const { w, h, dpr, ch, rows } = S;
      const c = document.createElement("canvas");
      c.width = Math.ceil(w * dpr);
      c.height = Math.ceil(h * dpr);
      const g = c.getContext("2d");
      g.scale(dpr, dpr);
      g.lineWidth = 1;
      g.strokeStyle = "rgba(120, 150, 255, 0.07)";
      const steps = 48;
      for (let j = 0; j <= rows; j++) {
        const y = j * ch;
        g.beginPath();
        for (let k = 0; k <= steps; k++) {
          const x = (k / steps) * w;
          const X = warpX(x, y);
          const Y = warpY(x, y);
          if (k === 0) g.moveTo(X, Y);
          else g.lineTo(X, Y);
        }
        g.stroke();
      }
      S.static = c;
    };

    /* --- geometry ------------------------------------------------------ */
    const layout = () => {
      const r = wrap.getBoundingClientRect();
      const w = Math.max(1, Math.round(r.width));
      const h = Math.max(1, Math.round(r.height));
      S.dpr = Math.min(window.devicePixelRatio || 1, 2);
      S.w = w;
      S.h = h;
      const small = Math.min(w, h) < 520;
      S.ch = small ? 10 : 12;
      S.cw = S.ch * 0.62;
      S.cols = Math.ceil(w / S.cw);
      S.rows = Math.ceil(h / S.ch);
      S.cx = w / 2;
      S.cy = h / 2;
      S.R = Math.min(w, h) * (small ? 0.4 : 0.37);

      canvas.width = Math.ceil(w * S.dpr);
      canvas.height = Math.ceil(h * S.dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      // Precompute every cell that falls on the disc.
      const { cols, rows, cw, ch, cx, cy, R } = S;
      const cap = cols * rows;
      const vx = new Float32Array(cap);
      const vy = new Float32Array(cap);
      const vz = new Float32Array(cap);
      const dx = new Float32Array(cap);
      const dy = new Float32Array(cap);
      const row = new Uint16Array(cap);
      const id = new Uint32Array(cap);
      const field = [];
      let n = 0;
      for (let j = 0; j < rows; j++) {
        const y = j * ch + ch / 2;
        for (let i = 0; i < cols; i++) {
          const x = i * cw + cw / 2;
          const ux = (x - cx) / R;
          const uy = -(y - cy) / R;
          const d2 = ux * ux + uy * uy;
          if (d2 < 1) {
            vx[n] = ux;
            vy[n] = uy;
            vz[n] = Math.sqrt(1 - d2);
            dx[n] = warpX(x, y);
            dy[n] = warpY(x, y);
            row[n] = j;
            id[n] = j * cols + i;
            n++;
          } else if (hash(j * 7919 + i * 104729) < 0.045) {
            // Fade the field out toward the edges of the tube.
            const ex = (x - w / 2) / (w / 2);
            const ey = (y - h / 2) / (h / 2);
            const edge = 1 - smooth(0.55, 1.05, Math.sqrt(ex * ex * 0.8 + ey * ey));
            if (edge > 0.02 && d2 > 1.12) {
              field.push({
                x: warpX(x, y),
                y: warpY(x, y),
                row: j,
                id: j * cols + i,
                a: edge,
                ph: hash(i * 31 + j * 17) * 6.283,
              });
            }
          }
        }
      }
      Object.assign(S, { n, vx, vy, vz, dx, dy, row, id, field });

      buildAtlas();
      buildStatic();
    };

    /* --- great-circle arcs, precomputed in world space ----------------- */
    const hub = locations.find((l) => l.hub);
    const arcs = locations
      .filter((l) => !l.hub)
      .map((l, k) => {
        const a = toVec(hub.lat, hub.lon);
        const b = toVec(l.lat, l.lon);
        const dot = clamp(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1, 1);
        const om = Math.acos(dot);
        const so = Math.sin(om);
        const N = 56;
        const pts = new Float32Array((N + 1) * 3);
        for (let s = 0; s <= N; s++) {
          const t = s / N;
          const fa = Math.sin((1 - t) * om) / so;
          const fb = Math.sin(t * om) / so;
          const lift = 1 + Math.sin(Math.PI * t) * (0.06 + 0.12 * (om / Math.PI));
          pts[s * 3] = (a[0] * fa + b[0] * fb) * lift;
          pts[s * 3 + 1] = (a[1] * fa + b[1] * fb) * lift;
          pts[s * 3 + 2] = (a[2] * fa + b[2] * fb) * lift;
        }
        return { pts, N, tone: l.tone, k };
      });
    const marks = locations.map((l) => ({ ...l, v: toVec(l.lat, l.lon) }));

    /* --- projection ---------------------------------------------------- */
    // World -> view for the current lonC/latC. Writes into `out`.
    const out = [0, 0, 0];
    const project = (x, y, z) => {
      const l = -S.lonC * DEG;
      const cl = Math.cos(l);
      const sl = Math.sin(l);
      // spin about Y so lonC faces the viewer
      const x1 = x * cl + z * sl;
      const z1 = -x * sl + z * cl;
      const p = S.latC * DEG;
      const cp = Math.cos(p);
      const sp = Math.sin(p);
      out[0] = x1;
      out[1] = y * cp - z1 * sp;
      out[2] = y * sp + z1 * cp;
      return out;
    };

    /* --- draw helpers -------------------------------------------------- */
    const glyph = (ci, colorRow, x, y, alpha) => {
      if (alpha <= 0.01) return;
      const { cw, ch, dpr, atlas } = S;
      ctx.globalAlpha = alpha > 1 ? 1 : alpha;
      ctx.drawImage(
        atlas,
        ci * cw * dpr,
        colorRow * ch * dpr,
        cw * dpr,
        ch * dpr,
        x - cw / 2,
        y - ch / 2,
        cw,
        ch
      );
    };

    const lensAt = (x, y) => {
      if (S.lens <= 0.01) return 0;
      const ddx = x - S.px;
      const ddy = y - S.py;
      const LR = S.R * 0.42;
      const d2 = ddx * ddx + ddy * ddy;
      if (d2 > LR * LR) return 0;
      return (1 - Math.sqrt(d2) / LR) * S.lens;
    };

    /* --- one frame ----------------------------------------------------- */
    const frame = (now) => {
      const t = (now - S.t0) / 1000;
      const dt = Math.min(0.05, S.last ? (now - S.last) / 1000 : 0.016);
      S.last = now;

      // Boot sequence: a CRT power-on sweep, top to bottom.
      const boot = reduce ? 1 : smooth(0, 1, (t - introDelay) / 1.5);
      const bootRow = boot * (S.rows + 6);

      if (!reduce) {
        if (!S.dragging) {
          S.vel += (S.spin - S.vel) * Math.min(1, dt * 1.6);
          S.latC += (S.tiltTarget - S.latC) * Math.min(1, dt * 2.2);
        }
        S.lonC += S.vel * dt;
        const target = S.px > -9000 ? 1 : 0;
        S.lens += (target - S.lens) * Math.min(1, dt * 6);
      }

      const { w, h, dpr, cx, cy, R } = S;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, w, h);

      // 1. scanlines
      ctx.globalAlpha = boot;
      ctx.drawImage(S.static, 0, 0, w, h);

      const tick = Math.floor(t * 14);

      // 2. ambient field
      for (let k = 0; k < S.field.length; k++) {
        const f = S.field[k];
        if (f.row > bootRow) continue;
        const s = Math.sin(t * 0.6 + f.ph);
        let a = (0.05 + 0.13 * s * s) * f.a;
        const L = lensAt(f.x, f.y);
        let ci = streamIdx[(f.id + Math.floor(t * 0.35 + f.ph)) % SL];
        let col = 5;
        if (L > 0) {
          a += L * 0.7;
          ci = scrambleIdx[(f.id + tick) % scrambleIdx.length];
          col = L > 0.5 ? 2 : 0;
        }
        glyph(ci, col, f.x, f.y, a);
      }

      // Atmosphere: a soft halo behind the limb.
      ctx.globalAlpha = boot;
      const halo = ctx.createRadialGradient(cx, cy, R * 0.86, cx, cy, R * 1.35);
      halo.addColorStop(0, "rgba(70, 110, 230, 0.20)");
      halo.addColorStop(0.45, "rgba(60, 90, 210, 0.07)");
      halo.addColorStop(1, "rgba(40, 60, 160, 0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // The limb: a faint warped circle, so the sphere reads as a sphere even
      // where the oceans have faded to nothing.
      ctx.globalAlpha = boot * 0.55;
      ctx.strokeStyle = "rgba(122, 162, 255, 0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let s = 0; s <= 96; s++) {
        const a = (s / 96) * Math.PI * 2;
        const x = cx + Math.cos(a) * R;
        const y = cy + Math.sin(a) * R;
        if (s === 0) ctx.moveTo(warpX(x, y), warpY(x, y));
        else ctx.lineTo(warpX(x, y), warpY(x, y));
      }
      ctx.stroke();

      // 3. orbit rings, far half
      drawRings(t, bootRow, tick, false);

      // 4. the sphere
      const p = S.latC * DEG;
      const cp = Math.cos(p);
      const sp = Math.sin(p);
      const lon0 = S.lonC;
      const { vx, vy, vz, dx, dy, row, id } = S;
      for (let k = 0; k < S.n; k++) {
        const r = row[k];
        if (r > bootRow) continue;
        const x = vx[k];
        const y = vy[k];
        const z = vz[k];
        // view -> world
        const y1 = y * cp + z * sp;
        const z1 = -y * sp + z * cp;
        const lat = Math.asin(y1 > 1 ? 1 : y1 < -1 ? -1 : y1) / DEG;
        const lon = Math.atan2(x, z1) / DEG + lon0;

        // Light from the upper left, a warm key from the right.
        const lit = clamp(-0.42 * x + 0.5 * y + 0.76 * z, 0, 1);
        const rim = smooth(0.0, 0.32, z);
        const sx = dx[k];
        const sy = dy[k];
        const L = lensAt(sx, sy);
        // The leading rows of the boot sweep flare and scramble.
        const sweep = r > bootRow - 3 ? 1 : 0;

        if (isLand(land, lat, lon)) {
          const band = (90 - lat) | 0;
          let ci = streamIdx[((((lon % 360) + 360) % 360) * 1.15 + band * 23 | 0) % SL];
          if (ci === undefined) ci = PERIOD;
          let a = (0.28 + 0.72 * lit) * rim;
          const warm = 0.78 * x + 0.32 * y + 0.5 * z > 0.82;
          let col = warm ? 1 : 0;
          if (L > 0 || sweep) {
            a += L * 0.8 + sweep * 0.6;
            if (L > 0.12 || sweep) ci = scrambleIdx[(id[k] + tick) % scrambleIdx.length];
            if (L > 0.45) col = 2;
          }
          glyph(ci, col, sx, sy, a);
        } else {
          // Oceans: a graticule every 15 degrees, plus a whisper of noise.
          const gl = Math.abs(((lat + 90) % 15) - 7.5) > 6.9;
          const gm = Math.abs((((lon % 15) + 15) % 15) - 7.5) > 7.5 - 0.55 / Math.max(0.2, Math.cos(lat * DEG));
          let a = 0;
          let ci = DOT;
          if (gl || gm) a = (0.14 + 0.26 * lit) * (0.35 + 0.65 * rim);
          else if (z < 0.2 && hash(id[k] + 7) < 0.55) {
            a = 0.16 + 0.2 * lit;
          } else if (hash(id[k]) < 0.06) {
            a = 0.07 * rim;
            ci = PERIOD;
          }
          if (L > 0) {
            a += L * 0.45;
            ci = scrambleIdx[(id[k] + tick) % scrambleIdx.length];
          }
          if (sweep) a += 0.3;
          glyph(ci, 5, sx, sy, a);
        }
      }

      // 5. arcs
      const arcBoot = reduce ? 1 : smooth(0, 1, (t - introDelay - 1.2) / 1.4);
      if (arcBoot > 0) drawArcs(t, arcBoot);

      // 6. orbit rings, near half
      drawRings(t, bootRow, tick, true);

      // 7. markers
      if (arcBoot > 0) drawMarkers(t, arcBoot);

      ctx.globalAlpha = 1;
    };

    /* Two rings of type on tilted ellipses. The far half is drawn before
       the sphere and occluded by it; the near half after. Positions snap to
       the scanline rows, which is what makes them read as set type rather
       than as particles. */
    const drawRings = (t, bootRow, tick, front) => {
      const { R, cx, cy, cw, ch } = S;
      const tilt = -13 * DEG;
      const ct = Math.cos(tilt);
      const st = Math.sin(tilt);
      for (let ring = 0; ring < 2; ring++) {
        const a = R * (1.2 + ring * 0.2);
        const b = a * (0.24 + ring * 0.04);
        const step = (cw * 1.08) / a;
        const count = Math.floor((Math.PI * 2) / step);
        const speed = ring === 0 ? 0.06 : -0.035;
        const off = t * speed;
        const shift = Math.floor(t * (ring === 0 ? 2.2 : 1.3));
        for (let i = 0; i < count; i++) {
          const ang = i * step + off;
          const sa = Math.sin(ang);
          const isFront = sa > 0;
          if (isFront !== front) continue;
          const ex = a * Math.cos(ang);
          const ey = b * sa;
          const x = cx + ex * ct - ey * st;
          let y = cy + ex * st + ey * ct;
          // occlusion by the sphere for the far half
          if (!front) {
            const ux = (x - cx) / R;
            const uy = (y - cy) / R;
            if (ux * ux + uy * uy < 1.02) continue;
          }
          const j = Math.round((y - ch / 2) / ch);
          if (j > bootRow || j < 0) continue;
          y = j * ch + ch / 2;
          const X = warpX(x, y);
          const Y = warpY(x, y);
          // Gaps: the ring is a sentence, not a solid band.
          const si = (i + shift + ring * 97) % SL;
          let ci = streamIdx[si];
          let alpha = (front ? 0.5 : 0.22) * (0.55 + 0.45 * Math.abs(sa));
          if (ring === 1) alpha *= 0.7;
          let col = ring === 1 ? 1 : 0;
          const L = lensAt(X, Y);
          if (L > 0) {
            alpha += L * 0.7;
            ci = scrambleIdx[(i + tick) % scrambleIdx.length];
            if (L > 0.45) col = 2;
          }
          glyph(ci, col, X, Y, alpha);
        }
      }
    };

    const drawArcs = (t, k) => {
      const { R, cx, cy } = S;
      ctx.lineWidth = 1.25;
      ctx.lineCap = "round";
      for (const arc of arcs) {
        const { pts, N } = arc;
        // Each arc draws out from the hub in turn.
        const reach = clamp(k * 1.6 - arc.k * 0.12, 0, 1);
        const last = Math.floor(reach * N);
        if (last < 1) continue;
        ctx.setLineDash([3.5, 4.5]);
        ctx.lineDashOffset = -t * 16;
        ctx.strokeStyle = arc.tone === "blue" ? "rgba(122,162,255,0.85)" : "rgba(255,138,30,0.85)";
        ctx.globalAlpha = 1;
        ctx.beginPath();
        let pen = false;
        for (let s = 0; s <= last; s++) {
          const v = project(pts[s * 3], pts[s * 3 + 1], pts[s * 3 + 2]);
          const vis = v[2] > 0 || (v[2] > -0.22 && v[0] * v[0] + v[1] * v[1] > 1);
          if (!vis) {
            pen = false;
            continue;
          }
          const x = cx + v[0] * R;
          const y = cy - v[1] * R;
          const X = warpX(x, y);
          const Y = warpY(x, y);
          if (!pen) {
            ctx.moveTo(X, Y);
            pen = true;
          } else ctx.lineTo(X, Y);
        }
        ctx.stroke();

        // A pulse travelling outward along the arc.
        if (reach >= 1) {
          const ph = (t * 0.32 + arc.k * 0.21) % 1;
          const s = Math.floor(ph * N);
          const v = project(pts[s * 3], pts[s * 3 + 1], pts[s * 3 + 2]);
          if (v[2] > 0 || (v[2] > -0.22 && v[0] * v[0] + v[1] * v[1] > 1)) {
            const x = cx + v[0] * R;
            const y = cy - v[1] * R;
            const X = warpX(x, y);
            const Y = warpY(x, y);
            const g = ctx.createRadialGradient(X, Y, 0, X, Y, 9);
            g.addColorStop(0, "rgba(255,214,0,0.95)");
            g.addColorStop(1, "rgba(255,120,0,0)");
            ctx.setLineDash([]);
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(X, Y, 9, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.setLineDash([]);
    };

    const drawMarkers = (t, k) => {
      const { R, cx, cy } = S;
      ctx.font = `500 10px "IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace`;
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      marks.forEach((m, i) => {
        const v = project(m.v[0], m.v[1], m.v[2]);
        if (v[2] <= 0.02) return;
        const face = smooth(0.02, 0.3, v[2]) * k;
        const x = cx + v[0] * R;
        const y = cy - v[1] * R;
        const X = warpX(x, y);
        const Y = warpY(x, y);
        const hex = TONE_HEX[m.tone];
        const pulse = (t * 0.6 + i * 0.17) % 1;
        const size = m.hub ? 1.35 : 1;

        // expanding ring
        ctx.globalAlpha = (1 - pulse) * 0.8 * face;
        ctx.strokeStyle = hex;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(X, Y, (5 + pulse * 18) * size, 0, Math.PI * 2);
        ctx.stroke();

        // halo + core
        ctx.globalAlpha = face;
        const g = ctx.createRadialGradient(X, Y, 0, X, Y, 14 * size);
        g.addColorStop(0, hex);
        g.addColorStop(0.3, `${hex}66`);
        g.addColorStop(1, `${hex}00`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(X, Y, 14 * size, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(X, Y, 2.2 * size, 0, Math.PI * 2);
        ctx.fill();

        // label, only when facing us squarely
        const la = smooth(0.35, 0.6, v[2]) * k;
        if (la > 0.02) {
          const label = `${m.label}${m.hub ? " · HQ" : ""}`.toUpperCase();
          ctx.globalAlpha = la * 0.92;
          ctx.fillStyle = "rgba(8,11,22,0.7)";
          const tw = ctx.measureText(label).width;
          ctx.fillRect(X + 12, Y - 8, tw + 10, 16);
          ctx.fillStyle = hex;
          ctx.fillText(label, X + 17, Y + 0.5);
        }
      });
    };

    /* --- loop ---------------------------------------------------------- */
    const loop = (now) => {
      S.raf = 0;
      frame(now);
      if (!reduce && S.visible && !document.hidden) S.raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (reduce || S.raf || !S.visible || document.hidden) return;
      S.last = 0;
      S.raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (S.raf) cancelAnimationFrame(S.raf);
      S.raf = 0;
    };
    const drawOnce = () => frame(performance.now());

    layout();
    S.t0 = performance.now();
    if (reduce) drawOnce();
    else start();

    // Web fonts land after mount; re-rasterise the atlas once they do so the
    // glyphs are Plex Mono rather than the fallback.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready
        .then(() => {
          buildAtlas();
          if (reduce) drawOnce();
        })
        .catch(() => {});
    }

    /* --- observers ----------------------------------------------------- */
    let resizeRaf = 0;
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            cancelAnimationFrame(resizeRaf);
            resizeRaf = requestAnimationFrame(() => {
              layout();
              if (reduce) drawOnce();
            });
          })
        : null;
    if (ro) ro.observe(wrap);

    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([e]) => {
              S.visible = e.isIntersecting;
              if (S.visible) start();
              else stop();
            },
            { rootMargin: "80px" }
          )
        : null;
    if (io) io.observe(wrap);

    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    /* --- pointer: lens on hover, drag to spin ------------------------- */
    const local = (e) => {
      const r = canvas.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };
    const onMove = (e) => {
      const [x, y] = local(e);
      if (e.pointerType === "mouse") {
        S.px = x;
        S.py = y;
        // A small parallax tilt toward the pointer.
        S.tiltTarget = 8 + clamp((y - S.cy) / S.h, -0.5, 0.5) * -14;
      }
      if (S.dragging) {
        const ddx = x - S.lastX;
        const ddy = y - S.lastY;
        S.lastX = x;
        S.lastY = y;
        const k = 160 / S.R;
        S.lonC -= ddx * k * 0.5;
        S.latC = clamp(S.latC + ddy * k * 0.35, -35, 50);
        S.vel = -ddx * k * 20;
        if (reduce) drawOnce();
      }
    };
    const onDown = (e) => {
      const [x, y] = local(e);
      const ux = (x - S.cx) / S.R;
      const uy = (y - S.cy) / S.R;
      if (ux * ux + uy * uy > 1.3) return;
      S.dragging = true;
      S.lastX = x;
      S.lastY = y;
      wrap.setAttribute("data-dragging", "");
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch (_) {
        /* not capturable - fine */
      }
    };
    const onUp = (e) => {
      if (!S.dragging) return;
      S.dragging = false;
      S.tiltTarget = clamp(S.latC, -10, 24);
      wrap.removeAttribute("data-dragging");
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch (_) {
        /* already released */
      }
    };
    const onLeave = () => {
      S.px = -9999;
      S.py = -9999;
      S.tiltTarget = 8;
    };

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", onLeave);

    return () => {
      stop();
      cancelAnimationFrame(resizeRaf);
      if (ro) ro.disconnect();
      if (io) io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [introDelay]);

  return (
    <div className={`lfi-glyph-globe ${className}`} ref={wrapRef}>
      <canvas ref={canvasRef} className="lfi-glyph-globe__canvas" />
    </div>
  );
}

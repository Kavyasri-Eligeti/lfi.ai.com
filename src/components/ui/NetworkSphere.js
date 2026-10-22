import React, { useEffect, useRef } from "react";
import {
  gsap,
  ScrollTrigger,
  prefersReducedMotion,
  hasFinePointer,
} from "../../motion";
import "./NetworkSphere.css";

/* ==========================================================================
   The intelligence network.

   A spherical graph: points distributed over a sphere, connected to their
   near neighbours, rotating slowly in three dimensions with a restrained blue
   core behind it. It is the hero's visual anchor and the site's one piece of
   signature imagery.

   It is a VISUAL METAPHOR for connected intelligence. It is not a diagram of
   anything, it does not represent live data, and nothing on the page claims
   that it does.

   Why canvas and not SVG: ~300 edges redrawn every frame is 300 DOM nodes
   with changing attributes in SVG - a style recalculation on every one, every
   frame, directly behind the page's most important text. On canvas it is one
   element and the cost is pure drawing.

   Budget, because this runs beside the headline:
     - point count scales with rendered area, so a phone draws ~50 points
       where a wide desktop draws ~170;
     - adjacency is computed ONCE at build, never per frame;
     - no CanvasGradient is constructed inside the loop;
     - IntersectionObserver stops the loop when the hero scrolls away, and
       document visibility stops it when the tab is hidden;
     - reduced motion paints one composed frame and never starts the loop;
     - nothing in the loop reads layout.
   ========================================================================== */

/* Brand accents. The field is mostly neutral - colour is an accent on
   SELECTED nodes, which is what keeps it sophisticated rather than festive. */
const WHITE = [230, 236, 237];
const BLUE = [92, 140, 246];
const YELLOW = [255, 214, 0];
const ORANGE = [255, 120, 0];

/* Weighted toward blue, so the composition stays cool and the warm accents
   read as highlights rather than as a second colour scheme. */
const ACCENTS = [BLUE, BLUE, BLUE, YELLOW, ORANGE];

function rgba(c, a) {
  return `rgba(${c[0]},${c[1]},${c[2]},${a < 0 ? 0 : a > 1 ? 1 : a})`;
}

/**
 * Even distribution over a sphere.
 *
 * The Fibonacci lattice, not random spherical coordinates: random latitude
 * and longitude bunches points at the poles, which reads as a flaw in the
 * composition rather than as a network.
 */
function fibonacciSphere(count) {
  const points = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    points.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
  }
  return points;
}

export default function NetworkSphere({ className = "", introDelay = 0.35 }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return undefined;

    const reduce = prefersReducedMotion();
    const canHover = hasFinePointer();

    /* ------------------------------------------------------------------
       State the draw loop reads. GSAP and the pointer handler write here;
       the loop never touches the DOM, so a frame costs drawing only.
       ------------------------------------------------------------------ */
    const anim = {
      // 0 -> 1 entrance: the sphere assembles outward from its centre.
      intro: reduce ? 1 : 0,
      // 0 -> 1 across the hero's exit, written by ScrollTrigger.
      scroll: 0,
      // Pointer lean, eased toward its target rather than snapping.
      tiltX: 0,
      tiltY: 0,
      targetTiltX: 0,
      targetTiltY: 0,
    };

    let width = 0;
    let height = 0;
    let dpr = 1;
    let radius = 0;
    let cx = 0;
    let cy = 0;

    let points = [];
    let edges = [];
    let pulses = [];
    let rings = [];
    let adjacency = [];

    let raf = 0;
    let running = false;
    let last = 0;
    let t = 0;

    // Accumulated rather than derived from `t`, so a change of speed can
    // never make the sphere jump.
    let rotY = 0;
    const baseTilt = -0.2;

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cx = width / 2;
      cy = height / 2;
      // Leaves room for the outer orbit and the glow falloff.
      radius = Math.min(width, height) * 0.36;

      // Density follows area, so the mesh reads at the same weight on every
      // screen instead of going sparse on a large one and solid on a small.
      const target = Math.round((width * height) / 2600);
      const cap = reduce ? 90 : canHover ? 170 : 96;
      const count = Math.max(44, Math.min(cap, target));

      points = fibonacciSphere(count).map((p, i) => {
        const accent = i % 6 === 0;
        return {
          x: p.x,
          y: p.y,
          z: p.z,
          // Points breathe along their own radius rather than wandering
          // across the surface, which would shear the mesh.
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 0.5,
          amp: 0.012 + Math.random() * 0.03,
          tone: accent ? ACCENTS[i % ACCENTS.length] : WHITE,
          accent,
          size: accent ? 1.5 : 0.85 + Math.random() * 0.5,
          charge: 0,
          // Staggers the entrance so the sphere assembles rather than
          // appearing all at once.
          delay: (i / count) * 0.45,
        };
      });

      /* --- adjacency, once -------------------------------------------------
         Chord distance on the unit sphere. The degree cap is what keeps the
         mesh delicate: without it the poles become a solid disc. */
      const MAX_CHORD = 0.46;
      const MAX_DEGREE = 5;
      const degree = new Array(points.length).fill(0);
      edges = [];
      for (let i = 0; i < points.length; i += 1) {
        for (let j = i + 1; j < points.length; j += 1) {
          if (degree[i] >= MAX_DEGREE || degree[j] >= MAX_DEGREE) continue;
          const a = points[i];
          const b = points[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
          if (d > MAX_CHORD) continue;
          degree[i] += 1;
          degree[j] += 1;
          edges.push({
            a: i,
            b: j,
            glow: 0,
            // Position along the illumination sweep, by latitude, so the wave
            // travels through the sphere in a readable direction instead of
            // lighting edges at random.
            wave: (a.y + b.y) / 4 + 0.5,
          });
        }
      }

      // Per-node edge lists, so a signal can pick its next hop without
      // scanning every edge in the graph on the frame it lands.
      adjacency = points.map(() => []);
      edges.forEach((e, i) => {
        adjacency[e.a].push(i);
        adjacency[e.b].push(i);
      });

      // A handful of signals, not a swarm - the point is that the network is
      // carrying something, not that it is busy.
      const pulseCount = reduce ? 0 : canHover ? 9 : 5;
      pulses = Array.from({ length: pulseCount }, (_, i) => ({
        edge: Math.floor(Math.random() * Math.max(edges.length, 1)),
        // Which end it is travelling toward, so a signal can traverse an edge
        // in either direction.
        toB: true,
        t: Math.random(),
        speed: 0.22 + Math.random() * 0.26,
        tone: ACCENTS[i % ACCENTS.length],
      }));

      // Great circles at fixed inclinations. They give the composition its
      // sense of being a sphere rather than a flat graph.
      rings = [
        { tilt: 0.0, scale: 1.0, alpha: 0.2 },
        { tilt: 1.15, scale: 1.0, alpha: 0.13 },
        { tilt: -0.72, scale: 1.17, alpha: 0.1 },
      ];
    };

    /* --- projection -------------------------------------------------------
       Rotate about Y, then X, then a weak perspective divide. FOV is high
       (shallow perspective) on purpose: a strong one makes a rotating sphere
       of points look like it is lunging at the reader. */
    const FOV = 3.1;
    let sinY = 0;
    let cosY = 1;
    let sinX = 0;
    let cosX = 1;

    const project = (px, py, pz, rScale, out) => {
      const x0 = px * rScale;
      const y0 = py * rScale;
      const z0 = pz * rScale;

      const x1 = x0 * cosY - z0 * sinY;
      const z1 = x0 * sinY + z0 * cosY;
      const y1 = y0 * cosX - z1 * sinX;
      const z2 = y0 * sinX + z1 * cosX;

      const persp = FOV / (FOV + z2);
      out.x = cx + x1 * radius * persp;
      out.y = cy + y1 * radius * persp;
      out.z = z2;
      out.s = persp;
      return out;
    };

    const tmp = { x: 0, y: 0, z: 0, s: 1 };
    const screen = [];

    const draw = (time) => {
      const dt = last ? Math.min((time - last) / 1000, 0.05) : 0.016;
      last = time;
      if (!reduce) t += dt;

      ctx.clearRect(0, 0, width, height);

      /* --- rotation ------------------------------------------------------
         Slow enough to read as drift rather than as a spinning logo. */
      if (!reduce) {
        rotY += dt * 0.085;
        anim.tiltX += (anim.targetTiltX - anim.tiltX) * Math.min(dt * 2.4, 1);
        anim.tiltY += (anim.targetTiltY - anim.tiltY) * Math.min(dt * 2.4, 1);
      }
      const yaw = rotY + anim.tiltY;
      // The sphere leans back as the hero scrolls away - a depth shift rather
      // than a slide, so it reads as parallax.
      const pitch = baseTilt + anim.tiltX + anim.scroll * 0.3;
      sinY = Math.sin(yaw);
      cosY = Math.cos(yaw);
      sinX = Math.sin(pitch);
      cosX = Math.cos(pitch);

      const intro = anim.intro;
      const introFade = Math.min(1, intro * 1.4);

      /* --- core glow -------------------------------------------------------
         A restrained blue breath behind the mesh, drawn as flat discs of low
         alpha rather than a radial CanvasGradient rebuilt every frame. */
      const breathe = reduce ? 0.55 : 0.5 + Math.sin(t * 0.55) * 0.5;
      const coreA = (0.1 + breathe * 0.07) * introFade;
      const coreR = radius * (0.52 + breathe * 0.07) * (0.6 + intro * 0.4);
      ctx.fillStyle = rgba(BLUE, coreA * 0.55);
      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = rgba(BLUE, coreA);
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 0.52, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = rgba(WHITE, coreA * 0.5);
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 0.17, 0, Math.PI * 2);
      ctx.fill();

      /* --- orbital rings ----------------------------------------------------
         Each is a great circle sampled and projected, so it genuinely sits in
         the same space as the mesh and passes behind it. */
      const ringSteps = 72;
      for (let r = 0; r < rings.length; r += 1) {
        const ring = rings[r];
        const cosT = Math.cos(ring.tilt);
        const sinT = Math.sin(ring.tilt);
        const rs = ring.scale * (0.75 + intro * 0.25);
        ctx.beginPath();
        for (let s = 0; s <= ringSteps; s += 1) {
          const ang = (s / ringSteps) * Math.PI * 2;
          const ux = Math.cos(ang);
          const uz = Math.sin(ang);
          project(ux, uz * sinT, uz * cosT, rs, tmp);
          if (s === 0) ctx.moveTo(tmp.x, tmp.y);
          else ctx.lineTo(tmp.x, tmp.y);
        }
        ctx.strokeStyle = rgba(WHITE, ring.alpha * introFade * 0.75);
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      /* --- project every point once ---------------------------------------- */
      for (let i = 0; i < points.length; i += 1) {
        const p = points[i];
        // Entrance: each point travels out from the centre on its own beat.
        const span = 1 - p.delay || 1;
        const local = Math.max(0, Math.min(1, (intro - p.delay) / span));
        // easeOutCubic by hand - this runs per point, per frame.
        const eased = 1 - (1 - local) ** 3;
        const breath = reduce ? 0 : Math.sin(t * p.speed + p.phase) * p.amp;
        const out = screen[i] || (screen[i] = { x: 0, y: 0, z: 0, s: 1, in: 0 });
        project(p.x, p.y, p.z, eased * (1 + breath), out);
        out.in = eased;
        if (!reduce) p.charge *= 1 - Math.min(dt * 1.6, 1);
      }

      /* --- the illumination sweep -------------------------------------------
         ONE wave travels through the sphere and brightens the edges it
         passes. This is what makes connections come alive progressively
         rather than shimmering independently, which reads as noise. */
      const wavePos = reduce ? 0.5 : ((t * 0.17) % 1.6) - 0.3;

      /* --- edges ------------------------------------------------------------
         Back-to-front sorting is unnecessary for 1px lines at these alphas,
         and sorting ~300 edges per frame is not worth an invisible gain.
         Depth is carried by alpha instead. */
      for (let i = 0; i < edges.length; i += 1) {
        const e = edges[i];
        const a = screen[e.a];
        const b = screen[e.b];
        if (!a || !b) continue;

        // 0 at the far side of the sphere, 1 at the near side.
        const depth = 0.5 + (a.z + b.z) / 4;
        if (!reduce) e.glow *= 1 - Math.min(dt * 1.3, 1);

        const near = Math.abs(e.wave - wavePos);
        const swept = near < 0.09 ? (1 - near / 0.09) ** 2 : 0;
        const lit = Math.max(
          e.glow,
          swept * 0.75,
          points[e.a].charge,
          points[e.b].charge
        );

        // Base lines are deliberately faint - the mesh should read as fine
        // structure, not as a wireframe.
        const base = 0.05 + depth * 0.1;
        const alpha =
          (base + lit * 0.42 + anim.scroll * 0.06) *
          introFade *
          Math.min(a.in, b.in);
        if (alpha <= 0.004) continue;

        if (lit > 0.1) {
          const tone = points[e.a].accent
            ? points[e.a].tone
            : points[e.b].accent
            ? points[e.b].tone
            : BLUE;
          ctx.strokeStyle = rgba(tone, alpha);
          ctx.lineWidth = 1 + lit * 0.5;
        } else {
          ctx.strokeStyle = rgba(WHITE, alpha);
          ctx.lineWidth = 1;
        }

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      ctx.lineWidth = 1;

      /* --- travelling signals ------------------------------------------------ */
      for (let i = 0; i < pulses.length; i += 1) {
        const pu = pulses[i];
        const e = edges[pu.edge];
        if (!e) continue;
        if (!reduce) pu.t += pu.speed * dt;

        if (pu.t >= 1) {
          // Land on the far node, light it, then continue along one of THAT
          // node's edges - so a signal traverses the network rather than
          // teleporting to an unrelated link.
          const landed = pu.toB ? e.b : e.a;
          points[landed].charge = 1;
          e.glow = 1;
          const options = adjacency[landed];
          const nextEdge = options.length
            ? options[Math.floor(Math.random() * options.length)]
            : pu.edge;
          pu.edge = nextEdge;
          pu.toB = edges[nextEdge].a === landed;
          pu.t = 0;
          continue;
        }

        const from = pu.toB ? screen[e.a] : screen[e.b];
        const to = pu.toB ? screen[e.b] : screen[e.a];
        if (!from || !to) continue;
        const x = from.x + (to.x - from.x) * pu.t;
        const y = from.y + (to.y - from.y) * pu.t;
        const depth = 0.5 + (from.z + to.z) / 4;
        const vis = introFade * (0.45 + depth * 0.55);

        ctx.fillStyle = rgba(pu.tone, 0.85 * vis);
        ctx.beginPath();
        ctx.arc(x, y, 1.9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = rgba(pu.tone, 0.16 * vis);
        ctx.beginPath();
        ctx.arc(x, y, 5.5, 0, Math.PI * 2);
        ctx.fill();
      }

      /* --- nodes -------------------------------------------------------------- */
      for (let i = 0; i < points.length; i += 1) {
        const p = points[i];
        const s = screen[i];
        if (!s || s.in <= 0.01) continue;

        const depth = (s.z + 1) / 2; // 0 far, 1 near
        const r = (p.size * (0.55 + depth * 0.85) + p.charge * 2.2) * s.s;
        const a = (0.2 + depth * 0.6 + p.charge * 0.4) * introFade * s.in;

        if (p.charge > 0.05 || (p.accent && depth > 0.55)) {
          const halo = p.charge > 0.05 ? p.charge : 0.22;
          ctx.fillStyle = rgba(p.tone, 0.13 * halo * introFade);
          ctx.beginPath();
          ctx.arc(s.x, s.y, r + 6 * halo + 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = rgba(p.tone, a);
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (running) raf = window.requestAnimationFrame(draw);
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      last = 0;
      raf = window.requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
    };

    build();
    // Always paint one composed frame, so the visual exists even where the
    // loop never runs.
    draw(0);
    if (!reduce) start();

    /* --- GSAP: the entrance ---------------------------------------------------
       Tweening a plain object rather than the DOM: the loop reads `anim.intro`
       and decides what it means. This is what lets the sphere's arrival belong
       to the hero's timeline instead of running on its own CSS clock. */
    let introTween = null;
    if (!reduce) {
      introTween = gsap.to(anim, {
        intro: 1,
        duration: 2.1,
        ease: "power2.out",
        delay: introDelay,
      });
    }

    /* --- GSAP: scroll response -------------------------------------------------
       Scrubbed, so the illumination and the lean follow the scrollbar in both
       directions. */
    let st = null;
    if (!reduce) {
      st = ScrollTrigger.create({
        trigger: wrap,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          anim.scroll = self.progress;
        },
      });
    }

    /* --- pointer ----------------------------------------------------------------
       A small lean toward the cursor. Listening on window rather than on the
       canvas, which is pointer-events:none so it can never swallow a click on
       the hero's buttons. */
    let onMove = null;
    if (canHover && !reduce) {
      onMove = (e) => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        anim.targetTiltY = nx * 0.26;
        anim.targetTiltX = ny * 0.16;
      };
      window.addEventListener("pointermove", onMove, { passive: true });
    }

    /* --- lifecycle ---------------------------------------------------------------- */
    let io = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => (e.isIntersecting ? start() : stop())),
        { threshold: 0 }
      );
      io.observe(canvas);
    }

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (canvas.isConnected) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    let resizeRaf = 0;
    const onResize = () => {
      if (resizeRaf) return;
      resizeRaf = window.requestAnimationFrame(() => {
        resizeRaf = 0;
        build();
        draw(performance.now());
      });
    };
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(onResize)
        : null;
    if (ro) ro.observe(canvas);
    else window.addEventListener("resize", onResize);

    return () => {
      stop();
      if (introTween) introTween.kill();
      if (st) st.kill();
      if (io) io.disconnect();
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      if (onMove) window.removeEventListener("pointermove", onMove);
      if (resizeRaf) window.cancelAnimationFrame(resizeRaf);
    };
  }, [introDelay]);

  return (
    <div
      className={`lfi-sphere ${className}`.trim()}
      ref={wrapRef}
      aria-hidden="true"
    >
      <span className="lfi-sphere__bloom" />
      <canvas ref={canvasRef} className="lfi-sphere__canvas" />
    </div>
  );
}

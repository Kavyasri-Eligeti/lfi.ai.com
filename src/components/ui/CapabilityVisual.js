import React, { useRef } from "react";
import useGsap from "../../motion/useGsap";
import { gsap, EASE, prefersReducedMotion } from "../../motion";
import "./CapabilityVisual.css";

/* ==========================================================================
   Technical illustrations for the six AI & ML capabilities.

   Schematics, not screenshots. Each one draws the SHAPE of the capability -
   a funnel narrowing, a document becoming fields, a query resolving to a
   ranked answer - using the same 320x220 grid, stroke weight and palette, so
   the six read as one family.

   What they deliberately are NOT: product interfaces. There are no fake
   dashboards, no invented metrics, no numbers presented as results, and no
   labels implying a system that exists. A reader must not be able to mistake
   any of these for a screenshot of something they could be sold.

   They animate on activation: a short GSAP timeline per visual, re-run each
   time its capability is selected, so choosing one has a visible consequence
   rather than swapping a static picture.
   ========================================================================== */

const VIEWBOX = "0 0 320 220";

/* --- 01  Idea to product: many candidate use cases, narrowed to one ------- */
function IdeaToProduct() {
  const CANDIDATES = [34, 62, 90, 118, 146];
  return (
    <>
      <g className="cv-dim">
        <path d="M30 40h260M30 180h260" />
      </g>
      {CANDIDATES.map((y, i) => (
        <g key={y} className="cv-item" data-i={i}>
          <rect className="cv-line" x="26" y={y} width="62" height="18" rx="4" />
          <path className="cv-flow" d={`M92 ${y + 9}H160`} />
        </g>
      ))}
      {/* The funnel: everything converges on the one that is worth building. */}
      <path className="cv-accent-line" d="M160 43v134" />
      <g className="cv-chosen">
        <rect
          className="cv-fill-blue"
          x="196"
          y="86"
          width="94"
          height="46"
          rx="8"
        />
        <path className="cv-flow cv-flow--lead" d="M160 109h36" />
        <path className="cv-tick" d="M222 109l9 9 17-19" />
      </g>
    </>
  );
}

/* --- 02  Platform services: a model moving from build into production ----- */
function PlatformServices() {
  return (
    <>
      <g className="cv-stack">
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            className="cv-item cv-line"
            data-i={i}
            x="34"
            y={58 + i * 38}
            width="110"
            height="28"
            rx="6"
          />
        ))}
      </g>
      {/* The loop is the point: deploy, observe, retrain. */}
      <path className="cv-flow cv-flow--lead" d="M150 72h52a10 10 0 0 1 10 10v56" />
      <path className="cv-flow" d="M212 152a10 10 0 0 1-10 10h-52" />
      <g className="cv-chosen">
        <rect
          className="cv-fill-blue"
          x="214"
          y="78"
          width="76"
          height="64"
          rx="8"
        />
        <path className="cv-dim" d="M230 100h44M230 112h30M230 124h38" />
      </g>
      <circle className="cv-pulse" cx="252" cy="110" r="4" />
    </>
  );
}

/* --- 03  Explainable AI: the decision, and what drove it ------------------ */
function ExplainableAi() {
  const BARS = [
    { w: 96, tone: "cv-fill-yellow" },
    { w: 68, tone: "cv-fill-orange" },
    { w: 44, tone: "cv-fill-blue" },
    { w: 24, tone: "cv-fill-dim" },
  ];
  return (
    <>
      <g className="cv-chosen">
        <rect className="cv-line" x="30" y="86" width="74" height="48" rx="8" />
        <path className="cv-tick" d="M50 110l8 9 16-20" />
      </g>
      <path className="cv-flow cv-flow--lead" d="M106 110h34" />
      {/* Contribution bars - the reasoning behind the outcome, not a score. */}
      {BARS.map((b, i) => (
        <g key={i} className="cv-item" data-i={i}>
          <path className="cv-dim" d={`M144 ${62 + i * 32}h4`} />
          <rect
            className={b.tone}
            x="152"
            y={54 + i * 32}
            width={b.w}
            height="16"
            rx="4"
          />
        </g>
      ))}
    </>
  );
}

/* --- 04  Document analytics: unstructured text becoming fields ------------ */
function DocumentAnalytics() {
  return (
    <>
      <g className="cv-chosen">
        <path
          className="cv-line"
          d="M38 34h62l24 24v128a8 8 0 0 1-8 8H38a8 8 0 0 1-8-8V42a8 8 0 0 1 8-8Z"
        />
        <path className="cv-dim" d="M100 34v24h24" />
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            className="cv-item cv-dim"
            data-i={i}
            d={`M46 ${80 + i * 18}h${i % 2 ? 54 : 72}`}
          />
        ))}
      </g>
      {[0, 1, 2].map((i) => (
        <g key={i} className="cv-item" data-i={i + 2}>
          <path className="cv-flow" d={`M130 ${96 + i * 30}H182`} />
          <rect
            className={i === 0 ? "cv-fill-yellow" : "cv-line"}
            x="186"
            y={84 + i * 30}
            width="104"
            height="24"
            rx="5"
          />
        </g>
      ))}
    </>
  );
}

/* --- 05  Enterprise search: a question resolving to one answer ------------ */
function EnterpriseSearch() {
  const SOURCES = [
    [214, 54],
    [252, 86],
    [206, 118],
    [256, 150],
  ];
  return (
    <>
      <g className="cv-chosen">
        <rect className="cv-line" x="26" y="92" width="112" height="36" rx="18" />
        <circle className="cv-dim" cx="50" cy="110" r="8" />
        <path className="cv-dim" d="M56 116l7 7M72 104h46M72 116h28" />
      </g>
      {/* Semantic neighbourhood: the sources the answer was drawn from. */}
      {SOURCES.map(([x, y], i) => (
        <g key={i} className="cv-item" data-i={i}>
          <path className="cv-flow" d={`M140 110C${170} ${110} ${176} ${y} ${x - 14} ${y}`} />
          <circle
            className={i === 0 ? "cv-fill-yellow" : "cv-fill-dim"}
            cx={x}
            cy={y}
            r={i === 0 ? 7 : 5}
          />
        </g>
      ))}
      <circle className="cv-pulse" cx="214" cy="54" r="12" />
    </>
  );
}

/* --- 06  Conversational platforms: intent read from the exchange ---------- */
function Conversational() {
  const TURNS = [
    { x: 34, y: 44, w: 132, side: "l" },
    { x: 150, y: 92, w: 140, side: "r" },
    { x: 34, y: 140, w: 110, side: "l" },
  ];
  return (
    <>
      {TURNS.map((t, i) => (
        <g key={i} className="cv-item" data-i={i}>
          <rect
            className={t.side === "r" ? "cv-fill-blue" : "cv-line"}
            x={t.x}
            y={t.y}
            width={t.w}
            height={40}
            rx="12"
          />
          <path
            className="cv-dim"
            d={`M${t.x + 16} ${t.y + 16}h${t.w - 56}M${t.x + 16} ${
              t.y + 27
            }h${t.w - 82}`}
          />
        </g>
      ))}
      {/* Intent, read from context rather than from the words alone. */}
      <g className="cv-chosen">
        <path className="cv-accent-line" d="M172 184h116" />
        <circle className="cv-fill-yellow" cx="172" cy="184" r="5" />
        <path className="cv-dim" d="M186 184h8M202 184h18M228 184h12" />
      </g>
    </>
  );
}

const VISUALS = {
  "idea-to-product": IdeaToProduct,
  "platform-services": PlatformServices,
  "explainable-ai": ExplainableAi,
  "document-analytics": DocumentAnalytics,
  "enterprise-search": EnterpriseSearch,
  conversational: Conversational,
};

export default function CapabilityVisual({ id }) {
  const ref = useRef(null);
  const Shape = VISUALS[id];

  /* Re-keyed on `id`, so selecting a capability re-runs its entrance rather
     than cross-fading two static pictures. */
  useGsap(
    (root) => {
      if (prefersReducedMotion() || !Shape) return;

      const tl = gsap.timeline({ defaults: { ease: EASE.out } });

      tl.from(root, { opacity: 0, duration: 0.35 })
        .from(
          root.querySelectorAll(".cv-chosen > *"),
          { opacity: 0, scale: 0.92, transformOrigin: "center", duration: 0.5, stagger: 0.06 },
          0.05
        )
        .from(
          root.querySelectorAll(".cv-item"),
          { opacity: 0, x: -14, duration: 0.45, stagger: 0.055 },
          0.12
        );

      // The connectors draw themselves. strokeDasharray is set from each
      // path's own length so the effect is correct at any size, rather than
      // from a guessed constant.
      const flows = root.querySelectorAll(".cv-flow");
      flows.forEach((path, i) => {
        const len = typeof path.getTotalLength === "function" ? path.getTotalLength() : 0;
        if (!len) return;
        gsap.fromTo(
          path,
          { strokeDasharray: len, strokeDashoffset: len },
          {
            strokeDashoffset: 0,
            duration: 0.75,
            ease: EASE.out,
            delay: 0.22 + i * 0.05,
          }
        );
      });
    },
    [id],
    ref
  );

  if (!Shape) return null;

  return (
    <svg
      ref={ref}
      className="lfi-cv"
      viewBox={VIEWBOX}
      fill="none"
      role="presentation"
      focusable="false"
      aria-hidden="true"
    >
      <Shape />
    </svg>
  );
}

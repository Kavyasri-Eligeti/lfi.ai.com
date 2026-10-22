import React, { useRef } from "react";
import useGsap from "../../motion/useGsap";
import { gsap, EASE, prefersReducedMotion } from "../../motion";
import "./ProductMockup.css";

/* ==========================================================================
   Product interface mockups.

   The products section used to show each product as its wordmark on a
   transparent plate, which read as a logo wall rather than as software. These
   are the interfaces instead: a glass window frame per product, drawn on one
   360x240 grid with one stroke weight, so five of them read as one product
   family rather than five unrelated pictures.

   What each one draws is the SHAPE OF ITS INTERACTION - documents entering a
   pipeline and leaving as records, a page resolving into fields, touchpoints
   collapsing into one profile. That is the honest part of a product UI and
   the part worth showing.

   What they deliberately do NOT contain: any number at all. No figures, no
   percentages, no counts, no axis labels, no customer names, no results. A
   mockup with invented metrics in it is a fabricated claim no matter how
   small the type, and a reader must not be able to screenshot anything here
   and present it as a measured outcome. Bars have heights and charts have
   shapes because that is what a chart looks like; nothing is quantified.

   The product wordmark is NOT drawn here. It is laid over the window's title
   bar as the real brand asset (see Products.js), which is why the chrome
   leaves its top-left corner empty.
   ========================================================================== */

const VIEWBOX = "0 0 360 240";

/* --- shared window chrome -------------------------------------------------
   The title bar is empty on the left on purpose - the wordmark sits there.
   -------------------------------------------------------------------------- */
function Chrome() {
  return (
    <g className="pm-chrome">
      <rect
        className="pm-frame"
        x="0.75"
        y="0.75"
        width="358.5"
        height="238.5"
        rx="14"
      />
      <path className="pm-divider" d="M1 34h358" />
      <rect className="pm-chip" x="296" y="12.5" width="48" height="11" rx="5.5" />
      <path className="pm-dim" d="M276 18h10" />
    </g>
  );
}

/* --- vajraX: documents entering a pipeline, leaving as records ------------ */
function VajraX() {
  const INBOX = [70, 94, 118];
  const STAGES = [104, 146, 188];
  return (
    <>
      {INBOX.map((y, i) => (
        <rect
          key={y}
          className="pm-item pm-line"
          data-i={i}
          x="24"
          y={y}
          width="58"
          height="16"
          rx="4"
        />
      ))}

      {/* The rail runs behind the stages, so the stages sit ON the pipeline. */}
      <path className="pm-flow pm-flow--lead" d="M90 102h152" />

      {STAGES.map((x, i) => (
        <rect
          key={x}
          className="pm-node pm-fill-dim"
          data-i={i}
          x={x}
          y="85"
          width="34"
          height="34"
          rx="9"
        />
      ))}

      {/* A single packet travelling the pipeline - the one ambient loop. */}
      <circle className="pm-packet" cx="96" cy="102" r="3.6" />

      <g className="pm-panel">
        <rect
          className="pm-fill-blue"
          x="250"
          y="72"
          width="84"
          height="60"
          rx="10"
        />
        <path className="pm-dim" d="M264 90h56M264 102h38M264 114h48" />
      </g>

      {/* Work still queued, below the line it is being drawn from. */}
      <path className="pm-dim" d="M24 186h312" />
      <path className="pm-flow--lead" d="M24 186h196" />
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          className="pm-item pm-fill-dim"
          data-i={i + 3}
          x={24 + i * 80}
          y="200"
          width="66"
          height="12"
          rx="4"
        />
      ))}
    </>
  );
}

/* --- TextIQ: a page resolving into fields --------------------------------- */
function TextIq() {
  const ROWS = [68, 102, 136, 170];
  return (
    <>
      <g className="pm-panel">
        <rect className="pm-line" x="24" y="56" width="108" height="150" rx="6" />
        <path
          className="pm-dim"
          d="M36 74h72M36 86h84M36 110h60M36 158h80M36 170h54M36 190h66"
        />
      </g>

      {/* The two regions the model actually took something from. */}
      <rect
        className="pm-item pm-fill-yellow"
        data-i="0"
        x="34"
        y="94"
        width="78"
        height="13"
        rx="3"
      />
      <rect
        className="pm-item pm-fill-orange"
        data-i="1"
        x="34"
        y="128"
        width="62"
        height="13"
        rx="3"
      />

      <path className="pm-flow pm-flow--lead" d="M132 100c34 0 30-19 62-19" />
      <path className="pm-flow" d="M132 134c40 0 24 19 62 19" />

      {ROWS.map((y, i) => (
        <g key={y} className="pm-item" data-i={i + 2}>
          <rect
            className="pm-fill-dim"
            x="194"
            y={y}
            width="142"
            height="26"
            rx="6"
          />
          <rect
            className="pm-chip-sm"
            x="204"
            y={y + 8}
            width="34"
            height="10"
            rx="3"
          />
          <path className="pm-dim" d={`M248 ${y + 13}h${74 - i * 12}`} />
        </g>
      ))}

      {/* The read head, sweeping the page. */}
      <rect className="pm-scan" x="24" y="56" width="108" height="2.5" rx="1.25" />
    </>
  );
}

/* --- FinSight: the reporting surface -------------------------------------- */
function FinSight() {
  const BARS = [
    { x: 44, h: 40 },
    { x: 80, h: 64 },
    { x: 116, h: 52 },
    { x: 152, h: 86 },
    { x: 188, h: 70 },
  ];
  return (
    <>
      <g className="pm-panel">
        <rect className="pm-line" x="24" y="56" width="200" height="120" rx="6" />
        <path className="pm-dim" d="M24 86h200M24 116h200M24 146h200" />
      </g>

      {BARS.map((b, i) => (
        <rect
          key={b.x}
          className={`pm-bar ${i === 3 ? "pm-fill-yellow" : "pm-fill-blue"}`}
          data-i={i}
          x={b.x}
          y={176 - b.h}
          width="18"
          height={b.h}
          rx="3"
        />
      ))}

      {/* The shape of the series, over the bars it is drawn from. */}
      <path
        className="pm-flow pm-flow--lead"
        d="M53 130l36-24 36 12 36-34 36 16"
      />

      <g className="pm-panel">
        <rect className="pm-line" x="240" y="56" width="96" height="120" rx="6" />
      </g>
      {[0, 1, 2, 3].map((i) => (
        <g key={i} className="pm-item" data-i={i + 5}>
          <rect
            className={
              i === 0
                ? "pm-fill-yellow"
                : i === 1
                ? "pm-fill-orange"
                : "pm-fill-blue"
            }
            x="252"
            y={72 + i * 26}
            width="10"
            height="10"
            rx="3"
          />
          <path
            className="pm-dim"
            d={`M270 ${77 + i * 26}h${56 - i * 9}`}
          />
        </g>
      ))}

      {[24, 88, 152].map((x, i) => (
        <rect
          key={x}
          className={`pm-item ${i === 0 ? "pm-chip-sm" : "pm-fill-dim"}`}
          data-i={i + 9}
          x={x}
          y="194"
          width="56"
          height="14"
          rx="4"
        />
      ))}
    </>
  );
}

/* --- Engage360: touchpoints collapsing into one relationship -------------- */
function Engage360() {
  const CHANNELS = [60, 96, 132, 168];
  return (
    <>
      {CHANNELS.map((y, i) => (
        <g key={y} className="pm-item" data-i={i}>
          <rect className="pm-fill-dim" x="24" y={y} width="58" height="26" rx="7" />
          <path className="pm-dim" d={`M36 ${y + 13}h${34 - i * 5}`} />
        </g>
      ))}

      {/* Every channel lands on the same spine. */}
      <path className="pm-dim" d="M196 54v156" />
      {CHANNELS.map((y, i) => (
        <path
          key={y}
          className={`pm-flow ${i === 1 ? "pm-flow--lead" : ""}`}
          d={`M82 ${y + 13}c62 0 48 ${78 + i * 24 - (y + 13)} 114 ${
            78 + i * 24 - (y + 13)
          }`}
        />
      ))}
      {CHANNELS.map((_, i) => (
        <circle
          key={i}
          className="pm-dot"
          data-i={i}
          cx="196"
          cy={78 + i * 24}
          r="4"
        />
      ))}

      <g className="pm-panel">
        <rect
          className="pm-fill-blue"
          x="232"
          y="72"
          width="104"
          height="104"
          rx="10"
        />
        <circle className="pm-line" cx="254" cy="98" r="11" />
        <path className="pm-dim" d="M274 94h44M274 104h30" />
        <path className="pm-dim" d="M248 130h72M248 144h58M248 158h66" />
      </g>
    </>
  );
}

/* --- EduPilot: an answer, and the material it came from -------------------- */
function EduPilot() {
  return (
    <>
      <g className="pm-item" data-i="0">
        <rect
          className="pm-fill-blue"
          x="146"
          y="52"
          width="190"
          height="34"
          rx="11"
        />
        <path className="pm-dim" d="M160 66h150M160 76h96" />
      </g>

      <g className="pm-item" data-i="1">
        <rect className="pm-line" x="24" y="100" width="214" height="70" rx="11" />
        <path className="pm-dim" d="M38 118h178M38 130h160M38 142h124" />
      </g>

      {/* The citation, and the source it points at. The whole product claim. */}
      <rect
        className="pm-item pm-fill-yellow"
        data-i="2"
        x="38"
        y="150"
        width="74"
        height="13"
        rx="6.5"
      />
      <path className="pm-flow pm-flow--lead" d="M112 156h142" />

      <g className="pm-panel">
        <rect className="pm-line" x="254" y="118" width="82" height="76" rx="9" />
        <path
          className="pm-dim"
          d="M266 136h58M266 148h44M266 160h54M266 172h38"
        />
      </g>

      {/* Still answering. */}
      <g className="pm-typing">
        <circle cx="40" cy="194" r="3.4" />
        <circle cx="53" cy="194" r="3.4" />
        <circle cx="66" cy="194" r="3.4" />
      </g>
    </>
  );
}

/* --- Digital Growth Intelligence: queries resolving into a trend -----------
   The published description is "search and digital growth analytics", so the
   shape drawn is the one that describes: a list of queries on the left
   feeding a series on the right.

   Same rule as every other window here - no numbers, no axis labels, no
   percentages. The series has a shape because that is what a series looks
   like; nothing in it is quantified, and nothing here can be screenshotted
   and passed off as a measured result.

   This product ships no wordmark asset, so unlike its siblings the title bar
   is left as drawn chrome (Products.js omits the overlay when there is no
   image). The leading rule stands in for it. */
function DigitalGrowth() {
  /* The panels share the 56 -> 176 band every other window in this family
     uses, so the six of them line up when seen together in the grid. */
  const QUERIES = [72, 96, 120, 144];
  return (
    <>
      {/* Stands in for the missing wordmark in the title bar. */}
      <rect className="pm-fill-yellow" x="24" y="14" width="30" height="7" rx="3.5" />

      {/* The query list. */}
      <g className="pm-panel">
        <rect className="pm-line" x="24" y="56" width="126" height="120" rx="6" />
      </g>
      {QUERIES.map((y, i) => (
        <g key={y} className="pm-item" data-i={i}>
          <circle
            className={i === 1 ? "pm-fill-yellow" : "pm-fill-dim"}
            cx="40"
            cy={y}
            r="3.4"
          />
          <path className="pm-dim" d={`M52 ${y}h${86 - i * 12}`} />
        </g>
      ))}

      {/* Query set resolving into the series. */}
      <path className="pm-flow pm-flow--lead" d="M150 116c30 0 26-22 56-22" />

      {/* The trend surface. */}
      <g className="pm-panel">
        <rect className="pm-line" x="206" y="56" width="130" height="120" rx="6" />
        <path className="pm-dim" d="M206 90h130M206 120h130M206 150h130" />
      </g>
      <path
        className="pm-flow pm-flow--lead"
        d="M218 156l24-16 24 8 24-26 24-18"
      />
      {/* The current point on the series. */}
      <circle className="pm-fill-orange" cx="314" cy="104" r="4.6" />
      <circle className="pm-packet" cx="266" cy="148" r="3" />
    </>
  );
}

const MOCKUPS = {
  vajrax: VajraX,
  textiq: TextIq,
  finsight: FinSight,
  engage360: Engage360,
  edupilot: EduPilot,
  seo: DigitalGrowth,
};

/** True when this product has a mockup, so callers can fall back cleanly. */
export function hasMockup(id) {
  return Boolean(MOCKUPS[id]);
}

export default function ProductMockup({ id, className = "" }) {
  const ref = useRef(null);
  const Shape = MOCKUPS[id];

  /* ----------------------------------------------------------------------
     One timeline, shared by all five.

     The mockups are built from the same vocabulary of class names, so the
     entrance is written once against those names rather than five times
     against five sets of markup. Only one of the five has bars, and only one
     has pipeline nodes, so most of these steps find nothing in most of the
     mockups - `step()` drops those rather than handing GSAP an empty target
     list, which it accepts but warns about once per call.

     It plays ONCE, when the card arrives. These sit four-across in a grid;
     four interfaces looping independently is a section that will not sit
     still long enough to be read. The only continuous movement is the one
     ambient element per mockup (the packet, the scan head, the typing dots),
     and those are CSS so they cost nothing on the main thread.
     ---------------------------------------------------------------------- */
  useGsap(
    (root) => {
      if (prefersReducedMotion() || !Shape) return;

      const q = (sel) => root.querySelectorAll(sel);

      const tl = gsap.timeline({
        defaults: { ease: EASE.out },
        scrollTrigger: { trigger: root, start: "top 88%", once: true },
      });

      /** Add a step only if this mockup actually contains those elements. */
      const step = (sel, vars, at) => {
        const targets = q(sel);
        if (targets.length) tl.from(targets, vars, at);
      };

      step(".pm-chrome", { opacity: 0, duration: 0.45 }, 0);
      step(
        ".pm-panel",
        {
          opacity: 0,
          scale: 0.95,
          transformOrigin: "center",
          duration: 0.55,
          stagger: 0.08,
        },
        0.1
      );
      step(
        ".pm-item",
        { opacity: 0, x: -12, duration: 0.45, stagger: 0.07 },
        0.2
      );
      step(
        ".pm-bar",
        {
          scaleY: 0,
          transformOrigin: "bottom",
          duration: 0.6,
          stagger: 0.07,
          ease: EASE.emphasis,
        },
        0.22
      );
      step(
        ".pm-node",
        {
          opacity: 0,
          scale: 0.8,
          transformOrigin: "center",
          duration: 0.45,
          stagger: 0.1,
        },
        0.3
      );
      step(
        ".pm-dot",
        {
          opacity: 0,
          scale: 0,
          transformOrigin: "center",
          duration: 0.4,
          stagger: 0.09,
        },
        0.42
      );

      /* The connectors draw themselves, each from its own measured length so
         the effect is correct whatever size the card renders at. */
      q(".pm-flow").forEach((path, i) => {
        const len =
          typeof path.getTotalLength === "function" ? path.getTotalLength() : 0;
        if (!len) return;
        gsap.fromTo(
          path,
          { strokeDasharray: len, strokeDashoffset: len },
          {
            strokeDashoffset: 0,
            duration: 0.8,
            ease: EASE.out,
            delay: 0.3 + i * 0.07,
            scrollTrigger: { trigger: root, start: "top 88%", once: true },
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
      className={`lfi-pm ${className}`.trim()}
      viewBox={VIEWBOX}
      fill="none"
      role="presentation"
      focusable="false"
      aria-hidden="true"
    >
      <Chrome />
      <Shape />
    </svg>
  );
}

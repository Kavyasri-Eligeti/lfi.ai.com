import React from "react";

/**
 * One small animated diagram per portfolio, echoing the deck's panel art:
 *
 *   pipeline - legacy blocks pass through a "modernise" gate and come out new
 *   hub      - Linkfields at the centre of the enterprise's core systems
 *   neural   - scattered data resolving through a network into a decision
 *   radar    - a sweep finding exposures on an attack surface
 *
 * Pure SVG with CSS animation (see Portfolios.css), so it costs no script and
 * freezes cleanly under reduced motion. Decorative - the panel's text carries
 * the meaning - so it is hidden from assistive technology.
 */
export default function PortfolioVisual({ kind, photo }) {
  if (kind === "photo") {
    return (
      <div className="pf-vis pf-vis--photo" aria-hidden="true">
        <img src={photo} width="1136" height="478" alt="" loading="lazy" decoding="async" />
      </div>
    );
  }
  return (
    <div className={`pf-vis pf-vis--${kind}`} aria-hidden="true">
      <svg viewBox="0 0 400 170" preserveAspectRatio="xMidYMid meet">
        {kind === "pipeline" && <Pipeline />}
        {kind === "hub" && <Hub />}
        {kind === "neural" && <Neural />}
        {kind === "radar" && <Radar />}
      </svg>
    </div>
  );
}

function Pipeline() {
  return (
    <g>
      <line x1="20" y1="85" x2="380" y2="85" className="pf-vis__rail" />
      {[60, 118].map((x) => (
        <g key={x} transform={`translate(${x} 85)`}>
          <rect x="-13" y="-13" width="26" height="26" className="pf-vis__legacy" />
          <line x1="-13" y1="-13" x2="13" y2="13" className="pf-vis__legacy" />
        </g>
      ))}
      <rect x="182" y="40" width="36" height="90" rx="12" className="pf-vis__gate" />
      <text x="200" y="146" className="pf-vis__label" textAnchor="middle">
        MODERNISE
      </text>
      <g className="pf-vis__mover">
        <rect x="-11" y="-11" width="22" height="22" rx="3" className="pf-vis__block" transform="translate(0 85)" />
      </g>
      <g className="pf-vis__mover pf-vis__mover--2">
        <rect x="-11" y="-11" width="22" height="22" rx="3" className="pf-vis__block" transform="translate(0 85)" />
      </g>
      <rect x="276" y="73" width="24" height="24" rx="12" className="pf-vis__new" />
      <rect x="330" y="73" width="24" height="24" rx="12" className="pf-vis__new pf-vis__new--2" />
    </g>
  );
}

const HUB_NODES = [
  { t: "SCM", x: 110, y: 30 },
  { t: "CX", x: 290, y: 30 },
  { t: "FIN", x: 44, y: 85 },
  { t: "ERP", x: 356, y: 85 },
  { t: "HR", x: 110, y: 140 },
  { t: "CRM", x: 290, y: 140 },
];
function Hub() {
  return (
    <g>
      <ellipse cx="200" cy="85" rx="160" ry="58" className="pf-vis__orbit" />
      {HUB_NODES.map((n, i) => (
        <g key={n.t}>
          <line x1="200" y1="85" x2={n.x} y2={n.y} className="pf-vis__spoke" />
          <line x1="200" y1="85" x2={n.x} y2={n.y} className="pf-vis__packet" style={{ "--i": i }} pathLength="1" />
        </g>
      ))}
      {HUB_NODES.map((n) => (
        <g key={`n-${n.t}`} transform={`translate(${n.x} ${n.y})`}>
          <rect x="-19" y="-10" width="38" height="20" rx="6" className="pf-vis__node" />
          <text y="3.5" className="pf-vis__label" textAnchor="middle">
            {n.t}
          </text>
        </g>
      ))}
      <circle cx="200" cy="85" r="24" className="pf-vis__core" />
      <circle cx="200" cy="85" r="24" className="pf-vis__core-ring" />
      <text x="200" y="89" className="pf-vis__label pf-vis__label--ink" textAnchor="middle">
        LF
      </text>
    </g>
  );
}

const SCATTER = [
  [26, 40], [48, 118], [40, 72], [70, 30], [64, 96], [88, 60], [92, 132], [110, 44], [104, 104],
  [128, 80], [124, 140], [138, 32], [58, 150], [22, 100], [80, 80], [116, 122],
];
const LAYERS = [
  [40, 62, 84, 106, 128],
  [50, 74, 98, 122],
  [62, 85, 108],
];
function Neural() {
  const xs = [190, 250, 310];
  const edges = [];
  for (let l = 0; l < LAYERS.length - 1; l++) {
    LAYERS[l].forEach((y1) =>
      LAYERS[l + 1].forEach((y2) => edges.push([xs[l], y1, xs[l + 1], y2]))
    );
  }
  return (
    <g>
      {SCATTER.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.2" className="pf-vis__datum" style={{ "--i": i }} />
      ))}
      {LAYERS[0].map((y, i) => (
        <line key={`in-${i}`} x1="150" y1={85} x2={xs[0]} y2={y} className="pf-vis__edge pf-vis__edge--in" />
      ))}
      {edges.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="pf-vis__edge" style={{ "--i": i % 7 }} />
      ))}
      {LAYERS.map((layer, l) =>
        layer.map((y, i) => (
          <circle key={`${l}-${i}`} cx={xs[l]} cy={y} r="5" className="pf-vis__neuron" style={{ "--l": l, "--i": i }} />
        ))
      )}
      <line x1="320" y1="85" x2="380" y2="85" className="pf-vis__out" />
    </g>
  );
}

function Radar() {
  return (
    <g transform="translate(200 85)">
      {[24, 46, 68].map((r) => (
        <circle key={r} r={r} className="pf-vis__ring" />
      ))}
      <line x1="-80" y1="0" x2="80" y2="0" className="pf-vis__ring" />
      <line x1="0" y1="-80" x2="0" y2="80" className="pf-vis__ring" />
      <g className="pf-vis__sweep">
        <path d="M0 0 L70 0 A70 70 0 0 0 49.5 -49.5 Z" className="pf-vis__wedge" />
        <line x1="0" y1="0" x2="70" y2="0" className="pf-vis__beam" />
      </g>
      {[
        [30, -44],
        [-38, 22],
        [52, 30],
        [12, 58],
        [-56, -28],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <circle r="3" className="pf-vis__blip" style={{ "--i": i }} />
          <path d="M-8 -8h4M-8 -8v4M8 -8h-4M8 -8v4M-8 8h4M-8 8v-4M8 8h-4M8 8v-4" className="pf-vis__target" style={{ "--i": i }} />
        </g>
      ))}
    </g>
  );
}

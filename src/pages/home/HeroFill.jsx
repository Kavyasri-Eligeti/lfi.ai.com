import './hero-fill.css';

/**
 * The homepage hero's background fill, from the "Linkfields Homepage" design
 * canvas: drifting colour glows, a dot grid that clears around the ring, a
 * moving perspective floor at the sides, node networks with pulses running
 * along them, tilted orbit rings around the AI ring, small wireframe cubes and
 * floating capability chips. It sits behind the (transparent) 3D stage, so the
 * ring and helix above it are untouched. Decorative only.
 *
 * Coordinates are the design's 1918 × 948 frame; positions become percentages
 * so the layer scales with the viewport.
 */
const FW = 1918;
const FH = 948;
const px = (x) => `${((x / FW) * 100).toFixed(3)}%`;
const py = (y) => `${((y / FH) * 100).toFixed(3)}%`;

const TEAL = '#4FE0C2';
const VIOLET = '#8B7CF6';
const PINK = '#E86FA8';
const GOLD = '#F5C84B';

const NODES = [
  [90, 180, TEAL, 1], [210, 240, VIOLET, 0], [150, 360, PINK, 0], [330, 310, GOLD, 1], [260, 450, TEAL, 0],
  [440, 410, VIOLET, 0], [100, 570, PINK, 1], [230, 650, GOLD, 0], [390, 560, TEAL, 0], [530, 500, VIOLET, 1],
  [480, 720, PINK, 0], [300, 810, GOLD, 0], [150, 870, TEAL, 1], [560, 250, VIOLET, 0], [400, 170, PINK, 0],
  [1270, 180, TEAL, 1], [1420, 215, VIOLET, 0], [1570, 165, PINK, 0], [1710, 250, GOLD, 1], [1840, 180, TEAL, 0],
  [1340, 370, VIOLET, 0], [1500, 380, PINK, 1], [1660, 345, GOLD, 0], [1810, 420, TEAL, 0], [1250, 530, VIOLET, 1],
  [1430, 555, PINK, 0], [1580, 600, GOLD, 0], [1745, 560, TEAL, 1], [1860, 650, VIOLET, 0], [1320, 730, PINK, 0],
  [1500, 770, GOLD, 1], [1690, 745, TEAL, 0],
];

const LINKS = [
  [330, 310, 260, 450], [260, 450, 100, 570], [440, 410, 560, 250], [90, 180, 150, 360], [390, 560, 530, 500],
  [210, 240, 330, 310], [560, 250, 400, 170], [440, 410, 530, 500], [90, 180, 210, 240], [150, 360, 260, 450],
  [210, 240, 150, 360], [480, 720, 300, 810], [100, 570, 230, 650], [230, 650, 150, 870], [330, 310, 440, 410],
  [330, 310, 400, 170], [440, 410, 390, 560], [390, 560, 480, 720], [300, 810, 150, 870], [230, 650, 300, 810],
  [1710, 250, 1840, 180], [1710, 250, 1660, 345], [1745, 560, 1860, 650], [1270, 180, 1340, 370], [1810, 420, 1745, 560],
  [1340, 370, 1500, 380], [1840, 180, 1810, 420], [1340, 370, 1250, 530], [1320, 730, 1500, 770], [1270, 180, 1420, 215],
  [1250, 530, 1430, 555], [1420, 215, 1570, 165], [1430, 555, 1580, 600], [1580, 600, 1690, 745], [1420, 215, 1340, 370],
  [1430, 555, 1320, 730], [1860, 650, 1690, 745], [1500, 380, 1660, 345], [1500, 770, 1690, 745], [1570, 165, 1710, 250],
  [1580, 600, 1745, 560], [1580, 600, 1500, 770], [1660, 345, 1810, 420],
];

const PULSES = [
  ['M90 180 L210 240 L330 310 L440 410 L530 500', TEAL],
  ['M100 570 L230 650 L390 560 L480 720', GOLD],
  ['M150 870 L300 810 L480 720 L530 500 L560 250', PINK],
  ['M1270 180 L1420 215 L1570 165 L1710 250 L1840 180', VIOLET],
  ['M1340 370 L1500 380 L1660 345 L1810 420', TEAL],
  ['M1250 530 L1430 555 L1580 600 L1745 560 L1860 650', GOLD],
  ['M1320 730 L1500 770 L1690 745 L1745 560', PINK],
];

const ORBITS = [
  { size: 1000, dur: 18, dot: TEAL, dotSize: 10, dashed: false, rev: false },
  { size: 1400, dur: 28, dot: PINK, dotSize: 9, dashed: true, rev: true },
  { size: 1800, dur: 40, dot: GOLD, dotSize: 8, dashed: false, rev: false },
];

const CUBES = [
  { x: 560, y: 150, s: 46, c: 'rgba(79,224,194,.45)' },
  { x: 1770, y: 700, s: 40, c: 'rgba(232,111,168,.45)' },
  { x: 60, y: 740, s: 34, c: 'rgba(245,200,75,.4)' },
];

const CHIPS = [
  { x: 300, y: 212, c: GOLD, t: 'Generative AI', b: false },
  { x: 110, y: 452, c: PINK, t: 'Agentic AI', b: true },
  { x: 350, y: 602, c: VIOLET, t: 'Enterprise RAG', b: false },
  { x: 1350, y: 262, c: TEAL, t: 'Computer Vision', b: true },
  { x: 1590, y: 452, c: PINK, t: 'Conversational AI', b: false },
  { x: 1380, y: 642, c: GOLD, t: 'Predictive Analytics', b: true },
];

const CUBE_FACES = ['', 'rotateY(90deg) ', 'rotateY(180deg) ', 'rotateY(-90deg) ', 'rotateX(90deg) ', 'rotateX(-90deg) '];

export default function HeroFill() {
  return (
    <div className="hf" aria-hidden="true">
      <div className="hf-glows">
        <span className="hf-aur" style={{ left: px(-160), top: py(380), width: 760, height: 520, '--c': 'rgba(139,124,246,.35)' }} />
        <span className="hf-aur" style={{ left: px(1360), top: py(90), width: 760, height: 520, '--c': 'rgba(79,224,194,.28)', animationDelay: '-6s' }} />
        <span className="hf-aur" style={{ left: px(1240), top: py(600), width: 620, height: 420, '--c': 'rgba(232,111,168,.28)', animationDelay: '-3s' }} />
      </div>
      <div className="hf-dots" />
      <div className="hf-floor">
        <div className="hf-floor__grid" />
      </div>

      <svg className="hf-net" viewBox={`0 0 ${FW} ${FH}`} preserveAspectRatio="xMidYMid slice">
        {LINKS.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(79,224,194,.22)" strokeWidth="1" />
        ))}
        {NODES.map(([x, y, c, big], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={big ? 11.7 : 7.8} fill={c} opacity=".12" />
            <circle className={`hf-tw hf-tw--${i % 3}`} cx={x} cy={y} r={big ? 4.5 : 3} fill={c} />
          </g>
        ))}
        {PULSES.map(([d, c], i) => (
          <path key={i} className="hf-pulse" d={d} fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" style={{ animationDelay: `${-0.9 * i}s` }} />
        ))}
      </svg>

      <div className="hf-orbits">
        {ORBITS.map((o) => (
          <div key={o.size} className="hf-orbit" style={{ width: o.size, height: o.size, marginLeft: -o.size / 2, marginTop: -o.size / 2 }}>
            <div className={`hf-orbit__ring${o.rev ? ' hf-orbit__ring--rev' : ''}`} style={{ animationDuration: `${o.dur}s`, borderStyle: o.dashed ? 'dashed' : 'solid' }}>
              <span style={{ width: o.dotSize, height: o.dotSize, marginLeft: -o.dotSize / 2, top: -o.dotSize / 2, background: o.dot, boxShadow: `0 0 18px ${o.dot}` }} />
            </div>
          </div>
        ))}
      </div>

      {CUBES.map((cb) => (
        <div key={cb.x} className="hf-cube" style={{ left: px(cb.x), top: py(cb.y), width: cb.s, height: cb.s }}>
          <div className="hf-cube__body">
            {CUBE_FACES.map((f) => (
              <span key={f} style={{ borderColor: cb.c, transform: `${f}translateZ(${cb.s / 2}px)` }} />
            ))}
          </div>
        </div>
      ))}

      <div className="hf-chips">
        {CHIPS.map((ch) => (
          <span key={ch.t} className={`hf-chip${ch.b ? ' hf-chip--b' : ''}`} style={{ left: px(ch.x), top: py(ch.y) }}>
            <i style={{ background: ch.c, boxShadow: `0 0 10px ${ch.c}` }} />
            {ch.t}
          </span>
        ))}
      </div>
    </div>
  );
}

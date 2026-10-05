import { useEffect, useRef, useState } from 'react';
import './industry-scene.css';

/**
 * Animated scenes for the eight industries: SVG compositions on a 4:5 stage,
 * animated with CSS (transforms, opacity and dash offsets only, so they stay
 * on the compositor). A scene plays only while it is on screen and holds a
 * still frame under reduced motion. Decorative: the copy names the industry.
 */

const W = 480;
const H = 600;
const DUST = Array.from({ length: 16 }, (_, i) => ({
  x: 24 + ((i * 97) % 432),
  y: 40 + ((i * 151) % 520),
  r: 1.2 + (i % 3) * 0.8,
  d: (i * 0.7) % 6,
}));

function Stage({ id, accent, accent2, children }) {
  const ref = useRef(null);
  const [live, setLive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setLive(true);
      return undefined;
    }
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { rootMargin: '15% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const g = (n) => `url(#${id}-${n})`;
  return (
    <div ref={ref} className={`lf-scene lf-scene--${id}${live ? ' is-live' : ''}`} style={{ '--a': accent, '--b': accent2 }} aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          <radialGradient id={`${id}-bg`} cx="30%" cy="18%" r="90%">
            <stop offset="0" stopColor={accent} stopOpacity="0.22" />
            <stop offset="0.45" stopColor="#0d141d" />
            <stop offset="1" stopColor="#05080c" />
          </radialGradient>
          <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor={accent} stopOpacity="0.9" />
            <stop offset="1" stopColor={accent} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}-sweep`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.08" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={`${id}-vig`} cx="50%" cy="50%" r="72%">
            <stop offset="0.55" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.65" />
          </radialGradient>
          <pattern id={`${id}-grid`} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0v40" fill="none" stroke="#fff" strokeOpacity="0.05" />
          </pattern>
          <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        <rect width={W} height={H} fill={g('bg')} />
        <rect width={W} height={H} fill={g('grid')} />
        {children({ g, accent, accent2 })}
        <g className="sc-dust" fill="#fff">
          {DUST.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={p.r} style={{ '--d': `${p.d}s` }} />
          ))}
        </g>
        <rect className="sc-sweep" x="-240" width="240" height={H} fill={g('sweep')} />
        <rect width={W} height={H} fill={g('vig')} />
      </svg>
    </div>
  );
}

/* ---------- 1. Manufacturing: a robot arm over a running line ---------- */
function Manufacturing({ g, accent, accent2 }) {
  return (
    <>
      <rect x="300" y="86" width="130" height="78" rx="8" fill="#0b1119" stroke="#fff" strokeOpacity="0.1" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={314 + i * 28} y="100" width="16" height="6" rx="2" fill={i % 2 ? accent2 : accent} className="sc-blink" style={{ '--d': `${i * 0.45}s` }} />
      ))}
      {[0, 1, 2].map((i) => (
        <rect key={i} x="314" y={118 + i * 12} width={100 - i * 24} height="4" rx="2" fill="#fff" fillOpacity="0.12" />
      ))}
      <rect x="30" y="440" width="420" height="30" rx="8" fill="#141c27" stroke="#fff" strokeOpacity="0.12" />
      <line className="sc-belt" x1="40" y1="455" x2="440" y2="455" stroke={accent2} strokeOpacity="0.6" strokeWidth="2" strokeDasharray="18 16" />
      {[0, 1, 2].map((i) => (
        <g key={i} className="sc-box" style={{ '--d': `${-i * 3.2}s` }}>
          <rect x="-26" y="396" width="52" height="42" rx="4" fill="#1b2433" stroke={accent} strokeOpacity="0.8" />
          <path d="M-26 414h52M0 396v42" stroke={accent} strokeOpacity="0.45" />
        </g>
      ))}
      <g className="sc-pistons">
        {[70, 150, 330, 410].map((x, i) => (
          <rect key={x} x={x - 4} y="470" width="8" height="70" fill="#111821" stroke="#fff" strokeOpacity="0.08" />
        ))}
      </g>
      <rect x="236" y="372" width="90" height="70" rx="8" fill="#1a2330" stroke="#fff" strokeOpacity="0.14" />
      <circle cx="281" cy="380" r="12" fill="#0b1119" stroke={accent} strokeWidth="2" />
      <g className="sc-arm" style={{ transformOrigin: '281px 380px' }}>
        <rect x="272" y="222" width="18" height="160" rx="9" fill="#27313f" stroke="#fff" strokeOpacity="0.16" />
        <circle cx="281" cy="230" r="11" fill="#0b1119" stroke={accent} strokeWidth="2" />
        <g className="sc-forearm" style={{ transformOrigin: '281px 230px' }}>
          <rect x="150" y="222" width="132" height="16" rx="8" fill="#27313f" stroke="#fff" strokeOpacity="0.16" />
          <path d="M150 230l-18 22M150 230l-18-22" stroke={accent} strokeWidth="6" strokeLinecap="round" />
          <circle className="sc-weld" cx="128" cy="230" r="14" fill={g('glow')} />
          <circle className="sc-weld" cx="128" cy="230" r="3" fill="#fff" />
        </g>
      </g>
    </>
  );
}

/* ---------- 2. Telecom: a mast broadcasting to a city ---------- */
function Telecom({ accent, accent2 }) {
  const nodes = [
    [70, 420],
    [130, 500],
    [400, 470],
    [350, 540],
    [60, 300],
    [420, 330],
  ];
  return (
    <>
      <g fill="#0b1119" stroke="#fff" strokeOpacity="0.08">
        {[20, 90, 160, 330, 400].map((x, i) => (
          <rect key={x} x={x} y={430 + (i % 3) * 30} width="50" height="200" />
        ))}
      </g>
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} className="sc-ring" cx="240" cy="150" r="12" fill="none" stroke={accent} strokeWidth="2" style={{ '--d': `${i * 1.1}s` }} />
      ))}
      <path d="M240 140v400M228 160l-40 380M252 160l40 380M214 260h52M200 340h80M186 420h108M172 500h136" fill="none" stroke="#9aa6b5" strokeOpacity="0.55" strokeWidth="2" />
      <path d="M240 140l-12 20h24z" fill={accent} />
      <circle cx="240" cy="140" r="5" fill="#fff" className="sc-beacon" />
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <path className="sc-packet" d={`M240 150 L${x} ${y}`} fill="none" stroke={accent2} strokeWidth="2" strokeLinecap="round" strokeDasharray="14 600" style={{ '--d': `${i * 0.6}s` }} />
          <line x1="240" y1="150" x2={x} y2={y} stroke={accent} strokeOpacity="0.18" />
          <circle cx={x} cy={y} r="5" fill="#0b1119" stroke={accent2} strokeWidth="2" />
        </g>
      ))}
    </>
  );
}

/* ---------- 3. Banking: growth that draws itself ---------- */
function Banking({ accent, accent2 }) {
  const bars = [120, 170, 150, 230, 260, 320, 380];
  return (
    <>
      <g className="sc-dial" style={{ transformOrigin: '96px 110px' }} stroke={accent2} strokeOpacity="0.7" fill="none">
        <circle cx="96" cy="110" r="46" />
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const r1 = i % 6 ? 40 : 34;
          return <line key={i} x1={96 + Math.cos(a) * r1} y1={110 + Math.sin(a) * r1} x2={96 + Math.cos(a) * 46} y2={110 + Math.sin(a) * 46} />;
        })}
      </g>
      <circle cx="96" cy="110" r="10" fill={accent2} fillOpacity="0.9" />
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1="40" x2="440" y1={520 - i * 90} y2={520 - i * 90} stroke="#fff" strokeOpacity="0.07" />
      ))}
      {bars.map((h, i) => (
        <rect key={i} className="sc-bar" x={52 + i * 54} y={520 - h} width="34" height={h} rx="4" fill={accent} fillOpacity={0.18 + i * 0.07} style={{ transformOrigin: `${69 + i * 54}px 520px`, '--d': `${i * 0.12}s` }} />
      ))}
      <path className="sc-draw" d="M60 440 C120 420 150 400 200 380 S280 330 320 300 S400 220 436 190" fill="none" stroke={accent2} strokeWidth="3" strokeLinecap="round" pathLength="100" />
      <circle className="sc-pulse" cx="436" cy="190" r="6" fill={accent2} />
      <circle className="sc-pulse" cx="436" cy="190" r="16" fill="none" stroke={accent2} strokeOpacity="0.5" />
    </>
  );
}

/* ---------- 4. Insurance: a shield that forms against the rain ---------- */
function Insurance({ g, accent, accent2 }) {
  return (
    <>
      {Array.from({ length: 18 }, (_, i) => (
        <line key={i} className="sc-rain" x1={20 + i * 26} y1="-40" x2={12 + i * 26} y2="0" stroke={accent2} strokeOpacity="0.45" strokeWidth="1.5" strokeLinecap="round" style={{ '--d': `${(i * 0.37) % 2.2}s`, '--t': `${1.6 + (i % 3) * 0.3}s` }} />
      ))}
      <circle className="sc-halo" cx="240" cy="300" r="150" fill={g('glow')} opacity="0.35" />
      <path d="M240 150 L360 196 V300 C360 390 300 450 240 480 C180 450 120 390 120 300 V196 Z" fill="#0b1119" fillOpacity="0.75" stroke="#fff" strokeOpacity="0.08" />
      <path className="sc-draw sc-draw--slow" d="M240 150 L360 196 V300 C360 390 300 450 240 480 C180 450 120 390 120 300 V196 Z" fill="none" stroke={accent} strokeWidth="3" strokeLinejoin="round" pathLength="100" />
      <path className="sc-draw sc-draw--late" d="M190 304 L226 340 L296 262" fill="none" stroke={accent} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" pathLength="100" />
      <path d="M240 150 L360 196 V300 C360 390 300 450 240 480" fill="none" stroke={accent} strokeOpacity="0.18" strokeWidth="12" />
    </>
  );
}

/* ---------- 5. Fintech: a card and a stream of settled payments ---------- */
function Fintech({ accent, accent2 }) {
  return (
    <>
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i} className="sc-rise" style={{ '--d': `${i * 0.9}s`, '--x': `${40 + ((i * 131) % 330)}px` }}>
          <rect x="0" y="0" width="92" height="26" rx="13" fill="#0b1119" stroke={i % 2 ? accent2 : accent} strokeOpacity="0.7" />
          <path d="M14 13l6 6 12-12" fill="none" stroke={i % 2 ? accent2 : accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="40" y="10" width={30 + (i % 3) * 8} height="6" rx="3" fill="#fff" fillOpacity="0.25" />
        </g>
      ))}
      <g className="sc-card" style={{ transformOrigin: '240px 300px' }}>
        <rect x="120" y="225" width="240" height="150" rx="16" fill="#131b27" stroke="#fff" strokeOpacity="0.16" transform="rotate(-8 240 300)" />
        <rect x="120" y="225" width="240" height="150" rx="16" fill={accent} fillOpacity="0.14" transform="rotate(-8 240 300)" />
        <g transform="rotate(-8 240 300)">
          <rect x="146" y="262" width="40" height="30" rx="5" fill={accent2} fillOpacity="0.9" />
          <path d="M146 272h40M146 282h40M160 262v30" stroke="#0b1119" strokeOpacity="0.5" />
          <rect x="146" y="328" width="110" height="8" rx="4" fill="#fff" fillOpacity="0.5" />
          <rect x="146" y="344" width="70" height="8" rx="4" fill="#fff" fillOpacity="0.25" />
          <circle cx="318" cy="340" r="14" fill={accent} fillOpacity="0.8" />
          <circle cx="336" cy="340" r="14" fill={accent2} fillOpacity="0.8" />
          {[0, 1, 2].map((i) => (
            <path key={i} className="sc-tap" d={`M${300 + i * 9} 250 a${12 + i * 9} ${12 + i * 9} 0 0 1 0 ${24 + i * 18}`} fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="2.5" strokeLinecap="round" style={{ '--d': `${i * 0.25}s` }} />
          ))}
        </g>
      </g>
    </>
  );
}

/* ---------- 6. FMCG: products on the move, a scanner sweeping ---------- */
function Fmcg({ g, accent, accent2 }) {
  const products = (seed) =>
    Array.from({ length: 10 }, (_, i) => {
      const h = 46 + ((i * 37 + seed) % 40);
      const w = 30 + ((i * 23 + seed) % 22);
      return { x: i * 70, w, h, c: [accent, accent2, '#fff'][(i + seed) % 3] };
    });
  const Shelf = ({ y, seed, cls }) => (
    <>
      <rect x="0" y={y} width={W} height="6" fill="#1a2330" />
      <rect x="0" y={y + 6} width={W} height="2" fill="#000" fillOpacity="0.5" />
      <g className={cls}>
        {[0, 1].map((rep) => (
          <g key={rep} transform={`translate(${rep * 700} 0)`}>
            {products(seed).map((p, i) => (
              <g key={i}>
                <rect x={p.x} y={y - p.h} width={p.w} height={p.h} rx="5" fill="#0f1620" stroke={p.c} strokeOpacity="0.75" />
                <rect x={p.x + 6} y={y - p.h + 12} width={p.w - 12} height="10" rx="2" fill={p.c} fillOpacity="0.6" />
                <rect x={p.x + 6} y={y - 20} width={p.w - 12} height="4" rx="2" fill="#fff" fillOpacity="0.2" />
              </g>
            ))}
          </g>
        ))}
      </g>
    </>
  );
  return (
    <>
      <Shelf y={250} seed={1} cls="sc-shelf sc-shelf--l" />
      <Shelf y={400} seed={5} cls="sc-shelf sc-shelf--r" />
      <Shelf y={550} seed={9} cls="sc-shelf sc-shelf--l sc-shelf--slow" />
      <g className="sc-scan">
        <rect x="-20" y="0" width="40" height={H} fill={g('glow')} opacity="0.7" />
        <line x1="0" y1="0" x2="0" y2={H} stroke="#fff" strokeOpacity="0.9" strokeWidth="1.5" />
      </g>
      <g transform="translate(330 60)" fill="#fff" fillOpacity="0.8">
        {[0, 3, 5, 9, 12, 16, 18, 23, 26, 30, 33, 37, 40, 45, 48].map((x, i) => (
          <rect key={i} x={x * 2.2} y="0" width={i % 3 === 0 ? 3 : 1.5} height="34" />
        ))}
      </g>
    </>
  );
}

/* ---------- 7. Mining: a drill through glinting strata ---------- */
function Mining({ accent, accent2 }) {
  const strata = [
    ['M0 330 C80 310 140 350 240 332 S400 300 480 324 V600 H0Z', 0.1],
    ['M0 400 C90 380 150 420 240 404 S410 370 480 396 V600 H0Z', 0.16],
    ['M0 470 C100 450 160 490 240 474 S400 440 480 466 V600 H0Z', 0.24],
    ['M0 540 C100 520 180 560 260 544 S420 510 480 536 V600 H0Z', 0.34],
  ];
  const glints = [
    [70, 430],
    [160, 500],
    [330, 450],
    [410, 560],
    [120, 580],
    [300, 520],
    [60, 350],
    [420, 380],
  ];
  return (
    <>
      {strata.map(([d, o], i) => (
        <path key={i} d={d} fill={accent} fillOpacity={o} stroke="#fff" strokeOpacity="0.06" />
      ))}
      {glints.map(([x, y], i) => (
        <path key={i} className="sc-glint" d={`M${x} ${y - 7} l6 7 -6 7 -6 -7z`} fill={accent2} style={{ '--d': `${(i * 0.53) % 3}s` }} />
      ))}
      <rect x="150" y="40" width="180" height="26" rx="6" fill="#141c27" stroke="#fff" strokeOpacity="0.12" />
      <path d="M170 66v260M310 66v260" stroke="#9aa6b5" strokeOpacity="0.4" strokeWidth="3" />
      <g className="sc-drill">
        <rect x="228" y="60" width="24" height="270" rx="4" fill="#27313f" stroke="#fff" strokeOpacity="0.16" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} className="sc-thread" x="228" y={90 + i * 40} width="24" height="8" fill={accent} fillOpacity="0.55" style={{ '--d': `${-i * 0.1}s` }} />
        ))}
        <path d="M222 330h36l-18 40z" fill={accent2} />
        <circle className="sc-weld" cx="240" cy="372" r="22" fill={accent} fillOpacity="0.35" />
      </g>
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} className="sc-spark" cx={240 + (i - 2) * 14} cy="380" r="2.5" fill={accent2} style={{ '--d': `${i * 0.3}s`, '--sx': `${(i - 2) * 18}px` }} />
      ))}
    </>
  );
}

/* ---------- 8. Oil and gas: the pumpjack and the pipeline ---------- */
function OilGas({ g, accent, accent2 }) {
  return (
    <>
      <circle cx="120" cy="420" r="120" fill={g('glow')} opacity="0.35" />
      <rect x="0" y="430" width={W} height="170" fill="#0a0f16" />
      <line x1="0" y1="430" x2={W} y2="430" stroke={accent} strokeOpacity="0.35" />
      <path d="M190 430 L240 240 L290 430 Z" fill="none" stroke="#9aa6b5" strokeOpacity="0.6" strokeWidth="4" strokeLinejoin="round" />
      <path d="M212 350h56" stroke="#9aa6b5" strokeOpacity="0.5" strokeWidth="3" />
      <g className="sc-beam" style={{ transformOrigin: '240px 240px' }}>
        <rect x="110" y="232" width="260" height="16" rx="4" fill="#27313f" stroke="#fff" strokeOpacity="0.16" />
        <path d="M110 226 q-40 10 -36 50 l34 6 z" fill={accent} />
        <line x1="96" y1="282" x2="96" y2="400" stroke={accent} strokeOpacity="0.8" strokeWidth="2" />
        <circle cx="370" cy="240" r="8" fill="#0b1119" stroke={accent} strokeWidth="2" />
      </g>
      <circle cx="240" cy="240" r="9" fill="#0b1119" stroke={accent} strokeWidth="2" />
      <g className="sc-crank" style={{ transformOrigin: '350px 400px' }}>
        <circle cx="350" cy="400" r="30" fill="#141c27" stroke="#9aa6b5" strokeOpacity="0.6" strokeWidth="3" />
        <circle cx="350" cy="376" r="5" fill={accent} />
      </g>
      <rect x="330" y="300" width="40" height="130" fill="none" />
      <rect x="86" y="398" width="20" height="32" rx="3" fill="#141c27" stroke={accent} strokeOpacity="0.6" />
      <path className="sc-flow" d="M0 500 H120 a16 16 0 0 1 16 16 V540 a16 16 0 0 0 16 16 H480" fill="none" stroke="#1f2a38" strokeWidth="14" strokeLinecap="round" />
      <path className="sc-flow sc-flow--dash" d="M0 500 H120 a16 16 0 0 1 16 16 V540 a16 16 0 0 0 16 16 H480" fill="none" stroke={accent2} strokeOpacity="0.8" strokeWidth="4" strokeDasharray="10 22" />
      <rect x="426" y="300" width="12" height="130" fill="#141c27" stroke="#fff" strokeOpacity="0.12" />
      <g className="sc-flame" style={{ transformOrigin: '432px 300px' }}>
        <path d="M432 300 c-14 -22 -6 -40 0 -58 c6 18 14 36 0 58z" fill={accent} />
        <path d="M432 300 c-6 -12 -3 -22 0 -32 c3 10 6 20 0 32z" fill="#fff" fillOpacity="0.8" />
      </g>
      <circle cx="432" cy="270" r="40" fill={g('glow')} className="sc-flame-glow" />
    </>
  );
}

const SCENES = {
  manufacturing: { accent: '#ffb547', accent2: '#6fe3d3', art: Manufacturing },
  telecom: { accent: '#b4a2ff', accent2: '#6fe3d3', art: Telecom },
  banking: { accent: '#539fe5', accent2: '#ffb547', art: Banking },
  insurance: { accent: '#6fe3d3', accent2: '#539fe5', art: Insurance },
  fintech: { accent: '#ff6f91', accent2: '#b4a2ff', art: Fintech },
  fmcg: { accent: '#ffd27a', accent2: '#ff6f91', art: Fmcg },
  mining: { accent: '#ff9900', accent2: '#ffd27a', art: Mining },
  'oil-gas': { accent: '#ff6a3d', accent2: '#6fe3d3', art: OilGas },
};

export const hasScene = (id) => Boolean(SCENES[id]);

export default function IndustryScene({ id }) {
  const scene = SCENES[id];
  if (!scene) return null;
  const Art = scene.art;
  return (
    <Stage id={id} accent={scene.accent} accent2={scene.accent2}>
      {(ctx) => <Art {...ctx} />}
    </Stage>
  );
}

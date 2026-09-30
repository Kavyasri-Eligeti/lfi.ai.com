import AIEmblemMark from '../../components/brand/AIEmblemMark';

// Static (STATIC profile / loading / context-lost) rendering of the universe.
// Purely decorative. All information is in the page's HTML content.
const DOTS = [
  { x: 14, y: 22, r: 1.6, c: '#8a7dff' },
  { x: 80, y: 18, r: 1.2, c: '#5aa9ff' },
  { x: 88, y: 64, r: 2.1, c: '#ff9a3c' },
  { x: 22, y: 76, r: 1.3, c: '#45e0d0' },
  { x: 60, y: 86, r: 1.0, c: '#ffe066' },
  { x: 40, y: 12, r: 0.9, c: '#cfe0ff' },
];

export default function UniverseFallback({ className = '' }) {
  return (
    <div className={`lf-universe-fallback ${className}`} aria-hidden="true">
      <svg className="lf-universe-fallback__orbits" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {[18, 26, 34, 42].map((r) => (
          <ellipse key={r} cx="62" cy="50" rx={r * 1.25} ry={r * 0.42} fill="none" stroke="rgba(143,176,255,0.16)" strokeWidth="0.15" />
        ))}
        {DOTS.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.c} opacity="0.85" />
        ))}
      </svg>
      <div className="lf-universe-fallback__emblem">
        <AIEmblemMark size={420} />
      </div>
    </div>
  );
}

import { demoMarkFor } from '../../content/demoMarks';
import './demo-mark.css';

/**
 * A demo's logo on a card: its product logo when it has one, otherwise a line
 * glyph on a small accent tile. Decorative: the card title names the demo.
 */
export default function DemoMark({ demo, size = 40, className = '' }) {
  if (demo.image) {
    return (
      <span className={`lf-demo-logo ${className}`} style={{ '--s': `${size}px` }} aria-hidden="true">
        <img className="lf-demo-card__logo" src={demo.image} alt="" width="96" height="32" loading="lazy" decoding="async" />
      </span>
    );
  }
  const mark = demoMarkFor(demo);
  if (!mark) return null;
  return (
    <span
      className={`lf-demo-mark lf-demo-mark--${mark.glyph} ${className}`}
      style={{ '--accent': mark.accent, '--s': `${size}px` }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        width={Math.round(size * 0.55)}
        height={Math.round(size * 0.55)}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
      >
        <path d={mark.path} />
      </svg>
    </span>
  );
}

import './element-mark.css';

/**
 * An AI solution's element mark, styled like a tile from a periodic table of
 * AI: its index, a two-letter symbol and an accent light that sweeps the edge.
 */
export default function ElementMark({ code, index, accent, size = 64, className = '' }) {
  return (
    <span className={`lf-element ${className}`} style={{ '--accent': accent, '--s': `${size}px` }} aria-hidden="true">
      <span className="lf-element__num">{String(index).padStart(2, '0')}</span>
      <span className="lf-element__sym">{code}</span>
    </span>
  );
}

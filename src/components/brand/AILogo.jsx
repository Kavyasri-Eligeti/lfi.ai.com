import './ai-logo.css';

/**
 * The Linkfields AI mark: an "AI" inside an iridescent glass ring, the 2D
 * twin of the ring in the homepage intro. The light on the ring slowly turns.
 * The Linkfields logo itself is never altered; this mark sits beside it.
 *
 * size   rendered size in px
 * intro  plays the entrance (the ring draws in, the letters resolve)
 * label  accessible name; omit to make the mark decorative
 */
export default function AILogo({ size = 120, intro = false, label, className = '' }) {
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true };
  return (
    <span className={`lf-ailogo${intro ? ' lf-ailogo--intro' : ''} ${className}`} style={{ '--s': `${size}px` }} {...a11y}>
      <span className="lf-ailogo__ring" />
      <span className="lf-ailogo__mark">AI</span>
    </span>
  );
}

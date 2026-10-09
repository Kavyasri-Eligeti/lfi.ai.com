// Small animated marks for the six company values. Decorative: the value's
// name is the heading beside it. Animation lives in company.css (.lf-vmk-*).
const MARKS = {
  // A bulb whose rays pulse.
  Innovation: (
    <>
      <path className="lf-vmk-line" d="M18 30h12M19 34h10M17 25c-3-2.6-4.6-6-4.4-9.6C13 9.6 18 5 24 5s11 4.6 11.4 10.4c.2 3.6-1.4 7-4.4 9.6-1.2 1-2 2.4-2 4v1H19v-1c0-1.6-.8-3-2-4Z" />
      <g className="lf-vmk-rays">
        <path className="lf-vmk-line" d="M24 0v-3M40 15h3M5 15H2M36 4l2-2M12 4l-2-2" />
      </g>
      <circle className="lf-vmk-fill lf-vmk-pulse" cx="24" cy="16" r="3.4" />
    </>
  ),
  // A rocket lifting off.
  Courage: (
    <g className="lf-vmk-bob">
      <path className="lf-vmk-line" d="M24 4c6 5 8.5 12 8 22l-4 6h-8l-4-6c-.5-10 2-17 8-22Z" />
      <circle className="lf-vmk-fill" cx="24" cy="16" r="3" />
      <path className="lf-vmk-line" d="M16 24l-5 6v4l6-3M32 24l5 6v4l-6-3" />
      <path className="lf-vmk-fill lf-vmk-flicker" d="M21 34h6l-3 9Z" />
    </g>
  ),
  // A heart that beats.
  Respect: (
    <path className="lf-vmk-line lf-vmk-beat" d="M24 40S7 29.5 7 17.5C7 11.7 11.3 8 16 8c3.6 0 6.4 2 8 5 1.6-3 4.4-5 8-5 4.7 0 9 3.7 9 9.5C41 29.5 24 40 24 40Z" />
  ),
  // Rings spreading from a point.
  Impact: (
    <>
      <circle className="lf-vmk-line lf-vmk-ripple" cx="24" cy="24" r="8" />
      <circle className="lf-vmk-line lf-vmk-ripple lf-vmk-ripple--2" cx="24" cy="24" r="8" />
      <circle className="lf-vmk-fill" cx="24" cy="24" r="4.5" />
    </>
  ),
  // A flame that flickers.
  Passion: (
    <g className="lf-vmk-sway">
      <path className="lf-vmk-line" d="M24 43c-8 0-13-5.5-13-12.5 0-6 4-9.5 6.5-14 .8 3 2.4 5 4.5 6 0-7 3.5-13 8-17.5.5 6 4 9.5 6.5 13.5 1.6 2.6 2.5 5.5 2.5 9 0 9-6 15.5-15 15.5Z" />
      <path className="lf-vmk-fill lf-vmk-flicker" d="M24 40c-3.6 0-6-2.4-6-5.6 0-3.4 3-5.4 4.4-8.4 1.2 2.4 3 3.2 4.4 5 1 1.2 1.6 2.4 1.6 3.6 0 3-1.8 5.4-4.4 5.4Z" />
    </g>
  ),
  // A shield whose tick draws itself.
  Ownership: (
    <>
      <path className="lf-vmk-line" d="M24 4l16 6v12c0 10-7 17-16 21-9-4-16-11-16-21V10Z" />
      <path className="lf-vmk-line lf-vmk-draw" pathLength="1" d="M16.5 23.5l5.5 5.5 10-11" />
    </>
  ),
};

export default function ValueMark({ name }) {
  const mark = MARKS[name];
  if (!mark) return <span className="lf-value__module" aria-hidden="true" />;
  return (
    <span className="lf-value__mark" aria-hidden="true">
      <svg viewBox="-2 -5 52 52" width="30" height="30" focusable="false">{mark}</svg>
    </span>
  );
}

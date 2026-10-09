// Small stroke icons used by the Mercury-style panels.
const icon = (paths) => (props) => (
  <svg viewBox="0 0 16 16" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>
    {paths}
  </svg>
);
export const IconArrowUpRight = icon(<path d="M5 11 11 5M6 5h5v5" />);
export const IconCheck = icon(<path d="m3.5 8.5 3 3 6-7" />);
export const IconSparkle = icon(<path d="M8 2v3M8 11v3M2 8h3M11 8h3M4 4l1.8 1.8M10.2 10.2 12 12M12 4l-1.8 1.8M5.8 10.2 4 12" />);

// Small monochrome glyphs for the official social profiles. They inherit
// currentColor and are decorative: the link carries the accessible name.
const PATHS = {
  linkedin:
    'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.83v1.5h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1v6.46h-4v-5.73c0-1.37-.03-3.13-1.9-3.13-1.91 0-2.2 1.49-2.2 3.03v5.83h-4v-11Z',
  x: 'M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78L17.75 3Zm-1.08 16.17h1.7L7.42 4.74H5.6l11.07 14.43Z',
  youtube:
    'M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31.3 31.3 0 0 0 .5 12a31.3 31.3 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.4-1.6.5-3.2.5-4.8s-.1-3.2-.5-4.8ZM9.75 15.02V8.98L15.5 12l-5.75 3.02Z',
  goodfirms:
    'M12 2.5 14.6 8l6 .7-4.45 4.1 1.2 5.95L12 15.8l-5.35 2.95 1.2-5.95L3.4 8.7l6-.7L12 2.5Z',
};

export default function SocialIcon({ id, size = 20 }) {
  const d = PATHS[id];
  if (!d) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d={d} />
    </svg>
  );
}

import { useId } from 'react';

/**
 * Static SVG version of the "Linkfields Core" AI emblem.
 * Used as the small decorative variant and as the no-WebGL fallback.
 * This is NOT the Linkfields company logo (see LinkfieldsLogo).
 */
export default function AIEmblemMark({ size = 240, animated = false, className, title }) {
  const id = useId().replace(/:/g, '');
  const labelled = Boolean(title);
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="-120 -120 240 240"
      role={labelled ? 'img' : undefined}
      aria-hidden={labelled ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <defs>
        <radialGradient id={`core-${id}`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="scale(34)">
          <stop offset="0" stopColor="#fff6cf" />
          <stop offset="0.45" stopColor="#ffd600" />
          <stop offset="0.8" stopColor="#ff7800" />
          <stop offset="1" stopColor="#ff5a00" stopOpacity="0.9" />
        </radialGradient>
        <radialGradient id={`halo-${id}`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="scale(118)">
          <stop offset="0" stopColor="#ff9a2e" stopOpacity="0.55" />
          <stop offset="0.35" stopColor="#3a64d8" stopOpacity="0.18" />
          <stop offset="1" stopColor="#3a64d8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`shell-${id}`} x1="-60" y1="-60" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#9db8ff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#2d58c0" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <circle r="118" fill={`url(#halo-${id})`} />
      <g className={animated ? 'lf-emblem-spin' : undefined}>
        <ellipse rx="92" ry="30" fill="none" stroke="#4f7dff" strokeWidth="1.6" transform="rotate(-28)" opacity="0.9" />
        <ellipse rx="78" ry="36" fill="none" stroke="#ff7800" strokeWidth="1.6" transform="rotate(38)" opacity="0.95" />
        <ellipse rx="64" ry="22" fill="none" stroke="#ffd600" strokeWidth="1.6" transform="rotate(84)" />
        {[
          [80, -43], [-62, 50], [52, 58], [-58, -44], [8, -63], [-12, 62],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3.4" fill={i % 2 ? '#fff2b0' : '#bcd0ff'} />
        ))}
      </g>
      <polygon
        points="0,-46 40,-23 40,23 0,46 -40,23 -40,-23"
        fill={`url(#shell-${id})`}
        stroke="#ffd600"
        strokeOpacity="0.55"
        strokeWidth="1.2"
      />
      <path d="M-40,-23 L0,0 L40,-23 M0,0 L0,46" fill="none" stroke="#ffd600" strokeOpacity="0.35" strokeWidth="1" />
      <circle r="26" fill={`url(#core-${id})`} />
      <circle r="10" fill="#fffbe6" opacity="0.85" />
    </svg>
  );
}

import React from "react";

/**
 * A small purpose-drawn icon set.
 *
 * Drawn on one 24-unit grid with a single stroke weight so the set reads as
 * one family, and built from the same geometry as the logo mark - square
 * blocks, a four-point sparkle - rather than pulled from a generic pack.
 */

const paths = {
  // AI & ML idea to product: the mark's sparkle emerging from a block
  spark: (
    <>
      <rect x="3" y="3" width="8.5" height="8.5" rx="2" />
      <path d="M17 3.4c.6 3.4 1.4 4.2 4.8 4.8-3.4.6-4.2 1.4-4.8 4.8-.6-3.4-1.4-4.2-4.8-4.8 3.4-.6 4.2-1.4 4.8-4.8Z" />
      <path d="M4 15.5v3A2.5 2.5 0 0 0 6.5 21h12" />
    </>
  ),
  // Platform services: stacked layers
  stack: (
    <>
      <path d="M12 3 21 7.6l-9 4.6-9-4.6L12 3Z" />
      <path d="m3 12.2 9 4.6 9-4.6" />
      <path d="m3 16.6 9 4.6 9-4.6" />
    </>
  ),
  // Explainable AI: a lens over a decision path
  lens: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m20.5 20.5-4.6-4.6" />
      <path d="M7.8 11.4l1.9 2 3.1-3.9" />
    </>
  ),
  // Document analytics
  doc: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5" />
      <path d="M9 13.5h2.5M9 17h6M14.5 13.5H15" />
    </>
  ),
  // Enterprise search
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-3.6-3.6" />
      <path d="M8.4 11h5.2M11 8.4v5.2" />
    </>
  ),
  // Conversational platforms
  chat: (
    <>
      <path d="M20 14.5a2.5 2.5 0 0 1-2.5 2.5H9l-4 3.2V6.5A2.5 2.5 0 0 1 7.5 4h10A2.5 2.5 0 0 1 20 6.5v8Z" />
      <path d="M9 9h7M9 12.3h4.5" />
    </>
  ),
  // Integration: two systems joined by one link
  link: (
    <>
      <path d="M10.2 13.8a3.6 3.6 0 0 0 5.1 0l3.1-3.1a3.6 3.6 0 0 0-5.1-5.1l-1.4 1.4" />
      <path d="M13.8 10.2a3.6 3.6 0 0 0-5.1 0l-3.1 3.1a3.6 3.6 0 0 0 5.1 5.1l1.4-1.4" />
    </>
  ),
  // Automation: a repeating cycle
  cycle: (
    <>
      <path d="M20.2 11.4a8.2 8.2 0 1 0-.9 5" />
      <path d="M20.6 5.4v5.4h-5.4" />
    </>
  ),
  // Industry / sector
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
    </>
  ),
  // External destination
  external: (
    <>
      <path d="M13.5 4.5H19.5V10.5" />
      <path d="M19.5 4.5 11 13" />
      <path d="M19 14.8v3.7A2.5 2.5 0 0 1 16.5 21h-9A2.5 2.5 0 0 1 5 18.5v-9A2.5 2.5 0 0 1 7.5 7h3.8" />
    </>
  ),
  // Restricted / internal network
  lock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.4" />
      <path d="M8.2 10.5V7.8a3.8 3.8 0 0 1 7.6 0v2.7" />
    </>
  ),
  check: <path d="m5 12.5 4.2 4.3L19 7" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.4" />
      <path d="m3.8 6.5 8.2 6 8.2-6" />
    </>
  ),
  phone: (
    <path d="M8.2 3.8 10 7.6l-2 1.8a12 12 0 0 0 5.6 5.6l1.8-2 3.8 1.8v3.4a1.8 1.8 0 0 1-2 1.8A16.6 16.6 0 0 1 3 5.8a1.8 1.8 0 0 1 1.8-2h3.4Z" />
  ),
  pin: (
    <>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
};

export default function Icon({ name, size = 22, className = "", ...rest }) {
  const d = paths[name];
  if (!d) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {d}
    </svg>
  );
}

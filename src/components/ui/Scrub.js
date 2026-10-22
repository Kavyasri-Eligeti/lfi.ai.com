import React from "react";
import useScrollScrub from "./useScrollScrub";

/**
 * Wraps children in an element carrying `--lfi-scrub` (0..1) as it crosses
 * the viewport. Pair it with a CSS rule that reads the property - see
 * `styles/scrub.css` for the shared ones.
 */
export default function Scrub({
  as: Tag = "div",
  className,
  children,
  ...rest
}) {
  const ref = useScrollScrub();
  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}

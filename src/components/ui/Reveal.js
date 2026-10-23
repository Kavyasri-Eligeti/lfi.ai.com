import React from "react";
import useReveal from "./useReveal";

/**
 * Wraps children in a scroll-revealed element.
 *
 * `delay` staggers a group (cards in a grid, steps in a timeline). Keep it
 * small - a stagger that runs past ~300ms reads as the page being slow rather
 * than as motion design.
 */
export default function Reveal({
  as: Tag = "div",
  from,
  delay = 0,
  className,
  style,
  children,
  ...rest
}) {
  const ref = useReveal();
  // Merged rather than spread over: a caller's `style` must not drop the delay.
  const merged = delay ? { ...style, "--lfi-reveal-delay": `${delay}ms` } : style;

  return (
    <Tag
      ref={ref}
      data-reveal=""
      data-reveal-from={from}
      className={className}
      style={merged}
      {...rest}
    >
      {children}
    </Tag>
  );
}

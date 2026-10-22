import React from "react";
import { Link } from "react-router-dom";
import "./Logo.css";

/**
 * The official logo lockup.
 *
 * The SVGs in /assets/brand are extracted directly from the supplied
 * linkfields-innovation-ai-logo sheet - same paths, same gradients, same
 * proportions - so the mark is never redrawn in markup or substituted with
 * text. `variant` picks the light-text lockup for dark surfaces and the
 * dark-text lockup for light ones.
 *
 * Clear space follows the sheet's rule (the height of the orange block) and is
 * applied as padding in Logo.css rather than baked into the artwork.
 */
export default function Logo({
  variant = "dark",
  mark = false,
  height = 40,
  to = "/",
  className = "",
  ...rest
}) {
  const src = mark
    ? "/assets/brand/lfi-mark.svg"
    : variant === "light"
    ? "/assets/brand/lfi-logo-light.svg"
    : "/assets/brand/lfi-logo-dark.svg";

  const img = (
    <img
      src={src}
      alt="Linkfields AI"
      className="lfi-logo__img"
      style={{ height }}
      width={mark ? height : height * 4.78}
      height={height}
      decoding="async"
    />
  );

  if (!to) {
    return (
      <span className={`lfi-logo ${className}`} {...rest}>
        {img}
      </span>
    );
  }

  return (
    <Link
      to={to}
      className={`lfi-logo ${className}`}
      aria-label="Linkfields AI - home"
      {...rest}
    >
      {img}
    </Link>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import "./Button.css";

/**
 * One button, three renderings - <button>, <Link> and <a> - so that a control
 * that navigates is always a link and a control that acts is always a button.
 *
 * `to`   -> in-app route (react-router Link)
 * `href` -> external or same-page anchor (<a>; external gets rel/target)
 */
export default function Button({
  variant = "primary",
  size,
  to,
  href,
  external,
  className = "",
  children,
  iconRight = true,
  ...rest
}) {
  const classes = [
    "lfi-btn",
    `lfi-btn--${variant}`,
    size ? `lfi-btn--${size}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      <span className="lfi-btn__label">{children}</span>
      {iconRight && variant !== "ghost" ? (
        <svg
          className="lfi-btn__arrow"
          width="15"
          height="15"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {inner}
      </Link>
    );
  }

  if (href) {
    const isExternal =
      external ?? (href.startsWith("http") || href.startsWith("mailto:"));
    return (
      <a
        href={href}
        className={classes}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : null)}
        {...rest}
      >
        {inner}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {inner}
    </button>
  );
}

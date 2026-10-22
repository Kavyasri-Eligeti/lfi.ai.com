import React, { useEffect, useRef, useState } from "react";

/**
 * Counts up to a value when it scrolls into view.
 *
 * Only ever pointed at numbers the site can substantiate - the count of live
 * demonstrations, the founding year, the number of industries served. It
 * animates a real figure into view; it does not invent one.
 *
 * `from` exists because counting a year up from zero looks like a fabricated
 * metric rather than a date, so the year starts near its own value and settles.
 */
export default function CountUp({
  to,
  from = 0,
  duration = 1400,
  className = "",
}) {
  const ref = useRef(null);
  const [value, setValue] = useState(from);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // No observer or reduced motion: show the final number immediately.
    if (reduce || typeof IntersectionObserver === "undefined") {
      setValue(to);
      return undefined;
    }

    let raf = 0;
    const run = () => {
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        // easeOutExpo - fast, then settles, which reads as a counter landing.
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        setValue(Math.round(from + (to - from) * eased));
        if (t < 1) raf = window.requestAnimationFrame(tick);
      };
      raf = window.requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting || started.current) return;
          started.current = true;
          io.unobserve(e.target);
          run();
        });
      },
      { threshold: 0.4 }
    );
    io.observe(node);

    return () => {
      io.disconnect();
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [to, from, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}

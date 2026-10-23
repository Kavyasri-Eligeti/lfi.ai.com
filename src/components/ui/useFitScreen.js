import { useLayoutEffect } from "react";

/**
 * Fit a section to one screen.
 *
 * Picks the roomiest density level at which every column of the section fits
 * the space under the navbar, and writes it to the section as `data-fit`:
 *
 *   "0", "1", ...  the levels, roomiest first (styled by the section's CSS,
 *                  which caps the section at 100svh minus --lfi-nav-h)
 *   "natural"      no level fits, or the screen is too narrow for the
 *                  two-column layout - the section takes its natural height.
 *                  Nothing is ever clipped.
 *
 * Columns are measured by offsetHeight, which ignores the reveal animations'
 * transforms. Re-fitted on resize, on the columns' own size changes (line
 * reveals, validation messages, <details> opening), when web fonts land, and
 * when the section comes into view.
 *
 * Every observer callback defers the fit to the next frame: changing a
 * section's layout inside a ResizeObserver callback is what produces the
 * browser's "ResizeObserver loop completed with undelivered notifications".
 */
export default function useFitScreen(
  ref,
  { columns, levels = ["0", "1"], minWidth = 900 }
) {
  useLayoutEffect(() => {
    const sec = ref.current;
    if (!sec) return undefined;
    const cols = [...sec.querySelectorAll(columns)];
    const wide = window.matchMedia(`(min-width: ${minWidth}px)`);

    const fits = () => {
      const cs = window.getComputedStyle(sec);
      const room =
        sec.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      return cols.every((c) => c.offsetHeight <= room + 1);
    };
    const fit = () => {
      if (!wide.matches) {
        sec.dataset.fit = "natural";
        return;
      }
      for (const level of levels) {
        sec.dataset.fit = level;
        if (fits()) return;
      }
      sec.dataset.fit = "natural";
    };

    fit();
    let raf = 0;
    const refit = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(fit);
    };
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(refit) : null;
    if (ro) cols.forEach((c) => ro.observe(c));
    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver((es) => es.some((e) => e.isIntersecting) && refit())
        : null;
    if (io) io.observe(sec);
    const fonts = document.fonts;
    if (fonts && fonts.addEventListener) fonts.addEventListener("loadingdone", refit);
    sec.addEventListener("toggle", refit, true);
    window.addEventListener("resize", refit);
    return () => {
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      if (io) io.disconnect();
      if (fonts && fonts.removeEventListener) fonts.removeEventListener("loadingdone", refit);
      sec.removeEventListener("toggle", refit, true);
      window.removeEventListener("resize", refit);
    };
    // `levels` is a literal at every call site; joining keeps the dependency stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, columns, minWidth, levels.join("|")]);
}

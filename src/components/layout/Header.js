import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import Logo from "../ui/Logo";
import Button from "../ui/Button";
import { NAV_LINKS } from "../../data/nav";
import { gsap, EASE, prefersReducedMotion } from "../../motion";
import { setScrollLocked } from "../../motion/SmoothScroll";
import "./Header.css";

/**
 * Sticky site header.
 *
 * Over the hero it is transparent so the headline reads as the first thing on
 * the page; past it, it becomes a translucent bar with a hairline. The mobile
 * drawer traps focus, closes on Escape, on route change and on backdrop click,
 * and locks body scroll while open.
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const location = useLocation();
  const panelRef = useRef(null);
  const toggleRef = useRef(null);
  const navRef = useRef(null);
  const headerRef = useRef(null);

  const onHome = location.pathname === "/";

  /* --- publish the bar's real height ----------------------------------
     Measured, not assumed: the rendered height (border included) goes on
     <html> as --lfi-nav-h, and anything that must fit the space below the
     bar - the full-screen portfolio carousel - sizes itself from that. A
     ResizeObserver keeps it right through breakpoint changes. */
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return undefined;
    const root = document.documentElement;
    const publish = () =>
      root.style.setProperty("--lfi-nav-h", `${el.offsetHeight}px`);
    publish();
    if (typeof ResizeObserver === "undefined") return undefined;
    // Written on the next frame, not inside the observer callback: the new
    // value resizes the portfolio carousel, which has an observer of its own,
    // and resizing an observed element from within an RO callback is the
    // browser's "ResizeObserver loop completed with undelivered notifications".
    let raf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(publish);
    });
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  /* --- shrink / solidify on scroll ------------------------------------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* --- which section am I in (homepage only) ---------------------------- */
  useEffect(() => {
    if (!onHome || typeof IntersectionObserver === "undefined") {
      setActiveId("");
      return undefined;
    }
    const ids = NAV_LINKS.filter((l) => l.hash).map((l) => l.hash.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)
      // Sorted by position in the page, not by position in the nav, so the
      // tie-break below is honest even if the two ever diverge.
      .sort((a, b) =>
        a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
      );
    if (!sections.length) return undefined;

    /* The observer only reports sections whose state CHANGED, so picking the
       winner out of `entries` alone is wrong twice over: a section that is
       still in the band but did not move is absent from the batch, and when
       the last one leaves the band the batch contains only departures. The
       second case is what left the nav underlining "Products" in the footer -
       nothing was intersecting, so nothing was ever set, so the last value
       stood forever.
       Keeping our own set of what is currently in the band fixes both: the
       answer is computed from everything in it, and an empty set clears the
       indicator rather than freezing it. */
    const inBand = new Set();

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) inBand.add(e.target);
          else inBand.delete(e.target);
        });

        if (!inBand.size) {
          setActiveId("");
          return;
        }

        // Document order, so overlapping sections resolve to the one being
        // read rather than to whichever reported last.
        const winner = sections.find((s) => inBand.has(s));
        if (winner) setActiveId(winner.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [onHome, location.pathname]);

  /* --- close the drawer on navigation ----------------------------------- */
  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  /* --- the header's entrance -------------------------------------------
     The first beat of the page's arrival sequence. It runs at delay 0 and the
     hero's timeline starts at 0.2, so the logo and navigation are settled
     before the headline begins to rise. Two components, one sequence.

     Nothing is hidden by CSS here: this is a `from` tween, so if it never
     runs the header is simply already in place. The header is the one piece
     of the page that must never depend on an animation to be usable. */
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: EASE.out } })
        .from(".lfi-header__inner > *", {
          y: -14,
          opacity: 0,
          duration: 0.7,
          stagger: 0.08,
        });
    });
    return () => ctx.revert();
  }, []);

  /* --- drawer: scroll lock, Escape, focus trap -------------------------- */
  useEffect(() => {
    if (!open) return undefined;

    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    // `overflow: hidden` on <body> does not stop Lenis - it drives scroll
    // itself and would happily keep moving the page behind the drawer.
    setScrollLocked(true);

    const panel = panelRef.current;
    const focusables = () =>
      panel
        ? Array.from(
            panel.querySelectorAll(
              'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
          )
        : [];

    focusables()[0]?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = prevOverflow;
      setScrollLocked(false);
    };
  }, [open]);

  /**
   * Sliding active indicator.
   *
   * Measures the active link and writes its x/width onto the nav, so a single
   * underline element glides between items instead of each link fading its
   * own. Re-measured on resize and whenever the active section changes.
   */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return undefined;

    const place = () => {
      const active = nav.querySelector(".lfi-nav__link.is-active");
      if (!active) {
        nav.style.setProperty("--lfi-ind-o", "0");
        return;
      }
      const nr = nav.getBoundingClientRect();
      const ar = active.getBoundingClientRect();
      nav.style.setProperty("--lfi-ind-x", `${ar.left - nr.left}px`);
      nav.style.setProperty("--lfi-ind-w", `${ar.width}px`);
      nav.style.setProperty("--lfi-ind-o", "1");
    };

    const raf = window.requestAnimationFrame(place);
    window.addEventListener("resize", place);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", place);
    };
  }, [activeId, location.pathname]);

  const closeDrawer = useCallback(() => setOpen(false), []);

  const renderLink = (link, inDrawer, index = 0) => {
    const isActive = link.hash
      ? onHome && activeId === link.hash.slice(1)
      : location.pathname === link.to;

    const className = [
      inDrawer ? "lfi-drawer__link" : "lfi-nav__link",
      isActive ? "is-active" : "",
    ]
      .filter(Boolean)
      .join(" ");

    // Same-page anchors stay plain <a> so the browser handles the jump and the
    // URL keeps a copyable fragment; cross-page anchors go through the router.
    if (link.hash && onHome) {
      return (
        <a
          key={link.label}
          href={link.hash}
          className={className}
          aria-current={isActive ? "true" : undefined}
          onClick={inDrawer ? closeDrawer : undefined}
          style={inDrawer ? { "--lfi-i": index } : undefined}
        >
          {link.label}
        </a>
      );
    }

    return (
      <Link
        key={link.label}
        to={link.hash ? `/${link.hash}` : link.to}
        className={className}
        aria-current={isActive ? "page" : undefined}
        onClick={inDrawer ? closeDrawer : undefined}
        style={inDrawer ? { "--lfi-i": index } : undefined}
      >
        {link.label}
      </Link>
    );
  };

  const drawer =
    typeof document === "undefined"
      ? null
      : createPortal(
          <>
            <div
              className="lfi-drawer__backdrop"
              hidden={!open}
              onClick={closeDrawer}
            />
            <div
              id="lfi-drawer"
              ref={panelRef}
              className="lfi-drawer"
              hidden={!open}
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
            >
              <nav className="lfi-drawer__nav" aria-label="Mobile">
                {NAV_LINKS.map((l, i) => renderLink(l, true, i))}
              </nav>
              <div className="lfi-drawer__foot">
                <Button
                  href={onHome ? "#contact" : undefined}
                  to={onHome ? undefined : "/#contact"}
                  variant="primary"
                  onClick={closeDrawer}
                >
                  Let&rsquo;s talk
                </Button>
              </div>
            </div>
          </>,
          document.body
        );

  return (
    <header
      ref={headerRef}
      className={`lfi-header ${scrolled ? "is-scrolled" : ""} ${
        open ? "is-open" : ""
      }`}
    >
      <div className="lfi-header__inner lfi-container">
        <Logo height={38} />

        <nav className="lfi-nav" aria-label="Primary" ref={navRef}>
          {NAV_LINKS.map((l) => renderLink(l, false))}
          <span className="lfi-nav__indicator" aria-hidden="true" />
        </nav>

        <div className="lfi-header__actions">
          <Button
            href={onHome ? "#contact" : undefined}
            to={onHome ? undefined : "/#contact"}
            variant="primary"
            size="sm"
            className="lfi-header__cta"
          >
            Let&rsquo;s talk
          </Button>

          <button
            ref={toggleRef}
            type="button"
            className="lfi-burger"
            aria-expanded={open}
            aria-controls="lfi-drawer"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="lfi-burger__bar" />
            <span className="lfi-burger__bar" />
          </button>
        </div>
      </div>

      {/* The drawer is portalled to <body> on purpose. The header sets
          backdrop-filter when it is scrolled or open, and an ancestor with a
          filter becomes the containing block for position:fixed descendants -
          which collapsed the full-height backdrop to the header's own height.
          Outside the header, both are positioned against the viewport. */}
      {drawer}
    </header>
  );
}

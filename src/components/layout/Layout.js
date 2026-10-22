import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import ScrollProgress from "./ScrollProgress";
import Ambient from "./Ambient";
import SmoothScroll from "../../motion/SmoothScroll";

/**
 * Shell for the marketing site.
 *
 * `.lfi-site` scopes the whole design system, so the legacy demo pages (which
 * bring their own Bootstrap-based styling) are completely unaffected by it.
 *
 * SmoothScroll is mounted HERE rather than in App, and that is the point: the
 * legacy analytics pages do not use this layout, so they keep the browser's
 * native scrolling untouched. Smooth scroll is a marketing-site decision, not
 * a site-wide one.
 */
export default function Layout({ children }) {
  return (
    <div className="lfi-site">
      <a className="lfi-skip" href="#main">
        Skip to content
      </a>
      <SmoothScroll />
      {/* The page's lighting. Mounted first so it paints behind everything,
          and kept out of <main> so it is not announced as content. */}
      <Ambient />
      <ScrollProgress />
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </div>
  );
}

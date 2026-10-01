import { useEffect, useRef } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { m } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import { EASE } from '../../features/motion/tokens';

// Scrolls to #hash targets after client-side navigation (e.g. /solutions#sap).
function HashScroller() {
  const { hash, pathname } = useLocation();
  useEffect(() => {
    if (!hash) return undefined;
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    let timer = 0;
    const attempt = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ block: 'start' });
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
        el.focus({ preventScroll: true });
      } else if (tries++ < 20) {
        timer = window.setTimeout(attempt, 50);
      }
    };
    attempt();
    return () => window.clearTimeout(timer);
  }, [hash, pathname]);
  return null;
}

// After a client-side page change, move focus to the main region so screen
// reader and keyboard users start at the new page's content.
function useRouteFocus(pathname, hash) {
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!hash) document.getElementById('main')?.focus({ preventScroll: true });
  }, [pathname, hash]);
}

export default function RootLayout() {
  const { pathname, hash } = useLocation();
  const firstRender = useRef(true);
  useEffect(() => {
    firstRender.current = false;
  }, []);
  useRouteFocus(pathname, hash);

  return (
    <>
      <a className="lf-skip-link" href="#main">Skip to main content</a>
      <Header />
      <main id="main" tabIndex={-1}>
        {/* Enter-only page transition: navigation is never delayed by an exit animation. */}
        <m.div
          key={pathname}
          initial={firstRender.current ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: EASE.out }}
        >
          <Outlet />
        </m.div>
      </main>
      <Footer />
      <ScrollRestoration />
      <HashScroller />
    </>
  );
}

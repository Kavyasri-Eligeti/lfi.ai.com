import { useEffect } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

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

export default function RootLayout() {
  return (
    <>
      <a className="lf-skip-link" href="#main">Skip to main content</a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
      <HashScroller />
    </>
  );
}

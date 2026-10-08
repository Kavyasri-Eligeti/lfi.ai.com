import { useEffect, useRef, useState } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import NextChapter from './NextChapter';
import AILogo from '../brand/AILogo';
import GlitchText from '../fx/GlitchText';
import { CHAPTER_SEQUENCE, nextChapterFor } from '../../app/navigation';
import { EASE } from '../../features/motion/tokens';
import { useMotion } from '../../features/motion/MotionProvider';
import { getLenis, jumpTo } from '../../features/motion/SmoothScroll';
import { warmTheatre } from '../../features/theatre/TheatreStage';

// Scrolls to #hash targets after navigation (e.g. /solutions#sap), gliding
// with the smooth scroller when it is running.
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
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(el, { offset: -80, duration: 1.6 });
        else el.scrollIntoView({ block: 'start' });
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
        el.focus({ preventScroll: true });
      } else if (tries++ < 40) {
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

// Keeps the leaving page on screen while it animates out.
function FrozenOutlet() {
  const outlet = useOutlet();
  const [frozen] = useState(outlet);
  return frozen;
}

// The page change runs on events, not a fixed clock, so a slow page never
// shows through:
//  1. the curtain sweeps up and covers the screen (0.4 s) while the old page
//     eases back and dims behind it
//  2. once the old page has gone and the new one has been built, the
//     curtain holds a beat on the destination's name
//  3. the curtain lifts away upwards and the new page rises into place
const page = {
  initial: { opacity: 0, y: 90, scale: 1.02 },
  enter: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, delay: 0.05, ease: EASE.cinematic } },
  exit: { opacity: 0, y: -50, scale: 0.955, transition: { duration: 0.35, ease: EASE.inOut } },
};
const pageReduced = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const labelFor = (pathname) => CHAPTER_SEQUENCE.find((c) => c.path === pathname)?.label || 'Linkfields AI';
const CURTAIN_EASE = [0.76, 0, 0.24, 1];

/** The curtain that carries the visitor from one page to the next. */
function Curtain({ pathname, phase, onGone }) {
  const label = labelFor(pathname);
  const covering = phase === 'in';
  return (
    <m.div
      className="lf-curtain"
      aria-hidden="true"
      initial={{ y: '100%' }}
      animate={{ y: covering ? '0%' : '-100%' }}
      transition={{ duration: covering ? 0.4 : 0.6, ease: CURTAIN_EASE }}
      onAnimationComplete={() => { if (!covering) onGone(); }}
    >
      <m.div
        className="lf-curtain__inner"
        initial={{ opacity: 0, y: 40 }}
        animate={covering ? { opacity: 1, y: 0 } : { opacity: 0, y: -70 }}
        transition={{ duration: covering ? 0.4 : 0.35, delay: covering ? 0.08 : 0, ease: 'easeOut' }}
      >
        <AILogo size={84} />
        <p className="lf-curtain__label"><GlitchText text={label} trigger="mount" duration={600} /></p>
        <m.span
          className="lf-curtain__line"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeInOut' }}
        />
      </m.div>
    </m.div>
  );
}

export default function RootLayout() {
  const { pathname, hash } = useLocation();
  const { reduced } = useMotion();
  const firstRender = useRef(true);
  useEffect(() => {
    firstRender.current = false;
    // Fetch the homepage's 3D ring in the background, whatever page the visit
    // starts on, so going home later shows it without a wait.
    warmTheatre();
  }, []);
  useRouteFocus(pathname, hash);

  // Freeze scrolling while pages change, so wheel or trackpad momentum from the
  // old page cannot carry into the new one. It resumes once the new page lands.
  const resumeTimer = useRef(0);
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    window.clearTimeout(resumeTimer.current);
    getLenis()?.stop();
  }, [pathname]);
  useEffect(() => () => window.clearTimeout(resumeTimer.current), []);

  // The curtain: covers on every page change, lifts once the new page is built.
  const [curtain, setCurtain] = useState(null); // { path, phase: 'in' | 'out' }
  const coveredAt = useRef(0);
  const curtainPath = useRef(pathname); // never on the first load
  useEffect(() => {
    if (curtainPath.current === pathname) return;
    curtainPath.current = pathname;
    if (reduced) return;
    coveredAt.current = performance.now() + 400;
    setCurtain({ path: pathname, phase: 'in' });
  }, [pathname, reduced]);

  const onExitComplete = () => {
    if (!window.location.hash) jumpTo(0);
    window.clearTimeout(resumeTimer.current);
    // The new page mounts after this; wait for it to paint (two frames), and
    // for the curtain to have fully covered, plus a short beat on the name.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const wait = Math.max(0, coveredAt.current - performance.now()) + 60;
        window.setTimeout(() => setCurtain((c) => (c ? { ...c, phase: 'out' } : c)), wait);
        resumeTimer.current = window.setTimeout(() => getLenis()?.start(), wait + 300);
      })
    );
    // Safety net: never leave the curtain up.
    window.setTimeout(() => setCurtain((c) => (c && c.phase === 'in' ? { ...c, phase: 'out' } : c)), 1800);
  };

  return (
    <>
      <a className="lf-skip-link" href="#main">Skip to main content</a>
      <Header />
      <main id="main" tabIndex={-1}>
        <AnimatePresence mode="wait" initial={false} onExitComplete={onExitComplete}>
          {/* The footer and the next-page handoff travel with the page, so the
              whole old page leaves together. */}
          <m.div
            key={pathname}
            variants={reduced ? pageReduced : page}
            initial="initial"
            // The new page waits behind the curtain and rises as it lifts.
            animate={!curtain || curtain.phase === 'out' ? 'enter' : 'initial'}
            exit="exit"
            className="lf-page"
          >
            <FrozenOutlet />
            {/* Pages in the flow end with the handoff to the next page; the
                footer comes once, at the end of the flow (and on pages
                outside it), instead of repeating on every page. */}
            {nextChapterFor(pathname) ? <NextChapter pathname={pathname} /> : <Footer />}
          </m.div>
        </AnimatePresence>
      </main>
      {curtain && <Curtain key={curtain.path} pathname={curtain.path} phase={curtain.phase} onGone={() => setCurtain(null)} />}
      <HashScroller />
    </>
  );
}

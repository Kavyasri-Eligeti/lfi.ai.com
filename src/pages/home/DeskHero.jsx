import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { m, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import LinkfieldsLogo from '../../components/brand/LinkfieldsLogo';
import { company } from '../../content/company';
import { useMotion } from '../../features/motion/MotionProvider';
import { whenPageSettled } from '../../features/motion/pageSettled';
import './desk.css';


export function canUseDesk() {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return false;
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

function HeroCopy() {
  return (
    <>
      {/* Left: the statement. Right: the offer. Same size and style, mirrored. */}
      <div className="dk-copy__lead">
        <p className="dk-eyebrow"><span className="dk-eyebrow__dot" aria-hidden="true" />Linkfields AI</p>
        <h1 id="hero-title" className="dk-title">
          Intelligence that<br /><span className="dk-hl">moves business<br />forward.</span>
        </h1>
      </div>
      <div className="dk-copy__side">
        <span className="dk-copy__rule" aria-hidden="true" />
        <p className="dk-title dk-tag">
          AI solutions.<br /><span className="dk-hl">AI services.<br />Live demos.</span>
        </p>
        <div className="dk-actions">
          <Link to="/solutions" className="dk-pill dk-pill--primary">Explore AI solutions</Link>
          <Link to="/contact" className="dk-pill dk-pill--ghost">Talk to our team</Link>
        </div>
      </div>
    </>
  );
}

/** Without WebGL or with reduced motion: the copy over a still, then the screen's content. */
function StillHero() {
  return (
    <>
      <section className="dk-still" aria-labelledby="hero-title">
        <img className="dk-still__bg" src={`${process.env.PUBLIC_URL}/media/desk/poster.jpg`} alt="" />
        <div className="dk-copy"><HeroCopy /></div>
      </section>
    </>
  );
}

export default function DeskHero() {
  const { reduced } = useMotion();
  const [enabled] = useState(() => !reduced && canUseDesk());
  return enabled ? <SceneHero /> : <StillHero />;
}

function SceneHero() {
  const section = useRef(null);
  const host = useRef(null);
  const engine = useRef(null);
  const [ready, setReady] = useState(false);

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  // The section starts under the header (negative margin), so at the top of
  // the page the progress is already ~0.04: the fades begin after that.
  const copyOpacity = useTransform(scrollYProgress, [0.06, 0.17], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0.06, 0.2], [0, -80]);
  const noteOpacity = useTransform(scrollYProgress, [0.06, 0.11], [1, 0]);
  const vignette = useTransform(scrollYProgress, [0.55, 0.9], [1, 0]);
  // The screen's logo hands over to the AI ring that draws in below.
  // The AI ring's scene is already drawn underneath the last screen of this
  // scene: the laptop's display dissolves straight into it, pushing in a touch.
  // Once the camera is parked on the display, a flat, exact copy of it fades
  // in: true white and pixel-sharp (the 3D render is tone-mapped).
  const endOpacity = useTransform(scrollYProgress, [0.775, 0.805], [0, 1]);
  const pinOpacity = useTransform(scrollYProgress, [0.84, 0.96], [1, 0]);
  const pinScale = useTransform(scrollYProgress, [0.84, 0.96], [1, 1.12]);

  // The navigation stays out of the way during the scene and arrives with the site.
  const setZoom = (v) => document.documentElement.classList.toggle('lf-hero-zoom', v < 0.95);
  useEffect(() => {
    setZoom(scrollYProgress.get());
    return () => document.documentElement.classList.remove('lf-hero-zoom');
  }, [scrollYProgress]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    engine.current?.setProgress(v / 0.8);
    setZoom(v);
  });

  useEffect(() => {
    let cancelled = false;
    // Built once the page change is over; the still covers the scene until then.
    const cancelWait = whenPageSettled(() => {
      import(/* webpackChunkName: "desk" */ '../../features/desk/deskEngine').then(({ createDeskScene }) => {
        if (cancelled || !host.current) return;
        engine.current = createDeskScene(host.current, {
          onReady: () => !cancelled && setReady(true),
        });
        engine.current.setProgress(scrollYProgress.get() / 0.8);
      });
    });
    return () => {
      cancelled = true;
      cancelWait();
      engine.current?.dispose();
      engine.current = null;
    };
  }, [scrollYProgress]);

  return (
    <section ref={section} className={`dk${ready ? ' is-ready' : ''}`} aria-labelledby="hero-title">
      <m.div className="dk__pin" style={{ opacity: pinOpacity, scale: pinScale }}>
        <div ref={host} className="dk__stage">
          <img className="dk__poster" src={`${process.env.PUBLIC_URL}/media/desk/poster.jpg`} alt="" />
        </div>
        <m.div className="dk__vignette" style={{ opacity: vignette }} aria-hidden="true" />
        <m.div className="dk-endscreen" style={{ opacity: endOpacity }} aria-hidden="true">
          <LinkfieldsLogo className="dk-endscreen__logo" />
        </m.div>
        <m.div className="dk-copy" style={{ opacity: copyOpacity, y: copyY }}><HeroCopy /></m.div>
        <m.p className="dk-note" style={{ opacity: noteOpacity }}>
          {company.legalName}, established in {company.foundedIn} in {company.founded}.
        </m.p>
      </m.div>
    </section>
  );
}

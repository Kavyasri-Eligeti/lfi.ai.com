import { useEffect, useRef, useState } from 'react';
import { useMotion } from '../../features/motion/MotionProvider';
import './glitch.css';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/[]{}_-=+*#%';
const rand = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

/**
 * Text that decodes itself: characters scramble and resolve left to right
 * with an RGB split, when it first scrolls into view (or on mount), and
 * flickers again now and then. The real text is always what assistive
 * technology reads.
 */
export default function GlitchText({ text, trigger = 'view', delay = 0, duration = 1100, className = '' }) {
  const { reduced } = useMotion();
  const ref = useRef(null);
  const [shown, setShown] = useState(reduced ? text : '');
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (reduced || process.env.NODE_ENV === 'test') {
      setShown(text);
      return undefined;
    }
    let raf = 0;
    let timer = 0;
    let flicker = 0;
    const run = (dur) => {
      const start = performance.now();
      setActive(true);
      const step = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const reveal = Math.floor(t * text.length);
        let out = '';
        for (let i = 0; i < text.length; i += 1) {
          const ch = text[i];
          out += i < reveal || ch === ' ' ? ch : rand();
        }
        setShown(out);
        if (t < 1) raf = requestAnimationFrame(step);
        else {
          setShown(text);
          setActive(false);
        }
      };
      raf = requestAnimationFrame(step);
    };
    const begin = () => {
      timer = window.setTimeout(() => run(duration), delay);
      // An occasional short flicker keeps the type alive.
      flicker = window.setInterval(() => run(380), 7000 + Math.random() * 4000);
    };
    if (trigger === 'mount' || typeof IntersectionObserver === 'undefined') {
      begin();
      return () => {
        cancelAnimationFrame(raf);
        window.clearTimeout(timer);
        window.clearInterval(flicker);
      };
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        io.disconnect();
        begin();
      }
    }, { threshold: 0.3 });
    if (ref.current) io.observe(ref.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      window.clearInterval(flicker);
    };
  }, [text, trigger, delay, duration, reduced]);

  return (
    <span ref={ref} className={`lf-glitch${active ? ' is-active' : ''} ${className}`} data-text={shown || ' '}>
      <span className="lf-visually-hidden">{text}</span>
      <span aria-hidden="true">{shown || ' '}</span>
    </span>
  );
}

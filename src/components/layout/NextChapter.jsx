import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { m, useIsPresent, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion';
import AILogo from '../brand/AILogo';
import { Arrow } from '../ui/Icon';
import { nextChapterFor, previousChapterFor } from '../../app/navigation';
import { useMotion } from '../../features/motion/MotionProvider';
import { isPageChanging } from '../../features/motion/pageSettled';
import './next-chapter.css';

const R = 92;
const C = 2 * Math.PI * R;

function HandoffPanel({ next, previous }) {
  const navigate = useNavigate();
  const ref = useRef(null);
  const armed = useRef(false);
  const fired = useRef(false);
  const present = useIsPresent();
  // Mobile browser chrome can make clientHeight differ from the visible
  // viewport. Use the actual viewport so the handoff remains reachable.
  const p = useMotionValue(0);
  useEffect(() => {
    const update = () => {
      if (!ref.current) return;
      const top = ref.current.getBoundingClientRect().top + window.scrollY;
      const start = previous ? top : top - window.innerHeight;
      const end = top + ref.current.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, (window.scrollY - start) / Math.max(1, end - start)));
      p.set(previous ? 1 - progress : progress);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [p, previous]);

  const titleScale = useTransform(p, [0.3, 1], [0.9, 1.35]);
  const titleOpacity = useTransform(p, [0.3, 0.5, 0.9, 1], [0, 1, 1, 0]);
  const lineScale = useTransform(p, [0.4, 0.985], [0, 1]);
  const dash = useTransform(p, [0.4, 0.985], [C, 0]);
  const fade = useTransform(p, [0.9, 1], [0, 1]);

  // Arm only once the visitor scrolls into the panel, so a page that opens at
  // its foot never jumps straight on. Then the end of the panel opens the next page.
  useMotionValueEvent(p, 'change', (v) => {
    if (!present || isPageChanging()) {
      armed.current = false;
      return;
    }
    if (v <= 0.2) armed.current = false;
    if (v <= p.getPrevious()) return;
    if (v > 0.2 && v < 0.85) armed.current = true;
    if (armed.current && !fired.current && v >= 0.985) {
      fired.current = true;
      navigate(next.path, { state: { chapterScroll: previous ? 'backward' : 'forward' } });
    }
  });

  return (
    <section ref={ref} className={`lf-next${previous ? ' lf-previous' : ''}`} aria-label={`${previous ? 'Previous' : 'Next'}: ${next.label}`}>
      <div className="lf-next__sticky">
        <m.div className="lf-next__content" style={{ scale: titleScale, opacity: titleOpacity }}>
          <div className="lf-next__dial" aria-hidden="true">
            <svg viewBox="0 0 200 200" className="lf-next__ring">
              <circle cx="100" cy="100" r={R} className="lf-next__track" />
              <m.circle cx="100" cy="100" r={R} className="lf-next__progress" style={{ strokeDasharray: C, strokeDashoffset: dash }} />
            </svg>
            <AILogo size={96} />
          </div>
          <p className="lf-next__eyebrow">{previous ? '<- Previous' : '-> Next'}</p>
          <p className="lf-next__title">{next.label}</p>
          <m.span className="lf-next__line" style={{ scaleX: lineScale }} aria-hidden="true" />
          <p className="lf-next__hint">Keep scrolling {previous ? 'up' : 'down'}</p>
          <Link to={next.path} state={{ chapterScroll: previous ? 'backward' : 'forward' }} className="lf-btn lf-btn--sm">Go to {next.label} <Arrow /></Link>
        </m.div>
        <m.span className="lf-next__fade" style={{ opacity: fade }} aria-hidden="true" />
      </div>
    </section>
  );
}

function StaticPanel({ next, previous }) {
  return (
    <section className={`lf-next lf-next--static${previous ? ' lf-previous' : ''}`} aria-label={`${previous ? 'Previous' : 'Next'}: ${next.label}`}>
      <div className="lf-container lf-next__static">
        <p className="lf-next__eyebrow">{previous ? '<- Previous' : '-> Next'}</p>
        <Link to={next.path} className="lf-next__title lf-next__title--link">{next.label} <Arrow /></Link>
      </div>
    </section>
  );
}

/** The handoff at the foot of each page that carries the visitor on to the next one. */
// `pathname` is passed in by the page transition, so a page that is leaving
// keeps its own handoff instead of switching to the next page's.
export default function NextChapter({ pathname, previous = false }) {
  const { reduced } = useMotion();
  const next = previous ? previousChapterFor(pathname) : nextChapterFor(pathname);
  if (!next) return null;
  return reduced ? <StaticPanel next={next} previous={previous} /> : <HandoffPanel key={pathname} next={next} previous={previous} />;
}

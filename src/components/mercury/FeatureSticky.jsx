import { useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import { useMotion } from '../../features/motion/MotionProvider';
import { getLenis } from '../../features/motion/SmoothScroll';

/**
 * The reference's pinned feature block: a short heading, a rule, then a list
 * where one item is open (bullet, title, text, link) and the rest wait in a
 * muted tone. The block stays pinned while the page scrolls through it and the
 * open item follows the scroll; the visual beside it changes with the item.
 * Clicking an item opens it directly.
 */
export default function FeatureSticky({ id, theme, heading, items, renderVisual, reverse = false, visualClass = '' }) {
  const ref = useRef(null);
  const uid = useId();
  const { reduced: reduce } = useMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (reduce) return;
    const i = Math.min(items.length - 1, Math.max(0, Math.floor(v * items.length * 0.999)));
    setActive(i);
  });

  // When a user picks an item, scroll the page to the matching point so the
  // pinned state and the selection agree.
  const pick = (i) => {
    setActive(i);
    const el = ref.current;
    if (!el || reduce) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    const y = top + span * ((i + 0.5) / items.length);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 1 });
    else window.scrollTo({ top: y, behavior: 'smooth' });
  };

  return (
    <section
      ref={ref}
      id={id}
      className={`fs${reverse ? ' fs--reverse' : ''}${reduce ? ' fs--still' : ''}`}
      data-theme={theme}
      style={{ '--fs-steps': items.length }}
      aria-labelledby={`${uid}-h`}
    >
      <div className="fs__pin">
        <div className="lf-container fs__grid">
          <div className="fs__copy">
            <h2 id={`${uid}-h`} className="fs__heading">{heading}</h2>
            <hr className="fs__rule" />
            <ul className="fs__list">
              {items.map((it, i) => {
                const on = i === active;
                return (
                  <li key={it.title} className={`fs__item${on ? ' is-on' : ''}`}>
                    <h3 className="fs__h">
                      <button type="button" className="fs__btn" aria-expanded={on} aria-controls={`${uid}-${i}`} onClick={() => pick(i)}>
                        <span className="fs__bullet" aria-hidden="true" />
                        {it.title}
                      </button>
                    </h3>
                    <div id={`${uid}-${i}`} className="fs__body" hidden={!on}>
                      <p className="fs__text">{it.text}</p>
                      {it.link && <Link to={it.link.href} className="mx-tlink">{it.link.label}</Link>}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className={`fs__visual ${visualClass}`}>{renderVisual(active)}</div>
        </div>
      </div>
    </section>
  );
}

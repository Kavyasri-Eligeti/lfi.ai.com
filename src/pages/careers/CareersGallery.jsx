import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, m, useScroll, useTransform } from 'framer-motion';
import { useMotion } from '../../features/motion/MotionProvider';
import { getLenis } from '../../features/motion/SmoothScroll';

const EASE = [0.22, 1, 0.36, 1];

/**
 * One photo in the mosaic. It wipes open and settles from a zoom as it scrolls
 * in, drifts with a gentle parallax while the page scrolls, and on hover zooms
 * a little and shows its caption. Clicking opens it full screen in HD.
 */
function Tile({ photo, index, onOpen, reduced }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-7%', '7%']);
  const delay = (index % 3) * 0.08;
  return (
    <m.li
      ref={ref}
      className={`lf-gal__tile lf-gal__tile--${index + 1}`}
      initial={reduced ? false : { clipPath: 'inset(14% 10% 14% 10% round 22px)', opacity: 0 }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 22px)', opacity: 1 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1.1, delay, ease: EASE }}
    >
      <button type="button" className="lf-gal__open" onClick={() => onOpen(index)} aria-label={`Open photo: ${photo.caption}`}>
        <m.span className="lf-gal__para" style={reduced ? undefined : { y }}>
          <m.span
            className="lf-gal__zoom"
            initial={reduced ? false : { scale: 1.28 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
            transition={{ duration: 1.6, delay, ease: EASE }}
          >
            <img
              src={photo.src}
              srcSet={photo.srcSet}
              sizes="(max-width: 700px) 100vw, (max-width: 1280px) 60vw, 800px"
              width={photo.width}
              height={photo.height}
              alt={photo.alt}
              loading="lazy"
              decoding="async"
            />
          </m.span>
        </m.span>
        <span className="lf-gal__caption" aria-hidden="true">
          <span className="lf-gal__num">{String(index + 1).padStart(2, '0')}</span>
          {photo.caption}
        </span>
      </button>
    </m.li>
  );
}

/** Full-screen viewer: the HD file, with previous, next, Escape and arrow keys. */
function Lightbox({ photos, index, onClose, onStep }) {
  const close = useRef(null);
  const photo = photos[index];
  useEffect(() => {
    const prev = document.activeElement;
    close.current?.focus();
    const lenis = getLenis();
    lenis?.stop();
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      lenis?.start();
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
  }, []);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onStep(1);
      else if (e.key === 'ArrowLeft') onStep(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onStep]);

  return createPortal(
    <m.div
      className="lf-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${photos.length}: ${photo.caption}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <button ref={close} type="button" className="lf-lightbox__btn lf-lightbox__close" onClick={onClose} aria-label="Close">×</button>
      <button type="button" className="lf-lightbox__btn lf-lightbox__prev" onClick={() => onStep(-1)} aria-label="Previous photo">‹</button>
      <AnimatePresence mode="wait" initial={false}>
        <m.figure
          key={index}
          className="lf-lightbox__figure"
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -8 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <img src={photo.hd} width={photo.width} height={photo.height} alt={photo.alt} decoding="async" />
          <figcaption>
            <span className="lf-gal__num">{String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</span>
            {photo.caption}
          </figcaption>
        </m.figure>
      </AnimatePresence>
      <button type="button" className="lf-lightbox__btn lf-lightbox__next" onClick={() => onStep(1)} aria-label="Next photo">›</button>
    </m.div>,
    document.body
  );
}

/** Every photo from the careers page as an animated mosaic, viewable in HD. */
export default function CareersGallery({ photos, titleId }) {
  const { reduced } = useMotion();
  const [open, setOpen] = useState(null);
  const onClose = useCallback(() => setOpen(null), []);
  const onStep = useCallback((d) => setOpen((i) => (i === null ? i : (i + d + photos.length) % photos.length)), [photos.length]);
  return (
    <>
      <ul className="lf-list-plain lf-gal" aria-labelledby={titleId}>
        {photos.map((p, i) => <Tile key={p.hd} photo={p} index={i} onOpen={setOpen} reduced={reduced} />)}
      </ul>
      <AnimatePresence>
        {open !== null && <Lightbox photos={photos} index={open} onClose={onClose} onStep={onStep} />}
      </AnimatePresence>
    </>
  );
}

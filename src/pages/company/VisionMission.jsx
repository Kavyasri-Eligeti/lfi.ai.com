import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import { useMotion } from '../../features/motion/MotionProvider';
import { EASE } from '../../features/motion/tokens';

/** Vision mark: an eye whose iris ring turns slowly and whose pupil breathes. */
function VisionMark() {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true" focusable="false">
      <path className="lf-vm-mark__outline" d="M4 24C9.5 14.5 16.5 10 24 10s14.5 4.5 20 14c-5.5 9.5-12.5 14-20 14S9.5 33.5 4 24Z" />
      <g className="lf-vm-mark__spin">
        <circle cx="24" cy="24" r="8.5" className="lf-vm-mark__ring" />
      </g>
      <circle cx="24" cy="24" r="4" className="lf-vm-mark__core" />
      <circle cx="26.2" cy="21.8" r="1.2" fill="#fff" opacity="0.85" />
    </svg>
  );
}

/** Mission mark: a target whose outer ring turns slowly around a pulsing centre. */
function MissionMark() {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true" focusable="false">
      <g className="lf-vm-mark__spin lf-vm-mark__spin--rev">
        <circle cx="24" cy="24" r="19" className="lf-vm-mark__ring" />
      </g>
      <circle cx="24" cy="24" r="12.5" className="lf-vm-mark__outline" />
      <path className="lf-vm-mark__outline" d="M24 2v8M24 38v8M2 24h8M38 24h8" />
      <circle cx="24" cy="24" r="5" className="lf-vm-mark__core" />
    </svg>
  );
}

function Card({ kind, title, text, from, progress, reduced, index }) {
  // Scroll-linked drift: the cards ease towards each other as the section
  // crosses the viewport, then hold still.
  const x = useTransform(progress, [0, 0.45], [from * 40, 0]);
  const y = useTransform(progress, [0, 0.45, 1], [50, 0, -20]);
  const Mark = kind === 'vision' ? VisionMark : MissionMark;
  return (
    <m.article
      className={`lf-vm__card lf-vm__card--${kind}${kind === 'mission' ? ' lf-ink' : ''}`}
      style={reduced ? undefined : { x, y }}
      initial={reduced ? false : { opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, ease: EASE.out, delay: index * 0.12 }}
    >
      <div className="lf-vm__head">
        <span className="lf-vm-mark" aria-hidden="true">
          <Mark />
        </span>
        <p className="lf-eyebrow">{title}</p>
      </div>
      <p className="lf-vm__text">{text}</p>
    </m.article>
  );
}

/** Vision and mission as two highlighted cards with animated marks. */
export default function VisionMission({ vision, mission }) {
  const { reduced } = useMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  return (
    <section ref={ref} className="lf-section lf-section--tint" aria-label="Vision and mission">
      <div className="lf-container lf-vm">
        <Card kind="vision" title="Our vision" text={vision} from={-1} progress={scrollYProgress} reduced={reduced} index={0} />
        <Card kind="mission" title="Our mission" text={mission} from={1} progress={scrollYProgress} reduced={reduced} index={1} />
      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from 'react';
import { useMotion } from '../../features/motion/MotionProvider';
import './industry-scene.css';

/**
 * Industry footage: a short, silent, looping clip of real work in the
 * industry (see public/videos/industries/CREDITS.txt). The clip loads only
 * when the panel nears the viewport, plays only while it is on screen, and
 * under reduced motion the poster frame stays still. Decorative: the copy
 * names the industry.
 */
export const hasScene = (industry) => Boolean(industry?.video);

export default function IndustryScene({ industry }) {
  const { reduced } = useMotion();
  const wrap = useRef(null);
  const video = useRef(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const nearIo = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '60% 0px' });
    const seenIo = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.15 });
    nearIo.observe(el);
    seenIo.observe(el);
    return () => {
      nearIo.disconnect();
      seenIo.disconnect();
    };
  }, []);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (visible && !reduced) v.play?.().catch(() => {});
    else v.pause?.();
  }, [visible, reduced, near]);

  return (
    <div ref={wrap} className={`lf-footage${playing ? ' is-playing' : ''}`} aria-hidden="true">
      <img className="lf-footage__poster" src={industry.poster} alt="" width="576" height="720" loading="lazy" decoding="async" />
      {near && !reduced && (
        <video
          ref={video}
          className="lf-footage__video"
          src={industry.video}
          poster={industry.poster}
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
        />
      )}
      <span className="lf-footage__grade" />
    </div>
  );
}

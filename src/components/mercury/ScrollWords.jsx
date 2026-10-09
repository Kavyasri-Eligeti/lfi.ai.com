import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import { useMotion } from '../../features/motion/MotionProvider';

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.28, 1]);
  return (
    <m.span className="sw__w" style={{ opacity }}>
      {children}
    </m.span>
  );
}

/**
 * A headline whose words brighten one after another as it scrolls through
 * the viewport, as on the reference.
 */
export default function ScrollWords({ text, as: Tag = 'h2', className = '', id }) {
  const ref = useRef(null);
  const { reduced: reduce } = useMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'start 0.35'] });
  const words = text.split(' ');
  if (reduce) return <Tag ref={ref} id={id} className={className}>{text}</Tag>;
  return (
    <Tag ref={ref} id={id} className={`sw ${className}`} aria-label={text}>
      {words.map((w, i) => (
        <Word key={`${w}-${i}`} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}{i < words.length - 1 ? ' ' : ''}
        </Word>
      ))}
    </Tag>
  );
}

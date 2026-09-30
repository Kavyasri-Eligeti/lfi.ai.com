import { m } from 'framer-motion';
import { reveal } from '../../features/motion/tokens';

export default function SectionHeader({ eyebrow, title, children, id, as: Heading = 'h2' }) {
  return (
    <m.header className="lf-section-header" {...reveal}>
      {eyebrow && <p className="lf-eyebrow">{eyebrow}</p>}
      <Heading id={id}>{title}</Heading>
      {children && (typeof children === 'string' ? <p>{children}</p> : children)}
    </m.header>
  );
}

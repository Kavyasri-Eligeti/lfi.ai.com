import { m } from 'framer-motion';
import AIEmblemMark from '../brand/AIEmblemMark';
import { DURATION, EASE } from '../../features/motion/tokens';

// Dark hero band for content pages: the bridge between the universe and the light content.
export default function PageHero({ eyebrow, title, children, actions }) {
  return (
    <section className="lf-page-hero lf-dark" aria-labelledby="page-title">
      <AIEmblemMark className="lf-page-hero__emblem" size={300} animated />
      <div className="lf-container">
        <m.div
          // Transform-only entrance: text is painted immediately (no LCP delay).
          initial={{ y: 14 }}
          animate={{ y: 0 }}
          transition={{ duration: DURATION.section, ease: EASE.out }}
        >
          {eyebrow && <p className="lf-eyebrow">{eyebrow}</p>}
          <h1 id="page-title">{title}</h1>
          {children && (typeof children === 'string' ? <p>{children}</p> : children)}
          {actions && <div className="lf-actions">{actions}</div>}
        </m.div>
      </div>
    </section>
  );
}

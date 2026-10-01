import { m } from 'framer-motion';
import { DURATION, EASE } from '../../features/motion/tokens';
import './page-hero.css';

/**
 * Light page hero for content pages. The ornament is a small static cluster of
 * brand modules (`variant` changes its arrangement per page so each page has
 * its own identity inside one system).
 */
export default function PageHero({ eyebrow, title, children, actions, variant = 'a', aside }) {
  return (
    <section className={`lf-page-hero lf-page-hero--${variant}`} aria-labelledby="page-title">
      <div className="lf-container lf-page-hero__inner">
        <m.div
          className="lf-page-hero__copy"
          // Transform-only entrance: text is painted immediately (no LCP delay).
          initial={{ y: 14 }}
          animate={{ y: 0 }}
          transition={{ duration: DURATION.section, ease: EASE.out }}
        >
          {eyebrow && <p className="lf-eyebrow">{eyebrow}</p>}
          <h1 id="page-title">{title}</h1>
          {children && (typeof children === 'string' ? <p className="lf-lead">{children}</p> : children)}
          {actions && <div className="lf-actions">{actions}</div>}
        </m.div>
        {aside ? (
          <div className="lf-page-hero__aside">{aside}</div>
        ) : (
          <div className="lf-page-hero__modules" aria-hidden="true">
            <i /><i /><i /><i /><i />
          </div>
        )}
      </div>
    </section>
  );
}

import { m } from 'framer-motion';
import PageHero from '../../components/ui/PageHero';
import SmartLink from '../../components/ui/SmartLink';
import { careers } from '../../content/careers';
import { company, emails } from '../../content/company';
import { usePageMeta } from '../../hooks/usePageMeta';
import { reveal, stagger } from '../../features/motion/tokens';
import '../content.css';
import './careers.css';

const ACCENTS = ['#ffd600', '#ff7800', '#4f7dff', '#45e0d0', '#8a7dff', '#ffb45a'];

export default function CareersPage() {
  usePageMeta('Careers', careers.intro);
  return (
    <>
      <PageHero
        eyebrow={careers.eyebrow}
        title={careers.title}
        actions={
          <SmartLink href={careers.cta.jobsHref} className="lf-btn lf-btn--accent">
            {careers.cta.jobsLabel}
          </SmartLink>
        }
      >
        <p>{careers.intro}</p>
      </PageHero>

      <section className="lf-section" aria-labelledby="thinking-space">
        <div className="lf-container lf-split">
          <m.div {...reveal}>
            <p className="lf-eyebrow">{careers.subtitle}</p>
            <h2 id="thinking-space">{careers.thinkingSpace.title}</h2>
            <p className="lf-lead">{careers.thinkingSpace.text}</p>
            <p>{careers.empower}</p>
          </m.div>
          <div className="lf-orbit-cards" aria-hidden="true">
            {careers.nurture.slice(0, 3).map((q, i) => (
              <span key={q} className={`lf-orbit-card lf-orbit-card--${i}`} style={{ '--accent': ACCENTS[i] }}>{q}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="lf-section lf-section--dark lf-dark" aria-labelledby="nurture">
        <div className="lf-container">
          <m.header className="lf-section-header" {...reveal}>
            <p className="lf-eyebrow">Culture</p>
            <h2 id="nurture">{careers.nurtureTitle}</h2>
          </m.header>
          <ul className="lf-nurture">
            {careers.nurture.map((q, i) => (
              <m.li key={q} style={{ '--accent': ACCENTS[i % ACCENTS.length] }} {...stagger(i)}>
                <span className="lf-nurture__index" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3>{q}</h3>
              </m.li>
            ))}
          </ul>
        </div>
      </section>

      <section className="lf-section" aria-labelledby="apply">
        <div className="lf-container lf-careers-cta">
          <m.div {...reveal}>
            <h2 id="apply">{careers.cta.title}</h2>
            <p>
              Browse current openings on the Linkfields jobs page, or write to{' '}
              <a href={`mailto:${emails.careers}`}>{emails.careers}</a>.
            </p>
            <div className="lf-actions">
              <SmartLink href={careers.cta.jobsHref} className="lf-btn lf-btn--primary">{careers.cta.jobsLabel}</SmartLink>
              <SmartLink href={company.links.careers} className="lf-btn lf-btn--ghost">Careers on linkfields.com</SmartLink>
            </div>
          </m.div>
        </div>
      </section>
    </>
  );
}

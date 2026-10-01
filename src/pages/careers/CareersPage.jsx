import { m } from 'framer-motion';
import PageHero from '../../components/ui/PageHero';
import SmartLink from '../../components/ui/SmartLink';
import { Arrow } from '../../components/ui/Icon';
import { careers } from '../../content/careers';
import { company, emails } from '../../content/company';
import { usePageMeta } from '../../hooks/usePageMeta';
import './careers.css';
import Reveal from '../../features/motion/Reveal';

const imgClip = {
  initial: { clipPath: 'inset(6% 6% 6% 6% round 6px 6px 48px 6px)' },
  whileInView: { clipPath: 'inset(0% 0% 0% 0% round 6px 6px 48px 6px)' },
  viewport: { once: true, margin: '0px 0px -10% 0px' },
  transition: { duration: 0.9, ease: [0.22, 0.8, 0.24, 1] },
};

function Photo({ image, sizes, eager = false, className = '' }) {
  return (
    <m.figure className={`lf-careers-photo ${className}`} {...imgClip}>
      <img
        src={image.src}
        srcSet={`${image.srcSm} ${Math.round(image.width / 2)}w, ${image.src} ${image.width}w`}
        sizes={sizes}
        width={image.width}
        height={image.height}
        alt={image.alt}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
        decoding="async"
      />
    </m.figure>
  );
}

export default function CareersPage() {
  usePageMeta('Careers', 'Careers at Linkfields Innovations: a place for great minds. Find open roles on the official jobs page.');
  return (
    <>
      <PageHero
        variant="a"
        eyebrow={careers.eyebrow}
        title={careers.title}
        actions={
          <>
            <SmartLink href={careers.cta.jobsHref} className="lf-btn">{careers.cta.jobsLabel} <Arrow /></SmartLink>
            <a href={`mailto:${emails.careers}`} className="lf-btn lf-btn--secondary">{emails.careers}</a>
          </>
        }
      >
        <p className="lf-lead"><strong>{careers.subtitle}.</strong> {careers.intro}</p>
      </PageHero>

      <section className="lf-section lf-careers-intro" aria-label="Our workplace">
        <div className="lf-container">
          <Photo image={careers.images.office} sizes="(max-width: 1280px) 100vw, 1280px" className="lf-careers-photo--wide" eager />
        </div>
      </section>

      <section className="lf-section" aria-labelledby="thinking-title">
        <div className="lf-container lf-careers-split">
          <Reveal as="div">
            <p className="lf-eyebrow">Our culture</p>
            <h2 id="thinking-title">{careers.thinkingSpace.title}</h2>
            <p className="lf-lead">{careers.thinkingSpace.text}</p>
            <p className="lf-careers-empower">{careers.empower}</p>
          </Reveal>
          <div className="lf-careers-stack">
            <Photo image={careers.images.team} sizes="(max-width: 860px) 100vw, 45vw" />
            <Photo image={careers.images.meeting} sizes="(max-width: 860px) 100vw, 35vw" className="lf-careers-photo--offset" />
          </div>
        </div>
      </section>

      <section className="lf-section lf-section--tint" aria-labelledby="nurture-title">
        <div className="lf-container">
          <Reveal as="h2" id="nurture-title" className="lf-careers-nurture__title">{careers.nurtureTitle}</Reveal>
          <ul className="lf-list-plain lf-nurture">
            {careers.nurture.map((q, i) => (
              <Reveal as="li" key={q} index={i} step={0.05}>
                <span className="lf-nurture__module" aria-hidden="true" />
                {q}
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="lf-section lf-section--ink lf-ink lf-careers-cta" aria-labelledby="careers-cta-title">
        <div className="lf-container lf-careers-cta__inner">
          <Reveal as="div">
            <p className="lf-eyebrow">Join us</p>
            <h2 id="careers-cta-title">{careers.cta.title}</h2>
            <p className="lf-lead">{careers.cta.text}</p>
          </Reveal>
          <div className="lf-actions">
            <SmartLink href={careers.cta.jobsHref} className="lf-btn lf-btn--yellow">{careers.cta.jobsLabel} <Arrow /></SmartLink>
            <SmartLink href={company.links.careers} className="lf-btn lf-btn--secondary">Careers on linkfields.com</SmartLink>
          </div>
          <p className="lf-meta lf-careers-cta__note">
            Open roles are listed on the official jobs page. Questions can go to <a href={`mailto:${emails.careers}`}>{emails.careers}</a>.
          </p>
        </div>
      </section>
    </>
  );
}

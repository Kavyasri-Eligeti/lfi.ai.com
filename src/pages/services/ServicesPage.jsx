import PageHero from '../../components/ui/PageHero';
import SmartLink from '../../components/ui/SmartLink';
import Icon, { Arrow } from '../../components/ui/Icon';
import { aiServicePractice } from '../../content/services';
import { usePageMeta } from '../../hooks/usePageMeta';
import './services.css';
import Reveal from '../../features/motion/Reveal';
import LogoRow from '../../components/ui/LogoRow';
import { SERVICE_LOGOS, SUB_SERVICE_LOGOS } from '../../content/logos';

function SubService({ sub }) {
  return (
    <details className="lf-disclosure lf-subservice">
      <summary>
        <span className="lf-subservice__name">{sub.name}</span>
        <span className="lf-disclosure__icon" aria-hidden="true"><Icon name="plus" size={16} /></span>
      </summary>
      <div className="lf-subservice__body">
        {sub.tagline && <p className="lf-subservice__tagline">{sub.tagline}</p>}
        {sub.summary && <p>{sub.summary}</p>}
        <LogoRow keys={SUB_SERVICE_LOGOS[sub.name]} size="sm" label={`${sub.name} platforms`} className="lf-subservice__logos" />
        <SmartLink href={sub.href} className="lf-link">{sub.linkLabel || `Read more about ${sub.name}`} <Arrow /></SmartLink>
      </div>
    </details>
  );
}

function ServiceRow({ service }) {
  return (
    <Reveal as="article" id={service.id} className={`lf-service${service.isNew ? ' lf-service--new' : ''}`} aria-labelledby={`${service.id}-title`}>
      {/* The two-column row: the sticky header travels only within it. */}
      <div className="lf-service__row">
      <header className="lf-service__head">
        {service.isNew && <p className="lf-service__new">New practice</p>}
        <h2 id={`${service.id}-title`} className="lf-service__name">{service.name}</h2>
        <p className="lf-service__headline">{service.headline}</p>
        <LogoRow keys={SERVICE_LOGOS[service.id]} label={`${service.name} platforms`} className="lf-service__logos" />
        <SmartLink href={service.href} className="lf-link">{service.linkLabel || `${service.name} on linkfields.com`} <Arrow /></SmartLink>
      </header>
      <div className="lf-service__body">
        <h3 className="lf-service__overview-title">{service.overview.title}</h3>
        <p className="lf-service__overview">{service.overview.text}</p>
        {service.offer && <p className="lf-service__offer">{service.offer}</p>}
        {service.subServices && (
          <div className="lf-service__subs">
            {service.subServices.map((sub) => <SubService key={sub.name} sub={sub} />)}
          </div>
        )}
      </div>
      </div>
      {/* Offerings grouped in bands across the full width: the group on the
          left, its offerings side by side. */}
      {service.groups && (
        <div className="lf-service__groups">
          {service.groups.map((g) => (
            <section key={g.name} className="lf-service__group" aria-label={g.name}>
              <h4 className="lf-service__group-name">{g.name}</h4>
              <ul className="lf-list-plain lf-service__group-items">
                {g.items.map((it) => (
                  <li key={it.name}>
                    <strong>{it.name}</strong>
                    <span>{it.text}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </Reveal>
  );
}

export default function ServicesPage() {
  usePageMeta(
    'AI Services',
    'Linkfields AI services: AI strategy, generative AI and LLM engineering, AI agents, RAG, custom models, data engineering, MLOps, responsible AI and AI integration.'
  );

  return (
    <>
      <PageHero
        eyebrow="AI Services"
        title="AI services, from strategy to production"
        actions={<a href="#ai-services" className="lf-btn">Explore our AI services <Arrow /></a>}
      >
        <p className="lf-lead">
          End-to-end AI services from Linkfields Innovations: AI strategy, generative AI and LLM engineering, AI agents, RAG,
          custom models, data engineering, MLOps and responsible AI, built and run on secure foundations.
        </p>
      </PageHero>

      <section className="lf-section" aria-label="Linkfields AI services">
        <div className="lf-container">
          <ServiceRow service={aiServicePractice} />
        </div>
      </section>
    </>
  );
}

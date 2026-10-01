import { useEffect, useState } from 'react';
import PageHero from '../../components/ui/PageHero';
import SectionHeader from '../../components/ui/SectionHeader';
import SmartLink from '../../components/ui/SmartLink';
import ProposalCard from '../../components/ui/ProposalCard';
import Icon, { Arrow } from '../../components/ui/Icon';
import ContactBand from '../../components/sections/ContactBand';
import { corporateServices } from '../../content/services';
import { proposedServices } from '../../content/proposals';
import { usePageMeta } from '../../hooks/usePageMeta';
import './services.css';
import Reveal from '../../features/motion/Reveal';

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
        <SmartLink href={sub.href} className="lf-link">Read more about {sub.name} <Arrow /></SmartLink>
      </div>
    </details>
  );
}

function ServiceRow({ service }) {
  return (
    <Reveal as="article" id={service.id} className="lf-service" aria-labelledby={`${service.id}-title`}>
      <header className="lf-service__head">
        <h2 id={`${service.id}-title`} className="lf-service__name">{service.name}</h2>
        <p className="lf-service__headline">{service.headline}</p>
        <SmartLink href={service.href} className="lf-link">{service.name} on linkfields.com <Arrow /></SmartLink>
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
        {service.groups && (
          <div className="lf-service__groups">
            {service.groups.map((g) => (
              <section key={g.name} className="lf-service__group" aria-label={g.name}>
                <h4>{g.name}</h4>
                <ul className="lf-list-plain">
                  {g.items.map((it) => (
                    <li key={it.name}><strong>{it.name}</strong> {it.text}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </Reveal>
  );
}

// Highlights the service currently in view in the side index.
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      let current = ids[0];
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      });
      setActive(current);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ids]);
  return active;
}

const SERVICE_IDS = corporateServices.map((s) => s.id);

export default function ServicesPage() {
  usePageMeta(
    'Services',
    'Linkfields Innovations services: Engineering, Consulting, Cloud, Automation, Technology, Teams and IT Infrastructure and Solutions.'
  );
  const active = useActiveSection(SERVICE_IDS);

  return (
    <>
      <PageHero
        variant="b"
        eyebrow="Services"
        title="Seven practices behind every Linkfields solution"
        actions={<a href="#ai-services" className="lf-btn lf-btn--secondary">Proposed AI services</a>}
      >
        <p className="lf-lead">
          From consulting and engineering to cloud, automation, data and AI, these are the services Linkfields Innovations
          publishes, with every sub-service linked to its page.
        </p>
      </PageHero>

      <section className="lf-section lf-services-layout" aria-label="Linkfields services">
        <div className="lf-container lf-services-layout__inner">
          <nav className="lf-services-index" aria-label="Services on this page">
            <p className="lf-eyebrow">On this page</p>
            <ul className="lf-list-plain">
              {corporateServices.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} aria-current={active === s.id ? 'true' : undefined}>{s.name}</a>
                </li>
              ))}
              <li><a href="#ai-services">Proposed AI services</a></li>
            </ul>
          </nav>
          <div className="lf-services-list">
            {corporateServices.map((s) => <ServiceRow key={s.id} service={s} />)}
          </div>
        </div>
      </section>

      <section className="lf-section lf-section--tint" id="ai-services" aria-labelledby="ai-services-title">
        <div className="lf-container">
          <SectionHeader split id="ai-services-title" eyebrow="Proposed · awaiting approval" title="AI services under review">
            Possible additions to the Linkfields services. None of them is a current offering. The AI service published today is AI
            &amp; Machine Learning, part of the Technology service.
          </SectionHeader>
          <div className="lf-grid lf-proposals">
            {proposedServices.map((p, i) => <ProposalCard key={p.id} item={p} index={i} />)}
          </div>
        </div>
      </section>

      <ContactBand />
    </>
  );
}

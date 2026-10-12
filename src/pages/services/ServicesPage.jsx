import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getLenis } from '../../features/motion/SmoothScroll';
import PageHero from '../../components/ui/PageHero';
import SmartLink from '../../components/ui/SmartLink';
import Icon, { Arrow } from '../../components/ui/Icon';
import { allServices } from '../../content/services';
import { usePageMeta } from '../../hooks/usePageMeta';
import Reveal from '../../features/motion/Reveal';
import LogoRow from '../../components/ui/LogoRow';
import { SERVICE_LOGOS, SUB_SERVICE_LOGOS } from '../../content/logos';
import './services.css';

const number = (i) => String(i + 1).padStart(2, '0');

function jumpToService(e, id) {
  e.preventDefault();
  // Avoid the site's anchor handler starting a second scroll.
  e.stopPropagation();
  const target = document.getElementById(id);
  if (!target) return;
  window.history.replaceState(null, '', `#${id}`);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 88;
  const lenis = getLenis();
  if (lenis) {
    lenis.resize();
    const top = target.getBoundingClientRect().top + window.scrollY - offset - 24;
    lenis.scrollTo(top, { duration: 1.1, immediate: reduce });
  } else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}

function SubService({ sub, index }) {
  return (
    <details className="lf-card sp-offering">
      <summary>
        <span className="sp-offering__number" aria-hidden="true">{number(index)}</span>
        <span className="sp-offering__intro"><span className="sp-offering__name">{sub.name}</span>{sub.tagline && <span className="sp-offering__tagline">{sub.tagline}</span>}</span>
        <span className="lf-disclosure__icon sp-offering__toggle"><Icon name="plus" size={18} /></span>
      </summary>
      <div className="sp-offering__body">
        {sub.summary && <p>{sub.summary}</p>}
        <LogoRow keys={SUB_SERVICE_LOGOS[sub.name]} size="sm" label={`${sub.name} platforms`} />
        <SmartLink href={sub.href} className="lf-link">{sub.linkLabel || `Read more about ${sub.name}`} <Arrow /></SmartLink>
      </div>
    </details>
  );
}

function ServiceSection({ service, index }) {
  return (
    <article id={service.id} className={`sp-practice${service.isNew ? ' sp-practice--ai' : ''}`} aria-labelledby={`${service.id}-title`}>
      <Reveal className="sp-practice__top"><span className="lf-eyebrow">Practice / {number(index)}</span>{service.isNew && <span className="lf-badge lf-badge--orange">New practice</span>}</Reveal>
      <div className="lf-card sp-practice__feature">
        <Reveal as="header" className="sp-practice__identity">
          <h2 id={`${service.id}-title`}>{service.name}</h2>
          <p>{service.headline}</p>
          <SmartLink href={service.href} className="lf-link sp-practice__link">{service.linkLabel || `${service.name} on linkfields.com`} <Arrow /></SmartLink>
        </Reveal>
        <Reveal className="sp-practice__overview">
          <h3>{service.overview.title}</h3>
          <p>{service.overview.text}</p>{service.offer && <p>{service.offer}</p>}
          <LogoRow keys={SERVICE_LOGOS[service.id]} label={`${service.name} platforms`} className="sp-practice__logos" />
        </Reveal>
      </div>
      {service.subServices && <div className="sp-practice__offerings">
        <div className="sp-practice__section-title"><h3>Explore the capabilities</h3><span>{String(service.subServices.length).padStart(2, '0')} offerings</span></div>
        <div className="sp-offerings-grid">{service.subServices.map((sub, i) => <SubService key={sub.name} sub={sub} index={i} />)}</div>
      </div>}
      {service.groups && <div className="sp-groups">{service.groups.map((group, i) => (
        <section key={group.name} className="sp-group" aria-label={group.name}>
          <div className="sp-practice__section-title"><h3>{group.name}</h3><span aria-hidden="true">{number(i)}</span></div>
          <ul className="lf-list-plain sp-group__items">{group.items.map((item) => <li key={item.name} className="lf-card"><h4>{item.name}</h4><p>{item.text}</p></li>)}</ul>
        </section>
      ))}</div>}
    </article>
  );
}

export default function ServicesPage() {
  usePageMeta('Services', 'Linkfields Innovations services: Engineering, Consulting, Cloud, Automation, Technology, Teams, IT Infrastructure and Solutions, and AI Services.');
  const [active, setActive] = useState(allServices[0].id);
  const { hash } = useLocation();
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const threshold = window.innerHeight * 0.32;
      let current = allServices[0].id;
      allServices.forEach(({ id }) => { if (document.getElementById(id)?.getBoundingClientRect().top <= threshold) current = id; });
      setActive(current);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(frame); };
  }, []);
  useEffect(() => {
    const id = decodeURIComponent(hash.slice(1));
    if (!allServices.some((s) => s.id === id)) return undefined;
    const timer = window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }), 120);
    return () => window.clearTimeout(timer);
  }, [hash]);
  return (
    <div className="sp-page">
      <PageHero
        eyebrow="Services"
        title="Seven proven practices, and a new AI practice"
        actions={<a href="#ai-services" onClick={(e) => jumpToService(e, 'ai-services')} className="lf-btn">Explore AI services <Arrow /></a>}
        aside={<nav className="sp-jump" aria-label="Explore our practices"><ul className="lf-list-plain">{allServices.map((service) => (
          <li key={service.id}><a href={`#${service.id}`} onClick={(e) => jumpToService(e, service.id)}>{service.name}</a></li>
        ))}</ul></nav>}
      >
        <p className="lf-lead">From consulting and engineering to cloud, automation and data, the services Linkfields Innovations is known for, now joined by end-to-end AI services: strategy, generative AI, agents, RAG, MLOps and responsible AI.</p>
      </PageHero>
      <div className="lf-container sp-portfolio">
        <aside className="sp-rail"><nav className="sp-index" aria-label="Services on this page">
          <p className="lf-eyebrow">On this page</p>
          <ol className="lf-list-plain sp-index__list">{allServices.map((service, i) => (
            <li key={service.id}><a href={`#${service.id}`} onClick={(e) => jumpToService(e, service.id)} aria-current={active === service.id ? 'location' : undefined}><span>{number(i)}</span><span>{service.name}</span><Arrow /></a></li>
          ))}</ol>
        </nav></aside>
        <div className="sp-practices">{allServices.map((service, i) => <ServiceSection key={service.id} service={service} index={i} />)}</div>
      </div>
    </div>
  );
}

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getLenis } from '../../features/motion/SmoothScroll';
import PageHero from '../../components/ui/PageHero';
import SmartLink from '../../components/ui/SmartLink';
import Icon, { Arrow } from '../../components/ui/Icon';
import { allServices } from '../../content/services';
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

const SERVICE_IDS = allServices.map((s) => s.id);
const narrow = () => typeof window !== 'undefined' && Boolean(window.matchMedia?.('(max-width: 960px)').matches);
const clamp01 = (v) => Math.min(1, Math.max(0, v));

/**
 * Scroll drives the services. The index and the panel stay pinned while the
 * page scrolls through one step per service; each step shows one service.
 * A step is as long as its service needs: a tall service scrolls through its
 * own content within its step before the next one takes over. Choosing a
 * service in the index scrolls to its step, so clicking and scrolling agree.
 */
function useServiceScroller(count) {
  const section = useRef(null);
  const stage = useRef(null);
  const panels = useRef([]);
  const steps = useRef([]); // [{ start, len, overflow }] in px from the section top
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    let raf = 0;
    const layout = () => {
      const sec = section.current;
      const stg = stage.current;
      if (!sec || !stg) return;
      if (narrow()) {
        sec.style.height = '';
        panels.current.forEach((el) => { if (el) el.style.transform = ''; });
        return;
      }
      const view = stg.clientHeight;
      let start = 0;
      steps.current = panels.current.map((el) => {
        const overflow = Math.max(0, (el?.offsetHeight || 0) - view);
        // A short dwell for every service, plus the distance to scroll through it.
        const len = view * 0.85 + overflow * 1.1;
        const step = { start, len, overflow };
        start += len;
        return step;
      });
      sec.style.height = `${start + stg.offsetHeight}px`;
    };
    const update = () => {
      raf = 0;
      const sec = section.current;
      if (!sec || narrow() || !steps.current.length) return;
      const y = -sec.getBoundingClientRect().top;
      let idx = steps.current.findIndex((s) => y < s.start + s.len);
      if (idx < 0) idx = count - 1;
      const s = steps.current[idx];
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
      const el = panels.current[idx];
      if (el) {
        const t = clamp01((y - s.start) / Math.max(1, s.len));
        el.style.transform = s.overflow ? `translateY(${(-s.overflow * clamp01((t - 0.1) / 0.8)).toFixed(1)}px)` : '';
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const relayout = () => { layout(); onScroll(); };
    relayout();
    // Opening a sub-service changes a panel's height.
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(relayout) : null;
    panels.current.forEach((el) => el && ro?.observe(el));
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', relayout);
    return () => {
      ro?.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', relayout);
      cancelAnimationFrame(raf);
    };
  }, [count]);

  const goTo = (i, immediate = false) => {
    activeRef.current = i;
    setActive(i);
    const sec = section.current;
    if (!sec) return;
    if (narrow() || !steps.current[i]) {
      document.getElementById(SERVICE_IDS[i])?.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth', block: 'start' });
      return;
    }
    const y = sec.getBoundingClientRect().top + window.scrollY + steps.current[i].start + 2;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 1.1, immediate });
    else window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' });
  };
  return { section, stage, panels, active, goTo };
}

export default function ServicesPage() {
  usePageMeta(
    'Services',
    'Linkfields Innovations services: Engineering, Consulting, Cloud, Automation, Technology, Teams, IT Infrastructure and Solutions, and AI Services.'
  );
  const { section, stage, panels, active, goTo } = useServiceScroller(allServices.length);
  const selected = SERVICE_IDS[active];

  // A #id in the address (from links elsewhere) opens that service.
  const { hash } = useLocation();
  useEffect(() => {
    const i = SERVICE_IDS.indexOf(decodeURIComponent(hash.slice(1)));
    if (i < 0) return undefined;
    const t = window.setTimeout(() => goTo(i, true), 120);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash]);

  const list = useRef(null);
  const [marker, setMarker] = useState({ top: 0, height: 0 });
  useLayoutEffect(() => {
    const el = list.current?.querySelector(`[data-id="${selected}"]`);
    if (el) setMarker({ top: el.offsetTop, height: el.offsetHeight });
  }, [selected]);
  const choose = (e, i) => {
    window.history.replaceState(null, '', `#${SERVICE_IDS[i]}`);
    goTo(i);
  };

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Seven proven practices, and a new AI practice"
        actions={<a href="#ai-services" className="lf-btn">Explore AI services <Arrow /></a>}
      >
        <p className="lf-lead">
          From consulting and engineering to cloud, automation and data, the services Linkfields Innovations is known for, now joined
          by end-to-end AI services: strategy, generative AI, agents, RAG, MLOps and responsible AI.
        </p>
      </PageHero>

      <section ref={section} className="lf-services-layout" aria-label="Linkfields services">
        <div ref={stage} className="lf-services-stage">
          <div className="lf-container lf-services-layout__inner">
            {/* The rail runs the height of the stage; the rust marker follows the current service */}
            <aside className="lf-services-rail">
              <nav className="lf-services-index" aria-label="Services">
                <p className="lf-eyebrow">On this page</p>
                <div className="lf-services-index__list">
                  <span className="lf-services-index__marker" aria-hidden="true" style={{ transform: `translateY(${marker.top}px)`, height: marker.height }} />
                  <ul ref={list} className="lf-list-plain" role="tablist" aria-orientation="vertical">
                    {allServices.map((s, i) => (
                      <li key={s.id} data-id={s.id} role="presentation">
                        <button
                          type="button"
                          role="tab"
                          id={`tab-${s.id}`}
                          aria-selected={active === i}
                          aria-controls={`panel-${s.id}`}
                          aria-current={active === i ? 'true' : undefined}
                          onClick={(e) => choose(e, i)}
                        >
                          {s.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </nav>
            </aside>
            <div className="lf-services-list">
              {allServices.map((s, i) => (
                <div
                  key={s.id}
                  id={`panel-${s.id}`}
                  ref={(el) => { panels.current[i] = el; }}
                  role="tabpanel"
                  aria-labelledby={`tab-${s.id}`}
                  aria-hidden={active !== i}
                  inert={active !== i ? true : undefined}
                  className={`lf-services-panel${active === i ? ' is-active' : ''}`}
                >
                  <ServiceRow service={s} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

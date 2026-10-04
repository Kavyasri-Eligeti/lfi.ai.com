import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, m } from 'framer-motion';
import PageHero from '../../components/ui/PageHero';
import CardTheatre from '../../features/theatre/CardTheatre';
import { PAGE_THEATRES } from '../../content/theatreCards';
import SectionHeader from '../../components/ui/SectionHeader';
import SmartLink from '../../components/ui/SmartLink';
import StatusBadge from '../../components/ui/StatusBadge';
import DemoCard from '../../components/ui/DemoCard';
import Icon, { Arrow } from '../../components/ui/Icon';
import { corporateSolutions, ERP_INTRO } from '../../content/solutions';
import { demos } from '../../content/demos';
import { capabilities, capabilityById } from '../../content/capabilities';
import { industries } from '../../content/industries';
import { aiSolutions } from '../../content/aiSolutions';
import { getDemos } from '../../content/demos';
import ElementMark from '../../components/brand/ElementMark';
import LogoRow from '../../components/ui/LogoRow';
import { SOLUTION_LOGOS } from '../../content/logos';
import { STATUS, STATUS_META } from '../../content/status';
import { usePageMeta } from '../../hooks/usePageMeta';
import { layoutTransition } from '../../features/motion/tokens';
import './solutions.css';
import Reveal from '../../features/motion/Reveal';

const STATUS_FILTERS = [STATUS.PRODUCT, STATUS.INTERNAL, STATUS.POC];
const demoIndustries = (id) => industries.filter((i) => i.relatedDemos.includes(id)).map((i) => i.id);

function SolutionCard({ solution, index }) {
  return (
    <Reveal as="article" id={solution.id} className={`lf-solution lf-solution--${index % 3}`} index={index}>
      <div className="lf-solution__head">
        <span className="lf-solution__group">{solution.group}</span>
        <StatusBadge status={solution.status} />
      </div>
      <LogoRow keys={SOLUTION_LOGOS[solution.id]} size="lg" label={`${solution.name} logo`} className="lf-solution__logos" />
      <h3 className="lf-solution__name">{solution.name}</h3>
      <p className="lf-solution__headline">{solution.headline}</p>
      <p className="lf-solution__intro">{solution.intro}</p>
      {solution.offerings.length > 0 && (
        <ul className="lf-list-plain lf-solution__offerings" aria-label={`${solution.name} offerings`}>
          {solution.offerings.map((o) => <li key={o}>{o}</li>)}
        </ul>
      )}
      <SmartLink href={solution.href} className="lf-link lf-solution__more">
        {solution.id === 'testorium-z' ? 'Visit testoriumz.com' : `${solution.name} on linkfields.com`} <Arrow />
      </SmartLink>
    </Reveal>
  );
}

function AiSolutionCard({ solution, index }) {
  const live = getDemos(solution.demos);
  return (
    <Reveal as="article" id={solution.id} className="lf-aisol" index={index} step={0.04} style={{ '--a': solution.mark.accent }}>
      <div className="lf-aisol__head">
        <ElementMark code={solution.mark.code} index={index + 1} accent={solution.mark.accent} size={60} className="lf-aisol__mark" />
      </div>
      <h3 className="lf-aisol__name">{solution.name}</h3>
      <p className="lf-aisol__tagline">{solution.tagline}</p>
      <p className="lf-aisol__summary">{solution.summary}</p>
      <h4 className="lf-aisol__label">Use cases</h4>
      <ul className="lf-aisol__uses">
        {solution.useCases.map((u) => <li key={u}>{u}</li>)}
      </ul>
      <LogoRow keys={SOLUTION_LOGOS[solution.id]} size="sm" label={`${solution.name} platforms`} className="lf-aisol__logos" />
      <ul className="lf-list-plain lf-aisol__stack" aria-label="Built with">
        {solution.stack.map((t) => <li key={t} className="lf-tag">{t}</li>)}
      </ul>
      {live.length > 0 && (
        <p className="lf-aisol__live">
          <span>See it live:</span>{' '}
          {live.map((d, i) => (
            <span key={d.id}>
              {i > 0 && ', '}
              <SmartLink href={d.href}>{d.name}</SmartLink>
            </span>
          ))}
        </p>
      )}
    </Reveal>
  );
}

export default function SolutionsPage() {
  usePageMeta(
    'AI Solutions',
    'Linkfields AI solutions: generative AI, AI agents, enterprise RAG, conversational AI, document intelligence, computer vision, predictive analytics and more, plus enterprise platforms and live AI demos.'
  );
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const capability = capabilityById[params.get('capability')] ? params.get('capability') : '';
  const industry = params.get('industry') || '';
  const status = STATUS_FILTERS.includes(params.get('status')) ? params.get('status') : '';

  const set = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true, preventScrollReset: true });
  };
  const clear = () => setParams({}, { replace: true, preventScrollReset: true });

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const cap = capability && capabilityById[capability];
    return demos.filter((d) => {
      if (cap && !cap.demos.includes(d.id)) return false;
      if (industry && !demoIndustries(d.id).includes(industry)) return false;
      if (status && d.status !== status) return false;
      if (needle && !`${d.name} ${d.description || ''}`.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [q, capability, industry, status]);

  const counts = useMemo(
    () => Object.fromEntries(STATUS_FILTERS.map((s) => [s, demos.filter((d) => d.status === s).length])),
    []
  );
  const filtering = Boolean(q || capability || industry || status);

  return (
    <>
      <PageHero
        eyebrow="AI Solutions"
        title="AI solutions for the modern enterprise"
        actions={
          <>
            <a href="#ai-solutions" className="lf-btn">Explore {aiSolutions.length} AI solutions <Arrow /></a>
            <a href="#products" className="lf-btn lf-btn--secondary">Browse {demos.length} live demos</a>
          </>
        }
      >
        <p className="lf-lead">
          The AI solutions enterprises are adopting today, from generative AI and autonomous agents to document intelligence and
          predictive analytics, delivered by Linkfields on the platforms you already run. Each one links to live demos.
        </p>
      </PageHero>

      {/* The same card theatre as the homepage: this page's cards spiral around the data spine. */}
      <CardTheatre id="explore" cards={PAGE_THEATRES.solutions.cards} filters={PAGE_THEATRES.solutions.filters} label="Linkfields AI solutions and enterprise platforms" />

      {/* ---------- AI solutions ---------- */}
      <section className="lf-section" id="ai-solutions" aria-labelledby="ai-solutions-title">
        <div className="lf-container">
          <SectionHeader split id="ai-solutions-title" eyebrow="AI solutions" title="What we build with AI">
            Twelve solution areas that cover today’s enterprise AI market, each mapped to the use cases, technology and live Linkfields
            demos behind it.
          </SectionHeader>
          <div className="lf-aisols">
            {aiSolutions.map((s, i) => <AiSolutionCard key={s.id} solution={s} index={i} />)}
          </div>
        </div>
      </section>

      {/* ---------- A. Verified corporate solutions ---------- */}
      <section className="lf-section lf-section--tint" id="enterprise" aria-labelledby="enterprise-title">
        <div className="lf-container">
          <SectionHeader split id="enterprise-title" eyebrow="Enterprise solutions" title="Platforms Linkfields delivers">
            {ERP_INTRO}
          </SectionHeader>
          <div className="lf-solutions">
            {corporateSolutions.map((s, i) => <SolutionCard key={s.id} solution={s} index={i} />)}
          </div>
        </div>
      </section>

      {/* ---------- B. AI products and demos ---------- */}
      <section className="lf-section" id="products" aria-labelledby="products-title">
        <div className="lf-container">
          <SectionHeader split id="products-title" eyebrow="AI products and demos" title="The LFI AI catalogue">
            {demos.length} entries: {counts[STATUS.PRODUCT]} live demos, {counts[STATUS.INTERNAL]} tools that work only on the
            Linkfields network, and {counts[STATUS.POC]} proofs of concept.
          </SectionHeader>

          <form className="lf-catalogue-filters" role="search" aria-label="Filter the demo catalogue" onSubmit={(e) => e.preventDefault()}>
            <div className="lf-field lf-catalogue-filters__search">
              <label htmlFor="demo-q">Search demos</label>
              <div className="lf-search">
                <Icon name="search" size={18} />
                <input id="demo-q" className="lf-input" type="search" value={q} placeholder="Try fraud, churn or RAG" onChange={(e) => set('q', e.target.value)} />
              </div>
            </div>
            <div className="lf-field">
              <label htmlFor="demo-industry">Industry</label>
              <select id="demo-industry" className="lf-select" value={industry} onChange={(e) => set('industry', e.target.value)}>
                <option value="">All industries</option>
                {industries.filter((i) => i.relatedDemos.length).map((i) => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </select>
            </div>
            <div className="lf-field">
              <label htmlFor="demo-status">Availability</label>
              <select id="demo-status" className="lf-select" value={status} onChange={(e) => set('status', e.target.value)}>
                <option value="">Any</option>
                {STATUS_FILTERS.map((s) => <option key={s} value={s}>{STATUS_META[s].label} ({counts[s]})</option>)}
              </select>
            </div>
            <fieldset className="lf-catalogue-filters__caps">
              <legend>AI capability</legend>
              <ul className="lf-chips">
                <li>
                  <button type="button" className="lf-chip" aria-pressed={!capability} onClick={() => set('capability', '')}>All</button>
                </li>
                {capabilities.map((c) => (
                  <li key={c.id}>
                    <button type="button" className="lf-chip" aria-pressed={capability === c.id} onClick={() => set('capability', capability === c.id ? '' : c.id)}>
                      {c.name} <span className="lf-chip__count">{c.demos.length}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </fieldset>
          </form>

          <div className="lf-catalogue-status">
            <p className="lf-meta" role="status" aria-live="polite">
              Showing {filtered.length} of {demos.length}
              {capability ? ` · ${capabilityById[capability].name}` : ''}
            </p>
            {filtering && (
              <button type="button" className="lf-btn lf-btn--secondary lf-btn--sm" onClick={clear}>Clear filters</button>
            )}
          </div>
          {capability && <p className="lf-catalogue-capnote">{capabilityById[capability].summary}</p>}

          <m.ul layout className="lf-list-plain lf-catalogue-grid">
            <AnimatePresence initial={false} mode="popLayout">
              {filtered.map((demo) => (
                <m.li
                  key={demo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={layoutTransition}
                >
                  <DemoCard demo={demo} headingLevel={3} />
                </m.li>
              ))}
            </AnimatePresence>
          </m.ul>
          {!filtered.length && (
            <div className="lf-callout lf-callout--plain lf-catalogue-empty">
              <p>No demos match these filters. <button type="button" className="lf-catalogue-empty__reset" onClick={clear}>Clear all filters</button> to see the full catalogue.</p>
            </div>
          )}

          <ul className="lf-list-plain lf-catalogue-legend" aria-label="What the availability labels mean">
            {STATUS_FILTERS.map((s) => (
              <li key={s}><StatusBadge status={s} /> {STATUS_META[s].description}</li>
            ))}
          </ul>
          <p className="lf-meta">
            Prefer the original layout? The <a href="/catalogue">classic project catalogue</a> is preserved exactly as it was.
          </p>
        </div>
      </section>
    </>
  );
}

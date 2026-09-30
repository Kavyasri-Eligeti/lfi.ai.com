import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHero from '../../components/ui/PageHero';
import DemoCard from '../../components/ui/DemoCard';
import { demos, DEMO_GROUPS } from '../../content/demos';
import { planets } from '../../content/universe';
import { industries } from '../../content/industries';
import { STATUS, STATUS_META } from '../../content/status';
import { usePageMeta } from '../../hooks/usePageMeta';
import './demos.css';

const demoPlanets = (id) => planets.filter((p) => p.demos.includes(id)).map((p) => p.id);
const demoIndustries = (id) => industries.filter((i) => i.relatedDemos.includes(id)).map((i) => i.id);

export default function DemosPage() {
  usePageMeta('AI & Analytics Demo Catalogue', 'Every live AI and analytics demonstration built by Linkfields Innovations, with direct links.');
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const planet = params.get('planet') || '';
  const industry = params.get('industry') || '';

  const set = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true, preventScrollReset: true });
  };

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return demos.filter((d) => {
      if (planet && !demoPlanets(d.id).includes(planet)) return false;
      if (industry && !demoIndustries(d.id).includes(industry)) return false;
      if (needle && !`${d.name} ${d.description || ''}`.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [q, planet, industry]);

  const counts = useMemo(
    () => ({
      live: demos.filter((d) => d.status === STATUS.PRODUCT).length,
      internal: demos.filter((d) => d.status === STATUS.INTERNAL).length,
      poc: demos.filter((d) => d.status === STATUS.POC).length,
    }),
    []
  );

  return (
    <>
      <PageHero eyebrow="LFI AI catalogue" title="AI and analytics demo catalogue">
        <p>
          {demos.length} entries from the Linkfields Innovations catalogue: {counts.live} live demos, {counts.internal} tools that
          work only on the Linkfields network, and {counts.poc} proofs of concept. Every link below is the production link.
        </p>
      </PageHero>

      <section className="lf-section" aria-labelledby="catalogue-title">
        <div className="lf-container">
          <h2 id="catalogue-title" className="lf-visually-hidden">Catalogue</h2>
          <form className="lf-filters" role="search" onSubmit={(e) => e.preventDefault()}>
            <div className="lf-field">
              <label htmlFor="demo-q">Search</label>
              <input id="demo-q" type="search" value={q} placeholder="e.g. fraud, churn, RAG" onChange={(e) => set('q', e.target.value)} />
            </div>
            <div className="lf-field">
              <label htmlFor="demo-planet">AI category</label>
              <select id="demo-planet" value={planet} onChange={(e) => set('planet', e.target.value)}>
                <option value="">All categories</option>
                {planets.filter((p) => p.demos.length).map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="lf-field">
              <label htmlFor="demo-industry">Industry</label>
              <select id="demo-industry" value={industry} onChange={(e) => set('industry', e.target.value)}>
                <option value="">All industries</option>
                {industries.filter((i) => i.relatedDemos.length).map((i) => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </select>
            </div>
            {(q || planet || industry) && (
              <button type="button" className="lf-btn lf-btn--ghost lf-btn--sm lf-filters__reset" onClick={() => setParams({}, { replace: true })}>
                Clear filters
              </button>
            )}
          </form>

          <p className="lf-meta" role="status" aria-live="polite">
            Showing {filtered.length} of {demos.length}
          </p>

          <ul className="lf-legend" aria-label="Status legend">
            {[STATUS.PRODUCT, STATUS.INTERNAL, STATUS.POC].map((s) => (
              <li key={s}><strong>{STATUS_META[s].label}:</strong> {STATUS_META[s].description}</li>
            ))}
          </ul>

          {DEMO_GROUPS.map((group) => {
            const items = filtered.filter((d) => d.group === group.id);
            if (!items.length) return null;
            return (
              <section key={group.id} className="lf-demo-group" aria-labelledby={`group-${group.id}`}>
                <h3 id={`group-${group.id}`} className="lf-demo-group__title">{group.name}</h3>
                <div className="lf-grid">
                  {items.map((demo) => (
                    <DemoCard key={demo.id} demo={demo} headingLevel={4} />
                  ))}
                </div>
              </section>
            );
          })}

          {!filtered.length && <p>No demos match these filters.</p>}

          <aside className="lf-callout lf-demo-classic">
            <p>
              Prefer the original layout? The <a href="/catalogue">classic project catalogue</a> is preserved exactly as it was.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}

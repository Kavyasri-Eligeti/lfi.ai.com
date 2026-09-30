import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import PageHero from '../../components/ui/PageHero';
import SectionHeader from '../../components/ui/SectionHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import SmartLink from '../../components/ui/SmartLink';
import DemoCard from '../../components/ui/DemoCard';
import ProposalCard from '../../components/ui/ProposalCard';
import { corporateSolutions, ERP_INTRO, aiProductIds } from '../../content/solutions';
import { proposedSolutions } from '../../content/proposals';
import { getDemos, demos } from '../../content/demos';
import { usePageMeta } from '../../hooks/usePageMeta';
import { stagger } from '../../features/motion/tokens';
import '../content.css';

export default function SolutionsPage() {
  usePageMeta('Solutions', 'Linkfields enterprise solutions (SAP, Odoo, Microsoft Dynamics, Salesforce, iPaaS, RPA) and Linkfields AI products.');
  return (
    <>
      <PageHero eyebrow="Solutions" title="Enterprise solutions and AI products">
        <p>{ERP_INTRO}</p>
      </PageHero>

      <nav className="lf-toc" aria-label="On this page">
        <div className="lf-container">
          <ul>
            <li><a href="#corporate">Enterprise solutions</a></li>
            <li><a href="#ai-products">AI products</a></li>
            <li><a href="#proposed">Proposed AI opportunities</a></li>
          </ul>
        </div>
      </nav>

      <section className="lf-section" aria-labelledby="corporate">
        <div className="lf-container">
          <SectionHeader id="corporate" eyebrow="A · Existing corporate solutions" title="Enterprise solutions">
            Published on linkfields.com. Each card links to the full corporate page.
          </SectionHeader>
          <div className="lf-grid lf-grid--wide">
            {corporateSolutions.map((s, i) => (
              <m.article key={s.id} id={s.id} className="lf-card lf-offering" {...stagger(i)}>
                <span className="lf-card__accent" style={{ background: 'var(--lf-blue)' }} aria-hidden="true" />
                <div className="lf-card__head">
                  <h3>{s.name}</h3>
                  <StatusBadge status={s.status} />
                </div>
                <p className="lf-offering__headline">{s.headline}</p>
                <p>{s.intro}</p>
                <ul className="lf-chip-list" aria-label={`${s.name} offerings`}>
                  {s.offerings.map((o) => <li key={o} className="lf-chip">{o}</li>)}
                </ul>
                <div className="lf-card__foot">
                  <SmartLink href={s.href} className="lf-link-arrow">{s.name} on linkfields.com</SmartLink>
                </div>
              </m.article>
            ))}
          </div>
        </div>
      </section>

      <section className="lf-section lf-section--muted" aria-labelledby="ai-products">
        <div className="lf-container">
          <SectionHeader id="ai-products" eyebrow="B · Existing AI products" title="Linkfields AI products">
            Named products from the LFI AI catalogue, all with working demos.
          </SectionHeader>
          <div className="lf-grid">
            {getDemos(aiProductIds).map((d) => <DemoCard key={d.id} demo={d} />)}
          </div>
          <div className="lf-actions">
            <Link to="/demos" className="lf-btn lf-btn--primary">Full catalogue ({demos.length} entries)</Link>
          </div>
        </div>
      </section>

      <section className="lf-section" aria-labelledby="proposed">
        <div className="lf-container">
          <SectionHeader id="proposed" eyebrow="C · Proposed AI solution opportunities" title="Proposed AI solutions">
            <p>
              Research-backed opportunities under business review. <strong>These are not current Linkfields offerings.</strong>{' '}
              Where an existing demo already shows the underlying capability, it is listed as evidence.
            </p>
          </SectionHeader>
          <div className="lf-grid">
            {proposedSolutions.map((p, i) => <ProposalCard key={p.id} item={p} index={i} />)}
          </div>
        </div>
      </section>
    </>
  );
}

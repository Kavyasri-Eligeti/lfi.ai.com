import { m } from 'framer-motion';
import PageHero from '../../components/ui/PageHero';
import SectionHeader from '../../components/ui/SectionHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import SmartLink from '../../components/ui/SmartLink';
import ProposalCard from '../../components/ui/ProposalCard';
import { corporateServices } from '../../content/services';
import { proposedServices, verifiedAiCapabilities } from '../../content/proposals';
import { STATUS } from '../../content/status';
import { usePageMeta } from '../../hooks/usePageMeta';
import { stagger } from '../../features/motion/tokens';
import '../content.css';

export default function ServicesPage() {
  usePageMeta('Services', 'Linkfields services: Engineering, Consulting, Cloud, Automation, Technology, Teams and IT Infrastructure and Solutions.');
  const demoBacked = proposedServices.filter((s) => s.status === STATUS.DEMO_SUPPORTED).length;
  return (
    <>
      <PageHero eyebrow="Services" title="Services that turn technology into outcomes">
        <p>Seven service practices published by Linkfields, and a separate set of proposed AI services under review.</p>
      </PageHero>

      <nav className="lf-toc" aria-label="On this page">
        <div className="lf-container">
          <ul>
            {corporateServices.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.name}</a></li>)}
            <li><a href="#proposed-ai-services">Proposed AI services</a></li>
          </ul>
        </div>
      </nav>

      <section className="lf-section" aria-labelledby="corporate-services">
        <div className="lf-container">
          <SectionHeader id="corporate-services" eyebrow="Existing services" title="Linkfields services">
            Names, headlines and descriptions as published on linkfields.com.
          </SectionHeader>
          <div className="lf-service-list">
            {corporateServices.map((s, i) => (
              <m.article key={s.id} id={s.id} className="lf-service" {...stagger(i, 0.03)}>
                <div className="lf-service__head">
                  <p className="lf-service__index" aria-hidden="true">{String(i + 1).padStart(2, '0')}</p>
                  <div>
                    <h3>{s.name}</h3>
                    <p className="lf-offering__headline">{s.headline}</p>
                    <StatusBadge status={s.status} />
                  </div>
                </div>
                <div className="lf-service__body">
                  {s.intro && <p>{s.intro}</p>}
                  <ul className="lf-sub-services">
                    {s.subServices.map((sub) => (
                      <li key={sub.name}>
                        <h4>{sub.name}</h4>
                        {sub.text && <p>{sub.text}</p>}
                      </li>
                    ))}
                  </ul>
                  <SmartLink href={s.href} className="lf-link-arrow">{s.name} on linkfields.com</SmartLink>
                </div>
              </m.article>
            ))}
          </div>
        </div>
      </section>

      <section className="lf-section lf-section--muted" aria-labelledby="proposed-ai-services">
        <div className="lf-container">
          <SectionHeader id="proposed-ai-services" eyebrow="Proposed · awaiting business approval" title="Proposed AI services">
            <p>
              {proposedServices.length} proposed AI service areas. {demoBacked} are backed by an existing Linkfields demo that shows
              the underlying capability. <strong>None of them is a current offering until approved.</strong>
            </p>
          </SectionHeader>

          <div className="lf-callout lf-verified-note">
            <p>
              <strong>Already published by Linkfields:</strong>{' '}
              {verifiedAiCapabilities.map((c, i) => (
                <span key={c.name}>
                  {i > 0 && ' · '}
                  <a href={`#${c.serviceId}`}>{c.name}</a>
                </span>
              ))}
              . These are existing services, not proposals.
            </p>
          </div>

          <div className="lf-grid">
            {proposedServices.map((p, i) => <ProposalCard key={p.id} item={p} index={i} />)}
          </div>
        </div>
      </section>
    </>
  );
}

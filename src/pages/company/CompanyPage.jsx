import { useState } from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import PageHero from '../../components/ui/PageHero';
import SectionHeader from '../../components/ui/SectionHeader';
import SmartLink from '../../components/ui/SmartLink';
import OfficeList from '../../components/ui/OfficeList';
import OfficeGlobe, { useGlobeEnabled } from '../../features/globe/OfficeGlobe';
import { company, offices, partners } from '../../content/company';
import { usePageMeta } from '../../hooks/usePageMeta';
import { stagger, reveal } from '../../features/motion/tokens';
import '../content.css';

export default function CompanyPage() {
  usePageMeta('Company', company.vision);
  const [activeOffice, setActiveOffice] = useState(null);
  const globeEnabled = useGlobeEnabled();

  return (
    <>
      <PageHero eyebrow="Company" title={company.hero.title}>
        <p>{company.hero.text}</p>
      </PageHero>

      <nav className="lf-toc" aria-label="On this page">
        <div className="lf-container">
          <ul>
            <li><a href="#about">About us</a></li>
            <li><a href="#vision">Vision and mission</a></li>
            <li><a href="#values">Values</a></li>
            <li><a href="#approach">Our approach</a></li>
            <li><a href="#presence">Global presence</a></li>
            <li><a href="#partners">Partners</a></li>
          </ul>
        </div>
      </nav>

      <section className="lf-section" aria-labelledby="about">
        <div className="lf-container lf-split">
          <SectionHeader id="about" eyebrow={`Since ${company.founded}`} title="About Linkfields">
            {company.history}
          </SectionHeader>
          <ul className="lf-stats">
            {company.recognition.map((r, i) => (
              <m.li key={r.label} {...stagger(i)}>
                <strong>{r.value}</strong>
                <span>{r.label}</span>
              </m.li>
            ))}
          </ul>
        </div>
      </section>

      <section className="lf-section lf-section--muted" aria-labelledby="vision">
        <div className="lf-container">
          <h2 id="vision" className="lf-visually-hidden">Vision and mission</h2>
          <div className="lf-vm">
            <m.article {...reveal}>
              <p className="lf-eyebrow">Vision</p>
              <p>{company.vision}</p>
            </m.article>
            <m.article {...stagger(1)}>
              <p className="lf-eyebrow">Mission</p>
              <p>{company.mission}</p>
            </m.article>
          </div>
        </div>
      </section>

      <section className="lf-section" aria-labelledby="values">
        <div className="lf-container">
          <SectionHeader id="values" eyebrow="Values" title="What we stand for" />
          <ul className="lf-values">
            {company.values.map((v, i) => (
              <m.li key={v.name} {...stagger(i)}>
                <h3>{v.name}</h3>
                <p>{v.text}</p>
              </m.li>
            ))}
          </ul>
        </div>
      </section>

      <section className="lf-section lf-section--muted" aria-labelledby="approach">
        <div className="lf-container lf-split">
          <SectionHeader id="approach" eyebrow="Our approach" title={company.approach.title}>
            {company.approach.text}
          </SectionHeader>
          <ol className="lf-principles">
            {company.approach.principles.map((p) => (
              <li key={p.name}>
                <div>
                  <h3>{p.name}</h3>
                  <p>{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="lf-section lf-section--dark lf-dark" aria-labelledby="presence">
        <div className="lf-container">
          <SectionHeader id="presence" eyebrow="Global presence" title={`${offices.length} offices, four continents`}>
            Office addresses as published on linkfields.com. Globe markers show approximate city locations.
          </SectionHeader>
          <div className="lf-globe-layout">
            <OfficeGlobe offices={offices} activeId={activeOffice} />
            <OfficeList offices={offices} activeId={activeOffice} onFocusOffice={globeEnabled ? setActiveOffice : undefined} />
          </div>
        </div>
      </section>

      <section className="lf-section" aria-labelledby="partners">
        <div className="lf-container">
          <SectionHeader id="partners" eyebrow="Partners" title="Technology partners">
            Partners listed on linkfields.com.
          </SectionHeader>
          <ul className="lf-partners">
            {partners.map((p) => <li key={p}>{p}</li>)}
          </ul>
          <div className="lf-actions">
            <SmartLink href={company.links.blog} className="lf-btn lf-btn--ghost">Linkfields blog</SmartLink>
            <SmartLink href={company.links.news} className="lf-btn lf-btn--ghost">News and articles</SmartLink>
            <Link to="/careers" className="lf-btn lf-btn--primary">Join the team</Link>
          </div>
        </div>
      </section>
    </>
  );
}

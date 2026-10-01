import { useRef } from 'react';
import { Link } from 'react-router-dom';
import ModularField from '../../features/field/ModularField';
import SectionHeader from '../../components/ui/SectionHeader';
import SmartLink from '../../components/ui/SmartLink';
import SocialIcon from '../../components/ui/SocialIcon';
import { Arrow } from '../../components/ui/Icon';
import CapabilityIndex from '../../components/sections/CapabilityIndex';
import FeaturedBento from '../../components/sections/FeaturedBento';
import IndustryTabs from '../../components/sections/IndustryTabs';
import PartnerWall from '../../components/sections/PartnerWall';
import OfficeMap from '../../components/sections/OfficeMap';
import CareersBand from '../../components/sections/CareersBand';
import InsightsList from '../../components/sections/InsightsList';
import ContactBand from '../../components/sections/ContactBand';
import { company, offices, socials } from '../../content/company';
import { demos } from '../../content/demos';
import { capabilities } from '../../content/capabilities';
import { industries } from '../../content/industries';
import { corporateServices } from '../../content/services';
import { usePageMeta } from '../../hooks/usePageMeta';
import './home.css';
import Reveal from '../../features/motion/Reveal';

// Verified AI-related capabilities inside the published services.
const AI_IN_SERVICES = [
  { service: 'technology', sub: 'AI & Machine Learning' },
  { service: 'technology', sub: 'Big Data Engineering' },
  { service: 'automation', sub: 'Robotic Process Automation' },
];

export default function HomePage() {
  usePageMeta(
    null,
    'Linkfields AI: live AI and analytics demos, enterprise AI solutions and engineering services from Linkfields Innovations, for banking, telecom, insurance and more.'
  );
  const heroRef = useRef(null);
  const proof = [
    { value: demos.length, label: 'AI and analytics demos' },
    { value: capabilities.length, label: 'AI capability areas' },
    { value: industries.length, label: 'industries served' },
    { value: offices.length, label: 'offices worldwide' },
    { value: company.founded, label: 'established' },
  ];
  const aiServices = AI_IN_SERVICES.map(({ service, sub }) => {
    const s = corporateServices.find((x) => x.id === service);
    return { service: s, sub: s.subServices.find((x) => x.name === sub) };
  });

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="lf-hero" ref={heroRef} aria-labelledby="hero-title">
        <div className="lf-container lf-hero__inner">
          <div className="lf-hero__copy">
            <p className="lf-eyebrow lf-hero__kicker">Linkfields AI</p>
            <h1 id="hero-title" className="lf-hero__title">
              Intelligence that <span className="lf-accent">moves business</span> forward.
            </h1>
            <p className="lf-hero__lead">
              Explore the AI solutions, live demos and engineering services Linkfields Innovations builds for banking, telecom,
              insurance and other industries.
            </p>
            <div className="lf-actions">
              <Link to="/solutions" className="lf-btn">Explore AI solutions <Arrow /></Link>
              <Link to="/contact" className="lf-btn lf-btn--secondary">Talk to our team</Link>
            </div>
          </div>
          <ModularField interactRef={heroRef} className="lf-hero__field" />
        </div>
        <div className="lf-container">
          <dl className="lf-hero__proof">
            {proof.map((p) => (
              <div key={p.label}>
                <dt className="lf-visually-hidden">{p.label}</dt>
                <dd>
                  <span className="lf-hero__proof-value lf-num">{p.value}</span>
                  <span className="lf-hero__proof-label">{p.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- AI capabilities ---------- */}
      <section className="lf-section" aria-labelledby="capabilities-title">
        <div className="lf-container">
          <SectionHeader split id="capabilities-title" eyebrow="AI capabilities" title="Six capability areas, each backed by working demos">
            Every area below is shown by demos you can open today. Select one to see its products.
          </SectionHeader>
          <CapabilityIndex />
        </div>
      </section>

      {/* ---------- Featured solutions ---------- */}
      <section className="lf-section lf-section--tint" aria-labelledby="featured-title">
        <div className="lf-container">
          <SectionHeader
            split
            id="featured-title"
            eyebrow="Featured solutions"
            title="Flagship AI products"
            aside={
              <Link to="/solutions#products" className="lf-link lf-home__aside-link">
                See all {demos.length} demos <Arrow />
              </Link>
            }
          >
            Retrieval-augmented assistants, document intelligence and the analytics models behind fraud, risk and forecasting.
          </SectionHeader>
          <FeaturedBento />
        </div>
      </section>

      {/* ---------- Enterprise services ---------- */}
      <section className="lf-section" aria-labelledby="services-title">
        <div className="lf-container">
          <SectionHeader split id="services-title" eyebrow="Enterprise services" title="AI built on seven engineering practices">
            Linkfields AI work draws on the company’s published services. Three of them deal directly with AI, data and automation.
          </SectionHeader>
          <div className="lf-home-services">
            <ul className="lf-list-plain lf-home-services__ai">
              {aiServices.map(({ service, sub }, i) => (
                <Reveal as="li" key={sub.name} index={i}>
                  <article className="lf-card lf-card--tint lf-card--interactive lf-home-services__card">
                    <p className="lf-eyebrow">{service.name} service</p>
                    <h3>
                      <SmartLink href={sub.href} className="lf-card__stretch">{sub.name}</SmartLink>
                    </h3>
                    <p className="lf-home-services__tagline">{sub.tagline}</p>
                    <p>{sub.summary}</p>
                  </article>
                </Reveal>
              ))}
            </ul>
            <nav className="lf-home-services__all" aria-label="All services">
              <p className="lf-eyebrow">All services</p>
              <ul className="lf-list-plain">
                {corporateServices.map((s) => (
                  <li key={s.id}>
                    <Link to={`/services#${s.id}`}>
                      <span>{s.name}</span>
                      <span className="lf-home-services__hint">{s.overview.title}</span>
                      <Arrow />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </section>

      {/* ---------- Industries ---------- */}
      <section className="lf-section lf-cv lf-section--tint" aria-labelledby="industries-title">
        <div className="lf-container">
          <SectionHeader split id="industries-title" eyebrow="Industries" title="Built for the industries Linkfields knows">
            Eight industries, with the demos the catalogue files under each.
          </SectionHeader>
          <IndustryTabs />
        </div>
      </section>

      {/* ---------- Partners ---------- */}
      <section className="lf-section lf-cv" aria-labelledby="partners-title">
        <div className="lf-container">
          <div className="lf-partners-layout">
            <SectionHeader id="partners-title" eyebrow="Our partners" title="Working with the platforms enterprises run on">
              Technology partners as listed by Linkfields Innovations.
            </SectionHeader>
            <PartnerWall />
          </div>
          <ul className="lf-list-plain lf-home-recognition" aria-label="Recognition">
            {company.recognition.filter((r) => r.value !== '2008').map((r) => (
              <li key={r.label}>
                {r.image ? <img src={r.image} alt="" width="40" height="40" loading="lazy" /> : <span className="lf-home-recognition__mark">{r.value}</span>}
                {r.href ? <SmartLink href={r.href}>{r.label}</SmartLink> : <span>{r.label}</span>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Global presence ---------- */}
      <section className="lf-section lf-cv lf-section--tint" aria-labelledby="presence-title" id="offices">
        <div className="lf-container">
          <SectionHeader split id="presence-title" eyebrow="Global presence" title="Six offices on four continents">
            Founded in South Africa in 2008. Today Linkfields has offices in South Africa, India, the USA, the UAE, Australia and Botswana.
          </SectionHeader>
          <OfficeMap />
        </div>
      </section>

      {/* ---------- Careers ---------- */}
      <section className="lf-section lf-cv" aria-labelledby="careers-title">
        <div className="lf-container">
          <CareersBand id="careers-title" />
        </div>
      </section>

      {/* ---------- Latest updates and social ---------- */}
      <section className="lf-section lf-cv lf-section--tint" aria-labelledby="insights-title">
        <div className="lf-container">
          <SectionHeader
            split
            id="insights-title"
            eyebrow="Latest updates"
            title="Insights and news"
            aside={
              <ul className="lf-list-plain lf-home-social" aria-label="Follow Linkfields">
                {socials.map((s) => (
                  <li key={s.id}>
                    <SmartLink href={s.href} className="lf-home-social__link">
                      <SocialIcon id={s.id} size={18} />
                      <span>{s.name}</span>
                    </SmartLink>
                  </li>
                ))}
              </ul>
            }
          >
            Articles and press coverage published by Linkfields. Follow the company for the latest updates.
          </SectionHeader>
          <InsightsList limit={6} />
        </div>
      </section>

      <ContactBand />
    </>
  );
}

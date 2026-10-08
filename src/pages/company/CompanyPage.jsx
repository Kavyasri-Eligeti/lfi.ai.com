import PageHero from '../../components/ui/PageHero';
import SectionHeader from '../../components/ui/SectionHeader';
import SmartLink from '../../components/ui/SmartLink';
import { Arrow } from '../../components/ui/Icon';
import PartnerWall from '../../components/sections/PartnerWall';
import RecognitionWall from '../../components/sections/RecognitionWall';
import OfficeMap from '../../components/sections/OfficeMap';
import InsightsList from '../../components/sections/InsightsList';
import { company, offices } from '../../content/company';
import { usePageMeta } from '../../hooks/usePageMeta';
import './company.css';
import Reveal from '../../features/motion/Reveal';

// Only dated facts published by Linkfields.
const milestones = [
  { year: '2008', title: 'Established in South Africa', text: company.history },
  {
    year: '2023',
    title: 'Ranked 38th in Africa',
    text: 'Linkfields Innovations ranked 38th in Financial Times and Statista’s 2023 list of Africa’s top 100 fastest-growing companies.',
    href: 'https://www.ft.com/africas-fastest-growing-companies-2023',
  },
  { year: 'Today', title: `${offices.length} offices worldwide`, text: offices.map((o) => o.country).join(' · ') },
];

export default function CompanyPage() {
  usePageMeta('Company', 'About Linkfields Innovations: story, vision, mission, values, approach, partners and global offices.');
  return (
    <>
      <PageHero
        eyebrow="About Linkfields"
        title={company.hero.title}
        actions={
          <>
            <a href="#offices" className="lf-btn">Global presence <Arrow /></a>
            <a href="#values" className="lf-btn lf-btn--secondary">Our values</a>
          </>
        }
      >
        <p className="lf-lead">{company.hero.text}</p>
      </PageHero>

      {/* ---------- Story and milestones ---------- */}
      <section className="lf-section" aria-labelledby="story-title">
        <div className="lf-container lf-story">
          <Reveal as="div" className="lf-story__lede">
            <p className="lf-eyebrow">Our story</p>
            <h2 id="story-title">{company.about.storyTitle}</h2>
          </Reveal>
          <ol className="lf-list-plain lf-milestones">
            {milestones.map((ms, i) => (
              <Reveal as="li" key={ms.year} className="lf-milestone" index={i} step={0.08}>
                <span className="lf-milestone__year lf-num">{ms.year}</span>
                <div>
                  <h3>{ms.title}</h3>
                  <p>{ms.text}</p>
                  {ms.href && <SmartLink href={ms.href} className="lf-link">Financial Times ranking <Arrow /></SmartLink>}
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Vision and mission ---------- */}
      <section className="lf-section lf-section--tint" aria-label="Vision and mission">
        <div className="lf-container lf-vm">
          <Reveal as="article" className="lf-vm__card lf-vm__card--vision" index={0}>
            <p className="lf-eyebrow">Our vision</p>
            <p className="lf-vm__text">{company.vision}</p>
          </Reveal>
          <Reveal as="article" className="lf-vm__card lf-vm__card--mission lf-ink" index={1}>
            <p className="lf-eyebrow">Our mission</p>
            <p className="lf-vm__text">{company.mission}</p>
          </Reveal>
        </div>
      </section>

      {/* ---------- Values ---------- */}
      <section className="lf-section" id="values" aria-labelledby="values-title">
        <div className="lf-container">
          <SectionHeader split id="values-title" eyebrow="Our values" title={company.valuesTitle}>
            Six values Linkfields Innovations works by.
          </SectionHeader>
          <ul className="lf-list-plain lf-values">
            {company.values.map((v, i) => (
              <Reveal as="li" key={v.name} className="lf-value" index={i} step={0.05}>
                <span className="lf-value__module" aria-hidden="true" />
                <h3>{v.name}</h3>
                <p>{v.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Approach ---------- */}
      <section className="lf-section lf-section--ink lf-ink" aria-labelledby="approach-title">
        <div className="lf-container">
          <SectionHeader split id="approach-title" eyebrow={`Our approach · ${company.approach.tagline}`} title={company.approach.title}>
            {company.approach.text}
          </SectionHeader>
          <ul className="lf-list-plain lf-principles">
            {company.approach.principles.map((p, i) => (
              <Reveal as="li" key={p} index={i}>{p}</Reveal>
            ))}
          </ul>
          <h3 className="lf-recipe__title">{company.approach.recipeTitle}</h3>
          <ol className="lf-list-plain lf-recipe">
            {company.approach.recipe.map((step, i) => (
              <Reveal as="li" key={step.slice(0, 24)} index={i} step={0.08}>
                <span className="lf-recipe__step lf-num">Step {i + 1}</span>
                <p>{step}</p>
              </Reveal>
            ))}
          </ol>
          <SmartLink href={company.links.approach} className="lf-link lf-recipe__more">Our approach on linkfields.com <Arrow /></SmartLink>
        </div>
      </section>

      {/* ---------- Partners and recognition ---------- */}
      <section className="lf-section" id="partners" aria-labelledby="partners-title">
        <div className="lf-container">
          <div className="lf-partners-layout">
            <SectionHeader id="partners-title" eyebrow="Our partners" title="Partners and recognition">
              Technology partners as listed by Linkfields, and the certifications and recognition the company publishes.
            </SectionHeader>
            <PartnerWall />
          </div>
          <RecognitionWall memberships />
        </div>
      </section>

      {/* ---------- Global presence ---------- */}
      <section className="lf-section lf-section--tint" id="offices" aria-labelledby="offices-title">
        <div className="lf-container">
          <SectionHeader split id="offices-title" eyebrow="Global presence" title="Where to find Linkfields">
            Select an office for its published address, phone numbers and directions.
          </SectionHeader>
          <OfficeMap />
        </div>
      </section>

      {/* ---------- CSR ---------- */}
      <section className="lf-section" aria-labelledby="csr-title">
        <div className="lf-container lf-csr">
          <Reveal as="div">
            <p className="lf-eyebrow">Corporate social responsibility</p>
            <h2 id="csr-title">{company.csr.title}</h2>
          </Reveal>
          <Reveal as="p" className="lf-lead">{company.csr.text}</Reveal>
        </div>
      </section>

      {/* ---------- Insights ---------- */}
      <section className="lf-section lf-section--tint" id="insights" aria-labelledby="insights-title">
        <div className="lf-container">
          <SectionHeader
            split
            id="insights-title"
            eyebrow="Insights and updates"
            title="News and articles"
            aside={<SmartLink href={company.links.news} className="lf-link">All news on linkfields.com <Arrow /></SmartLink>}
          />
          <InsightsList />
        </div>
      </section>
    </>
  );
}

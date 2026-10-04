import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { m, useScroll, useTransform } from 'framer-motion';
import AILogo from '../../components/brand/AILogo';
import GlitchText from '../../components/fx/GlitchText';
import SectionHeader from '../../components/ui/SectionHeader';
import SmartLink from '../../components/ui/SmartLink';
import { Arrow } from '../../components/ui/Icon';
import FeaturedBento from '../../components/sections/FeaturedBento';
import PartnerWall from '../../components/sections/PartnerWall';
import CardTheatre from '../../features/theatre/CardTheatre';
import { canUseTheatre } from '../../features/theatre/TheatreStage';
import { useMotion } from '../../features/motion/MotionProvider';
import { CARD_FILTERS, FEATURED, HOME_CARDS } from '../../content/theatreCards';
import { company, offices } from '../../content/company';
import { demos } from '../../content/demos';
import { usePageMeta } from '../../hooks/usePageMeta';
import './home.css';
import './theatre.css';

export default function HomePage() {
  usePageMeta(
    null,
    'Linkfields AI: AI solutions, AI services and live AI demos from Linkfields Innovations, for banking, telecom, insurance and more.'
  );
  const { reduced } = useMotion();
  const intro = useRef(null);
  const statement = useRef(null);
  const before = useMemo(() => ({ intro, statement }), []);
  // 'theatre' (WebGL) where the device can run it, otherwise the DOM 'deck'.
  const [mode, setMode] = useState(() => (!reduced && canUseTheatre() ? 'theatre' : 'deck'));
  const theatre = mode === 'theatre';

  // The statement hands over to the cards: it lifts and fades as they rise.
  const { scrollYProgress: statementP } = useScroll({ target: statement, offset: ['start start', 'end end'] });
  const statementOpacity = useTransform(statementP, [0.74, 0.9], [1, 0]);
  const statementY = useTransform(statementP, [0.74, 0.95], [0, -80]);

  return (
    <div className={`th${theatre ? ' is-theatre' : ''}`}>
      {/* ---------- 1. Intro ---------- */}
      <section ref={intro} className="th-intro" aria-label="Linkfields AI">
        {!theatre && (
          <div className="th-intro__mark">
            <AILogo size={200} intro />
          </div>
        )}
        <p className="th-scroll" aria-hidden="true">Scroll down</p>
      </section>

      {/* ---------- 2. Statement ---------- */}
      <section ref={statement} className="th-statement" aria-labelledby="hero-title">
        <div className="th-sticky">
          <m.div className="th-statement__grid" style={theatre ? { opacity: statementOpacity, y: statementY } : undefined}>
            <h1 id="hero-title" className="th-statement__title">
              <GlitchText text="Intelligence that moves business forward." />
            </h1>
            <div className="th-statement__copy">
              <p><GlitchText text={`Founded in ${company.founded}`} delay={200} duration={700} /></p>
              <p>
                We blend AI, data and engineering as an in-house team across {offices.length} offices on four continents.
              </p>
              <p>
                Our AI solutions, AI services and live demos deliver results for banking, telecom, insurance and more.
              </p>
              <div className="lf-actions">
                <Link to="/solutions" className="lf-btn">Explore AI solutions <Arrow /></Link>
                <Link to="/contact" className="lf-btn lf-btn--secondary">Talk to our team</Link>
              </div>
            </div>
          </m.div>
        </div>
      </section>

      {/* ---------- 3. Work: the card theatre ---------- */}
      <CardTheatre
        id="work"
        cards={HOME_CARDS}
        featured={FEATURED}
        filters={CARD_FILTERS}
        withMark
        before={before}
        onModeChange={setMode}
        label="Linkfields AI solutions, services, industries and tools"
      />

      {/* ---------- Flagship products and partners ---------- */}
      <section className="lf-section" aria-labelledby="featured-title">
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

      <section className="lf-section" aria-labelledby="partners-title">
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
    </div>
  );
}

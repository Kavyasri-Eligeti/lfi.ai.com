import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AILogo from '../../components/brand/AILogo';
import GlitchText from '../../components/fx/GlitchText';
import SectionHeader from '../../components/ui/SectionHeader';
import { Arrow } from '../../components/ui/Icon';
import FeaturedBento from '../../components/sections/FeaturedBento';
import PartnerWall from '../../components/sections/PartnerWall';
import RecognitionWall from '../../components/sections/RecognitionWall';
import TheatreStage, { canUseTheatre } from '../../features/theatre/TheatreStage';
import { useMotion } from '../../features/motion/MotionProvider';
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
  // The 3D stage reads its timeline from the intro and statement sections.
  const sections = useMemo(() => ({ get current() { return { intro: intro.current, statement: statement.current }; } }), []);
  // The 3D ring (WebGL) where the device can run it, otherwise the DOM logo.
  const [theatre, setTheatre] = useState(() => !reduced && canUseTheatre());
  // The DOM logo shows at once, so the intro is never empty; it hands over to
  // the 3D ring as soon as the ring is drawing.
  const [ringReady, setRingReady] = useState(false);

  return (
    <div className={`th${theatre ? ' is-theatre' : ''}${ringReady ? ' is-ring-ready' : ''}`}>
      {theatre && <TheatreStage sections={sections} onReady={() => setRingReady(true)} onFail={() => setTheatre(false)} />}

      {/* ---------- 1. Intro ---------- */}
      <section ref={intro} className="th-intro" aria-label="Linkfields AI">
        <div className="th-intro__fallback">
          <div className="th-intro__mark">
            <AILogo size={200} intro />
          </div>
        </div>
        <p className="th-scroll" aria-hidden="true">Scroll down</p>
      </section>

      {/* ---------- 2. Statement ---------- */}
      <section ref={statement} className="th-statement" aria-labelledby="hero-title">
        <div className="th-sticky">
          <div className="th-statement__grid">
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
          </div>
        </div>
      </section>

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
          <RecognitionWall items={company.recognition.filter((r) => r.value !== '2008')} />
        </div>
      </section>
    </div>
  );
}

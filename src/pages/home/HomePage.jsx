import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { m, useScroll, useTransform } from 'framer-motion';
import GlitchText from '../../components/fx/GlitchText';
import SectionHeader from '../../components/ui/SectionHeader';
import { Arrow } from '../../components/ui/Icon';
import FeaturedBento from '../../components/sections/FeaturedBento';
import PartnerWall from '../../components/sections/PartnerWall';
import RecognitionWall from '../../components/sections/RecognitionWall';
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
  const hero = useRef(null);
  const before = useMemo(() => ({ hero }), []);
  // 'theatre' (WebGL) where the device can run it, otherwise the DOM 'deck'.
  const [mode, setMode] = useState(() => (!reduced && canUseTheatre() ? 'theatre' : 'deck'));
  // Whether the WebGL stage (the DNA hero) is live; otherwise the hero keeps a still.
  const [stage, setStage] = useState(false);
  const theatre = mode === 'theatre';

  // The hero copy hands over to the cards: it lifts and fades as the DNA
  // theatre scrolls in behind it.
  const { scrollYProgress: heroP } = useScroll({ target: hero, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(heroP, [0.2, 0.75], [1, 0]);
  const heroY = useTransform(heroP, [0.2, 0.9], [0, -70]);

  return (
    <div className={`th${theatre ? ' is-theatre' : ''}${stage ? ' has-stage' : ''}`}>
      {/* ---------- 1. The DNA hero ---------- */}
      <section ref={hero} className={`th-hero${stage ? '' : ' th-hero--still'}`} aria-labelledby="hero-title">
        <m.div className="th-hero__inner" style={theatre ? { opacity: heroOpacity, y: heroY } : undefined}>
          <div className="th-hero__copy">
            <h1 id="hero-title" className="th-hero__title">
              <GlitchText text="Intelligence that moves business forward." />
            </h1>
            <div className="th-hero__text">
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
          {/* The DNA stands here, on the fixed stage behind the page. */}
          <div className="th-hero__visual" aria-hidden="true" />
        </m.div>
        <p className="th-scroll" aria-hidden="true">Scroll down</p>
      </section>

      {/* ---------- 2. Work: the card theatre ---------- */}
      <CardTheatre
        id="work"
        cards={HOME_CARDS}
        featured={FEATURED}
        filters={CARD_FILTERS}
        withHero
        before={before}
        onModeChange={setMode}
        onStage={setStage}
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
          <RecognitionWall items={company.recognition.filter((r) => r.value !== '2008')} />
        </div>
      </section>
    </div>
  );
}

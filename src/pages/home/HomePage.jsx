import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../../components/ui/SectionHeader';
import { Arrow } from '../../components/ui/Icon';
import FeaturedBento from '../../components/sections/FeaturedBento';
import PartnerWall from '../../components/sections/PartnerWall';
import RecognitionWall from '../../components/sections/RecognitionWall';
import ScrollWords from '../../components/mercury/ScrollWords';
import Reveal from '../../features/motion/Reveal';
import { company, offices, partners } from '../../content/company';
import { careers } from '../../content/careers';
import { demos } from '../../content/demos';
import { usePageMeta } from '../../hooks/usePageMeta';
import AILogo from '../../components/brand/AILogo';
import GlitchText from '../../components/fx/GlitchText';
import TheatreStage, { canUseTheatre } from '../../features/theatre/TheatreStage';
import { useMotion } from '../../features/motion/MotionProvider';
import DeskHero from './DeskHero';
import HeroFill from './HeroFill';
import './home.css';
import './theatre.css';

/**
 * The page background follows the section in view (ink, beige), with the
 * reference's half-second colour change; the header reads the same tone.
 */
function useTone(root) {
  const [tone, setTone] = useState('ink');
  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setTone(e.target.dataset.tone)),
      { rootMargin: '-50% 0px -50% 0px' }
    );
    el.querySelectorAll('[data-tone]').forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [root]);
  useEffect(() => {
    document.documentElement.dataset.tone = tone;
    return () => { delete document.documentElement.dataset.tone; };
  }, [tone]);
  return tone;
}

/**
 * After the laptop: the homepage theatre from lfi-website-latest. The AI ring
 * draws in, comes forward as you scroll, and towers through the statement.
 */
function Theatre() {
  const { reduced } = useMotion();
  const intro = useRef(null);
  const statement = useRef(null);
  // The 3D stage reads its timeline from the intro and statement sections.
  const sections = useMemo(() => ({ get current() { return { intro: intro.current, statement: statement.current }; } }), []);
  const [theatre, setTheatre] = useState(() => !reduced && canUseTheatre());
  const [ringReady, setRingReady] = useState(false);

  return (
    <div className={`th${theatre ? ' is-theatre' : ''}${ringReady ? ' is-ring-ready' : ''}`} data-tone="ink">
      <HeroFill />
      {theatre && <TheatreStage sections={sections} onReady={() => setRingReady(true)} onFail={() => setTheatre(false)} />}

      <section ref={intro} className="th-intro" aria-label="Linkfields AI">
        <div className="th-intro__fallback">
          <div className="th-intro__mark">
            <AILogo size={200} intro />
          </div>
        </div>
        <p className="th-scroll" aria-hidden="true">Scroll down</p>
      </section>

      <section ref={statement} className="th-statement" aria-labelledby="statement-title">
        <div className="th-sticky">
          <div className="th-statement__grid">
            <h2 id="statement-title" className="th-statement__title">
              <GlitchText text="Intelligence that moves business forward." />
            </h2>
            <div className="th-statement__copy">
              <p><GlitchText text={`Founded in ${company.founded}`} delay={200} duration={700} /></p>
              <p>We blend AI, data and engineering as an in-house team across {offices.length} offices on four continents.</p>
              <p>Our AI solutions, AI services and live demos deliver results for banking, telecom, insurance and more.</p>
              <div className="lf-actions">
                <Link to="/solutions" className="lf-btn">Explore AI solutions <Arrow /></Link>
                <Link to="/contact" className="lf-btn lf-btn--secondary">Talk to our team</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function HomePage() {
  usePageMeta(
    null,
    'Linkfields AI: AI solutions, AI services and live AI demos from Linkfields Innovations, for banking, telecom, insurance and more.'
  );
  const root = useRef(null);
  const tone = useTone(root);

  return (
    <div ref={root} className="mh" data-page-tone={tone}>
      <DeskHero />
      <Theatre />

      {/* Flagship products */}
      <section className="lf-section" data-tone="ink" aria-labelledby="featured-title">
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

      {/* Partners, figures, recognition */}
      <section className="mh-sec" data-tone="ink" aria-labelledby="partners-title">
        <div className="lf-container">
          <div className="mh-center mh-lt">
            <ScrollWords id="lt-title" className="mh-h1" text={`Engineering for business since ${company.founded}. Built to last.`} />
          </div>
          <dl className="mh-stats">
            {[
              { v: String(company.founded), l: `Established in ${company.foundedIn}` },
              { v: String(offices.length), l: 'Offices on four continents' },
              { v: '38th', l: 'Africa’s fastest-growing companies, FT 2023' },
              { v: String(partners.length), l: 'Technology partners' },
            ].map((s, i) => (
              <Reveal key={s.l} className="mh-stats__item" index={i} step={0.08}>
                <dt className="mh-stats__v">{s.v}</dt>
                <dd className="mh-stats__l">{s.l}</dd>
              </Reveal>
            ))}
          </dl>
          <div className="lf-partners-layout">
            <SectionHeader id="partners-title" eyebrow="Our partners" title="Working with the platforms enterprises run on">
              Technology partners as listed by Linkfields Innovations.
            </SectionHeader>
            <PartnerWall />
          </div>
          <RecognitionWall items={company.recognition.filter((r) => r.value !== '2008')} />
        </div>
      </section>

      {/* Closing call */}
      <section className="mh-sec mh-final" data-tone="ink" aria-labelledby="final-title">
        <div className="lf-container mh-center">
          <Reveal as="h2" id="final-title" className="mh-h1 mh-final__title">Let’s talk about what you want to build</Reveal>
          <Reveal className="mh-final__cta" index={1}>
            <Link to="/contact" className="lf-btn">Talk to our team</Link>
            <Link to="/solutions" className="lf-btn lf-btn--secondary">Explore AI solutions</Link>
          </Reveal>
          <div className="mh-final__cards">
            <Reveal className="mh-final__card">
              <h3>Linkfields AI demos</h3>
              <p>{demos.length} entries in the LFI AI catalogue: assistants, document intelligence and analytics you can open today.</p>
              <Link to="/solutions#products" className="lf-btn lf-btn--secondary lf-btn--sm">Explore demos</Link>
            </Reveal>
            <Reveal className="mh-final__card" index={1}>
              <h3>{careers.title}</h3>
              <p>{careers.intro}</p>
              <Link to="/careers" className="lf-btn lf-btn--secondary lf-btn--sm">See careers</Link>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}

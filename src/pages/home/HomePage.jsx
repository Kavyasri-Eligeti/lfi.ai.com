import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { useUniverse } from '../../features/universe/UniverseContext';
import { usePageMeta } from '../../hooks/usePageMeta';
import { reveal, stagger } from '../../features/motion/tokens';
import SectionHeader from '../../components/ui/SectionHeader';
import UniverseIndex from '../../components/ui/UniverseIndex';
import DemoCard from '../../components/ui/DemoCard';
import SmartLink from '../../components/ui/SmartLink';
import { planets } from '../../content/universe';
import { corporateSolutions, ERP_INTRO, aiProductIds } from '../../content/solutions';
import { corporateServices } from '../../content/services';
import { industries } from '../../content/industries';
import { company, offices, emails } from '../../content/company';
import { careers } from '../../content/careers';
import { getDemos, demos } from '../../content/demos';
import './home.css';

const CHAPTERS = 4; // hero(0) → solutions(1) → services(2) → industries(3) → outro(4)

/**
 * Home: native scrolling drives the camera through selected scenes only
 * (hero → Solutions → Services → Industries). No scroll-jacking: the page scrolls
 * normally, the camera follows. Every chapter is real HTML content with links.
 */
export default function HomePage() {
  usePageMeta(
    null,
    'Explore Linkfields Innovations’ AI universe: live AI and analytics demos, enterprise solutions, services and industries.'
  );
  const { setScrollProgress, setSuspended, profile } = useUniverse();
  const cinematicRef = useRef(null);
  const anchorsRef = useRef([]);

  useEffect(() => {
    const root = cinematicRef.current;
    if (!root) return undefined;
    const marks = Array.from(root.querySelectorAll('[data-chapter]'));

    const measure = () => {
      const vh = window.innerHeight;
      anchorsRef.current = marks.map((el, i) => {
        const r = el.getBoundingClientRect();
        const top = r.top + window.scrollY;
        if (i === 0) return 0;
        if (i === marks.length - 1) return top + r.height - vh;
        return top + r.height / 2 - vh / 2;
      });
    };

    let frame = 0;
    const update = () => {
      frame = 0;
      const a = anchorsRef.current;
      const y = window.scrollY;
      let p = CHAPTERS;
      for (let k = 0; k < a.length - 1; k++) {
        if (y < a[k + 1]) {
          p = k + Math.max(0, (y - a[k]) / Math.max(1, a[k + 1] - a[k]));
          break;
        }
      }
      setScrollProgress(Math.min(Math.max(p, 0), CHAPTERS));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    // Pause rendering once the light content fully covers the universe.
    const io = new IntersectionObserver(([entry]) => setSuspended(!entry.isIntersecting), { rootMargin: '0px' });
    io.observe(root);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      io.disconnect();
      setSuspended(false);
    };
  }, [setScrollProgress, setSuspended]);

  const products = getDemos(aiProductIds);
  const staticMode = profile === 'static';

  return (
    <div className={`lf-home${staticMode ? ' is-static' : ''}`}>
      <div className="lf-home__cinematic lf-dark" ref={cinematicRef}>
        {/* HERO */}
        <section className="lf-home-hero" data-chapter="0" aria-labelledby="hero-title">
          <div className="lf-container lf-home-hero__inner">
            <p className="lf-eyebrow">Linkfields AI Universe</p>
            <h1 id="hero-title" className="lf-home-hero__title">
              Explore the universe of <span className="lf-gradient-text">enterprise AI</span>
            </h1>
            <p className="lf-home-hero__lead">
              Travel through Linkfields Innovations’ AI and analytics work: {demos.length} catalogue entries across
              eight AI categories, alongside the solutions, services and industries behind them.
            </p>
            <div className="lf-actions">
              <Link to="/demos" className="lf-btn lf-btn--accent">Explore live demos</Link>
              <a href="#overview" className="lf-btn lf-btn--ghost">Skip the journey</a>
            </div>
            <nav className="lf-home-hero__planets" aria-label="AI categories">
              <p className="lf-meta">Jump to a planet</p>
              <ul className="lf-chip-list">
                {planets.map((p) => (
                  <li key={p.id}>
                    <Link className="lf-chip lf-chip--link" to={`/universe/${p.id}`}>{p.name}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          {!staticMode && (
            <p className="lf-scroll-hint" aria-hidden="true">
              <span /> Scroll to travel
            </p>
          )}
        </section>

        {/* CHAPTER 1: SOLUTIONS */}
        <section className="lf-chapter lf-chapter--left" data-chapter="1" aria-labelledby="ch-solutions">
          <m.div className="lf-chapter__card" {...reveal}>
            <p className="lf-eyebrow">Chapter 1 · Solutions</p>
            <h2 id="ch-solutions">Enterprise platforms, integrated and automated</h2>
            <p>{ERP_INTRO}</p>
            <ul className="lf-chapter__list">
              {corporateSolutions.map((s) => (
                <li key={s.id}><Link to={`/solutions#${s.id}`}>{s.name}</Link></li>
              ))}
            </ul>
            <Link to="/solutions" className="lf-link-arrow">All solutions, including AI products</Link>
          </m.div>
        </section>

        {/* CHAPTER 2: SERVICES */}
        <section className="lf-chapter lf-chapter--right" data-chapter="2" aria-labelledby="ch-services">
          <m.div className="lf-chapter__card" {...reveal}>
            <p className="lf-eyebrow">Chapter 2 · Services</p>
            <h2 id="ch-services">Engineering, consulting, cloud and teams</h2>
            <p>Seven service practices published by Linkfields, from engineering and consulting to cloud, automation and IT infrastructure.</p>
            <ul className="lf-chapter__list">
              {corporateServices.map((s) => (
                <li key={s.id}><Link to={`/services#${s.id}`}>{s.name}</Link></li>
              ))}
            </ul>
            <Link to="/services" className="lf-link-arrow">All services and proposed AI services</Link>
          </m.div>
        </section>

        {/* CHAPTER 3: INDUSTRIES */}
        <section className="lf-chapter lf-chapter--left" data-chapter="3" aria-labelledby="ch-industries">
          <m.div className="lf-chapter__card" {...reveal}>
            <p className="lf-eyebrow">Chapter 3 · Industries</p>
            <h2 id="ch-industries">A constellation of eight industries</h2>
            <p>Each star is an industry Linkfields serves. Select one to read how Linkfields works in that sector.</p>
            <ul className="lf-chapter__list">
              {industries.map((i) => (
                <li key={i.id}><Link to={`/industries#${i.id}`}>{i.name}</Link></li>
              ))}
            </ul>
            <Link to="/industries" className="lf-link-arrow">Explore industries</Link>
          </m.div>
        </section>

        <div className="lf-chapter lf-chapter--outro" data-chapter="4" aria-hidden="true" />
      </div>

      {/* LIGHT CONTENT */}
      <div className="lf-home__content" id="overview">
        <section className="lf-section" aria-labelledby="universe-index">
          <div className="lf-container">
            <SectionHeader id="universe-index" eyebrow="The AI universe" title="Eight planets, one intelligence core">
              Each planet is an AI category. Its moons are the underlying AI technologies, and its surface holds the
              live Linkfields demos. Items marked <em>Proposed</em> are under business review.
            </SectionHeader>
            <UniverseIndex />
          </div>
        </section>

        <section className="lf-section lf-section--muted" aria-labelledby="products">
          <div className="lf-container">
            <SectionHeader id="products" eyebrow="Linkfields AI products" title="Live products you can open today">
              Named AI products from the LFI AI catalogue. Every card opens the working demo.
            </SectionHeader>
            <div className="lf-grid">
              {products.map((demo, i) => (
                <m.div key={demo.id} {...stagger(i)}>
                  <DemoCard demo={demo} />
                </m.div>
              ))}
            </div>
            <div className="lf-actions">
              <Link to="/demos" className="lf-btn lf-btn--primary">See all {demos.length} catalogue entries</Link>
            </div>
          </div>
        </section>

        <section className="lf-section" aria-labelledby="company-snapshot">
          <div className="lf-container lf-split">
            <div>
              <SectionHeader id="company-snapshot" eyebrow="Company" title={company.hero.title}>
                {company.history}
              </SectionHeader>
              <Link to="/company" className="lf-link-arrow">About Linkfields</Link>
            </div>
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

        <section className="lf-section lf-section--dark lf-dark" aria-labelledby="join">
          <div className="lf-container lf-split">
            <m.div {...reveal}>
              <p className="lf-eyebrow">{careers.eyebrow}</p>
              <h2 id="join">{careers.title}</h2>
              <p>{careers.intro}</p>
              <div className="lf-actions">
                <Link to="/careers" className="lf-btn lf-btn--accent">Careers at Linkfields</Link>
              </div>
            </m.div>
            <m.div {...stagger(1)}>
              <p className="lf-eyebrow">Contact</p>
              <h2>Talk to us</h2>
              <p>
                {offices.length} offices across {offices.map((o) => o.country).join(', ')}.
              </p>
              <div className="lf-actions">
                <Link to="/contact" className="lf-btn lf-btn--ghost">Contact and offices</Link>
                <SmartLink href={`mailto:${emails.sales}`} className="lf-btn lf-btn--ghost">{emails.sales}</SmartLink>
              </div>
            </m.div>
          </div>
        </section>
      </div>
    </div>
  );
}

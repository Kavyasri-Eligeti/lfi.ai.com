import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import PageHero from '../../components/ui/PageHero';
import CardTheatre from '../../features/theatre/CardTheatre';
import { PAGE_THEATRES } from '../../content/theatreCards';
import SmartLink from '../../components/ui/SmartLink';
import Icon, { Arrow } from '../../components/ui/Icon';
import { industries } from '../../content/industries';
import { getDemos } from '../../content/demos';
import { usePageMeta } from '../../hooks/usePageMeta';
import './industries.css';
import Reveal from '../../features/motion/Reveal';

function IndustryArt({ industry }) {
  if (industry.image) {
    return <img src={industry.image} alt="" width="480" height="800" loading="lazy" decoding="async" />;
  }
  return (
    <div className="lf-industry-art" aria-hidden="true">
      <i /><i /><i /><i /><i /><i />
    </div>
  );
}

function IndustryPanel({ industry, index }) {
  const related = getDemos(industry.relatedDemos);
  return (
    <Reveal as="article" id={industry.id} className={`lf-industry${index % 2 ? ' lf-industry--flip' : ''}`} aria-labelledby={`${industry.id}-title`}>
      <m.figure
        className="lf-industry__media"
        initial={{ clipPath: 'inset(8% 0% 8% 0% round 6px 6px 48px 6px)' }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 6px 6px 48px 6px)' }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 0.8, ease: [0.22, 0.8, 0.24, 1] }}
      >
        <IndustryArt industry={industry} />
      </m.figure>
      <div className="lf-industry__copy">
        <p className="lf-industry__index lf-num" aria-hidden="true">{String(index + 1).padStart(2, '0')} / {String(industries.length).padStart(2, '0')}</p>
        <h2 id={`${industry.id}-title`}>{industry.name}</h2>
        <p className="lf-industry__tagline">{industry.tagline}</p>
        <p>{industry.text}</p>
        {related.length > 0 && (
          <div className="lf-industry__demos">
            <p className="lf-eyebrow">Related demos · {related.length}</p>
            <ul className="lf-list-plain">
              {related.map((d) => (
                <li key={d.id}>
                  <SmartLink href={d.href}>
                    {d.name}
                    <Icon name={d.href.startsWith('/') ? 'arrow' : 'external'} size={15} />
                  </SmartLink>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="lf-actions">
          <SmartLink href={industry.href} className="lf-link">{industry.name} on linkfields.com <Arrow /></SmartLink>
          {related.length > 0 && (
            <Link to={`/solutions?industry=${industry.id}#products`} className="lf-link">Filter the catalogue <Arrow /></Link>
          )}
        </div>
      </div>
    </Reveal>
  );
}

export default function IndustriesPage() {
  usePageMeta(
    'Industries',
    'Manufacturing, Telecom, Banking, Insurance, Fintech, FMCG, Mining and Oil & Gas: the industries Linkfields Innovations serves, with related AI demos.'
  );
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Eight industries, one way of working"
        aside={
          <nav className="lf-industries-jump" aria-label="Industries on this page">
            <ul className="lf-list-plain">
              {industries.map((i) => (
                <li key={i.id}><a href={`#${i.id}`}>{i.name}</a></li>
              ))}
            </ul>
          </nav>
        }
      >
        <p className="lf-lead">
          The industries listed by Linkfields Innovations, with their published descriptions and the AI demos the catalogue files
          under each.
        </p>
      </PageHero>

      {/* The same card theatre as the homepage: this page's cards spiral around the data spine. */}
      <CardTheatre id="explore" cards={PAGE_THEATRES.industries.cards} filters={PAGE_THEATRES.industries.filters} label="Industries Linkfields serves" />
      <section className="lf-section" aria-label="Industries">
        <div className="lf-container lf-industries">
          {industries.map((ind, i) => <IndustryPanel key={ind.id} industry={ind} index={i} />)}
        </div>
      </section>
    </>
  );
}

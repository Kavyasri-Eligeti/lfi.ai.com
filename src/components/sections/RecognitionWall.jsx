import SmartLink from '../ui/SmartLink';
import Icon from '../ui/Icon';
import Reveal from '../../features/motion/Reveal';
import { company } from '../../content/company';
import './recognition.css';

// One accent per card, cycling through the site palette.
const ACCENTS = ['#6fe3d3', '#b4a2ff', '#ffb547', '#ff6f91', '#539fe5', '#ffd27a', '#6fe3d3'];

const membershipItem = () => ({
  value: 'Member',
  kicker: 'Memberships',
  title: company.memberships.join(' and '),
  label: `${company.memberships.join(' and ')} membership`,
});

/**
 * The certifications and recognition Linkfields publishes, as a row of
 * highlighted cards: the figure or official badge, what awarded it, and the
 * recognition itself. Cards with a source link open it; the whole card is
 * the link.
 */
export default function RecognitionWall({
  items = company.recognition,
  memberships = false,
  label = 'Recognition and certifications',
  headingLevel = 3,
}) {
  const Heading = `h${headingLevel}`;
  const list = memberships ? [...items, membershipItem()] : items;
  return (
    <ul className="lf-list-plain lf-recog" aria-label={label}>
      {list.map((r, i) => (
        <Reveal
          as="li"
          key={r.label}
          index={i}
          step={0.04}
          className={`lf-card lf-card--outline lf-recog__card${r.href ? ' lf-card--interactive' : ''}`}
          style={{ '--a': ACCENTS[i % ACCENTS.length] }}
        >
          <div className="lf-recog__top">
            {r.image ? (
              <span className="lf-recog__badge">
                <img src={r.image} alt="" width="44" height="44" loading="lazy" decoding="async" />
              </span>
            ) : (
              <span className="lf-recog__value">{r.value}</span>
            )}
            {r.kicker && <span className="lf-recog__kicker">{r.kicker}</span>}
          </div>
          <Heading className="lf-recog__title">
            {r.href ? (
              <SmartLink href={r.href} className="lf-card__stretch">
                {r.title || r.label}
              </SmartLink>
            ) : (
              r.title || r.label
            )}
          </Heading>
          {r.detail && <p className="lf-recog__detail">{r.detail}</p>}
          {r.href && (
            <span className="lf-recog__go" aria-hidden="true">
              <Icon name="external" size={16} />
            </span>
          )}
        </Reveal>
      ))}
    </ul>
  );
}

import SmartLink from '../ui/SmartLink';
import Icon from '../ui/Icon';
import { company } from '../../content/company';
import './recognition.css';

// One accent per card, cycling through the site palette.
const ACCENTS = ['#6fe3d3', '#b4a2ff', '#ffb547', '#ff6f91', '#539fe5', '#ffd27a', '#6fe3d3'];
// Seconds for one card to travel its own width: slow enough to read.
const SECONDS_PER_CARD = 7;

const membershipItem = () => ({
  value: 'Member',
  kicker: 'Memberships',
  title: company.memberships.join(' and '),
  label: `${company.memberships.join(' and ')} membership`,
});

function Card({ r, i, Heading, copy }) {
  return (
    <li
      className={`lf-card lf-card--outline lf-recog__card${r.href ? ' lf-card--interactive' : ''}`}
      style={{ '--a': ACCENTS[i % ACCENTS.length] }}
    >
      <span className="lf-recog__glow" aria-hidden="true" />
      <div className="lf-recog__top">
        {r.image ? (
          <span className="lf-recog__badge">
            <img src={r.image} alt="" width="56" height="56" loading="lazy" decoding="async" />
          </span>
        ) : (
          <span className="lf-recog__value">{r.value}</span>
        )}
        {r.kicker && <span className="lf-recog__kicker">{r.kicker}</span>}
      </div>
      <Heading className="lf-recog__title">
        {r.href ? (
          <SmartLink href={r.href} className="lf-card__stretch" tabIndex={copy ? -1 : undefined}>
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
    </li>
  );
}

/**
 * The certifications and recognition Linkfields publishes, as a row of cards
 * that flows steadily to the left and loops. The row pauses while the pointer
 * or keyboard focus is on it, and the card under the pointer lights up in its
 * accent. Cards with a source link open it; the whole card is the link.
 * With reduced motion the row stands still and scrolls sideways instead.
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
    <div className="lf-recog" style={{ '--flow-duration': `${list.length * SECONDS_PER_CARD}s` }}>
      <div className="lf-recog__track">
        <ul className="lf-list-plain lf-recog__group" aria-label={label}>
          {list.map((r, i) => <Card key={r.label} r={r} i={i} Heading={Heading} />)}
        </ul>
        {/* A second copy follows the first, so the loop has no seam. It is
            hidden from assistive technology and out of the tab order. */}
        <ul className="lf-list-plain lf-recog__group lf-recog__group--copy" aria-hidden="true" inert>
          {list.map((r, i) => <Card key={r.label} r={r} i={i} Heading={Heading} copy />)}
        </ul>
      </div>
    </div>
  );
}

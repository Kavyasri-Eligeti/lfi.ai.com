import StatusBadge from './StatusBadge';
import SmartLink from './SmartLink';
import Icon from './Icon';
import { capabilitiesForDemo } from '../../content/capabilities';

const linkIcon = (href) => (href.startsWith('/') ? 'arrow' : 'external');

/**
 * A demo from the LFI AI catalogue. The whole card is clickable through its
 * title link; sub-demos stay individually reachable above that layer.
 * `variant="feature"` is the large charcoal card used in the bento.
 */
export default function DemoCard({ demo, headingLevel = 3, variant = 'default', showCapabilities = true }) {
  const Heading = `h${headingLevel}`;
  const caps = showCapabilities ? capabilitiesForDemo(demo.id) : [];
  const feature = variant === 'feature';
  return (
    <article className={`lf-card lf-card--interactive lf-demo-card${feature ? ' lf-card--ink lf-demo-card--feature' : ' lf-card--outline'}`}>
      <div className="lf-card__top">
        <StatusBadge status={demo.status} />
        {demo.image && <img className="lf-demo-card__logo" src={demo.image} alt="" width="64" height="40" loading="lazy" decoding="async" />}
      </div>
      <Heading className="lf-demo-card__title">
        <SmartLink href={demo.href} className="lf-card__stretch">
          {demo.name}
        </SmartLink>
      </Heading>
      {demo.description && <p>{demo.description}</p>}
      {feature && !demo.href.startsWith('/') && <p className="lf-demo-card__host">{new URL(demo.href).host}</p>}
      {feature && <span className="lf-demo-card__modules" aria-hidden="true"><i /><i /><i /></span>}
      {demo.note && <p className="lf-meta">{demo.note}</p>}
      {demo.subDemos && (
        <ul className="lf-list-plain lf-demo-card__subs" aria-label={`${demo.name}: individual demos`}>
          {demo.subDemos.map((s) => (
            <li key={s.href}>
              <SmartLink href={s.href} className="lf-link">
                {s.name}
                <Icon name="external" size={14} className="lf-arrow" />
              </SmartLink>
            </li>
          ))}
        </ul>
      )}
      <div className="lf-card__foot">
        {caps.length > 0 && (
          <ul className="lf-list-plain lf-demo-card__caps" aria-label="AI capabilities">
            {caps.slice(0, 2).map((c) => <li key={c.id} className="lf-tag">{c.name}</li>)}
          </ul>
        )}
        <span className="lf-demo-card__go" aria-hidden="true">
          <Icon name={linkIcon(demo.href)} size={18} />
        </span>
      </div>
    </article>
  );
}

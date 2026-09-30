import StatusBadge from './StatusBadge';
import SmartLink from './SmartLink';

export default function DemoCard({ demo, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`;
  return (
    <article className="lf-card lf-demo-card">
      <div className="lf-card__head">
        <Heading className="lf-demo-card__title">{demo.name}</Heading>
        {demo.image && <img className="lf-demo-card__logo" src={demo.image} alt="" width="72" height="48" loading="lazy" />}
      </div>
      <div>
        <StatusBadge status={demo.status} />
      </div>
      {demo.description && <p>{demo.description}</p>}
      {demo.note && <p className="lf-meta">{demo.note}</p>}
      {demo.subDemos && (
        <ul className="lf-list-plain lf-demo-card__subs">
          {demo.subDemos.map((s) => (
            <li key={s.href}>
              <SmartLink href={s.href} className="lf-link-arrow">
                {s.name}
              </SmartLink>
            </li>
          ))}
        </ul>
      )}
      <div className="lf-card__foot">
        <SmartLink href={demo.href} className="lf-btn lf-btn--primary lf-btn--sm">
          Open demo<span className="lf-visually-hidden">: {demo.name}</span>
        </SmartLink>
      </div>
    </article>
  );
}

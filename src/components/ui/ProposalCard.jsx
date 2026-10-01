import StatusBadge from './StatusBadge';
import SmartLink from './SmartLink';
import { getDemos } from '../../content/demos';
import Reveal from '../../features/motion/Reveal';

// A proposed (unapproved) offering. Dashed outline + badge: it must never look
// like a current Linkfields offering.
export default function ProposalCard({ item, index = 0, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`;
  const evidence = getDemos(item.evidence);
  return (
    <Reveal as="article" id={item.id} className="lf-card lf-card--dashed lf-proposal" index={index} step={0.03}>
      <div className="lf-card__top"><StatusBadge status={item.status} /></div>
      <Heading className="lf-proposal__title">{item.name}</Heading>
      <p>{item.summary}</p>
      <ul className="lf-list-plain lf-proposal__caps" aria-label="Capabilities involved">
        {item.capabilities.map((c) => <li key={c} className="lf-tag">{c}</li>)}
      </ul>
      {evidence.length > 0 && (
        <p className="lf-meta lf-proposal__evidence">
          Shown today by:{' '}
          {evidence.map((d, i) => (
            <span key={d.id}>
              {i > 0 && ', '}
              <SmartLink href={d.href}>{d.name}</SmartLink>
            </span>
          ))}
        </p>
      )}
    </Reveal>
  );
}

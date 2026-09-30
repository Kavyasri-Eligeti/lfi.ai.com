import { m } from 'framer-motion';
import StatusBadge from './StatusBadge';
import SmartLink from './SmartLink';
import { getDemos } from '../../content/demos';
import { stagger } from '../../features/motion/tokens';

export default function ProposalCard({ item, index = 0 }) {
  const evidence = getDemos(item.evidence);
  return (
    <m.article id={item.id} className="lf-card lf-card--proposed" {...stagger(index, 0.04)}>
      <div className="lf-card__head">
        <h3 className="lf-proposal__title">{item.name}</h3>
      </div>
      <div><StatusBadge status={item.status} /></div>
      <p>{item.summary}</p>
      <ul className="lf-chip-list" aria-label="Capabilities involved">
        {item.capabilities.map((c) => <li key={c} className="lf-chip">{c}</li>)}
      </ul>
      {evidence.length > 0 && (
        <p className="lf-meta">
          Capability shown by:{' '}
          {evidence.map((d, i) => (
            <span key={d.id}>
              {i > 0 && ', '}
              <SmartLink href={d.href}>{d.name}</SmartLink>
            </span>
          ))}
        </p>
      )}
    </m.article>
  );
}

import SmartLink from '../ui/SmartLink';
import { partners } from '../../content/company';
import Reveal from '../../features/motion/Reveal';

// Official partner logos as published on linkfields.com, unmodified. Two of
// them only exist as light-on-dark artwork, so they sit on charcoal tiles.
export default function PartnerWall() {
  return (
    <ul className="lf-list-plain lf-partners" aria-label="Technology partners">
      {partners.map((p, i) => (
        <Reveal as="li" key={p.id} index={i} step={0.04}>
          <SmartLink href={p.href} className={`lf-partner${p.tile === 'dark' ? ' lf-partner--dark' : ''}`}>
            <img src={p.logo} alt={p.name} width="200" height="120" loading="lazy" decoding="async" />
          </SmartLink>
        </Reveal>
      ))}
    </ul>
  );
}

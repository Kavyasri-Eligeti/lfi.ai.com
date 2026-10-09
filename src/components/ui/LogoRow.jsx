import { logosFor } from '../../content/logos';
import './logo-row.css';

/** Official platform logos, unmodified, each on its own tile. */
export default function LogoRow({ keys, size = 'md', label = 'Platforms', className = '' }) {
  const logos = logosFor(keys);
  if (!logos.length) return null;
  return (
    <ul className={`lf-list-plain lf-logos lf-logos--${size} ${className}`} aria-label={label}>
      {logos.map((l) => (
        <li key={l.name} className={`lf-logos__tile${l.tile === 'dark' ? ' is-dark' : ''}`} title={l.name}>
          <img src={l.src} alt={l.name} loading="lazy" decoding="async" />
        </li>
      ))}
    </ul>
  );
}

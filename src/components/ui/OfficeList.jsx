import { telHref } from '../../content/company';

export default function OfficeList({ offices, activeId, onFocusOffice, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`;
  return (
    <ul className="lf-offices">
      {offices.map((o) => (
        <li key={o.id}>
          <article className={`lf-office${activeId === o.id ? ' is-active' : ''}`}>
            {o.hq && <span className="lf-hq">Headquarters</span>}
            <Heading>{o.country}</Heading>
            <address>{o.address}</address>
            {o.phones.map((p) => (
              <a key={p} href={telHref(p)}>{p}</a>
            ))}
            {onFocusOffice && (
              <button type="button" className="lf-office__focus" aria-pressed={activeId === o.id} onClick={() => onFocusOffice(o.id)}>
                Show {o.city} on the globe
              </button>
            )}
          </article>
        </li>
      ))}
    </ul>
  );
}

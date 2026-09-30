import { Link } from 'react-router-dom';
import LinkfieldsLogo from '../brand/LinkfieldsLogo';
import SmartLink from '../ui/SmartLink';
import { company, emails, socials } from '../../content/company';
import { planets } from '../../content/universe';

export default function Footer() {
  return (
    <footer className="lf-footer lf-dark">
      <div className="lf-container lf-footer__grid">
        <div className="lf-footer__brand">
          <LinkfieldsLogo height={34} />
          <p>{company.hero.text}</p>
          <ul className="lf-footer__social" aria-label="Social media">
            {socials.map((s) => (
              <li key={s.name}>
                <SmartLink href={s.href}>{s.name}</SmartLink>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="AI universe">
          <h2 className="lf-footer__title">AI Universe</h2>
          <ul className="lf-list-plain">
            {planets.map((p) => (
              <li key={p.id}>
                <Link to={`/universe/${p.id}`}>{p.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Explore">
          <h2 className="lf-footer__title">Explore</h2>
          <ul className="lf-list-plain">
            <li><Link to="/demos">Demo catalogue</Link></li>
            <li><Link to="/solutions">Solutions</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/industries">Industries</Link></li>
            <li><a href="/catalogue">Classic catalogue view</a></li>
          </ul>
        </nav>

        <nav aria-label="Company">
          <h2 className="lf-footer__title">Company</h2>
          <ul className="lf-list-plain">
            <li><Link to="/company">About Linkfields</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><SmartLink href={company.links.blog}>Blog</SmartLink></li>
            <li><SmartLink href={company.links.news}>News and articles</SmartLink></li>
          </ul>
        </nav>

        <div>
          <h2 className="lf-footer__title">Get in touch</h2>
          <ul className="lf-list-plain">
            <li><a href={`mailto:${emails.general}`}>{emails.general}</a></li>
            <li><a href={`mailto:${emails.sales}`}>{emails.sales}</a></li>
            <li><a href={`mailto:${emails.careers}`}>{emails.careers}</a></li>
          </ul>
        </div>
      </div>

      <div className="lf-container lf-footer__legal">
        <p>
          © {new Date().getFullYear()} {company.legalName}. Items marked <em>Proposed</em> are under business review and are
          not current offerings. <em>AI technology</em> items describe general technologies, not Linkfields products.
          Third-party names are trademarks of their respective owners.
        </p>
      </div>
    </footer>
  );
}

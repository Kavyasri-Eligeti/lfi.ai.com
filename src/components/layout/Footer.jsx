import { Link } from 'react-router-dom';
import LinkfieldsLogo from '../brand/LinkfieldsLogo';
import SmartLink from '../ui/SmartLink';
import SocialIcon from '../ui/SocialIcon';
import { company, emails, socials } from '../../content/company';
import { corporateSolutions } from '../../content/solutions';
import { useMotion } from '../../features/motion/MotionProvider';

export default function Footer() {
  const { reduced, setPreference } = useMotion();
  return (
    <footer className="lf-footer lf-ink">
      <div className="lf-container lf-footer__top">
        <div className="lf-footer__brand">
          <LinkfieldsLogo height={34} />
          <p>{company.hero.text}</p>
          <ul className="lf-footer__social" aria-label="Follow Linkfields">
            {socials.map((s) => (
              <li key={s.id}>
                <SmartLink href={s.href} className="lf-footer__social-link" aria-label={s.name}>
                  <SocialIcon id={s.id} />
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="AI solutions" className="lf-footer__col">
          <h2 className="lf-footer__title">AI Solutions</h2>
          <ul className="lf-list-plain">
            <li><Link to="/solutions#products">AI products and demos</Link></li>
            {corporateSolutions.slice(0, 5).map((s) => (
              <li key={s.id}><Link to={`/solutions#${s.id}`}>{s.name}</Link></li>
            ))}
            <li><a href="/catalogue">Classic catalogue view</a></li>
          </ul>
        </nav>

        <nav aria-label="Company" className="lf-footer__col">
          <h2 className="lf-footer__title">Company</h2>
          <ul className="lf-list-plain">
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/industries">Industries</Link></li>
            <li><Link to="/company">About Linkfields</Link></li>
            <li><Link to="/company#offices">Global presence</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><SmartLink href={company.links.news}>News and articles</SmartLink></li>
          </ul>
        </nav>

        <div className="lf-footer__col">
          <h2 className="lf-footer__title">Get in touch</h2>
          <ul className="lf-list-plain">
            <li><Link to="/contact">Contact us</Link></li>
            <li><a href={`mailto:${emails.general}`}>{emails.general}</a></li>
            <li><a href={`mailto:${emails.sales}`}>{emails.sales}</a></li>
            <li><a href={`mailto:${emails.careers}`}>{emails.careers}</a></li>
          </ul>
        </div>
      </div>

      <div className="lf-container lf-footer__bottom">
        <p>
          © {new Date().getFullYear()} {company.legalName}. Items marked <em>Proposed</em> are under business review and are
          not current offerings. Third-party names and logos are trademarks of their respective owners.
        </p>
        <ul className="lf-footer__legal">
          <li><SmartLink href={company.links.privacy}>Privacy Policy</SmartLink></li>
          <li><SmartLink href={company.links.terms}>Terms of Use</SmartLink></li>
          <li><SmartLink href={company.links.cookies}>Cookies Policy</SmartLink></li>
          <li>
            <button type="button" className="lf-footer__motion" aria-pressed={reduced} onClick={() => setPreference(reduced ? 'full' : 'reduced')}>
              Reduce motion
            </button>
          </li>
        </ul>
      </div>
    </footer>
  );
}

import { Link } from 'react-router-dom';
import { Arrow } from '../ui/Icon';
import { emails } from '../../content/company';
import Reveal from '../../features/motion/Reveal';

// Closing call to action on charcoal, used at the end of most pages.
export default function ContactBand({ title = 'Talk to Linkfields about your next AI project', text, headingLevel = 2 }) {
  const Heading = `h${headingLevel}`;
  return (
    <section className="lf-section lf-section--ink lf-contact-band lf-ink" aria-labelledby="contact-band-title">
      <div className="lf-container lf-contact-band__inner">
        <Reveal as="div">
          <p className="lf-eyebrow">Contact</p>
          <Heading id="contact-band-title">{title}</Heading>
          <p className="lf-lead">
            {text || (
              <>
                Tell us about the problem you want to solve. Write to <a href={`mailto:${emails.sales}`}>{emails.sales}</a> or send an
                enquiry and the Linkfields team will reply.
              </>
            )}
          </p>
        </Reveal>
        <div className="lf-actions lf-contact-band__actions">
          <Link to="/contact" className="lf-btn lf-btn--yellow">Contact us <Arrow /></Link>
          <Link to="/solutions" className="lf-btn lf-btn--secondary">Explore AI solutions</Link>
        </div>
        <div className="lf-contact-band__modules" aria-hidden="true"><i /><i /><i /></div>
      </div>
    </section>
  );
}

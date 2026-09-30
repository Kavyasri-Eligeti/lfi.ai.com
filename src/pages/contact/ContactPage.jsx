import PageHero from '../../components/ui/PageHero';
import SectionHeader from '../../components/ui/SectionHeader';
import SmartLink from '../../components/ui/SmartLink';
import OfficeList from '../../components/ui/OfficeList';
import { company, emails, offices, socials } from '../../content/company';
import { usePageMeta } from '../../hooks/usePageMeta';
import '../content.css';
import './contact.css';

// No contact form is rendered: no verified backend exists for this site.
// Enquiries go to the official corporate contact form and published emails.
export default function ContactPage() {
  usePageMeta('Contact', 'Contact Linkfields Innovations: offices, emails and the official enquiry form.');
  const channels = [
    { label: 'General enquiries', email: emails.general },
    { label: 'Sales', email: emails.sales },
    { label: 'Careers', email: emails.careers },
  ];
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let’s build what’s next"
        actions={
          <SmartLink href={company.links.contact} className="lf-btn lf-btn--accent">
            Open the enquiry form
          </SmartLink>
        }
      >
        <p>Use the official Linkfields enquiry form, write to the right team, or reach an office directly.</p>
      </PageHero>

      <section className="lf-section" aria-labelledby="channels">
        <div className="lf-container">
          <SectionHeader id="channels" eyebrow="Email" title="Write to the right team" />
          <ul className="lf-channels">
            {channels.map((c) => (
              <li key={c.email}>
                <a href={`mailto:${c.email}`} className="lf-channel">
                  <span className="lf-channel__label">{c.label}</span>
                  <span className="lf-channel__email">{c.email}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="lf-section lf-section--muted" aria-labelledby="offices">
        <div className="lf-container">
          <SectionHeader id="offices" eyebrow="Offices" title="Find us around the world" />
          <OfficeList offices={offices} />
        </div>
      </section>

      <section className="lf-section" aria-labelledby="social">
        <div className="lf-container">
          <SectionHeader id="social" eyebrow="Social" title="Follow Linkfields" />
          <ul className="lf-social-tiles">
            {socials.map((s) => (
              <li key={s.name}>
                <SmartLink href={s.href} className="lf-social-tile">{s.name}</SmartLink>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

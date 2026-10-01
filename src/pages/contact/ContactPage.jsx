import { useId, useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import PageHero from '../../components/ui/PageHero';
import SectionHeader from '../../components/ui/SectionHeader';
import SmartLink from '../../components/ui/SmartLink';
import SocialIcon from '../../components/ui/SocialIcon';
import Icon, { Arrow } from '../../components/ui/Icon';
import OfficeMap from '../../components/sections/OfficeMap';
import { company, emails, socials } from '../../content/company';
import { usePageMeta } from '../../hooks/usePageMeta';
import './contact.css';

// Service list exactly as offered by the official enquiry form on linkfields.com/contact-us.
const SERVICES = [
  'SAP', 'Odoo', 'Microsoft Dynamics', 'Salesforce', 'iPaaS', 'Robotic process automation', 'Application Development',
  'Quality Control', 'DevOps', 'Product Discovery', 'Solution Discovery', 'UX/UI Design', 'Technology Advisory',
  'Cloud Consulting', 'Cloud Migration', 'Cloud Development', 'Kubernetes Services', 'Big Data Engineering',
  'AI & Machine Learning', 'Digital transformation', 'Staff Augmentation', 'Managed Team', 'IT Infrastructure', 'Others',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Enter your name.';
  if (!values.email.trim()) errors.email = 'Enter your email address.';
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Enter an email address in the format name@company.com.';
  if (!values.service) errors.service = 'Choose the service you are interested in.';
  if (values.message.trim().length < 10) errors.message = 'Tell us a little about your enquiry (at least 10 characters).';
  return errors;
}

/**
 * Enquiry form. There is no verified form endpoint for this site, so the form
 * does not send anything itself: it validates the enquiry and opens the
 * visitor's email app with a message to the published sales address. The
 * official linkfields.com form is offered alongside.
 */
function EnquiryForm() {
  const uid = useId();
  const [values, setValues] = useState({ name: '', email: '', company: '', service: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const summaryRef = useRef(null);

  const field = (key) => ({
    id: `${uid}-${key}`,
    name: key,
    value: values[key],
    'aria-invalid': errors[key] ? 'true' : undefined,
    'aria-describedby': errors[key] ? `${uid}-${key}-error` : undefined,
    onChange: (e) => {
      setValues((v) => ({ ...v, [key]: e.target.value }));
      if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
    },
  });
  const error = (key) =>
    errors[key] && (
      <p id={`${uid}-${key}-error`} className="lf-field__error">
        <Icon name="alert" size={16} />
        {errors[key]}
      </p>
    );

  const onSubmit = (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    const keys = Object.keys(found);
    if (keys.length) {
      setSubmitted(false);
      document.getElementById(`${uid}-${keys[0]}`)?.focus();
      return;
    }
    const subject = `Enquiry: ${values.service}${values.company ? ` (${values.company})` : ''}`;
    const body = [
      values.message.trim(),
      '',
      `Name: ${values.name.trim()}`,
      `Email: ${values.email.trim()}`,
      values.company.trim() ? `Company: ${values.company.trim()}` : null,
      `Service: ${values.service}`,
    ].filter((line) => line !== null).join('\n');
    window.location.href = `mailto:${emails.sales}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
    window.setTimeout(() => summaryRef.current?.focus(), 50);
  };

  return (
    <form className="lf-enquiry" noValidate onSubmit={onSubmit} aria-labelledby={`${uid}-title`}>
      <h2 id={`${uid}-title`} className="lf-enquiry__title">Send an enquiry</h2>
      <p className="lf-enquiry__intro">
        Fields marked <span aria-hidden="true">*</span><span className="lf-visually-hidden">with an asterisk</span> are required.
        Sending opens your email app with the message addressed to {emails.sales}.
      </p>
      <div className="lf-enquiry__grid">
        <div className="lf-field">
          <label htmlFor={`${uid}-name`}>Name <span aria-hidden="true">*</span></label>
          <input className="lf-input" type="text" autoComplete="name" required {...field('name')} />
          {error('name')}
        </div>
        <div className="lf-field">
          <label htmlFor={`${uid}-email`}>Work email <span aria-hidden="true">*</span></label>
          <input className="lf-input" type="email" autoComplete="email" inputMode="email" required {...field('email')} />
          {error('email')}
        </div>
        <div className="lf-field">
          <label htmlFor={`${uid}-company`}>Company</label>
          <input className="lf-input" type="text" autoComplete="organization" {...field('company')} />
        </div>
        <div className="lf-field">
          <label htmlFor={`${uid}-service`}>Service <span aria-hidden="true">*</span></label>
          <select className="lf-select" required {...field('service')}>
            <option value="">Choose a service</option>
            {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {error('service')}
        </div>
        <div className="lf-field lf-enquiry__wide">
          <label htmlFor={`${uid}-message`}>How can we help? <span aria-hidden="true">*</span></label>
          <textarea className="lf-textarea" rows={5} required {...field('message')} />
          {error('message')}
        </div>
      </div>
      <div className="lf-enquiry__actions">
        <button type="submit" className="lf-btn">Write the email <Arrow /></button>
        <SmartLink href={company.links.contact} className="lf-link">Or use the form on linkfields.com <Arrow /></SmartLink>
      </div>
      <AnimatePresence>
        {submitted && (
          <m.div
            ref={summaryRef}
            tabIndex={-1}
            role="status"
            className="lf-callout lf-callout--blue lf-enquiry__done"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Icon name="check" size={20} />
            <p>
              Your email app should now show the message to {emails.sales}. Send it from there. If nothing opened, write to{' '}
              <a href={`mailto:${emails.sales}`}>{emails.sales}</a> or use the <SmartLink href={company.links.contact}>official enquiry form</SmartLink>.
            </p>
          </m.div>
        )}
      </AnimatePresence>
    </form>
  );
}

export default function ContactPage() {
  usePageMeta('Contact', 'Contact Linkfields Innovations: enquiries, sales and careers emails, office addresses and phone numbers.');
  const channels = [
    { label: 'Sales and enquiries', email: emails.sales, note: 'Our sales team will get in touch within 24 hours.' },
    { label: 'General information', email: emails.general },
    { label: 'Careers', email: emails.careers },
  ];
  return (
    <>
      <PageHero variant="b" eyebrow="Contact" title="Let’s talk about what you want to build">
        <p className="lf-lead">Send an enquiry, email the right team directly, or visit one of six Linkfields offices.</p>
      </PageHero>

      <section className="lf-section lf-contact" aria-label="Contact options">
        <div className="lf-container lf-contact__inner">
          <EnquiryForm />
          <aside className="lf-contact__aside" aria-label="Email and social">
            <ul className="lf-list-plain lf-channels">
              {channels.map((c) => (
                <li key={c.email} className="lf-channel">
                  <p className="lf-eyebrow">{c.label}</p>
                  <a href={`mailto:${c.email}`} className="lf-channel__email"><Icon name="mail" size={20} />{c.email}</a>
                  {c.note && <p className="lf-meta">{c.note}</p>}
                </li>
              ))}
            </ul>
            <div className="lf-contact__social">
              <p className="lf-eyebrow">Follow us</p>
              <ul className="lf-list-plain">
                {socials.map((s) => (
                  <li key={s.id}>
                    <SmartLink href={s.href} className="lf-contact__social-link">
                      <SocialIcon id={s.id} size={18} />
                      <span>{s.name}</span>
                      <span className="lf-meta">{s.handle}</span>
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="lf-section lf-section--tint" id="offices" aria-labelledby="offices-title">
        <div className="lf-container">
          <SectionHeader split id="offices-title" eyebrow="Offices" title="Visit Linkfields">
            Published addresses, phone numbers and directions for every office.
          </SectionHeader>
          <OfficeMap />
        </div>
      </section>
    </>
  );
}

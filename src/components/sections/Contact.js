import React, { useMemo, useRef, useState } from "react";
import Reveal from "../ui/Reveal";
import Scrub from "../ui/Scrub";
import LineReveal from "../../motion/LineReveal";
import Icon from "../ui/Icon";
import { contact, offices, official } from "../../data/company";
import useGsap from "../../motion/useGsap";
import { gsap, EASE, prefersReducedMotion } from "../../motion";
import "./Contact.css";

/**
 * Contact.
 *
 * There is no submission backend in this repository, and this component does
 * not pretend otherwise. Two modes:
 *
 *   endpoint configured  - REACT_APP_CONTACT_ENDPOINT is POSTed as JSON, and
 *                          the result shown is the real result. A failure is
 *                          reported as a failure, with the email fallback.
 *   no endpoint (default)- the form still validates, and submitting hands the
 *                          completed message to the visitor's mail client via
 *                          a mailto: link. A success message is never shown
 *                          for something that was not sent.
 *
 * On how that is WORDED. An earlier version printed "this site has no form
 * backend configured" on the page. That is true, and it is addressed to the
 * wrong reader: a prospective customer does not know or care what a form
 * backend is, and a deployment note rendered as UI makes a finished site look
 * unfinished. The copy below says the same thing in terms of what actually
 * happens to the visitor's message - it opens in their mail client, and it is
 * not sent from the page. Truthful, and written for the person reading it.
 *
 * To wire a real destination, set REACT_APP_CONTACT_ENDPOINT in .env.local (or
 * the build environment) to a URL that accepts a JSON POST. See .env.example
 * and the README.
 */

const ENDPOINT = process.env.REACT_APP_CONTACT_ENDPOINT || "";

/* ==========================================================================
   Abuse protection.

   Two cheap client-side checks. Neither is a substitute for validation and
   rate limiting on the server - they cannot be, since anything shipped to
   the browser can be bypassed - but together they stop the drive-by form
   spam that makes up most of the volume, at no cost to a real visitor:

     - a honeypot field, hidden from sight and from assistive technology,
       which a human never sees and a form-filling bot populates;
     - a minimum fill time, because a bot posts the instant the DOM is ready
       and a person cannot write a paragraph in three seconds.

   The server is still responsible for the real controls. See README.
   ========================================================================== */
const MIN_FILL_MS = 3000;

const INTERESTS = [
  "AI & ML idea to product",
  "AI & ML platform services",
  "Explainable AI",
  "Intelligent document analytics",
  "Intelligent enterprise search",
  "Conversational platforms",
  "Intelligent automation",
  "Something else",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Please enter your name.";
  if (!values.email.trim()) errors.email = "Please enter your work email.";
  else if (!EMAIL_RE.test(values.email.trim()))
    errors.email = "That does not look like a valid email address.";
  if (!values.company.trim()) errors.company = "Please enter your company.";
  if (!values.message.trim())
    errors.message = "Please tell us a little about the project.";
  else if (values.message.trim().length < 20)
    errors.message = "A sentence or two more would help us route this well.";
  return errors;
}

const EMPTY = {
  name: "",
  email: "",
  company: "",
  phone: "",
  interest: INTERESTS[0],
  message: "",
};

export default function Contact() {
  const formRef2 = useRef(null);

  useGsap(
    (root) => {
      if (prefersReducedMotion()) return;
      const fields = gsap.utils.toArray(".lfi-form__group", root);
      if (!fields.length) return;

      gsap.from(fields, {
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: EASE.out,
      });
    },
    [],
    formRef2
  );

  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | handoff | error
  const [failure, setFailure] = useState("");
  const formRef = useRef(null);
  /* Not state: changing it must never cause a render, and nothing reads it
     during one. */
  const honeypotRef = useRef("");
  const mountedAt = useRef(Date.now());

  const mailtoHref = useMemo(() => {
    const body = [
      `Name: ${values.name}`,
      `Company: ${values.company}`,
      `Email: ${values.email}`,
      values.phone ? `Phone: ${values.phone}` : null,
      `Area of interest: ${values.interest}`,
      "",
      values.message,
    ]
      .filter(Boolean)
      .join("\n");
    return `mailto:${contact.primaryEmail}?subject=${encodeURIComponent(
      `AI enquiry - ${values.company || "website"}`
    )}&body=${encodeURIComponent(body)}`;
  }, [values]);

  const setField = (field) => (e) => {
    const { value } = e.target;
    setValues((v) => ({ ...v, [field]: value }));
    if (touched[field]) {
      setErrors((prev) => {
        const next = validate({ ...values, [field]: value });
        return { ...prev, [field]: next[field] };
      });
    }
  };

  const onBlur = (field) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validate(values)[field] }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setTouched({
      name: true,
      email: true,
      company: true,
      message: true,
    });

    if (Object.keys(found).length) {
      // Move focus to the first field that needs attention.
      const firstKey = ["name", "email", "company", "message"].find(
        (k) => found[k]
      );
      formRef.current?.querySelector(`#lfi-${firstKey}`)?.focus();
      return;
    }

    /* Automated submission. Reported as a failure with the email route
       offered, never as a silent success - a real person who somehow trips
       this must still have a way to reach the company, and a bot being told
       "no" costs nothing. */
    const tooFast = Date.now() - mountedAt.current < MIN_FILL_MS;
    if (honeypotRef.current || tooFast) {
      setStatus("error");
      setFailure("This submission could not be verified.");
      return;
    }

    if (!ENDPOINT) {
      // No backend configured: hand off to the mail client. This is not a
      // "sent" state and is never described as one.
      window.location.href = mailtoHref;
      setStatus("handoff");
      return;
    }

    setStatus("sending");
    setFailure("");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, source: "lfiai.com" }),
      });
      if (!res.ok) throw new Error(`The server responded ${res.status}.`);
      setStatus("sent");
      setValues(EMPTY);
      setTouched({});
    } catch (err) {
      setStatus("error");
      setFailure(err.message || "The request could not be completed.");
    }
  };

  const field = (name) => ({
    id: `lfi-${name}`,
    name,
    value: values[name],
    onChange: setField(name),
    onBlur: onBlur(name),
    "aria-invalid": errors[name] ? "true" : undefined,
    "aria-describedby": errors[name] ? `lfi-${name}-err` : undefined,
  });

  const err = (name) =>
    errors[name] ? (
      <p className="lfi-form__err" id={`lfi-${name}-err`}>
        {errors[name]}
      </p>
    ) : null;

  return (
    <section className="lfi-section lfi-contact" id="contact" data-light="ember">
      <Scrub className="lfi-scrub lfi-glow lfi-parallax-slow" aria-hidden="true" />
      <div className="lfi-container lfi-contact__inner">
        {/* --- left: the pitch and the real contact details --------------- */}
        <Reveal className="lfi-contact__aside" from="left">
          <p className="lfi-eyebrow">Contact</p>
          <LineReveal as="h2" className="lfi-heading">
            Bring us the problem, not the specification.
          </LineReveal>
          <p className="lfi-lede">
            The most useful first conversation is about what is going wrong in
            the business &mdash; the backlog, the churn, the documents nobody
            can search. We will tell you honestly whether AI is the right
            answer.
          </p>

          <ul className="lfi-contact__direct">
            <li>
              <Icon name="mail" size={17} />
              <a href={`mailto:${contact.primaryEmail}`}>
                {contact.primaryEmail}
              </a>
            </li>
            <li>
              <Icon name="mail" size={17} />
              <a href={`mailto:${contact.emails.general}`}>
                {contact.emails.general}
              </a>
            </li>
            <li>
              <Icon name="external" size={17} />
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                Linkfields Innovations on LinkedIn
              </a>
            </li>
          </ul>

          <details className="lfi-contact__offices">
            <summary>
              <Icon name="pin" size={15} />
              Offices in {offices.length} countries
            </summary>
            <ul>
              {offices.map((o) => (
                <li key={o.code}>
                  <h3>{o.country}</h3>
                  <p>{o.address}</p>
                  <a href={`tel:${o.phone.replace(/\s/g, "")}`}>
                    <Icon name="phone" size={13} />
                    {o.phone}
                  </a>
                </li>
              ))}
            </ul>
          </details>

          {/* What Linkfields publishes about what follows an enquiry, in its
              own words. Quoted rather than restated so the page does not
              invent a response time or a process of its own. */}
          <div className="lfi-contact__next">
            <p className="lfi-contact__next-label">What happens next</p>
            <ol>
              {official.nextSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </Reveal>

        {/* --- right: the form --------------------------------------------- */}
        <Reveal className="lfi-contact__formwrap" from="right">
          {!ENDPOINT ? (
            <p className="lfi-form__notice">
              <Icon name="mail" size={15} />
              <span>
                Completing this form opens a prepared message in your email
                client, addressed to {contact.primaryEmail}. You send it from
                there, so nothing leaves this page until you do.
              </span>
            </p>
          ) : null}

          <form
            ref={formRef}
            className="lfi-form"
            onSubmit={onSubmit}
            noValidate
          >
            {/* Honeypot. Hidden from sight AND from assistive technology, and
                out of the tab order, so no real visitor can reach it by any
                input method - which is what makes a value in it meaningful.
                `display: none` is avoided deliberately: it is the first thing
                a form-filling bot skips. */}
            <div className="lfi-form__hp" aria-hidden="true">
              <label htmlFor="lfi-company-url">
                Company website (leave this field empty)
              </label>
              <input
                type="text"
                id="lfi-company-url"
                name="company_url"
                tabIndex={-1}
                autoComplete="off"
                defaultValue=""
                onChange={(e) => {
                  honeypotRef.current = e.target.value;
                }}
              />
            </div>

            <div className="lfi-form__row">
              <div className="lfi-form__group" style={{ "--lfi-f": 0 }}>
                <label htmlFor="lfi-name">
                  Name <span aria-hidden="true">*</span>
                </label>
                <input type="text" autoComplete="name" required {...field("name")} />
                {err("name")}
              </div>

              <div className="lfi-form__group" style={{ "--lfi-f": 1 }}>
                <label htmlFor="lfi-email">
                  Work email <span aria-hidden="true">*</span>
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  required
                  {...field("email")}
                />
                {err("email")}
              </div>
            </div>

            <div className="lfi-form__row">
              <div className="lfi-form__group" style={{ "--lfi-f": 2 }}>
                <label htmlFor="lfi-company">
                  Company <span aria-hidden="true">*</span>
                </label>
                <input
                  type="text"
                  autoComplete="organization"
                  required
                  {...field("company")}
                />
                {err("company")}
              </div>

              <div className="lfi-form__group" style={{ "--lfi-f": 3 }}>
                <label htmlFor="lfi-phone">
                  Phone <span className="lfi-form__opt">(optional)</span>
                </label>
                <input
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  {...field("phone")}
                />
              </div>
            </div>

            <div className="lfi-form__group" style={{ "--lfi-f": 4 }}>
              <label htmlFor="lfi-interest">Area of interest</label>
              <select {...field("interest")}>
                {INTERESTS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            <div className="lfi-form__group" style={{ "--lfi-f": 5 }}>
              <label htmlFor="lfi-message">
                What are you trying to solve? <span aria-hidden="true">*</span>
              </label>
              <textarea rows={5} required {...field("message")} />
              {err("message")}
            </div>

            <div className="lfi-form__actions">
              <button
                type="submit"
                className="lfi-btn lfi-btn--primary"
                disabled={status === "sending"}
              >
                <span className="lfi-btn__label">
                  {status === "sending"
                    ? "Sending…"
                    : ENDPOINT
                    ? "Send enquiry"
                    : "Compose in email client"}
                </span>
                {status === "sending" ? (
                  <span className="lfi-form__spinner" aria-hidden="true" />
                ) : null}
              </button>
              <p className="lfi-form__req">
                <span aria-hidden="true">*</span> Required
              </p>
            </div>

            {/* One live region for every outcome, so a screen reader hears
                the result without the focus being moved out from under it. */}
            <div role="status" aria-live="polite" className="lfi-form__status">
              {status === "sent" ? (
                <p className="lfi-form__ok">
                  <Icon name="check" size={16} />
                  Thank you &mdash; your enquiry was received. Someone from the
                  team will come back to you.
                </p>
              ) : null}

              {status === "handoff" ? (
                <p className="lfi-form__ok">
                  <Icon name="mail" size={16} />
                  Your email client should now be open with the message ready
                  to send to {contact.primaryEmail}. It has not been sent yet
                  &mdash; press send there. If nothing opened,{" "}
                  <a href={mailtoHref}>use this link</a>.
                </p>
              ) : null}

              {status === "error" ? (
                <p className="lfi-form__fail">
                  That did not go through. {failure} You can{" "}
                  <a href={mailtoHref}>send it by email instead</a>.
                </p>
              ) : null}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

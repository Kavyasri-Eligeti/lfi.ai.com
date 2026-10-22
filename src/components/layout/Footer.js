import React from "react";
import { Link } from "react-router-dom";
import Logo from "../ui/Logo";
import useReveal from "../ui/useReveal";
import Icon from "../ui/Icon";
import { company, contact, parentLinks, PARENT_SITE } from "../../data/company";
import { products } from "../../data/demos";
import { solutions } from "../../data/solutions";
import "./Footer.css";

/**
 * Footer.
 *
 * Only verified destinations: homepage sections that exist, the demo
 * catalogue, product demos that return 200, and the parent company's own
 * pages. LinkedIn is the one social link included because it is the one that
 * could be confirmed - the other icons on linkfields.com carry no href, so
 * they are not reproduced here as guesses.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  const ref = useReveal();

  return (
    <footer className="lfi-footer" ref={ref} data-reveal="" data-reveal-from="none">
      <div className="lfi-container">
        <div className="lfi-footer__top">
          <div className="lfi-footer__brand" style={{ "--lfi-c": 0 }}>
            <Logo height={40} />
            <p>
              The AI and analytics practice of {company.name}. We build
              intelligent systems for enterprises &mdash; and publish working
              demonstrations of every capability we describe.
            </p>
            <a
              className="lfi-footer__social"
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="external" size={15} />
              LinkedIn
            </a>
          </div>

          <nav className="lfi-footer__cols" aria-label="Footer">
            <div className="lfi-footer__col" style={{ "--lfi-c": 1 }}>
              <h2>Explore</h2>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <a href="/#solutions">AI solutions</a>
                </li>
                <li>
                  <a href="/#products">Products</a>
                </li>
                <li>
                  <a href="/#services">Services</a>
                </li>
                <li>
                  <a href="/#industries">Industries</a>
                </li>
                <li>
                  <Link to="/demos">Demo catalogue</Link>
                </li>
                <li>
                  <a href="/#contact">Contact</a>
                </li>
              </ul>
            </div>

            <div className="lfi-footer__col" style={{ "--lfi-c": 2 }}>
              <h2>Capabilities</h2>
              <ul>
                {solutions.map((s) => (
                  <li key={s.id}>
                    <a href="/#solutions">{s.title}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lfi-footer__col" style={{ "--lfi-c": 3 }}>
              <h2>Products</h2>
              <ul>
                {products.map((p) => (
                  <li key={p.id}>
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {p.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lfi-footer__col" style={{ "--lfi-c": 4 }}>
              <h2>Linkfields</h2>
              <ul>
                <li>
                  <a href={parentLinks.about} target="_blank" rel="noopener noreferrer">
                    About us
                  </a>
                </li>
                <li>
                  <a href={parentLinks.approach} target="_blank" rel="noopener noreferrer">
                    Our approach
                  </a>
                </li>
                <li>
                  <a href={parentLinks.aiml} target="_blank" rel="noopener noreferrer">
                    AI &amp; ML services
                  </a>
                </li>
                <li>
                  <a href={parentLinks.careers} target="_blank" rel="noopener noreferrer">
                    Careers
                  </a>
                </li>
                <li>
                  <a href={parentLinks.news} target="_blank" rel="noopener noreferrer">
                    News &amp; articles
                  </a>
                </li>
                <li>
                  <a href={parentLinks.contact} target="_blank" rel="noopener noreferrer">
                    Contact Linkfields
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="lfi-footer__contact">
          <a href={`mailto:${contact.primaryEmail}`}>
            <Icon name="mail" size={15} />
            {contact.primaryEmail}
          </a>
          <a href={`mailto:${contact.emails.general}`}>
            <Icon name="mail" size={15} />
            {contact.emails.general}
          </a>
          <a href={`mailto:${contact.emails.careers}`}>
            <Icon name="mail" size={15} />
            {contact.emails.careers}
          </a>
        </div>

        <div className="lfi-footer__bottom">
          <p>
            &copy; {year} {company.legalName}. {company.foundedNote}
          </p>
          <ul className="lfi-footer__legal">
            <li>
              <a href={parentLinks.privacy} target="_blank" rel="noopener noreferrer">
                Privacy policy
              </a>
            </li>
            <li>
              <a href={parentLinks.terms} target="_blank" rel="noopener noreferrer">
                Terms of use
              </a>
            </li>
            <li>
              <a href={parentLinks.cookies} target="_blank" rel="noopener noreferrer">
                Cookies policy
              </a>
            </li>
            <li>
              <a href={PARENT_SITE} target="_blank" rel="noopener noreferrer">
                linkfields.com
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

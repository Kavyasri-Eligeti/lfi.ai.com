import React, { useRef } from "react";
import Reveal from "../ui/Reveal";
import Icon from "../ui/Icon";
import Button from "../ui/Button";
import LineReveal from "../../motion/LineReveal";
import { insights, parentLinks } from "../../data/company";
import useGsap from "../../motion/useGsap";
import { gsap, EASE, prefersReducedMotion } from "../../motion";
import "./Insights.css";

/**
 * Insights & Updates.
 *
 * The three items featured on linkfields.com, with their published titles and
 * their real destinations - two external articles the company links out to,
 * and one post on its own blog.
 *
 * Nothing on this page is generated. There are no invented headlines, no
 * made-up publication dates, no "recent announcement" that was written to
 * fill a card. Dates are omitted rather than guessed, because the official
 * site does not publish them on these cards and a plausible-looking wrong
 * date is worse than none.
 *
 * ---------------------------------------------------------------------------
 * Why this is an INDEX and not a card grid.
 *
 * It was three cards. With no dates, no thumbnails and no summaries - none of
 * which this site can honestly supply - each card held a tag, a two-line
 * title and a source, and the rest of its height was empty. Three mostly
 * blank rectangles is what a card grid looks like when there is no card-shaped
 * content to put in it, and it made the section read as unfinished.
 *
 * The same three items set as a full-width editorial index have no empty
 * space to explain: a rule, a kind, a large title, a source. It is also the
 * only list of its shape on the page, which is the point - the products are a
 * grid, the capabilities are a selector, and this is an index.
 * ---------------------------------------------------------------------------
 */
export default function Insights() {
  const indexRef = useRef(null);

  useGsap(
    (root) => {
      if (prefersReducedMotion()) return;
      const items = gsap.utils.toArray(".lfi-insight", root);
      if (!items.length) return;

      gsap.from(items, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: EASE.out,
        scrollTrigger: {
          trigger: root,
          start: "top 88%",
          end: "bottom 68%",
          scrub: 0.5,
        },
      });
    },
    [],
    indexRef
  );

  return (
    <section
      className="lfi-section lfi-section--alt lfi-insights"
      id="insights"
      data-light="deep"
    >
      <div className="lfi-container">
        <div className="lfi-section-head">
          <div className="lfi-section-head__text">
            <Reveal as="p" className="lfi-eyebrow" from="left">
              Insights &amp; Updates
            </Reveal>
            <LineReveal as="h2" className="lfi-heading">
              Published by Linkfields, not written for this page.
            </LineReveal>
            <Reveal as="p" className="lfi-lede" delay={140}>
              The items featured on the official Linkfields site. Each one
              opens the original article at its source.
            </Reveal>
          </div>
          <Reveal delay={80} from="none">
            <Button href={parentLinks.news} variant="ghost">
              All news &amp; articles
            </Button>
          </Reveal>
        </div>

        <ol className="lfi-insights__index">
          {insights.map((item, i) => (
            <Reveal
              as="li"
              key={item.href}
              delay={Math.min(i * 110, 330)}
              from="none"
              className="lfi-insight"
            >
              <a
                className="lfi-insight__row"
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="lfi-insight__n" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="lfi-insight__kind">{item.kind}</span>
                <span className="lfi-insight__title">{item.title}</span>
                <span className="lfi-insight__source">{item.source}</span>
                <span className="lfi-insight__go" aria-hidden="true">
                  <Icon name="external" size={16} />
                </span>
                <span className="lfi-sr">(opens in a new tab)</span>
              </a>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

import React from "react";
import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";
import Icon from "../ui/Icon";
import Button from "../ui/Button";
import ProductMockup, { hasMockup } from "../ui/ProductMockup";
import { products, demos, TECH } from "../../data/demos";
import "./Products.css";

/**
 * The named products.
 *
 * Each one links to its own working demonstration - the same destinations the
 * current catalogue uses, all verified reachable. Nothing is described as
 * generally available or priced, because that is not something this site can
 * substantiate; the action is "open the demo", which is true.
 *
 * Each product is shown as its INTERFACE rather than as its logo on a plate:
 * a window frame carrying the real wordmark in its title bar, with the shape
 * of that product's interaction drawn inside it (see ui/ProductMockup). The
 * mockups contain no figures of any kind, and the caption says plainly that
 * they are illustrations - the live product is one click away, so there is
 * nothing to gain by letting a drawing be mistaken for a screenshot.
 */

const [lead, ...rest] = products;

/* The five named products are the branded portfolio; the catalogue holds
   every working demonstration behind them.

   Counted from `demos` - the same array the /demos page renders - rather than
   from `publicDemos`, so the CTA promises exactly what the destination shows.
   Counting the public ones here read "30" while the page it links to said
   "33 demonstrations", because the page also lists the three internal ones
   and labels them as such. A CTA that disagrees with its own destination is
   worse than no number at all. Computed rather than written into the copy, so
   it cannot drift when a demo is added or one goes dark. */
const catalogueCount = demos.length;

/**
 * The product's window: the mockup with the wordmark laid into its title bar.
 *
 * The wordmark is the real brand asset rather than drawn type, and it is
 * positioned in percentages against a fixed `aspect-ratio`, so it stays
 * registered to the drawn chrome at every size.
 *
 * Decorative throughout - the product is named in the heading beside it.
 */
function Screen({ product, className = "" }) {
  if (!hasMockup(product.id)) {
    // No drawn interface for this product. If it has a wordmark, show that;
    // if it has neither, set its name rather than emitting an <img> with no
    // src, which renders as a broken-image glyph.
    return (
      <span
        className={`lfi-product__screen lfi-product__screen--bare ${className}`.trim()}
      >
        {product.image ? (
          <img src={product.image} alt="" loading="lazy" decoding="async" />
        ) : (
          <span className="lfi-product__plate" aria-hidden="true">
            {product.name}
          </span>
        )}
      </span>
    );
  }

  return (
    <span className={`lfi-product__screen ${className}`.trim()}>
      <ProductMockup id={product.id} />
      {/* The wordmark is an overlay on the drawn title bar. A product with a
          mockup but no wordmark asset simply does without it - the product is
          named in the heading beside the window either way. */}
      {product.image ? (
        <img
          className="lfi-product__wordmark"
          src={product.image}
          alt=""
          loading="lazy"
          decoding="async"
        />
      ) : null}
    </span>
  );
}

function Tech({ ids }) {
  return (
    <ul className="lfi-product__tech">
      {ids.map((t) => (
        <li key={t}>{TECH[t]}</li>
      ))}
    </ul>
  );
}

export default function Products() {
  return (
    <section className="lfi-section lfi-section--alt lfi-products" id="products" data-light="amber">
      <div className="lfi-container">
        <div className="lfi-section-head">
          <SectionHeading
            eyebrow="Product portfolio"
            title="Products you can open, not screenshots of products."
            /* This used to read "Each of these is a working build with a
               public demonstration behind it", which stopped being true the
               moment the portfolio was completed: SiteSense has no public
               build. A blanket claim that one card on the same screen
               contradicts is worse than a precise one. */
            lede="Every one of these is a working build, and most have a public demonstration you can open and use - a faster way to judge the work than any case study. Where there is no public build, the card says so and points you at us."
          />
          <Reveal delay={80} from="none">
            <Button to="/demos" variant="ghost">
              Browse all {catalogueCount} demonstrations
            </Button>
          </Reveal>
        </div>

        <div className="lfi-products__layout">
          {/* Lead product - given the room its platform role deserves. */}
          <Reveal className="lfi-product lfi-product--lead lfi-surface lfi-surface--flush" from="scale">
            <div className="lfi-product__body">
              <p className="lfi-product__kicker">{lead.kicker}</p>
              <h3>{lead.name}</h3>
              <p className="lfi-product__blurb">{lead.blurb}</p>
              <Tech ids={lead.tech} />
              <Button href={lead.href} variant="primary" size="sm">
                Open {lead.name}
              </Button>
            </div>
            <div className="lfi-product__art" aria-hidden="true">
              <Screen product={lead} className="lfi-product__screen--lead" />
              <p className="lfi-product__caption">
                Interface illustration &mdash; open the demo for the live
                product.
              </p>
            </div>
          </Reveal>

          <ul className="lfi-products__grid">
            {rest.map((p, i) => {
              /* A product with no public build is still a product, and it
                 still gets a card. What it must NOT get is a fabricated demo
                 URL, so the card leads to the enquiry form instead and says
                 so. Same markup, different destination and affordance. */
              const hasDemo = Boolean(p.href);

              const body = (
                <>
                  <span className="lfi-hud-sweep" aria-hidden="true" />
                  <span className="lfi-hud-corners" aria-hidden="true" />
                  <Screen product={p} />
                  <p className="lfi-product__kicker">{p.kicker}</p>
                  <h3>
                    {p.name}
                    <Icon
                      name={hasDemo ? "external" : "mail"}
                      size={15}
                      className="lfi-product__ext"
                    />
                  </h3>
                  <p className="lfi-product__blurb">{p.blurb}</p>
                  <Tech ids={p.tech} />
                </>
              );

              return (
                <Reveal
                  as="li"
                  key={p.id}
                  delay={Math.min(i * 100, 400)}
                  className="lfi-product lfi-product--tile"
                >
                  {hasDemo ? (
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="lfi-product__link lfi-surface"
                    >
                      {body}
                      <span className="lfi-sr">(opens in a new tab)</span>
                    </a>
                  ) : (
                    <a href="#contact" className="lfi-product__link lfi-surface">
                      {body}
                      <span className="lfi-product__enquire">
                        Ask about {p.name}
                      </span>
                    </a>
                  )}
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

import React from "react";
import Reveal from "../ui/Reveal";
import SectionHeading from "../ui/SectionHeading";
import Icon from "../ui/Icon";
import Button from "../ui/Button";
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
 * Every card is the same: a frame with the product's own wordmark centred in
 * it, then the name, a short description and its tags. No product is
 * singled out as the lead.
 */


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
 * The product's window: one frame per card with the product's wordmark
 * centred in it - the same treatment for every product, so no card reads as
 * the lead. A product with no wordmark asset gets its name set in the frame
 * rather than an <img> with no src.
 *
 * Decorative - the product is named in the heading beneath it.
 */
function Screen({ product }) {
  return (
    <span className="lfi-product__screen lfi-product__screen--bare" aria-hidden="true">
      {product.image ? (
        <img src={product.image} alt="" loading="lazy" decoding="async" />
      ) : (
        <span className="lfi-product__plate">{product.name}</span>
      )}
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
            title="Linkfields software you can open and use."
            /* This used to read "Each of these is a working build with a
               public demonstration behind it", which stopped being true the
               moment the portfolio was completed: SiteSense has no public
               build. A blanket claim that one card on the same screen
               contradicts is worse than a precise one. */
            lede="Working builds with public demonstrations - a faster way to judge the work than any case study. Where there is no public build, the card points you at us."
          />
          <Reveal delay={80} from="none">
            <Button to="/demos" variant="ghost">
              Browse all {catalogueCount} demonstrations
            </Button>
          </Reveal>
        </div>

        {/* One compact grid of equal cards - no product is given the lead. */}
        <ul className="lfi-products__grid">
          {products.map((p, i) => {
            /* A product with no public build still gets a card, but never a
               fabricated demo URL: it leads to the enquiry form instead. */
            const hasDemo = Boolean(p.href);

            const body = (
              <>
                <span className="lfi-hud-sweep" aria-hidden="true" />
                <span className="lfi-hud-corners" aria-hidden="true" />
                <Screen product={p} />
                <div className="lfi-product__body">
                  <p className="lfi-product__kicker">{p.kicker}</p>
                  <h3>
                    {p.name}
                    <Icon
                      name={hasDemo ? "external" : "mail"}
                      size={14}
                      className="lfi-product__ext"
                    />
                  </h3>
                  <p className="lfi-product__blurb">{p.blurb}</p>
                  <Tech ids={p.tech} />
                  {!hasDemo ? (
                    <span className="lfi-product__enquire">Ask about {p.name}</span>
                  ) : null}
                </div>
              </>
            );

            return (
              <Reveal
                as="li"
                key={p.id}
                delay={Math.min(i * 70, 350)}
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
                  </a>
                )}
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/**
 * Cross-section portfolio selection.
 *
 * The hero chips and the "Who we are" pills are plain `#portfolios` anchors -
 * copyable, keyboard-activatable, scrolled by Lenis - and on click they also
 * tell the portfolio explorer which tab to open. A window event keeps the
 * sections decoupled: none of them has to share state or context.
 */
export const PORTFOLIO_EVENT = "lfi:portfolio";

export function selectPortfolio(id) {
  window.dispatchEvent(new CustomEvent(PORTFOLIO_EVENT, { detail: id }));
}

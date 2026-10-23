/**
 * Primary navigation.
 *
 * Every entry resolves to something that exists: a section rendered on the
 * homepage (`hash`) or a real route (`to`). Nothing here points at a page
 * that has not been built.
 *
 * Six items, not eleven. The page has more sections than this - Enterprise,
 * Services, Insights - and they are deliberately not in the header: a nav
 * that lists every anchor stops being navigation and becomes a table of
 * contents, and at 1024px a seventh item is what makes the bar wrap.
 */
export const NAV_LINKS = [
  { label: "Who we are", hash: "#who-we-are" },
  { label: "Portfolios", hash: "#portfolios" },
  { label: "Industries", hash: "#industries" },
  { label: "Products", hash: "#products" },
  { label: "Demos", to: "/demos" },
  { label: "Contact", hash: "#contact" },
];

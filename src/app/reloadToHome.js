// A refresh always starts the visitor again at the top of the homepage, where
// the AI mark's intro plays, whatever page they were on. Only reloads are
// affected: following a link, or opening a shared or typed URL, still lands
// on that page.
export function isReload(win = window) {
  const nav = win.performance?.getEntriesByType?.('navigation')?.[0];
  if (nav) return nav.type === 'reload';
  return win.performance?.navigation?.type === 1; // older browsers
}

export function reloadToHome(win = window) {
  // The site manages scroll itself (page transitions start each page at the
  // top), so the browser must never restore an old position over it.
  if ('scrollRestoration' in win.history) win.history.scrollRestoration = 'manual';
  if (!isReload(win)) return false;
  // Start at the very top, and again once the page has loaded, in case the
  // browser applies a scroll position it saved before the refresh.
  const top = () => win.scrollTo(0, 0);
  top();
  win.addEventListener?.('load', () => win.requestAnimationFrame?.(top) ?? top(), { once: true });
  const { pathname, search, hash } = win.location;
  if (pathname === '/' && !search && !hash) return false;
  win.history.replaceState(null, '', '/');
  return true;
}

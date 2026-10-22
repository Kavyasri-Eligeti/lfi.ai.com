/**
 * Per-route document metadata.
 *
 * This is a client-rendered CRA app, so crawlers that execute JavaScript pick
 * these up while the static tags in index.html remain the baseline for those
 * that do not. Deliberately dependency-free: a helmet library would be more
 * machinery than three tags need.
 */

const SITE = "https://lfiai.com";

function upsert(selector, create) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  return el;
}

function setTag(attr, key, content) {
  const el = upsert(`meta[${attr}="${key}"]`, () => {
    const m = document.createElement("meta");
    m.setAttribute(attr, key);
    return m;
  });
  el.setAttribute("content", content);
}

export function setMeta({ title, description, path = "/" }) {
  const url = `${SITE}${path}`;

  if (title) {
    document.title = title;
    setTag("property", "og:title", title);
    setTag("name", "twitter:title", title);
  }

  if (description) {
    setTag("name", "description", description);
    setTag("property", "og:description", description);
    setTag("name", "twitter:description", description);
  }

  setTag("property", "og:url", url);

  const canonical = upsert('link[rel="canonical"]', () => {
    const l = document.createElement("link");
    l.setAttribute("rel", "canonical");
    return l;
  });
  canonical.setAttribute("href", url);
}

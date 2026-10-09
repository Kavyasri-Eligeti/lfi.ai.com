import { useEffect } from 'react';

const SITE = 'Linkfields AI';

/** Sets document title and meta description per route. */
export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE}` : `${SITE}: Enterprise AI Solutions and Demos | Linkfields Innovations`;
    if (description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', description);
    }
  }, [title, description]);
}

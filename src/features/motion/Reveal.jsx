import { useCallback } from 'react';

// One IntersectionObserver for every reveal on the page (cheaper than an
// observer and animation controller per element). Reveals begin just before an
// element scrolls into view, so they have finished by the time it is seen.
let observer = null;
const getObserver = () => {
  if (observer || typeof IntersectionObserver === 'undefined') return observer;
  observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        observer.unobserve(e.target);
      }),
    { rootMargin: '0px 0px 18% 0px' }
  );
  return observer;
};

/** Section-content reveal: glides 16px into place once, staggered by `index`. */
export default function Reveal({ as: Tag = 'div', index = 0, step = 0.05, className = '', style, children, ...rest }) {
  const ref = useCallback((el) => {
    if (!el) return;
    const io = getObserver();
    if (io) io.observe(el);
    else el.classList.add('is-in'); // no observer: show at once
  }, []);
  const delay = Math.min(index * step, 0.18);
  return (
    <Tag
      ref={ref}
      className={`lf-rv${className ? ` ${className}` : ''}`}
      style={delay ? { ...style, '--rv-delay': `${Math.round(delay * 1000)}ms` } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}

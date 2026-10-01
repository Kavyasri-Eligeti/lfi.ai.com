import { useCallback } from 'react';

// One IntersectionObserver for every reveal on the page (cheaper than an
// observer and animation controller per element). Reveals are transform-only:
// content is fully painted from the first frame, so nothing depends on them.
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
    { rootMargin: '0px 0px -8% 0px' }
  );
  return observer;
};

/** Section-content reveal: glides 16px into place once, staggered by `index`. */
export default function Reveal({ as: Tag = 'div', index = 0, step = 0.05, className = '', style, children, ...rest }) {
  const ref = useCallback((el) => {
    if (el) getObserver()?.observe(el);
  }, []);
  const delay = Math.min(index * step, 0.3);
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

import { Link } from 'react-router-dom';
import { isLegacyPath } from '../../app/navigation';

/**
 * One link component for every destination:
 *  - new-site routes     → client-side <Link>
 *  - legacy app routes   → full page load (keeps legacy CSS isolated)
 *  - external URLs       → new tab, with an announced "(opens in a new tab)"
 */
export default function SmartLink({ href, children, className, ...rest }) {
  if (!href) return <span className={className}>{children}</span>;
  if (/^(mailto|tel):/.test(href)) {
    return (
      <a href={href} className={className} {...rest}>
        {children}
      </a>
    );
  }
  const internal = href.startsWith('/');
  if (internal && !isLegacyPath(href)) {
    return (
      <Link to={href} className={className} {...rest}>
        {children}
      </Link>
    );
  }
  if (internal) {
    return (
      <a href={href} className={className} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
      <span className="lf-visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}

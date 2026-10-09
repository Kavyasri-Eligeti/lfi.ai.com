import { Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import { Arrow } from '../components/ui/Icon';
import { usePageMeta } from '../hooks/usePageMeta';

export default function NotFoundPage() {
  usePageMeta('Page not found');
  return (
    <PageHero
      eyebrow="Error 404"
      title="This page could not be found"
      actions={
        <>
          <Link to="/" className="lf-btn">Back to the home page <Arrow /></Link>
          <Link to="/solutions#products" className="lf-btn lf-btn--secondary">Browse AI demos</Link>
        </>
      }
    >
      <p className="lf-lead">The page you are looking for does not exist or has moved. Every original lfiai.com link still works.</p>
    </PageHero>
  );
}

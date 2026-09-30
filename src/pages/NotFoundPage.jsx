import { Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero';
import { usePageMeta } from '../hooks/usePageMeta';

export default function NotFoundPage() {
  usePageMeta('Page not found');
  return (
    <PageHero
      eyebrow="404"
      title="This part of the universe is uncharted"
      actions={
        <>
          <Link to="/" className="lf-btn lf-btn--accent">Back to the AI universe</Link>
          <Link to="/demos" className="lf-btn lf-btn--ghost">Browse demos</Link>
        </>
      }
    >
      <p>The page you are looking for does not exist or has moved.</p>
    </PageHero>
  );
}

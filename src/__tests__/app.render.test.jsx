import { fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MotionProvider } from '../features/motion/MotionProvider';
import { routes } from '../app/router';
import { demos } from '../content/demos';
import { aiSolutions } from '../content/aiSolutions';
import { corporateServices } from '../content/services';

const renderAt = (path) => {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(
    <MotionProvider>
      <RouterProvider router={router} />
    </MotionProvider>
  );
  return router;
};

describe('the site renders without WebGL (CSS field tier)', () => {
  test('home renders the intro statement and the homepage sections, with no card section', async () => {
    renderAt('/');
    expect(await screen.findByRole('heading', { level: 1, name: /intelligence that moves business forward/i })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /explore ai solutions/i })[0]).toHaveAttribute('href', '/solutions');
    [/flagship ai products/i, /platforms enterprises run on/i].forEach((name) =>
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument()
    );
    expect(screen.queryByRole('heading', { level: 2, name: /what are you looking for/i })).toBeNull();
    expect(screen.queryByRole('searchbox', { name: /ask me anything/i })).toBeNull();
    expect(document.querySelector('canvas')).toBeNull();
  });

  test.each(['/solutions', '/services', '/industries', '/company', '/careers', '/contact'])('%s has no card section', async (path) => {
    renderAt(path);
    await screen.findByRole('heading', { level: 1 });
    expect(screen.queryByRole('heading', { level: 2, name: /what are you looking for/i })).toBeNull();
  });

  test('the footer comes once, at the end of the flow', async () => {
    renderAt('/services');
    await screen.findByRole('heading', { level: 1 });
    expect(screen.queryByRole('contentinfo')).toBeNull();
    expect(screen.getByRole('link', { name: /go to industries/i })).toBeInTheDocument();
  });

  test('the contact page ends the flow with the footer', async () => {
    renderAt('/contact');
    await screen.findByRole('heading', { level: 1 });
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  test('every page but the last leads on to the next chapter', async () => {
    renderAt('/services');
    await screen.findByRole('heading', { level: 1 });
    expect(screen.getByRole('link', { name: /go to industries/i })).toHaveAttribute('href', '/industries');
  });

  test.each([
    ['/solutions', /ai solutions for the modern enterprise/i],
    ['/services', /seven proven practices, and a new ai practice/i],
    ['/industries', /eight industries/i],
    ['/company', /driving innovation and transformation/i],
    ['/careers', /be part of a world-leading innovative team/i],
    ['/contact', /contact linkfields/i],
    ['/does-not-exist', /could not be found/i],
  ])('%s renders', async (path, title) => {
    renderAt(path);
    expect(await screen.findByRole('heading', { level: 1, name: title })).toBeInTheDocument();
  });

  test('the old /demos URL redirects to the catalogue', async () => {
    const router = renderAt('/demos');
    // The redirect waits for the page transition's exit.
    await screen.findByRole('heading', { level: 1, name: /ai solutions for the modern enterprise/i }, { timeout: 5000 });
    expect(router.state.location.pathname).toBe('/solutions');
    expect(router.state.location.hash).toBe('#products');
  });

  test('the catalogue lists every demo and filters by capability from the URL', async () => {
    renderAt('/solutions');
    await screen.findByRole('heading', { level: 1 });
    expect(within(document.getElementById('products')).getByRole('status')).toHaveTextContent(`Showing ${demos.length} of ${demos.length}`);
  });

  test('a capability filter in the URL narrows the catalogue', async () => {
    renderAt('/solutions?capability=computer-vision');
    await screen.findByRole('heading', { level: 1 });
    expect(within(document.getElementById('products')).getByRole('status')).toHaveTextContent(`Showing 1 of ${demos.length}`);
    const catalogue = document.getElementById('products');
    expect(within(catalogue).getByRole('link', { name: /golf pose analyzer/i })).toHaveAttribute('href', '/golf-analyzer');
  });

  test('the solutions page presents every AI solution', async () => {
    renderAt('/solutions');
    await screen.findByRole('heading', { level: 1 });
    aiSolutions.forEach((sol) => expect(screen.getByRole('heading', { level: 3, name: sol.name })).toBeInTheDocument());
  });

  test('every published service and AI services are tabs, one panel at a time', async () => {
    renderAt('/services');
    await screen.findByRole('heading', { level: 1 });
    // Every service is a tab; the chosen one fills the panel.
    [...corporateServices.map((x) => x.name), 'AI Services'].forEach((name) =>
      expect(screen.getByRole('tab', { name })).toBeInTheDocument()
    );
    expect(screen.getByRole('heading', { level: 2, name: corporateServices[0].name })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'AI Services' }));
    expect(await screen.findByRole('heading', { level: 2, name: 'AI Services' })).toBeInTheDocument();
    expect(screen.getByText('New practice')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2, name: corporateServices[0].name })).not.toBeInTheDocument();
  });

  test('the enquiry form validates before opening email', async () => {
    renderAt('/contact');
    fireEvent.click(await screen.findByRole('button', { name: /write the email/i }));
    expect(screen.getByText('Enter your name.')).toBeInTheDocument();
    expect(screen.getByText('Enter your email address.')).toBeInTheDocument();
    expect(screen.getByLabelText(/^name/i)).toHaveAttribute('aria-invalid', 'true');
  });

  test('offices show published details', async () => {
    renderAt('/company');
    const toggle = await screen.findByRole('button', { name: /hyderabad/i });
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(within(document.getElementById('offices')).getByText(/Gowra Fountain Head/)).toBeVisible();
  });

  test('skip link and primary navigation are present', async () => {
    renderAt('/solutions');
    await screen.findByRole('heading', { level: 1 });
    expect(screen.getByRole('link', { name: /skip to main content/i })).toHaveAttribute('href', '#main');
    expect(within(screen.getByRole('navigation', { name: 'Primary' })).getAllByRole('link')).toHaveLength(5);
  });
});

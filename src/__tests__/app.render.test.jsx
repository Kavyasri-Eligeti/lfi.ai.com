import { fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MotionProvider } from '../features/motion/MotionProvider';
import { routes } from '../app/router';
import { demos } from '../content/demos';
import { capabilities } from '../content/capabilities';

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
  test('home renders the hero, the capability index and every section', async () => {
    renderAt('/');
    expect(await screen.findByRole('heading', { level: 1, name: /intelligence that moves business forward/i })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /explore ai solutions/i })[0]).toHaveAttribute('href', '/solutions');
    const tabs = within(screen.getByRole('tablist', { name: /ai capabilities/i })).getAllByRole('tab');
    expect(tabs).toHaveLength(capabilities.length);
    [/flagship ai products/i, /seven engineering practices/i, /industries linkfields knows/i, /platforms enterprises run on/i, /six offices/i, /insights and news/i].forEach(
      (name) => expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument()
    );
    expect(document.querySelector('canvas')).toBeNull();
  });

  test('choosing a capability previews its demos', async () => {
    renderAt('/');
    const tab = await screen.findByRole('tab', { name: /fraud and risk/i });
    fireEvent.click(tab);
    expect(tab).toHaveAttribute('aria-selected', 'true');
    const panel = screen.getByRole('tabpanel', { name: /fraud and risk/i });
    expect(await within(panel).findByRole('link', { name: /signature fraud detection/i }, { timeout: 3000 })).toHaveAttribute(
      'href',
      'https://signaturefrauddetect.lfidemo.com/'
    );
  });

  test.each([
    ['/solutions', /enterprise solutions and ai products/i],
    ['/services', /seven practices behind every linkfields solution/i],
    ['/industries', /eight industries/i],
    ['/company', /driving innovation and transformation/i],
    ['/careers', /be part of a world-leading innovative team/i],
    ['/contact', /what you want to build/i],
    ['/does-not-exist', /could not be found/i],
  ])('%s renders', async (path, title) => {
    renderAt(path);
    expect(await screen.findByRole('heading', { level: 1, name: title })).toBeInTheDocument();
  });

  test('the old /demos URL redirects to the catalogue', async () => {
    const router = renderAt('/demos');
    await screen.findByRole('heading', { level: 1, name: /enterprise solutions and ai products/i });
    expect(router.state.location.pathname).toBe('/solutions');
    expect(router.state.location.hash).toBe('#products');
  });

  test('the catalogue lists every demo and filters by capability from the URL', async () => {
    renderAt('/solutions');
    await screen.findByRole('heading', { level: 1 });
    expect(screen.getByRole('status')).toHaveTextContent(`Showing ${demos.length} of ${demos.length}`);
  });

  test('a capability filter in the URL narrows the catalogue', async () => {
    renderAt('/solutions?capability=computer-vision');
    await screen.findByRole('heading', { level: 1 });
    expect(screen.getByRole('status')).toHaveTextContent(`Showing 1 of ${demos.length}`);
    const catalogue = document.getElementById('products');
    expect(within(catalogue).getByRole('link', { name: /golf pose analyzer/i })).toHaveAttribute('href', '/golf-analyzer');
  });

  test('proposed offerings are labelled as proposed', async () => {
    renderAt('/solutions');
    await screen.findByRole('heading', { level: 2, name: /ai solution areas under review/i });
    expect(screen.getAllByText(/Proposed · (awaiting approval|demo-backed)/).length).toBeGreaterThan(10);
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
    expect(screen.getByText(/Gowra Fountain Head/)).toBeVisible();
  });

  test('skip link and primary navigation are present', async () => {
    renderAt('/solutions');
    await screen.findByRole('heading', { level: 1 });
    expect(screen.getByRole('link', { name: /skip to main content/i })).toHaveAttribute('href', '#main');
    expect(within(screen.getByRole('navigation', { name: 'Primary' })).getAllByRole('link')).toHaveLength(5);
  });
});

import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MotionProvider } from '../features/motion/MotionProvider';
import { routes } from '../app/router';
import { demos } from '../content/demos';
import { aiServicePractice, corporateServices } from '../content/services';

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
    expect(screen.getAllByRole('link', { name: /browse live demos/i })[0]).toHaveAttribute('href', '/catalogue');
    [/flagship ai products/i, /platforms enterprises run on/i].forEach((name) =>
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument()
    );
    expect(screen.queryByRole('heading', { level: 2, name: /what are you looking for/i })).toBeNull();
    expect(screen.queryByRole('searchbox', { name: /ask me anything/i })).toBeNull();
    expect(document.querySelector('canvas')).toBeNull();
  });

  test.each(['/services', '/industries', '/company', '/careers', '/contact'])('%s has no card section', async (path) => {
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
    ['/services', /ai services, from strategy to production/i],
    ['/industries', /eight industries/i],
    ['/company', /driving innovation and transformation/i],
    ['/careers', /be part of a world-leading innovative team/i],
    ['/contact', /contact linkfields/i],
    ['/does-not-exist', /could not be found/i],
  ])('%s renders', async (path, title) => {
    renderAt(path);
    expect(await screen.findByRole('heading', { level: 1, name: title })).toBeInTheDocument();
  });

  test('the old /demos URL redirects to the classic catalogue', async () => {
    const router = renderAt('/demos');
    await waitFor(() => expect(router.state.location.pathname).toBe('/catalogue'), { timeout: 5000 });
  });

  test('the removed AI Solutions page redirects home and is gone from the navigation', async () => {
    const router = renderAt('/solutions');
    await waitFor(() => expect(router.state.location.pathname).toBe('/'), { timeout: 5000 });
    expect(within(screen.getByRole('navigation', { name: 'Primary' })).queryByRole('link', { name: /ai solutions/i })).toBeNull();
  });

  test('the services page shows only the AI services', async () => {
    renderAt('/services');
    await screen.findByRole('heading', { level: 1 });
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toContain('AI Services');
    corporateServices.forEach((x) => expect(screen.queryByRole('heading', { level: 2, name: x.name })).toBeNull());
    aiServicePractice.subServices.forEach((sub) => expect(screen.getByText(sub.name)).toBeInTheDocument());
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
    renderAt('/services');
    await screen.findByRole('heading', { level: 1 });
    expect(screen.getByRole('link', { name: /skip to main content/i })).toHaveAttribute('href', '#main');
    expect(within(screen.getByRole('navigation', { name: 'Primary' })).getAllByRole('link')).toHaveLength(4);
  });
});

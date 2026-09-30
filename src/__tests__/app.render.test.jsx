import { render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MotionProvider } from '../features/motion/MotionProvider';
import { routes } from '../app/router';

const renderAt = (path) => {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(
    <MotionProvider>
      <RouterProvider router={router} />
    </MotionProvider>
  );
  return router;
};

describe('the site works without WebGL (static profile)', () => {
  test('home renders the hero, the chapters and a planet index', async () => {
    renderAt('/');
    expect(await screen.findByRole('heading', { level: 1, name: /explore the universe of enterprise ai/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /enterprise platforms/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /constellation of eight industries/i })).toBeInTheDocument();
    const planetNav = screen.getByRole('navigation', { name: /ai categories/i });
    expect(within(planetNav).getAllByRole('link')).toHaveLength(8);
    expect(document.querySelector('canvas')).toBeNull();
  });

  test('a planet deep link renders its verified content', async () => {
    renderAt('/universe/fraud-risk');
    expect(await screen.findByRole('heading', { level: 1, name: 'Fraud & Risk Intelligence' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Signature Fraud Detection/ })).toHaveAttribute(
      'href',
      'https://signaturefrauddetect.lfidemo.com/'
    );
    expect(screen.getByRole('link', { name: /back to the universe/i })).toHaveAttribute('href', '/');
  });

  test('the proposed planet is labelled as proposed', async () => {
    renderAt('/universe/ai-agents');
    await screen.findByRole('heading', { level: 1, name: 'AI Agents' });
    expect(screen.getAllByText(/Proposed · awaiting approval/).length).toBeGreaterThan(0);
  });

  test.each([
    ['/solutions', /enterprise solutions and ai products/i],
    ['/services', /services that turn technology into outcomes/i],
    ['/industries', /constellation of industries/i],
    ['/company', /driving innovation and transformation/i],
    ['/careers', /be part of a world-leading innovative team/i],
    ['/contact', /build what.s next/i],
    ['/demos', /demo catalogue/i],
    ['/does-not-exist', /uncharted/i],
  ])('%s renders', async (path, title) => {
    renderAt(path);
    expect(await screen.findByRole('heading', { level: 1, name: title })).toBeInTheDocument();
  });

  test('skip link and primary navigation are present', async () => {
    renderAt('/solutions');
    await screen.findByRole('heading', { level: 1 });
    expect(screen.getByRole('link', { name: /skip to main content/i })).toHaveAttribute('href', '#main');
    expect(within(screen.getByRole('navigation', { name: 'Primary' })).getAllByRole('link')).toHaveLength(8);
  });
});

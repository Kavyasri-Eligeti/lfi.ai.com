import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { MotionProvider } from '../features/motion/MotionProvider';
import { routes } from '../app/router';
import { demos } from '../content/demos';
import { aiSolutions } from '../content/aiSolutions';
import { FEATURED, PAGE_THEATRES } from '../content/theatreCards';
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
  test('home renders the statement, the card deck and its filters', async () => {
    renderAt('/');
    expect(await screen.findByRole('heading', { level: 1, name: /intelligence that moves business forward/i })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /explore ai solutions/i })[0]).toHaveAttribute('href', '/solutions');
    const deck = screen.getByRole('list', { name: /linkfields ai solutions, services, industries and tools/i });
    expect(within(deck).getAllByRole('link')).toHaveLength(FEATURED.length);
    expect(screen.getByRole('heading', { level: 2, name: /what are you looking for/i })).toBeInTheDocument();
    [/flagship ai products/i, /platforms enterprises run on/i].forEach((name) =>
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument()
    );
    expect(document.querySelector('canvas')).toBeNull();
  });

  test('a filter shows its cards, and choosing it again restores the mix', async () => {
    renderAt('/');
    const security = await screen.findByRole('button', { name: /ai security/i });
    fireEvent.click(security);
    expect(security).toHaveAttribute('aria-pressed', 'true');
    const deck = screen.getByRole('list', { name: /linkfields ai solutions, services, industries and tools/i });
    expect(within(deck).getByRole('link', { name: /bedrock guardrails/i })).toHaveAttribute('href', '/solutions#ai-governance');
    fireEvent.click(security);
    expect(within(deck).getAllByRole('link')).toHaveLength(FEATURED.length);
  });

  test('ask me anything searches every card', async () => {
    jest.useFakeTimers();
    renderAt('/');
    const ask = await screen.findByRole('searchbox', { name: /ask me anything/i });
    fireEvent.change(ask, { target: { value: 'fraud' } });
    act(() => { jest.advanceTimersByTime(300); });
    const deck = screen.getByRole('list', { name: /linkfields ai solutions, services, industries and tools/i });
    expect(within(deck).getByRole('link', { name: /fraud, risk and anomaly detection/i })).toHaveAttribute('href', '/solutions#fraud-risk');
    jest.useRealTimers();
  });

  test.each([
    ['/solutions', 'solutions', /ai solutions and enterprise platforms/i],
    ['/services', 'services', /practices and ai services/i],
    ['/industries', 'industries', /industries linkfields serves/i],
    ['/company', 'company', /values and offices/i],
    ['/careers', 'careers', /life and roles/i],
    ['/contact', 'contact', /ways to reach linkfields/i],
  ])('%s continues the card theatre with its own cards', async (path, key, name) => {
    renderAt(path);
    await screen.findByRole('heading', { level: 1 });
    const deck = screen.getByRole('list', { name });
    expect(within(deck).getAllByRole('link')).toHaveLength(PAGE_THEATRES[key].cards.length);
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
    ['/contact', /what you want to build/i],
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

  test('AI services are listed alongside every published service', async () => {
    renderAt('/services');
    await screen.findByRole('heading', { level: 1 });
    [...corporateServices.map((x) => x.name), 'AI Services'].forEach((name) =>
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument()
    );
    expect(screen.getByText('New practice')).toBeInTheDocument();
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

import { reloadToHome } from '../app/reloadToHome';

const fakeWindow = (type, path) => {
  const [pathname, hash = ''] = path.split('#');
  const win = {
    performance: { getEntriesByType: () => [{ type }] },
    history: { scrollRestoration: 'auto', replaceState: jest.fn() },
    location: { pathname, search: '', hash: hash ? `#${hash}` : '' },
    scrollTo: jest.fn(),
  };
  return win;
};

describe('a refresh returns to the homepage', () => {
  test('reloading any page goes to the top of the homepage', () => {
    const win = fakeWindow('reload', '/services#cloud');
    expect(reloadToHome(win)).toBe(true);
    expect(win.history.replaceState).toHaveBeenCalledWith(null, '', '/');
    expect(win.scrollTo).toHaveBeenCalledWith(0, 0);
    expect(win.history.scrollRestoration).toBe('manual');
  });

  test('reloading the homepage starts again at the top', () => {
    const win = fakeWindow('reload', '/');
    expect(reloadToHome(win)).toBe(false);
    expect(win.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  test('opening a link or a shared URL is left alone', () => {
    const win = fakeWindow('navigate', '/solutions');
    expect(reloadToHome(win)).toBe(false);
    expect(win.history.replaceState).not.toHaveBeenCalled();
    expect(win.scrollTo).not.toHaveBeenCalled();
    expect(win.history.scrollRestoration).toBe('manual');
  });
});

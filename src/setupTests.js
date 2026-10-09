// Jest (jsdom) environment setup.
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextEncoder, TextDecoder });

// jsdom has no layout/observer APIs. Minimal stand-ins are enough for rendering tests.
class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
global.IntersectionObserver = global.IntersectionObserver || NoopObserver;
global.ResizeObserver = global.ResizeObserver || NoopObserver;
window.matchMedia =
  window.matchMedia ||
  ((query) => ({
    matches: false,
    media: query,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
  }));
window.scrollTo = () => {};
Element.prototype.scrollIntoView = function scrollIntoView() {};
// jsdom has no WebGL, so the app must fall back to the STATIC profile.
HTMLCanvasElement.prototype.getContext = () => null;

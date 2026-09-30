// Rendering profiles. The profile controls every cost lever of the 3D scenes.
// Selection order: URL override (?profile=) → reduced motion → WebGL support →
// device heuristics. PerformanceGovernor (engine) can later step down further.

export const PROFILES = {
  high: {
    name: 'high',
    maxDpr: 1.75,
    stars: 7000,
    segments: 96,
    bloom: true,
    bloomScale: 0.75,
    msaa: 4,
    nebula: true,
    emblemRings: 3,
    emblemNodes: 14,
    moons: true,
    parallax: true,
  },
  balanced: {
    name: 'balanced',
    maxDpr: 1.5,
    stars: 3800,
    segments: 64,
    bloom: true,
    bloomScale: 0.5,
    msaa: 0,
    nebula: true,
    emblemRings: 3,
    emblemNodes: 10,
    moons: true,
    parallax: true,
  },
  light: {
    name: 'light',
    maxDpr: 1.25,
    stars: 1400,
    segments: 40,
    bloom: false,
    bloomScale: 0,
    msaa: 0,
    nebula: false,
    emblemRings: 2,
    emblemNodes: 6,
    moons: false,
    parallax: false,
  },
  static: { name: 'static' },
};

export function hasWebGL() {
  try {
    const canvas = document.createElement('canvas');
    // three r180 renders with WebGL2 only.
    const gl = canvas.getContext('webgl2');
    if (!gl) return { ok: false };
    let renderer = '';
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    if (info) renderer = String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return { ok: true, renderer };
  } catch {
    return { ok: false };
  }
}

export function detectProfile({ reducedMotion }) {
  if (typeof window === 'undefined') return 'static';

  const override = new URLSearchParams(window.location.search).get('profile');
  if (override && PROFILES[override]) return override;
  if (reducedMotion) return 'static';

  const gl = hasWebGL();
  if (!gl.ok) return 'static';
  const r = gl.renderer.toLowerCase();
  if (/swiftshader|llvmpipe|software|basic render/.test(r)) return 'static';

  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  const coarse = window.matchMedia?.('(pointer: coarse)').matches;
  const shortSide = Math.min(window.screen?.width || 1024, window.screen?.height || 768);
  const saveData = navigator.connection?.saveData;

  if (saveData) return 'light';
  if ((coarse && shortSide < 820) || memory <= 2 || cores <= 2) return 'light';
  if (coarse || cores <= 4 || memory <= 4 || /intel|mali|adreno [1-5]/.test(r)) return 'balanced';
  if (window.innerWidth >= 1200 && cores >= 8) return 'high';
  return 'balanced';
}

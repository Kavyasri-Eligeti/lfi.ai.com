// The homepage theatre (plain Three.js, lazy-loaded). Original scene code.
// The scene has three modes, chosen by the page:
//  hero  (homepage) The DNA data spine stands centre-right from the first
//        frame, with the glass cards spiralling around it and cycling on their
//        own, slowly and without end (the spiral is endless: cards and spine
//        repeat along it). When the work section scrolls in, the scroll takes
//        over the spiral, card by card, and hands back when it leaves.
//  mark  (legacy intro) The Linkfields AI mark as a thick iridescent glass
//        ring with an extruded "AI", two ribbons of light drawing a crossing
//        loop beneath it, and drifting bokeh; the ring turns edge-on through
//        the headline, then rises away before the spine and cards appear.
//  plain (other pages) The spine and cards rise as the work section scrolls in.
// In every mode scrolling turns the spiral so each card in turn swings to the
// front, with a glitch, a flowing painterly surface and an RGB-split title.
// Scroll position comes from DOM sections, so the page's real content, links
// and focus order stay in the DOM.
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  Clock,
  Color,
  CylinderGeometry,
  DoubleSide,
  Group,
  InstancedMesh,
  MathUtils,
  Matrix4,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Quaternion,
  Raycaster,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  SRGBColorSpace,
  TextureLoader,
  TorusGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import fontJson from 'three/examples/fonts/helvetiker_bold.typeface.json';
import { drawCardFace } from './cardFace';

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (a, b, v) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeOutCubic = (t) => 1 - (1 - t) ** 3;

const OUTPUT = /* glsl */ `
  #include <colorspace_fragment>
`;
const NOISE = /* glsl */ `
  float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
  float noise(vec3 x) {
    vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
      mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
  }
  float fbm(vec3 p) { float v = 0.0; float a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; } return v; }
`;
// Thin-film interference: the rainbow sheen of oil on water and coated glass.
const FILM = /* glsl */ `
  vec3 film(float x) { return 0.5 + 0.5 * cos(6.28318 * (vec3(0.0, 0.33, 0.67) + x)); }
`;

// ---------- Iridescent glass / chrome ----------
function iridescent({ opacity = 1, tint = '#ffffff', strength = 1 } = {}) {
  return new ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uOpacity: { value: opacity }, uTint: { value: new Color(tint) }, uStrength: { value: strength } },
    vertexShader: /* glsl */ `
      varying vec3 vN; varying vec3 vView; varying vec3 vObj;
      void main() {
        vec3 pos = position;
        vec3 nor = normal;
        #ifdef USE_INSTANCING
          pos = (instanceMatrix * vec4(position, 1.0)).xyz;
          nor = mat3(instanceMatrix) * normal;
        #endif
        vObj = pos;
        vN = normalize(normalMatrix * nor);
        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uTime; uniform float uOpacity; uniform vec3 uTint; uniform float uStrength;
      varying vec3 vN; varying vec3 vView; varying vec3 vObj;
      ${FILM}
      void main() {
        vec3 N = normalize(vN); vec3 V = normalize(vView);
        float ndv = max(dot(N, V), 0.0);
        float fres = pow(1.0 - ndv, 2.2);
        vec3 R = reflect(-V, N);
        // A soft studio environment: dark floor, teal-lavender sky, one key light.
        float sky = smoothstep(-0.3, 0.9, R.y);
        vec3 env = mix(vec3(0.015, 0.02, 0.03), mix(vec3(0.16, 0.36, 0.38), vec3(0.42, 0.36, 0.7), smoothstep(0.2, 1.0, R.x * 0.5 + 0.5)), sky);
        env += vec3(1.0, 0.95, 0.9) * pow(max(dot(R, normalize(vec3(0.35, 0.75, 0.55))), 0.0), 60.0) * 2.5;
        env += vec3(1.0, 0.45, 0.55) * pow(max(dot(R, normalize(vec3(-0.7, -0.2, 0.6))), 0.0), 24.0) * 0.9;
        vec3 f = film(fres * 1.4 + vObj.y * 0.08 + vObj.x * 0.05 + uTime * 0.02);
        vec3 col = env * 0.75 + f * fres * 1.25 * uStrength + f * 0.06;
        col *= uTint;
        gl_FragColor = vec4(col, uOpacity * (0.6 + fres * 0.4));
        ${OUTPUT}
      }`,
    transparent: true,
  });
}

// ---------- Bokeh particles ----------
// shape 'column' fills a cylinder of radius spread.r around the y axis. With
// spread.tile the column repeats every `tile` units of height (three copies),
// so it can be moved by whole tiles without a visible change.
function bokeh({ count, spread, colors, sizeRange = [6, 26], shape = 'box' }) {
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const size = new Float32Array(count);
  const seed = new Float32Array(count);
  const palette = colors.map((c) => new Color(c));
  const tile = shape === 'column' && spread.tile;
  const base = tile ? Math.ceil(count / 3) : count;
  for (let i = 0; i < count; i += 1) {
    if (shape === 'column') {
      const a = Math.random() * Math.PI * 2;
      const r = 1.4 + Math.random() ** 1.5 * spread.r;
      pos.set([Math.cos(a) * r, spread.y0 + Math.random() * (spread.y1 - spread.y0), Math.sin(a) * r], i * 3);
    } else {
      pos.set([(Math.random() - 0.5) * spread.x, spread.y0 + Math.random() * (spread.y1 - spread.y0), (Math.random() - 0.5) * spread.z], i * 3);
    }
    const c = palette[Math.floor(Math.random() * palette.length)];
    col.set([c.r, c.g, c.b], i * 3);
    size[i] = sizeRange[0] + Math.random() ** 2.5 * (sizeRange[1] - sizeRange[0]);
    seed[i] = Math.random();
  }
  if (tile) {
    // Copies above and below the base tile, identical in colour, size and drift.
    for (let i = base; i < count; i += 1) {
      const j = i % base;
      const k = Math.floor(i / base) === 1 ? 1 : -1;
      pos.set([pos[j * 3], pos[j * 3 + 1] + k * tile, pos[j * 3 + 2]], i * 3);
      col.set([col[j * 3], col[j * 3 + 1], col[j * 3 + 2]], i * 3);
      size[i] = size[j];
      seed[i] = seed[j];
    }
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  geo.setAttribute('aColor', new BufferAttribute(col, 3));
  geo.setAttribute('aSize', new BufferAttribute(size, 1));
  geo.setAttribute('aSeed', new BufferAttribute(seed, 1));
  const mat = new ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPixel: { value: 1 }, uOpacity: { value: 1 }, uRise: { value: 0.12 } },
    vertexShader: /* glsl */ `
      attribute vec3 aColor; attribute float aSize; attribute float aSeed;
      uniform float uTime; uniform float uPixel; uniform float uRise;
      varying vec3 vColor; varying float vTw;
      void main() {
        vec3 p = position;
        p.y += mod(uTime * uRise * (0.4 + aSeed), 6.0) - 3.0;
        p.x += sin(uTime * 0.3 + aSeed * 20.0) * 0.15;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = aSize * uPixel / -mv.z;
        vColor = aColor;
        vTw = 0.55 + 0.45 * sin(uTime * (0.6 + aSeed) + aSeed * 40.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform float uOpacity;
      varying vec3 vColor; varying float vTw;
      void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        if (d > 1.0) discard;
        // Bokeh: a soft disc with a brighter rim.
        float disc = smoothstep(1.0, 0.82, d);
        float rim = smoothstep(0.7, 0.95, d) * disc;
        float a = (disc * 0.45 + rim * 0.55) * vTw * uOpacity;
        gl_FragColor = vec4(vColor * 1.4, a);
        ${OUTPUT}
      }`,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  return new Points(geo, mat);
}

// ---------- 1. The AI mark ----------
function createMark() {
  const group = new Group();
  const ringMat = iridescent({ opacity: 0.95, strength: 1.9 });
  const ring = new Mesh(new TorusGeometry(1.5, 0.19, 64, 240), ringMat);
  group.add(ring);

  const font = new FontLoader().parse(fontJson);
  const textGeo = new TextGeometry('AI', { font, size: 1.05, depth: 0.32, curveSegments: 10, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.035, bevelSegments: 4 });
  textGeo.center();
  const textMat = iridescent({ opacity: 1, tint: '#ffe2c4', strength: 1.3 });
  const text = new Mesh(textGeo, textMat);
  group.add(text);

  // Two ribbons of light that fall from the ring and cross in a loop.
  const strand = (s) => new CatmullRomCurve3([
    new Vector3(-1.05 * s, -1.08, 0),
    new Vector3(-1.2 * s, -2.3, 0.25),
    new Vector3(-0.75 * s, -3.7, 0.15),
    new Vector3(0, -4.7, 0),
    new Vector3(0.85 * s, -5.8, -0.2),
    new Vector3(1.5 * s, -7.4, -0.35),
    new Vector3(2.1 * s, -9.2, -0.4),
  ]);
  const ribbonMat = new ShaderMaterial({
    uniforms: { uDraw: { value: 0 }, uTime: { value: 0 }, uOpacity: { value: 1 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv; varying vec3 vN; varying vec3 vView;
      void main() {
        vUv = uv;
        vN = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uDraw; uniform float uTime; uniform float uOpacity;
      varying vec2 vUv; varying vec3 vN; varying vec3 vView;
      ${FILM}
      void main() {
        if (vUv.x > uDraw) discard;
        float fres = pow(1.0 - max(dot(normalize(vN), normalize(vView)), 0.0), 1.6);
        vec3 base = mix(vec3(1.0, 0.36, 0.48), vec3(0.45, 0.12, 0.2), vUv.x);
        vec3 col = base * (0.35 + fres) + film(fres + vUv.x * 2.0 + uTime * 0.05) * fres * 0.6;
        float tail = smoothstep(1.0, 0.65, vUv.x);
        float head = smoothstep(uDraw, uDraw - 0.04, vUv.x);
        gl_FragColor = vec4(col, uOpacity * tail * (0.35 + 0.65 * head));
        ${OUTPUT}
      }`,
    transparent: true,
    depthWrite: false,
  });
  const ribbons = [1, -1].map((s) => new Mesh(new TubeGeometry(strand(s), 220, 0.032, 10, false), ribbonMat));
  ribbons.forEach((r) => group.add(r));

  const dust = bokeh({ count: 420, spread: { x: 10, z: 6, y0: -9, y1: -1 }, colors: ['#ff6f91', '#ffb547', '#ff8a5c', '#6fe3d3'], sizeRange: [10, 70] });
  group.add(dust);

  return { group, ring, text, ringMat, textMat, ribbonMat, dust };
}

// ---------- 3. The data spine ----------
const STEP = 2.5; // vertical distance between cards
const TURN = 0.9; // radians between cards around the spine
const ORBIT = 3.6; // card distance from the spine
const COIL = 0.55; // radians the strands twist per unit of height
// The helix repeats every PERIOD units of height, and so does everything on
// it (rungs, nodes, dust). The spine is a few periods long and is moved by
// whole periods to stay around the camera, so it never ends.
const PERIOD = (Math.PI * 2) / COIL;
const RUNGS_PER_PERIOD = 21;
const RUNG = PERIOD / RUNGS_PER_PERIOD;
const SPINE_HALF = PERIOD * 2;

function createSpine({ lite = false } = {}) {
  const group = new Group();
  const mat = iridescent({ opacity: 0.92, strength: 1.2 });
  const top = SPINE_HALF;
  const bottom = -SPINE_HALF;
  const helix = (phase) => {
    const pts = [];
    for (let y = top; y >= bottom; y -= 0.25) {
      const a = y * COIL + phase;
      pts.push(new Vector3(Math.cos(a) * 0.95, y, Math.sin(a) * 0.95));
    }
    return new CatmullRomCurve3(pts);
  };
  const segs = Math.round((top - bottom) * (lite ? 6 : 10));
  [0, Math.PI].forEach((ph) => group.add(new Mesh(new TubeGeometry(helix(ph), segs, 0.16, lite ? 8 : 12, false), mat)));

  // Rungs between the strands, with glowing nodes at their ends.
  const count = Math.round((top - bottom) / RUNG);
  const rungGeo = new CylinderGeometry(0.045, 0.045, 1.9, 8, 1);
  const rungs = new InstancedMesh(rungGeo, mat, count);
  const nodeMat = new ShaderMaterial({
    vertexShader: /* glsl */ `
      varying float vY;
      void main() { vec4 w = instanceMatrix * vec4(position, 1.0); vY = w.y; gl_Position = projectionMatrix * modelViewMatrix * w; }`,
    fragmentShader: /* glsl */ `
      varying float vY;
      void main() {
        vec3 a = vec3(0.43, 0.89, 0.83); vec3 b = vec3(0.71, 0.64, 1.0);
        gl_FragColor = vec4(mix(a, b, 0.5 + 0.5 * sin(vY * ${COIL.toFixed(4)})) * 0.85, 1.0);
        ${OUTPUT}
      }`,
  });
  const nodes = new InstancedMesh(new SphereGeometry(0.08, 12, 8), nodeMat, count * 2);
  const m = new Matrix4();
  const q = new Quaternion();
  const zAxis = new Vector3(0, 0, 1);
  for (let i = 0; i < count; i += 1) {
    const y = top - i * RUNG;
    const a = y * COIL;
    q.setFromAxisAngle(new Vector3(0, 1, 0), -a);
    const tilt = new Quaternion().setFromAxisAngle(zAxis, Math.PI / 2);
    m.compose(new Vector3(0, y, 0), q.clone().multiply(tilt), new Vector3(1, 1, 1));
    rungs.setMatrixAt(i, m);
    [0, Math.PI].forEach((ph, k) => {
      m.compose(new Vector3(Math.cos(a + ph) * 0.95, y, Math.sin(a + ph) * 0.95), new Quaternion(), new Vector3(1, 1, 1));
      nodes.setMatrixAt(i * 2 + k, m);
    });
  }
  group.add(rungs, nodes);

  // Fine particles around the spine, repeating with it.
  const dust = bokeh({
    count: lite ? 480 : 1400,
    spread: { r: 5.5, y0: -PERIOD / 2, y1: PERIOD / 2, tile: PERIOD },
    colors: ['#ff6f91', '#b4a2ff', '#6fe3d3', '#539fe5', '#ffb547'],
    sizeRange: [8, 60],
    shape: 'column',
  });
  dust.material.uniforms.uRise.value = 0.05;
  group.add(dust);
  return { group, mat, dust };
}

// ---------- The backdrop: a technical grid and atmospheric light ----------
// A large plane behind the spine. Its grid is locked to the world, so it
// passes by as the camera travels down the spine; its light and vignette are
// locked to the camera.
const BACKDROP = 110;
function createBackdrop() {
  const mat = new ShaderMaterial({
    uniforms: { uOpacity: { value: 0 }, uCamY: { value: 0 }, uTime: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uOpacity; uniform float uCamY; uniform float uTime;
      varying vec2 vUv;
      float gridLine(vec2 g) {
        vec2 f = abs(fract(g - 0.5) - 0.5) / fwidth(g);
        return 1.0 - min(min(f.x, f.y), 1.0);
      }
      void main() {
        vec2 p = (vUv - 0.5) * ${BACKDROP.toFixed(1)};
        vec2 w = vec2(p.x, p.y + uCamY);
        float fine = gridLine(w / 2.5);
        float major = gridLine(w / 12.5);
        float d = length(p * vec2(1.0, 1.25)) / 34.0;
        float vig = smoothstep(1.0, 0.1, d);
        vec3 lines = vec3(0.55, 0.85, 0.9) * (fine * 0.012 + major * 0.03) * vig;
        // Atmosphere: a cool cyan light high on the right, violet low on the left.
        float c1 = exp(-length(p - vec2(7.0, 10.0)) * 0.075);
        float c2 = exp(-length(p - vec2(-7.0, -12.0)) * 0.07);
        float breathe = 0.9 + 0.1 * sin(uTime * 0.25);
        vec3 glow = vec3(0.12, 0.5, 0.56) * c1 * 0.075 * breathe + vec3(0.34, 0.24, 0.68) * c2 * 0.08;
        // Light only (premultiplied, no alpha): the page stays visible behind.
        gl_FragColor = vec4((lines + glow) * uOpacity, 0.0);
        ${OUTPUT}
      }`,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    premultipliedAlpha: true,
  });
  const mesh = new Mesh(new PlaneGeometry(BACKDROP, BACKDROP), mat);
  mesh.renderOrder = -1;
  return mesh;
}

// ---------- 3. Cards ----------
const CARD_W = 4.3;
const CARD_H = 2.69;
const cardGeometry = () => new RoundedBoxGeometry(CARD_W, CARD_H, 0.14, 5, 0.2);
const EMPTY = (() => {
  const c = document.createElement('canvas');
  c.width = c.height = 2;
  const t = new CanvasTexture(c);
  return t;
})();

// A soft violet-to-cyan halo that glows behind a hovered card.
const haloGeometry = () => new PlaneGeometry(CARD_W * 1.55, CARD_H * 1.75);
function haloMaterial() {
  return new ShaderMaterial({
    uniforms: { uOpacity: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uOpacity; varying vec2 vUv;
      void main() {
        // Rounded-rectangle falloff around the card's footprint.
        vec2 q = abs(vUv - 0.5) * 2.0 - vec2(0.62, 0.55);
        float dist = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
        float glow = exp(-max(dist, 0.0) * 7.0) * smoothstep(0.38, -0.05, dist);
        vec3 violet = vec3(0.55, 0.36, 0.96);
        vec3 blue = vec3(0.23, 0.51, 0.96);
        vec3 cyan = vec3(0.13, 0.83, 0.93);
        float t = clamp(vUv.x * 0.65 + (1.0 - vUv.y) * 0.35, 0.0, 1.0);
        vec3 col = mix(violet, mix(blue, cyan, smoothstep(0.4, 1.0, t)), smoothstep(0.0, 0.6, t));
        gl_FragColor = vec4(col * 1.4, glow * uOpacity);
        ${OUTPUT}
      }`,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
}

function cardMaterial(card, seed) {
  const [a, b, c] = card.palette.map((x) => new Color(x));
  return new ShaderMaterial({
    uniforms: {
      uFace: { value: EMPTY },
      uImage: { value: EMPTY },
      uHasImage: { value: 0 },
      uA: { value: a },
      uB: { value: b },
      uC: { value: c.multiplyScalar(0.8) },
      uTime: { value: 0 },
      uSeed: { value: seed },
      uHover: { value: 0 },
      uGlitch: { value: 1 },
      uOpacity: { value: 0 },
      uFocus: { value: 0 },
      uBlur: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv; varying float vFront; varying vec3 vN; varying vec3 vView;
      void main() {
        vUv = position.xy / vec2(${CARD_W.toFixed(2)}, ${CARD_H.toFixed(2)}) + 0.5;
        vFront = normal.z;
        vN = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D uFace; uniform sampler2D uImage; uniform float uHasImage;
      uniform vec3 uA; uniform vec3 uB; uniform vec3 uC;
      uniform float uTime; uniform float uSeed; uniform float uHover; uniform float uGlitch; uniform float uOpacity; uniform float uFocus; uniform float uBlur;
      varying vec2 vUv; varying float vFront; varying vec3 vN; varying vec3 vView;
      ${NOISE}
      ${FILM}
      void main() {
        vec2 uv = vUv;
        float fres = pow(1.0 - max(dot(normalize(vN), normalize(vView)), 0.0), 3.0);

        // Glitch: horizontal slices jump sideways for a moment.
        float g = uGlitch + uHover * 0.12;
        float slice = floor(uv.y * 26.0);
        float tick = floor(uTime * 16.0);
        float on = step(0.62, hash(vec3(slice, tick, uSeed + 3.0)));
        vec2 guv = uv + vec2((hash(vec3(slice, tick, uSeed)) - 0.5) * 0.14 * g * on, 0.0);

        // A flowing, painterly surface (domain-warped noise in the card's palette).
        vec3 p = vec3(guv * vec2(2.2, 1.4) + uSeed * 7.0, uTime * 0.05);
        vec2 q = vec2(fbm(p), fbm(p + vec3(5.2, 1.3, 0.0)));
        float f = fbm(p + vec3(q * 2.4, uTime * 0.03));
        vec3 surf = mix(uC * 0.6, uA, smoothstep(0.42, 0.85, f));
        surf = mix(surf, uB, smoothstep(0.58, 0.9, fbm(p * 1.8 - vec3(q, 0.0))) * 0.85);
        surf = mix(surf, vec3(0.43, 0.89, 0.83), smoothstep(0.7, 0.95, fbm(p * 2.6 + 9.0)) * 0.35);
        surf *= 0.35 + 0.9 * f * f;
        if (uHasImage > 0.5) {
          vec3 img = texture2D(uImage, guv + (q - 0.5) * 0.03, uBlur * 3.0).rgb;
          surf = mix(surf, img, 0.7);
        }
        surf *= 0.85;
        vec2 d = abs(uv - 0.5) * 2.0;
        surf *= 1.0 - 0.45 * pow(max(d.x, d.y), 3.0);

        // Title layer with chromatic aberration. Distant cards sample a softer
        // mip level, a cheap depth-of-field blur.
        float ca = 0.0008 + 0.018 * g;
        float lod = uBlur * 3.5;
        vec4 face = texture2D(uFace, guv, lod);
        float ar = texture2D(uFace, guv + vec2(ca, 0.0), lod).a;
        float ab = texture2D(uFace, guv - vec2(ca, 0.0), lod).a;
        vec3 col = mix(surf, face.rgb, face.a);
        col += vec3(max(ar - face.a, 0.0) * 0.9, 0.0, max(ab - face.a, 0.0) * 1.1);

        // Hover light: the edge lights from violet (top-left) to cyan (bottom-right).
        float edge = smoothstep(0.93, 1.0, max(d.x, d.y));
        vec3 rim = mix(vec3(0.55, 0.36, 0.96), vec3(0.13, 0.83, 0.93), clamp(uv.x * 0.6 + (1.0 - uv.y) * 0.4, 0.0, 1.0));
        col += rim * edge * uHover * 0.55;

        col *= 0.93 + 0.07 * sin(uv.y * 820.0);       // scanlines
        col += film(fres * 1.5 + uv.y) * fres * 0.7;  // glass sheen at grazing angles
        col += vec3(0.04) * uHover;
        col = mix(col, col * 0.7 + vec3(0.02, 0.03, 0.05), uBlur * 0.5); // distant cards sink into the dark

        if (vFront < 0.5) {
          // Edges and back: tinted glass.
          col = film(fres + vUv.y * 0.6 + uSeed) * (0.25 + fres * 0.5) + uA * 0.12;
          col += mix(vec3(0.55, 0.36, 0.96), vec3(0.13, 0.83, 0.93), vUv.x) * uHover * 0.3;
        }
        gl_FragColor = vec4(col, uOpacity);
        ${OUTPUT}
      }`,
    transparent: true,
    side: DoubleSide,
  });
}

// The hero's own motion: how fast the spiral turns by itself (cards per
// second), and how much a hovered card slows it.
const DRIFT = 1 / 7;
const HOVER_SLOW = 0.28;
// Camera distances
const CAM_Z = ORBIT + 9.8;
const HERO_Z = CAM_Z + 3.6;

/**
 * Creates the theatre inside `host`.
 * sections   { hero, intro, statement, work } DOM elements that drive the timeline
 * withHero   homepage: the spine and cards are on from the first frame,
 *            centre-right beside the `hero` section, cycling by themselves
 * heroOnly   with withHero, on phones: only the hero plays (the work section
 *            is the DOM deck); the scene fades as the hero scrolls away
 * withMark   the legacy intro (the AI ring and ribbons)
 * onActive   (index) => void, when another card reaches the front
 * onSelect   (card) => void, when a card is clicked
 */
export async function createTheatre(host, { sections, withHero = false, heroOnly = false, withMark = false, onActive, onSelect }) {
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const lite = heroOnly || (coarse && window.innerWidth < 1024);
  const renderer = new WebGLRenderer({ antialias: !coarse, alpha: true, powerPreference: 'high-performance', stencil: false });
  // Never block the page on the driver: skip the synchronous shader error
  // check in production, and compile shaders in parallel before they draw.
  renderer.debug.checkShaderErrors = process.env.NODE_ENV !== 'production';
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.6));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.className = 'th-canvas';
  host.appendChild(canvas);

  const scene = new Scene();
  const camera = new PerspectiveCamera(34, 1, 0.1, 200);
  const pr = renderer.getPixelRatio();
  const hero = withHero && !withMark;

  const mark = withMark ? createMark() : null;
  if (mark) {
    scene.add(mark.group);
    mark.dust.material.uniforms.uPixel.value = pr * 4;
  }

  const spine = createSpine({ lite });
  spine.dust.material.uniforms.uPixel.value = pr * 4;
  scene.add(spine.group);

  const backdrop = hero ? createBackdrop() : null;
  if (backdrop) scene.add(backdrop);

  const cardsGroup = new Group();
  scene.add(cardsGroup);
  let cards = []; // { card, mesh, mat, appear, target, index }
  let count = 0;
  const loader = new TextureLoader();

  // ---------- The endless spiral ----------
  // `pos` is the continuous index of the spiral slot at the front. Card i sits
  // in the slot nearest `pos` among anchor + i + k * count, so the cards repeat
  // along the spine and the loop never shows a seam (a card changes slot only
  // when it is half a lap away, where it is invisible).
  let pos = 0;
  let anchor = 0; // the slot that shows card 0 (reset when the cards change)
  let base = null; // the slot at the start of the scroll run, once the work section has entered
  let slow = 1; // the hero's drift, eased down while a card is hovered
  const slotOf = (index) => anchor + index + count * Math.round((pos - anchor - index) / Math.max(1, count));
  const cardAt = (slot) => (((Math.round(slot) - anchor) % Math.max(1, count)) + count) % Math.max(1, count);

  const geometry = cardGeometry();
  const halo = haloGeometry();
  const setCards = (list) => {
    const shown = heroOnly ? list.slice(0, 6) : list;
    // Old cards leave (fade, glitch) and are removed once gone.
    cards.forEach((c) => { c.target = 0; c.leaving = true; });
    count = shown.length;
    // The new card 0 takes the slot at the start of the run (or, while the
    // hero drifts, the front). Elsewhere the run always starts at slot 0.
    anchor = hero ? base ?? Math.round(pos) : 0;
    const next = shown.map((card, index) => {
      const mat = cardMaterial(card, Math.random() * 10);
      const mesh = new Mesh(geometry, mat);
      mesh.renderOrder = 2; // cards always draw over the spine
      mesh.userData.card = card;
      const glow = new Mesh(halo, haloMaterial());
      glow.position.z = -0.12;
      glow.renderOrder = 1;
      mesh.add(glow);
      cardsGroup.add(mesh);
      drawCardFace(card).then((canvasFace) => {
        const t = new CanvasTexture(canvasFace);
        t.colorSpace = SRGBColorSpace;
        t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        mat.uniforms.uFace.value = t;
        mat.uniforms.uGlitch.value = 1;
      });
      if (card.image) {
        loader.load(card.image, (t) => {
          t.colorSpace = SRGBColorSpace;
          mat.uniforms.uImage.value = t;
          mat.uniforms.uHasImage.value = 1;
        });
      }
      return { card, mesh, mat, glow, appear: 0, target: 1, index, hover: 0, born: elapsed, delay: index * 0.06 };
    });
    cards = [...cards, ...next];
    lastActive = -1;
    // New materials compile in the background; drawing waits for them.
    compiling += 1;
    renderer.compileAsync(scene, camera).catch(() => {}).finally(() => { compiling -= 1; });
  };
  let compiling = 0;

  // ---------- Sizing ----------
  let width = 1;
  let height = 1;
  let shiftX = 0;
  let shiftY = 0;
  const resize = () => {
    width = host.clientWidth || window.innerWidth;
    height = host.clientHeight || window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    shiftX = NaN; // re-apply the view offset on the next frame
    camera.updateProjectionMatrix();
  };
  // Where the spine stands on screen: `x` moves it right of centre (a fraction
  // of the width), `y` moves it down.
  const frame3d = (x, y) => {
    if (x === shiftX && y === shiftY) return;
    shiftX = x;
    shiftY = y;
    camera.setViewOffset(width, height, -x * width, -y * height, width, height);
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener('resize', resize);

  // ---------- Pointer ----------
  const pointer = new Vector2();
  const target = new Vector2();
  const ndc = new Vector2(9, 9);
  const raycaster = new Raycaster();
  let hovered = null;
  const onMove = (e) => {
    target.set((e.clientX / width) * 2 - 1, -(e.clientY / height) * 2 + 1);
    ndc.copy(target);
  };
  const onDown = (e) => {
    if (hovered && e.button === 0) onSelect?.(hovered.card);
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  canvas.addEventListener('click', onDown);

  // ---------- Timeline from the DOM ----------
  // A section may name its own run (`data-run`, in vh) when it is taller than
  // the run, so the timeline finishes before the section does.
  const progressOf = (el, sticky) => {
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    const run = parseFloat(el.dataset?.run);
    const span = run > 0 ? (run / 100) * height : sticky ? r.height - height : r.height;
    return clamp01(-r.top / Math.max(1, span));
  };

  // ---------- Loop ----------
  const clock = new Clock();
  let elapsed = 0;
  let raf = 0;
  let lastActive = -1;
  const startedAt = performance.now();
  const camPos = new Vector3();
  const look = new Vector3();
  const tmp = new Vector3();

  const frame = () => {
    raf = requestAnimationFrame(frame);
    if (document.hidden) return;
    const raw = clock.getDelta();
    const dt = Math.min(raw, 0.05);
    const k = 1 - Math.exp(-Math.min(raw, 0.25) * 4); // frame-rate independent smoothing
    elapsed += dt;
    const wall = (performance.now() - startedAt) / 1000;
    pointer.lerp(target, k * 0.6);

    const a = progressOf(sections.intro, false); // intro scrolled away 0 → 1
    const b = progressOf(sections.statement, true); // statement 0 → 1
    const c = heroOnly ? 0 : progressOf(sections.work, true); // work 0 → 1
    const workRect = heroOnly ? null : sections.work?.getBoundingClientRect();
    const heroRect = hero ? sections.hero?.getBoundingClientRect() : null;
    // How far the work section has entered (0: below the fold, 1: at the top).
    const entered = workRect ? clamp01(1 - workRect.top / height) : 0;
    const inWork = mark ? smooth(0.86, 1, b) : smooth(0.2, 0.9, entered);
    // How much of the spine and cards is on: in the hero they are always on.
    const present = hero ? 1 : inWork;
    // As the section that owns the scene leaves, the scene travels up with it,
    // like the rest of the page, and fades out on the way (no hard edge).
    const owner = workRect || heroRect;
    const presence = owner ? smooth(0.3, 0.9, owner.bottom / height) : 1;
    const lift = owner ? Math.max(0, height - owner.bottom) : 0;
    canvas.style.opacity = presence.toFixed(3);
    canvas.style.transform = lift > 0 ? `translate3d(0, ${(-lift).toFixed(1)}px, 0)` : '';
    if (presence < 0.005 || (!mark && !hero && inWork < 0.005)) return;
    const introIn = easeOutCubic(clamp01(wall / 2.2));

    // ----- 1 & 2. The mark -----
    if (mark) {
    mark.ribbonMat.uniforms.uDraw.value = easeOutCubic(clamp01((wall - 0.4) / 2.6));
    mark.ribbonMat.uniforms.uOpacity.value = 1 - smooth(0.1, 0.7, a);
    mark.ribbonMat.uniforms.uTime.value = elapsed;
    mark.ringMat.uniforms.uTime.value = elapsed;
    mark.textMat.uniforms.uTime.value = elapsed;
    mark.dust.material.uniforms.uTime.value = elapsed;
    mark.dust.material.uniforms.uOpacity.value = introIn * (1 - smooth(0.2, 0.8, a));
    const turn = a * 1.45 + b * 0.5;
    mark.group.rotation.y = turn + pointer.x * 0.25 * (1 - a);
    mark.group.rotation.x = -pointer.y * 0.15 * (1 - a) + Math.sin(elapsed * 0.4) * 0.03;
    // Intro: the mark at about a fifth of the screen. Statement: it comes
    // forward, turns edge-on and towers through the headline, then rises away.
    mark.group.position.set(
      0,
      MathUtils.lerp(0, 0.1, smooth(0, 1, a)) + smooth(0.72, 1, b) * 10,
      MathUtils.lerp(0, 7.5, smooth(0, 1, a))
    );
    mark.group.scale.setScalar((0.86 + 0.14 * introIn) * (0.8 + smooth(0, 1, a) * 0.55 + smooth(0.72, 1, b) * 0.4));
    const markOpacity = introIn * (1 - smooth(0.8, 0.97, b));
    mark.ringMat.uniforms.uOpacity.value = 0.95 * markOpacity;
    mark.textMat.uniforms.uOpacity.value = markOpacity;
    mark.group.visible = markOpacity > 0.01;
    }

    // ----- 3. The spiral's position -----
    const span = Math.max(1, count - 1);
    if (hero) {
      // The hero turns the spiral by itself. Once the work section enters, the
      // spiral settles on a whole card and the scroll takes it from there; it
      // drifts again when the work section has gone back below the fold.
      slow += ((hovered ? HOVER_SLOW : 1) - slow) * Math.min(1, dt * 2);
      if (entered > 0 && !heroOnly) {
        if (base === null) base = Math.round(pos);
        pos += DRIFT * slow * dt * (1 - inWork);
        pos += (base + c * span - pos) * Math.min(1, dt * (2 + 8 * inWork));
      } else {
        base = null;
        pos += DRIFT * slow * dt;
      }
    } else {
      pos = c * span;
    }
    const camY = -pos * STEP;
    const rise = MathUtils.lerp(-20, 0, easeOutCubic(present));

    // The spine repeats every PERIOD: keep it around the camera.
    spine.group.visible = present > 0.01;
    spine.group.position.y = PERIOD * Math.round(camY / PERIOD) + rise * 1.3;
    spine.group.rotation.y = -pos * TURN * 0.5 + elapsed * 0.04;
    spine.group.rotation.x = hero ? -pointer.y * 0.03 : 0;
    spine.group.rotation.z = hero ? pointer.x * 0.02 : 0;
    spine.mat.uniforms.uTime.value = elapsed;
    spine.mat.uniforms.uOpacity.value = 0.92 * present * (hero ? introIn : 1);
    spine.dust.material.uniforms.uTime.value = elapsed;
    spine.dust.material.uniforms.uOpacity.value = present * (hero ? introIn : 1);
    cardsGroup.rotation.y = -pos * TURN;
    cardsGroup.position.y = rise;

    // Camera. The hero frames the spine centre-right (and lower, under the
    // copy, on phones), a little further back than the work section does.
    const narrow = camera.aspect < 1;
    const heroZ = Math.max(HERO_Z, 17 / camera.aspect, width < 1200 ? HERO_Z + 2.4 : 0);
    if (hero) {
      frame3d(
        MathUtils.lerp(narrow ? 0 : width >= 1200 ? 0.24 : 0.27, width >= 1024 ? 0.05 : 0, inWork),
        heroOnly || narrow ? 0.36 : 0
      );
    } else frame3d(width >= 1024 ? 0.05 : 0, 0);
    const z = hero ? MathUtils.lerp(heroZ + (1 - introIn) * 3, CAM_Z, inWork) : CAM_Z;
    camPos.set(pointer.x * 0.45, camY + pointer.y * 0.3 + 0.2 + Math.sin(elapsed * 0.3) * (hero ? 0.12 : 0), z);
    if (!hero && inWork < 1) camPos.lerp(tmp.set(pointer.x * 0.3, pointer.y * 0.2, 17), 1 - inWork);
    camera.position.lerp(camPos, k);
    look.set(0, MathUtils.lerp(0, camY, present), 0);
    camera.lookAt(look);

    if (backdrop) {
      backdrop.position.set(camera.position.x * 0.3, camY, -9);
      backdrop.material.uniforms.uCamY.value = camY;
      backdrop.material.uniforms.uTime.value = elapsed;
      backdrop.material.uniforms.uOpacity.value = introIn;
    }

    // Hover
    raycaster.setFromCamera(ndc, camera);
    const live = cards.filter((x) => !x.leaving && x.appear > 0.5);
    const hit = present > 0.6 && ndc.x !== 9 ? raycaster.intersectObjects(live.map((x) => x.mesh), false)[0] : null;
    hovered = hit ? live.find((x) => x.mesh === hit.object) : null;
    canvas.style.cursor = hovered ? 'pointer' : '';

    const active = cardAt(pos);
    if (active !== lastActive && present > 0.5) {
      lastActive = active;
      onActive?.(active);
      const front = cards.find((x) => !x.leaving && x.index === active);
      if (front) front.mat.uniforms.uGlitch.value = hero ? 0.7 : 1;
    }

    cards = cards.filter((x) => {
      const u = x.mat.uniforms;
      const speed = x.leaving ? 3 : 1.6;
      if (!x.leaving && elapsed - x.born < x.delay) {
        x.mesh.visible = false;
        return true;
      }
      x.appear += (x.target - x.appear) * Math.min(1, dt * speed * 2);
      if (x.leaving && x.appear < 0.02) {
        cardsGroup.remove(x.mesh);
        u.uFace.value !== EMPTY && u.uFace.value.dispose();
        u.uImage.value !== EMPTY && u.uImage.value.dispose();
        x.mat.dispose();
        x.glow.material.dispose();
        return false;
      }
      const slot = slotOf(x.index);
      const theta = slot * TURN;
      const dist = Math.abs(slot - pos);
      const isHover = hovered === x;
      x.hover += ((isHover ? 1 : 0) - x.hover) * Math.min(1, dt * 6);
      const r = ORBIT + x.hover * 0.35 + (1 - x.appear) * 2.5;
      x.mesh.position.set(Math.sin(theta) * r, -slot * STEP + (1 - x.appear) * -1.5, Math.cos(theta) * r);
      x.mesh.rotation.set(Math.sin(elapsed * 0.5 + x.index) * 0.03, theta, Math.sin(elapsed * 0.4 + x.index * 2) * 0.02);
      x.mesh.scale.setScalar((0.86 + 0.14 * x.appear) * (1 + x.hover * 0.04));
      u.uTime.value = elapsed;
      u.uHover.value = x.hover;
      x.glow.material.uniforms.uOpacity.value = x.hover * x.appear * present;
      u.uGlitch.value = Math.max(0, u.uGlitch.value - dt * 2.2);
      u.uFocus.value = 1 - clamp01(dist);
      u.uBlur.value = smooth(0.7, 2.6, dist) * (1 - x.hover);
      // Cards far from the front recede into the dark, and are gone before
      // they move to the other end of the spiral.
      const half = Math.max(1.6, count / 2);
      // On a tall, narrow screen the scene stands beneath the copy, so the
      // cards already passed (above the front one) leave quickly.
      const above = hero && narrow && inWork < 1 ? 1 - smooth(0.1, 0.9, pos - slot) * (1 - inWork) : 1;
      u.uOpacity.value = x.appear * present * above * (1 - smooth(1.5, 4.5, dist) * 0.75) * (1 - smooth(half - 1.2, half - 0.2, dist));
      x.mesh.visible = u.uOpacity.value > 0.01;
      return true;
    });

    if (!compiling) renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(frame);

  return {
    setCards,
    resize,
    /** Where in the scroll run (0 → 1) card `index` is at the front. */
    fractionFor(index) {
      const n = Math.max(1, count);
      const start = hero ? base ?? Math.round(pos) : 0;
      return (((index - start + anchor) % n) + n) % n / Math.max(1, n - 1);
    },
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('click', onDown);
      scene.traverse((o) => {
        o.geometry?.dispose();
        const u = o.material?.uniforms;
        if (u?.uFace?.value && u.uFace.value !== EMPTY) u.uFace.value.dispose();
        if (u?.uImage?.value && u.uImage.value !== EMPTY) u.uImage.value.dispose();
        o.material?.dispose?.();
      });
      renderer.dispose();
      canvas.remove();
    },
  };
}

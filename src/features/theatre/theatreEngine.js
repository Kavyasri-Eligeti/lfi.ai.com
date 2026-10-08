// The homepage theatre (plain Three.js, lazy-loaded). Original scene code:
//  1. Intro: the Linkfields AI mark as a thick iridescent glass ring with an
//     extruded "AI", two ribbons of light drawing a crossing loop beneath it,
//     and drifting bokeh.
//  2. Statement: the ring turns edge-on through the headline, then rises away.
// Scroll position comes from the intro and statement sections, so the page's
// real content, links and focus order stay in the DOM.
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Clock,
  Color,
  Group,
  MathUtils,
  Mesh,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  TorusGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import fontJson from 'three/examples/fonts/helvetiker_bold.typeface.json';

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const smooth = (a, b, v) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeOutCubic = (t) => 1 - (1 - t) ** 3;

const OUTPUT = /* glsl */ `
  #include <colorspace_fragment>
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
function bokeh({ count, spread, colors, sizeRange = [6, 26], shape = 'box' }) {
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const size = new Float32Array(count);
  const seed = new Float32Array(count);
  const palette = colors.map((c) => new Color(c));
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
// The extruded "AI" is the costliest part of the scene to build, so it is made
// once and kept for later visits to the homepage.
let markTextGeometry = null;
const getMarkText = () => {
  if (!markTextGeometry) {
    const font = new FontLoader().parse(fontJson);
    markTextGeometry = new TextGeometry('AI', { font, size: 1.05, depth: 0.32, curveSegments: 10, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.035, bevelSegments: 4 });
    markTextGeometry.center();
  }
  return markTextGeometry;
};

function createMark() {
  const group = new Group();
  const ringMat = iridescent({ opacity: 0.95, strength: 1.9 });
  const ring = new Mesh(new TorusGeometry(1.5, 0.19, 64, 240), ringMat);
  group.add(ring);

  const textGeo = getMarkText();
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

/**
 * Creates the theatre inside `host`: the AI mark behind the homepage intro
 * and statement. As the statement leaves, the canvas travels up with it and
 * fades out, then stops drawing.
 * sections      { intro, statement } DOM elements that drive the timeline
 * onFirstFrame  () => void, once the first frame is on screen
 */
export async function createTheatre(host, { sections, onFirstFrame }) {
  const coarse = window.matchMedia('(pointer: coarse)').matches;
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

  const mark = createMark();
  scene.add(mark.group);
  mark.dust.material.uniforms.uPixel.value = pr * 4;

  // Shaders compile in the background; drawing waits for them.
  let compiling = true;
  renderer.compileAsync(scene, camera).catch(() => {}).finally(() => { compiling = false; });

  // ---------- Sizing ----------
  let width = 1;
  let height = 1;
  // Size from the window, not the host: while a page change animates, the
  // page carries a transform, which makes the fixed stage as tall as the whole
  // page. Measuring the host then would stretch the scene over the page and
  // throw off the scroll timeline until the next resize.
  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.setViewOffset(width, height, width >= 1024 ? -width * 0.05 : 0, 0, width, height);
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener('resize', resize);

  // ---------- Pointer ----------
  const pointer = new Vector2();
  const target = new Vector2();
  const onMove = (e) => {
    target.set((e.clientX / width) * 2 - 1, -(e.clientY / height) * 2 + 1);
  };
  window.addEventListener('pointermove', onMove, { passive: true });

  // ---------- Timeline from the DOM ----------
  const progressOf = (el, sticky) => {
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    const span = sticky ? r.height - height : r.height;
    return clamp01(-r.top / Math.max(1, span));
  };

  // ---------- Loop ----------
  const clock = new Clock();
  let elapsed = 0;
  let raf = 0;
  const startedAt = performance.now();
  const camPos = new Vector3();
  let drawn = false;

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
    // As the statement leaves, the scene travels up with it, like the rest of
    // the page, and fades out on the way (no hard edge, no overlap).
    const rect = sections.statement?.getBoundingClientRect();
    const presence = rect ? smooth(0.3, 0.9, rect.bottom / height) : 1;
    const lift = rect ? Math.max(0, height - rect.bottom) : 0;
    canvas.style.opacity = presence.toFixed(3);
    canvas.style.transform = lift > 0 ? `translate3d(0, ${(-lift).toFixed(1)}px, 0)` : '';
    if (presence < 0.005) return;

    // ----- 1 & 2. The mark -----
    const introIn = easeOutCubic(clamp01(wall / 2.2));
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

    // Camera: drifts gently with the pointer.
    camPos.set(pointer.x * 0.3, pointer.y * 0.2, 17);
    camera.position.lerp(camPos, k);
    camera.lookAt(0, 0, 0);

    if (!compiling) {
      renderer.render(scene, camera);
      if (!drawn) {
        drawn = true;
        onFirstFrame?.();
      }
    }
  };
  raf = requestAnimationFrame(frame);

  return {
    resize,
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      scene.traverse((o) => {
        if (o.geometry !== markTextGeometry) o.geometry?.dispose();
        o.material?.dispose?.();
      });
      renderer.dispose();
      canvas.remove();
    },
  };
}

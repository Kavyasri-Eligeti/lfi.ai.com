// The homepage hero scene (Three.js, lazy-loaded): a laptop on an executive
// desk in a corner office above the city at dusk.
//
//  - The office (officeSet.js): the skyline through two walls of glass, a
//    dusk sun raking in, LED ceiling light, walnut, oak and CC0 furniture.
//  - The laptop is modelled here.
//  - The laptop's display is real HTML (passed in as `screenEl`), mapped onto
//    the 3D screen every frame with a projective CSS transform, so it stays
//    crisp from a few pixels wide to full screen.
//  - setProgress(p) moves the camera from the wide shot (p = 0) to the screen
//    filling the viewport (p = 1).
import {
  ACESFilmicToneMapping,
  CanvasTexture,
  Clock,
  Color,
  Group,
  MeshBasicMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { buildLaptop, contactShadow, DISPLAY, SCREEN_PX } from './laptop';
import { buildOffice, DESK_TOP } from './officeSet';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

export { SCREEN_PX };


const smooth = (t) => t * t * (3 - 2 * t);
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t) => Math.min(1, Math.max(0, t));

/* ---------- Projective transform: element rect -> screen quad ---------- */
function solve(A, b) {
  const n = b.length;
  for (let i = 0; i < n; i += 1) {
    let max = i;
    for (let r = i + 1; r < n; r += 1) if (Math.abs(A[r][i]) > Math.abs(A[max][i])) max = r;
    [A[i], A[max]] = [A[max], A[i]];
    [b[i], b[max]] = [b[max], b[i]];
    for (let r = i + 1; r < n; r += 1) {
      const f = A[r][i] / A[i][i];
      for (let c = i; c < n; c += 1) A[r][c] -= f * A[i][c];
      b[r] -= f * b[i];
    }
  }
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i -= 1) {
    let s = b[i];
    for (let c = i + 1; c < n; c += 1) s -= A[i][c] * x[c];
    x[i] = s / A[i][i];
  }
  return x;
}
function matrix3d(w, h, q) {
  const src = [[0, 0], [w, 0], [w, h], [0, h]];
  const A = [];
  const b = [];
  for (let i = 0; i < 4; i += 1) {
    const [x, y] = src[i];
    const [u, v] = q[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
    b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
    b.push(v);
  }
  const [a, bb, c, d, e, f, g, hh] = solve(A, b);
  return `matrix3d(${a},${d},0,${g},${bb},${e},0,${hh},0,0,1,0,${c},${f},0,1)`;
}

/**
 * The laptop's display content, drawn into a high-resolution texture: the
 * Linkfields logo, large and highlighted, on white. In the scene it is
 * mipmapped and filtered, so it stays sharp at every distance and every
 * frame (an HTML overlay is rasterised once and goes soft while it moves).
 */
async function screenTexture(maxAniso) {
  const W = 3072;
  const H = Math.round((W * DISPLAY.h) / DISPLAY.w);
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d');
  const bg = g.createRadialGradient(W / 2, H * 0.45, 0, W / 2, H * 0.45, W * 0.62);
  bg.addColorStop(0, '#f3f2ed');
  bg.addColorStop(1, '#ebe9e3');
  g.fillStyle = bg;
  g.fillRect(0, 0, W, H);
  const k = W / 1440; // the design was 1440 wide
  const logo = new Image();
  logo.decoding = 'async';
  logo.src = `${process.env.PUBLIC_URL || ''}/brand/linkfields-logo-dark.svg`;
  await logo.decode().catch(() => {});
  // The Linkfields logo alone, large, lifted on a soft halo in its own colours.
  const lh = 168 * k;
  const lw = (181 / 46) * lh;
  const cx = W / 2;
  const cy = H / 2;
  [['rgba(255, 214, 0, 0.16)', -0.32], ['rgba(255, 120, 0, 0.12)', 0], ['rgba(45, 88, 192, 0.14)', 0.32]].forEach(([col, dx]) => {
    const halo = g.createRadialGradient(cx + dx * lw, cy, 0, cx + dx * lw, cy, lw * 0.62);
    halo.addColorStop(0, col);
    halo.addColorStop(1, 'rgba(255, 255, 255, 0)');
    g.fillStyle = halo;
    g.fillRect(0, 0, W, H);
  });
  if (logo.naturalWidth) {
    g.save();
    g.shadowColor = 'rgba(15, 23, 42, 0.16)';
    g.shadowBlur = 36 * k;
    g.shadowOffsetY = 10 * k;
    g.drawImage(logo, cx - lw / 2, cy - lh / 2, lw, lh);
    g.restore();
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = maxAniso;
  return t;
}



/**
 * @param {HTMLElement} host           the element the canvas fills
 * @param {object} opts
 * @param {HTMLElement} opts.screenEl  the display's HTML (SCREEN_PX in size)
 * @param {() => void} opts.onReady
 */
export function createDeskScene(host, { screenEl, onReady } = {}) {
  const renderer = new WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.92;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.outputColorSpace = SRGBColorSpace;
  const canvas = renderer.domElement;
  canvas.className = 'desk3d__canvas';
  host.prepend(canvas);

  const scene = new Scene();
  scene.background = new Color(0x1d1f27);
  const set = new Group();
  scene.add(set);

  const camera = new PerspectiveCamera(32, 1, 0.03, 60);
  set.add(camera);

  // The set: a corner office above the city at dusk (officeSet.js)
  const office = buildOffice({ scene, set, renderer });
  const pending = [...office.pending];
  pending.push(
    screenTexture(renderer.capabilities.getMaxAnisotropy()).then((t) => {
      lap.display.material.dispose();
      lap.display.material = new MeshBasicMaterial({ map: t, toneMapped: false, color: new Color(1.28, 1.28, 1.28) }) // a lit display: bright enough to read white after the filmic tone curve;
      textures.push(t);
      dirty = true;
    })
  );
  const textures = [];

  const lap = buildLaptop();
  lap.group.position.set(0.12, DESK_TOP + 0.004, 0.02); // on the desk pad
  lap.group.rotation.y = -0.12;
  set.add(lap.group);
  const ctab = contactShadow(2.3, 1.3, 0.45);
  set.add(ctab);

  /* ---------- Lens: depth of field focused on the laptop, soft bloom ---------- */
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  // Ambient occlusion: contact shading where things meet, so nothing floats.
  const gtao = new GTAOPass(scene, camera, 512, 512);
  gtao.blendIntensity = 0.85;
  gtao.updateGtaoMaterial({ radius: 0.3, distanceExponent: 1.2, thickness: 1, scale: 1.15, samples: 16 });
  gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 16 });
  composer.addPass(gtao);
  const bokeh = new BokehPass(scene, camera, { focus: 6, aperture: 0.0016, maxblur: 0.0085 });
  composer.addPass(bokeh);
  // Bloom picks up the LED strips and the city's lights, not the room.
  const bloom = new UnrealBloomPass(new Vector2(512, 512), 0.3, 0.6, 1.5);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  // Grade: a gentle S-curve, cool shadows and warm highlights, a lens
  // vignette and fine grain. Eased off as the camera reaches the screen.
  const grade = new ShaderPass({
    uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uAmount: { value: 1 }, uRes: { value: new Vector2(1, 1) } },
    vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `
      uniform sampler2D tDiffuse; uniform float uTime; uniform float uAmount; uniform vec2 uRes; varying vec2 vUv;
      void main() {
        vec3 c = texture2D(tDiffuse, vUv).rgb;
        vec3 graded = mix(c, c * c * (3.0 - 2.0 * c), 0.16);
        float l = dot(graded, vec3(0.2126, 0.7152, 0.0722));
        graded += vec3(-0.010, 0.002, 0.020) * (1.0 - l) + vec3(0.020, 0.008, -0.012) * l;
        vec2 d = vUv - 0.5;
        graded *= mix(0.8, 1.0, smoothstep(0.85, 0.28, length(d * vec2(1.15, 1.0))));
        float n = fract(sin(dot(floor(vUv * uRes) + fract(uTime * 7.0) * 91.0, vec2(12.9898, 78.233))) * 43758.5453);
        graded += (n - 0.5) * 0.024;
        gl_FragColor = vec4(clamp(mix(c, graded, uAmount), 0.0, 1.0), 1.0);
      }`,
  });
  composer.addPass(grade);
  const focusPoint = new Vector3();

  /* ---------- Camera path ---------- */
  const startPos = new Vector3(0.75, 1.42, 5.9);
  const startTarget = new Vector3(-0.08, 1.18, -0.6);
  const screenCenter = new Vector3();
  const screenNormal = new Vector3();
  const endPos = new Vector3();
  const pos = new Vector3();
  const target = new Vector3();
  let w = 1;
  let h = 1;
  let progress = 0;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

  const corners = [
    new Vector3(-DISPLAY.w / 2, DISPLAY.h / 2, 0),
    new Vector3(DISPLAY.w / 2, DISPLAY.h / 2, 0),
    new Vector3(DISPLAY.w / 2, -DISPLAY.h / 2, 0),
    new Vector3(-DISPLAY.w / 2, -DISPLAY.h / 2, 0),
  ];
  const tmp = new Vector3();

  const computeEnd = () => {
    set.updateMatrixWorld(true);
    lap.display.updateMatrixWorld(true);
    // Work in the set's frame (the camera's parent).
    const inv = set.matrixWorld.clone().invert();
    lap.display.getWorldPosition(screenCenter).applyMatrix4(inv);
    tmp.set(0, 0, 1).transformDirection(lap.display.matrixWorld);
    screenNormal.copy(tmp).transformDirection(inv).normalize();
    const vf = (camera.fov * Math.PI) / 180;
    const aspect = w / h;
    const dW = DISPLAY.w / 2 / (Math.tan(vf / 2) * aspect);
    const dH = DISPLAY.h / 2 / Math.tan(vf / 2);
    // Wide screens: the display fills the view. Portrait: the whole display
    // stays visible, so its content is never cropped.
    const d = (aspect < 1 ? Math.max(dW, dH) * 1.04 : Math.min(dW, dH) * 0.995);
    endPos.copy(screenCenter).addScaledVector(screenNormal, d);
  };

  const resize = () => {
    w = host.clientWidth || 1;
    h = host.clientHeight || 1;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    grade.uniforms.uRes.value.set(w * dpr, h * dpr);
    composer.setPixelRatio?.(dpr);
    camera.aspect = w / h;
    // Narrow screens frame the set closer.
    camera.fov = w / h < 0.8 ? 44 : 32;
    camera.updateProjectionMatrix();
    computeEnd();
    dirty = true;
  };

  let dirty = true;
  const placeCamera = (t) => {
    const p = ease(clamp01(progress));
    const idle = 1 - smooth(clamp01(progress * 3));
    pointer.x += (pointer.tx - pointer.x) * 0.06;
    pointer.y += (pointer.ty - pointer.y) * 0.06;
    // A slow breathing drift and a little pointer parallax, only at the start.
    const drift = new Vector3(Math.sin(t * 0.25) * 0.08 + pointer.x * 0.25, Math.sin(t * 0.18) * 0.03 - pointer.y * 0.08, 0).multiplyScalar(idle);
    pos.copy(startPos).add(drift).lerp(endPos, p);
    // The aim moves to the screen a little ahead of the body, like a dolly.
    target.copy(startTarget).lerp(screenCenter, ease(clamp01(progress * 1.25)));
    camera.position.copy(pos);
    // lookAt takes a world point and accounts for the parent (the set).
    camera.lookAt(set.localToWorld(target.clone()));
  };

  const placeScreen = () => {
    if (!screenEl) return;
    camera.updateMatrixWorld(true);
    lap.display.updateMatrixWorld(true);
    const q = corners.map((c) => {
      tmp.copy(c).applyMatrix4(lap.display.matrixWorld).project(camera);
      return [(tmp.x * 0.5 + 0.5) * w, (-tmp.y * 0.5 + 0.5) * h];
    });
    screenEl.style.transform = matrix3d(SCREEN_PX.w, SCREEN_PX.h, q);
  };

  const onMove = (e) => {
    const r = host.getBoundingClientRect();
    pointer.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
  };
  window.addEventListener('pointermove', onMove, { passive: true });
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  let visible = true;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
  io.observe(host);

  const clock = new Clock();
  let raf = 0;
  let disposed = false;
  let ready = false;
  const frame = () => {
    if (disposed) return;
    raf = requestAnimationFrame(frame);
    if (!visible) return;
    const t = clock.getElapsedTime();
    placeCamera(t);
    // Past the zoom the HTML covers the canvas; skip drawing it.
    if (progress < 0.995 || dirty) {
      // Keep the laptop in focus; open the lens wide at the start and close
      // it as the camera arrives, so the screen is crisp at the end.
      lap.display.getWorldPosition(focusPoint);
      bokeh.uniforms.focus.value = camera.position.distanceTo(focusPoint);
      bokeh.uniforms.aperture.value = 0.0016 * (1 - smooth(clamp01(progress * 1.4)));
      grade.uniforms.uTime.value = t;
      grade.uniforms.uAmount.value = 1 - smooth(clamp01((progress - 0.6) / 0.4));
      composer.render();
    }
    placeScreen();
    dirty = false;
  };

  const startup = Promise.all(pending).then(() => {
    if (disposed) return;
    computeEnd();
    return renderer.compileAsync(scene, camera).catch(() => {}).finally(() => {
      if (disposed) return;
      raf = requestAnimationFrame(frame);
      requestAnimationFrame(() => {
        if (disposed) return;
        ready = true;
        onReady?.();
      });
      // Swap in the sharp skyline once the scene is up.
      office.sharpenSky(() => { dirty = true; });
    });
  });

  return {
    setProgress(p) {
      progress = p;
      dirty = true;
    },
    get ready() {
      return ready;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      canvas.remove();
      // Let pending shader compilation finish before destroying its programs.
      // A fast page handoff can otherwise interrupt Three's readiness polling.
      startup.finally(() => {
        scene.traverse((o) => {
          o.geometry?.dispose();
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m) => {
            if (!m) return;
            Object.values(m).forEach((v) => v?.isTexture && v.dispose());
            m.dispose();
          });
        });
        textures.forEach((t) => t.dispose());
        office.dispose();
        gtao.dispose?.();
        composer.dispose?.();
        bloom.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
      }).catch(() => {});
    },
  };
}

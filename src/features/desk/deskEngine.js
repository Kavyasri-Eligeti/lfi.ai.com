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
  CylinderGeometry,
  Clock,
  Color,
  Group,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { buildOffice, DESK_TOP } from './officeSet';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

// Laptop dimensions (metres) and its 16:10 display area.
const LAP = { w: 0.312, d: 0.218, base: 0.0145, lidT: 0.0055, open: 1.86 };
const DISPLAY = { w: 0.2976, h: 0.186 };
export const SCREEN_PX = { w: 1440, h: 900 };

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

/* ---------- The laptop ---------- */
// A MacBook-style keyboard, as rows of key widths (1 = one key pitch).
const KEY_ROWS = [
  { h: 0.62, keys: Array(14).fill(14.5 / 14) },
  { h: 1, keys: [...Array(13).fill(1), 1.5] },
  { h: 1, keys: [1.5, ...Array(13).fill(1)] },
  { h: 1, keys: [1.8, ...Array(11).fill(1), 1.7] },
  { h: 1, keys: [2.35, ...Array(10).fill(1), 2.15] },
  { h: 1, keys: [1, 1, 1, 1.25, 5, 1.25, 1, 1, 1, 1] },
];

/** Speaker grille: rows of tiny holes, as an alpha map. */
function grilleTexture() {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = '#000';
  g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = '#fff';
  for (let y = 4, row = 0; y < c.height - 2; y += 7, row += 1) {
    for (let x = 4 + (row % 2) * 3.5; x < c.width - 2; x += 7) {
      g.beginPath();
      g.arc(x, y, 1.6, 0, Math.PI * 2);
      g.fill();
    }
  }
  const t = new CanvasTexture(c);
  t.anisotropy = 8;
  return t;
}

/**
 * The laptop's display content, drawn into a high-resolution texture: the
 * Linkfields logo, large and highlighted, on white. In the scene it is
 * mipmapped and filtered, so it stays sharp at every distance and every frame (an HTML
 * overlay is rasterised once and goes soft while it moves).
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

function buildLaptop() {
  const g = new Group();
  // Space-grey bead-blasted aluminium: dark and satin, never mirror-bright.
  const alu = new MeshPhysicalMaterial({ color: 0x2f3136, metalness: 1, roughness: 0.48, envMapIntensity: 0.75 });
  // The diamond-cut chamfer that catches the light along every edge.
  const chamfer = new MeshPhysicalMaterial({ color: 0x75787e, metalness: 1, roughness: 0.28, envMapIntensity: 0.6 });
  const well = new MeshStandardMaterial({ color: 0x08080a, roughness: 0.85, metalness: 0 });
  const keycap = new MeshStandardMaterial({ color: 0x0b0b0d, roughness: 0.72, metalness: 0, envMapIntensity: 0.28 });
  const rubber = new MeshStandardMaterial({ color: 0x050506, roughness: 0.9 });
  const glass = new MeshPhysicalMaterial({ color: 0x000000, roughness: 0.04, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 0.45 });

  /* Base: body, a bright chamfer band, then the top deck */
  const base = new Mesh(new RoundedBoxGeometry(LAP.w, LAP.base - 0.0012, LAP.d, 8, 0.0055), alu);
  base.position.y = (LAP.base - 0.0012) / 2;
  base.castShadow = true;
  base.receiveShadow = true;
  g.add(base);
  const band = new Mesh(new RoundedBoxGeometry(LAP.w, 0.0016, LAP.d, 6, 0.0007), chamfer);
  band.position.y = LAP.base - 0.0009;
  g.add(band);
  const deck = new Mesh(new RoundedBoxGeometry(LAP.w - 0.0026, 0.0008, LAP.d - 0.0026, 4, 0.0003), alu);
  deck.position.y = LAP.base - 0.0002;
  deck.receiveShadow = true;
  g.add(deck);
  const top = LAP.base + 0.0002;

  /* Keyboard: a recessed well with real keycaps */
  const pitch = 0.0189;
  const gap = 0.0029;
  const kbW = 14.5 * pitch;
  const kbD = KEY_ROWS.reduce((t, r) => t + r.h * pitch, 0);
  const kbZ = -0.043; // keyboard centre, towards the hinge
  const wellMesh = new Mesh(new PlaneGeometry(kbW + 0.004, kbD + 0.004), well);
  wellMesh.rotation.x = -Math.PI / 2;
  wellMesh.position.set(0, top + 0.00005, kbZ);
  g.add(wellMesh);
  const count = KEY_ROWS.reduce((t, r) => t + r.keys.length, 0);
  const keys = new InstancedMesh(new RoundedBoxGeometry(1, 1, 1, 2, 0.12), keycap, count);
  keys.castShadow = true;
  const dummy = new Object3D();
  let i = 0;
  let z = kbZ - kbD / 2;
  KEY_ROWS.forEach((row) => {
    const rowD = row.h * pitch;
    let x = -kbW / 2;
    row.keys.forEach((u) => {
      const w = u * pitch;
      dummy.position.set(x + w / 2, top + 0.0006, z + rowD / 2);
      dummy.scale.set(w - gap, 0.0009, rowD - gap);
      dummy.updateMatrix();
      keys.setMatrixAt(i, dummy.matrix);
      i += 1;
      x += w;
    });
    z += rowD;
  });
  keys.instanceMatrix.needsUpdate = true;
  g.add(keys);
  // Touch ID: the last function key is glossy glass
  const fnW = (14.5 / 14) * pitch;
  const touch = new Mesh(new RoundedBoxGeometry(fnW - gap, 0.0009, 0.62 * pitch - gap, 2, 0.0003), new MeshPhysicalMaterial({ color: 0x050506, roughness: 0.25, clearcoat: 0.6, envMapIntensity: 0.25 }));
  touch.position.set(kbW / 2 - fnW / 2, top + 0.00062, kbZ - kbD / 2 + (0.62 * pitch) / 2);
  g.add(touch);

  /* Speaker grilles either side of the keyboard */
  const grille = new MeshBasicMaterial({ color: 0x050506, alphaMap: grilleTexture(), transparent: true, depthWrite: false });
  [-1, 1].forEach((side) => {
    const sp = new Mesh(new PlaneGeometry(0.0095, kbD), grille);
    sp.rotation.x = -Math.PI / 2;
    sp.position.set(side * (kbW / 2 + 0.0098), top + 0.00006, kbZ);
    g.add(sp);
  });

  /* Force Touch trackpad: one sheet of glass, flush with the deck */
  const pad = new Mesh(
    new RoundedBoxGeometry(0.134, 0.0003, 0.08, 3, 0.0001),
    new MeshPhysicalMaterial({ color: 0x222428, metalness: 0.6, roughness: 0.5, clearcoat: 0.3, clearcoatRoughness: 0.3, envMapIntensity: 0.28 })
  );
  pad.position.set(0, top - 0.0001, 0.062);
  g.add(pad);
  // The thumb scoop on the front edge
  const scoop = new Mesh(new RoundedBoxGeometry(0.05, 0.0035, 0.002, 3, 0.0009), rubber);
  scoop.position.set(0, LAP.base - 0.002, LAP.d / 2 - 0.0004);
  g.add(scoop);
  // Rubber feet
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
    const f = new Mesh(new CylinderGeometry(0.006, 0.006, 0.0012, 20), rubber);
    f.position.set(sx * (LAP.w / 2 - 0.02), 0.0003, sz * (LAP.d / 2 - 0.02));
    g.add(f);
  });

  /* Hinge barrel */
  const hinge = new Mesh(
    new CylinderGeometry(0.0032, 0.0032, LAP.w - 0.056, 32),
    new MeshPhysicalMaterial({ color: 0x1b1c20, metalness: 0.9, roughness: 0.35 })
  );
  hinge.rotation.z = Math.PI / 2;
  hinge.position.set(0, LAP.base - 0.0012, -LAP.d / 2 + 0.0032);
  hinge.castShadow = true;
  g.add(hinge);

  /* Lid, hinged at the back edge */
  const lid = new Group();
  lid.position.set(0, LAP.base, -LAP.d / 2 + 0.004);
  lid.rotation.x = -(LAP.open - Math.PI / 2); // opened past vertical
  g.add(lid);
  const lidH = LAP.d - 0.012;
  const shell = new Mesh(new RoundedBoxGeometry(LAP.w, lidH, LAP.lidT, 8, 0.0024), alu);
  shell.position.set(0, lidH / 2, -LAP.lidT / 2);
  shell.castShadow = true;
  lid.add(shell);
  // Chamfer catching the light around the lid
  const rim = new Mesh(new RoundedBoxGeometry(LAP.w - 0.0004, lidH - 0.0004, 0.0012, 6, 0.0005), chamfer);
  rim.position.set(0, lidH / 2, -0.0004);
  lid.add(rim);
  // Edge-to-edge black glass, a millimetre inside the aluminium
  const bezel = new Mesh(new RoundedBoxGeometry(LAP.w - 0.0034, lidH - 0.0034, 0.0008, 4, 0.0003), glass);
  bezel.position.set(0, lidH / 2, 0.0003);
  lid.add(bezel);
  // The display region (the HTML is mapped onto these corners)
  const displayY = lidH / 2 + 0.0035;
  const display = new Mesh(new PlaneGeometry(DISPLAY.w, DISPLAY.h), new MeshBasicMaterial({ color: 0x0b1016 }));
  display.position.set(0, displayY, 0.0013); // clear of the glass, so depth effects separate them
  lid.add(display);
  // Camera with its lens ring, centred in the top bezel
  const camY = (displayY + DISPLAY.h / 2 + lidH - 0.0017) / 2;
  const camRing = new Mesh(new CylinderGeometry(0.0013, 0.0013, 0.0002, 24), new MeshPhysicalMaterial({ color: 0x14161b, roughness: 0.2, metalness: 0.4 }));
  camRing.rotation.x = Math.PI / 2;
  camRing.position.set(0, camY, 0.0008);
  lid.add(camRing);
  const lens = new Mesh(new CylinderGeometry(0.00055, 0.00055, 0.0002, 20), new MeshPhysicalMaterial({ color: 0x0a1a2a, roughness: 0.05, clearcoat: 1 }));
  lens.rotation.x = Math.PI / 2;
  lens.position.set(0, camY, 0.00092);
  lid.add(lens);
  return { group: g, display };
}

/** A soft dark disc under an object, for contact shadow. */
function contactShadow(w, d, opacity = 0.55) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, `rgba(0,0,0,${opacity})`);
  gr.addColorStop(0.6, `rgba(0,0,0,${opacity * 0.35})`);
  gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, 128, 128);
  const m = new Mesh(new PlaneGeometry(w, d), new MeshBasicMaterial({ map: new CanvasTexture(c), transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.002;
  return m;
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
  let ready = false;
  const frame = () => {
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

  Promise.all(pending).then(() => {
    computeEnd();
    renderer.compileAsync(scene, camera).catch(() => {}).finally(() => {
      raf = requestAnimationFrame(frame);
      requestAnimationFrame(() => {
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
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
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
      canvas.remove();
    },
  };
}

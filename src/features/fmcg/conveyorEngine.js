// The FMCG panel's scene (plain Three.js): a distribution-centre conveyor.
//
// What the panel's copy describes — supply chain operations, inventory
// tracking and product management — shown as the line itself: packaged goods
// ride a conveyor through a scanning arch that reads and counts each one,
// with stocked pallet racking behind, filmed like a product shot: a slow
// dolly, shallow depth of field, bloom on the scanner light and a film grade.
//
//  - Lit by a CC0 warehouse HDR (Poly Haven, empty_warehouse_01) with a key
//    light for shadows; the floor is CC0 scanned concrete (hangar_concrete_floor).
//  - Everything else, including the product labels, is modelled and drawn
//    here; none of the packaging carries a real brand.
//
// See public/media/fmcg/CREDITS.txt. Loaded lazily by LiveScene; animates only
// while the panel is on screen and disposes everything it allocates.
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  BoxGeometry,
  CanvasTexture,
  Color,
  CylinderGeometry,
  DirectionalLight,
  EquirectangularReflectionMapping,
  Fog,
  Group,
  InstancedMesh,
  LatheGeometry,
  LinearSRGBColorSpace,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  RepeatWrapping,
  Scene,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

const BASE = `${process.env.PUBLIC_URL || ''}/media/fmcg`;
const SPEED = 0.3; // belt speed, m/s
const SPACING = 0.34; // gap between products on the belt, m
const COUNT = 18; // products on the belt (even, so one crosses the arch every SPACING)
const LENGTH = COUNT * SPACING;
const BELT_Y = 0.82; // top of the belt
const SCAN_ZONE = 0.07; // half-width of the arch's reading window, m
const TEAL = '#6fe3d3';

/* ---------- Packaging print ---------- */

// A wrap-around label: a colour field, a word mark, a band and a barcode.
// Invented product names only.
function labelTexture({ base, accent, ink, word, sub }) {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = base;
  g.fillRect(0, 0, 1024, 256);
  g.fillStyle = accent;
  g.fillRect(0, 182, 1024, 30);
  // The front panel sits in the middle of the wrap; repeat it on the back.
  [256, 768].forEach((cx) => {
    g.fillStyle = ink;
    g.font = '700 74px "Share Tech Mono", monospace';
    g.textAlign = 'center';
    g.fillText(word, cx, 118);
    g.font = '26px "Share Tech Mono", monospace';
    g.fillText(sub, cx, 158);
  });
  // Barcode on the side, between the two faces.
  g.fillStyle = '#ffffff';
  g.fillRect(470, 26, 84, 120);
  g.fillStyle = '#111111';
  for (let x = 478; x < 546; x += 3) {
    if (Math.random() > 0.45) g.fillRect(x, 34, Math.random() > 0.5 ? 2 : 1, 96);
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

// Shipping carton: kraft board, a printed panel, tape and handling marks.
function cartonTexture(word) {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = '#b48a5c';
  g.fillRect(0, 0, 512, 512);
  // Board fibre.
  for (let i = 0; i < 2600; i += 1) {
    const v = 150 + Math.random() * 50;
    g.fillStyle = `rgba(${v}, ${v * 0.78}, ${v * 0.52}, 0.16)`;
    g.fillRect(Math.random() * 512, Math.random() * 512, 1 + Math.random() * 6, 1);
  }
  // Tape across the top.
  g.fillStyle = 'rgba(206, 170, 118, 0.85)';
  g.fillRect(0, 0, 512, 54);
  // Printed panel.
  g.strokeStyle = '#3b2a1c';
  g.lineWidth = 5;
  g.strokeRect(70, 150, 372, 210);
  g.fillStyle = '#3b2a1c';
  g.font = '700 64px "Share Tech Mono", monospace';
  g.textAlign = 'center';
  g.fillText(word, 256, 250);
  g.font = '26px "Share Tech Mono", monospace';
  g.fillText('12 x 500 ML', 256, 300);
  g.fillText('THIS WAY UP  ^^', 256, 338);
  // Shipping label.
  g.fillStyle = '#f4f1ea';
  g.fillRect(300, 392, 160, 90);
  g.fillStyle = '#222';
  for (let x = 312; x < 448; x += 3) {
    if (Math.random() > 0.45) g.fillRect(x, 402, Math.random() > 0.5 ? 2 : 1, 44);
  }
  g.font = '18px "Share Tech Mono", monospace';
  g.fillText('DC-07 / A12', 380, 470);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

// The rubber belt: dark, with faint cross ribs that show it moving.
function beltTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = '#17191c';
  g.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 16) {
    g.fillStyle = 'rgba(255, 255, 255, 0.045)';
    g.fillRect(0, y, 256, 3);
  }
  for (let i = 0; i < 1800; i += 1) {
    g.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.03})`;
    g.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.wrapS = RepeatWrapping;
  t.wrapT = RepeatWrapping;
  return t;
}

/* ---------- The products ---------- */

// A 500 ml PET bottle, as a lathe profile (radius, height) in metres.
const BOTTLE_PROFILE = [
  [0.0, 0.0],
  [0.026, 0.0],
  [0.033, 0.005],
  [0.035, 0.018],
  [0.035, 0.118],
  [0.0325, 0.128],
  [0.035, 0.138],
  [0.035, 0.152],
  [0.03, 0.178],
  [0.019, 0.2],
  [0.0135, 0.21],
  [0.0135, 0.226],
].map(([r, y]) => new Vector2(r, y));

const PRODUCTS = [
  { kind: 'bottle', liquid: '#f29a2e', cap: '#e8732c', label: { base: '#fff4e2', accent: '#f29a2e', ink: '#7a3b0c', word: 'CITRUS', sub: 'PRESSED JUICE 500ML' } },
  { kind: 'can', label: { base: '#1f3f8f', accent: '#ffd600', ink: '#ffffff', word: 'VOLT', sub: 'ENERGY 330ML' } },
  { kind: 'bottle', liquid: '#9fd7f0', cap: '#2d6fc0', label: { base: '#e9f6fd', accent: '#2d6fc0', ink: '#123c6b', word: 'SPRING', sub: 'STILL WATER 500ML' } },
  { kind: 'carton', word: 'SPRING' },
  { kind: 'can', label: { base: '#d6362b', accent: '#ffffff', ink: '#ffffff', word: 'FIZZ', sub: 'SPARKLING 330ML' } },
  { kind: 'bottle', liquid: '#3a1a0e', cap: '#c02a22', label: { base: '#c02a22', accent: '#ffffff', ink: '#ffffff', word: 'COLA', sub: 'ORIGINAL 500ML' } },
];

export function createConveyorScene(host, { onReady } = {}) {
  const renderer = new WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
  renderer.debug.checkShaderErrors = process.env.NODE_ENV !== 'production';
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const scene = new Scene();
  scene.background = new Color('#1b1f24');
  scene.fog = new Fog(new Color('#1b1f24'), 7, 22);
  const camera = new PerspectiveCamera(30, 0.8, 0.05, 60);

  const geometries = [];
  const materials = [];
  const textures = [];
  const pending = [];
  let disposed = false;

  const geo = (g) => {
    geometries.push(g);
    return g;
  };
  const mat = (m) => {
    materials.push(m);
    return m;
  };
  const tex = (t) => {
    textures.push(t);
    return t;
  };
  const mesh = (g, m, cast = true, receive = true) => {
    const o = new Mesh(g, m);
    o.castShadow = cast;
    o.receiveShadow = receive;
    return o;
  };

  /* ---------- Light ---------- */
  const pmrem = new PMREMGenerator(renderer);
  pending.push(
    new Promise((res) => {
      new HDRLoader().load(
        `${BASE}/warehouse_1k.hdr`,
        (hdr) => {
          if (disposed) return res();
          hdr.mapping = EquirectangularReflectionMapping;
          const env = pmrem.fromEquirectangular(hdr).texture;
          scene.environment = env;
          scene.environmentIntensity = 0.75;
          textures.push(env, hdr);
          return res();
        },
        undefined,
        () => res()
      );
    })
  );

  // Overhead key light: the high bays of a distribution centre.
  const key = new DirectionalLight(0xfff1df, 2.2);
  key.position.set(-1.6, 6, 2.6);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -4;
  key.shadow.camera.right = 4;
  key.shadow.camera.top = 4;
  key.shadow.camera.bottom = -4;
  key.shadow.camera.far = 14;
  key.shadow.bias = -0.0004;
  key.shadow.radius = 3;
  scene.add(key);

  // The scanner's own light, which flares as each product is read.
  const scanLight = new PointLight(new Color(TEAL), 0, 1.4, 2);
  scanLight.position.set(0, BELT_Y + 0.5, 0.05);
  scene.add(scanLight);

  /* ---------- Floor ---------- */
  const loader = new TextureLoader();
  const floorMat = mat(new MeshStandardMaterial({ color: new Color('#b9bcbf'), roughness: 1, metalness: 0 }));
  const map = (name, srgb) =>
    new Promise((res) => {
      loader.load(
        `${BASE}/tex/hangar_concrete_floor_${name}.jpg`,
        (t) => {
          t.wrapS = RepeatWrapping;
          t.wrapT = RepeatWrapping;
          t.repeat.set(9, 9);
          t.anisotropy = maxAniso;
          t.colorSpace = srgb ? SRGBColorSpace : LinearSRGBColorSpace;
          textures.push(t);
          res(t);
        },
        undefined,
        () => res(null)
      );
    });
  pending.push(
    Promise.all([map('diff', true), map('nor', false), map('rough', false)]).then(([d, n, r]) => {
      if (disposed) return;
      floorMat.map = d;
      floorMat.normalMap = n;
      floorMat.roughnessMap = r;
      floorMat.needsUpdate = true;
    })
  );
  const floor = mesh(geo(new PlaneGeometry(30, 30)), floorMat, false, true);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // Painted safety lines either side of the aisle.
  const lineMat = mat(new MeshStandardMaterial({ color: new Color('#e3b51c'), roughness: 0.7 }));
  [0.95, -1.15].forEach((z) => {
    const line = mesh(geo(new PlaneGeometry(16, 0.08)), lineMat, false, true);
    line.rotation.x = -Math.PI / 2;
    line.position.set(0, 0.002, z);
    scene.add(line);
  });

  /* ---------- The conveyor ---------- */
  const steel = mat(new MeshPhysicalMaterial({ color: new Color('#a8adb3'), metalness: 1, roughness: 0.32, envMapIntensity: 0.9 }));
  const paint = mat(new MeshStandardMaterial({ color: new Color('#30353c'), metalness: 0.4, roughness: 0.55 }));
  const beltMap = tex(beltTexture());
  beltMap.repeat.set((LENGTH + 0.6) / 0.5, 1);
  const beltMat = mat(new MeshStandardMaterial({ map: beltMap, roughness: 0.85, metalness: 0 }));

  const run = LENGTH + 0.6;
  const belt = mesh(geo(new BoxGeometry(run, 0.02, 0.46)), beltMat, false, true);
  belt.position.y = BELT_Y - 0.01;
  scene.add(belt);
  [-1, 1].forEach((side) => {
    const frame = mesh(geo(new BoxGeometry(run, 0.12, 0.04)), paint);
    frame.position.set(0, BELT_Y - 0.035, side * 0.25);
    scene.add(frame);
    const guide = mesh(geo(new CylinderGeometry(0.008, 0.008, run, 12)), steel);
    guide.rotation.z = Math.PI / 2;
    guide.position.set(0, BELT_Y + 0.07, side * 0.235);
    scene.add(guide);
    for (let x = -run / 2 + 0.3; x < run / 2; x += 1.2) {
      const leg = mesh(geo(new BoxGeometry(0.05, BELT_Y - 0.09, 0.05)), paint);
      leg.position.set(x, (BELT_Y - 0.09) / 2, side * 0.22);
      scene.add(leg);
      const post = mesh(geo(new CylinderGeometry(0.006, 0.006, 0.08, 8)), steel);
      post.position.set(x, BELT_Y + 0.03, side * 0.235);
      scene.add(post);
    }
  });

  /* ---------- The scanning arch ---------- */
  const arch = new Group();
  [-1, 1].forEach((side) => {
    const postMesh = mesh(geo(new BoxGeometry(0.07, 0.64, 0.07)), paint);
    postMesh.position.set(0, BELT_Y + 0.29, side * 0.34);
    arch.add(postMesh);
  });
  const beam = mesh(geo(new BoxGeometry(0.14, 0.11, 0.8)), paint);
  beam.position.set(0, BELT_Y + 0.64, 0);
  arch.add(beam);
  const ledMat = mat(new MeshBasicMaterial({ color: new Color(TEAL), toneMapped: false }));
  const led = mesh(geo(new BoxGeometry(0.03, 0.012, 0.62)), ledMat, false, false);
  led.position.set(0, BELT_Y + 0.58, 0);
  arch.add(led);
  // The light curtain the products pass through.
  const curtainMat = mat(
    new MeshBasicMaterial({ color: new Color(TEAL), transparent: true, opacity: 0.05, blending: AdditiveBlending, depthWrite: false, toneMapped: false })
  );
  const curtain = mesh(geo(new PlaneGeometry(0.62, 0.56)), curtainMat, false, false);
  curtain.rotation.y = Math.PI / 2;
  curtain.position.set(0, BELT_Y + 0.29, 0);
  arch.add(curtain);
  // The reading line that sweeps up each product.
  const sweepMat = mat(new MeshBasicMaterial({ color: new Color(TEAL), transparent: true, opacity: 0, toneMapped: false, depthWrite: false }));
  const sweep = mesh(geo(new BoxGeometry(0.004, 0.005, 0.6)), sweepMat, false, false);
  arch.add(sweep);

  // The status board on top of the arch, facing the aisle.
  const boardCanvas = document.createElement('canvas');
  boardCanvas.width = 1024;
  boardCanvas.height = 300;
  const boardTex = tex(new CanvasTexture(boardCanvas));
  boardTex.colorSpace = SRGBColorSpace;
  boardTex.anisotropy = 8;
  const boardMat = mat(new MeshBasicMaterial({ map: boardTex, toneMapped: false }));
  const housing = mesh(geo(new BoxGeometry(0.64, 0.2, 0.04)), paint);
  housing.position.set(0, BELT_Y + 0.82, 0);
  arch.add(housing);
  const board = mesh(geo(new PlaneGeometry(0.6, 0.176)), boardMat, false, false);
  board.position.set(0, BELT_Y + 0.82, 0.021);
  arch.add(board);
  scene.add(arch);

  let lastBoard = '';
  const drawBoard = (scanned, item, onHand) => {
    const keyText = `${scanned}|${item}`;
    if (keyText === lastBoard) return;
    lastBoard = keyText;
    const g = boardCanvas.getContext('2d');
    g.fillStyle = '#0c1014';
    g.fillRect(0, 0, 1024, 300);
    g.fillStyle = '#8d9aa4';
    g.font = '30px "Share Tech Mono", monospace';
    g.fillText('INVENTORY  ·  LINE 3', 40, 56);
    g.fillStyle = TEAL;
    g.beginPath();
    g.arc(980, 46, 12, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#8d9aa4';
    g.font = '26px "Share Tech Mono", monospace';
    g.fillText('SCANNED', 40, 128);
    g.fillText('ON HAND', 560, 128);
    g.fillStyle = '#eef1f3';
    g.font = '700 84px "Share Tech Mono", monospace';
    g.fillText(scanned.toLocaleString('en-US'), 40, 212);
    g.fillText(`${onHand.toFixed(1)}%`, 560, 212);
    g.fillStyle = TEAL;
    g.font = '28px "Share Tech Mono", monospace';
    g.fillText(`✓ ${item}`, 40, 270);
    boardTex.needsUpdate = true;
  };

  /* ---------- Products ---------- */
  const bottleGeo = geo(new LatheGeometry(BOTTLE_PROFILE, 48));
  const bandGeo = geo(new CylinderGeometry(0.0356, 0.0356, 0.064, 48, 1, true));
  const capGeo = geo(new CylinderGeometry(0.0145, 0.0145, 0.022, 32));
  const canGeo = geo(new CylinderGeometry(0.033, 0.033, 0.115, 48));
  const cartonGeo = geo(new RoundedBoxGeometry(0.21, 0.16, 0.17, 2, 0.006));
  const alu = mat(new MeshPhysicalMaterial({ color: new Color('#c9ccd0'), metalness: 1, roughness: 0.26 }));

  const looks = PRODUCTS.map((p) => {
    if (p.kind === 'carton') {
      const m = mat(new MeshStandardMaterial({ map: tex(cartonTexture(p.word)), roughness: 0.92 }));
      return { ...p, carton: m };
    }
    const label = tex(labelTexture(p.label));
    if (p.kind === 'can') {
      const side = mat(new MeshPhysicalMaterial({ map: label, metalness: 0.85, roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.2 }));
      return { ...p, can: [side, alu, alu] };
    }
    const body = mat(
      new MeshPhysicalMaterial({
        color: new Color('#ffffff'),
        metalness: 0,
        roughness: 0.04,
        transmission: 1,
        thickness: 0.05,
        ior: 1.45,
        attenuationColor: new Color(p.liquid),
        attenuationDistance: 0.06,
        clearcoat: 1,
        clearcoatRoughness: 0.03,
      })
    );
    const band = mat(new MeshStandardMaterial({ map: label, roughness: 0.4 }));
    const cap = mat(new MeshStandardMaterial({ color: new Color(p.cap), roughness: 0.45 }));
    return { ...p, body, band, cap };
  });

  const items = [];
  for (let i = 0; i < COUNT; i += 1) {
    const look = looks[i % looks.length];
    const g = new Group();
    let height = 0.12;
    if (look.kind === 'bottle') {
      g.add(mesh(bottleGeo, look.body));
      const band = mesh(bandGeo, look.band, false, true);
      band.position.y = 0.083;
      g.add(band);
      const cap = mesh(capGeo, look.cap);
      cap.position.y = 0.236;
      g.add(cap);
      height = 0.247;
    } else if (look.kind === 'can') {
      const can = mesh(canGeo, look.can);
      can.position.y = 0.0575;
      g.add(can);
      height = 0.115;
    } else {
      const box = mesh(cartonGeo, look.carton);
      box.position.y = 0.08;
      g.add(box);
      height = 0.16;
    }
    g.rotation.y = (Math.random() - 0.5) * 0.5;
    g.userData = { index: i, height, name: look.label ? look.label.word : `${look.word} CASE` };
    scene.add(g);
    items.push(g);
  }

  /* ---------- Racking behind the line ---------- */
  const rackPaint = mat(new MeshStandardMaterial({ color: new Color('#e0622a'), metalness: 0.3, roughness: 0.5 }));
  const beamPaint = mat(new MeshStandardMaterial({ color: new Color('#2a59b8'), metalness: 0.3, roughness: 0.5 }));
  const palletWood = mat(new MeshStandardMaterial({ color: new Color('#9a7b56'), roughness: 0.9 }));
  const wrap = mat(new MeshPhysicalMaterial({ color: new Color('#ffffff'), roughness: 0.18, metalness: 0, transparent: true, opacity: 0.16, depthWrite: false }));
  const rackCarton = mat(new MeshStandardMaterial({ map: tex(cartonTexture('STOCK')), roughness: 0.92 }));

  const BAY = 2.7;
  const LEVELS = [0, 1.45, 2.9];
  const uprightGeo = geo(new BoxGeometry(0.08, 4.1, 0.08));
  const rackBeamGeo = geo(new BoxGeometry(BAY, 0.12, 0.05));
  const palletGeo = geo(new BoxGeometry(1.15, 0.14, 0.95));
  const caseGeo = geo(new BoxGeometry(0.37, 0.28, 0.31));
  const wrapGeo = geo(new BoxGeometry(1.14, 0.88, 0.96));

  const dummy = new Object3D();
  const buildRack = (z, bays, x0) => {
    const uprights = new InstancedMesh(uprightGeo, rackPaint, (bays + 1) * 2);
    const beams = new InstancedMesh(rackBeamGeo, beamPaint, bays * LEVELS.length * 2);
    const pallets = new InstancedMesh(palletGeo, palletWood, bays * LEVELS.length * 2);
    const cases = new InstancedMesh(caseGeo, rackCarton, bays * LEVELS.length * 2 * 27);
    const wraps = new InstancedMesh(wrapGeo, wrap, bays * LEVELS.length * 2);
    [uprights, beams, pallets, cases].forEach((m) => {
      m.castShadow = true;
      m.receiveShadow = true;
    });
    let u = 0;
    let b = 0;
    let p = 0;
    let c = 0;
    const set = (inst, i, x, y, zz) => {
      dummy.position.set(x, y, zz);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
    };
    const SIDES = [-0.5, 0.5];
    const SLOTS = [-0.66, 0.66];
    for (let bay = 0; bay <= bays; bay += 1) {
      for (let k = 0; k < SIDES.length; k += 1) {
        set(uprights, u, x0 + bay * BAY, 2.05, z + SIDES[k]);
        u += 1;
      }
    }
    for (let bay = 0; bay < bays; bay += 1) {
      const cx = x0 + bay * BAY + BAY / 2;
      for (let l = 0; l < LEVELS.length; l += 1) {
        const y = LEVELS[l];
        for (let k = 0; k < SIDES.length; k += 1) {
          set(beams, b, cx, y + 0.12, z + SIDES[k]);
          b += 1;
        }
        for (let k = 0; k < SLOTS.length; k += 1) {
          const px = cx + SLOTS[k];
          set(pallets, p, px, y + 0.25, z);
          set(wraps, p, px, y + 0.76, z);
          p += 1;
          for (let ix = 0; ix < 3; ix += 1) {
            for (let iy = 0; iy < 3; iy += 1) {
              for (let iz = 0; iz < 3; iz += 1) {
                set(cases, c, px + (ix - 1) * 0.375, y + 0.46 + iy * 0.285, z + (iz - 1) * 0.315);
                c += 1;
              }
            }
          }
        }
      }
    }
    const group = new Group();
    [uprights, beams, pallets, cases, wraps].forEach((m) => {
      m.instanceMatrix.needsUpdate = true;
      group.add(m);
    });
    return group;
  };
  scene.add(buildRack(-3.6, 5, -6.75));
  scene.add(buildRack(-7.6, 6, -8.1));

  // High-bay lights over the racking.
  const lampMat = mat(new MeshBasicMaterial({ color: new Color('#fff4e3'), toneMapped: false }));
  for (let x = -6; x <= 6; x += 3) {
    const lamp = mesh(geo(new BoxGeometry(1.2, 0.05, 0.16)), lampMat, false, false);
    lamp.position.set(x, 5.2, -1.2);
    scene.add(lamp);
  }

  /* ---------- Lens: depth of field on the arch, bloom, grade ---------- */
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bokeh = new BokehPass(scene, camera, { focus: 2, aperture: 0.006, maxblur: 0.012 });
  composer.addPass(bokeh);
  const bloom = new UnrealBloomPass(new Vector2(512, 512), 0.55, 0.55, 0.92);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const grade = new ShaderPass({
    uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uRes: { value: new Vector2(1, 1) } },
    vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `
      uniform sampler2D tDiffuse; uniform float uTime; uniform vec2 uRes; varying vec2 vUv;
      void main() {
        vec3 c = texture2D(tDiffuse, vUv).rgb;
        vec3 g = mix(c, c * c * (3.0 - 2.0 * c), 0.2);
        float l = dot(g, vec3(0.2126, 0.7152, 0.0722));
        g += vec3(-0.012, 0.004, 0.022) * (1.0 - l) + vec3(0.022, 0.009, -0.014) * l;
        vec2 d = vUv - 0.5;
        g *= mix(0.72, 1.0, smoothstep(0.85, 0.25, length(d * vec2(1.0, 1.15))));
        float n = fract(sin(dot(floor(vUv * uRes) + fract(uTime * 7.0) * 91.0, vec2(12.9898, 78.233))) * 43758.5453);
        g += (n - 0.5) * 0.026;
        gl_FragColor = vec4(clamp(g, 0.0, 1.0), 1.0);
      }`,
  });
  composer.addPass(grade);

  host.appendChild(renderer.domElement);

  /* ---------- The loop ---------- */
  let raf = 0;
  let start = 0;
  let elapsed = 0;
  let visible = false;
  let running = false;
  const focusPoint = new Vector3(0, BELT_Y + 0.25, 0);

  const place = (t) => {
    // Camera: a three-quarter telephoto shot down the line, drifting slowly
    // around the arch so the products come towards it and away again.
    const drift = Math.sin(t * 0.1);
    const orbit = 0.78 + drift * 0.16;
    const reach = 2.55 - Math.cos(t * 0.08) * 0.12;
    camera.position.set(Math.sin(orbit) * reach, 1.36 + Math.sin(t * 0.07) * 0.04, Math.cos(orbit) * reach);
    camera.lookAt(0, 1.08, 0);
    bokeh.uniforms.focus.value = camera.position.distanceTo(focusPoint);

    // The belt and everything on it.
    beltMap.offset.x = -((SPEED * t) / 0.5) % 1;
    let read = 0;
    let readHeight = 0;
    let readPhase = 0;
    items.forEach((g, i) => {
      const x = -LENGTH / 2 + ((i * SPACING + SPEED * t) % LENGTH);
      g.position.set(x, BELT_Y, 0);
      g.visible = Math.abs(x) < LENGTH / 2 - 0.05;
      const near = 1 - Math.abs(x) / SCAN_ZONE;
      if (near > read) {
        read = near;
        readHeight = g.userData.height;
        readPhase = (x + SCAN_ZONE) / (SCAN_ZONE * 2);
      }
    });

    // The arch: the curtain and the light flare while something is in it,
    // and the reading line climbs the product.
    const active = Math.max(0, read);
    curtainMat.opacity = 0.05 + active * 0.16;
    scanLight.intensity = active * 1.6;
    sweepMat.opacity = active > 0 ? 0.95 : 0;
    sweep.position.set(0, BELT_Y + 0.01 + readHeight * Math.min(1, Math.max(0, readPhase)), 0);

    // One product crosses the arch every SPACING / SPEED seconds.
    const crossed = Math.floor((SPEED * t) / SPACING);
    const last = items[(((COUNT / 2 - crossed) % COUNT) + COUNT) % COUNT];
    drawBoard(18240 + crossed, last ? last.userData.name : '', 97.8 + ((crossed * 7) % 13) / 10);

    grade.uniforms.uTime.value = t;
  };

  const draw = () => composer.render();

  const frame = (now) => {
    raf = 0;
    if (disposed) return;
    if (!start) start = now;
    elapsed = (now - start) / 1000;
    place(elapsed);
    draw();
    schedule();
  };
  const schedule = () => {
    if (!raf && running && visible && !document.hidden && !disposed) raf = requestAnimationFrame(frame);
  };

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = host;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    composer.setPixelRatio?.(dpr);
    composer.setSize(w, h);
    grade.uniforms.uRes.value.set(w * dpr, h * dpr);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    place(elapsed);
    draw();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);

  const io = new IntersectionObserver(
    ([e]) => {
      visible = e.isIntersecting;
      if (visible) schedule();
    },
    { threshold: 0.1 }
  );
  io.observe(host);

  const onVisibility = () => !document.hidden && schedule();
  document.addEventListener('visibilitychange', onVisibility);

  // The poster stays up until the light and the floor are in.
  Promise.all(pending).then(async () => {
    if (disposed) return;
    if (renderer.compileAsync) await renderer.compileAsync(scene, camera);
    if (disposed) return;
    resize();
    onReady?.();
  });

  return {
    play() {
      running = true;
      start = elapsed ? performance.now() - elapsed * 1000 : 0;
      schedule();
    },
    pause() {
      running = false;
      cancelAnimationFrame(raf);
      raf = 0;
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      composer.dispose?.();
      bloom.dispose();
      bokeh.dispose?.();
      grade.dispose?.();
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

// The insurance panel's scene (plain Three.js): a claims desk, close up.
//
// What the panel's copy describes — automated claims processing, customer
// interactions and risk management — shown as the work itself: a stack of
// claim forms on a walnut desk, each sheet lifting off in turn, being read by
// a scanning pass, settling on the processed pile with its decision, while the
// laptop beside it keeps score.
//
//  - Lit by the CC0 interior HDR already in public/media/office (Poly Haven),
//    with a warm desk lamp and a cool window fill.
//  - The desk is the walnut veneer from the same CC0 set.
//  - The laptop is the homepage hero's model, shared from features/desk/laptop.
//  - The paperwork and the dashboard are drawn into canvases here.
//
// Loaded lazily by LiveScene; animates only while the panel is on screen
// and disposes everything it allocates.
import {
  ACESFilmicToneMapping,
  CanvasTexture,
  Color,
  CylinderGeometry,
  DirectionalLight,
  EquirectangularReflectionMapping,
  Group,
  LinearSRGBColorSpace,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  RepeatWrapping,
  Scene,
  SpotLight,
  SRGBColorSpace,
  TextureLoader,
  WebGLRenderer,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';
import { buildLaptop, contactShadow } from '../desk/laptop';

const OFFICE = `${process.env.PUBLIC_URL || ''}/media/office`;
const CLAIM_SECONDS = 4.6; // one sheet, start to filed
const STACK = 26; // sheets waiting in the in-tray
const PAPER = { w: 0.21, h: 0.297, t: 0.0007 }; // A4, in metres

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const clamp01 = (t) => Math.min(1, Math.max(0, t));

/* ---------- The paperwork ---------- */

// A claim form: a printed sheet, drawn once and shared by every copy. The
// fields are generic so the sheet is a claim form, not any real document.
function formTexture() {
  const W = 724;
  const H = Math.round((W * PAPER.h) / PAPER.w);
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#f7f5f0';
  g.fillRect(0, 0, W, H);

  const pad = 54;
  g.fillStyle = '#1d2a33';
  g.font = '600 34px "Share Tech Mono", monospace';
  g.fillText('CLAIM FORM', pad, 86);
  g.fillStyle = '#8d9aa4';
  g.font = '20px "Share Tech Mono", monospace';
  g.fillText('MOTOR / PROPERTY', pad, 118);

  // A reference block, top right.
  g.fillStyle = '#e8e4dc';
  g.fillRect(W - pad - 190, 54, 190, 72);
  g.fillStyle = '#5b6973';
  g.font = '17px "Share Tech Mono", monospace';
  g.fillText('REF', W - pad - 174, 80);
  g.fillStyle = '#1d2a33';
  g.font = '600 24px "Share Tech Mono", monospace';
  g.fillText('CLM-4471', W - pad - 174, 110);

  g.strokeStyle = '#cdc7bc';
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(pad, 142);
  g.lineTo(W - pad, 142);
  g.stroke();

  // Labelled fields with handwriting-weight rules under them.
  const fields = ['POLICY NUMBER', 'CLAIMANT', 'DATE OF LOSS', 'DESCRIPTION', 'AMOUNT CLAIMED', 'ASSESSOR'];
  let y = 196;
  fields.forEach((label) => {
    g.fillStyle = '#93a0a9';
    g.font = '18px "Share Tech Mono", monospace';
    g.fillText(label, pad, y);
    g.strokeStyle = '#d8d2c7';
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(pad, y + 34);
    g.lineTo(W - pad, y + 34);
    g.stroke();
    // The filled-in value, as ink-coloured ticks rather than fake words.
    g.strokeStyle = '#46525c';
    g.lineWidth = 3;
    g.beginPath();
    let x = pad + 8;
    const end = pad + 110 + Math.random() * (W - pad * 2 - 200);
    while (x < end) {
      const run = 14 + Math.random() * 46;
      g.moveTo(x, y + 26);
      g.lineTo(Math.min(x + run, end), y + 26);
      x += run + 9 + Math.random() * 10;
    }
    g.stroke();
    y += 92;
  });

  // A small table of line items at the foot.
  g.fillStyle = '#eceae4';
  g.fillRect(pad, y + 6, W - pad * 2, 150);
  g.strokeStyle = '#d8d2c7';
  for (let i = 1; i < 4; i += 1) {
    g.beginPath();
    g.moveTo(pad, y + 6 + i * 37);
    g.lineTo(W - pad, y + 6 + i * 37);
    g.stroke();
  }
  g.beginPath();
  g.moveTo(W - pad - 150, y + 6);
  g.lineTo(W - pad - 150, y + 156);
  g.stroke();

  // Signature.
  g.strokeStyle = '#2b3942';
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(pad + 10, H - 96);
  for (let i = 0; i < 34; i += 1) {
    g.lineTo(pad + 10 + i * 6, H - 96 - Math.sin(i * 0.8) * 16 - Math.random() * 5);
  }
  g.stroke();
  g.strokeStyle = '#d8d2c7';
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(pad, H - 72);
  g.lineTo(pad + 270, H - 72);
  g.stroke();
  g.fillStyle = '#93a0a9';
  g.font = '17px "Share Tech Mono", monospace';
  g.fillText('SIGNATURE', pad, H - 46);

  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/* ---------- The laptop's dashboard ---------- */

// Drawn fresh each time the numbers move; the texture is reused in place.
function makeDashboard() {
  const W = 1280;
  const H = 800;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d');
  const texture = new CanvasTexture(c);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;

  const bars = Array.from({ length: 12 }, () => 0.3 + Math.random() * 0.5);

  const draw = (state) => {
    const { processed, risk, flagged, scanning } = state;
    g.fillStyle = '#0d1117';
    g.fillRect(0, 0, W, H);

    // Title bar.
    g.fillStyle = '#161d26';
    g.fillRect(0, 0, W, 86);
    g.fillStyle = '#e8eaed';
    g.font = '600 32px "Share Tech Mono", monospace';
    g.fillText('CLAIMS AUTOMATION', 44, 55);
    g.fillStyle = scanning ? '#6fe3d3' : '#5b6973';
    g.beginPath();
    g.arc(W - 62, 43, 11, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#8d9aa4';
    g.font = '20px "Share Tech Mono", monospace';
    g.fillText(scanning ? 'PROCESSING' : 'IDLE', W - 250, 51);

    // Risk dial.
    const cx = 250;
    const cy = 330;
    const r = 120;
    g.lineWidth = 22;
    g.strokeStyle = '#1b232d';
    g.beginPath();
    g.arc(cx, cy, r, Math.PI * 0.75, Math.PI * 2.25);
    g.stroke();
    g.strokeStyle = risk > 0.66 ? '#e8734a' : risk > 0.4 ? '#f0b429' : '#6fe3d3';
    g.beginPath();
    g.arc(cx, cy, r, Math.PI * 0.75, Math.PI * 0.75 + Math.PI * 1.5 * risk);
    g.stroke();
    g.fillStyle = '#e8eaed';
    g.font = '600 66px "Share Tech Mono", monospace';
    g.textAlign = 'center';
    g.fillText(risk.toFixed(2), cx, cy + 20);
    g.fillStyle = '#8d9aa4';
    g.font = '20px "Share Tech Mono", monospace';
    g.fillText('RISK SCORE', cx, cy + 62);
    g.textAlign = 'left';

    // Counters.
    const stat = (label, value, x, y, colour) => {
      g.fillStyle = '#8d9aa4';
      g.font = '19px "Share Tech Mono", monospace';
      g.fillText(label, x, y);
      g.fillStyle = colour;
      g.font = '600 52px "Share Tech Mono", monospace';
      g.fillText(value, x, y + 58);
    };
    stat('PROCESSED TODAY', String(processed).padStart(4, '0'), 470, 190, '#e8eaed');
    stat('FLAGGED', String(flagged).padStart(3, '0'), 470, 300, '#e8734a');
    stat('STRAIGHT THROUGH', `${Math.round(((processed - flagged) / Math.max(1, processed)) * 100)}%`, 470, 410, '#6fe3d3');

    // Throughput bars.
    g.fillStyle = '#8d9aa4';
    g.font = '19px "Share Tech Mono", monospace';
    g.fillText('THROUGHPUT', 850, 190);
    bars.forEach((v, i) => {
      const bh = v * 190;
      g.fillStyle = i === bars.length - 1 ? '#6fe3d3' : '#2a3540';
      g.fillRect(850 + i * 30, 420 - bh, 20, bh);
    });

    // Queue rows at the foot.
    g.fillStyle = '#161d26';
    g.fillRect(44, 500, W - 88, 250);
    g.fillStyle = '#8d9aa4';
    g.font = '19px "Share Tech Mono", monospace';
    g.fillText('QUEUE', 70, 540);
    for (let i = 0; i < 4; i += 1) {
      const y = 570 + i * 44;
      g.fillStyle = '#1e2731';
      g.fillRect(70, y, W - 140, 32);
      g.fillStyle = '#5b6973';
      g.font = '18px "Share Tech Mono", monospace';
      g.fillText(`CLM-${4471 - i}`, 84, y + 23);
      g.fillStyle = i === 0 && scanning ? '#6fe3d3' : '#3a4650';
      g.fillRect(260, y + 10, 180 + i * 60, 12);
    }

    texture.needsUpdate = true;
  };

  return { texture, draw };
}

export function createClaimsDeskScene(host, { onReady } = {}) {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.debug.checkShaderErrors = process.env.NODE_ENV !== 'production';
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 0.8, 0.05, 20);

  const geometries = [];
  const materials = [];
  const textures = [];
  const pending = [];
  let disposed = false;

  const keep = (geo, material, cast = true, receive = true) => {
    geometries.push(geo);
    const m = new Mesh(geo, material);
    m.castShadow = cast;
    m.receiveShadow = receive;
    return m;
  };

  /* ---------- Light: the office HDR, a desk lamp and a window ---------- */
  const pmrem = new PMREMGenerator(renderer);
  pending.push(
    new Promise((res) => {
      new HDRLoader().load(
        `${OFFICE}/city_1k.hdr`,
        (hdr) => {
          if (disposed) return res();
          hdr.mapping = EquirectangularReflectionMapping;
          const env = pmrem.fromEquirectangular(hdr).texture;
          scene.environment = env;
          scene.environmentIntensity = 0.7;
          textures.push(env, hdr);
          return res();
        },
        undefined,
        () => res()
      );
    })
  );

  // The lamp: a warm pool of light from the upper left, throwing the paper
  // shadows across the desk.
  const lamp = new SpotLight(0xffd9a8, 13, 3.4, 0.74, 0.5, 1.5);
  lamp.position.set(-0.62, 0.96, 0.34);
  lamp.target.position.set(-0.04, 0, -0.02);
  lamp.castShadow = true;
  lamp.shadow.mapSize.set(2048, 2048);
  lamp.shadow.bias = -0.0004;
  lamp.shadow.radius = 4;
  lamp.shadow.camera.near = 0.1;
  lamp.shadow.camera.far = 3;
  scene.add(lamp, lamp.target);

  // A cool window fill from the right, so the warm pool has something to sit in.
  const windowFill = new DirectionalLight(0xbcd4ea, 0.7);
  windowFill.position.set(1.4, 1.1, 0.9);
  scene.add(windowFill);

  // The laptop's own glow, picked up by the desk and the nearest sheets.
  const glow = new PointLight(0x9fd4e8, 0.5, 1.1, 2);
  glow.position.set(0.3, 0.2, -0.16);
  scene.add(glow);

  /* ---------- The desk ---------- */
  const texLoader = new TextureLoader();
  const map = (file, repeat, srgb) =>
    new Promise((res) => {
      texLoader.load(
        `${OFFICE}/tex/${file}.jpg`,
        (t) => {
          t.wrapS = RepeatWrapping;
          t.wrapT = RepeatWrapping;
          t.repeat.set(repeat, repeat);
          t.anisotropy = maxAniso;
          if (srgb) t.colorSpace = SRGBColorSpace;
          else t.colorSpace = LinearSRGBColorSpace;
          textures.push(t);
          res(t);
        },
        undefined,
        () => res(null)
      );
    });

  const deskMat = new MeshPhysicalMaterial({
    // The veneer scan is pale; this pulls it back to walnut.
    color: new Color('#8d6243'),
    roughness: 0.42,
    metalness: 0,
    clearcoat: 0.45,
    clearcoatRoughness: 0.3,
  });
  materials.push(deskMat);
  pending.push(
    Promise.all([
      map('natural_walnut_veneer_diff', 3.4, true),
      map('natural_walnut_veneer_nor', 3.4, false),
      map('natural_walnut_veneer_rough', 3.4, false),
    ]).then(([diff, nor, rough]) => {
      if (disposed) return;
      deskMat.map = diff;
      deskMat.normalMap = nor;
      deskMat.roughnessMap = rough;
      deskMat.needsUpdate = true;
    })
  );

  const desk = keep(new RoundedBoxGeometry(2.4, 0.05, 1.3, 4, 0.004), deskMat, false, true);
  desk.position.y = -0.025;
  scene.add(desk);

  // A wall well behind, catching the lamp and giving the frame a back.
  const wallMat = new MeshStandardMaterial({ color: new Color('#3c434c'), roughness: 0.95 });
  materials.push(wallMat);
  const wall = keep(new PlaneGeometry(6, 3), wallMat, false, true);
  wall.position.set(0, 0.9, -0.95);
  scene.add(wall);

  /* ---------- The laptop ---------- */
  const laptop = buildLaptop();
  laptop.group.position.set(0.25, 0, -0.24);
  laptop.group.rotation.y = -0.56;
  laptop.group.scale.setScalar(1.0);
  scene.add(laptop.group);
  const dashboard = makeDashboard();
  laptop.display.material = new MeshBasicMaterial({ map: dashboard.texture, toneMapped: false });
  materials.push(laptop.display.material);
  textures.push(dashboard.texture);

  const shade = contactShadow(0.56, 0.44, 0.5);
  shade.position.set(0.25, 0.0015, -0.24);
  scene.add(shade);
  geometries.push(shade.geometry);
  materials.push(shade.material);

  /* ---------- The paperwork ---------- */
  const formMap = formTexture();
  textures.push(formMap);
  const paperFront = new MeshStandardMaterial({ map: formMap, roughness: 0.92, metalness: 0 });
  const paperBack = new MeshStandardMaterial({ color: new Color('#efece5'), roughness: 0.94, metalness: 0 });
  materials.push(paperFront, paperBack);
  // Box faces are ordered +x, -x, +y, -y, +z, -z: the printed side faces up.
  const paperFaces = [paperBack, paperBack, paperFront, paperBack, paperBack, paperBack];
  const sheetGeo = new RoundedBoxGeometry(PAPER.w, PAPER.t, PAPER.h, 1, 0.0002);
  geometries.push(sheetGeo);

  const IN_TRAY = { x: -0.24, z: 0.07 };
  const OUT_TRAY = { x: 0.04, z: 0.24 };

  const sheet = (i) => {
    const m = new Mesh(sheetGeo, paperFaces);
    m.castShadow = true;
    m.receiveShadow = true;
    m.rotation.y = (Math.random() - 0.5) * 0.06;
    m.position.set(IN_TRAY.x + (Math.random() - 0.5) * 0.005, i * PAPER.t * 1.6, IN_TRAY.z + (Math.random() - 0.5) * 0.005);
    return m;
  };

  const stack = [];
  for (let i = 0; i < STACK; i += 1) {
    const s = sheet(i);
    scene.add(s);
    stack.push(s);
  }
  // The sheet in hand, and the pile it lands on.
  const live = sheet(STACK);
  scene.add(live);
  const filed = [];
  const fileSheet = () => {
    const m = new Mesh(sheetGeo, paperFaces);
    m.castShadow = true;
    m.receiveShadow = true;
    m.position.set(OUT_TRAY.x + (Math.random() - 0.5) * 0.012, filed.length * PAPER.t * 1.6, OUT_TRAY.z + (Math.random() - 0.5) * 0.012);
    m.rotation.y = -0.35 + (Math.random() - 0.5) * 0.09;
    scene.add(m);
    filed.push(m);
  };
  const clearPile = () => {
    filed.forEach((m) => scene.remove(m));
    filed.length = 0;
  };

  // A pen, lying where it was put down.
  const penBody = new MeshPhysicalMaterial({ color: new Color('#14181c'), roughness: 0.3, metalness: 0.1, clearcoat: 0.8, clearcoatRoughness: 0.15 });
  const penMetal = new MeshStandardMaterial({ color: new Color('#b9bdc4'), roughness: 0.25, metalness: 1 });
  materials.push(penBody, penMetal);
  const pen = new Group();
  const barrel = keep(new CylinderGeometry(0.0045, 0.0042, 0.1, 20), penBody);
  barrel.rotation.z = Math.PI / 2;
  pen.add(barrel);
  const cone = keep(new CylinderGeometry(0.0042, 0.0012, 0.022, 20), penMetal);
  cone.rotation.z = -Math.PI / 2;
  cone.position.x = 0.061;
  pen.add(cone);
  const cap = keep(new CylinderGeometry(0.0047, 0.0047, 0.018, 20), penMetal);
  cap.rotation.z = Math.PI / 2;
  cap.position.x = -0.054;
  pen.add(cap);
  const clip = keep(new RoundedBoxGeometry(0.022, 0.0016, 0.004, 2, 0.0006), penMetal);
  clip.position.set(-0.05, 0.0048, 0);
  pen.add(clip);
  pen.position.set(0.31, 0.0047, 0.08);
  pen.rotation.y = -1.12;
  scene.add(pen);

  // The scanning bar that runs down the sheet as it is read.
  const scanMat = new MeshBasicMaterial({ color: new Color('#6fe3d3'), transparent: true, opacity: 0, toneMapped: false, depthWrite: false });
  materials.push(scanMat);
  const scan = keep(new PlaneGeometry(PAPER.w * 1.04, 0.012), scanMat, false, false);
  scan.rotation.x = -Math.PI / 2;
  scan.position.y = PAPER.t / 2 + 0.0008;
  live.add(scan);

  // The decision, stamped on the sheet once it has been read.
  const verdictCanvas = document.createElement('canvas');
  verdictCanvas.width = 512;
  verdictCanvas.height = 180;
  const verdictTex = new CanvasTexture(verdictCanvas);
  verdictTex.colorSpace = SRGBColorSpace;
  textures.push(verdictTex);
  const verdictMat = new MeshBasicMaterial({ map: verdictTex, transparent: true, opacity: 0, toneMapped: false, depthWrite: false });
  materials.push(verdictMat);
  const verdict = keep(new PlaneGeometry(0.135, 0.047), verdictMat, false, false);
  verdict.rotation.x = -Math.PI / 2;
  verdict.position.set(0.028, PAPER.t / 2 + 0.0011, 0.098);
  live.add(verdict);

  const drawVerdict = (approved) => {
    const g = verdictCanvas.getContext('2d');
    g.clearRect(0, 0, 512, 180);
    g.strokeStyle = approved ? '#2f9e7e' : '#d1742f';
    g.lineWidth = 9;
    g.strokeRect(14, 14, 484, 152);
    g.fillStyle = approved ? '#2f9e7e' : '#d1742f';
    g.font = '600 74px "Share Tech Mono", monospace';
    g.textAlign = 'center';
    g.fillText(approved ? 'APPROVED' : 'REVIEW', 256, 118);
    g.textAlign = 'left';
    verdictTex.needsUpdate = true;
  };

  host.appendChild(renderer.domElement);

  /* ---------- The loop ---------- */
  let raf = 0;
  let start = 0;
  let elapsed = 0;
  let visible = false;
  let running = false;
  let claim = -1;
  let processed = 1286;
  let flagged = 71;
  let risk = 0.24;
  let approved = true;

  const draw = () => renderer.render(scene, camera);

  const newClaim = (index) => {
    claim = index;
    approved = Math.random() > 0.28;
    risk = approved ? 0.12 + Math.random() * 0.26 : 0.58 + Math.random() * 0.36;
    drawVerdict(approved);
    live.userData.filed = false;
    if (filed.length >= 15) clearPile();
    // Take the next sheet off the stack; refill it when it runs out.
    const top = stack.pop();
    if (top) scene.remove(top);
    if (!stack.length) {
      for (let i = 0; i < STACK; i += 1) {
        const s = sheet(i);
        scene.add(s);
        stack.push(s);
      }
    }
  };

  const place = (t) => {
    // Camera: a slow breath around the desk, always looking at the paperwork.
    const drift = t * 0.08;
    camera.position.set(0.03 + Math.sin(drift) * 0.07, 1.04 + Math.sin(drift * 0.7) * 0.04, 1.24 + Math.cos(drift) * 0.06);
    camera.lookAt(0.03, 0.05, -0.01);

    const index = Math.floor(t / CLAIM_SECONDS);
    if (index !== claim) newClaim(index);
    const p = (t % CLAIM_SECONDS) / CLAIM_SECONDS;

    // 0.00-0.30 lift off the in-tray · 0.30-0.62 held and read
    // 0.62-0.85 stamped · 0.85-1.00 filed on the out-tray
    const lift = ease(clamp01(p / 0.3));
    const file = ease(clamp01((p - 0.85) / 0.15));
    const hover = 0.052 + Math.sin(p * Math.PI) * 0.012;

    const fromX = IN_TRAY.x;
    const fromZ = IN_TRAY.z;
    const holdX = -0.055;
    const holdZ = 0.06;
    const toX = OUT_TRAY.x;
    const toZ = OUT_TRAY.z;

    const x = fromX + (holdX - fromX) * lift + (toX - holdX) * file;
    const z = fromZ + (holdZ - fromZ) * lift + (toZ - holdZ) * file;
    const y = stack.length * PAPER.t * 1.6 + 0.001 + hover * lift * (1 - file * 0.92);
    live.position.set(x, y, z);
    live.rotation.set(-0.26 * lift * (1 - file), 0.1 * lift - 0.35 * file, 0.05 * lift * (1 - file));

    // The scan bar sweeps the sheet while it is held.
    const reading = clamp01((p - 0.3) / 0.32);
    const isReading = p > 0.3 && p < 0.62;
    scanMat.opacity = isReading ? 0.75 * Math.sin(reading * Math.PI) : 0;
    scan.position.z = -PAPER.h / 2 + PAPER.h * reading;

    // The stamp lands, then rides with the sheet.
    const stamped = clamp01((p - 0.62) / 0.08);
    verdictMat.opacity = p > 0.62 ? Math.min(1, stamped) * (1 - file * 0.6) : 0;
    verdict.scale.setScalar(1 + (1 - stamped) * 0.5);

    // The pile of finished claims grows, then resets when it gets tall.
    if (file > 0.98 && !live.userData.filed) {
      live.userData.filed = true;
      processed += 1;
      if (!approved) flagged += 1;
      fileSheet();
    }

    dashboard.draw({ processed, risk: isReading || p > 0.62 ? risk : risk * 0.4, flagged, scanning: isReading });
  };

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
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    draw();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

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

  // The poster stays up until the light and the desk are in.
  Promise.all(pending).then(async () => {
    if (disposed) return;
    if (renderer.compileAsync) await renderer.compileAsync(scene, camera);
    if (disposed) return;
    place(0);
    draw();
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
      laptop.group.traverse((o) => {
        if (!o.isMesh) return;
        o.geometry.dispose();
        [].concat(o.material).forEach((m) => {
          Object.keys(m).forEach((k) => {
            if (m[k] && m[k].isTexture) m[k].dispose();
          });
          m.dispose();
        });
      });
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

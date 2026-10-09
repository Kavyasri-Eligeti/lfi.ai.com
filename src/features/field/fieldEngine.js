// WebGL tier of the modular field (plain Three.js). Loaded lazily after idle
// on capable desktops only. Renders on demand: once the tiles settle, no
// frames are drawn until the next wave or pointer movement.
import {
  ACESFilmicToneMapping,
  Color,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  HemisphereLight,
  Mesh,
  MeshPhysicalMaterial,
  NeutralToneMapping,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  ShadowMaterial,
  Shape,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { FIELD_COLS, FIELD_ROWS, fieldCells, restHeight, waveHeight } from './layout';

const CELL = 1;
const GAP = 0.18;
const THICK = 0.3;
const PX = 1 / 40; // CSS-tier px → scene units
const WAVE_MS = 8000;
const TILT = (6 * Math.PI) / 180;
const BASE_YAW = (42 * Math.PI) / 180;
const ELEVATION = (34 * Math.PI) / 180;

// Rounded rectangle with an individual radius per corner (tl, tr, br, bl), in
// the plane of the tile face. +y in shape space is "up" on screen (away from viewer).
function moduleShape(w, h, [tl, tr, br, bl]) {
  const s = new Shape();
  const x0 = -w / 2;
  const y0 = -h / 2;
  s.moveTo(x0 + bl, y0);
  s.lineTo(x0 + w - br, y0);
  s.quadraticCurveTo(x0 + w, y0, x0 + w, y0 + br);
  s.lineTo(x0 + w, y0 + h - tr);
  s.quadraticCurveTo(x0 + w, y0 + h, x0 + w - tr, y0 + h);
  s.lineTo(x0 + tl, y0 + h);
  s.quadraticCurveTo(x0, y0 + h, x0, y0 + h - tl);
  s.lineTo(x0, y0 + bl);
  s.quadraticCurveTo(x0, y0, x0 + bl, y0);
  return s;
}

const small = 0.07;
const big = 0.42;
// Corner radii (tl, tr, br, bl) as seen from above, matching the CSS tier.
// After the shape is laid flat, shape-space "down" faces the viewer.
const RADII = {
  tile: [small, small, small, small],
  leaf: [small, small, big, small],
  leaf2: [big, small, small, small],
  ghost: [small, small, small, small],
  o: [small * 0.6, small * 0.6, big, small * 0.6],
  b: [small * 0.6, small * 0.6, big, small * 0.6],
  y: [big * 1.1, small * 0.6, big * 1.1, small * 0.6],
};

function makeMaterial(kind) {
  const common = { roughness: 0.42, metalness: 0, clearcoat: 0.55, clearcoatRoughness: 0.35 };
  if (kind === 'y') return new MeshPhysicalMaterial({ ...common, color: new Color('#ffd600'), roughness: 0.32, clearcoat: 0.85 });
  if (kind === 'o') return new MeshPhysicalMaterial({ ...common, color: new Color('#ff7800'), roughness: 0.32, clearcoat: 0.85 });
  if (kind === 'b') return new MeshPhysicalMaterial({ ...common, color: new Color('#2d58c0'), roughness: 0.3, clearcoat: 0.9 });
  if (kind === 'ghost') return new MeshPhysicalMaterial({ ...common, color: new Color('#ffffff'), transparent: true, opacity: 0.35, clearcoat: 0 });
  return new MeshPhysicalMaterial({ ...common, color: new Color('#f3f5f8') });
}

const damp = (a, b, lambda, dt) => a + (b - a) * (1 - Math.exp(-lambda * dt));

export async function createFieldEngine(host, { interactEl } = {}) {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.debug.checkShaderErrors = process.env.NODE_ENV !== 'production';
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = SRGBColorSpace;
  // Neutral tone mapping keeps the brand colours true; ACES as a fallback for older builds.
  renderer.toneMapping = NeutralToneMapping ?? ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTexture;
  scene.environmentIntensity = 0.55;

  const camera = new PerspectiveCamera(26, 1, 0.1, 100);

  scene.add(new HemisphereLight(0xffffff, 0xdfe6f0, 1.1));
  const key = new DirectionalLight(0xffffff, 2.1);
  key.position.set(-4.5, 9, 5.5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -6;
  key.shadow.camera.right = 6;
  key.shadow.camera.top = 6;
  key.shadow.camera.bottom = -6;
  key.shadow.radius = 6;
  key.shadow.bias = -0.0006;
  scene.add(key);
  const fill = new DirectionalLight(0xffe7cc, 0.55);
  fill.position.set(6, 3, -2);
  scene.add(fill);

  const field = new Group();
  scene.add(field);

  const ground = new Mesh(new PlaneGeometry(30, 30), new ShadowMaterial({ opacity: 0.13 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  field.add(ground);

  const pitch = CELL + GAP;
  const width = FIELD_COLS * pitch - GAP;
  const depth = FIELD_ROWS * pitch - GAP;
  const geometries = new Map();
  const materials = new Map();
  const tiles = fieldCells().map((cell, i) => {
    const rows = cell.rows;
    const keyName = `${cell.kind}:${rows}`;
    if (!geometries.has(keyName)) {
      const h = rows * CELL + (rows - 1) * GAP;
      const geo = new ExtrudeGeometry(moduleShape(CELL, h, RADII[cell.kind]), {
        depth: cell.kind === 'ghost' ? 0.02 : THICK,
        bevelEnabled: cell.kind !== 'ghost',
        bevelThickness: 0.03,
        bevelSize: 0.025,
        bevelSegments: 3,
        curveSegments: 10,
      });
      geo.rotateX(-Math.PI / 2); // lie flat; extrusion now points up (+y)
      geometries.set(keyName, geo);
    }
    if (!materials.has(cell.kind)) materials.set(cell.kind, makeMaterial(cell.kind));
    const mesh = new Mesh(geometries.get(keyName), materials.get(cell.kind));
    const spanOffset = ((rows - 1) * pitch) / 2;
    mesh.position.set(cell.col * pitch - width / 2 + CELL / 2, 0, cell.row * pitch - depth / 2 + CELL / 2 + spanOffset);
    mesh.castShadow = cell.kind !== 'ghost';
    mesh.receiveShadow = true;
    field.add(mesh);
    const y = restHeight(cell.kind) * PX;
    mesh.position.y = y;
    return { mesh, kind: cell.kind, index: i, y, target: y };
  });

  host.appendChild(renderer.domElement);

  // Camera: a fixed elevated view; the field itself yaws with the pointer.
  const radius = 19.5;
  camera.position.set(0, Math.sin(ELEVATION) * radius, Math.cos(ELEVATION) * radius);
  camera.lookAt(0, 0.2, 0);

  let yaw = BASE_YAW;
  let yawTarget = BASE_YAW;
  let pitchOffset = 0;
  let pitchTarget = 0;
  field.rotation.y = yaw;

  let raf = 0;
  let last = 0;
  let visible = true;
  let disposed = false;

  const render = () => renderer.render(scene, camera);

  const frame = (t) => {
    raf = 0;
    if (disposed) return;
    const dt = Math.min(0.05, (t - (last || t)) / 1000);
    last = t;
    let moving = false;
    tiles.forEach((tile) => {
      tile.y = damp(tile.y, tile.target, 2.6, dt);
      if (Math.abs(tile.y - tile.target) > 0.0005) moving = true;
      tile.mesh.position.y = tile.y;
    });
    yaw = damp(yaw, yawTarget, 3.2, dt);
    pitchOffset = damp(pitchOffset, pitchTarget, 3.2, dt);
    if (Math.abs(yaw - yawTarget) > 0.0002 || Math.abs(pitchOffset - pitchTarget) > 0.0002) moving = true;
    field.rotation.y = yaw;
    field.rotation.x = pitchOffset;
    render();
    if (moving) schedule();
    else last = 0;
  };
  const schedule = () => {
    if (!raf && visible && !document.hidden && !disposed) raf = requestAnimationFrame(frame);
  };

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = host;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    render();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  let phase = 0;
  const waveTimer = window.setInterval(() => {
    if (!visible || document.hidden) return;
    phase += 1.1;
    tiles.forEach((tile) => {
      tile.target = (restHeight(tile.kind) + waveHeight(tile.kind, tile.index, phase)) * PX;
    });
    schedule();
  }, WAVE_MS / 3);

  const onMove = (e) => {
    if (e.pointerType === 'touch') return;
    const r = interactEl.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    yawTarget = BASE_YAW - x * TILT * 2;
    pitchTarget = y * TILT;
    schedule();
  };
  const onLeave = () => {
    yawTarget = BASE_YAW;
    pitchTarget = 0;
    schedule();
  };
  interactEl?.addEventListener('pointermove', onMove);
  interactEl?.addEventListener('pointerleave', onLeave);

  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) schedule();
  });
  io.observe(host);
  const onVisibility = () => !document.hidden && schedule();
  document.addEventListener('visibilitychange', onVisibility);

  // Compile programs off the main thread where the driver supports it.
  if (renderer.compileAsync) await renderer.compileAsync(scene, camera);
  if (disposed) return { dispose() {} };
  render();
  // First wave after the reveal.
  window.setTimeout(() => {
    phase += 1.1;
    tiles.forEach((tile) => {
      tile.target = (restHeight(tile.kind) + waveHeight(tile.kind, tile.index, phase)) * PX;
    });
    schedule();
  }, 600);

  return {
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      window.clearInterval(waveTimer);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      interactEl?.removeEventListener('pointermove', onMove);
      interactEl?.removeEventListener('pointerleave', onLeave);
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      ground.geometry.dispose();
      ground.material.dispose();
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

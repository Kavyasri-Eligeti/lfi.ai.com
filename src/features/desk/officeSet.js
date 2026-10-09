// The homepage hero's set: a corner office high above the Johannesburg
// skyline at dusk.
//
//  - The view through the glass is a CC0 360° photograph (Poly Haven, Sunset
//    JHB Central), used as the scene background; its HDR lights the room.
//  - Two walls of floor-to-ceiling glass with dark mullions, a low warm sun
//    raking through them, oak slat panelling, a herringbone parquet floor and
//    linear LED lights in the ceiling.
//  - A walnut executive desk (modelled here) with the laptop, and CC0
//    photo-scanned furniture: chairs, a coffee table and plants.
import {
  BoxGeometry,
  Box3,
  Color,
  CylinderGeometry,
  DirectionalLight,
  EquirectangularReflectionMapping,
  Group,
  HemisphereLight,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  PMREMGenerator,
  PointLight,
  RectAreaLight,
  RepeatWrapping,
  SpotLight,
  SRGBColorSpace,
  TextureLoader,
  TorusGeometry,
  Vector3,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

export const OFFICE_BASE = `${process.env.PUBLIC_URL || ''}/media/office`;
export const DESK_TOP = 0.75;

// Room bounds (metres, set frame: the camera looks towards -z).
const ROOM = { x0: -5.6, x1: 4.6, z0: -3.3, z1: 8.6, h: 3.1, sill: 0.56 };
// Turns the skyline so its towers and the dusk glow sit behind the desk.
const SKY_YAW = 2.25;

function fitHeight(root, height) {
  const box = new Box3().setFromObject(root);
  const h = box.max.y - box.min.y;
  if (h > 0) root.scale.multiplyScalar(height / h);
  return root;
}

function shadowsOn(root, { cast = true, receive = true } = {}) {
  root.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = cast;
    o.receiveShadow = receive;
  });
  return root;
}

/** A run of floor-to-ceiling glazing, `len` long, interior side facing +z. */
function glazing(len, frameMat, sillMat, glassMat) {
  const g = new Group();
  const glassH = ROOM.h - ROOM.sill;
  // A low sill wall the glass stands on
  const sill = new Mesh(new BoxGeometry(len, ROOM.sill, 0.24), sillMat);
  sill.position.set(len / 2, ROOM.sill / 2, -0.12);
  sill.castShadow = true;
  sill.receiveShadow = true;
  g.add(sill);
  const ledge = new Mesh(new BoxGeometry(len, 0.03, 0.3), frameMat);
  ledge.position.set(len / 2, ROOM.sill + 0.015, -0.1);
  g.add(ledge);
  // Mullions and rails
  const bays = Math.max(1, Math.round(len / 1.55));
  for (let i = 0; i <= bays; i += 1) {
    const m = new Mesh(new BoxGeometry(0.06, glassH, 0.14), frameMat);
    m.position.set((len / bays) * i, ROOM.sill + glassH / 2, -0.07);
    m.castShadow = true;
    g.add(m);
  }
  const top = new Mesh(new BoxGeometry(len, 0.1, 0.16), frameMat);
  top.position.set(len / 2, ROOM.h - 0.05, -0.07);
  g.add(top);
  const transom = new Mesh(new BoxGeometry(len, 0.05, 0.12), frameMat);
  transom.position.set(len / 2, ROOM.h - 0.55, -0.07);
  transom.castShadow = true;
  g.add(transom);
  // The glass itself: a faint, reflective sheet
  const glass = new Mesh(new PlaneGeometry(len, glassH), glassMat);
  glass.position.set(len / 2, ROOM.sill + glassH / 2, -0.07);
  glass.renderOrder = 2;
  g.add(glass);
  return g;
}

/** The walnut executive desk: a thick top on black steel sled legs. */
function buildDesk(walnut) {
  const g = new Group();
  const steel = new MeshPhysicalMaterial({ color: 0x121316, metalness: 0.6, roughness: 0.42, clearcoat: 0.3 });
  const W = 1.9;
  const D = 0.9;
  const T = 0.045;
  const top = new Mesh(new RoundedBoxGeometry(W, T, D, 4, 0.008), walnut);
  top.position.y = DESK_TOP - T / 2;
  g.add(top);
  const legH = DESK_TOP - T;
  [-1, 1].forEach((s) => {
    const x = s * (W / 2 - 0.09);
    [-1, 1].forEach((zs) => {
      const post = new Mesh(new BoxGeometry(0.05, legH, 0.05), steel);
      post.position.set(x, legH / 2, zs * (D / 2 - 0.06));
      g.add(post);
    });
    const foot = new Mesh(new BoxGeometry(0.05, 0.04, D - 0.06), steel);
    foot.position.set(x, 0.02, 0);
    g.add(foot);
    const rail = new Mesh(new BoxGeometry(0.05, 0.04, D - 0.06), steel);
    rail.position.set(x, legH - 0.02, 0);
    g.add(rail);
  });
  const modesty = new Mesh(new BoxGeometry(W - 0.3, 0.34, 0.02), walnut);
  modesty.position.set(0, legH - 0.2, -D / 2 + 0.08);
  g.add(modesty);
  shadowsOn(g);
  return g;
}

/** Small things on the desk, modelled: a mug, a notebook and pen. */
function deskProps() {
  const g = new Group();
  const ceramic = new MeshPhysicalMaterial({ color: 0xf2f0ec, roughness: 0.28, clearcoat: 0.6 });
  const mug = new Mesh(new CylinderGeometry(0.04, 0.037, 0.095, 40, 1, true), ceramic);
  mug.position.set(0.66, DESK_TOP + 0.0475, 0.2);
  const base = new Mesh(new CylinderGeometry(0.037, 0.037, 0.006, 40), ceramic);
  base.position.set(0.66, DESK_TOP + 0.003, 0.2);
  const coffee = new Mesh(new CylinderGeometry(0.037, 0.037, 0.002, 40), new MeshStandardMaterial({ color: 0x2a160b, roughness: 0.15 }));
  coffee.position.set(0.66, DESK_TOP + 0.085, 0.2);
  const handle = new Mesh(new TorusGeometry(0.024, 0.006, 12, 32, Math.PI), ceramic);
  handle.rotation.z = -Math.PI / 2;
  handle.position.set(0.7, DESK_TOP + 0.05, 0.2);
  g.add(mug, base, coffee, handle);
  const leather = new MeshStandardMaterial({ color: 0x23262d, roughness: 0.6 });
  const book = new Mesh(new RoundedBoxGeometry(0.21, 0.014, 0.15, 2, 0.003), leather);
  book.position.set(-0.52, DESK_TOP + 0.007, 0.16);
  book.rotation.y = 0.22;
  const paper = new Mesh(new BoxGeometry(0.2, 0.01, 0.14), new MeshStandardMaterial({ color: 0xf4f1ea, roughness: 0.9 }));
  paper.position.set(-0.52, DESK_TOP + 0.006, 0.16);
  paper.rotation.y = 0.22;
  const pen = new Mesh(new CylinderGeometry(0.0045, 0.0045, 0.14, 16), new MeshPhysicalMaterial({ color: 0x0f1012, metalness: 0.7, roughness: 0.25 }));
  pen.rotation.z = Math.PI / 2;
  pen.rotation.y = 0.5;
  pen.position.set(-0.36, DESK_TOP + 0.005, 0.24);
  g.add(book, paper, pen);

  // A stitched leather desk pad under the laptop
  const padLeather = new MeshPhysicalMaterial({ color: 0x0f1013, roughness: 0.62, clearcoat: 0.08, clearcoatRoughness: 0.6, sheen: 0.15, sheenColor: new Color(0x2a2c33), envMapIntensity: 0.35 });
  const pad = new Mesh(new RoundedBoxGeometry(0.86, 0.004, 0.44, 3, 0.0018), padLeather);
  pad.position.set(0.12, DESK_TOP + 0.002, 0.04);
  const stitchMat = new MeshStandardMaterial({ color: 0x5a5d66, roughness: 0.8 });
  [[0.86 - 0.03, 0.002, 0.44 / 2 - 0.015], [0.86 - 0.03, 0.002, -(0.44 / 2 - 0.015)]].forEach(([w, , z]) => {
    const st = new Mesh(new BoxGeometry(w, 0.0006, 0.002), stitchMat);
    st.position.set(0.12, DESK_TOP + 0.0042, 0.04 + z);
    g.add(st);
  });
  [-1, 1].forEach((sx) => {
    const st = new Mesh(new BoxGeometry(0.002, 0.0006, 0.44 - 0.03), stitchMat);
    st.position.set(0.12 + sx * (0.86 / 2 - 0.015), DESK_TOP + 0.0042, 0.04);
    g.add(st);
  });
  g.add(pad);

  // Hardcover books, stacked
  const covers = [0x1f2b3d, 0xc9b38a, 0x2a2a2e];
  const pages = new MeshStandardMaterial({ color: 0xf1ece0, roughness: 0.9 });
  let y = DESK_TOP;
  covers.forEach((col, i) => {
    const h = 0.028 + i * 0.004;
    const w = 0.24 - i * 0.02;
    const d = 0.17 - i * 0.012;
    const cover = new Mesh(new RoundedBoxGeometry(w, h, d, 2, 0.003), new MeshPhysicalMaterial({ color: col, roughness: 0.5, clearcoat: 0.3 }));
    cover.position.set(-0.5, y + h / 2, -0.22);
    cover.rotation.y = 0.12 - i * 0.1;
    const leaf = new Mesh(new BoxGeometry(w - 0.012, h - 0.006, d - 0.004), pages);
    leaf.position.copy(cover.position).add(new Vector3(0.004, 0, 0));
    leaf.rotation.y = cover.rotation.y;
    g.add(cover, leaf);
    y += h;
  });
  shadowsOn(g);
  return g;
}

/** An architect desk lamp, with a warm spot that pools on the desk. */
function deskLamp() {
  const g = new Group();
  const metal = new MeshPhysicalMaterial({ color: 0x15161a, metalness: 0.75, roughness: 0.32, clearcoat: 0.4 });
  const brass = new MeshPhysicalMaterial({ color: 0xb08d57, metalness: 1, roughness: 0.28 });
  const base = new Mesh(new CylinderGeometry(0.085, 0.09, 0.018, 48), metal);
  base.position.y = 0.009;
  const lower = new Mesh(new CylinderGeometry(0.007, 0.007, 0.42, 16), metal);
  lower.position.set(0.04, 0.2, 0);
  lower.rotation.z = -0.2;
  const joint = new Mesh(new CylinderGeometry(0.014, 0.014, 0.03, 20), brass);
  joint.rotation.x = Math.PI / 2;
  joint.position.set(0.082, 0.405, 0);
  const upper = new Mesh(new CylinderGeometry(0.006, 0.006, 0.34, 16), metal);
  upper.position.set(0.23, 0.44, 0);
  upper.rotation.z = -1.35;
  const head = new Group();
  head.position.set(0.39, 0.46, 0);
  head.rotation.z = -0.5;
  const shade = new Mesh(new CylinderGeometry(0.035, 0.07, 0.11, 40, 1, true), new MeshPhysicalMaterial({ color: 0x15161a, metalness: 0.7, roughness: 0.35, side: 2 }));
  shade.position.y = -0.04;
  const bulb = new Mesh(new CylinderGeometry(0.05, 0.05, 0.004, 32), new MeshBasicMaterial({ color: new Color(4.5, 3.6, 2.4), toneMapped: false }));
  bulb.position.y = -0.092;
  head.add(shade, bulb);
  g.add(base, lower, joint, upper, head);
  shadowsOn(g, { cast: true, receive: false });
  bulb.castShadow = false;
  return { group: g, head };
}

/**
 * Builds the office into `set` and sets the scene's background and lighting.
 * Returns the loading promises, the key light, and a dispose for its textures.
 */
export function buildOffice({ scene, set, renderer }) {
  RectAreaLightUniformsLib.init();
  const textures = [];
  const pending = [];
  const tl = new TextureLoader();
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const tex = (name, repeatX, repeatY, srgb) => {
    const t = tl.load(`${OFFICE_BASE}/tex/${name}.jpg`);
    t.wrapS = RepeatWrapping;
    t.wrapT = RepeatWrapping;
    t.repeat.set(repeatX, repeatY);
    t.anisotropy = maxAniso;
    if (srgb) t.colorSpace = SRGBColorSpace;
    textures.push(t);
    return t;
  };
  const material = (name, rx, ry, extra) =>
    new MeshPhysicalMaterial({
      map: tex(`${name}_diff`, rx, ry, true),
      normalMap: tex(`${name}_nor`, rx, ry),
      roughnessMap: tex(`${name}_rough`, rx, ry),
      ...extra,
    });

  /* ---------- Sky and light ---------- */
  scene.backgroundRotation.set(0, SKY_YAW, 0);
  scene.environmentRotation.set(0, SKY_YAW, 0);
  scene.backgroundIntensity = 1.12;
  pending.push(
    new Promise((res) => {
      new HDRLoader().load(`${OFFICE_BASE}/city_1k.hdr`, (hdr) => {
        hdr.mapping = EquirectangularReflectionMapping;
        const pmrem = new PMREMGenerator(renderer);
        const env = pmrem.fromEquirectangular(hdr).texture;
        scene.environment = env;
        scene.environmentIntensity = 0.7;
        textures.push(env);
        hdr.dispose();
        pmrem.dispose();
        res();
      }, undefined, () => res());
    })
  );
  const setSky = (t) => {
    t.mapping = EquirectangularReflectionMapping;
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = maxAniso;
    textures.push(t);
    const old = scene.background;
    scene.background = t;
    if (old?.isTexture) old.dispose();
  };
  pending.push(new Promise((res) => tl.load(`${OFFICE_BASE}/city_2k.jpg`, (t) => { setSky(t); res(); }, undefined, () => res())));
  const sharpenSky = (onDone) => tl.load(`${OFFICE_BASE}/city_6k.jpg`, (t) => { setSky(t); onDone?.(); });

  // A low dusk sun rakes in through the glass behind the desk.
  const sun = new DirectionalLight(0xffc596, 1.35);
  sun.position.set(-2.6, 2.1, -9);
  sun.castShadow = true;
  sun.shadow.mapSize.set(4096, 4096);
  Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 22 });
  sun.shadow.radius = 5;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  set.add(sun, sun.target);
  set.add(new HemisphereLight(0xdfe6ff, 0x3b2e24, 0.32));

  /* ---------- The room ---------- */
  const W = ROOM.x1 - ROOM.x0;
  const Dz = ROOM.z1 - ROOM.z0;
  const cx = (ROOM.x0 + ROOM.x1) / 2;
  const cz = (ROOM.z0 + ROOM.z1) / 2;

  const floor = new Mesh(
    new PlaneGeometry(W, Dz),
    // Satin, not mirror: the camera looks into the sun, and the scan's gloss
    // turned the floor white.
    material('herringbone_parquet', W / 1.6, Dz / 1.6, { color: new Color(0.66, 0.54, 0.43), roughnessMap: null, roughness: 0.66, envMapIntensity: 0.3 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(cx, 0, cz);
  floor.receiveShadow = true;
  set.add(floor);

  const rug = new Mesh(
    new PlaneGeometry(3.6, 2.7),
    material('poly_wool_herringbone', 4, 3, { color: new Color(0.62, 0.62, 0.66), roughness: 1, envMapIntensity: 0.4 })
  );
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(0, 0.004, 0.55);
  rug.receiveShadow = true;
  set.add(rug);

  const ceiling = new Mesh(new PlaneGeometry(W, Dz), new MeshStandardMaterial({ color: 0xdcdcdf, roughness: 0.95 }));
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(cx, ROOM.h, cz);
  set.add(ceiling);

  // Glazing on the far wall and the right wall (a corner office)
  const frameMat = new MeshPhysicalMaterial({ color: 0x17181b, metalness: 0.7, roughness: 0.38 });
  const sillMat = new MeshStandardMaterial({ color: 0x2a2b2f, roughness: 0.75 });
  const glassMat = new MeshPhysicalMaterial({
    color: 0xc8d6e6, metalness: 0, roughness: 0.04, transparent: true, opacity: 0.09, envMapIntensity: 1.4, depthWrite: false,
  });
  const back = glazing(W, frameMat, sillMat, glassMat);
  back.position.set(ROOM.x0, 0, ROOM.z0);
  set.add(back);
  const right = glazing(Dz, frameMat, sillMat, glassMat);
  right.rotation.y = -Math.PI / 2;
  right.position.set(ROOM.x1, 0, ROOM.z0);
  set.add(right);
  const column = new Mesh(new BoxGeometry(0.42, ROOM.h, 0.42), new MeshStandardMaterial({ color: 0xcfcdc8, roughness: 0.8 }));
  column.position.set(ROOM.x1 - 0.21, ROOM.h / 2, ROOM.z0 + 0.21);
  column.castShadow = true;
  column.receiveShadow = true;
  set.add(column);

  // Roller blinds: a cassette along the far glazing, two bays partly lowered
  const fabric = new MeshStandardMaterial({ color: 0xd8d1c5, roughness: 0.95, transparent: true, opacity: 0.94 });
  const cassette = new Mesh(new BoxGeometry(W, 0.07, 0.09), new MeshStandardMaterial({ color: 0x1d1e21, roughness: 0.5 }));
  cassette.position.set(cx, ROOM.h - 0.14, ROOM.z0 + 0.08);
  set.add(cassette);
  const bayW = W / Math.max(1, Math.round(W / 1.55));
  [[1, 0.95], [5, 0.62], [6, 0.62]].forEach(([bay, drop]) => {
    const blind = new Mesh(new PlaneGeometry(bayW - 0.05, drop), fabric);
    blind.position.set(ROOM.x0 + bayW * (bay + 0.5), ROOM.h - 0.17 - drop / 2, ROOM.z0 + 0.06);
    blind.castShadow = true;
    set.add(blind);
    const rail = new Mesh(new BoxGeometry(bayW - 0.05, 0.022, 0.018), new MeshPhysicalMaterial({ color: 0x1d1e21, metalness: 0.6, roughness: 0.4 }));
    rail.position.set(blind.position.x, ROOM.h - 0.17 - drop, ROOM.z0 + 0.06);
    set.add(rail);
  });
  // A warm LED cove along the window header
  const cove = new Mesh(new BoxGeometry(W - 0.6, 0.01, 0.02), new MeshBasicMaterial({ color: new Color(2.2, 1.7, 1.1), toneMapped: false }));
  cove.position.set(cx, ROOM.h - 0.005, ROOM.z0 + 0.2);
  set.add(cove);
  // The lounge pendant's light
  const pendantLight = new PointLight(0xffcf96, 2.2, 4, 1.8);
  pendantLight.position.set(3.0, ROOM.h - 0.95, -1.6);
  set.add(pendantLight);

  // Left wall: warm oak slats over a dark backing
  const backing = new Mesh(new PlaneGeometry(Dz, ROOM.h), new MeshStandardMaterial({ color: 0x17130f, roughness: 0.9 }));
  backing.rotation.y = Math.PI / 2;
  backing.position.set(ROOM.x0, ROOM.h / 2, cz);
  set.add(backing);
  const pitch = 0.085;
  const nSlats = Math.floor(Dz / pitch);
  const slats = new InstancedMesh(
    new BoxGeometry(0.045, ROOM.h, 0.04),
    material('mocha_oak_veneer', 0.2, 2, { clearcoat: 0.15, clearcoatRoughness: 0.4 }),
    nSlats
  );
  const dummy = new Object3D();
  for (let i = 0; i < nSlats; i += 1) {
    dummy.position.set(ROOM.x0 + 0.03, ROOM.h / 2, ROOM.z0 + 0.04 + i * pitch);
    dummy.updateMatrix();
    slats.setMatrixAt(i, dummy.matrix);
  }
  slats.receiveShadow = true;
  set.add(slats);
  // Back wall, behind the camera
  const rear = new Mesh(new PlaneGeometry(W, ROOM.h), new MeshStandardMaterial({ color: 0xe4e1db, roughness: 0.9 }));
  rear.rotation.y = Math.PI;
  rear.position.set(cx, ROOM.h / 2, ROOM.z1);
  set.add(rear);

  // Linear LED lights in the ceiling: a lit strip in a dark slot, each with
  // an area light, so the light is soft and the strips glow through the lens.
  const slot = new MeshStandardMaterial({ color: 0x1c1d20, roughness: 0.6 });
  const led = new MeshBasicMaterial({ color: new Color(3.2, 3.0, 2.7), toneMapped: false });
  [-1.4, 1.5, 4.4].forEach((z) => {
    const len = 6.2;
    const x = -0.6;
    const housing = new Mesh(new BoxGeometry(len + 0.06, 0.03, 0.1), slot);
    housing.position.set(x, ROOM.h - 0.012, z);
    set.add(housing);
    const strip = new Mesh(new BoxGeometry(len, 0.012, 0.04), led);
    strip.position.set(x, ROOM.h - 0.03, z);
    set.add(strip);
    const area = new RectAreaLight(0xfff0dc, 2.0, len, 0.3);
    area.position.set(x, ROOM.h - 0.04, z);
    set.add(area);
    area.lookAt(set.localToWorld(new Vector3(x, 0, z)));
  });

  /* ---------- Furniture ---------- */
  const walnut = material('natural_walnut_veneer', 1, 1, { color: new Color(0.6, 0.4, 0.27), clearcoat: 0.2, clearcoatRoughness: 0.3, envMapIntensity: 0.55 });
  set.add(buildDesk(walnut));
  set.add(deskProps());
  const lamp = deskLamp();
  lamp.group.position.set(-0.86, DESK_TOP, -0.3);
  lamp.group.rotation.y = -0.35;
  set.add(lamp.group);
  const lampLight = new SpotLight(0xffd29a, 5.5, 2.2, 0.75, 0.65, 1.6);
  lampLight.castShadow = true;
  lampLight.shadow.mapSize.set(1024, 1024);
  lampLight.shadow.bias = -0.0005;
  set.add(lampLight, lampLight.target);
  set.updateMatrixWorld(true);
  lamp.head.updateMatrixWorld(true);
  lampLight.position.copy(set.worldToLocal(lamp.head.localToWorld(new Vector3(0, -0.08, 0))));
  lampLight.target.position.set(-0.45, DESK_TOP, -0.05);

  const loader = new GLTFLoader();
  const model = (name, place) =>
    new Promise((res) => {
      loader.load(`${OFFICE_BASE}/${name}/${name}.gltf`, (gltf) => {
        const root = shadowsOn(gltf.scene);
        place(root);
        set.add(root);
        res();
      }, undefined, () => res());
    });
  pending.push(
    model('ceramic_vase_01', (r) => { fitHeight(r, 0.26); r.position.set(0.52, DESK_TOP, -0.3); }),
    model('potted_plant_04', (r) => { fitHeight(r, 0.14); r.position.set(-0.5, DESK_TOP + 0.092, -0.22); }),
    model('modern_ceiling_lamp_01', (r) => { const b = new Box3().setFromObject(r); r.position.set(3.0, ROOM.h - b.max.y, -1.6); }),
    model('standing_picture_frame_01', (r) => { fitHeight(r, 0.17); r.position.set(0.74, DESK_TOP, -0.26); r.rotation.y = -0.45; }),
    model('dining_chair_02', (r) => { r.position.set(-1.2, 0, 0.78); r.rotation.y = 0.95; }),
    model('modern_arm_chair_01', (r) => { r.position.set(2.45, 0, -2.25); r.rotation.y = -0.55; }),
    model('modern_arm_chair_01', (r) => { r.position.set(3.75, 0, -0.75); r.rotation.y = -1.6; }),
    model('modern_coffee_table_01', (r) => { r.position.set(3.0, 0, -1.65); r.rotation.y = -0.3; }),
    model('potted_plant_02', (r) => { fitHeight(r, 1.55); r.position.set(-4.7, 0, -2.6); }),
    model('potted_plant_02', (r) => { fitHeight(r, 1.35); r.position.set(-2.1, 0, -2.75); r.rotation.y = 1.2; }),
    model('potted_plant_02', (r) => { fitHeight(r, 1.6); r.position.set(4.0, 0, 2.8); r.rotation.y = 2.4; }),
    model('hanging_picture_frame_01', (r) => { fitHeight(r, 0.9); r.position.set(ROOM.x0 + 0.08, 1.55, 3.4); r.rotation.y = Math.PI / 2; })
  );

  return {
    pending,
    sun,
    sharpenSky,
    dispose() {
      textures.forEach((t) => t.dispose());
    },
  };
}

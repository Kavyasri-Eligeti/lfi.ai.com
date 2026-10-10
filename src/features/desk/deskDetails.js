// Detail props for the homepage desk, modelled here: pink tulips for the vase
// and a ceramic coffee cup on its saucer. Sizes are in metres.
import {
  BufferAttribute,
  CanvasTexture,
  CapsuleGeometry,
  CatmullRomCurve3,
  CircleGeometry,
  Color,
  DoubleSide,
  Group,
  LatheGeometry,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  Quaternion,
  SRGBColorSpace,
  TubeGeometry,
  Vector2,
  Vector3,
} from 'three';

/* ---------------------------------------------------------------------------
 * Tulips
 * ------------------------------------------------------------------------- */

/**
 * One tulip petal, wrapped around the flower's axis (+y): a deep spoon that
 * swells out from the base, narrows a touch towards the rim and ends in a soft
 * point that flares slightly outward. `open` (0..1) spreads it from a closed
 * bud to an opening cup. Vertex colours: creamy base, rich rose body, pale
 * edges and fine darker veins.
 */
function tulipPetalGeometry({ height, radius, halfAngle, open, colors }) {
  const g = new PlaneGeometry(1, 1, 18, 28);
  const pos = g.attributes.position;
  const col = new Float32Array(pos.count * 3);
  const base = new Color(colors.base);
  const body = new Color(colors.body);
  const edge = new Color(colors.edge);
  const vein = new Color(colors.vein);
  const c = new Color();
  for (let i = 0; i < pos.count; i += 1) {
    const u = pos.getX(i) * 2; // -1..1 across the petal
    const t = pos.getY(i) + 0.5; // 0..1 from base to tip
    // Cup profile: swell, then a slight waist near the rim, then the flare.
    const r =
      radius *
      (0.18 + 0.82 * Math.sin(Math.min(1, t * 1.25) * Math.PI * 0.5)) *
      // Closed heads curve back in towards the tip (an egg); open ones flare.
      (1 - 0.34 * (1 - open) * Math.pow(Math.max(0, t - 0.55) / 0.45, 1.6)) +
      radius * 0.35 * open * Math.pow(Math.max(0, t - 0.6) / 0.4, 2.4);
    // The petal narrows into a soft point at the tip.
    // Broad and rounded: the petal keeps its width almost to the tip, then closes in a soft curve.
    const width = halfAngle * Math.sqrt(Math.max(0, 1 - Math.pow(Math.max(0, t - 0.55) / 0.45, 2.4)));
    const a = u * width;
    // Edges curl inward a little (a spoon), the tip sits higher at the middle.
    const spoon = 1 - 0.07 * u * u * Math.sin(t * Math.PI);
    const y = height * t * (1 - 0.1 * u * u * Math.max(0, t - 0.5));
    pos.setXYZ(i, Math.sin(a) * r * spoon, y, Math.cos(a) * r * spoon);
    // Colour
    c.copy(base).lerp(body, Math.min(1, t * 3.2));
    // A crisp white margin along the edges and tip, as on the reference tulips
    const margin = Math.max(Math.pow(Math.abs(u), 6), Math.pow(Math.max(0, t - 0.8) / 0.2, 3) * (0.4 + 0.6 * Math.abs(u)));
    c.lerp(edge, Math.min(0.95, margin * 1.1 + Math.abs(u) * 0.12));
    const v = Math.pow(0.5 + 0.5 * Math.cos(u * Math.PI * 7), 8) * 0.22 * Math.sin(t * Math.PI);
    c.lerp(vein, v);
    col.set([c.r, c.g, c.b], i * 3);
  }
  g.setAttribute('color', new BufferAttribute(col, 3));
  g.computeVertexNormals();
  return g;
}

/** A tulip head: three outer and three inner petals, with a hint of stamens. */
function tulipHead(mats, { scale = 1, open = 0.3, palette }) {
  const g = new Group();
  for (let i = 0; i < 6; i += 1) {
    const outer = i % 2 === 0;
    const geo = tulipPetalGeometry({
      height: (outer ? 0.066 : 0.062) * scale,
      radius: (outer ? 0.024 : 0.0215) * scale,
      halfAngle: outer ? 1.2 : 1.1,
      open: outer ? open : open * 0.7,
      colors: palette,
    });
    const m = new Mesh(geo, mats.petal);
    m.rotation.y = (i / 6) * Math.PI * 2;
    m.castShadow = true;
    m.receiveShadow = true;
    g.add(m);
  }
  // Dark stamens and a pale pistil, just visible in the cup
  for (let i = 0; i < 6; i += 1) {
    const a = (i / 6) * Math.PI * 2 + 0.5;
    const s = new Mesh(new CapsuleGeometry(0.0016 * scale, 0.006 * scale, 4, 8), mats.stamen);
    s.position.set(Math.cos(a) * 0.006 * scale, 0.022 * scale, Math.sin(a) * 0.006 * scale);
    g.add(s);
  }
  const pistil = new Mesh(new CapsuleGeometry(0.0028 * scale, 0.012 * scale, 4, 10), mats.pistil);
  pistil.position.y = 0.014 * scale;
  g.add(pistil);
  return g;
}

function tube(points, radius, material, segments = 40) {
  const curve = new CatmullRomCurve3(points);
  return new Mesh(new TubeGeometry(curve, segments, radius, 10, false), material);
}

const UP = new Vector3(0, 1, 0);

/**
 * A mixed bunch of eleven tulips, with leaves, arranged in the glass vase. The group's origin
 * is the vase mouth; stems start a little below it.
 */
export function buildTulips() {
  const mats = {
    petal: new MeshPhysicalMaterial({
      vertexColors: true,
      roughness: 0.3,
      sheen: 0.6,
      sheenColor: new Color(0xffd0e0),
      sheenRoughness: 0.45,
      clearcoat: 0.45,
      clearcoatRoughness: 0.25,
      side: DoubleSide,
      envMapIntensity: 0.75,
    }),
    stamen: new MeshStandardMaterial({ color: 0x2b1a1e, roughness: 0.7 }),
    pistil: new MeshStandardMaterial({ color: 0xe8e0b0, roughness: 0.6 }),
    stem: new MeshPhysicalMaterial({ color: 0x8dbb55, roughness: 0.32, clearcoat: 0.4, clearcoatRoughness: 0.3 }),
    leaf: new MeshPhysicalMaterial({ vertexColors: true, roughness: 0.4, clearcoat: 0.3, clearcoatRoughness: 0.4, side: DoubleSide, sheen: 0.35, sheenColor: new Color(0xc8e6c0) }),
  };
  // Real tulip colours. base: the pale green-cream foot of the petal;
  // body: the main colour; edge: margins and tip; vein: fine darker lines.
  const P = {
    red: { base: 0xe2dca0, body: 0xc4122c, edge: 0xd9293c, vein: 0x82091a },
    yellow: { base: 0xd2dc94, body: 0xf4c21a, edge: 0xffdc55, vein: 0xd49400 },
    white: { base: 0xd9e4c0, body: 0xf3f0e6, edge: 0xffffff, vein: 0xdcd5c2 },
    magenta: { base: 0xe9efd2, body: 0xd0125f, edge: 0xfdf2f6, vein: 0x9a0c45 },
    pink: { base: 0xeaeccc, body: 0xf08ab0, edge: 0xfcd8e6, vein: 0xd15f8c },
    purple: { base: 0xc9cfa4, body: 0x5a2a86, edge: 0x8256b3, vein: 0x3a1260 },
    orange: { base: 0xe6d896, body: 0xf06a1e, edge: 0xffa642, vein: 0xc44a08 },
  };
  const bunch = ['red', 'yellow', 'white', 'magenta', 'purple', 'orange', 'pink', 'red', 'yellow', 'white', 'magenta'];
  const g = new Group();
  const q = new Quaternion();
  // A domed bunch: a golden-angle spiral, tall in the middle, nodding outward
  // at the rim. Stems gather through the neck and spread in the water below.
  const n = bunch.length;
  const rand = (k) => {
    const x = Math.sin(k * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  for (let i = 0; i < n; i += 1) {
    const f = Math.sqrt((i + 0.5) / n);
    const ang = i * 2.39996 + 0.6;
    const r = 0.012 + 0.062 * f;
    const dx = Math.cos(ang) * r;
    const dz = Math.sin(ang) * r * 0.8;
    const up = 0.13 - 0.07 * f * f + (rand(i) - 0.5) * 0.02;
    const bottom = new Vector3(Math.cos(ang + 1) * 0.026 * f, -0.192, Math.sin(ang + 1) * 0.022 * f);
    const neck = new Vector3(Math.cos(ang) * 0.006 * f, 0.0, Math.sin(ang) * 0.005 * f);
    const bend = new Vector3(dx * 0.3, up * 0.55, dz * 0.3);
    const tip = new Vector3(dx, up, dz);
    const curve = new CatmullRomCurve3([bottom, new Vector3(bottom.x * 0.6, -0.09, bottom.z * 0.6), neck, bend, tip]);
    const stem = new Mesh(new TubeGeometry(curve, 64, 0.0037, 10, false), mats.stem);
    stem.castShadow = true;
    g.add(stem);
    const facing = curve.getTangent(1).normalize().lerp(UP, 0.4 - 0.2 * f).normalize();
    q.setFromUnitVectors(UP, facing);
    const head = tulipHead(mats, { scale: 0.95 + rand(i + 7) * 0.15, open: Math.max(0, rand(i + 3) * 0.45 - 0.05), palette: P[bunch[i]] });
    head.position.copy(tip);
    head.quaternion.copy(q);
    head.rotateY(rand(i + 11) * Math.PI * 2);
    g.add(head);
  }
  // Broad blue-green leaves sweeping out of the neck
  [
    { a: 0.4, len: 0.15, w: 0.022, lean: 0.35, curl: 1.3 },
    { a: 1.7, len: 0.13, w: 0.02, lean: 0.45, curl: 1.5 },
    { a: 3.0, len: 0.16, w: 0.023, lean: 0.3, curl: 1.2 },
    { a: 4.3, len: 0.12, w: 0.019, lean: 0.5, curl: 1.6 },
    { a: 5.5, len: 0.14, w: 0.021, lean: 0.38, curl: 1.35 },
  ].forEach((l) => {
    const leaf = new Mesh(tulipLeafGeometry(l.len, l.w, l.lean, l.curl), mats.leaf);
    leaf.position.set(0, -0.004, 0);
    leaf.rotation.y = l.a;
    leaf.castShadow = true;
    leaf.receiveShadow = true;
    g.add(leaf);
  });
  return g;
}

/** A broad, channelled tulip leaf: it rises, then sweeps out and over. */
function tulipLeafGeometry(length, width, lean, curl) {
  const g = new PlaneGeometry(1, 1, 8, 28);
  const pos = g.attributes.position;
  const col = new Float32Array(pos.count * 3);
  const dark = new Color(0x4a7a4f);
  const light = new Color(0x8fb38a);
  const c = new Color();
  const steps = 28;
  const line = [{ y: 0, z: 0, a: lean }];
  for (let i = 1; i <= steps; i += 1) {
    const t = i / steps;
    const ang = lean + curl * t * t;
    const p = line[i - 1];
    line.push({ y: p.y + Math.cos(ang) * (length / steps), z: p.z + Math.sin(ang) * (length / steps), a: ang });
  }
  for (let i = 0; i < pos.count; i += 1) {
    const u = pos.getX(i) * 2;
    const t = pos.getY(i) + 0.5;
    const p = line[Math.min(steps, Math.round(t * steps))];
    const w = width * Math.pow(Math.sin(Math.PI * Math.min(1, 0.12 + t * 0.92)), 0.55) * (1 - 0.5 * t);
    const fold = u * u * w * 0.5;
    pos.setXYZ(i, u * w, p.y - Math.sin(p.a) * fold, p.z + Math.cos(p.a) * fold);
    c.copy(dark).lerp(light, Math.abs(u) * 0.45 + t * 0.2);
    col.set([c.r, c.g, c.b], i * 3);
  }
  g.setAttribute('color', new BufferAttribute(col, 3));
  g.computeVertexNormals();
  return g;
}

/**
 * A clear glass carafe vase with water: a heavy base, a gently faceted body,
 * rounded shoulders, a narrow neck and a lip. The group's origin is the
 * centre of its base on the desk; the mouth is at VASE_MOUTH.
 */
// The carafe is modelled 0.152 m tall and scaled up to 0.2 m.
const VASE_SCALE = [1.4, 0.2 / 0.152, 1.4];
export const VASE_MOUTH = 0.2;
export function buildGlassVase() {
  const g = new Group();
  const glass = new MeshPhysicalMaterial({
    color: 0xf4fbf8,
    metalness: 0,
    roughness: 0.03,
    transmission: 1,
    thickness: 0.006,
    ior: 1.5,
    attenuationColor: new Color(0xd8efe6),
    attenuationDistance: 0.25,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    specularIntensity: 1,
    envMapIntensity: 1.2,
    transparent: true,
    side: DoubleSide,
  });
  // Outer and inner walls of the vase in one profile
  const outer = [
    [0, 0], [0.034, 0], [0.0365, 0.002], [0.0372, 0.008], [0.0372, 0.064], [0.0352, 0.078],
    [0.0295, 0.093], [0.0225, 0.108], [0.0165, 0.121], [0.0132, 0.131], [0.0128, 0.14], [0.013, 0.147], [0.0148, 0.151], [0.0152, 0.152],
  ];
  const inner = [
    [0.0136, 0.1516], [0.0112, 0.146], [0.0108, 0.138], [0.0114, 0.13], [0.0148, 0.12],
    [0.0205, 0.107], [0.0272, 0.092], [0.0328, 0.077], [0.0348, 0.064], [0.0348, 0.016], [0.033, 0.011], [0, 0.011],
  ];
  const profile = [...outer, ...inner].map(([x, y]) => new Vector2(x, y));
  // 14 sides: the faint facets of a moulded carafe
  const vase = new Mesh(new LatheGeometry(profile, 14), glass);
  vase.castShadow = true;
  vase.renderOrder = 3;
  g.add(vase);
  // Water, about two thirds up, with a slight meniscus
  const water = new MeshPhysicalMaterial({
    color: 0xeef8f4,
    roughness: 0.02,
    transmission: 1,
    thickness: 0.06,
    ior: 1.33,
    attenuationColor: new Color(0xcfe8dc),
    attenuationDistance: 0.4,
    transparent: true,
  });
  const level = 0.07;
  const waterProfile = [[0, 0.0112], [0.0345, 0.0112], [0.0345, 0.064], [0.034, level - 0.002], [0.0328, level], [0, level]]
    .map(([x, y]) => new Vector2(x, y));
  const waterMesh = new Mesh(new LatheGeometry(waterProfile, 12), water);
  waterMesh.renderOrder = 2;
  g.add(waterMesh);
  g.scale.set(...VASE_SCALE);
  return g;
}

/* ---------------------------------------------------------------------------
 * Coffee cup and saucer
 * ------------------------------------------------------------------------- */

function cremaTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const r = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  r.addColorStop(0, '#5a2f17');
  r.addColorStop(0.55, '#7a4422');
  r.addColorStop(0.82, '#a8703f');
  r.addColorStop(0.95, '#c79a6a');
  r.addColorStop(1, '#8a5530');
  g.fillStyle = r;
  g.fillRect(0, 0, 256, 256);
  // A soft swirl in the crema
  g.strokeStyle = 'rgba(214, 170, 120, 0.35)';
  g.lineWidth = 6;
  g.beginPath();
  for (let a = 0; a < Math.PI * 5; a += 0.08) {
    const rad = 10 + a * 6.5;
    g.lineTo(128 + Math.cos(a) * rad, 128 + Math.sin(a) * rad * 0.9);
  }
  g.stroke();
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

/**
 * A glazed ceramic cup on its saucer, with coffee inside. The group's origin
 * is the centre of the saucer's base on the desk; the handle points along +x.
 */
export function buildCoffeeCup() {
  const g = new Group();
  const glaze = new MeshPhysicalMaterial({ color: 0xf5f1ea, roughness: 0.14, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 0.85 });
  const foot = new MeshStandardMaterial({ color: 0xd9d2c4, roughness: 0.85 });

  // Saucer: a shallow dish with a raised ring for the cup
  const saucerProfile = [
    [0, 0], [0.042, 0], [0.046, 0.0015], [0.058, 0.004], [0.068, 0.0085], [0.0735, 0.0115], [0.0742, 0.0128],
    [0.0732, 0.0134], [0.067, 0.0108], [0.057, 0.007], [0.045, 0.0058], [0.0395, 0.0062], [0.0375, 0.0058], [0, 0.0058],
  ].map(([x, y]) => new Vector2(x, y));
  const saucer = new Mesh(new LatheGeometry(saucerProfile, 72), glaze);
  saucer.castShadow = true;
  saucer.receiveShadow = true;
  g.add(saucer);
  const ring = new Mesh(new LatheGeometry([new Vector2(0.03, 0), new Vector2(0.042, 0), new Vector2(0.042, 0.0008), new Vector2(0.03, 0.0008)], 48), foot);
  g.add(ring);

  // Cup: tapered body, rolled rim, real wall thickness, glazed inside
  const cup = new Group();
  cup.position.y = 0.0058;
  const H = 0.072;
  const cupProfile = [
    [0, 0.004], [0.022, 0.004], [0.024, 0.0015], [0.026, 0], [0.0285, 0.0012], [0.031, 0.008], [0.0345, 0.03],
    [0.0375, 0.052], [0.0398, H - 0.004], [0.0408, H - 0.001], [0.0406, H + 0.0008], [0.0396, H + 0.0012],
    [0.0386, H], [0.0378, H - 0.004], [0.0355, 0.052], [0.0325, 0.03], [0.029, 0.012], [0.024, 0.0085], [0, 0.0082],
  ].map(([x, y]) => new Vector2(x, y));
  const body = new Mesh(new LatheGeometry(cupProfile, 80), glaze);
  body.castShadow = true;
  body.receiveShadow = true;
  cup.add(body);

  // Coffee with crema, just below the rim
  const level = H - 0.012;
  const coffee = new Mesh(new CircleGeometry(0.0368, 48), new MeshPhysicalMaterial({ map: cremaTexture(), roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.2 }));
  coffee.rotation.x = -Math.PI / 2;
  coffee.position.y = level;
  cup.add(coffee);

  // Handle: a sculpted loop, slightly flattened, joined into the wall
  const handle = tube(
    [
      new Vector3(0.0372, 0.056, 0),
      new Vector3(0.05, 0.058, 0),
      new Vector3(0.0595, 0.048, 0),
      new Vector3(0.06, 0.03, 0),
      new Vector3(0.0525, 0.019, 0),
      new Vector3(0.034, 0.016, 0),
    ],
    0.0052,
    glaze,
    48
  );
  handle.scale.z = 0.72;
  handle.castShadow = true;
  cup.add(handle);
  g.add(cup);

  // A teaspoon resting on the saucer
  const steel = new MeshPhysicalMaterial({ color: 0xd8dade, metalness: 1, roughness: 0.18 });
  const spoon = new Group();
  const stemSpoon = tube([new Vector3(0, 0, 0), new Vector3(0.03, 0.002, 0), new Vector3(0.062, 0.006, 0)], 0.0014, steel, 16);
  stemSpoon.scale.z = 0.5;
  const bowl = new Mesh(new CapsuleGeometry(0.0055, 0.008, 6, 12), steel);
  bowl.rotation.z = Math.PI / 2;
  bowl.scale.set(1, 1, 0.45);
  bowl.position.set(-0.008, 0, 0);
  spoon.add(stemSpoon, bowl);
  spoon.position.set(0.012, 0.0115, 0.05);
  spoon.rotation.y = -0.35;
  g.add(spoon);
  return g;
}

// The laptop: its dimensions, its keyboard and the mesh itself, shared by the
// homepage hero (deskEngine) and the insurance claims desk. Pure geometry, so
// importing it does not pull in a scene or its post-processing.
import {
  CanvasTexture,
  CylinderGeometry,
  Group,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// Laptop dimensions (metres) and its 16:10 display area.
export const LAP = { w: 0.312, d: 0.218, base: 0.0145, lidT: 0.0055, open: 1.86 };
export const DISPLAY = { w: 0.2976, h: 0.186 };
export const SCREEN_PX = { w: 1440, h: 900 };

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

/** The laptop mesh; `display` is the screen plane, ready for a texture. */
export function buildLaptop() {
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
export function contactShadow(w, d, opacity = 0.55) {
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

import * as THREE from 'three';
import { worldVertex, coreFragment, glassFragment } from './shaders';
import { createGlowSprite, createTrailMaterial } from './materials';

// "Linkfields Core": the cinematic AI emblem. It is an original construction
// and does not reuse the company logo. It is brand-compatible:
//   - a luminous core (yellow → orange) = computational intelligence
//   - a faceted glass shell with gold edges = enterprise-grade structure
//   - three tilted orbital rings in yellow, orange and blue = the three logo
//     colours as orbits, echoing (not copying) the tri-colour mark
//   - nodes that ride the rings, joined by pulsing light trails = connectivity

const BRAND = { yellow: '#ffd600', orange: '#ff7800', blue: '#2d58c0' };

const RING_DEFS = [
  { radius: 1.55, color: BRAND.yellow, tilt: [1.2, 0.0, 0.35], speed: 0.1 },
  { radius: 1.95, color: BRAND.orange, tilt: [0.35, 0.9, -0.2], speed: -0.075 },
  { radius: 2.35, color: '#4f7dff', tilt: [-0.55, -0.4, 1.0], speed: 0.055 },
];

const bright = (hex, k) => new THREE.Color(hex).multiplyScalar(k);

export function createEmblem(profile) {
  const group = new THREE.Group();
  group.name = 'emblem';
  const octaves = profile.name === 'light' ? 3 : 4;

  // Core
  const coreMat = new THREE.ShaderMaterial({
    vertexShader: worldVertex,
    fragmentShader: coreFragment,
    defines: { OCTAVES: octaves },
    uniforms: {
      uTime: { value: 0 },
      uPulse: { value: 0 },
      uHot: { value: new THREE.Color('#fff4c2') },
      uWarm: { value: new THREE.Color(BRAND.orange) },
      uCool: { value: new THREE.Color('#ff3d00') },
    },
  });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.52, profile.name === 'light' ? 3 : 5), coreMat);
  group.add(core);

  // Faceted glass shell and gold edges
  const shellGeo = new THREE.IcosahedronGeometry(0.98, 1);
  const glassMat = new THREE.ShaderMaterial({
    vertexShader: worldVertex,
    fragmentShader: glassFragment,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 1 },
      uRim: { value: new THREE.Color('#9db8ff') },
      uTint: { value: new THREE.Color(BRAND.blue) },
    },
    transparent: true,
    depthWrite: false,
  });
  const shell = new THREE.Mesh(shellGeo, glassMat);
  group.add(shell);

  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(shellGeo),
    new THREE.LineBasicMaterial({ color: bright(BRAND.yellow, 1.3), transparent: true, opacity: 0.5, depthWrite: false })
  );
  shell.add(edges);

  let lattice = null;
  if (profile.name !== 'light') {
    lattice = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.74, 0)),
      new THREE.LineBasicMaterial({ color: bright('#8fb0ff', 1.2), transparent: true, opacity: 0.35, depthWrite: false })
    );
    group.add(lattice);
  }

  // Halo: gives glow even when bloom is off (light profile)
  const halo = createGlowSprite('#ff9a2e', 5.6, 0.55);
  group.add(halo);
  const haloCool = createGlowSprite('#3a64d8', 11, 0.22);
  group.add(haloCool);

  // Rings with riding nodes
  const rings = [];
  const nodes = [];
  const ringCount = Math.min(profile.emblemRings || 3, RING_DEFS.length);
  const nodesPerRing = Math.max(2, Math.round((profile.emblemNodes || 12) / ringCount));
  const nodeGeo = new THREE.SphereGeometry(0.045, 12, 12);

  for (let i = 0; i < ringCount; i++) {
    const def = RING_DEFS[i];
    const pivot = new THREE.Group();
    pivot.rotation.set(...def.tilt);
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(def.radius, 0.012, 6, 240),
      new THREE.MeshBasicMaterial({ color: bright(def.color, 1.7), transparent: true, opacity: 0.9 })
    );
    pivot.add(torus);
    const nodeMat = new THREE.MeshBasicMaterial({ color: bright(i === 2 ? '#bcd0ff' : '#fff2b0', 2.2) });
    for (let n = 0; n < nodesPerRing; n++) {
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.userData = { ring: i, angle: (n / nodesPerRing) * Math.PI * 2 + i, radius: def.radius, speed: 0.12 + n * 0.015 };
      pivot.add(node);
      nodes.push(node);
    }
    group.add(pivot);
    rings.push({ pivot, def });
  }

  // Light trails: node[i] of ring k ↔ node[i] of ring k+1, plus spokes to the core.
  const pairs = [];
  for (let k = 0; k < ringCount; k++) {
    const ringNodes = nodes.filter((n) => n.userData.ring === k);
    const nextNodes = nodes.filter((n) => n.userData.ring === k + 1);
    ringNodes.forEach((node, i) => {
      if (k === 0) pairs.push([null, node]);
      if (nextNodes[i]) pairs.push([node, nextNodes[i]]);
    });
  }
  const trailGeo = new THREE.BufferGeometry();
  const trailPositions = new Float32Array(pairs.length * 6);
  const aT = new Float32Array(pairs.length * 2);
  const aSeed = new Float32Array(pairs.length * 2);
  pairs.forEach((_, i) => {
    aT[i * 2] = 0;
    aT[i * 2 + 1] = 1;
    aSeed[i * 2] = aSeed[i * 2 + 1] = Math.random();
  });
  trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3).setUsage(THREE.DynamicDrawUsage));
  trailGeo.setAttribute('aT', new THREE.BufferAttribute(aT, 1));
  trailGeo.setAttribute('aSeed', new THREE.BufferAttribute(aSeed, 1));
  const trailMat = createTrailMaterial('#6f8fe0', '#ffd600', 0.9);
  const trails = new THREE.LineSegments(trailGeo, trailMat);
  trails.frustumCulled = false;
  group.add(trails);

  // Expanding energy pulse ring (billboarded)
  const pulseMat = new THREE.MeshBasicMaterial({
    color: bright(BRAND.yellow, 1.4),
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const pulse = new THREE.Mesh(new THREE.RingGeometry(0.97, 1.0, 96), pulseMat);
  group.add(pulse);

  const tmpA = new THREE.Vector3();
  const tmpB = new THREE.Vector3();
  const tmpQ = new THREE.Quaternion();

  function nodeLocal(node, out) {
    const { angle, radius } = node.userData;
    node.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
    node.parent.updateMatrix();
    return out.copy(node.position).applyMatrix4(node.parent.matrix);
  }

  return {
    group,
    core,
    update(t, dt, camera) {
      coreMat.uniforms.uTime.value = t;
      const beat = Math.pow(Math.max(0, Math.sin(t * 1.1)), 8);
      coreMat.uniforms.uPulse.value = beat;
      glassMat.uniforms.uTime.value = t;
      trailMat.uniforms.uTime.value = t;

      group.rotation.y += dt * 0.05;
      shell.rotation.x += dt * 0.03;
      shell.rotation.y -= dt * 0.045;
      if (lattice) {
        lattice.rotation.y += dt * 0.08;
        lattice.rotation.z -= dt * 0.05;
      }
      rings.forEach(({ pivot, def }) => {
        pivot.rotation.z += dt * def.speed;
      });
      nodes.forEach((node) => {
        node.userData.angle += dt * node.userData.speed;
      });

      // Update trail endpoints in emblem space
      pairs.forEach(([a, b], i) => {
        if (a) nodeLocal(a, tmpA);
        else tmpA.set(0, 0, 0);
        nodeLocal(b, tmpB);
        trailPositions.set([tmpA.x, tmpA.y, tmpA.z, tmpB.x, tmpB.y, tmpB.z], i * 6);
      });
      trailGeo.attributes.position.needsUpdate = true;

      // Pulse: expands over 4 s
      const cycle = (t % 4) / 4;
      pulse.scale.setScalar(1 + cycle * 2.4);
      pulseMat.opacity = (1 - cycle) * 0.35;
      pulse.quaternion.copy(camera.quaternion);
      group.updateMatrixWorld();
      pulse.quaternion.premultiply(group.getWorldQuaternion(tmpQ).invert());

      halo.material.opacity = 0.5 + beat * 0.15;
    },
  };
}

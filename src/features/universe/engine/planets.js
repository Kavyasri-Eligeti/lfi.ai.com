import * as THREE from 'three';
import { createPlanetMaterial, createAtmosphereMaterial, createRingMesh, createOrbitLine, createGlowSprite } from './materials';

const UP = new THREE.Vector3(0, 1, 0);
const X_AXIS = new THREE.Vector3(1, 0, 0);

// Shared planet body: procedural surface + atmosphere (+ optional ring).
function createBody(visual, radius, profile) {
  const group = new THREE.Group();
  const octaves = profile.name === 'high' ? 5 : profile.name === 'balanced' ? 4 : 3;
  const segs = profile.segments || 64;
  const geometry = new THREE.SphereGeometry(1, segs, Math.round(segs * 0.66));
  const material = createPlanetMaterial(visual, { octaves });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.setScalar(radius);
  mesh.rotation.z = 0.25;
  group.add(mesh);

  const atmosphere = new THREE.Mesh(geometry, createAtmosphereMaterial(visual.atmosphere));
  atmosphere.scale.setScalar(radius * 1.16);
  group.add(atmosphere);

  if (visual.ring) {
    const ring = createRingMesh(radius * 1.45, radius * 2.35, visual.colors[2]);
    ring.rotation.set(-Math.PI / 2 + 0.42, 0.18, 0);
    group.add(ring);
  }
  return { group, mesh, material };
}

/**
 * An AI category planet orbiting the emblem.
 * Hierarchy: orbitPivot (tilt + orbital angle) → anchor (at orbit radius) → body.
 */
export function createAIPlanet(def, profile, { orbitScale = 1 } = {}) {
  const v = def.visual;
  const orbitRadius = v.orbit * orbitScale;
  const tiltGroup = new THREE.Group();
  tiltGroup.rotation.x = v.tilt;
  tiltGroup.rotation.z = v.tilt * 0.6;

  const orbitLine = createOrbitLine(orbitRadius);
  tiltGroup.add(orbitLine);

  const pivot = new THREE.Group();
  pivot.rotation.y = v.phase;
  tiltGroup.add(pivot);

  const anchor = new THREE.Group();
  anchor.position.set(orbitRadius, 0, 0);
  pivot.add(anchor);

  const body = createBody(v, v.radius, profile);
  anchor.add(body.group);

  // Technology moons
  const moons = [];
  if (profile.moons) {
    const moonGeo = new THREE.SphereGeometry(1, 20, 14);
    def.moons.forEach((techId, i) => {
      const moonPivot = new THREE.Group();
      moonPivot.rotation.x = 0.5 - i * 0.45;
      moonPivot.rotation.z = 0.2 * i;
      const moonMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(v.colors[2]).lerp(new THREE.Color('#ffffff'), 0.35),
        emissive: new THREE.Color(v.atmosphere),
        emissiveIntensity: 0.18,
        roughness: 0.55,
        metalness: 0.15,
      });
      const moon = new THREE.Mesh(moonGeo, moonMat);
      const size = 0.09 + (i % 3) * 0.025;
      moon.scale.setScalar(size);
      const dist = v.radius * (1.9 + i * 0.42);
      moon.position.set(dist, 0, 0);
      moonPivot.add(moon);
      body.group.add(moonPivot);
      moons.push({ id: `${def.id}:${techId}`, techId, pivot: moonPivot, mesh: moon, speed: 0.35 / (1 + i * 0.6), radius: size });
    });
  }

  // Orbital speed ~ Kepler-like falloff, tuned for calm motion.
  const orbitSpeed = 0.75 / Math.pow(v.orbit, 1.35);
  const spin = 0.08 + (v.radius % 0.3) * 0.2;

  const worldPos = new THREE.Vector3();
  let hover = 0;
  let hoverTarget = 0;

  return {
    id: def.id,
    root: tiltGroup,
    anchor,
    pickMesh: body.mesh,
    radius: v.radius,
    moons,
    setHover(on) {
      hoverTarget = on ? 1 : 0;
    },
    getWorldPosition(out = worldPos) {
      return anchor.getWorldPosition(out);
    },
    update(t, dt, orbitFactor) {
      pivot.rotation.y += dt * orbitSpeed * orbitFactor;
      body.mesh.rotation.y += dt * spin;
      body.material.uniforms.uTime.value = t;
      hover += (hoverTarget - hover) * (1 - Math.exp(-dt * 8));
      body.material.uniforms.uHover.value = hover;
      moons.forEach((m) => {
        m.pivot.rotation.y += dt * m.speed;
      });
    },
  };
}

/** Outer world (Solutions / Services) with labelled satellites. */
export function createWorld(def, profile) {
  const root = new THREE.Group();
  root.position.set(...def.position);
  const body = createBody(
    { colors: def.colors, atmosphere: def.atmosphere, noise: 1.2, bands: def.ring ? 9 : 3, bandMix: def.ring ? 0.7 : 0.25, lines: 0.9, ring: def.ring },
    def.radius,
    profile
  );
  root.add(body.group);

  const orbit = createOrbitLine(def.moonOrbit, def.atmosphere, 0.22);
  orbit.rotation.x = 0.28;
  root.add(orbit);

  const satGeo = new THREE.OctahedronGeometry(1, 0);
  const satellites = def.satellites.map((s, i) => {
    const angle = (i / def.satellites.length) * Math.PI * 2;
    const mat = new THREE.MeshStandardMaterial({
      color: '#e6eced',
      emissive: new THREE.Color(def.atmosphere),
      emissiveIntensity: 0.55,
      metalness: 0.6,
      roughness: 0.3,
      flatShading: true,
    });
    const mesh = new THREE.Mesh(satGeo, mat);
    mesh.scale.setScalar(0.34);
    const glow = createGlowSprite(def.atmosphere, 1.9, 0.5);
    mesh.add(glow);
    root.add(mesh);
    return { ...s, mesh, angle, radius: 0.34 };
  });

  let speedFactor = 1;
  let speedTarget = 1;
  const tmp = new THREE.Vector3();

  return {
    id: def.id,
    root,
    radius: def.radius,
    satellites,
    pickMeshes: satellites.map((s) => s.mesh),
    pause(paused) {
      speedTarget = paused ? 0 : 1;
    },
    update(t, dt) {
      speedFactor += (speedTarget - speedFactor) * (1 - Math.exp(-dt * 5));
      body.mesh.rotation.y += dt * 0.03;
      body.material.uniforms.uTime.value = t;
      satellites.forEach((s) => {
        s.angle += dt * 0.045 * speedFactor;
        tmp.set(Math.cos(s.angle) * def.moonOrbit, 0, Math.sin(s.angle) * def.moonOrbit);
        tmp.applyAxisAngle(X_AXIS, 0.28);
        s.mesh.position.copy(tmp);
        s.mesh.rotation.y += dt * 0.6;
        s.mesh.rotation.x += dt * 0.3;
      });
    },
  };
}

/** Industries constellation: crystalline stars joined by pulsing lines. */
export function createConstellation(def, trailMaterial) {
  const root = new THREE.Group();
  root.position.set(...def.position);
  const crystalGeo = new THREE.IcosahedronGeometry(1, 0);
  const stars = def.stars.map((s, i) => {
    const [x, y] = def.layout[i];
    const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(i % 2 ? '#ffd600' : '#9db8ff').multiplyScalar(1.6) });
    const mesh = new THREE.Mesh(crystalGeo, mat);
    mesh.scale.setScalar(0.42);
    mesh.position.set(x, y, (i % 3) - 1);
    mesh.add(createGlowSprite(i % 2 ? '#ffb000' : '#5d86ff', 3.2, 0.6));
    root.add(mesh);
    return { ...s, mesh, radius: 0.42 };
  });

  const links = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0], [2, 6], [1, 7], [3, 5]];
  const positions = new Float32Array(links.length * 6);
  const aT = new Float32Array(links.length * 2);
  const aSeed = new Float32Array(links.length * 2);
  links.forEach(([a, b], i) => {
    const pa = stars[a].mesh.position;
    const pb = stars[b].mesh.position;
    positions.set([pa.x, pa.y, pa.z, pb.x, pb.y, pb.z], i * 6);
    aT[i * 2 + 1] = 1;
    aSeed[i * 2] = aSeed[i * 2 + 1] = i / links.length;
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('aT', new THREE.BufferAttribute(aT, 1));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(aSeed, 1));
  root.add(new THREE.LineSegments(geo, trailMaterial));

  return {
    id: 'industries',
    root,
    stars,
    pickMeshes: stars.map((s) => s.mesh),
    update(t, dt) {
      stars.forEach((s, i) => {
        s.mesh.rotation.y += dt * (0.3 + i * 0.03);
        s.mesh.rotation.x += dt * 0.2;
        s.mesh.scale.setScalar(0.42 * (1 + 0.06 * Math.sin(t * 1.3 + i)));
      });
    },
  };
}

export { UP };

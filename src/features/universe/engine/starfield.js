import * as THREE from 'three';
import { starVertex, starFragment, nebulaVertex, nebulaFragment } from './shaders';

// Star colours: mostly cool white, some brand-warm and blue.
const PALETTE = ['#ffffff', '#dfe8ff', '#bcd0ff', '#fff1c9', '#ffd08a'];

export function createStarfield(count) {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);
  const colors = new Float32Array(count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < count; i++) {
    // Uniform direction on a sphere, radius 140–420 (shell around the scene).
    const u = Math.random() * 2 - 1;
    const theta = Math.random() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    const r = 140 + Math.pow(Math.random(), 0.6) * 280;
    positions[i * 3] = Math.cos(theta) * s * r;
    positions[i * 3 + 1] = u * r;
    positions[i * 3 + 2] = Math.sin(theta) * s * r;
    sizes[i] = 0.6 + Math.pow(Math.random(), 4) * 2.6;
    phases[i] = Math.random();
    c.set(PALETTE[Math.floor(Math.pow(Math.random(), 2.2) * PALETTE.length)]);
    colors.set([c.r, c.g, c.b], i * 3);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
  geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
  const material = new THREE.ShaderMaterial({
    vertexShader: starVertex,
    fragmentShader: starFragment,
    uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  return {
    object: points,
    update(t, dpr) {
      material.uniforms.uTime.value = t;
      material.uniforms.uPixelRatio.value = dpr;
    },
  };
}

export function createNebula() {
  const material = new THREE.ShaderMaterial({
    vertexShader: nebulaVertex,
    fragmentShader: nebulaFragment,
    defines: { OCTAVES: 3 },
    uniforms: {
      uDeep: { value: new THREE.Color('#03050d') },
      uBlue: { value: new THREE.Color('#1c3a8a') },
      uWarm: { value: new THREE.Color('#ff7800') },
    },
    side: THREE.BackSide,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(480, 48, 24), material);
  mesh.renderOrder = -10;
  return mesh;
}

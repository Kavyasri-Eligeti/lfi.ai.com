import * as THREE from 'three';
import {
  worldVertex,
  planetFragment,
  atmosphereFragment,
  ringVertex,
  ringFragment,
  trailVertex,
  trailFragment,
} from './shaders';

export const ORIGIN = new THREE.Vector3(0, 0, 0);

let seedCounter = 1;

export function createPlanetMaterial(visual, { octaves = 5, lightPos = ORIGIN } = {}) {
  const [a, b, c] = visual.colors;
  return new THREE.ShaderMaterial({
    vertexShader: worldVertex,
    fragmentShader: planetFragment,
    defines: { OCTAVES: octaves },
    uniforms: {
      uColorA: { value: new THREE.Color(a) },
      uColorB: { value: new THREE.Color(b) },
      uColorC: { value: new THREE.Color(c) },
      uAtmos: { value: new THREE.Color(visual.atmosphere) },
      uLightPos: { value: lightPos.clone() },
      uTime: { value: 0 },
      uNoise: { value: visual.noise ?? 1.5 },
      uBands: { value: visual.bands ?? 0 },
      uBandMix: { value: visual.bandMix ?? 0 },
      uLines: { value: visual.lines ?? 0.8 },
      uSeed: { value: (seedCounter++ * 7.31) % 50 },
      uHover: { value: 0 },
    },
  });
}

export function createAtmosphereMaterial(color, { intensity = 1.2, lightPos = ORIGIN } = {}) {
  return new THREE.ShaderMaterial({
    vertexShader: worldVertex,
    fragmentShader: atmosphereFragment,
    uniforms: {
      uAtmos: { value: new THREE.Color(color) },
      uLightPos: { value: lightPos.clone() },
      uIntensity: { value: intensity },
    },
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

export function createRingMesh(innerRadius, outerRadius, color) {
  const geometry = new THREE.PlaneGeometry(outerRadius * 2, outerRadius * 2, 1, 1);
  const material = new THREE.ShaderMaterial({
    vertexShader: ringVertex,
    fragmentShader: ringFragment,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uInner: { value: innerRadius / outerRadius },
      uOuter: { value: 1.0 },
      uSeed: { value: Math.random() * 10 },
    },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}

export function createTrailMaterial(base, pulse, opacity = 1) {
  return new THREE.ShaderMaterial({
    vertexShader: trailVertex,
    fragmentShader: trailFragment,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: opacity },
      uBase: { value: new THREE.Color(base) },
      uPulse: { value: new THREE.Color(pulse) },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

// Soft radial glow texture, generated once on a small canvas (no image assets).
let glowTexture = null;
export function getGlowTexture() {
  if (glowTexture) return glowTexture;
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.2, 'rgba(255,255,255,0.55)');
  g.addColorStop(0.5, 'rgba(255,255,255,0.12)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  glowTexture = new THREE.CanvasTexture(canvas);
  glowTexture.colorSpace = THREE.SRGBColorSpace;
  return glowTexture;
}

export function releaseGlowTexture() {
  glowTexture?.dispose();
  glowTexture = null;
}

export function createGlowSprite(color, scale, opacity = 1) {
  const material = new THREE.SpriteMaterial({
    map: getGlowTexture(),
    color: new THREE.Color(color),
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.setScalar(scale);
  return sprite;
}

export function createOrbitLine(radius, color = '#8fb0ff', opacity = 0.14, segments = 256) {
  const points = [];
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
  }
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
  return new THREE.LineLoop(geometry, material);
}

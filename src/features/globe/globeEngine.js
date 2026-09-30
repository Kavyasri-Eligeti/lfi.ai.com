import * as THREE from 'three';
import gsap from 'gsap';
import { createAtmosphereMaterial, createGlowSprite, createTrailMaterial, releaseGlowTexture } from '../universe/engine/materials';
import { disposeObject } from '../universe/engine/dispose';

// Stylised globe: a graticule, a fresnel rim, pulsing office markers and arcs
// from the Midrand HQ. It draws no coastlines, so no geographic dataset or
// third-party texture is needed. Marker positions are approximate city centres.

const vertex = /* glsl */ `
varying vec3 vObj;
varying vec3 vWorldPos;
varying vec3 vWorldNormal;
void main(){
  vObj = position;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;
const fragment = /* glsl */ `
varying vec3 vObj;
varying vec3 vWorldPos;
varying vec3 vWorldNormal;
uniform vec3 uBase;
uniform vec3 uGrid;
uniform vec3 uRim;
float gridLine(float v, float step){
  float f = abs(fract(v / step + 0.5) - 0.5) * step;
  float w = fwidth(v) * 1.2;
  return 1.0 - smoothstep(0.0, w, f);
}
void main(){
  vec3 p = normalize(vObj);
  float lat = degrees(asin(p.y));
  float lon = degrees(atan(p.z, p.x));
  float g = max(gridLine(lat, 15.0), gridLine(lon, 15.0));
  float eq = gridLine(lat, 180.0);
  vec3 N = normalize(vWorldNormal);
  vec3 V = normalize(cameraPosition - vWorldPos);
  float fres = pow(1.0 - max(dot(N, V), 0.0), 2.4);
  float light = 0.55 + 0.45 * max(dot(N, normalize(vec3(-0.4, 0.5, 1.0))), 0.0);
  vec3 col = uBase * light + uGrid * g * 0.28 + uGrid * eq * 0.35 + uRim * fres * 0.75;
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export function latLonToVector(lat, lon, radius = 1) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(-Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta)).multiplyScalar(radius);
}

export function createGlobe({ canvas, container, offices, onReady }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.debug.checkShaderErrors = process.env.NODE_ENV !== 'production';

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
  camera.position.set(0, 0, 4.2);

  const globe = new THREE.Group();
  scene.add(globe);

  const sphereGeo = new THREE.SphereGeometry(1, 96, 64);
  globe.add(
    new THREE.Mesh(
      sphereGeo,
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          uBase: { value: new THREE.Color('#0b1430') },
          uGrid: { value: new THREE.Color('#4f7dff') },
          uRim: { value: new THREE.Color('#6fa0ff') },
        },
      })
    )
  );
  const atmosphere = new THREE.Mesh(sphereGeo, createAtmosphereMaterial('#4f7dff', { intensity: 1.1, lightPos: new THREE.Vector3(-2, 2, 5) }));
  atmosphere.scale.setScalar(1.12);
  scene.add(atmosphere);

  const markers = offices.map((o) => {
    const pos = latLonToVector(o.approx.lat, o.approx.lon, 1.005);
    const group = new THREE.Group();
    group.position.copy(pos);
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(o.hq ? 0.028 : 0.022, 16, 12),
      new THREE.MeshBasicMaterial({ color: o.hq ? '#ffd600' : '#ffffff' })
    );
    const glow = createGlowSprite(o.hq ? '#ff9a2e' : '#8fb0ff', 0.28, 0.9);
    group.add(dot, glow);
    globe.add(group);
    return { id: o.id, group, glow, pos, base: 0.28 };
  });

  // Arcs from HQ
  const hq = markers.find((m, i) => offices[i].hq) || markers[0];
  const trail = createTrailMaterial('#3a64d8', '#ffd600', 1);
  markers.filter((m) => m !== hq).forEach((m, k) => {
    const mid = hq.pos.clone().add(m.pos).multiplyScalar(0.5);
    const lift = 1 + hq.pos.distanceTo(m.pos) * 0.32;
    mid.normalize().multiplyScalar(lift);
    const curve = new THREE.QuadraticBezierCurve3(hq.pos, mid, m.pos);
    const pts = curve.getPoints(64);
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    geo.setAttribute('aT', new THREE.BufferAttribute(new Float32Array(pts.map((_, i) => i / (pts.length - 1))), 1));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(new Float32Array(pts.length).fill(k / 6), 1));
    globe.add(new THREE.Line(geo, trail));
  });

  globe.rotation.set(0.35, -0.6, 0);

  // Interaction: drag to rotate, auto-rotate otherwise
  const state = { auto: true, dragging: false, lastX: 0, lastY: 0, active: null };
  function onDown(e) {
    state.dragging = true;
    state.auto = false;
    state.lastX = e.clientX;
    state.lastY = e.clientY;
    gsap.killTweensOf(globe.rotation);
    canvas.setPointerCapture?.(e.pointerId);
  }
  function onMove(e) {
    if (!state.dragging) return;
    globe.rotation.y += (e.clientX - state.lastX) * 0.006;
    globe.rotation.x = THREE.MathUtils.clamp(globe.rotation.x + (e.clientY - state.lastY) * 0.004, -1.1, 1.1);
    state.lastX = e.clientX;
    state.lastY = e.clientY;
  }
  function onUp() {
    state.dragging = false;
  }
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);

  function resize() {
    const w = Math.max(1, container.clientWidth);
    const h = Math.max(1, container.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  const clock = new THREE.Clock();
  let raf = 0;
  let running = false;
  function frame() {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    if (state.auto) globe.rotation.y += dt * 0.08;
    trail.uniforms.uTime.value = t;
    markers.forEach((m, i) => {
      const active = state.active === m.id;
      const pulse = 1 + 0.25 * Math.sin(t * 2 + i);
      m.glow.scale.setScalar(m.base * pulse * (active ? 2.2 : 1));
    });
    renderer.render(scene, camera);
  }

  function start() {
    if (running) return;
    running = true;
    clock.getDelta();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }
  start();
  onReady?.();

  return {
    start,
    stop,
    focus(id) {
      const m = markers.find((x) => x.id === id);
      if (!m) return;
      state.active = id;
      state.auto = false;
      const v = m.pos;
      let targetY = Math.atan2(-v.x, v.z);
      const zAfter = Math.hypot(v.x, v.z);
      const targetX = Math.atan2(v.y, zAfter);
      // shortest rotation path
      const current = globe.rotation.y;
      targetY = current + (((targetY - current + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
      gsap.to(globe.rotation, { x: targetX, y: targetY, duration: 1.4, ease: 'power2.inOut', overwrite: true });
    },
    dispose() {
      stop();
      gsap.killTweensOf(globe.rotation);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      disposeObject(scene);
      releaseGlowTexture();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}

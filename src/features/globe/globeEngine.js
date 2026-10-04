// The office globe (plain Three.js, lazy-loaded): a photoreal Earth.
// NASA-based day imagery lit by a sun from the upper left, city lights glowing
// on the night side, a drifting cloud layer, sun glint on the oceans and a
// soft atmosphere at the limb. Each Linkfields office is marked by a small
// Linkfields mark (an HTML element positioned here every frame, so it stays
// crisp) above a faint orange pulse on the ground. Thin orange arcs link the
// Midrand head office to every branch. The globe turns slowly, can be dragged
// with inertia, and flies to an office on request.
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Clock,
  Group,
  Line,
  LinearSRGBColorSpace,
  Mesh,
  RepeatWrapping,
  PerspectiveCamera,
  QuadraticBezierCurve3,
  RingGeometry,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  SRGBColorSpace,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from 'three';

const R = 2;
const D2R = Math.PI / 180;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const OUTPUT = /* glsl */ `
  #include <colorspace_fragment>
`;
const tex = (name) => `${process.env.PUBLIC_URL || ''}/textures/earth/${name}.webp`;

// lat/lon (degrees) → point on the sphere (matches the texture's UV layout)
export function toVec(lat, lon, r = R) {
  const phi = (90 - lat) * D2R;
  const theta = (lon + 180) * D2R;
  return new Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

// The sun, fixed relative to the camera: upper left and slightly in front,
// so the face we see is lit and the night side glows along the right limb.
const SUN = new Vector3(-0.75, 0.42, 0.55).normalize();

function earth(uniforms) {
  return new Mesh(
    new SphereGeometry(R, 128, 96),
    new ShaderMaterial({
      uniforms,
      vertexShader: /* glsl */ `
        varying vec2 vUv; varying vec3 vN; varying vec3 vView;
        void main() {
          vUv = uv;
          vN = normalize(mat3(modelMatrix) * normal);
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vView = normalize(cameraPosition - wp.xyz);
          gl_Position = projectionMatrix * viewMatrix * wp;
        }`,
      fragmentShader: /* glsl */ `
        uniform sampler2D uDay; uniform sampler2D uNight; uniform sampler2D uClouds;
        uniform vec3 uSun; uniform float uReady; uniform float uTime; uniform float uIntro;
        varying vec2 vUv; varying vec3 vN; varying vec3 vView;
        void main() {
          vec3 N = normalize(vN);
          vec3 V = normalize(vView);
          float ndl = dot(N, uSun);
          float day = smoothstep(-0.18, 0.28, ndl);

          vec3 dayCol = texture2D(uDay, vUv).rgb;
          vec3 nightCol = texture2D(uNight, vUv).rgb;
          // Cloud shadows on the ground.
          float shadow = texture2D(uClouds, vUv + vec2(uTime * 0.0009 + 0.002, 0.0)).r;

          // Oceans: give them a sun glint.
          float ocean = smoothstep(0.08, 0.0, dayCol.r - dayCol.b * 0.9) * smoothstep(0.5, 0.15, dayCol.g);
          vec3 H = normalize(uSun + V);
          float glint = pow(max(dot(N, H), 0.0), 220.0) * ocean * 0.45;

          vec3 lit = dayCol * (0.18 + 1.05 * max(ndl, 0.0)) * (1.0 - shadow * 0.35);
          lit += vec3(1.0, 0.92, 0.8) * glint;
          // City lights, warm, only where it is night.
          vec3 lights = pow(nightCol, vec3(1.4)) * vec3(1.6, 1.15, 0.7) * 2.2;
          vec3 col = mix(lights + dayCol * 0.025, lit, day);

          // Atmosphere at the limb: blue on the day side, faint violet at night.
          float rim = pow(1.0 - max(dot(N, V), 0.0), 3.0);
          col += mix(vec3(0.25, 0.18, 0.45) * 0.35, vec3(0.35, 0.65, 1.0), day) * rim * 0.9;

          col = mix(vec3(0.02, 0.03, 0.05), col, uReady);
          gl_FragColor = vec4(col * uIntro, 1.0);
          ${OUTPUT}
        }`,
    })
  );
}

function clouds(uniforms) {
  return new Mesh(
    new SphereGeometry(R * 1.008, 96, 72),
    new ShaderMaterial({
      uniforms,
      vertexShader: /* glsl */ `
        varying vec2 vUv; varying vec3 vN;
        void main() {
          vUv = uv;
          vN = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        uniform sampler2D uClouds; uniform vec3 uSun; uniform float uTime; uniform float uReady; uniform float uIntro;
        varying vec2 vUv; varying vec3 vN;
        void main() {
          float c = texture2D(uClouds, vUv + vec2(uTime * 0.0009, 0.0)).r;
          float light = smoothstep(-0.2, 0.4, dot(normalize(vN), uSun));
          gl_FragColor = vec4(vec3(1.0) * (0.15 + 0.95 * light), c * 0.85 * light * uReady * uIntro);
          ${OUTPUT}
        }`,
      transparent: true,
      depthWrite: false,
    })
  );
}

function atmosphere(uniforms) {
  return new Mesh(
    new SphereGeometry(R * 1.045, 96, 72),
    new ShaderMaterial({
      uniforms,
      vertexShader: /* glsl */ `
        varying vec3 vN; varying vec3 vView;
        void main() {
          vN = normalize(mat3(modelMatrix) * normal);
          vec4 wp = modelMatrix * vec4(position, 1.0);
          vView = normalize(cameraPosition - wp.xyz);
          gl_Position = projectionMatrix * viewMatrix * wp;
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uSun; uniform float uIntro;
        varying vec3 vN; varying vec3 vView;
        void main() {
          vec3 N = normalize(vN);
          float glow = pow(1.0 - abs(dot(N, normalize(vView))), 2.2);
          float day = smoothstep(-0.5, 0.6, dot(N, uSun));
          vec3 col = mix(vec3(0.35, 0.3, 0.7), vec3(0.35, 0.7, 1.0), day);
          gl_FragColor = vec4(col, glow * (0.2 + 0.8 * day) * 0.55 * uIntro);
          ${OUTPUT}
        }`,
      side: BackSide,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })
  );
}

// A faint orange pulse on the ground under each office's mark.
function pulse(office) {
  const { lat, lon } = office.approx;
  const pos = toVec(lat, lon, R * 1.002);
  const mat = new ShaderMaterial({
    uniforms: { uT: { value: Math.random() }, uOn: { value: 0 }, uIntro: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec2 vP; void main() { vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uT; uniform float uOn; uniform float uIntro; varying vec2 vP;
      void main() {
        float r = length(vP) / 0.14;
        float ring = smoothstep(0.1, 0.0, abs(r - uT)) * (1.0 - uT);
        float core = smoothstep(0.35, 0.0, r) * 0.5;
        gl_FragColor = vec4(vec3(1.0, 0.47, 0.0) * 1.5, (ring * 0.8 + core) * (0.55 + 0.45 * uOn) * uIntro);
        ${OUTPUT}
      }`,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });
  const mesh = new Mesh(new RingGeometry(0, 0.14, 48), mat);
  mesh.position.copy(pos);
  mesh.lookAt(pos.clone().multiplyScalar(2));
  return { office, mesh, mat, on: 0 };
}

// Thin orange arcs from the head office to every branch, with a travelling light.
function arcs(from, offices) {
  const group = new Group();
  const a = toVec(from.approx.lat, from.approx.lon, R);
  const mats = [];
  offices.filter((o) => o.id !== from.id).forEach((o, i) => {
    const b = toVec(o.approx.lat, o.approx.lon, R);
    const mid = a.clone().add(b).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(R + a.distanceTo(b) * 0.42);
    const pts = new QuadraticBezierCurve3(a, mid, b).getPoints(120);
    const g = new BufferGeometry().setFromPoints(pts);
    g.setAttribute('aT', new BufferAttribute(new Float32Array(pts.map((_, k) => k / (pts.length - 1))), 1));
    const mat = new ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uOffset: { value: i * 0.19 }, uIntro: { value: 0 } },
      vertexShader: /* glsl */ `
        attribute float aT; varying float vT;
        void main() { vT = aT; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform float uTime; uniform float uOffset; uniform float uIntro; varying float vT;
        void main() {
          if (vT > uIntro) discard;
          float head = fract(uTime * 0.18 + uOffset);
          float light = smoothstep(0.1, 0.0, abs(vT - head));
          float ends = smoothstep(0.0, 0.06, vT) * smoothstep(1.0, 0.94, vT);
          gl_FragColor = vec4(mix(vec3(1.0, 0.47, 0.0), vec3(1.0, 0.85, 0.6), light), (0.14 + light * 0.75) * ends);
          ${OUTPUT}
        }`,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    mats.push(mat);
    group.add(new Line(g, mat));
  });
  return { group, mats };
}

/**
 * host      element to draw into
 * offices   office list (content/company.js)
 * markers   { [officeId]: HTMLElement } positioned over each office
 */
export function createGlobe(host, { offices, markers = {} }) {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  // Never block the page on the driver: skip the synchronous shader error
  // check in production, and compile shaders in parallel before they draw.
  renderer.debug.checkShaderErrors = process.env.NODE_ENV !== 'production';
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.className = 'lf-globe__canvas';
  host.appendChild(canvas);

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 10);

  const shared = {
    uDay: { value: null },
    uNight: { value: null },
    uClouds: { value: null },
    uSun: { value: SUN },
    uReady: { value: 0 },
    uTime: { value: 0 },
    uIntro: { value: 0 },
  };
  const loader = new TextureLoader();
  const textures = [];
  let loaded = 0;
  const load = (key, name, srgb) =>
    loader.load(tex(name), (t) => {
      t.colorSpace = srgb ? SRGBColorSpace : LinearSRGBColorSpace;
      // The maps wrap around the globe: the drifting clouds slide past the
      // image's edge, so it must repeat rather than smear its last column.
      t.wrapS = RepeatWrapping;
      t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      shared[key].value = t;
      textures.push(t);
      loaded += 1;
    });
  load('uDay', 'day', true);
  load('uNight', 'night', true);
  load('uClouds', 'clouds', false);

  const tilt = new Group(); // rotation.x: latitude
  const spin = new Group(); // rotation.y: longitude
  tilt.add(spin);
  scene.add(tilt);
  scene.add(atmosphere(shared));
  spin.add(earth(shared), clouds(shared));
  const pulses = offices.map((o) => {
    const p = pulse(o);
    spin.add(p.mesh);
    return p;
  });
  const arc = arcs(offices[0], offices);
  spin.add(arc.group);

  // ---------- Size ----------
  let w = 1;
  let h = 1;
  const resize = () => {
    w = host.clientWidth || 1;
    h = host.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = w / h < 1 ? 11.5 : 10;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(host);

  // ---------- Rotation: auto-turn, drag with inertia, fly-to ----------
  // Open centred between Midrand and the northern offices (Dubai, Hyderabad),
  // so all three face the viewer.
  const OPEN = { lat: 16, lon: 52 };
  const view = { y: -(OPEN.lon + 90 + 40) * D2R, x: 0.25 };
  const target = { y: -(OPEN.lon + 90) * D2R, x: OPEN.lat * D2R };
  let vel = 0;
  let dragging = false;
  let flying = true; // the opening: the globe turns to the head office
  let hold = 0;
  let last = { x: 0, y: 0 };

  const centre = (lat, lon) => {
    const want = -(lon + 90) * D2R;
    let dy = (want - target.y) % (Math.PI * 2);
    if (dy > Math.PI) dy -= Math.PI * 2;
    if (dy < -Math.PI) dy += Math.PI * 2;
    target.y += dy;
    target.x = clamp(lat * D2R, -0.9, 0.9);
    flying = true;
    vel = 0;
  };

  const onDown = (e) => {
    dragging = true;
    flying = false;
    last = { x: e.clientX, y: e.clientY };
    canvas.setPointerCapture?.(e.pointerId);
    canvas.style.cursor = 'grabbing';
  };
  const onMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - last.x;
    const dy = e.clientY - last.y;
    last = { x: e.clientX, y: e.clientY };
    target.y += dx * 0.005;
    target.x = clamp(target.x + dy * 0.004, -0.9, 0.9);
    vel = dx * 0.005;
  };
  const onUp = (e) => {
    dragging = false;
    hold = performance.now();
    canvas.releasePointerCapture?.(e.pointerId);
    canvas.style.cursor = '';
  };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);

  // ---------- Loop ----------
  const clock = new Clock();
  let elapsed = 0;
  let raf = 0;
  let visible = true;
  let hovered = null;
  let active = null;
  let ready = 0;
  const started = performance.now();
  const tmp = new Vector3();
  const nrm = new Vector3();
  const toCam = new Vector3();

  const frame = () => {
    raf = requestAnimationFrame(frame);
    if (!visible || document.hidden) {
      clock.getDelta();
      return;
    }
    const dt = Math.min(clock.getDelta(), 0.05);
    elapsed += dt;
    const intro = clamp((performance.now() - started) / 1800, 0, 1);
    if (loaded === 3) ready = Math.min(1, ready + dt * 1.2);

    const idle = !dragging && !flying && !hovered && performance.now() - hold > 1500;
    if (!dragging && !flying) {
      target.y += vel;
      vel *= 0.93;
      if (idle) target.y += dt * 0.14;
    }
    const k = 1 - Math.exp(-dt * (flying ? 1.8 : 6));
    view.y += (target.y - view.y) * k;
    view.x += (target.x - view.x) * k;
    if (flying && Math.abs(target.y - view.y) < 0.002 && Math.abs(target.x - view.x) < 0.002) {
      flying = false;
      hold = performance.now();
    }
    spin.rotation.y = view.y;
    tilt.rotation.x = view.x;
    scene.updateMatrixWorld();

    shared.uTime.value = elapsed;
    shared.uReady.value = ready;
    shared.uIntro.value = 0.15 + 0.85 * intro;
    const arcIntro = clamp((elapsed - 1.6) / 1.6, 0, 1);
    arc.mats.forEach((m) => {
      m.uniforms.uTime.value = elapsed;
      m.uniforms.uIntro.value = arcIntro;
    });

    pulses.forEach((p) => {
      const id = p.office.id;
      const isOn = id === hovered || id === active;
      p.on += ((isOn ? 1 : 0) - p.on) * Math.min(1, dt * 6);
      p.mat.uniforms.uT.value = (p.mat.uniforms.uT.value + dt * 0.55) % 1;
      p.mat.uniforms.uOn.value = p.on;
      p.mat.uniforms.uIntro.value = ready;

      const el = markers[id];
      if (!el) return;
      p.mesh.getWorldPosition(tmp);
      nrm.copy(tmp).normalize();
      toCam.copy(camera.position).sub(tmp).normalize();
      const facing = nrm.dot(toCam);
      tmp.project(camera);
      const x = (tmp.x * 0.5 + 0.5) * w;
      const y = (-tmp.y * 0.5 + 0.5) * h;
      // Marks fade as they turn towards the limb and vanish behind the globe.
      const fade = clamp((facing - 0.08) / 0.3, 0, 1) * ready;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${(0.7 + 0.3 * fade + p.on * 0.2).toFixed(3)})`;
      el.style.opacity = fade.toFixed(3);
      el.style.visibility = fade < 0.02 ? 'hidden' : 'visible';
    });

    if (compiled) renderer.render(scene, camera);
  };
  let compiled = false;
  renderer.compileAsync(scene, camera).catch(() => {}).finally(() => { compiled = true; });
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
  io.observe(host);
  raf = requestAnimationFrame(frame);

  return {
    focus(id) {
      const o = offices.find((x) => x.id === id);
      active = id;
      if (o) centre(o.approx.lat, o.approx.lon);
    },
    hover(id) {
      hovered = id;
    },
    dispose() {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      scene.traverse((o) => {
        o.geometry?.dispose();
        o.material?.dispose?.();
      });
      textures.forEach((t) => t.dispose());
      renderer.dispose();
      canvas.remove();
    },
  };
}

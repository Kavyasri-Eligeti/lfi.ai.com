import * as THREE from 'three';
import gsap from 'gsap';
import { PROFILES } from './profiles';
import { createRenderPipeline } from './renderer';
import { createEmblem } from './emblem';
import { createAIPlanet, createWorld, createConstellation } from './planets';
import { createStarfield, createNebula } from './starfield';
import { createTrailMaterial, releaseGlowTexture } from './materials';
import { CameraRig, framePose } from './cameraRig';
import { disposeObject } from './dispose';
import { DURATION } from '../../motion/tokens';

const V = (x, y, z) => new THREE.Vector3(x, y, z);

// Yields to the main thread between construction stages, so that building the
// scene never forms one long task (protects INP on slower devices).
const yieldToMain = () =>
  window.scheduler?.yield ? window.scheduler.yield() : new Promise((resolve) => setTimeout(resolve, 0));

// Label groups visible for each home-page chapter (index = chapter).
const CHAPTER_GROUPS = [['ai'], ['solutions'], ['services'], ['industries'], []];

/**
 * createUniverse: the AI universe scene.
 *
 * @param {object}   opts
 * @param {HTMLCanvasElement} opts.canvas
 * @param {HTMLElement}       opts.container  element whose size the canvas fills
 * @param {string}   opts.profile      'high' | 'balanced' | 'light'
 * @param {object}   opts.content      { planets, worlds }
 * @param {function} opts.onSelect     (entry) => void: a pickable object was clicked
 * @param {function} opts.onContextLost
 * @param {function} opts.onProfileChange  (info) => void: the governor stepped quality down
 */
export async function createUniverse({ canvas, container, profile: profileName, content, onSelect, onContextLost, onProfileChange }) {
  const profile = PROFILES[profileName];
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1400);
  camera.position.set(0, 14, 44);

  let width = Math.max(1, container.clientWidth);
  let height = Math.max(1, container.clientHeight);
  let portrait = width / height < 0.85;

  const pipeline = createRenderPipeline(canvas, profile);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  pipeline.init(scene, camera, width, height);

  // Lights for standard materials (moons, satellites); the core is the "sun".
  scene.add(new THREE.PointLight('#ffd9a0', 2.4, 0, 0));
  scene.add(new THREE.HemisphereLight('#4f6fbf', '#0a0f1f', 0.45));

  await yieldToMain();

  // Backdrop
  if (profile.nebula) scene.add(createNebula());
  const stars = createStarfield(profile.stars);
  scene.add(stars.object);

  // Emblem
  const emblem = createEmblem(profile);
  scene.add(emblem.group);
  await yieldToMain();

  // AI planets (compressed orbits on portrait screens = dedicated mobile arrangement)
  const orbitScale = portrait ? 0.62 : 1;
  const planets = [];
  for (const def of content.planets) {
    const planet = createAIPlanet(def, profile, { orbitScale });
    scene.add(planet.root);
    planets.push(planet);
    await yieldToMain(); // eslint-disable-line no-await-in-loop
  }
  const planetById = Object.fromEntries(planets.map((p) => [p.id, p]));

  // Outer worlds + constellation
  const solutions = createWorld(content.worlds.solutions, profile);
  const services = createWorld(content.worlds.services, profile);
  const constellationTrail = createTrailMaterial('#5d86ff', '#ffd600', 0.8);
  const industries = createConstellation(content.worlds.industries, constellationTrail);
  scene.add(solutions.root, services.root, industries.root);
  await yieldToMain();

  // ---------- Label anchors ----------
  const anchors = [];
  const addAnchor = (id, group, getPos, radius, extra = {}) => anchors.push({ id, group, getPos, radius, el: null, visible: false, ...extra });
  planets.forEach((p) => {
    addAnchor(p.id, 'ai', (o) => p.getWorldPosition(o), p.radius, { kind: 'planet', planetId: p.id });
    p.moons.forEach((m) => addAnchor(m.id, `moons:${p.id}`, (o) => m.mesh.getWorldPosition(o), m.radius, { kind: 'moon' }));
  });
  [solutions, services].forEach((w) =>
    w.satellites.forEach((s) =>
      addAnchor(`${w.id}:${s.id}`, w.id, (o) => s.mesh.getWorldPosition(o), s.radius, { kind: 'link', href: s.href, world: w })
    )
  );
  industries.stars.forEach((s) =>
    addAnchor(`industries:${s.id}`, 'industries', (o) => s.mesh.getWorldPosition(o), s.radius, { kind: 'link', href: s.href })
  );
  const anchorById = Object.fromEntries(anchors.map((a) => [a.id, a]));

  // Pickables for canvas raycasting
  const pickables = [
    ...planets.map((p) => ({ mesh: p.pickMesh, anchor: anchorById[p.id] })),
    ...solutions.satellites.map((s) => ({ mesh: s.mesh, anchor: anchorById[`solutions:${s.id}`] })),
    ...services.satellites.map((s) => ({ mesh: s.mesh, anchor: anchorById[`services:${s.id}`] })),
    ...industries.stars.map((s) => ({ mesh: s.mesh, anchor: anchorById[`industries:${s.id}`] })),
  ];

  // ---------- Camera choreography ----------
  const rig = new CameraRig(camera);
  let chapterPoses = [];
  let chapterCurve = null;

  function computeChapterPoses() {
    const S = V(...content.worlds.solutions.position);
    const R = V(...content.worlds.services.position);
    const I = V(...content.worlds.industries.position);
    const O = V(0, 0, 0);
    chapterPoses = portrait
      ? [
          framePose(O, V(0, 27, 27), 0, 8.5),
          framePose(S, V(6, 5, 21), 0, 4.2),
          framePose(R, V(-6, 6, 23), 0, 4.6),
          framePose(I, V(0, -1, 36), 0, 5),
          framePose(I, V(0, 24, 52), 0, 0),
        ]
      : [
          framePose(O, V(0, 10, 31), 9.5, 0),
          framePose(S, V(8, 3, 15), 5, 0),
          framePose(R, V(-9, 4, 16), -5.5, 0),
          framePose(I, V(0, -1, 29), 5, 0),
          framePose(I, V(0, 20, 44), 0, 0),
        ];
    chapterCurve = new THREE.CatmullRomCurve3(chapterPoses.map((p) => p.pos), false, 'centripetal');
  }
  computeChapterPoses();

  let scrollTarget = 0;
  let scrollValue = 0;
  const scrollPose = { pos: new THREE.Vector3(), target: new THREE.Vector3() };
  const smoother = (x) => x * x * x * (x * (x * 6 - 15) + 10);

  function poseAtProgress(p) {
    const n = chapterPoses.length - 1;
    const clamped = Math.min(Math.max(p, 0), n);
    const i = Math.min(Math.floor(clamped), n - 1);
    const f = smoother(clamped - i);
    chapterCurve.getPoint((i + f) / n, scrollPose.pos);
    scrollPose.target.lerpVectors(chapterPoses[i].target, chapterPoses[i + 1].target, f);
    return scrollPose;
  }
  const scrollGoal = () => poseAtProgress(scrollValue);

  const focusPose = { pos: new THREE.Vector3(), target: new THREE.Vector3() };
  const tmp = new THREE.Vector3();
  const UP = new THREE.Vector3(0, 1, 0);
  function focusGoal(planet) {
    return () => {
      const pp = planet.getWorldPosition(tmp);
      const dirOut = pp.clone().normalize();
      const side = new THREE.Vector3().crossVectors(UP, dirOut).normalize();
      const dist = planet.radius * (portrait ? 7.5 : 5.6) + 2.2;
      focusPose.pos
        .copy(pp)
        .addScaledVector(side, dist * 0.82)
        .addScaledVector(dirOut, -dist * 0.42)
        .addScaledVector(UP, dist * 0.3);
      return framePose(pp, focusPose.pos.clone().sub(pp), portrait ? 0 : planet.radius * 1.6, portrait ? planet.radius * 1.7 : 0, focusPose);
    };
  }

  let mode = { type: 'scroll' };
  let activeGroups = new Set(['ai']);
  let orbitFactor = 1;
  let orbitFactorTarget = 1;

  function setMode(next, { immediate = false } = {}) {
    mode = next;
    if (next.type === 'focus' && planetById[next.planetId]) {
      orbitFactorTarget = 0.12;
      rig.setGoal(focusGoal(planetById[next.planetId]), { duration: DURATION.camera, immediate, arc: immediate ? 0 : 2.5 });
    } else {
      mode = { type: 'scroll' };
      orbitFactorTarget = 1;
      rig.setGoal(scrollGoal, { duration: DURATION.camera * 0.8, immediate });
    }
  }

  function updateActiveGroups() {
    if (mode.type === 'focus') {
      activeGroups = new Set(['ai', `moons:${mode.planetId}`]);
    } else {
      activeGroups = new Set(CHAPTER_GROUPS[Math.min(Math.round(scrollValue), CHAPTER_GROUPS.length - 1)]);
    }
  }

  // ---------- Labels ----------
  let labelRoot = null;
  function bindLabels(root) {
    labelRoot = root;
    anchors.forEach((a) => {
      a.el = root ? root.querySelector(`[data-label-id="${CSS.escape(a.id)}"]`) : null;
      a.visible = null;
    });
  }

  const proj = new THREE.Vector3();
  const wp = new THREE.Vector3();
  function updateLabels() {
    if (!labelRoot) return;
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    for (let i = 0; i < anchors.length; i++) {
      const a = anchors[i];
      if (!a.el) continue;
      let show = activeGroups.has(a.group);
      if (show) {
        a.getPos(wp);
        proj.copy(wp).project(camera);
        show = proj.z < 1 && Math.abs(proj.x) < 1.05 && Math.abs(proj.y) < 1.05;
        if (show) {
          const dist = camera.position.distanceTo(wp);
          const pxR = (a.radius / (dist * tanHalf)) * (height / 2);
          const x = (proj.x * 0.5 + 0.5) * width;
          const y = (-proj.y * 0.5 + 0.5) * height + pxR + 6;
          a.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translateX(-50%)`;
        }
      }
      if (show !== a.visible) {
        a.visible = show;
        a.el.dataset.visible = show ? 'true' : 'false';
        a.el.setAttribute('aria-hidden', show ? 'false' : 'true');
        if (a.kind !== 'moon') a.el.tabIndex = show ? 0 : -1;
      }
    }
  }

  let hoveredId = null;
  function setHover(id) {
    if (hoveredId === id) return;
    const prev = hoveredId && anchorById[hoveredId];
    if (prev?.planetId) planetById[prev.planetId].setHover(false);
    if (prev?.world) prev.world.pause(false);
    if (prev?.el) delete prev.el.dataset.hover;
    hoveredId = id;
    const next = id && anchorById[id];
    if (next?.planetId) planetById[next.planetId].setHover(true);
    if (next?.world) next.world.pause(true);
    if (next?.el) next.el.dataset.hover = 'true';
    canvas.style.cursor = next ? 'pointer' : '';
  }

  // ---------- Pointer: parallax + picking ----------
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let pointerDirty = false;
  let downAt = null;

  function onPointerMove(e) {
    const rect = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    rig.setPointer(ndc.x, ndc.y);
    pointerDirty = e.pointerType === 'mouse';
  }
  function pick() {
    raycaster.setFromCamera(ndc, camera);
    const candidates = pickables.filter((p) => activeGroups.has(p.anchor.group));
    const hit = raycaster.intersectObjects(candidates.map((c) => c.mesh), false)[0];
    return hit ? candidates.find((c) => c.mesh === hit.object).anchor : null;
  }
  function onPointerDown(e) {
    downAt = { x: e.clientX, y: e.clientY };
  }
  function onPointerUp(e) {
    if (!downAt) return;
    const moved = Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y);
    downAt = null;
    if (moved > 6) return;
    onPointerMove(e);
    const anchor = pick();
    if (anchor) onSelect?.(anchor);
  }
  function onPointerLeave() {
    rig.setPointer(0, 0);
    setHover(null);
  }
  canvas.addEventListener('pointermove', onPointerMove, { passive: true });
  canvas.addEventListener('pointerdown', onPointerDown, { passive: true });
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointerleave', onPointerLeave, { passive: true });

  // ---------- Context loss ----------
  function onLost(e) {
    e.preventDefault();
    stop();
    onContextLost?.();
  }
  canvas.addEventListener('webglcontextlost', onLost);

  // ---------- Resize ----------
  const resizeObserver = new ResizeObserver(() => {
    const w = Math.max(1, container.clientWidth);
    const h = Math.max(1, container.clientHeight);
    if (w === width && h === height) return;
    width = w;
    height = h;
    const wasPortrait = portrait;
    portrait = width / height < 0.85;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    pipeline.setSize(width, height);
    computeChapterPoses();
    if (wasPortrait !== portrait) setMode(mode, { immediate: true });
  });
  resizeObserver.observe(container);

  // ---------- Performance governor ----------
  // Steps quality down (never up, to avoid oscillation) when the average frame
  // time over a 2 s window exceeds ~42 fps.
  const governor = { acc: 0, frames: 0, warmup: 2.5, fps: 60 };
  function govern(dt) {
    if (governor.warmup > 0) {
      governor.warmup -= dt;
      return;
    }
    governor.acc += dt;
    governor.frames += 1;
    if (governor.acc < 2) return;
    const avg = governor.acc / governor.frames;
    governor.fps = 1 / avg;
    governor.acc = 0;
    governor.frames = 0;
    if (avg <= 1 / 42) return;
    if (pipeline.dpr > 1.01) {
      pipeline.setDpr(Math.max(1, pipeline.dpr - 0.25));
      onProfileChange?.({ reason: 'dpr', dpr: pipeline.dpr });
    } else if (pipeline.bloom) {
      pipeline.disableBloom();
      onProfileChange?.({ reason: 'bloom-off' });
    }
  }

  // ---------- Loop ----------
  const clock = new THREE.Clock(false);
  let raf = 0;
  let running = false;
  let active = true;
  let time = 0;

  // LIGHT profile renders at 30 fps: half the CPU/GPU and battery cost on phones.
  const minFrame = profile.name === 'light' ? 1 / 31 : 0;
  let pending = 0;

  function frame() {
    raf = requestAnimationFrame(frame);
    pending += clock.getDelta();
    if (pending < minFrame) return;
    const dt = Math.min(pending, 0.05);
    pending = 0;
    time += dt;

    scrollValue += (scrollTarget - scrollValue) * (1 - Math.exp(-dt * 4.5));
    orbitFactor += (orbitFactorTarget - orbitFactor) * (1 - Math.exp(-dt * 2));
    updateActiveGroups();

    emblem.update(time, dt, camera);
    planets.forEach((p) => p.update(time, dt, orbitFactor));
    solutions.update(time, dt);
    services.update(time, dt);
    industries.update(time, dt);
    constellationTrail.uniforms.uTime.value = time;
    stars.update(time, pipeline.dpr);

    rig.update(dt, { parallax: profile.parallax });

    if (pointerDirty) {
      pointerDirty = false;
      const anchor = pick();
      setHover(anchor ? anchor.id : null);
    }

    updateLabels();
    pipeline.render();
    govern(dt);
  }

  function start() {
    if (running || !active || document.hidden) return;
    running = true;
    clock.start();
    clock.getDelta();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
    clock.stop();
  }
  function onVisibility() {
    if (document.hidden) stop();
    else start();
  }
  document.addEventListener('visibilitychange', onVisibility);

  // Intro: the emblem and planets settle in (skipped for deep links).
  function intro() {
    emblem.group.scale.setScalar(0.6);
    gsap.to(emblem.group.scale, { x: 1, y: 1, z: 1, duration: 2.2, ease: 'power3.out' });
  }

  return {
    start,
    stop,
    intro,
    async warm() {
      try {
        await pipeline.renderer.compileAsync(scene, camera);
      } catch {
        /* older drivers: shaders compile on first render instead */
      }
    },
    setMode,
    bindLabels,
    setHover,
    setScrollProgress(p, { immediate = false } = {}) {
      scrollTarget = p;
      if (immediate) scrollValue = p;
    },
    setActive(next) {
      active = next;
      if (active) start();
      else stop();
    },
    getStats() {
      const info = pipeline.renderer.info;
      return {
        profile: profile.name,
        fps: Math.round(governor.fps),
        dpr: pipeline.dpr,
        bloom: pipeline.bloom,
        calls: info.render.calls,
        triangles: info.render.triangles,
        geometries: info.memory.geometries,
        textures: info.memory.textures,
      };
    },
    dispose() {
      stop();
      rig.dispose();
      gsap.killTweensOf(emblem.group.scale);
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('webglcontextlost', onLost);
      disposeObject(scene);
      releaseGlowTexture();
      pipeline.dispose();
      pipeline.renderer.forceContextLoss();
    },
  };
}

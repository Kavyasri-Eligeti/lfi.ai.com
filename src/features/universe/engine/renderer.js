import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

// Renderer + optional bloom pipeline, sized by the rendering profile.
// Adaptive pixel ratio: `setDpr` is used by the performance governor.
export function createRenderPipeline(canvas, profile, { bloom = profile.bloom } = {}) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !bloom,
    alpha: false,
    powerPreference: profile.name === 'high' ? 'high-performance' : 'default',
    stencil: false,
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  // Shader error checks force a synchronous GPU round-trip per program (long
  // main-thread stalls). Keep them for development only.
  renderer.debug.checkShaderErrors = process.env.NODE_ENV !== 'production';
  renderer.setClearColor(0x03050d, 1);

  let dpr = Math.min(window.devicePixelRatio || 1, profile.maxDpr);
  renderer.setPixelRatio(dpr);

  let composer = null;
  let bloomPass = null;
  let bloomEnabled = bloom;

  const buildComposer = (scene, camera, width, height) => {
    if (!bloomEnabled) return;
    const target = new THREE.WebGLRenderTarget(1, 1, {
      type: THREE.HalfFloatType,
      samples: profile.msaa || 0,
    });
    composer = new EffectComposer(renderer, target);
    composer.addPass(new RenderPass(scene, camera));
    bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 0.62, 0.55, 0.82);
    const scale = profile.bloomScale || 1;
    const setBloomSize = bloomPass.setSize.bind(bloomPass);
    bloomPass.setSize = (w, h) => setBloomSize(Math.max(2, Math.round(w * scale)), Math.max(2, Math.round(h * scale)));
    composer.addPass(bloomPass);
    composer.addPass(new OutputPass());
    composer.setPixelRatio(dpr);
    composer.setSize(width, height);
  };

  return {
    renderer,
    init(scene, camera, width, height) {
      this.scene = scene;
      this.camera = camera;
      renderer.setSize(width, height, false);
      buildComposer(scene, camera, width, height);
    },
    setSize(width, height) {
      renderer.setSize(width, height, false);
      composer?.setSize(width, height);
    },
    setDpr(next) {
      dpr = next;
      renderer.setPixelRatio(dpr);
      composer?.setPixelRatio(dpr);
      const size = renderer.getSize(new THREE.Vector2());
      composer?.setSize(size.x, size.y);
    },
    get dpr() {
      return dpr;
    },
    get bloom() {
      return Boolean(composer);
    },
    disableBloom() {
      if (!composer) return;
      composer.dispose();
      bloomPass?.dispose();
      composer = null;
      bloomPass = null;
      bloomEnabled = false;
    },
    render() {
      if (composer) composer.render();
      else renderer.render(this.scene, this.camera);
    },
    dispose() {
      composer?.dispose();
      bloomPass?.dispose();
      renderer.dispose();
    },
  };
}

import * as THREE from 'three';
import gsap from 'gsap';

const UP = new THREE.Vector3(0, 1, 0);

/**
 * Camera rig with interruption-safe transitions.
 *
 * A "goal" is a function returning a live pose { pos, target }. It is live
 * because the goal may move (orbiting planets, scroll progress). Each
 * transition captures the current pose as `from` and tweens a 0→1 blend
 * towards the live goal with GSAP (overwrite: true). A new navigation
 * therefore retargets smoothly from wherever the camera is, and never
 * queues or fights a previous tween.
 */
export class CameraRig {
  constructor(camera) {
    this.camera = camera;
    this.pos = camera.position.clone();
    this.target = new THREE.Vector3();
    this.from = { pos: new THREE.Vector3(), target: new THREE.Vector3() };
    this.state = { blend: 1 };
    this.arc = 0;
    this.goal = () => ({ pos: this.pos, target: this.target });
    this.parallax = new THREE.Vector2();
    this.parallaxTarget = new THREE.Vector2();
    this._p = new THREE.Vector3();
    this._t = new THREE.Vector3();
    this._right = new THREE.Vector3();
    this._fwd = new THREE.Vector3();
  }

  setGoal(goal, { duration = 2, immediate = false, arc = 0, ease = 'power2.inOut' } = {}) {
    this.from.pos.copy(this.pos);
    this.from.target.copy(this.target);
    this.goal = goal;
    this.arc = arc;
    gsap.killTweensOf(this.state);
    if (immediate || duration <= 0) {
      this.state.blend = 1;
      const g = goal();
      this.pos.copy(g.pos);
      this.target.copy(g.target);
      return;
    }
    this.state.blend = 0;
    gsap.to(this.state, { blend: 1, duration, ease, overwrite: true });
  }

  setPointer(x, y) {
    this.parallaxTarget.set(x, y);
  }

  update(dt, { damping = 7, parallax = true } = {}) {
    const g = this.goal();
    const b = this.state.blend;
    this._p.lerpVectors(this.from.pos, g.pos, b);
    this._t.lerpVectors(this.from.target, g.target, b);
    if (this.arc) this._p.addScaledVector(UP, Math.sin(Math.PI * b) * this.arc);

    const k = 1 - Math.exp(-dt * damping);
    this.pos.lerp(this._p, b >= 1 ? k : 1);
    this.target.lerp(this._t, b >= 1 ? k : 1);

    this.parallax.lerp(parallax ? this.parallaxTarget : this.parallax.set(0, 0), 1 - Math.exp(-dt * 3));
    this.camera.position.copy(this.pos);
    if (parallax) {
      this._fwd.subVectors(this.target, this.pos).normalize();
      this._right.crossVectors(this._fwd, UP).normalize();
      this.camera.position.addScaledVector(this._right, this.parallax.x * 0.6);
      this.camera.position.addScaledVector(UP, this.parallax.y * 0.35);
    }
    this.camera.lookAt(this.target);
  }

  dispose() {
    gsap.killTweensOf(this.state);
  }
}

/**
 * Frames `center` from `center + offset`, shifting the look target so that
 * the subject appears `shiftRight` world units right of (and `shiftUp` above)
 * the screen centre. This leaves room for the text panel.
 */
export function framePose(center, offset, shiftRight = 0, shiftUp = 0, out = { pos: new THREE.Vector3(), target: new THREE.Vector3() }) {
  out.pos.copy(center).add(offset);
  const fwd = new THREE.Vector3().subVectors(center, out.pos).normalize();
  const right = new THREE.Vector3().crossVectors(fwd, UP).normalize();
  const up = new THREE.Vector3().crossVectors(right, fwd).normalize();
  out.target.copy(center).addScaledVector(right, -shiftRight).addScaledVector(up, -shiftUp);
  return out;
}

/* Idle drift: when nobody is touching the globe it turns slowly on its
   own, side to side across the work and gently up and down through the
   rows around the middle, turning round softly before each edge. Any scroll, drag or
   tile hover hands control straight back to the visitor. */

const IDLE_MS = 2600;
const SPIN_RATE = 0.04; // rad / s
const TILT_RATE = 0.012; // rad / s
/** How quickly the drift reaches (or leaves) its cruising speed, per s. */
const DRIFT_EASE = 0.7;
/** Share of the spin range at which the drift turns round. */
const TURN_AT = 0.85;
/** Keep the vertical drift this far inside the stops… */
const TILT_EDGE_MARGIN = 0.08;
/** …and within this much of the resting tilt, either way. */
const TILT_DRIFT_RANGE = 0.18;

/** Read on every step, so a caller may update `tiltRest` (e.g. on resize). */
export type DriftBounds = { spin: number; tiltMin: number; tiltMax: number; tiltRest: number };

export type Autopilot = {
  /** The visitor did something: stop drifting and wait for idle again. */
  touch: () => void;
  /** Next spin and tilt; `held` pauses the drift (e.g. a tile is hovered). */
  step: (dt: number, now: number, spin: number, tilt: number, held: boolean) => { spin: number; tilt: number };
};

export function createAutopilot(bounds: DriftBounds, reducedMotion: boolean): Autopilot {
  let lastInput = performance.now();
  let spinVel = 0;
  let tiltVel = 0;
  let spinDir = 1;
  let tiltDir = -1;

  return {
    touch: () => {
      lastInput = performance.now();
      spinVel = 0;
      tiltVel = 0;
    },
    step: (dt, now, spin, tilt, held) => {
      const cruising = !reducedMotion && !held && now - lastInput > IDLE_MS;
      const tiltLow = Math.max(bounds.tiltMin + TILT_EDGE_MARGIN, bounds.tiltRest - TILT_DRIFT_RANGE);
      const tiltHigh = Math.min(bounds.tiltMax - TILT_EDGE_MARGIN, bounds.tiltRest + TILT_DRIFT_RANGE);
      if (spin > bounds.spin * TURN_AT) spinDir = -1;
      else if (spin < -bounds.spin * TURN_AT) spinDir = 1;
      if (tilt > tiltHigh) tiltDir = -1;
      else if (tilt < tiltLow) tiltDir = 1;
      const k = 1 - Math.exp(-dt * DRIFT_EASE);
      spinVel += ((cruising ? spinDir * SPIN_RATE : 0) - spinVel) * k;
      tiltVel += ((cruising ? tiltDir * TILT_RATE : 0) - tiltVel) * k;
      return { spin: spin + spinVel * dt, tilt: tilt + tiltVel * dt };
    },
  };
}

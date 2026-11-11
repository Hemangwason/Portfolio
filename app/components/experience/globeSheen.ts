import * as THREE from "three";

/* Light on the globe's surface, in two forms:
   - the sheen: a soft band of iridescent light that washes across the
     globe when it is scrolled or dragged. It travels the way the surface
     moves, fades in and out over one pass, and rests between passes so
     steady scrolling doesn't turn into constant shimmer;
   - the cursor light: the grid lines near the pointer light up in the
     gradient, trailing it slightly and fading when it leaves. */

const SHEEN_MS = 1300;
const SHEEN_COOLDOWN_MS = 350;
/** Band centre starts and ends this far off-screen (NDC units). */
const SHEEN_TRAVEL = 1.7;
/** Scroll / drag travel (px) needed before a pass starts. */
export const SHEEN_TRIGGER_PX = 70;
/** Gesture travel resets after this long without input. */
export const SHEEN_GESTURE_GAP_MS = 260;
/** How quickly the cursor light follows the pointer, and fades, per s. */
const CURSOR_FOLLOW = 9;
const CURSOR_FADE = 4;

export type SheenUniforms = {
  uSheenPos: { value: number };
  uSheenAmp: { value: number };
  uCursor: { value: THREE.Vector2 };
  uCursorAmp: { value: number };
  uAspect: { value: number };
};

export type Sheen = {
  uniforms: SheenUniforms;
  /** Start a pass; `dir` +1 sweeps down the screen, -1 sweeps up. */
  kick: (dir: number) => void;
  /** Light the grid at a point in normalised device coords (-1..1). */
  point: (x: number, y: number) => void;
  /** Let the cursor light fade out. */
  release: () => void;
  setAspect: (aspect: number) => void;
  /** Advance the pass and the cursor light. Call once per rendered frame. */
  update: (now: number, dt: number) => void;
};

const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

export function createSheen(reducedMotion: boolean): Sheen {
  const uniforms: SheenUniforms = {
    uSheenPos: { value: -SHEEN_TRAVEL },
    uSheenAmp: { value: 0 },
    uCursor: { value: new THREE.Vector2(0, 0) },
    uCursorAmp: { value: 0 },
    uAspect: { value: 1 },
  };
  const cursorTarget = new THREE.Vector2(0, 0);
  let cursorOn = false;
  let cursorPlaced = false;
  let start = 0;
  let dir = 1;
  let running = false;
  let restUntil = 0;

  return {
    uniforms,
    kick: (next) => {
      if (reducedMotion) return;
      const now = performance.now();
      if (running || now < restUntil) return;
      dir = next >= 0 ? 1 : -1;
      start = now;
      running = true;
    },
    point: (x, y) => {
      cursorTarget.set(x, y);
      if (!cursorPlaced) uniforms.uCursor.value.copy(cursorTarget);
      cursorPlaced = true;
      cursorOn = true;
    },
    release: () => {
      cursorOn = false;
    },
    setAspect: (aspect) => {
      uniforms.uAspect.value = aspect;
    },
    update: (now, dt) => {
      uniforms.uCursor.value.lerp(cursorTarget, 1 - Math.exp(-dt * CURSOR_FOLLOW));
      const amp = uniforms.uCursorAmp.value;
      uniforms.uCursorAmp.value = amp + ((cursorOn ? 1 : 0) - amp) * (1 - Math.exp(-dt * CURSOR_FADE));
      if (!running) return;
      const t = Math.min(1, (now - start) / SHEEN_MS);
      uniforms.uSheenPos.value = dir * SHEEN_TRAVEL * (1 - 2 * easeInOutSine(t));
      uniforms.uSheenAmp.value = Math.sin(Math.PI * t);
      if (t >= 1) {
        running = false;
        uniforms.uSheenAmp.value = 0;
        restUntil = now + SHEEN_COOLDOWN_MS;
      }
    },
  };
}

/* ── GLSL ───────────────────────────────────────────────────────── */

export const SHEEN_VERTEX_PARS = /* glsl */ `
  varying vec2 vScreen;
`;

/** Needs `gl_Position` to be written first. */
export const SHEEN_VERTEX = /* glsl */ `
  vScreen = gl_Position.xy / gl_Position.w;
`;

export const SHEEN_FRAGMENT_PARS = /* glsl */ `
  uniform float uSheenPos;
  uniform float uSheenAmp;
  uniform vec2 uCursor;
  uniform float uCursorAmp;
  uniform float uAspect;
  varying vec2 vScreen;
  const float CURSOR_RADIUS = 0.42;
  float cursorDistance() {
    return length((vScreen - uCursor) * vec2(uAspect, 1.0));
  }
  // A soft pool of light around the pointer (round on screen).
  float cursorGlow() {
    return uCursorAmp * (1.0 - smoothstep(0.0, CURSOR_RADIUS, cursorDistance()));
  }
  // Warm against the cool grid: hot pink at the pointer, orange at the rim.
  vec3 cursorColour() {
    float t = smoothstep(0.0, CURSOR_RADIUS, cursorDistance());
    vec3 srgb = mix(vec3(1.0, 0.27, 0.6), vec3(1.0, 0.56, 0.22), t);
    return pow(srgb, vec3(2.2));
  }
  // A slightly diagonal band across the screen.
  float sheenBand() {
    float coord = vScreen.y + 0.22 * vScreen.x;
    float d = (coord - uSheenPos) / 0.38;
    return uSheenAmp * exp(-d * d);
  }
  // Pink → violet → sky across the screen (or reversed).
  vec3 sheenColour(float flip) {
    float x = clamp(0.5 + 0.5 * vScreen.x * flip, 0.0, 1.0);
    vec3 a = vec3(1.0, 0.42, 0.68);
    vec3 b = vec3(0.6, 0.48, 1.0);
    vec3 c = vec3(0.3, 0.68, 1.0);
    vec3 srgb = x < 0.5 ? mix(a, b, x * 2.0) : mix(b, c, x * 2.0 - 1.0);
    return pow(srgb, vec3(2.2)); // the renderer works in linear light
  }
`;

/** Share one set of light uniforms with a material's own uniforms. */
export function withSheen(
  material: THREE.ShaderMaterial,
  uniforms: SheenUniforms,
): THREE.ShaderMaterial {
  material.uniforms.uSheenPos = uniforms.uSheenPos;
  material.uniforms.uSheenAmp = uniforms.uSheenAmp;
  material.uniforms.uCursor = uniforms.uCursor;
  material.uniforms.uCursorAmp = uniforms.uCursorAmp;
  material.uniforms.uAspect = uniforms.uAspect;
  return material;
}

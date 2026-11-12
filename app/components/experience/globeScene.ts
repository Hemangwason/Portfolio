import * as THREE from "three";
import { DEG, LAT_CELL, LON_CELL, R, gridLines, pearlMaterial, sphericalPoint } from "./globeSurface";
import { createAutopilot } from "./globeAutopilot";
import { createSheen, SHEEN_GESTURE_GAP_MS, SHEEN_TRIGGER_PX } from "./globeSheen";

export type GlobeTile = { id: string; still: string; aspect: number; loop?: string };

export type GlobeOptions = {
  background: string;
  lineColor: string;
  reducedMotion: boolean;
  onSelect: (id: string) => void;
  onFrame: (tiltDeg: number, spinDeg: number) => void;
  onReady: () => void;
};

export type GlobeHandle = {
  setActive: (active: boolean) => void;
  /** Arrival: fly from the floating globe into the close-up view. */
  enter: () => void;
  /** Camera dives onto the tile for `id`; with `target` (client px) the
      tile lands exactly on that rect — the project's first frame. */
  flyIn: (id: string, target?: DOMRect) => Promise<void>;
  /** Camera pulls back out to the resting view of the globe. */
  flyOut: () => Promise<void>;
  dispose: () => void;
};


/* ── layout: every project exactly once ──────────────────────────
   17 tiles in four rows (4·4·5·4), laid out on the grid like Griflan's:
   every tile is three grid cells tall, rows sit on the grid lines, and
   there are two empty cells between rows and between neighbouring
   tiles, so each piece has room to itself. Slots are ranked by how
   central they sit in the resting view and handed out in `tiles` order,
   so the first tiles land in the middle and the last ones (product
   work) at the ends of the rows. Spin and tilt stop hard at the edge of
   the work, so the empty back of the globe never comes round. */
const GAP_CELLS = 2;
/** Three cells tall: big enough to read each preview without zooming. */
const TILE_CELLS_TALL = 3;
const TILE_HEIGHT_DEG = TILE_CELLS_TALL * LAT_CELL;
/** Gap between neighbouring tiles, in longitude. */
const TILE_GAP_LON = GAP_CELLS * LON_CELL;
const ROW_PITCH = (TILE_CELLS_TALL + GAP_CELLS) * LAT_CELL;
/** This row's band starts on the equator line. */
const CENTRE_ROW_LAT = TILE_HEIGHT_DEG / 2;
/* Top to bottom. The five-tile row is the one the resting view centres
   on, with one row above and one below it hidden until you scroll. */
const ROWS: Array<{ lat: number; count: number }> = [
  { lat: CENTRE_ROW_LAT + ROW_PITCH, count: 4 },
  { lat: CENTRE_ROW_LAT, count: 4 },
  { lat: CENTRE_ROW_LAT - ROW_PITCH, count: 5 },
  { lat: CENTRE_ROW_LAT - 2 * ROW_PITCH, count: 4 },
];
/** Only used to rank slots by centrality. */
const LON_PITCH = 20;
const TILE_RADIUS = R * 1.002;
/** Where the eye lands at rest — between the five-tile row and the one
    above it, the two rows on screen — so slots nearest it rank first. */
const FOCUS_LAT = -4;
const FOCUS_LAT_WEIGHT = 1.3;
/** The layout the spin and tilt stops were tuned on: row half-width
    and the top / bottom edges of the work (degrees). */
const REFERENCE_EXTENT_DEG = 58.5;
const REFERENCE_TOP_DEG = 27.25;
const REFERENCE_BOTTOM_DEG = -13.25;
/** Extra roll at the bottom stop so the last row clears the ticker. */
const BOTTOM_ROW_CLEARANCE = 0.08;

/* ── camera: close in, Griflan-style — horizon under the header,
   the sphere's sides beyond the frame ─────────────────────────── */
const CAMERA_DISTANCE = 15.5;
const FOV_WIDE = 41; // close in: the globe fills the frame, more of it waits off-screen
const FOV_NARROW = 74; // portrait screens see a wider slice, so tiles stay whole
const HORIZON_MARGIN = 0.95;
/** Outside: the whole globe floating in the frame. */
const OUTSIDE_DISTANCE = 33;
const OUTSIDE_FOV = 40;
const FOG_NEAR = 10;
const FOG_FAR = 22;
const DEPTH_EASE = 1.05; // per second — the fly-in / pull-out pace
/** Wheel travel needed to pull out (at the top edge) or dive back in. */
const PULL_OUT_PX = 240;
const DIVE_IN_PX = 60;

/* ── motion (deliberately calm) ─────────────────────────────────── */
const SPIN_LIMIT = 0.5; // hard stop, rad either side of centre (reference layout)
const TILT_MIN = -0.3; // hard stops (reference layout)
const TILT_MAX = 0.12;
const WHEEL_GAIN = 0.00007; // rad per px of wheel delta
const MAX_TILT_SPEED = 0.02; // rad per frame
const SPEED_DECAY = 0.88;
const DRAG_SPIN = 0.0013;
const DRAG_TILT = 0.0011;
const TOUCH_FACTOR = 0.7;
const STEER_SPIN = 0.06; // cursor parallax, rad at the screen edge
const STEER_TILT = 0.035;
const STEER_EASE = 2.5;
const CLICK_SLOP_PX = 6;
const FILL_RATIO = 0.82;
const FLY_IN_MS = 900;
/** The landing tile starts flattening this far into the dive. */
const FLATTEN_FROM = 0.45;
const FLY_OUT_MS = 850;
const FLIGHT_GRACE_MS = 250;

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

type Placement = { lon: number; lat: number; wDeg: number; hDeg: number };

type Slot = { row: number; k: number; score: number };

/** Slots ranked from most to least central. */
function rankedSlots(): Slot[] {
  const slots: Slot[] = [];
  ROWS.forEach((row, r) => {
    const cos = Math.cos(row.lat * DEG);
    for (let k = 0; k < row.count; k++) {
      const dLon = (k - (row.count - 1) / 2) * LON_PITCH;
      slots.push({ row: r, k, score: Math.abs(dLon) * cos + Math.abs(row.lat - FOCUS_LAT) * FOCUS_LAT_WEIGHT });
    }
  });
  return slots.sort((a, b) => a.score - b.score);
}

/** Each row's tiles, left to right, packed edge to edge with one gap
    and centred on the front of the globe. */
function placements(tiles: GlobeTile[]): Placement[] {
  const slots = rankedSlots();
  const byRow: Array<Array<{ tile: number; k: number }>> = ROWS.map(() => []);
  tiles.forEach((_, i) => {
    const slot = slots[Math.min(i, slots.length - 1)];
    byRow[slot.row].push({ tile: i, k: slot.k });
  });
  const out: Placement[] = new Array(tiles.length);
  byRow.forEach((items, r) => {
    const lat = ROWS[r].lat;
    const cos = Math.cos(lat * DEG);
    const ordered = [...items].sort((a, b) => a.k - b.k);
    const widths = ordered.map(({ tile }) => (TILE_HEIGHT_DEG * tiles[tile].aspect) / cos);
    const gap = TILE_GAP_LON;
    const total = widths.reduce((sum, w) => sum + w, 0) + gap * Math.max(0, ordered.length - 1);
    let left = 90 - total / 2;
    ordered.forEach(({ tile }, j) => {
      out[tile] = { lon: left + widths[j] / 2, lat, wDeg: widths[j], hDeg: TILE_HEIGHT_DEG };
      left += widths[j] + gap;
    });
  });
  return out;
}

/** Latitude (deg, untilted) where a ray leaving the resting camera
    `elevDeg` above horizontal meets the globe, or null if it misses. */
function hitLat(elevDeg: number): number | null {
  const e = elevDeg * DEG;
  const b = CAMERA_DISTANCE * Math.cos(e);
  const disc = b * b - (CAMERA_DISTANCE * CAMERA_DISTANCE - R * R);
  if (disc < 0) return null;
  const t = b - Math.sqrt(disc);
  return Math.asin(clamp((t * Math.sin(e)) / R, -1, 1)) / DEG;
}

/** The resting tilt that leaves as much work out of view above the frame
    as below it, so the view lands in the middle of the projects. The top
    of the frame sees up to the globe's horizon; tilting by θ shifts what
    you see by θ in latitude. */
function restTiltFor(spots: Placement[], fov: number): number {
  const top = Math.max(...spots.map((p) => p.lat + p.hDeg / 2));
  const bottom = Math.min(...spots.map((p) => p.lat - p.hDeg / 2));
  const pitch = Math.asin(R / CAMERA_DISTANCE) / DEG - (fov / 2) * HORIZON_MARGIN;
  const horizon = Math.acos(R / CAMERA_DISTANCE) / DEG;
  const seenTop = Math.min(hitLat(pitch + fov / 2) ?? horizon, horizon);
  const seenBottom = hitLat(pitch - fov / 2) ?? 0;
  return ((top + bottom - (seenTop + seenBottom)) / 2) * DEG;
}

/** Where spin and tilt stop: the work's reach, relative to the layout
    the stops were tuned on. Lower rows need the globe to roll further. */
function limitsFor(spots: Placement[]): { spin: number; tiltMin: number; tiltMax: number } {
  const reach = Math.max(...spots.map((p) => Math.abs(p.lon - 90) + p.wDeg / 2));
  const top = Math.max(...spots.map((p) => p.lat + p.hDeg / 2));
  const bottom = Math.min(...spots.map((p) => p.lat - p.hDeg / 2));
  return {
    spin: clamp(SPIN_LIMIT + (reach - REFERENCE_EXTENT_DEG) * DEG, 0.15, 0.75),
    tiltMin: TILT_MIN - (REFERENCE_BOTTOM_DEG - bottom) * DEG - BOTTOM_ROW_CLEARANCE,
    tiltMax: TILT_MAX - (REFERENCE_TOP_DEG - top) * DEG,
  };
}

/** A curved tile on the sphere, plus a morph target that lays the same
    tile flat on the tangent plane at its centre (same width and height
    in world units). The flat shape is what the project view's first
    frame is, so the match cut morphs into it as the camera lands. */
function tileGeometry(p: Placement): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(
    TILE_RADIUS,
    20,
    12,
    (p.lon - p.wDeg / 2) * DEG,
    p.wDeg * DEG,
    (90 - (p.lat + p.hDeg / 2)) * DEG,
    p.hDeg * DEG,
  );
  const centre = sphericalPoint(p.lon, p.lat, TILE_RADIUS);
  const east = sphericalPoint(p.lon + 0.01, p.lat, TILE_RADIUS).sub(centre).normalize();
  const north = sphericalPoint(p.lon, p.lat + 0.01, TILE_RADIUS).sub(centre).normalize();
  const cos = Math.cos(p.lat * DEG);
  const pos = geo.attributes.position;
  const flat = new Float32Array(pos.count * 3);
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const lat = Math.asin(Math.max(-1, Math.min(1, y / TILE_RADIUS))) / DEG;
    const lon = Math.atan2(z, -x) / DEG;
    let dLon = lon - p.lon;
    dLon = ((dLon + 540) % 360) - 180;
    v.copy(centre)
      .addScaledVector(east, TILE_RADIUS * cos * dLon * DEG)
      .addScaledVector(north, TILE_RADIUS * (lat - p.lat) * DEG);
    flat.set([v.x, v.y, v.z], i * 3);
  }
  geo.morphAttributes.position = [new THREE.Float32BufferAttribute(flat, 3)];
  return geo;
}

export function createGlobe(canvas: HTMLCanvasElement, tiles: GlobeTile[], opts: GlobeOptions): GlobeHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  // Modest devices render at 1.5x — the grid stays crisp, the GPU stays cool.
  const cores = navigator.hardwareConcurrency || 8;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cores <= 4 ? 1.5 : 2));

  const scene = new THREE.Scene();
  const fog = new THREE.Fog(opts.background, FOG_NEAR, FOG_FAR);
  scene.fog = fog;

  const camera = new THREE.PerspectiveCamera(FOV_WIDE, 1, 0.05, 80);
  const restPos = new THREE.Vector3();
  const restTarget = new THREE.Vector3();
  const lookTarget = new THREE.Vector3();
  let baseFov = FOV_WIDE;

  const globe = new THREE.Group();
  scene.add(globe);
  const sheen = createSheen(opts.reducedMotion);
  const core = new THREE.Mesh(new THREE.SphereGeometry(R * 0.996, 96, 64), pearlMaterial(sheen.uniforms));
  globe.add(core);
  globe.add(gridLines(sheen.uniforms));

  /* ── tiles ─────────────────────────────────────────────────── */
  const loader = new THREE.TextureLoader();
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const textures: THREE.Texture[] = [];
  const spots = placements(tiles);
  const limits = limitsFor(spots);
  const spinLimit = limits.spin;
  const tiltMin = limits.tiltMin;
  const tiltMax = limits.tiltMax;
  // The resting tilt depends on the field of view, so it is settled on
  // the first resize (and kept up to date on later ones).
  const drift = { spin: spinLimit, tiltMin, tiltMax, tiltRest: restTiltFor(spots, FOV_WIDE) };
  const autopilot = createAutopilot(drift, opts.reducedMotion);
  let rested = false;
  let loaded = 0;
  const markLoaded = () => {
    loaded++;
    if (loaded === tiles.length) opts.onReady();
  };

  const meshes = tiles.map((t, i) => {
    const mat = new THREE.MeshBasicMaterial({ color: "#2b2626" });
    loader.load(
      t.still,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = maxAniso;
        textures.push(tex);
        mat.map = tex;
        mat.color.set("#ffffff");
        mat.needsUpdate = true;
        markLoaded();
      },
      undefined,
      markLoaded,
    );
    const mesh = new THREE.Mesh(tileGeometry(spots[i]), mat);
    mesh.userData = { index: i, still: mat };
    globe.add(mesh);
    return mesh;
  });

  /* ── hover loop video ──────────────────────────────────────── */
  const video = document.createElement("video");
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = "none";
  const videoTex = new THREE.VideoTexture(video);
  videoTex.colorSpace = THREE.SRGBColorSpace;
  const videoMat = new THREE.MeshBasicMaterial({ map: videoTex });
  let hovered: THREE.Mesh | null = null;
  let videoReady = false;
  video.addEventListener("playing", () => {
    videoReady = true;
  });

  const setHovered = (mesh: THREE.Mesh | null) => {
    if (mesh === hovered) return;
    if (hovered) hovered.material = hovered.userData.still as THREE.Material;
    hovered = mesh;
    videoReady = false;
    if (!mesh) {
      video.pause();
      return;
    }
    const loop = tiles[mesh.userData.index as number]?.loop;
    if (!loop) return;
    video.src = loop;
    video.play().catch(() => {});
  };

  /* ── state ─────────────────────────────────────────────────── */
  let spin = 0;
  let tilt = drift.tiltRest;
  let tiltSpeed = 0;
  let spinSpeed = 0;
  let steerX = 0;
  let steerY = 0;
  let steerTargetX = 0;
  let steerTargetY = 0;
  let depth = 0;
  let depthTarget = 0;
  let active = false;
  let flying = false;
  let parked = false;
  let raf = 0;
  let last = performance.now();
  let picked: THREE.Mesh | null = null;
  let landed: THREE.Mesh | null = null;
  const setFlatness = (mesh: THREE.Mesh, amount: number) => {
    if (mesh.morphTargetInfluences) mesh.morphTargetInfluences[0] = amount;
  };

  const placeRest = () => {
    camera.fov = baseFov;
    const half = (baseFov / 2) * DEG;
    const pitch = Math.asin(R / CAMERA_DISTANCE) - half * HORIZON_MARGIN;
    restPos.set(0, 0, CAMERA_DISTANCE);
    restTarget.set(0, CAMERA_DISTANCE * Math.tan(pitch), 0);
    camera.updateProjectionMatrix();
  };

  /* Depth 0 = outside (the whole globe floating), 1 = inside (the
     close-up surface). The camera blends between the two poses. */
  const outsidePos = new THREE.Vector3(0, 0, OUTSIDE_DISTANCE);
  const outsideTarget = new THREE.Vector3(0, 0, 0);

  const applyRest = () => {
    const k = easeInOutCubic(clamp(depth, 0, 1));
    // Size stays constant while scrolling or dragging — only the depth
    // axis (arrive / pull out) moves the camera in or out.
    camera.fov = OUTSIDE_FOV + (baseFov - OUTSIDE_FOV) * k;
    camera.updateProjectionMatrix();
    camera.position.lerpVectors(outsidePos, restPos, k);
    camera.up.set(0, 1, 0);
    lookTarget.lerpVectors(outsideTarget, restTarget, k);
    camera.lookAt(lookTarget);
    // Fog is tuned for the close-up; push it back as the camera pulls
    // out so the floating globe stays crisp.
    fog.near = FOG_NEAR + (1 - k) * (OUTSIDE_DISTANCE - CAMERA_DISTANCE);
    fog.far = FOG_FAR + (1 - k) * (OUTSIDE_DISTANCE - CAMERA_DISTANCE) * 1.6;
  };

  /** Hard stops at the edge of the work — momentum dies there. */
  const stopAtEdges = () => {
    if (spin > spinLimit || spin < -spinLimit) {
      spin = clamp(spin, -spinLimit, spinLimit);
      spinSpeed = 0;
    }
    if (tilt > tiltMax || tilt < tiltMin) {
      tilt = clamp(tilt, tiltMin, tiltMax);
      tiltSpeed = 0;
    }
  };

  /* Scrolling or dragging far enough sends the sheen across the globe,
     the way the surface is moving (tilt up = surface moves down). */
  let gestureTravel = 0;
  let gestureAt = 0;
  const feelGesture = (tiltDelta: number, px: number) => {
    const now = performance.now();
    if (now - gestureAt > SHEEN_GESTURE_GAP_MS || Math.sign(tiltDelta) !== Math.sign(gestureTravel)) gestureTravel = 0;
    gestureAt = now;
    gestureTravel += Math.sign(tiltDelta) * px;
    if (Math.abs(gestureTravel) < SHEEN_TRIGGER_PX) return;
    sheen.kick(Math.sign(gestureTravel));
    gestureTravel = 0;
  };

  /* ── picking ───────────────────────────────────────────────── */
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const pickTile = (clientX: number, clientY: number): THREE.Mesh | null => {
    const rect = canvas.getBoundingClientRect();
    ndc.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects([core, ...meshes], false)[0];
    if (!hit || hit.object === core) return null;
    return hit.object as THREE.Mesh;
  };

  /* ── input ─────────────────────────────────────────────────── */
  let drag: { x: number; y: number; travel: number; id: number } | null = null;
  let mouse: { x: number; y: number } | null = null;
  let hoverRaf = 0;
  let frameCount = 0;
  const HOVER_RECHECK_FRAMES = 6;

  const refreshHover = () => {
    if (!mouse || drag || flying || parked) return;
    const mesh = pickTile(mouse.x, mouse.y);
    setHovered(mesh);
    canvas.style.cursor = mesh ? "pointer" : "grab";
  };

  const onDown = (e: PointerEvent) => {
    if (e.button !== 0 || flying || parked) return;
    drag = { x: e.clientX, y: e.clientY, travel: 0, id: e.pointerId };
    tiltSpeed = 0;
    spinSpeed = 0;
    autopilot.touch();
    lightAt(e);
    canvas.setPointerCapture(e.pointerId);
  };

  /** The grid lights up under the pointer (mouse hover, or a finger while dragging). */
  const lightAt = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    sheen.point(((e.clientX - rect.left) / rect.width) * 2 - 1, -(((e.clientY - rect.top) / rect.height) * 2 - 1));
  };

  const onMove = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    if (e.pointerType === "mouse") {
      steerTargetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      steerTargetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    }
    if (e.pointerType === "mouse" || drag) lightAt(e);
    if (drag && e.pointerId === drag.id) {
      autopilot.touch();
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      drag.x = e.clientX;
      drag.y = e.clientY;
      drag.travel += Math.abs(dx) + Math.abs(dy);
      const gain = e.pointerType === "touch" ? TOUCH_FACTOR : 1;
      spinSpeed = dx * DRAG_SPIN * gain;
      tiltSpeed = clamp(dy * DRAG_TILT * gain, -MAX_TILT_SPEED, MAX_TILT_SPEED);
      spin += spinSpeed;
      tilt += tiltSpeed;
      if (dy !== 0) feelGesture(dy, Math.abs(dy));
      stopAtEdges();
      if (drag.travel > CLICK_SLOP_PX) {
        canvas.style.cursor = "grabbing";
        setHovered(null);
      }
      return;
    }
    if (e.pointerType !== "mouse") return;
    mouse = { x: e.clientX, y: e.clientY };
    if (hoverRaf || flying || parked) return;
    hoverRaf = requestAnimationFrame(() => {
      hoverRaf = 0;
      refreshHover();
    });
  };

  const onUp = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.id) return;
    const wasClick = drag.travel < CLICK_SLOP_PX;
    drag = null;
    autopilot.touch();
    if (e.pointerType !== "mouse") sheen.release();
    canvas.style.cursor = "grab";
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    if (!wasClick) return;
    const mesh = pickTile(e.clientX, e.clientY);
    if (!mesh) return;
    picked = mesh;
    opts.onSelect(tiles[mesh.userData.index as number].id);
  };

  const onCancel = () => {
    drag = null;
    sheen.release();
  };

  const onLeave = () => {
    mouse = null;
    steerTargetX = 0;
    steerTargetY = 0;
    sheen.release();
    setHovered(null);
  };

  let pull = 0;
  const onWheel = (e: WheelEvent) => {
    if (flying || parked) return;
    autopilot.touch();
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
    const delta = clamp(e.deltaY * unit, -140, 140);

    // Outside: scrolling down dives back into the surface.
    if (depthTarget < 1) {
      pull = delta > 0 ? pull + delta : 0;
      if (pull > DIVE_IN_PX) {
        depthTarget = 1;
        pull = 0;
      }
      return;
    }
    // Inside, pinned at the top row: keep scrolling up to pull out.
    if (tilt >= tiltMax - 1e-3 && delta < 0) {
      pull -= delta;
      if (pull > PULL_OUT_PX) {
        depthTarget = 0;
        pull = 0;
      }
    } else {
      pull = 0;
    }
    // Scrolling down rolls the rows up and away.
    tiltSpeed = clamp(tiltSpeed - delta * WHEEL_GAIN, -MAX_TILT_SPEED, MAX_TILT_SPEED);
    if (delta !== 0) feelGesture(-delta, Math.abs(delta));
  };

  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onCancel);
  canvas.addEventListener("pointerleave", onLeave);
  canvas.addEventListener("wheel", onWheel, { passive: true });

  /* ── sizing ────────────────────────────────────────────────── */
  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    sheen.setAspect(camera.aspect);
    baseFov = camera.aspect < 1 ? FOV_NARROW : FOV_WIDE;
    drift.tiltRest = clamp(restTiltFor(spots, baseFov), tiltMin, tiltMax);
    if (!rested) {
      tilt = drift.tiltRest;
      rested = true;
    }
    placeRest();
    if (!flying && !parked) applyRest();
    if (!active) renderer.render(scene, camera);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  /* ── flights ───────────────────────────────────────────────── */
  const fly = (
    toPos: THREE.Vector3,
    toTarget: THREE.Vector3,
    toUp: THREE.Vector3,
    toFov: number,
    ms: number,
    onStep?: (k: number) => void,
  ) =>
    new Promise<void>((resolve) => {
      const fromPos = camera.position.clone();
      const fromTarget = lookTarget.clone();
      const fromUp = camera.up.clone();
      const fromFov = camera.fov;
      const duration = opts.reducedMotion ? 0 : ms;
      const start = performance.now();
      let done = false;
      flying = true;
      const pose = (k: number) => {
        camera.position.lerpVectors(fromPos, toPos, k);
        lookTarget.lerpVectors(fromTarget, toTarget, k);
        camera.up.lerpVectors(fromUp, toUp, k).normalize();
        camera.fov = fromFov + (toFov - fromFov) * k;
        camera.updateProjectionMatrix();
        camera.lookAt(lookTarget);
        onStep?.(k);
        if (!active) renderer.render(scene, camera);
      };
      const finish = () => {
        if (done) return;
        done = true;
        pose(1);
        flying = false;
        resolve();
      };
      const step = (now: number) => {
        if (done) return;
        const t = duration === 0 ? 1 : Math.min(1, (now - start) / duration);
        pose(easeInOutCubic(t));
        if (t < 1) requestAnimationFrame(step);
        else finish();
      };
      requestAnimationFrame(step);
      // Animation frames pause in background tabs; never strand a flight.
      setTimeout(finish, duration + FLIGHT_GRACE_MS);
    });

  const flyIn = (id: string, target?: DOMRect) => {
    setHovered(null);
    const index = tiles.findIndex((t) => t.id === id);
    const mesh = picked && picked.userData.index === index ? picked : meshes[index];
    picked = null;
    parked = true;
    tiltSpeed = 0;
    spinSpeed = 0;
    if (!mesh) return Promise.resolve();

    globe.updateMatrixWorld(true);
    const spot = spots[index];
    const centre = sphericalPoint(spot.lon, spot.lat, TILE_RADIUS).applyMatrix4(globe.matrixWorld);
    const north = sphericalPoint(spot.lon, spot.lat + 1, TILE_RADIUS)
      .applyMatrix4(globe.matrixWorld)
      .sub(centre)
      .normalize();
    const normal = centre.clone().normalize();
    const right = normal.clone().negate().cross(north).normalize();
    const cos = Math.cos(spot.lat * DEG);
    const tileW = TILE_RADIUS * cos * spot.wDeg * DEG;
    const tileH = TILE_RADIUS * spot.hDeg * DEG;
    const tanHalf = Math.tan((baseFov / 2) * DEG);

    let dist: number;
    const camPos = new THREE.Vector3();
    if (target && target.width > 0) {
      // Match cut: choose the distance at which the tile is exactly as
      // wide as the project's first frame, then slide the camera so the
      // tile sits on that frame's position in the viewport.
      const view = canvas.getBoundingClientRect();
      dist = (tileW * view.width) / (target.width * 2 * tanHalf * camera.aspect);
      const visibleW = 2 * dist * tanHalf * camera.aspect;
      const visibleH = 2 * dist * tanHalf;
      const ox = ((target.left + target.width / 2 - view.left) / view.width - 0.5) * visibleW;
      const oy = ((target.top + target.height / 2 - view.top) / view.height - 0.5) * visibleH;
      camPos.copy(centre).addScaledVector(normal, dist).addScaledVector(right, -ox).addScaledVector(north, oy);
    } else {
      dist = Math.max(
        tileW / (FILL_RATIO * 2 * tanHalf * camera.aspect),
        tileH / (FILL_RATIO * 2 * tanHalf),
      );
      camPos.copy(centre).addScaledVector(normal, dist);
    }
    const lookAt = camPos.clone().sub(normal);
    landed = mesh;
    return fly(camPos, lookAt, north, baseFov, FLY_IN_MS, (k) => setFlatness(mesh, smoothstep(FLATTEN_FROM, 1, k)));
  };

  const flyOut = () => {
    placeRest();
    depth = 1;
    depthTarget = 1;
    const tile = landed;
    landed = null;
    return fly(restPos.clone(), restTarget.clone(), new THREE.Vector3(0, 1, 0), baseFov, FLY_OUT_MS, (k) => {
      if (tile) setFlatness(tile, 1 - smoothstep(0, 1 - FLATTEN_FROM, k));
    }).then(() => {
      parked = false;
    });
  };

  /* ── loop ──────────────────────────────────────────────────── */
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (!parked && !flying) {
      if (!drag) {
        tilt += tiltSpeed;
        spin += spinSpeed;
        const decay = Math.pow(SPEED_DECAY, dt * 60);
        tiltSpeed *= decay;
        spinSpeed *= decay;
      }
      if (depth > 0.5) {
        const next = autopilot.step(dt, now, spin, tilt, Boolean(drag || hovered));
        spin = next.spin;
        tilt = next.tilt;
      }
      stopAtEdges();
      depth = opts.reducedMotion
        ? depthTarget
        : depth + (depthTarget - depth) * (1 - Math.exp(-dt * DEPTH_EASE));
      if (Math.abs(depthTarget - depth) < 1e-3) depth = depthTarget;
      const k = 1 - Math.exp(-dt * STEER_EASE);
      steerX += (steerTargetX - steerX) * k;
      steerY += (steerTargetY - steerY) * k;
      globe.rotation.set(tilt + steerY * STEER_TILT, spin + steerX * STEER_SPIN, 0);
      applyRest();
    }

    sheen.update(now, dt);
    if (hovered && videoReady && hovered.material !== videoMat) hovered.material = videoMat;

    if (++frameCount % HOVER_RECHECK_FRAMES === 0) refreshHover();
    renderer.render(scene, camera);
    opts.onFrame(tilt / DEG, (((spin / DEG) % 360) + 540) % 360 - 180);
  };

  const setActive = (next: boolean) => {
    if (next === active) return;
    active = next;
    if (active) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    } else if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
      setHovered(null);
    }
  };

  globe.rotation.set(tilt, spin, 0);
  renderer.render(scene, camera);

  return {
    setActive,
    enter: () => {
      depthTarget = 1;
      sheen.kick(-1);
    },
    flyIn,
    flyOut,
    dispose: () => {
      setActive(false);
      if (hoverRaf) cancelAnimationFrame(hoverRaf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onCancel);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("wheel", onWheel);
      video.pause();
      video.removeAttribute("src");
      scene.traverse((obj) => {
        const m = obj as THREE.Mesh;
        m.geometry?.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
      meshes.forEach((m) => (m.userData.still as THREE.Material).dispose());
      videoTex.dispose();
      videoMat.dispose();
      textures.forEach((t) => t.dispose());
      renderer.dispose();
    },
  };
}

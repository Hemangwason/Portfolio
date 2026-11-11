import * as THREE from "three";

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
  /** Camera dives straight onto the tile for `id`. */
  flyIn: (id: string) => Promise<void>;
  /** Camera pulls back out to the resting view of the globe. */
  flyOut: () => Promise<void>;
  dispose: () => void;
};

const R = 10;
const DEG = Math.PI / 180;

/* ── layout: every project exactly once ──────────────────────────
   17 tiles on the face of the globe in three rows (6·6·5), spaced
   like Griflan's clusters. Slots are ranked by how central they sit
   in the resting view and handed out in `tiles` order — so the first
   tiles (the illustrative work) land in the middle and the last ones
   (product work) at the corners. Spin and tilt stop hard at the edge
   of the work, so the empty back of the globe never comes round. */
const ROWS: Array<{ lat: number; count: number }> = [
  { lat: 9, count: 6 },
  { lat: 27, count: 6 },
  { lat: -9, count: 5 },
];
const LON_PITCH = 23;
const TILE_WIDTH_DEG = 17; // at the equator — a Griflan cluster's footprint
const TILE_MAX_HEIGHT_DEG = 11;
const TILE_RADIUS = R * 1.002;
const HOVER_SCALE = 1.014;
/** Where the eye lands at rest; slots nearest it are the most central. */
const FOCUS_LAT = 3;
const FOCUS_LAT_WEIGHT = 1.3;

/* ── grid ────────────────────────────────────────────────────────── */
const LON_CELL = 6;
const LAT_CELL = 4.5;
const LAT_EDGE = 81;

/* ── camera: close in, Griflan-style — horizon under the header,
   the sphere's sides beyond the frame ─────────────────────────── */
const CAMERA_DISTANCE = 15.5;
const FOV_WIDE = 46;
const FOV_NARROW = 62;
const HORIZON_MARGIN = 0.95;
const TILT_REST = -0.21;

/* ── motion (deliberately calm) ─────────────────────────────────── */
const SWAY_SPIN = 0.05; // rad of idle left-right sway
const SWAY_SPEED = 0.12; // rad / s of the sway phase
const SPIN_LIMIT = 0.5; // hard stop, rad either side of centre
const TILT_MIN = -0.3; // hard stops
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
/** Scroll speed swells the middle: a tighter lens and a closer camera. */
const WARP_FOV = -9; // narrower lens → the centre swells
const WARP_DOLLY = 0.9;
const WARP_GAIN = 70;
const WARP_ATTACK = 9; // swell fast while scrolling…
const WARP_RELEASE = 1.8; // …and settle back slowly
const CLICK_SLOP_PX = 6;
const FILL_RATIO = 0.82;
const FLY_IN_MS = 900;
const FLY_OUT_MS = 850;
const FLIGHT_GRACE_MS = 250;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function sphericalPoint(lonDeg: number, latDeg: number, r: number): THREE.Vector3 {
  const phi = lonDeg * DEG;
  const theta = (90 - latDeg) * DEG;
  return new THREE.Vector3(
    -r * Math.cos(phi) * Math.sin(theta),
    r * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

type Placement = { lon: number; lat: number; wDeg: number; hDeg: number };

/** Slots ranked from most to least central. */
function rankedSlots(): Array<{ lon: number; lat: number }> {
  const slots: Array<{ lon: number; lat: number; score: number }> = [];
  ROWS.forEach((row) => {
    const cos = Math.cos(row.lat * DEG);
    for (let k = 0; k < row.count; k++) {
      const dLon = (k - (row.count - 1) / 2) * LON_PITCH;
      slots.push({
        lon: 90 + dLon,
        lat: row.lat,
        score: Math.abs(dLon) * cos + Math.abs(row.lat - FOCUS_LAT) * FOCUS_LAT_WEIGHT,
      });
    }
  });
  return slots.sort((a, b) => a.score - b.score);
}

function placements(tiles: GlobeTile[]): Placement[] {
  const slots = rankedSlots();
  return tiles.map((t, i) => {
    const slot = slots[i] ?? slots[slots.length - 1];
    const cos = Math.cos(slot.lat * DEG);
    let hDeg = TILE_WIDTH_DEG / t.aspect;
    let wDeg = TILE_WIDTH_DEG / cos;
    if (hDeg > TILE_MAX_HEIGHT_DEG) {
      hDeg = TILE_MAX_HEIGHT_DEG;
      wDeg = (hDeg * t.aspect) / cos;
    }
    return { lon: slot.lon, lat: slot.lat, wDeg, hDeg };
  });
}

function tileGeometry(p: Placement): THREE.BufferGeometry {
  return new THREE.SphereGeometry(
    TILE_RADIUS,
    20,
    12,
    (p.lon - p.wDeg / 2) * DEG,
    p.wDeg * DEG,
    (90 - (p.lat + p.hDeg / 2)) * DEG,
    p.hDeg * DEG,
  );
}

function gridLines(color: string): THREE.LineSegments {
  const r = R * 0.9985;
  const pts: number[] = [];
  const push = (a: THREE.Vector3, b: THREE.Vector3) => pts.push(a.x, a.y, a.z, b.x, b.y, b.z);
  for (let lon = 0; lon < 360; lon += LON_CELL) {
    for (let lat = -LAT_EDGE; lat < LAT_EDGE; lat += 1.5) {
      push(sphericalPoint(lon, lat, r), sphericalPoint(lon, lat + 1.5, r));
    }
  }
  for (let lat = -LAT_EDGE; lat <= LAT_EDGE + 0.01; lat += LAT_CELL) {
    for (let lon = 0; lon < 360; lon += 2) {
      push(sphericalPoint(lon, lat, r), sphericalPoint(lon + 2, lat, r));
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.1 }));
}

/* Pastel colour fields painted across the sphere (blush, peach,
   periwinkle, lilac), washed toward the paper colour so tiles pop. */
const IRIS = ["#ffc3dd", "#ffd8bd", "#c9d7ff", "#dcc9ff"].map((c) => new THREE.Color(c));
const IRIS_WASH = 0.55;

function iridescentSphere(radius: number, paper: string): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(radius, 96, 64);
  const pos = geo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const base = new THREE.Color(paper);
  const a = new THREE.Color();
  const b = new THREE.Color();
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) / radius;
    const y = pos.getY(i) / radius;
    const z = pos.getZ(i) / radius;
    const u = 0.5 + 0.5 * Math.sin(x * 2.1 + z * 1.3);
    const v = 0.5 + 0.5 * Math.sin(y * 2.4 - x * 0.9);
    a.copy(IRIS[0]).lerp(IRIS[2], u);
    b.copy(IRIS[1]).lerp(IRIS[3], u);
    c.copy(a).lerp(b, v).lerp(base, IRIS_WASH);
    colors.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geo;
}

export function createGlobe(canvas: HTMLCanvasElement, tiles: GlobeTile[], opts: GlobeOptions): GlobeHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(opts.background, 10, 22);

  const camera = new THREE.PerspectiveCamera(FOV_WIDE, 1, 0.05, 80);
  const restPos = new THREE.Vector3();
  const restTarget = new THREE.Vector3();
  const lookTarget = new THREE.Vector3();
  let baseFov = FOV_WIDE;

  const globe = new THREE.Group();
  scene.add(globe);
  const core = new THREE.Mesh(iridescentSphere(R * 0.996, opts.background), new THREE.MeshBasicMaterial({ vertexColors: true }));
  globe.add(core);
  globe.add(gridLines(opts.lineColor));

  /* ── tiles ─────────────────────────────────────────────────── */
  const loader = new THREE.TextureLoader();
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const textures: THREE.Texture[] = [];
  const spots = placements(tiles);
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
  let tilt = TILT_REST;
  let tiltSpeed = 0;
  let spinSpeed = 0;
  let steerX = 0;
  let steerY = 0;
  let steerTargetX = 0;
  let steerTargetY = 0;
  let warp = 0;
  let swayPhase = 0;
  let active = false;
  let flying = false;
  let parked = false;
  let raf = 0;
  let last = performance.now();
  let picked: THREE.Mesh | null = null;

  const placeRest = () => {
    camera.fov = baseFov;
    const half = (baseFov / 2) * DEG;
    const pitch = Math.asin(R / CAMERA_DISTANCE) - half * HORIZON_MARGIN;
    restPos.set(0, 0, CAMERA_DISTANCE);
    restTarget.set(0, CAMERA_DISTANCE * Math.tan(pitch), 0);
    camera.updateProjectionMatrix();
  };

  const applyRest = () => {
    // Warp: faster scroll → tighter lens and a closer camera, so the
    // middle of the globe swells outward and settles back.
    camera.fov = baseFov + warp * WARP_FOV;
    camera.updateProjectionMatrix();
    camera.position.copy(restPos).addScaledVector(new THREE.Vector3(0, 0, -1), warp * WARP_DOLLY);
    camera.up.set(0, 1, 0);
    lookTarget.copy(restTarget);
    camera.lookAt(lookTarget);
  };

  /** Hard stops at the edge of the work — momentum dies there. */
  const stopAtEdges = () => {
    if (spin > SPIN_LIMIT || spin < -SPIN_LIMIT) {
      spin = clamp(spin, -SPIN_LIMIT, SPIN_LIMIT);
      spinSpeed = 0;
    }
    if (tilt > TILT_MAX || tilt < TILT_MIN) {
      tilt = clamp(tilt, TILT_MIN, TILT_MAX);
      tiltSpeed = 0;
    }
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
    canvas.setPointerCapture(e.pointerId);
  };

  const onMove = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    if (e.pointerType === "mouse") {
      steerTargetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      steerTargetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    }
    if (drag && e.pointerId === drag.id) {
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
  };

  const onLeave = () => {
    mouse = null;
    steerTargetX = 0;
    steerTargetY = 0;
    setHovered(null);
  };

  const onWheel = (e: WheelEvent) => {
    if (flying || parked) return;
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
    const delta = clamp(e.deltaY * unit, -140, 140);
    // Scrolling down rolls the rows up and away.
    tiltSpeed = clamp(tiltSpeed - delta * WHEEL_GAIN, -MAX_TILT_SPEED, MAX_TILT_SPEED);
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
    baseFov = camera.aspect < 1 ? FOV_NARROW : FOV_WIDE;
    placeRest();
    if (!flying && !parked) applyRest();
    if (!active) renderer.render(scene, camera);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  /* ── flights ───────────────────────────────────────────────── */
  const fly = (toPos: THREE.Vector3, toTarget: THREE.Vector3, toUp: THREE.Vector3, toFov: number, ms: number) =>
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

  const flyIn = (id: string) => {
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
    const cos = Math.cos(spot.lat * DEG);
    const tileW = TILE_RADIUS * cos * spot.wDeg * DEG;
    const tileH = TILE_RADIUS * spot.hDeg * DEG;
    const half = (baseFov / 2) * DEG;
    const dist = Math.max(
      tileW / (FILL_RATIO * 2 * Math.tan(half) * camera.aspect),
      tileH / (FILL_RATIO * 2 * Math.tan(half)),
    );
    return fly(centre.clone().addScaledVector(normal, dist), centre, north, baseFov, FLY_IN_MS);
  };

  const flyOut = () => {
    placeRest();
    return fly(restPos.clone(), restTarget.clone(), new THREE.Vector3(0, 1, 0), baseFov, FLY_OUT_MS).then(() => {
      warp = 0;
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
      stopAtEdges();
      if (!opts.reducedMotion) swayPhase += dt * SWAY_SPEED;
      const k = 1 - Math.exp(-dt * STEER_EASE);
      steerX += (steerTargetX - steerX) * k;
      steerY += (steerTargetY - steerY) * k;
      const speed = Math.abs(tiltSpeed) + Math.abs(spinSpeed) * 0.5;
      const warpTarget = opts.reducedMotion ? 0 : clamp(speed * WARP_GAIN, 0, 1);
      const rate = warpTarget > warp ? WARP_ATTACK : WARP_RELEASE;
      warp += (warpTarget - warp) * (1 - Math.exp(-dt * rate));
      const sway = Math.sin(swayPhase) * SWAY_SPIN;
      globe.rotation.set(tilt + steerY * STEER_TILT, spin + sway + steerX * STEER_SPIN, 0);
      applyRest();
    }

    meshes.forEach((m) => {
      const s = m === hovered ? HOVER_SCALE : 1;
      const next = m.scale.x + (s - m.scale.x) * 0.18;
      m.scale.setScalar(next);
    });
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

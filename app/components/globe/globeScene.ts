import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export type GlobeTileSource = { id: string; atlas: string };

export type GlobeOptions = {
  background: string;
  lineColor: string;
  reducedMotion: boolean;
  onSelect: (id: string, clientX: number, clientY: number) => void;
  onFrame: (tiltDeg: number, spinDeg: number) => void;
};

export type GlobeHandle = {
  setScrollProgress: (p: number) => void;
  setActive: (active: boolean) => void;
  dispose: () => void;
};

const R = 10;
const DEG = Math.PI / 180;

/* Lat/long grid: one cell = 6° of longitude × 4.5° of latitude. A
   project is a 3×2 cluster of cells; clusters sit one empty column
   apart and two empty rows apart. */
const LON_CELL = 6;
const LAT_CELL = 4.5;
const TILE_GAP_LON = 0.42;
const TILE_GAP_LAT = 0.34;
const CLUSTER_COLS = 3;
const CLUSTER_ROWS = 2;
const CLUSTER_PITCH_LON = 24;
const CLUSTERS_PER_ROW = 15;
const ROW_TOPS = [72, 54, 36, 18, 0, -18, -36, -54];
const POLAR_ROW_LIMIT = 55;
const CLUSTERS_PER_PROJECT = 6;

const AUTO_SPIN = 0.04; // rad / s
const DRAG_SPIN = 0.0032; // rad / px
const DRAG_TILT = 0.0022; // rad / px
const DRAG_TILT_LIMIT = 0.5;
const TILT_START = 0.3;
const TILT_RANGE = 1.05;
const CLICK_SLOP_PX = 6;
const INERTIA_DECAY = 0.92;

const PLACEHOLDER = new THREE.Color("#e2ded3");

function sphericalPoint(lonDeg: number, latDeg: number, r: number): THREE.Vector3 {
  const phi = lonDeg * DEG;
  const theta = (90 - latDeg) * DEG;
  return new THREE.Vector3(
    -r * Math.cos(phi) * Math.sin(theta),
    r * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

/** One curved tile, UV-mapped onto its cell of the 3×2 atlas. */
function tileGeometry(lonDeg: number, latTopDeg: number, col: number, row: number) {
  const g = new THREE.SphereGeometry(
    R,
    5,
    4,
    (lonDeg + TILE_GAP_LON / 2) * DEG,
    (LON_CELL - TILE_GAP_LON) * DEG,
    (90 - latTopDeg + TILE_GAP_LAT / 2) * DEG,
    (LAT_CELL - TILE_GAP_LAT) * DEG,
  );
  const uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(i, (col + uv.getX(i)) / CLUSTER_COLS, (uv.getY(i) + (CLUSTER_ROWS - 1 - row)) / CLUSTER_ROWS);
  }
  return g;
}

type Slot = { lon: number; latTop: number; project: number };

/** Every project gets exactly CLUSTERS_PER_PROJECT clusters. */
function layoutSlots(projectCount: number): Slot[] {
  const counts = new Array<number>(projectCount).fill(0);
  const slots: Slot[] = [];
  ROW_TOPS.forEach((top, k) => {
    const centreLat = top - LAT_CELL;
    const stride = Math.abs(centreLat) > POLAR_ROW_LIMIT ? 2 : 1;
    const offset = (k % 2) * (CLUSTER_PITCH_LON / 2);
    for (let c = 0; c < CLUSTERS_PER_ROW; c += stride) {
      let idx = (c + k * 5) % projectCount;
      let tries = 0;
      while (counts[idx] >= CLUSTERS_PER_PROJECT && tries < projectCount) {
        idx = (idx + 1) % projectCount;
        tries++;
      }
      if (counts[idx] >= CLUSTERS_PER_PROJECT) continue;
      counts[idx]++;
      slots.push({ lon: offset + c * CLUSTER_PITCH_LON, latTop: top, project: idx });
    }
  });
  return slots;
}

function gridLines(color: string): THREE.LineSegments {
  const r = R * 0.9985;
  const pts: number[] = [];
  const push = (a: THREE.Vector3, b: THREE.Vector3) => pts.push(a.x, a.y, a.z, b.x, b.y, b.z);
  const LAT_EDGE = 81;
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
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.24 });
  return new THREE.LineSegments(geo, mat);
}

/* Camera sits out on +Z and pitches up so the sphere's horizon lands
   just under the top edge of the frame, Griflan-style: big tiles at
   the bottom, rows bowing and lines converging toward the horizon. */
const CAMERA_DISTANCE = 14;
const HORIZON_MARGIN = 0.95; // 1 = horizon exactly at the top edge

function placeCamera(camera: THREE.PerspectiveCamera, aspect: number) {
  const narrow = aspect < 1;
  camera.fov = narrow ? 64 : 46;
  camera.aspect = aspect;
  const horizonElevation = Math.asin(R / CAMERA_DISTANCE);
  const pitch = horizonElevation - (camera.fov / 2) * DEG * HORIZON_MARGIN;
  camera.position.set(0, 0, CAMERA_DISTANCE);
  camera.lookAt(0, CAMERA_DISTANCE * Math.tan(pitch), 0);
  camera.updateProjectionMatrix();
}

export function createGlobe(
  canvas: HTMLCanvasElement,
  sources: GlobeTileSource[],
  opts: GlobeOptions,
): GlobeHandle {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(opts.background);
  scene.fog = new THREE.Fog(opts.background, 7, 15);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 60);
  const globe = new THREE.Group();
  scene.add(globe);

  // Opaque core hides the far hemisphere and blocks back-side picks.
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(R * 0.996, 96, 64),
    new THREE.MeshBasicMaterial({ color: opts.background }),
  );
  globe.add(core);
  globe.add(gridLines(opts.lineColor));

  // One merged mesh + one material per project → 17 draw calls.
  const slots = layoutSlots(sources.length);
  const loader = new THREE.TextureLoader();
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const meshes: THREE.Mesh[] = [];
  const textures: THREE.Texture[] = [];

  sources.forEach((src, p) => {
    const parts: THREE.BufferGeometry[] = [];
    slots
      .filter((s) => s.project === p)
      .forEach((s) => {
        for (let row = 0; row < CLUSTER_ROWS; row++) {
          for (let col = 0; col < CLUSTER_COLS; col++) {
            parts.push(tileGeometry(s.lon + col * LON_CELL, s.latTop - row * LAT_CELL, col, row));
          }
        }
      });
    if (parts.length === 0) return;
    const geometry = mergeGeometries(parts);
    parts.forEach((g) => g.dispose());
    if (!geometry) return;

    const material = new THREE.MeshBasicMaterial({ color: PLACEHOLDER });
    loader.load(src.atlas, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = maxAniso;
      textures.push(tex);
      material.map = tex;
      material.color.set("#ffffff");
      material.needsUpdate = true;
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData.id = src.id;
    meshes.push(mesh);
    globe.add(mesh);
  });

  /* ── state ─────────────────────────────────────────────────── */
  let spin = -Math.PI / 2;
  let spinVelocity = 0;
  let tiltScroll = TILT_START;
  let tiltDrag = 0;
  let tilt = TILT_START;
  let raf = 0;
  let last = performance.now();
  let active = false;

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const pickTargets: THREE.Object3D[] = [core, ...meshes];

  const pick = (clientX: number, clientY: number): string | null => {
    const rect = canvas.getBoundingClientRect();
    ndc.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects(pickTargets, false)[0];
    if (!hit || hit.object === core) return null;
    return (hit.object.userData.id as string) ?? null;
  };

  /* ── pointer ───────────────────────────────────────────────── */
  let drag: { x: number; y: number; travel: number; id: number } | null = null;
  let hoverRaf = 0;

  const onDown = (e: PointerEvent) => {
    if (e.button !== 0) return;
    drag = { x: e.clientX, y: e.clientY, travel: 0, id: e.pointerId };
    spinVelocity = 0;
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = "grabbing";
  };

  const onMove = (e: PointerEvent) => {
    if (drag && e.pointerId === drag.id) {
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      drag.x = e.clientX;
      drag.y = e.clientY;
      drag.travel += Math.abs(dx) + Math.abs(dy);
      spin += dx * DRAG_SPIN;
      spinVelocity = dx * DRAG_SPIN;
      tiltDrag = Math.max(-DRAG_TILT_LIMIT, Math.min(DRAG_TILT_LIMIT, tiltDrag + dy * DRAG_TILT));
      return;
    }
    if (e.pointerType !== "mouse" || hoverRaf) return;
    const { clientX, clientY } = e;
    hoverRaf = requestAnimationFrame(() => {
      hoverRaf = 0;
      canvas.style.cursor = pick(clientX, clientY) ? "pointer" : "grab";
    });
  };

  const onUp = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.id) return;
    const wasClick = drag.travel < CLICK_SLOP_PX;
    drag = null;
    canvas.style.cursor = "grab";
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    if (!wasClick) return;
    const id = pick(e.clientX, e.clientY);
    if (id) opts.onSelect(id, e.clientX, e.clientY);
  };

  const onCancel = () => {
    drag = null;
    canvas.style.cursor = "grab";
  };

  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onCancel);

  /* ── sizing ────────────────────────────────────────────────── */
  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    placeCamera(camera, w / h);
    if (!active) renderer.render(scene, camera);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  /* ── loop ──────────────────────────────────────────────────── */
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (!drag) {
      spin += spinVelocity;
      spinVelocity *= Math.pow(INERTIA_DECAY, dt * 60);
      if (!opts.reducedMotion) spin += AUTO_SPIN * dt;
    }
    const target = tiltScroll + tiltDrag;
    tilt += (target - tilt) * (1 - Math.pow(0.002, dt));

    globe.rotation.set(tilt, spin, 0);
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
    }
  };

  return {
    setScrollProgress: (p: number) => {
      tiltScroll = TILT_START - Math.min(1, Math.max(0, p)) * TILT_RANGE;
    },
    setActive,
    dispose: () => {
      setActive(false);
      if (hoverRaf) cancelAnimationFrame(hoverRaf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onCancel);
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        mesh.geometry?.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose();
      });
      textures.forEach((t) => t.dispose());
      renderer.dispose();
    },
  };
}

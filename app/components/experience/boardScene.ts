import * as THREE from "three";

export type BoardTile = { id: string; still: string; aspect: number; loop?: string };

export type BoardOptions = {
  background: string;
  lineColor: string;
  reducedMotion: boolean;
  onSelect: (id: string) => void;
  onFrame: (a: number, b: number) => void;
  onReady: () => void;
};

export type BoardHandle = {
  setActive: (active: boolean) => void;
  /** Camera dives straight down onto the tile for `id`. */
  flyIn: (id: string) => Promise<void>;
  /** Camera climbs back to where the visitor left the orbit. */
  flyOut: () => Promise<void>;
  dispose: () => void;
};

/* ── board geometry (board units) ─────────────────────────────────
   One square slab. Rows of 4,3,4,3,3 tiles = 17, each project once,
   odd rows centred so the layout reads as a brick pattern. */
const ROWS = [4, 3, 4, 3, 3];
const FOOT_W = 3.25;
const FOOT_D = 2.2;
const PITCH_X = 3.6;
const PITCH_Z = 2.6;
const SLAB = 15;
const SLAB_THICKNESS = 0.36;
const GRID_STEP = 1.2;
const TILE_LIFT = 0.012;
const HOVER_LIFT = 0.22;

/* ── camera / input ──────────────────────────────────────────────── */
const FOV_WIDE = 42;
const FOV_NARROW = 58;
const ELEVATION = 1.08; // rad above the slab plane
const ELEVATION_RANGE = 0.28;
const YAW_LIMIT = 0.6;
const DRAG_YAW = 0.0022; // rad / px
const DRAG_TILT = 0.0014; // rad / px
const WHEEL_ZOOM = 0.0011; // log-distance per px of wheel delta
const ZOOM_MIN_RATIO = 0.34;
const REST_RATIO = 0.86;
const FRONT_BIAS = 1.1;
const EASE_RATE = 7; // higher = snappier settle, no overshoot
const CLICK_SLOP_PX = 6;
const FILL_RATIO = 0.84;
const FLY_IN_MS = 950;
const FLY_OUT_MS = 800;
const FLIGHT_GRACE_MS = 250;

/* ── floating ────────────────────────────────────────────────────── */
const BOB_AMPLITUDE = 0.14;
const BOB_SPEED = 0.55;
const SWAY_YAW = 0.035;
const SWAY_ROLL = 0.012;
const STAR_COUNT = 520;

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function fitFootprint(aspect: number): { w: number; d: number } {
  let w = FOOT_W;
  let d = w / aspect;
  if (d > FOOT_D) {
    d = FOOT_D;
    w = d * aspect;
  }
  return { w, d };
}

function tilePositions(): Array<{ x: number; z: number }> {
  const out: Array<{ x: number; z: number }> = [];
  const mid = (ROWS.length - 1) / 2;
  ROWS.forEach((count, r) => {
    for (let j = 0; j < count; j++) {
      out.push({ x: (j - (count - 1) / 2) * PITCH_X, z: (r - mid) * PITCH_Z });
    }
  });
  return out;
}

function slabGrid(color: string): THREE.LineSegments {
  const half = SLAB / 2;
  const pts: number[] = [];
  for (let v = -half; v <= half + 1e-6; v += GRID_STEP) {
    pts.push(v, 0.002, -half, v, 0.002, half);
    pts.push(-half, 0.002, v, half, 0.002, v);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return new THREE.LineSegments(
    geo,
    new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.1 }),
  );
}

function starField(color: string): THREE.Points {
  const pos = new Float32Array(STAR_COUNT * 3);
  for (let i = 0; i < STAR_COUNT; i++) {
    const r = 30 + Math.random() * 50;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.cos(phi);
    pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return new THREE.Points(
    geo,
    new THREE.PointsMaterial({ color, size: 0.09, transparent: true, opacity: 0.45, sizeAttenuation: true, fog: false }),
  );
}

export function createBoard(
  canvas: HTMLCanvasElement,
  tiles: BoardTile[],
  opts: BoardOptions,
): BoardHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(opts.background);
  const camera = new THREE.PerspectiveCamera(FOV_WIDE, 1, 0.05, 200);

  const stars = starField(opts.lineColor);
  scene.add(stars);

  /* ── the floating slab ─────────────────────────────────────── */
  const board = new THREE.Group();
  scene.add(board);

  const slabGeo = new THREE.BoxGeometry(SLAB, SLAB_THICKNESS, SLAB);
  const slab = new THREE.Mesh(slabGeo, new THREE.MeshBasicMaterial({ color: "#211d1d" }));
  slab.position.y = -SLAB_THICKNESS / 2;
  board.add(slab);
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(slabGeo),
    new THREE.LineBasicMaterial({ color: opts.lineColor, transparent: true, opacity: 0.32 }),
  );
  edges.position.copy(slab.position);
  board.add(edges);
  const grid = slabGrid(opts.lineColor);
  board.add(grid);

  /* ── tiles: one mesh per project ───────────────────────────── */
  const loader = new THREE.TextureLoader();
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const textures: THREE.Texture[] = [];
  const tileGeo = new THREE.PlaneGeometry(1, 1);
  tileGeo.rotateX(-Math.PI / 2);
  const positions = tilePositions();
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
    const mesh = new THREE.Mesh(tileGeo, mat);
    const fp = fitFootprint(t.aspect);
    mesh.scale.set(fp.w, 1, fp.d);
    const p = positions[i] ?? { x: 0, z: 0 };
    mesh.position.set(p.x, TILE_LIFT, p.z);
    mesh.userData = { index: i, still: mat };
    board.add(mesh);
    return mesh;
  });

  /* ── hover loop video, shared by whichever tile is hovered ─── */
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

  /* ── orbit state (targets ease toward, never overshoot) ────── */
  const focus = new THREE.Vector3();
  const focusTarget = new THREE.Vector3();
  let yaw = 0;
  let yawTarget = 0;
  let elevation = ELEVATION;
  let elevationTarget = ELEVATION;
  let distance = 20;
  let distanceTarget = 20;
  let distanceMax = 20;
  let active = false;
  let flying = false;
  let parked = false;
  let raf = 0;
  let last = performance.now();
  let clock = 0;
  let picked: THREE.Mesh | null = null;
  const lookTarget = new THREE.Vector3();

  /* The near edge projects larger than the far one, so the framing
     leans toward the front to keep the whole square centred. */
  const orbitPose = (outPos: THREE.Vector3, outTarget: THREE.Vector3) => {
    outTarget.set(focus.x, focus.y, focus.z + FRONT_BIAS);
    outPos.set(
      outTarget.x + distance * Math.sin(yaw) * Math.cos(elevation),
      outTarget.y + distance * Math.sin(elevation),
      outTarget.z + distance * Math.cos(yaw) * Math.cos(elevation),
    );
  };

  const fitDistance = () => {
    const half = (camera.fov / 2) * (Math.PI / 180);
    const tanV = Math.tan(half);
    const tanH = tanV * camera.aspect;
    const halfW = (SLAB / 2) * 1.08;
    const halfD = ((SLAB / 2) * Math.sin(ELEVATION) + SLAB_THICKNESS) * 1.1;
    return Math.max(halfW / tanH, halfD / tanV) + (SLAB / 2) * Math.cos(ELEVATION) * 0.3;
  };

  const clampFocus = (v: THREE.Vector3) => {
    const zoomed = 1 - distanceTarget / distanceMax;
    const reach = (SLAB / 2) * clamp(zoomed / (1 - ZOOM_MIN_RATIO), 0, 1);
    v.x = clamp(v.x, -reach, reach);
    v.z = clamp(v.z, -reach, reach);
    v.y = 0;
  };

  /* ── picking ───────────────────────────────────────────────── */
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const slabPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const setRay = (clientX: number, clientY: number) => {
    const rect = canvas.getBoundingClientRect();
    ndc.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
  };
  const pickTile = (clientX: number, clientY: number): THREE.Mesh | null => {
    setRay(clientX, clientY);
    const hit = raycaster.intersectObjects(meshes, false)[0];
    return (hit?.object as THREE.Mesh) ?? null;
  };

  /* ── input ─────────────────────────────────────────────────── */
  const pointers = new Map<number, { x: number; y: number }>();
  let drag: { travel: number; id: number } | null = null;
  let pinchStart = 0;
  let pinchDistance = 0;
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

  const zoomBy = (factor: number, clientX: number, clientY: number) => {
    const before = distanceTarget;
    distanceTarget = clamp(distanceTarget * factor, distanceMax * ZOOM_MIN_RATIO, distanceMax);
    const k = 1 - distanceTarget / before;
    if (k > 0) {
      // Zooming in: drift the focus toward the point under the cursor.
      setRay(clientX, clientY);
      const p = new THREE.Vector3();
      const local = slabPlane.clone().applyMatrix4(board.matrixWorld);
      if (raycaster.ray.intersectPlane(local, p)) focusTarget.lerp(p, k);
    } else {
      // Zooming out: ease back toward the centre of the square.
      focusTarget.lerp(new THREE.Vector3(), Math.min(1, -k * 2.2));
    }
    clampFocus(focusTarget);
  };

  const onDown = (e: PointerEvent) => {
    if (flying || parked) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    canvas.setPointerCapture(e.pointerId);
    if (pointers.size === 1) {
      drag = { travel: 0, id: e.pointerId };
    } else if (pointers.size === 2) {
      drag = null;
      const [a, b] = [...pointers.values()];
      pinchStart = Math.hypot(a.x - b.x, a.y - b.y);
      pinchDistance = distanceTarget;
    }
  };

  const onMove = (e: PointerEvent) => {
    const prev = pointers.get(e.pointerId);
    if (prev) {
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2 && pinchStart > 0) {
        const [a, b] = [...pointers.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        distanceTarget = clamp(pinchDistance * (pinchStart / d), distanceMax * ZOOM_MIN_RATIO, distanceMax);
        clampFocus(focusTarget);
        return;
      }
      if (drag && e.pointerId === drag.id) {
        drag.travel += Math.abs(dx) + Math.abs(dy);
        yawTarget = clamp(yawTarget - dx * DRAG_YAW, -YAW_LIMIT, YAW_LIMIT);
        elevationTarget = clamp(
          elevationTarget + dy * DRAG_TILT,
          ELEVATION - ELEVATION_RANGE,
          ELEVATION + ELEVATION_RANGE,
        );
        if (drag.travel > CLICK_SLOP_PX) {
          canvas.style.cursor = "grabbing";
          setHovered(null);
        }
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

  const release = (e: PointerEvent) => {
    pointers.delete(e.pointerId);
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    if (pointers.size < 2) pinchStart = 0;
  };

  const onUp = (e: PointerEvent) => {
    const wasClick = drag && e.pointerId === drag.id && drag.travel < CLICK_SLOP_PX;
    release(e);
    if (drag && e.pointerId === drag.id) drag = null;
    canvas.style.cursor = "grab";
    if (!wasClick) return;
    const mesh = pickTile(e.clientX, e.clientY);
    if (!mesh) return;
    picked = mesh;
    opts.onSelect(tiles[mesh.userData.index as number].id);
  };

  const onCancel = (e: PointerEvent) => {
    release(e);
    drag = null;
  };

  const onLeave = () => {
    mouse = null;
    setHovered(null);
  };

  const onWheel = (e: WheelEvent) => {
    if (flying || parked) return;
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
    const delta = clamp(e.deltaY * unit, -120, 120);
    zoomBy(Math.exp(delta * WHEEL_ZOOM), e.clientX, e.clientY);
  };

  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onCancel);
  canvas.addEventListener("pointerleave", onLeave);
  canvas.addEventListener("wheel", onWheel, { passive: true });

  /* ── sizing ────────────────────────────────────────────────── */
  const applyOrbit = () => {
    const pos = new THREE.Vector3();
    orbitPose(pos, lookTarget);
    camera.position.copy(pos);
    camera.up.set(0, 1, 0);
    camera.lookAt(lookTarget);
  };

  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = camera.aspect < 1 ? FOV_NARROW : FOV_WIDE;
    camera.updateProjectionMatrix();
    const firstFit = distanceMax === 20 && distance === 20;
    distanceMax = fitDistance();
    if (firstFit) {
      distance = distanceTarget = distanceMax * REST_RATIO;
    } else {
      distanceTarget = clamp(distanceTarget, distanceMax * ZOOM_MIN_RATIO, distanceMax);
    }
    if (!flying && !parked) applyOrbit();
    if (!active) renderer.render(scene, camera);
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  /* ── camera flights ────────────────────────────────────────── */
  const fly = (toPos: THREE.Vector3, toTarget: THREE.Vector3, toUp: THREE.Vector3, ms: number) =>
    new Promise<void>((resolve) => {
      const fromPos = camera.position.clone();
      const fromTarget = lookTarget.clone();
      const fromUp = camera.up.clone();
      const duration = opts.reducedMotion ? 0 : ms;
      const start = performance.now();
      let done = false;
      flying = true;
      const pose = (k: number) => {
        camera.position.lerpVectors(fromPos, toPos, k);
        lookTarget.lerpVectors(fromTarget, toTarget, k);
        camera.up.lerpVectors(fromUp, toUp, k).normalize();
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
    if (!mesh) {
      parked = true;
      return Promise.resolve();
    }
    parked = true;
    board.updateMatrixWorld(true);
    const centre = new THREE.Vector3();
    mesh.getWorldPosition(centre);
    const normal = new THREE.Vector3(0, 1, 0).applyQuaternion(board.quaternion).normalize();
    const up = new THREE.Vector3(0, 0, -1).applyQuaternion(board.quaternion).normalize();
    const fp = fitFootprint(tiles[index].aspect);
    const half = (camera.fov / 2) * (Math.PI / 180);
    const dist = Math.max(
      fp.w / (FILL_RATIO * 2 * Math.tan(half) * camera.aspect),
      fp.d / (FILL_RATIO * 2 * Math.tan(half)),
    );
    return fly(centre.clone().addScaledVector(normal, dist), centre, up, FLY_IN_MS);
  };

  const flyOut = () => {
    const pos = new THREE.Vector3();
    const target = new THREE.Vector3();
    orbitPose(pos, target);
    return fly(pos, target, new THREE.Vector3(0, 1, 0), FLY_OUT_MS).then(() => {
      parked = false;
    });
  };

  /* ── loop ──────────────────────────────────────────────────── */
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!parked) clock += dt;

    if (!opts.reducedMotion && !parked) {
      board.position.y = Math.sin(clock * BOB_SPEED) * BOB_AMPLITUDE;
      board.rotation.y = Math.sin(clock * 0.21) * SWAY_YAW;
      board.rotation.z = Math.sin(clock * 0.27) * SWAY_ROLL;
      stars.rotation.y += dt * 0.006;
    }

    if (!flying && !parked) {
      const k = 1 - Math.exp(-dt * EASE_RATE);
      yaw += (yawTarget - yaw) * k;
      elevation += (elevationTarget - elevation) * k;
      distance += (distanceTarget - distance) * k;
      focus.lerp(focusTarget, k);
      applyOrbit();
    }

    meshes.forEach((m) => {
      const lift = m === hovered ? HOVER_LIFT : TILE_LIFT;
      m.position.y += (lift - m.position.y) * 0.18;
    });
    if (hovered && videoReady && hovered.material !== videoMat) hovered.material = videoMat;

    if (++frameCount % HOVER_RECHECK_FRAMES === 0) refreshHover();
    renderer.render(scene, camera);
    opts.onFrame(yaw * (180 / Math.PI), (distanceMax / distance) * 100);
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

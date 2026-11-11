import * as THREE from "three";
import { SHEEN_FRAGMENT_PARS, SHEEN_VERTEX, SHEEN_VERTEX_PARS, type SheenUniforms, withSheen } from "./globeSheen";

/* The globe's surface: a white pearl sphere under a gradient lat/long
   grid. Both carry the scroll sheen (see globeSheen.ts). */

export const R = 10;
export const DEG = Math.PI / 180;

/** Grid cell size — the tile layout is measured in these cells. */
export const LON_CELL = 4.5;
export const LAT_CELL = 3.6;
/** A whole number of cells from the equator, so a grid line runs along it. */
const LAT_EDGE = 22 * LAT_CELL;

export function sphericalPoint(lonDeg: number, latDeg: number, r: number): THREE.Vector3 {
  const phi = lonDeg * DEG;
  const theta = (90 - latDeg) * DEG;
  return new THREE.Vector3(
    -r * Math.cos(phi) * Math.sin(theta),
    r * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

/* Grid lines carry a colour gradient across the globe — blush at the
   top, violet and sky through the middle, peach at the bottom. */
const LINE_STOPS = ["#ff5aa5", "#9a7bff", "#4aa8ff", "#ff9b62"].map((c) => new THREE.Color(c));
const LINE_OPACITY = 0.9;

function lineColour(latDeg: number, lonDeg: number, out: THREE.Color): THREE.Color {
  const t = Math.min(0.999, Math.max(0, (LAT_EDGE - latDeg) / (2 * LAT_EDGE)));
  const shifted = Math.min(0.999, Math.max(0, t + 0.12 * Math.sin(lonDeg * DEG * 2)));
  const seg = shifted * (LINE_STOPS.length - 1);
  const i = Math.floor(seg);
  return out.copy(LINE_STOPS[i]).lerp(LINE_STOPS[i + 1], seg - i);
}

export function gridLines(sheen: SheenUniforms): THREE.LineSegments {
  const r = R * 0.9985;
  const pts: number[] = [];
  const cols: number[] = [];
  const c = new THREE.Color();
  const push = (lonA: number, latA: number, lonB: number, latB: number) => {
    const a = sphericalPoint(lonA, latA, r);
    const b = sphericalPoint(lonB, latB, r);
    pts.push(a.x, a.y, a.z, b.x, b.y, b.z);
    lineColour(latA, lonA, c);
    cols.push(c.r, c.g, c.b);
    lineColour(latB, lonB, c);
    cols.push(c.r, c.g, c.b);
  };
  for (let lon = 0; lon < 360; lon += LON_CELL) {
    for (let lat = -LAT_EDGE; lat < LAT_EDGE; lat += 1.5) push(lon, lat, lon, lat + 1.5);
  }
  for (let lat = -LAT_EDGE; lat <= LAT_EDGE + 0.01; lat += LAT_CELL) {
    for (let lon = 0; lon < 360; lon += 2) push(lon, lat, lon + 2, lat);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
  return new THREE.LineSegments(geo, lineMaterial(sheen));
}

/* The grid's own colours, shifted through the reversed palette where
   the sheen passes — the gradient visibly rolls through the lines. */
function lineMaterial(sheen: SheenUniforms): THREE.ShaderMaterial {
  const material = new THREE.ShaderMaterial({
    fog: true,
    transparent: true,
    vertexColors: true,
    uniforms: THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { uOpacity: { value: LINE_OPACITY } }]),
    vertexShader: /* glsl */ `
      #include <common>
      #include <fog_pars_vertex>
      ${SHEEN_VERTEX_PARS}
      varying vec3 vLine;
      void main() {
        vLine = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        ${SHEEN_VERTEX}
        #include <fog_vertex>
      }
    `,
    fragmentShader: /* glsl */ `
      #include <common>
      #include <fog_pars_fragment>
      ${SHEEN_FRAGMENT_PARS}
      uniform float uOpacity;
      varying vec3 vLine;
      void main() {
        float band = sheenBand();
        float glow = cursorGlow();
        vec3 colour = mix(vLine, sheenColour(-1.0), band * 0.85);
        // Near the pointer the lines deepen into a richer, brighter gradient.
        colour = mix(colour, cursorColour(), glow);
        float alpha = uOpacity * (1.0 - 0.25 * (1.0 - glow)) + band * 0.1 + glow * 0.25;
        gl_FragColor = vec4(colour, min(1.0, alpha));
        #include <colorspace_fragment>
        #include <fog_fragment>
      }
    `,
  });
  return withSheen(material, sheen);
}

/* A white, pearl-like globe: pure white face, a soft iridescent rim
   where the surface turns away, and the scene fog toward the horizon. */
export function pearlMaterial(sheen: SheenUniforms): THREE.ShaderMaterial {
  const material = new THREE.ShaderMaterial({
    fog: true,
    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      {
        uBase: { value: new THREE.Color("#ffffff") },
        uRimTop: { value: new THREE.Color("#e9d9ff") },
        uRimBottom: { value: new THREE.Color("#ffdcea") },
      },
    ]),
    vertexShader: /* glsl */ `
      #include <common>
      #include <fog_pars_vertex>
      ${SHEEN_VERTEX_PARS}
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vView = normalize(-mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
        ${SHEEN_VERTEX}
        #include <fog_vertex>
      }
    `,
    fragmentShader: /* glsl */ `
      #include <common>
      #include <fog_pars_fragment>
      ${SHEEN_FRAGMENT_PARS}
      uniform vec3 uBase;
      uniform vec3 uRimTop;
      uniform vec3 uRimBottom;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        float rim = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.4);
        vec3 rimColour = mix(uRimBottom, uRimTop, 0.5 + 0.5 * vNormal.y);
        vec3 pearl = mix(uBase, rimColour, rim * 0.9);
        pearl = mix(pearl, sheenColour(1.0), sheenBand() * 0.38);
        // A faint wash of colour on the surface under the pointer.
        gl_FragColor = vec4(mix(pearl, cursorColour(), cursorGlow() * 0.07), 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }
    `,
  });
  return withSheen(material, sheen);
}


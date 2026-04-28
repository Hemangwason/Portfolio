// Ghost color variants. The original "Boo" stays first as the default so
// returning visitors who haven't picked still see the same friend they did
// before this feature shipped.

export type GhostAccessory =
  | "tophat-bowtie"
  | "flower-crown"
  | "beanie"
  | "cowboy"
  | "round-glasses"
  | "headphones-shades";

export type GhostExpression =
  /** Default round eyes + small "o" mouth */
  | "neutral"
  /** Closed crescent eyes + tiny smile (sophisticated, content) */
  | "smile"
  /** Heart-shaped eyes + dot mouth (smitten) */
  | "hearts"
  /** Half-closed chill eyes + smirk (skater) */
  | "smirk"
  /** Wide round eyes + small "o" (curious scholar) */
  | "wide"
  /** Hidden eyes (covered by shades) + cool flat mouth */
  | "cool"
  /** Both eyes briefly closed — used as a momentary blink between others */
  | "blink"
  /** Left eye closed + right eye open + tiny smile */
  | "wink"
  /** Cool variant w/ a small "o" singing mouth — used by Noir */
  | "sing";

export type GhostVariant = {
  id: string;
  name: string;
  /** [center, mid, edge] body radial-gradient stops at 0% / 55% / 100% */
  body: [string, string, string];
  /** [center, mid, edge] cheek radial-gradient stops at 0% / 55% / 100% */
  cheek: [string, string, string];
  /** Iris fill */
  eye: string;
  /** Tiny highlight inside the eye — flips dark on the noir variant */
  eyeHighlight: string;
  /** Pill / accent color for the floating "take me along" hint */
  hint: string;
  /** Personality accessory rendered on top of the body */
  accessory: GhostAccessory;
  /** Eyes + mouth combo — character is mostly carried by this */
  expression: GhostExpression;
  /** Looped sequence the picker tile rotates through to feel alive.
   *  Includes the base `expression` plus a couple of variations so each
   *  ghost has its own little mood swing. Blinks are interleaved by the
   *  picker, so don't add them here. */
  cycle: GhostExpression[];
  /** One-word vibe shown under the name in the picker */
  vibe: string;
};

export const GHOST_VARIANTS: GhostVariant[] = [
  {
    id: "boo",
    name: "Boo",
    body: ["#FFFFFF", "#F9FAFF", "#D5DDF2"],
    cheek: [
      "rgba(251,113,133,0.85)",
      "rgba(253,164,175,0.55)",
      "rgba(254,205,211,0)",
    ],
    eye: "#1E293B",
    eyeHighlight: "#FFFFFF",
    hint: "#3D5AFE",
    accessory: "tophat-bowtie",
    expression: "smile",
    cycle: ["smile", "wink", "smile", "neutral"],
    vibe: "gentleman",
  },
  {
    id: "lav",
    name: "Lav",
    body: ["#FBF7FF", "#E8DBFF", "#B59CE8"],
    cheek: [
      "rgba(168,85,247,0.85)",
      "rgba(192,132,252,0.55)",
      "rgba(216,180,254,0)",
    ],
    eye: "#2E1065",
    eyeHighlight: "#FFFFFF",
    hint: "#7C3AED",
    accessory: "flower-crown",
    expression: "hearts",
    cycle: ["hearts", "smile", "hearts", "wink"],
    vibe: "florist",
  },
  {
    id: "mint",
    name: "Mint",
    body: ["#F2FFF8", "#D2F4DF", "#8AD4B0"],
    cheek: [
      "rgba(16,185,129,0.85)",
      "rgba(74,222,128,0.55)",
      "rgba(187,247,208,0)",
    ],
    eye: "#052E16",
    eyeHighlight: "#FFFFFF",
    hint: "#10B981",
    accessory: "beanie",
    expression: "smirk",
    cycle: ["smirk", "wink", "smirk", "smile"],
    vibe: "skater",
  },
  {
    id: "peach",
    name: "Peach",
    body: ["#FFF8F2", "#FFDFC8", "#F0A589"],
    cheek: [
      "rgba(244,114,89,0.85)",
      "rgba(252,165,140,0.55)",
      "rgba(254,215,170,0)",
    ],
    eye: "#3F1208",
    eyeHighlight: "#FFFFFF",
    hint: "#F97316",
    accessory: "cowboy",
    expression: "neutral",
    cycle: ["neutral", "smirk", "wide", "smile"],
    vibe: "wrangler",
  },
  {
    id: "sky",
    name: "Sky",
    body: ["#F2FAFF", "#CFEAFF", "#94C7F0"],
    cheek: [
      "rgba(56,189,248,0.85)",
      "rgba(125,211,252,0.55)",
      "rgba(186,230,253,0)",
    ],
    eye: "#0C2540",
    eyeHighlight: "#FFFFFF",
    hint: "#0EA5E9",
    accessory: "round-glasses",
    expression: "wide",
    cycle: ["wide", "smile", "wide", "neutral"],
    vibe: "scholar",
  },
  {
    id: "noir",
    name: "Noir",
    body: ["#52525B", "#27272A", "#09090B"],
    cheek: [
      "rgba(244,114,182,0.85)",
      "rgba(249,168,212,0.55)",
      "rgba(251,207,232,0)",
    ],
    eye: "#FAFAFA",
    eyeHighlight: "#1E293B",
    hint: "#EC4899",
    accessory: "headphones-shades",
    expression: "cool",
    // Eyes are hidden by the shades, so the cycle works the mouth instead —
    // cool flat line → singing "o" → cool. No blinks for noir; nothing to see.
    cycle: ["cool", "sing", "cool"],
    vibe: "rockstar",
  },
];

export const DEFAULT_VARIANT = GHOST_VARIANTS[0];

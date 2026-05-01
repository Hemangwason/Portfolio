"use client";

import type { JSX } from "react";

// Bespoke per-project icons. Each is a small SVG illustration built
// with multi-stop gradients + a highlight shape to approximate the
// "candy 3D" look (glossy plastic, lit from above, soft shadow).
// Every icon shares the same 32×32 viewBox so they sit on the rail
// at a consistent perceived size, and uses inline `<defs>` with
// id-prefixed gradient ids to avoid SVG-id collisions across icons.

type Props = { id: string; size?: number };

export function ProjectIcon({ id, size = 28 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", overflow: "visible" }}
    >
      {renderIcon(id)}
    </svg>
  );
}

function renderIcon(id: string): JSX.Element | null {
  switch (id) {
    case "sidetake":
      return <Sidetake />;
    case "sidetalk":
      return <SideTalk />;
    case "boomerang":
      return <Boomerang />;
    case "jexlin":
      return <Jexlin />;
    case "crater":
      return <Crater />;
    case "sid-voice-host":
      return <SidVoiceHost />;
    case "healthy-high-five":
      return <HealthyHighFive />;
    case "independence-day-banner":
      return <IndependenceDayBanner />;
    case "asia-cup-2025":
      return <AsiaCup />;
    case "goat-offers-bumrah":
      return <GoatOffers />;
    case "durga-puja-pandal":
      return <DurgaPuja />;
    case "zomato-plus-identity":
      return <ZomatoPlus />;
    default:
      return null;
  }
}

// Shared little helper: a soft white highlight blob laid near the top-
// left of any icon to suggest a single overhead light source. Pass
// rx/ry/cx/cy and we'll draw an ellipse with a fade.
function Shine({ cx, cy, rx, ry, opacity = 0.55 }: { cx: number; cy: number; rx: number; ry: number; opacity?: number }) {
  return (
    <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="white" opacity={opacity} style={{ filter: "blur(0.3px)" }} />
  );
}

// 1. Sidetake — a faceted gem. Two halves with different gradient
// orientations create the classic "2-tone gem" facet split.
function Sidetake() {
  return (
    <>
      <defs>
        <linearGradient id="st-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a5f3fc" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient id="st-b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#155e75" />
        </linearGradient>
      </defs>
      <path d="M16 3 L28 12 L16 29 L4 12 Z" fill="url(#st-a)" />
      <path d="M16 3 L16 29 L4 12 Z" fill="url(#st-b)" opacity="0.85" />
      <path d="M16 3 L20 9 L12 9 Z" fill="white" opacity="0.55" />
    </>
  );
}

// 2. SideTalk — rounded speech bubble with a tail at bottom-left.
function SideTalk() {
  return (
    <>
      <defs>
        <linearGradient id="sk-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <path
        d="M6 6 H26 A3 3 0 0 1 29 9 V20 A3 3 0 0 1 26 23 H13 L7 28 V23 H6 A3 3 0 0 1 3 20 V9 A3 3 0 0 1 6 6 Z"
        fill="url(#sk-a)"
      />
      <Shine cx={11} cy={11} rx={6} ry={2} opacity={0.5} />
      <circle cx={10} cy={14.5} r={1.4} fill="white" opacity={0.85} />
      <circle cx={16} cy={14.5} r={1.4} fill="white" opacity={0.85} />
      <circle cx={22} cy={14.5} r={1.4} fill="white" opacity={0.85} />
    </>
  );
}

// 3. Boomerang — chunky V with two thick arms and a clear elbow,
// rendered with a wood-grain-style three-stop gradient. Angled so
// both arms read as distinct objects rather than one streak.
function Boomerang() {
  return (
    <>
      <defs>
        <linearGradient id="bm-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="55%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#7c2d12" />
        </linearGradient>
        <linearGradient id="bm-rim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity={0.7} />
          <stop offset="100%" stopColor="white" stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* L-shaped boomerang: top-left arm + bottom-right arm meeting
          at a thick elbow near the middle. */}
      <path
        d="M3 8
           Q3 5 6 5
           L11 5
           Q14 5 15 8
           L17 14
           Q18 16 20 17
           L26 19
           Q29 20 28 23
           L26 27
           Q25 29 22 28
           L15 25
           Q12 24 11 21
           L4 11
           Q3 10 3 8 Z"
        fill="url(#bm-a)"
      />
      {/* Top-edge rim highlight tracing both arms. */}
      <path
        d="M5 6 L11 6 Q13 6 14 8 L16 13 Q17 15 19 16 L25 18"
        stroke="url(#bm-rim)"
        strokeWidth={1.4}
        strokeLinecap="round"
        fill="none"
      />
      {/* Inner arc highlight catching the elbow. */}
      <path
        d="M14 12 Q16 14 17 16"
        stroke="white"
        strokeWidth={0.8}
        strokeLinecap="round"
        fill="none"
        opacity={0.55}
      />
    </>
  );
}

// 4. Jexlin — folded t-shirt body + collar dip.
function Jexlin() {
  return (
    <>
      <defs>
        <linearGradient id="jx-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="jx-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bfdbfe" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <path
        d="M11 5 L8 4 L2 9 L5 13 L8 11 V27 A2 2 0 0 0 10 29 H22 A2 2 0 0 0 24 27 V11 L27 13 L30 9 L24 4 L21 5 Q16 9 11 5 Z"
        fill="url(#jx-a)"
      />
      <path
        d="M11 5 Q16 9 21 5 L20 6 Q16 10 12 6 Z"
        fill="#0c1e4d"
        opacity={0.5}
      />
      <Shine cx={12} cy={14} rx={3} ry={6} opacity={0.35} />
    </>
  );
}

// 5. Crater — heater-shield silhouette with a banner stripe.
function Crater() {
  return (
    <>
      <defs>
        <linearGradient id="cr-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="100%" stopColor="#9f1239" />
        </linearGradient>
        <linearGradient id="cr-b" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <path
        d="M16 3 L27 6 V16 Q27 24 16 30 Q5 24 5 16 V6 Z"
        fill="url(#cr-a)"
      />
      <path d="M5 13 H27 V18 H5 Z" fill="url(#cr-b)" opacity={0.95} />
      <path
        d="M16 3 L24 5.5 Q20 9 16 9 Q12 9 8 5.5 Z"
        fill="white"
        opacity={0.4}
      />
    </>
  );
}

// 6. Sid Voice Host — capsule mic on a thin stand.
function SidVoiceHost() {
  return (
    <>
      <defs>
        <linearGradient id="mc-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="40%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="mc-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a3a3a3" />
          <stop offset="100%" stopColor="#404040" />
        </linearGradient>
      </defs>
      <rect x={11} y={3} width={10} height={17} rx={5} fill="url(#mc-a)" />
      <rect x={13} y={5} width={2} height={13} rx={1} fill="white" opacity={0.45} />
      <path
        d="M8 14 H10 V16 A6 6 0 0 0 22 16 V14 H24 V16 A8 8 0 0 1 17 23.9 V27 H22 V29 H10 V27 H15 V23.9 A8 8 0 0 1 8 16 Z"
        fill="url(#mc-b)"
      />
    </>
  );
}

// 7. Healthy High-Five — open palm with four fingers + thumb. Each
// finger is its own rounded pill so they read as distinct digits at
// any size; the palm is a separate rounded base joining them.
function HealthyHighFive() {
  return (
    <>
      <defs>
        <linearGradient id="hf-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fed7aa" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="hf-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdba74" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
      </defs>
      {/* Palm + wrist — anchors the fingers. */}
      <path
        d="M7 17 Q7 13 11 13 H22 Q26 13 26 17 V21 Q26 29 16.5 30 Q7 29 7 21 Z"
        fill="url(#hf-a)"
      />
      {/* Thumb — angled out from the palm's left side. */}
      <path
        d="M5 14 Q3 16 4 19 Q5 21 7 20 Q8 17 9 15 Q8 13 5 14 Z"
        fill="url(#hf-b)"
      />
      {/* Four fingers — discrete rounded rectangles at varying heights
          so the silhouette reads as a hand rather than a paddle. */}
      <rect x={9} y={6} width={3} height={9} rx={1.5} fill="url(#hf-b)" />
      <rect x={12.5} y={3} width={3} height={12} rx={1.5} fill="url(#hf-a)" />
      <rect x={16} y={3.5} width={3} height={11.5} rx={1.5} fill="url(#hf-a)" />
      <rect x={19.5} y={5.5} width={3} height={9.5} rx={1.5} fill="url(#hf-b)" />
      {/* Soft palm-creases highlight. */}
      <path
        d="M11 19 Q16 21 22 19"
        stroke="#9a3412"
        strokeWidth={0.5}
        strokeLinecap="round"
        fill="none"
        opacity={0.45}
      />
      <Shine cx={13} cy={18} rx={4} ry={2} opacity={0.4} />
    </>
  );
}

// 8. Independence Day Banner — tricolor with subtle wave.
function IndependenceDayBanner() {
  return (
    <>
      <defs>
        <linearGradient id="fg-saffron" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdba74" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="fg-green" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
      </defs>
      <rect x={4} y={3} width={1.5} height={26} rx={0.75} fill="#475569" />
      <path
        d="M5 4 Q15 2 26 5 V11 Q15 8 5 11 Z"
        fill="url(#fg-saffron)"
      />
      <path
        d="M5 11 Q15 8 26 11 V17 Q15 14 5 17 Z"
        fill="white"
      />
      <path
        d="M5 17 Q15 14 26 17 V23 Q15 20 5 23 Z"
        fill="url(#fg-green)"
      />
      <circle cx={15.5} cy={14} r={1.6} fill="none" stroke="#1e3a8a" strokeWidth={0.5} />
    </>
  );
}

// 9. Asia Cup 2025 — cricket bat in the foreground at a 25° lean,
// with a leather ball tucked at its base. Bigger blade, distinct
// handle/shoulder/blade transition so the silhouette reads even at
// 22px. Ball sits to the right with seam stitching.
function AsiaCup() {
  return (
    <>
      <defs>
        <linearGradient id="bt-blade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <linearGradient id="bt-grip" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <radialGradient id="bl-a" cx="0.35" cy="0.35" r="0.75">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="60%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </radialGradient>
      </defs>
      <g transform="rotate(22 16 16)">
        {/* Grip — top of the handle. */}
        <rect x={14} y={2} width={4} height={6} rx={1.4} fill="url(#bt-grip)" />
        {/* Subtle grip-tape ribs. */}
        <rect x={14.4} y={3.5} width={3.2} height={0.4} fill="white" opacity={0.25} />
        <rect x={14.4} y={5} width={3.2} height={0.4} fill="white" opacity={0.25} />
        {/* Shoulder — narrow taper from handle to blade. */}
        <path d="M14 8 H18 L19 11 H13 Z" fill="#1e293b" />
        {/* Blade — wide, slightly tapered toe. */}
        <path
          d="M11.5 11 H20.5 L21.5 24 Q21.5 27 16 27 Q10.5 27 10.5 24 Z"
          fill="url(#bt-blade)"
        />
        {/* Sweet-spot edge highlight. */}
        <rect x={12.5} y={12} width={1.2} height={13} rx={0.6} fill="white" opacity={0.55} />
        {/* Toe shadow. */}
        <path
          d="M11 24 Q11 27 16 27 Q21 27 21 24 Z"
          fill="#451a03"
          opacity={0.35}
        />
      </g>
      {/* Cricket ball — bottom-right of the icon, big enough to read. */}
      <g>
        <circle cx={24.5} cy={25} r={4.2} fill="url(#bl-a)" />
        {/* Seam — twin curves of stitching. */}
        <path
          d="M21 24.2 Q24.5 22.5 28 24.2"
          stroke="#fef3c7"
          strokeWidth={0.5}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M21 25.8 Q24.5 27.5 28 25.8"
          stroke="#fef3c7"
          strokeWidth={0.5}
          strokeLinecap="round"
          fill="none"
        />
        {/* Tiny stitch ticks. */}
        {[22.5, 24.5, 26.5].map((x, i) => (
          <line
            key={i}
            x1={x}
            y1={23.7}
            x2={x}
            y2={26.3}
            stroke="#fef3c7"
            strokeWidth={0.3}
            opacity={0.7}
          />
        ))}
      </g>
    </>
  );
}

// 10. GOAT Offers — flame teardrop with inner core.
function GoatOffers() {
  return (
    <>
      <defs>
        <linearGradient id="fl-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="40%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
        <linearGradient id="fl-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <path
        d="M16 2 Q22 8 22 13 Q26 17 26 22 Q26 30 16 30 Q6 30 6 22 Q6 17 10 14 Q11 10 13 8 Q13 12 15 12 Q15 6 16 2 Z"
        fill="url(#fl-a)"
      />
      <path
        d="M16 12 Q19 16 19 20 Q19 26 16 26 Q12 26 12 21 Q12 17 14 15 Q15 16 16 16 Z"
        fill="url(#fl-b)"
      />
    </>
  );
}

// 11. Durga Puja — diya (oil lamp) with a flame above.
function DurgaPuja() {
  return (
    <>
      <defs>
        <linearGradient id="dy-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdba74" />
          <stop offset="100%" stopColor="#7c2d12" />
        </linearGradient>
        <linearGradient id="dy-flame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <path
        d="M16 8 Q19 11 19 14 Q19 17 16 17 Q13 17 13 14 Q13 11 16 8 Z"
        fill="url(#dy-flame)"
      />
      <path
        d="M3 19 Q3 16 5 16 H27 Q29 16 29 19 Q27 27 16 27 Q5 27 3 19 Z"
        fill="url(#dy-a)"
      />
      <path d="M5 18 H27" stroke="white" strokeWidth={0.7} opacity={0.55} />
      <ellipse cx={16} cy={17.5} rx={1.5} ry={0.8} fill="#7c2d12" opacity={0.6} />
    </>
  );
}

// 12. Zomato Plus — lightning bolt.
function ZomatoPlus() {
  return (
    <>
      <defs>
        <linearGradient id="lt-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="100%" stopColor="#be123c" />
        </linearGradient>
      </defs>
      <path
        d="M19 2 L7 18 H14 L11 30 L25 12 H17 Z"
        fill="url(#lt-a)"
      />
      <path
        d="M19 2 L13 12 L17 12 Z"
        fill="white"
        opacity={0.4}
      />
    </>
  );
}

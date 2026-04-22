type Variant = "aurora" | "ribbon" | "orb" | "dunes" | "lagoon" | "violet";

type Props = {
  variant?: Variant;
  className?: string;
  seed?: number;
};

const defs: Record<Variant, React.ReactNode> = {
  aurora: (
    <>
      <defs>
        <radialGradient id="g-a-1" cx="30%" cy="28%" r="55%">
          <stop offset="0%" stopColor="#A5B4FC" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#A5B4FC" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="g-a-2" cx="75%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#C4B5FD" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="g-a-3" cx="55%" cy="80%" r="50%">
          <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#93C5FD" stopOpacity="0" />
        </radialGradient>
        <filter id="blur-a" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="#F5F3FF" />
      <g filter="url(#blur-a)">
        <rect width="100%" height="100%" fill="url(#g-a-1)" />
        <rect width="100%" height="100%" fill="url(#g-a-2)" />
        <rect width="100%" height="100%" fill="url(#g-a-3)" />
      </g>
    </>
  ),
  ribbon: (
    <>
      <defs>
        <linearGradient id="g-r-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="50%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
        <radialGradient id="g-r-2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#EEF2FF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#EEF2FF" stopOpacity="0" />
        </radialGradient>
        <filter id="blur-r" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="#EEF2FF" />
      <g filter="url(#blur-r)">
        <path
          d="M -20 140 Q 100 40 220 140 T 440 140 L 440 240 L -20 240 Z"
          fill="url(#g-r-1)"
          opacity="0.75"
        />
        <circle cx="340" cy="60" r="100" fill="url(#g-r-2)" />
      </g>
    </>
  ),
  orb: (
    <>
      <defs>
        <radialGradient id="g-o-1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="50%" stopColor="#DDD6FE" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.35" />
        </radialGradient>
        <radialGradient id="g-o-2" cx="42%" cy="36%" r="22%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="#F5F3FF" />
      <circle cx="220" cy="140" r="110" fill="url(#g-o-1)" />
      <circle cx="220" cy="140" r="110" fill="url(#g-o-2)" />
    </>
  ),
  dunes: (
    <>
      <defs>
        <linearGradient id="g-d-1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#EEF2FF" />
          <stop offset="100%" stopColor="#C7D2FE" />
        </linearGradient>
        <radialGradient id="g-d-2" cx="80%" cy="20%" r="40%">
          <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
        </radialGradient>
        <filter id="blur-d" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#g-d-1)" />
      <g filter="url(#blur-d)">
        <path
          d="M 0 180 Q 110 110 220 170 T 440 160 L 440 280 L 0 280 Z"
          fill="#818CF8"
          opacity="0.45"
        />
        <path
          d="M 0 220 Q 100 160 220 210 T 440 200 L 440 280 L 0 280 Z"
          fill="#6366F1"
          opacity="0.35"
        />
        <rect width="100%" height="100%" fill="url(#g-d-2)" />
      </g>
    </>
  ),
  lagoon: (
    <>
      <defs>
        <radialGradient id="g-l-1" cx="30%" cy="70%" r="60%">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="g-l-2" cx="70%" cy="30%" r="45%">
          <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
        </radialGradient>
        <filter id="blur-l" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="24" />
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="#EFF6FF" />
      <g filter="url(#blur-l)">
        <circle cx="140" cy="200" r="120" fill="url(#g-l-1)" />
        <circle cx="320" cy="90" r="100" fill="url(#g-l-2)" />
      </g>
    </>
  ),
  violet: (
    <>
      <defs>
        <linearGradient id="g-v-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C4B5FD" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <radialGradient id="g-v-2" cx="70%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <filter id="blur-v" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="#F5F3FF" />
      <g filter="url(#blur-v)">
        <path
          d="M -20 220 Q 100 60 240 160 T 460 80 L 460 280 L -20 280 Z"
          fill="url(#g-v-1)"
          opacity="0.7"
        />
        <rect width="100%" height="100%" fill="url(#g-v-2)" />
      </g>
    </>
  ),
};

const variantOrder: Variant[] = [
  "aurora",
  "ribbon",
  "orb",
  "dunes",
  "lagoon",
  "violet",
];

export function GradientMesh({ variant, className, seed = 0 }: Props) {
  const picked = variant ?? variantOrder[seed % variantOrder.length];
  return (
    <svg
      viewBox="0 0 440 280"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden
    >
      {defs[picked]}
    </svg>
  );
}

export function variantFor(seed: number): Variant {
  return variantOrder[seed % variantOrder.length];
}

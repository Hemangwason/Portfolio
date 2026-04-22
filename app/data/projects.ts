export type Project = {
  id: string;
  title: string;
  tagline: string;
  kind: "play" | "ground";
  year: string;
  tags: string[];
  accent: string;
  emoji: string;
  blurb: string;
};

export const projects: Project[] = [
  {
    id: "orbit-os",
    title: "Orbit OS",
    tagline: "Operating system for creative teams",
    kind: "ground",
    year: "2025",
    tags: ["Product", "B2B", "SaaS"],
    accent: "var(--accent-sky)",
    emoji: "🛰",
    blurb:
      "Redesigned the core navigation for a cross-functional workspace — shipped with a 37% lift in weekly active usage.",
  },
  {
    id: "mango-bank",
    title: "Mango Bank",
    tagline: "A friendly neobank for freelancers",
    kind: "ground",
    year: "2024",
    tags: ["Fintech", "Mobile", "Onboarding"],
    accent: "var(--accent-lemon)",
    emoji: "🥭",
    blurb:
      "From empty-state to first-invoice in under three minutes. Card issuance flow reworked end-to-end.",
  },
  {
    id: "signal-health",
    title: "Signal Health",
    tagline: "Calm triage for nurses, not doctors",
    kind: "ground",
    year: "2024",
    tags: ["Healthcare", "Enterprise"],
    accent: "var(--accent-mint)",
    emoji: "🩺",
    blurb:
      "Research-led redesign of a bedside triage tool used by 4,000+ nurses across 11 hospitals.",
  },
  {
    id: "lunchbox",
    title: "Lunchbox",
    tagline: "A tiny app for big lunch decisions",
    kind: "ground",
    year: "2023",
    tags: ["Consumer", "iOS"],
    accent: "var(--accent-coral)",
    emoji: "🥡",
    blurb:
      "Swipe-based meal roulette for indecisive office teams. 12k weekly swipes in the first month.",
  },
  {
    id: "sidetake-studio",
    title: "Sidetake Studio",
    tagline: "A second-brain for founders",
    kind: "ground",
    year: "2025",
    tags: ["Tools", "AI"],
    accent: "var(--accent-lilac)",
    emoji: "🧠",
    blurb:
      "Experimental product for turning voice notes into structured product briefs, spec docs, and cap-table memos.",
  },
  {
    id: "ferry-wayfinding",
    title: "Ferry Wayfinding",
    tagline: "City ferry terminal signage system",
    kind: "play",
    year: "2023",
    tags: ["Wayfinding", "Type", "Print"],
    accent: "var(--accent-sky)",
    emoji: "⛴",
    blurb:
      "Commuter-tested icon + type system for a Mumbai ferry terminal — shipped across 42 physical signs.",
  },
  {
    id: "mixtape-posters",
    title: "Mixtape Posters",
    tagline: "52 posters, 52 weeks, one song each",
    kind: "play",
    year: "2024",
    tags: ["Poster", "Typography"],
    accent: "var(--accent-pink)",
    emoji: "🎧",
    blurb:
      "A year-long series — one poster a week, each interpreting a song I couldn't stop playing.",
  },
  {
    id: "zine-dispatch",
    title: "Dispatch Zine",
    tagline: "A risograph zine about nothing",
    kind: "play",
    year: "2022",
    tags: ["Print", "Illustration", "Riso"],
    accent: "var(--accent-lemon)",
    emoji: "📰",
    blurb:
      "Three issues of a two-color riso zine. Shipped to 300 pen-pals across 14 countries.",
  },
  {
    id: "moving-things",
    title: "Moving Things",
    tagline: "Loops, bounces, squishes",
    kind: "play",
    year: "2024",
    tags: ["Motion", "Loops"],
    accent: "var(--accent-mint)",
    emoji: "🌀",
    blurb:
      "A playground of Lottie loops and SVG experiments. Lives on the homepage — hover the cards.",
  },
  {
    id: "tiny-type",
    title: "Tiny Type",
    tagline: "A variable display face",
    kind: "play",
    year: "2025",
    tags: ["Type design", "Variable"],
    accent: "var(--accent-coral)",
    emoji: "✒️",
    blurb:
      "A chunky, bouncy display typeface with a single weight axis. Still in drawing mode.",
  },
  {
    id: "hello-stickers",
    title: "Hello Stickers",
    tagline: "Mascots for a stationery brand",
    kind: "play",
    year: "2023",
    tags: ["Illustration", "Branding"],
    accent: "var(--accent-lilac)",
    emoji: "🐱",
    blurb:
      "14 character designs turned into vinyl stickers, packed in with every order for six months.",
  },
  {
    id: "field-notes",
    title: "Field Notes App",
    tagline: "Offline journaling for walkers",
    kind: "ground",
    year: "2022",
    tags: ["Mobile", "Consumer"],
    accent: "var(--accent-pink)",
    emoji: "🍃",
    blurb:
      "Designed a quiet, text-first journaling app for long walks. Zero notifications, ever.",
  },
];

export const productProjects = projects.filter((p) => p.kind === "ground");
export const visualProjects = projects.filter((p) => p.kind === "play");

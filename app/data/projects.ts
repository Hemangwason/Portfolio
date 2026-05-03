export type ProjectMedia =
  | { type: "image"; src: string; alt?: string; bg?: string }
  | { type: "video"; src: string; poster?: string; bg?: string };

export type ProjectCountry = { flag: string; label: string };

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
  /** Thumbnail shown on the card. If absent, falls back to a gradient mesh. */
  thumbnail?: ProjectMedia;
  /** Masthead at the top of the modal — preferably a short looping video. */
  masthead?: ProjectMedia;
  /** Long-form paragraphs shown in the modal body. */
  writeup: string[];
  role?: string;
  team?: string;
  client?: string;
  /** Override the meta label for `client` (default: "Client"). */
  clientLabel?: string;
  /** Origin chip shown bottom-right of the card thumbnail. Defaults to India. */
  country?: ProjectCountry;
  link?: { label: string; href: string };
};

export const projects: Project[] = [
  {
    id: "sidetake",
    title: "Sidetake",
    tagline: "A dark, quiet instrument for creative flow",
    kind: "ground",
    year: "2026",
    tags: ["Focus", "iOS", "Consumer"],
    accent: "var(--brand)",
    emoji: "💎",
    blurb:
      "A focus instrument built around five creative states \u2014 Referencing, Ideation, Execution, Editing, Drift \u2014 that remembers the shape of your day and shows it back without judgment.",
    role: "Founding designer",
    client: "Sidetake",
    thumbnail: {
      type: "video",
      src: "/projects/thumbs/sidetake.mp4",
      poster: "/projects/thumbs/sidetake-poster.jpg",
      bg: "#02040A",
    },
    masthead: {
      type: "video",
      src: "/projects/sidetake.mp4",
      poster: "/projects/sidetake-poster.jpg",
      bg: "#02040A",
    },
    writeup: [
      "Sidetake hangs on one decision: stop logging tasks, start logging five stages of creative process \u2014 Referencing, Ideation, Execution, Editing, Drift. The Learn-from-the-Best layer turns those stages into something social \u2014 you can browse a real creator\u2019s actual day, see exactly how their twelve hours split, and book the time to talk to the person whose flow you want to copy. Three months in, testers had stopped asking for streaks and started describing themselves in Gem vocabulary \u2014 \u2018crashed to Calibrate this morning.\u2019 That private language was the point.",
    ],
  },
  {
    id: "sidetalk",
    title: "SideTalk",
    tagline: "Designing a more natural way to learn",
    kind: "ground",
    year: "2026",
    tags: ["Learning", "Community", "Mentorship"],
    accent: "var(--brand)",
    emoji: "💬",
    blurb:
      "A chat-first learning platform where creative students ask real questions, share work-in-progress, and get guidance from mentors and peers inside structured communities.",
    role: "Founding designer",
    client: "Sidetake",
    thumbnail: {
      type: "video",
      src: "/projects/thumbs/sidetalk.mp4",
      poster: "/projects/thumbs/sidetalk-poster.jpg",
      bg: "#FFFFFF",
    },
    masthead: {
      type: "video",
      src: "/projects/sidetalk.mp4",
      poster: "/projects/sidetalk-poster.jpg",
      bg: "#E4E9F5",
    },
    writeup: [
      "SideTalk is a chat-first learning platform for creative students \u2014 ask real questions, share work-in-progress, and get guidance from mentors and peers inside structured communities. The design move was to collapse the distance between curiosity and action: no formal mentorship rituals, no waiting weeks for replies, just ask in the channel where the people slightly ahead of you already hang out. The product feels closer to a group chat than a course platform on purpose \u2014 guidance that doesn\u2019t feel gated, delayed, or intimidating, and a place to learn in public instead of consuming content alone.",
    ],
  },
  {
    id: "boomerang",
    title: "Boomerang",
    tagline: "Alumni rehiring as a live, ranked pipeline",
    kind: "ground",
    year: "2026",
    tags: ["AI", "B2B", "Hiring", "Hackathon"],
    accent: "var(--brand)",
    emoji: "🪃",
    blurb:
      "AI scores every former employee 0\u2013100, surfaces a \u201Cwhy now\u201D signal, and drafts the re-engagement message \u2014 designed and shipped in under five hours at ContextCon.",
    role: "Solo designer \u00B7 front-end",
    client: "Boomerang",
    thumbnail: {
      type: "video",
      src: "/projects/thumbs/boomerang.mp4",
      poster: "/projects/thumbs/boomerang-poster.jpg",
      bg: "#D8D6F2",
    },
    masthead: {
      type: "video",
      src: "/projects/boomerang.mp4",
      poster: "/projects/boomerang-poster.jpg",
      bg: "#D8D6F2",
    },
    writeup: [
      "Boomerang is an AI-powered alumni rehiring platform built in under five hours for ContextCon. Instead of tracking former employees on LinkedIn one-by-one, it scores each on their likelihood to return (0\u2013100), surfaces a \u2018why now\u2019 signal, and drafts the re-engagement message \u2014 turning a static alumni list into a live, ranked pipeline. HR software defaults to rows, filters, and status pills; I wanted Boomerang to feel like the system was thinking. Glass on a purple-to-blue wallpaper with drifting orbs, score rings around avatars so the score is the person, JetBrains Mono numbers as proof they were computed. Blank canvas to shipped demo in one afternoon \u2014 exactly the thesis ContextCon set out to prove.",
    ],
  },
  {
    id: "jexlin",
    title: "Jexlin",
    tagline: "Streetwear as a medium for point of view",
    kind: "ground",
    year: "2026",
    tags: ["Brand", "Streetwear", "D2C"],
    accent: "var(--brand)",
    emoji: "👕",
    blurb:
      "A streetwear and accessories label where every touchpoint \u2014 product, visuals, tone, storefront \u2014 extends the same world. Built as a design-led identity system, not a product catalogue.",
    role: "Founding designer",
    client: "Jexlin",
    thumbnail: {
      type: "video",
      src: "/projects/thumbs/jexlin.mp4",
      poster: "/projects/thumbs/jexlin-poster.jpg",
      bg: "#1A1917",
    },
    masthead: {
      type: "video",
      src: "/projects/jexlin.mp4",
      poster: "/projects/jexlin-poster.jpg",
      bg: "#1A1917",
    },
    writeup: [
      "Jexlin is a fashion and accessories label built around self-expression \u2014 streetwear energy, bold visual language, experimental pieces. The ambition was to treat fashion as a medium for point of view, not transactional merch: a label where every piece reads like a sentence in a bigger story. As a designer, that meant treating brand and product as one artifact from day one \u2014 pieces that read like chapters, campaigns that feel narrative rather than catalogue, a storefront where the tone is as considered as the typography. The result isn\u2019t another fashion label fighting for attention in a feed \u2014 it\u2019s a point of view you can put on.",
    ],
  },
  {
    id: "crater",
    title: "Crater",
    tagline: "A defense layer for the AI era",
    kind: "ground",
    year: "2026",
    tags: ["AI", "Security", "B2B"],
    accent: "var(--brand)",
    emoji: "🛡️",
    blurb:
      "A live risk-intelligence layer that detects AI tool usage across browsers, apps, and extensions \u2014 and warns users in the moment of risk instead of after the breach.",
    role: "Founding designer",
    client: "Crater",
    thumbnail: {
      type: "video",
      src: "/projects/thumbs/crater.mp4",
      poster: "/projects/thumbs/crater-poster.jpg",
      bg: "#0B0B0B",
    },
    masthead: {
      type: "video",
      src: "/projects/crater.mp4",
      poster: "/projects/crater-poster.jpg",
      bg: "#0B0B0B",
    },
    writeup: [
      "Crater is a defense layer for the AI era. People paste sensitive data into chatbots, install extensions with full-page permissions, and connect plugins that quietly train on their work \u2014 without understanding retention, sharing, or scope. Traditional security tools don\u2019t see AI-specific risk. Crater sits across the surfaces where AI gets used \u2014 sites, apps, extensions, plugins, enterprise integrations \u2014 detects tool usage in real time, and warns the user in the moment of risk rather than after a breach. Hard blocks get routed around; a trust layer that informs in-context changes behavior more durably than a firewall that says no. AI safety is a horizontal problem, not a vertical product \u2014 exactly the wedge incumbents can\u2019t easily occupy.",
    ],
  },
  {
    id: "sid-voice-host",
    title: "Sid Voice Host",
    tagline: "A voice that opens the room before the host walks on",
    kind: "ground",
    year: "2026",
    tags: ["Art direction", "UI", "Motion"],
    accent: "var(--brand)",
    emoji: "🎙️",
    blurb:
      "Art direction and interface for an AI co-emcee \u2014 a voice that sets the room\u2019s mood before the human host walks on. Two screens, one atmosphere.",
    role: "Brand, art direction, and UI",
    thumbnail: {
      type: "video",
      src: "/projects/thumbs/sid-voice-host.mp4",
      poster: "/projects/thumbs/sid-voice-host-poster.jpg",
      bg: "#E3E7F6",
    },
    masthead: {
      type: "video",
      src: "/projects/sid-voice-host.mp4",
      poster: "/projects/sid-voice-host-poster.jpg",
      bg: "#E3E7F6",
    },
    writeup: [
      "Sid is voice-first: the real output is a presence in a room, not a page on a screen. That inverted the brief \u2014 I wasn\u2019t designing a dashboard but the mood a piece of software sets for the thing about to happen. The screen had to feel like the opening credits, not the film. One sentence above every decision: warm, not clinical. Hosted, not automated. Two states carry the whole product \u2014 a frosted setup card on a drifting ambient gradient, then a near-invisible live readout of what the camera sees and what the agent is saying. The hardest thing to design is a screen that knows when to shut up; the part I\u2019m proudest of isn\u2019t the card, it\u2019s the empty field around it.",
    ],
  },
  {
    id: "healthy-high-five",
    title: "Healthy High-Five",
    tagline: "Making \u201Ceat better\u201D feel like a game you can win",
    kind: "play",
    year: "2026",
    tags: ["Motion", "3D", "Identity", "Lottie"],
    accent: "var(--accent)",
    emoji: "🖐️",
    blurb:
      "Full-funnel in-app reward loop for Zomato's Healthy Mode — four healthy orders in, the fifth is free.",
    role: "Visual + motion designer",
    client: "Zomato",
    clientLabel: "Company",
    thumbnail: {
      type: "video",
      src: "/projects/thumbs/healthy-high-five.mp4",
      poster: "/projects/thumbs/healthy-high-five-poster.jpg",
      bg: "#131C0C",
    },
    masthead: {
      type: "video",
      src: "/projects/healthy-high-five.mp4",
      bg: "#131C0C",
    },
    writeup: [
      "Healthy High-Five was a full-funnel in-app reward built to push adoption of Zomato's Healthy Mode — order four healthy meals, the fifth is free. The challenge wasn't visuals, it was clarity: users needed to get the mechanic in seconds, see where they stand, and feel nudged not nagged. I owned the end-to-end visual system — naming and identity, a badge language that literally shows the \u201Chi-fi / high-five\u201D idea in the collectible itself, a green-forward palette, and a 3D icon set (Blender + Substance Painter) so progress feels tactile rather than ticked. Animated in After Effects, shipped as Lottie. You're not told to order healthy — you're shown your path to the win.",
    ],
  },
  {
    id: "independence-day-banner",
    title: "Independence Day Banner",
    tagline: "A year of wins, told in one smooth scroll",
    kind: "play",
    year: "2025",
    tags: ["Motion", "Banner", "Illustration", "Lottie"],
    accent: "var(--accent)",
    emoji: "🇮🇳",
    blurb:
      "Homepage banner stitching India's milestones into a single celebratory motion journey — anchored by Chandrayaan.",
    role: "Visual + motion designer",
    client: "Zomato",
    clientLabel: "Company",
    thumbnail: {
      type: "video",
      src: "/projects/thumbs/independence-day-banner.mp4",
      poster: "/projects/thumbs/independence-day-banner-poster.jpg",
      bg: "#BDEFFB",
    },
    masthead: {
      type: "video",
      src: "/projects/independence-day-banner.mp4",
      bg: "#BDEFFB",
    },
    writeup: [
      "Goal: not \u201Cput a flag and call it a day,\u201D but a proud recap of India's past year — quick, visual, unmistakable. Cultural anchors (monuments, peacock, kites, festive textures) paired with a modern \u201Cwe're actually doing big things\u201D beat: Chandrayaan. The challenge was balancing celebration with information — read instantly on the home feed, but reward the user with little discoveries as the animation played. Chandrayaan became the narrative spine: everything else was timed to orbit around it, so the banner felt cohesive even while covering multiple symbols. Built in After Effects and Illustrator, composed in Figma, shipped as Lottie.",
    ],
  },
  {
    id: "asia-cup-2025",
    title: "Asia Cup 2025",
    tagline: "A comic-style match in one homepage banner",
    kind: "play",
    year: "2025",
    tags: ["Motion", "AI", "Banner", "Comic"],
    accent: "var(--accent)",
    emoji: "🏏",
    blurb:
      "Turning Zomato's home feed into a mini sports storyboard — powered by AI + motion.",
    role: "Visual + motion designer",
    team: "with Nishant",
    client: "Zomato",
    clientLabel: "Company",
    thumbnail: {
      type: "video",
      src: "/projects/thumbs/asia-cup-2025.mp4",
      poster: "/projects/thumbs/asia-cup-2025-poster.jpg",
      bg: "#070E61",
    },
    masthead: {
      type: "video",
      src: "/projects/asia-cup-2025.mp4",
      bg: "#070E61",
    },
    writeup: [
      "Could we fit an entire \u201Cmatch moment\u201D into one homepage banner — without making it feel like a generic sports poster? With Nishant, we leaned into a comic-book language: tight frames, dramatic close-ups (hello, intense eyes), bold compositions — so even on a scroll-heavy home screen, the narrative reads fast. The real experiment was pushing AI image generation past \u201Cnice visuals\u201D into \u201Cusable system.\u201D We tested multiple models, iterated like crazy, and treated AI outputs as raw material — not final art — so everything could match a consistent comic tone once it entered the motion pipeline. Built across After Effects, Photoshop, Figma, and a lot of AI tooling, shipped as Lottie.",
    ],
  },
  {
    id: "goat-offers-bumrah",
    title: "GOAT Offers \u00D7 Bumrah",
    tagline: "A high-heat homepage banner built around Jasprit Bumrah",
    kind: "play",
    year: "2025",
    tags: ["Motion", "Celebrity", "Banner", "Offers"],
    accent: "var(--accent)",
    emoji: "🔥",
    blurb:
      "Collab homepage moment that made the offer feel fast, focused, and unmissable — with Jasprit Bumrah as the visual anchor.",
    role: "Visual + motion designer",
    client: "Zomato",
    clientLabel: "Company",
    thumbnail: {
      type: "video",
      src: "/projects/thumbs/goat-offers-bumrah.mp4",
      poster: "/projects/thumbs/goat-offers-bumrah-poster.jpg",
      bg: "#1E0003",
    },
    masthead: {
      type: "video",
      src: "/projects/goat-offers-bumrah.mp4",
      bg: "#1E0003",
    },
    writeup: [
      "For Zomato's Asia Cup collab with Jasprit Bumrah (then the No.1 T20 bowler), the brief was clear: match-night adrenaline, without the noise. A fiery red palette and a punchy \u201CGreatest Offers of All Time\u201D framing for instant scroll energy. The real design goal was hierarchy: Bumrah is the hero, the offer legible in one glance, everything else supports the vibe without stealing attention. On motion, the centre stays rigid — Bumrah grounded and tough — while excitement happens around him. High-voltage but disciplined; built to convert attention into taps, not just look cool for three seconds. Built in After Effects and Figma, shipped as Lottie.",
    ],
  },
  {
    id: "durga-puja-pandal",
    title: "Durga Puja Pandal",
    tagline: "A mini entrance, not just a banner",
    kind: "play",
    year: "2025",
    tags: ["Motion", "Banner", "Illustration", "Lottie"],
    accent: "var(--accent)",
    emoji: "🪔",
    blurb:
      "Homepage animation built as a mini entrance — from pandal gates to deity reveal, looping like a real celebration.",
    role: "Visual + motion designer",
    client: "Zomato",
    clientLabel: "Company",
    thumbnail: {
      type: "video",
      src: "/projects/thumbs/durga-puja-pandal.mp4",
      poster: "/projects/thumbs/durga-puja-pandal-poster.jpg",
      bg: "#FAC67D",
    },
    masthead: {
      type: "video",
      src: "/projects/durga-puja-pandal.mp4",
      bg: "#FAC67D",
    },
    writeup: [
      "The concept was beautifully straightforward: don't show a pandal — make the user feel like they're entering one. The arch frames you in, warm reds and textured patterns set the mood, dhaak/dhol energy is hinted through motion cues, and the central deity reveal lands like the main moment. Animation was the hero, so my focus was staging the sequence like a real entrance: foreground elements lead the eye inward, the deity holds centre, and the offer rises from behind in a way that feels ceremonial — not like a UI sticker slapped on top. The loop doesn't feel like a repetitive GIF — it feels like the scene is alive. Built in After Effects and Illustrator, composed in Figma, shipped as Lottie.",
    ],
  },
  {
    id: "zomato-plus-identity",
    title: "Zomato Plus Identity",
    tagline: "A hustle-first face for the business side",
    kind: "play",
    year: "2025",
    tags: ["Identity", "Brand system", "B2B", "Motion"],
    accent: "var(--accent)",
    emoji: "⚡",
    blurb:
      "Multimedia brand system for Zomato Plus — built to scale across partner collaterals and still feel unmistakably Zomato.",
    role: "Identity + visual designer",
    client: "Zomato",
    clientLabel: "Company",
    thumbnail: {
      type: "video",
      src: "/projects/thumbs/zomato-plus-identity.mp4",
      poster: "/projects/thumbs/zomato-plus-identity-poster.jpg",
      bg: "#000000",
    },
    masthead: {
      type: "video",
      src: "/projects/zomato-plus-identity.mp4",
      bg: "#000000",
    },
    writeup: [
      "Zomato Plus is where the brand-to-brand action lives — collabs, partnerships, and business-facing stories with companies like HP. The task was to build a clear identity for Plus that works across business collaterals without becoming a stiff \u201Ccorporate sub-brand.\u201D The direction had to stay aligned with Zomato's newer hustle tone — fast, bold, confident — while behaving like a system clean enough to sit on decks, partner kits, and event assets. The core logo lockup borrows from the hustle vibe (high contrast, energetic type, a slightly raw edge) but keeps enough structure to walk into a partner meeting and not blink. Built across After Effects, Illustrator, and Figma, motion shipped as Lottie.",
    ],
  },
];

export const productProjects = projects.filter((p) => p.kind === "ground");
export const visualProjects = projects.filter((p) => p.kind === "play");

// Hand-curated home-carousel order — alternates ground / play so the
// horizontal swipe never feels like a single-discipline lump. Six is
// the cap; the rest live on /ground and /play.
const FEATURED_IDS = [
  "sidetake", // ground
  "healthy-high-five", // play
  "sidetalk", // ground
  "asia-cup-2025", // play
  "jexlin", // ground
  "independence-day-banner", // play
] as const;

export const featuredProjects: Project[] = FEATURED_IDS.map((id) =>
  projects.find((p) => p.id === id),
).filter((p): p is Project => Boolean(p));

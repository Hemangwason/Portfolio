export type ProjectMedia =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; poster?: string };

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
  link?: { label: string; href: string };
};

export const projects: Project[] = [
  {
    id: "orbit-os",
    title: "Orbit OS",
    tagline: "Operating system for creative teams",
    kind: "ground",
    year: "2025",
    tags: ["Product", "B2B", "SaaS"],
    accent: "var(--brand)",
    emoji: "🛰",
    blurb:
      "Redesigned the core navigation for a cross-functional workspace — shipped with a 37% lift in weekly active usage.",
    role: "Lead product designer",
    team: "2 designers · 5 engineers",
    client: "Orbit (Seed)",
    link: { label: "Visit Orbit", href: "#" },
    writeup: [
      "Orbit is a workspace tool used by product, design, and engineering teams to plan, execute, and review creative work in one place. When I joined, the product had strong primitives — docs, boards, and a lightweight project model — but the navigation was fragmented and first-time users bounced within 90 seconds.",
      "I led a three-month navigation redesign. Research started with 24 customer interviews across 11 teams, paired with session replays for the top quartile of churned trials. We found that the sidebar's mental model (folders) didn't match how teams actually worked (projects, with surfaces inside). I proposed a two-column IA that made projects first-class and surfaces second-class.",
      "The final redesign shipped behind a 50/50 flag in October 2025. Over six weeks, weekly active usage lifted 37%, trial-to-paid grew 19%, and the average time to first published doc dropped from 3.2 days to 14 hours. The system scales cleanly: we've added four new surface types without revisiting the information architecture.",
    ],
  },
  {
    id: "mango-bank",
    title: "Mango Bank",
    tagline: "A friendly neobank for freelancers",
    kind: "ground",
    year: "2024",
    tags: ["Fintech", "Mobile", "Onboarding"],
    accent: "var(--brand)",
    emoji: "🥭",
    blurb:
      "From empty-state to first-invoice in under three minutes. Card issuance flow reworked end-to-end.",
    role: "Senior product designer",
    team: "3 designers · 14 engineers · 1 PM",
    client: "Mango Financial",
    writeup: [
      "Mango is a neobank built for freelancers and small creative studios — the people who find regular banks too formal, and creator-first fintechs too aesthetic to be trusted with payroll. My remit covered onboarding, card issuance, and the first invoice experience.",
      "The big insight from research: freelancers don't want a dashboard, they want a receipt. So I redesigned the home screen around the week's transactions, with the account balance and cards demoted to a swipe-up sheet. Empty states were rewritten around 'get to the first invoice,' not 'get to the feature list.'",
      "We shipped end-to-end in Q3 2024. The KYC-to-first-transaction median dropped from 14 minutes to 2 minutes 47 seconds. Support tickets in the first 7 days fell 61%. The team is now porting the pattern to their business-banking tier.",
    ],
  },
  {
    id: "signal-health",
    title: "Signal Health",
    tagline: "Calm triage for nurses, not doctors",
    kind: "ground",
    year: "2024",
    tags: ["Healthcare", "Enterprise"],
    accent: "var(--brand)",
    emoji: "🩺",
    blurb:
      "Research-led redesign of a bedside triage tool used by 4,000+ nurses across 11 hospitals.",
    role: "Principal designer (contract)",
    team: "1 designer · 1 researcher · 6 engineers",
    client: "Signal Health Systems",
    writeup: [
      "Signal is a triage platform used by bedside nurses in acute-care wards. Unlike EHRs, which are designed for documentation, Signal is designed for the first five minutes of a patient's deterioration. Previous screens had been inherited from a cardiology tool and felt too clinical and too dense for a high-stress ward.",
      "I spent three weeks shadowing nurses on night shifts in two hospitals, then ran paired co-design sessions where nurses drew on paper prototypes between patients. The final design strips the UI to three zones: the patient's current state, the suggested next step, and a single action button. Color is reserved for severity; everything else is monochrome.",
      "Rolled out across 11 sites in late 2024. Average time-to-escalation fell 41% in early data. More importantly, nurses report using the tool confidently in the first week — historically a 4-6 week curve.",
    ],
  },
  {
    id: "lunchbox",
    title: "Lunchbox",
    tagline: "A tiny app for big lunch decisions",
    kind: "ground",
    year: "2023",
    tags: ["Consumer", "iOS"],
    accent: "var(--brand)",
    emoji: "🥡",
    blurb:
      "Swipe-based meal roulette for indecisive office teams. 12k weekly swipes in the first month.",
    role: "Product designer (solo)",
    writeup: [
      "Lunchbox started as a weekend project: my studio couldn't agree on lunch, so I built a Tinder for restaurants with team voting. It ended up hitting 12,000 weekly swipes in its first month and growing purely through Slack invites.",
      "The interaction model is dead simple: each teammate swipes on five nearby restaurants, the app picks the highest group overlap, and it books a 1pm reservation. If no consensus, it falls back to whichever place has the fastest kitchen.",
      "The design focus was onboarding — first swipe has to happen inside 15 seconds. I used a 'default to the three closest restaurants' pattern and deferred location permission until after the first swipe landed. Retention at day 14 sits at 44%, which I'm told is good for a consumer utility.",
    ],
  },
  {
    id: "sidetake-studio",
    title: "Sidetake Studio",
    tagline: "A second-brain for founders",
    kind: "ground",
    year: "2025",
    tags: ["Tools", "AI"],
    accent: "var(--accent)",
    emoji: "🧠",
    blurb:
      "Experimental product for turning voice notes into structured product briefs, spec docs, and cap-table memos.",
    role: "Founding designer",
    team: "1 designer · 2 engineers",
    writeup: [
      "Sidetake is an in-house experiment at the studio I co-run. The brief: take the messiest inputs a founder produces — voice memos on a walk, stream-of-consciousness Slack threads — and turn them into structured artifacts (product briefs, spec docs, cap-table memos) that a team can actually act on.",
      "The interaction centre is a tray that hovers at the bottom of the screen. You hit one button, speak for as long as you like, and the model does the hard work of pulling structure out of meandering thought. The artifact that comes back is never final — the UI is tuned for 'edit this into reality,' not 'ship this.'",
      "We're still in closed beta with eight teams. Early signal is that founders use it most often on a phone between 7-9am — which has dictated everything about the tray's mobile ergonomics and thumb reach.",
    ],
  },
  {
    id: "ferry-wayfinding",
    title: "Ferry Wayfinding",
    tagline: "City ferry terminal signage system",
    kind: "play",
    year: "2023",
    tags: ["Wayfinding", "Type", "Print"],
    accent: "var(--accent)",
    emoji: "⛴",
    blurb:
      "Commuter-tested icon + type system for a Mumbai ferry terminal — shipped across 42 physical signs.",
    role: "Lead designer",
    client: "Mumbai Port Trust (pilot)",
    writeup: [
      "A public-interest project for a Mumbai ferry terminal: design a wayfinding system that works for commuters, day-tripping tourists, and people who've never seen a Latin-script sign before. The old signage was a mess of stickers over stickers over paint.",
      "I drew a simple icon set (12 pictograms) from observational sketches at the terminal, paired with a stripped-down Devanagari-and-Latin type system. Arrows were treated as first-class citizens of the system, not afterthoughts — we tested three versions with commuters at 20m, 10m, and 5m distances.",
      "The pilot installed 42 signs in the northern wing. Commuters' wait-to-correct-platform time dropped by an average of 38 seconds in the first week. The port authority is expanding the system to three more terminals in 2026.",
    ],
  },
  {
    id: "mixtape-posters",
    title: "Mixtape Posters",
    tagline: "52 posters, 52 weeks, one song each",
    kind: "play",
    year: "2024",
    tags: ["Poster", "Typography"],
    accent: "var(--accent)",
    emoji: "🎧",
    blurb:
      "A year-long series — one poster a week, each interpreting a song I couldn't stop playing.",
    role: "Designer",
    writeup: [
      "A 52-week series: every Saturday I picked a song I'd had on repeat and turned it into an A2 poster. The rule was simple — always typographic, never illustrative. The song title had to be the entire composition.",
      "By week 12 I'd accidentally developed a process: listen on a walk, sketch on the train home, set the type in one sitting, print Sunday morning. Risograph, two colors, always. The constraint of riso inks — no true black, no bright red — became a feature.",
      "The full set was printed as a 52-poster edition in December 2024 and sold out in four days. More importantly, the weekly rhythm taught me more about setting display type than three years of agency work.",
    ],
  },
  {
    id: "zine-dispatch",
    title: "Dispatch Zine",
    tagline: "A risograph zine about nothing",
    kind: "play",
    year: "2022",
    tags: ["Print", "Illustration", "Riso"],
    accent: "var(--accent)",
    emoji: "📰",
    blurb:
      "Three issues of a two-color riso zine. Shipped to 300 pen-pals across 14 countries.",
    role: "Editor + designer",
    writeup: [
      "Dispatch was a pen-pal zine: three issues, 36 pages each, risograph-printed in fluorescent pink and a deep navy. Each issue contained essays, illustrations, and one double-page fold-out from a guest contributor — the kind of thing you want to stick on a fridge.",
      "The mailing list grew to 300 subscribers across 14 countries by issue three. A large part of the joy was the object — each envelope hand-addressed, stamped, and sealed with a different rubber stamp I'd cut from erasers.",
      "The project wound down after issue three because I ran out of weekend time, but the mailing list is archived and the stamps are in a drawer. A fourth issue is not impossible.",
    ],
  },
  {
    id: "moving-things",
    title: "Moving Things",
    tagline: "Loops, bounces, squishes",
    kind: "play",
    year: "2024",
    tags: ["Motion", "Loops"],
    accent: "var(--accent)",
    emoji: "🌀",
    blurb:
      "A playground of Lottie loops and SVG experiments. Lives on the homepage — hover the cards.",
    role: "Motion designer",
    writeup: [
      "An ongoing collection of motion experiments — mostly short loops built in After Effects and exported as Lottie or SVG sprites. The focus is on 'moments,' not narratives: the bounce of a chip, the squish of a button, the exhale of a modal closing.",
      "The library feeds the rest of my practice. Every product project I ship has at least one micro-loop from this set, usually in a success state or empty state where text alone feels too serious.",
      "The goal is to keep adding until there are 100. I'm currently at 34.",
    ],
  },
  {
    id: "tiny-type",
    title: "Tiny Type",
    tagline: "A variable display face",
    kind: "play",
    year: "2025",
    tags: ["Type design", "Variable"],
    accent: "var(--accent)",
    emoji: "✒️",
    blurb:
      "A chunky, bouncy display typeface with a single weight axis. Still in drawing mode.",
    role: "Type designer",
    writeup: [
      "Tiny Type is my first attempt at a full type family — a chunky, bouncy display face with a single weight axis from 300 to 900. Designed in Glyphs over six months of evenings.",
      "The letterforms are built on a 3:4 grid, with generous x-height and aggressively optical kerning. It's meant to feel warm on posters and confident in editorial headlines — somewhere between Bluu Next and Söhne, but less polished.",
      "Currently at 312 glyphs and counting. I'll open it up as a free trial when the italics are done — probably late 2026.",
    ],
  },
  {
    id: "hello-stickers",
    title: "Hello Stickers",
    tagline: "Mascots for a stationery brand",
    kind: "play",
    year: "2023",
    tags: ["Illustration", "Branding"],
    accent: "var(--accent)",
    emoji: "🐱",
    blurb:
      "14 character designs turned into vinyl stickers, packed in with every order for six months.",
    role: "Illustrator",
    client: "Mono Stationery",
    writeup: [
      "Mono is a small Delhi stationery brand with a cult following among students and architects. They wanted a series of mascots to slip into every order — small, weird, and collectible.",
      "I drew 14 characters over two months: a napping cat, a worried apple, a confident toast, and eleven others. Each was cut to a 2-inch vinyl sticker and packed into orders randomly, so customers slowly collected the set.",
      "The run lasted six months and ~22,000 stickers. Mono say order value went up 14% during the run. My mum got the toast one and stuck it on her laptop.",
    ],
  },
  {
    id: "field-notes",
    title: "Field Notes App",
    tagline: "Offline journaling for walkers",
    kind: "ground",
    year: "2022",
    tags: ["Mobile", "Consumer"],
    accent: "var(--brand)",
    emoji: "🍃",
    blurb:
      "Designed a quiet, text-first journaling app for long walks. Zero notifications, ever.",
    role: "Product designer",
    team: "1 designer · 2 engineers",
    writeup: [
      "Field Notes is a journaling app for walkers — specifically for long walks through landscapes where you want to jot down a passing thought without pulling out a whole phone. Zero notifications, no social graph, no streaks.",
      "The design constraint was 'feel like a pocket notebook.' The UI is text-first, the keyboard is the canvas, and the only chrome on the writing screen is a small pin indicating where you are. Notes become map points you can revisit.",
      "Shipped on iOS in mid-2022. It's never grown to a huge audience (~8,000 MAUs) but the retention curve is flat beyond day 30 — meaning people who find it keep using it. That's the only metric I care about here.",
    ],
  },
];

export const productProjects = projects.filter((p) => p.kind === "ground");
export const visualProjects = projects.filter((p) => p.kind === "play");

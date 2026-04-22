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
  /** Override the meta label for `client` (default: "Client"). */
  clientLabel?: string;
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
    },
    masthead: {
      type: "video",
      src: "/projects/sidetake.mp4",
      poster: "/projects/sidetake-poster.jpg",
    },
    writeup: [
      "Sidetake started from a frustration: every productivity app treated me like a knowledge worker with tasks, but a creative day isn\u2019t tasks \u2014 it\u2019s a rhythm. You open Pinterest for one thing, fall into Are.na, bounce to Figma, dip into Instagram \u2018for a second,\u2019 and an afternoon is gone. The one decision the whole product rests on was to stop logging tasks and start logging five stages of creative process \u2014 Referencing, Ideation, Execution, Editing, Drift. That taxonomy became the spine.",
      "I wanted it to feel less like a productivity app and more like a camera app for your attention \u2014 dark, quiet, instrumental. The visual language narrowed to a near-black #02040A with the faintest blue undertone, and five load-bearing accents: sage for making, purple for ideation, sky for referencing, gold for editing, rose for drift. One colour per stage, consistent across every surface \u2014 so you feel drift before you read the word. The interface breathes \u2014 gyroscope tilts, ambient meshes, haptics \u2014 in a way screenshots can\u2019t capture.",
      "The flow is four beats: a 720ms splash that treats the session as a ritual, onboarding that makes you declare which apps mean making, exploring, or distracting, a home screen built around a twenty-state Gem system that describes focus instead of shaming a streak, and a session overlay that actually blocks drift apps via FamilyControls. Every early tester asked for streaks; I refused. Three months in they\u2019d stopped asking and started describing themselves in Gem vocabulary \u2014 \u2018crashed to Calibrate this morning.\u2019 That private language was the whole point.",
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
    },
    masthead: {
      type: "video",
      src: "/projects/boomerang.mp4",
      poster: "/projects/boomerang-poster.jpg",
    },
    writeup: [
      "Boomerang is an AI-powered alumni rehiring platform, built in under five hours for ContextCon \u2014 a hackathon with Y Combinator and Crossdata. Instead of tracking former employees one-by-one on LinkedIn, it continuously maps where alumni work today, scores each on their likelihood to return (0\u2013100), surfaces a \u201Cwhy now\u201D signal, and drafts a personalized re-engagement message \u2014 turning a static alumni list into a live, ranked hiring pipeline.",
      "HR software defaults to rows, filters, and status pills \u2014 framing the product as data entry. I wanted Boomerang to feel like the system was thinking: ambient, alive, quietly confident. Three moves carry the visual language: glass on a purple-to-blue wallpaper with drifting orbs (blur as transparency-into-data), #8B7ACF \u00D7 #4B6FDC instead of corporate navy (intelligence meets trust), and silk-spring motion with 60ms staggers and 22\u201326s orb loops \u2014 the animation is the metaphor for constant re-scoring.",
      "Smaller moves reinforce the thesis: score rings around avatars so the score is the person, JetBrains Mono for numbers as proof they were computed, one shared wallpaper across every page, gradient reserved for CTAs and active nav. A parallel AI pipeline replaced the linear design-to-build handoff \u2014 Claude as design collaborator and front-end engineer, Codex for React/Tailwind, Gemini for framing, Lottify for motion, Higgsfield for imagery. Blank canvas to shipped demo in one afternoon \u2014 exactly the thesis ContextCon set out to prove.",
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
    },
    masthead: {
      type: "video",
      src: "/projects/jexlin.mp4",
      poster: "/projects/jexlin-poster.jpg",
    },
    writeup: [
      "Jexlin is a fashion and accessories brand built around self-expression, individuality, and storytelling through style. It brings together streetwear energy, bold visual language, and experimental accessories to create pieces that feel personal, expressive, and unapologetically distinct. The larger ambition was to treat fashion as a medium for point of view, not transactional merch \u2014 a label where people wear their identity, and every piece behaves like one sentence in a bigger story.",
      "As a designer, I wanted Jexlin to feel less like a product line and more like a design-led identity system. Every touchpoint \u2014 accessories, visuals, tone of voice, the storefront \u2014 had to behave like an extension of the same universe. That meant treating the brand and the products as one artifact, designed together from day one: pieces that read like chapters, campaigns that feel narrative rather than catalogue, a storefront where the tone is as considered as the typography.",
      "The belief underneath is that style is deeply narrative. I wanted Jexlin to feel raw, memorable, and emotionally charged \u2014 while staying visually sharp and culturally current. That balance dictated every move: how the logo carries a sharp edge on a soft garment, how the accessories sit between utility and object, how the storefront behaves more like an editorial space than a shop. The result isn\u2019t another fashion label fighting for attention in a feed \u2014 it\u2019s a point of view you can put on.",
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
    },
    masthead: {
      type: "video",
      src: "/projects/crater.mp4",
      poster: "/projects/crater-poster.jpg",
    },
    writeup: [
      "Crater is a defense layer for the AI era. AI tools are being adopted at a pace no security stack was built for: people paste sensitive data into chatbots, install extensions with full-page permissions, and connect plugins that quietly train on their work \u2014 without understanding data retention, sharing, or scope. Traditional security tools (DLP, EDR, browser security) don\u2019t see AI-specific risk. The threat model shifted from malware to consent and data flow, and there\u2019s no seatbelt for the way people actually use AI.",
      "Crater sits across the surfaces where AI gets used \u2014 websites, apps, browser extensions, plugins, and enterprise integrations. It detects AI tool usage in real time, surfaces what each tool actually does with your data, and warns or educates the user in the moment of risk rather than after a breach. The design principle was simple: users route around hard blocks, so a trust layer that informs in-context changes behavior more durably than a firewall that says no.",
      "The deeper insight: AI safety is a horizontal problem, not a vertical product. It belongs at the layer above any single tool \u2014 exactly the wedge incumbents can\u2019t easily occupy. AI adoption is bottom-up and invisible to IT, so Crater had to feel less like enterprise software and more like a quiet co-pilot that shows up when it matters. I built it because I kept watching smart people hand sensitive context to AI tools without a second thought \u2014 including me.",
    ],
  },
  {
    id: "sid-voice-host",
    title: "Sid Voice Host",
    tagline: "A voice that opens the room before the host walks on",
    kind: "play",
    year: "2026",
    tags: ["Art direction", "UI", "Motion"],
    accent: "var(--accent)",
    emoji: "🎙️",
    blurb:
      "Art direction and interface for an AI co-emcee \u2014 a voice that sets the room\u2019s mood before the human host walks on. Two screens, one atmosphere.",
    role: "Brand, art direction, and UI",
    thumbnail: {
      type: "video",
      src: "/projects/thumbs/sid-voice-host.mp4",
    },
    masthead: {
      type: "video",
      src: "/projects/sid-voice-host.mp4",
      poster: "/projects/sid-voice-host-poster.jpg",
    },
    writeup: [
      "Sid is voice-first: the real output is a presence in a room, not a page on a screen. That inverted the brief \u2014 I wasn\u2019t designing a dashboard but the atmosphere a piece of software carries in the five minutes an operator uses it, and the mood it sets for the thing about to happen. The screen had to feel like the opening credits, not the film. One sentence sat above every decision: warm, not clinical. Hosted, not automated.",
      "I anchored the aesthetic in ambient gradient \u2014 soft cyan, violet, and pink blobs bleeding into a cool off-white field, under a fine SVG grain for paper texture. Four radial gradients drift in hue at the corners so the background is never still but never obvious. One typeface carries the voice: Hanken Grotesk in four weights, with tight editorial tracking on display (-0.045em), and 10.5px small-caps labels each crowned by a tiny gemstone-gradient dot that pulls the brand palette into the type hierarchy. References: Apple macOS stills, Figma Config key art, early-aughts ambient album covers.",
      "The setup card is a glass panel \u2014 72% white, 32px backdrop blur, a hairline stroke, a soft long shadow, an inner top highlight \u2014 reading as frosted material floating over the field, not a rectangle painted on it. Motion was the quietest part and the longest to tune. The background hue-rotates 12\u00B0 over 40 seconds on loop. The setup card exits with an 800ms cubic-bezier ease as the live layer takes over \u2014 one gesture for \u2018the host is on now.\u2019 Focus states bloom over 200ms, easing border, background, and shadow together.",
      "Two states carry the whole product. Setup is one card, one breath: event, hosts, a short description, and a mood \u2014 four gradient swatches (warm, playful, hype, chill) that double as brand artifacts. Live is nearly invisible \u2014 a minimal readout of what the camera sees and what the agent is saying, so an operator can trust the system without intervening. The hardest thing to design is a screen that knows when to shut up. The part I\u2019m proudest of isn\u2019t the card \u2014 it\u2019s the empty field around it.",
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
    },
    masthead: {
      type: "video",
      src: "/projects/healthy-high-five.mp4",
    },
    writeup: [
      "Healthy High-Five was a full-funnel in-app experience built to push adoption of Zomato's Healthy Mode — where users see macro breakdowns, understand what's in a dish, and browse meals ranked by nutrition (high / medium / low / super-high). The core offer was clean: place four orders via Healthy Mode and the fifth is free.",
      "My job was to translate that into something instantly understandable and hard to ignore — so the flow didn't feel like \u201Canother promo,\u201D but more like a simple progress quest you'd naturally want to complete. The biggest challenge wasn't visuals, it was clarity: users needed to get the mechanic in seconds, see where they stand, and feel nudged (not nagged) to keep going.",
      "I owned the end-to-end visual system — naming and identity direction, logo feel, a green-forward palette, and a badge language that literally shows the \u201Chi-fi / high-five\u201D idea in the collectible itself. The entire icon set is modeled in 3D (Blender + Substance Painter) so rewards feel tactile — you're stacking progress, not ticking checkboxes. Animated in After Effects, shipped as Lottie, assembled in Figma.",
      "The flow ladders up cleanly: each order becomes a badge, four badges = momentum, and the gift/claim moment sits exactly where intent peaks — on the claim page — so the payoff lands when the user expects it. With product designers, I stitched this into an in-app journey that's equal parts informative and habit-forming. You're not just told to order healthy — you're shown your path to the win.",
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
    },
    masthead: {
      type: "video",
      src: "/projects/independence-day-banner.mp4",
    },
    writeup: [
      "For the Zomato Independence Day homepage banner, the goal wasn't \u201Clet's put a flag and call it a day.\u201D We wanted it to feel like a proud recap of the past year — quick, visual, and unmistakably India. So we brought in cultural anchors (national monuments, the peacock, kites, festive textures) and paired them with a modern \u201Cwe're actually doing big things\u201D beat: Chandrayaan.",
      "The challenge was balancing celebration with information. It had to read instantly on the home feed, but still reward the user with little discoveries as the animation played.",
      "My role was shaping the visual language and making the transitions feel seamless — like one continuous ribbon of scenes rather than a bunch of patriotic stickers thrown together. Chandrayaan became the narrative spine: everything else was composed and timed to orbit around it, so the banner felt cohesive even while covering multiple symbols and achievements.",
      "The final output is a motion-first banner that feels festive without being loud, detailed without being cluttered, and built to make users pause for a second — not because it's Independence Day, but because the story actually looks worth watching. Built in After Effects and Illustrator, composed in Figma, shipped as Lottie.",
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
    },
    masthead: {
      type: "video",
      src: "/projects/asia-cup-2025.mp4",
    },
    writeup: [
      "For the Zomato Asia Cup 2025 homepage banner, Nishant and I set ourselves a slightly unhinged brief: could we fit an entire \u201Cmatch moment\u201D into one compact in-app placement — without it feeling like a generic sports poster?",
      "The idea was simple but ambitious: show the full arc — bowler runs in, delivery, batsman connects, ball goes out of the park — so users don't just see a banner, they get a story beat in a split second. We leaned into a comic-book language: tight frames, dramatic close-ups (hello, intense eyes), and bold compositions — so even on a scroll-heavy home screen, the narrative reads fast.",
      "The real experiment was pushing AI image generation beyond \u201Cnice visuals\u201D into \u201Cusable system.\u201D We tested multiple models and styles, iterated like crazy, and treated AI outputs as raw material — not final art — so everything could match a consistent comic tone once it entered the motion pipeline.",
      "My focus was making the frames feel intentional for animation: clear silhouettes, controllable layers, and transitions that felt like flipping panels rather than sliding assets. The end result was a motion-first banner that played like a tiny sports sequence — high-energy, story-driven, and proof that AI can help build narratives in product UI when you art-direct it hard enough. Built across After Effects, Photoshop, Figma, and a lot of AI tooling, shipped as Lottie.",
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
    },
    masthead: {
      type: "video",
      src: "/projects/goat-offers-bumrah.mp4",
    },
    writeup: [
      "For Zomato's Asia Cup collab with Jasprit Bumrah (then the No.1 T20 bowler), the brief was clear: make the homepage banner feel like match-night adrenaline — without turning it into noisy chaos.",
      "We leaned into a fiery red palette and a punchy \u201CGreatest Offers of All Time\u201D framing to give it instant energy on scroll, but the real design goal was hierarchy: Bumrah had to be the hero, the offer had to be legible in one glance, and everything else needed to support the vibe without stealing attention.",
      "On motion, we kept the center rigid and confident — Bumrah stays grounded and \u201Ctough,\u201D while the excitement happens around him. I designed the animation language so the movement feels controlled: coupons fly in and out like quick wins, discount elements pop with solid, snappy timing, and the background heat adds momentum without distracting from the CTA.",
      "The result was a banner that feels high-voltage but disciplined — celebrity-led, offer-first, and built to convert attention into taps instead of just looking cool for three seconds. Built in After Effects and Figma, shipped as Lottie.",
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
    },
    masthead: {
      type: "video",
      src: "/projects/durga-puja-pandal.mp4",
    },
    writeup: [
      "For the Zomato Durga Puja homepage banner, the concept was beautifully straightforward: don't show a pandal — make the user feel like they're entering one.",
      "The banner had to create that tiny, delightful illusion of stepping inside a festive space: the arch framing you in, the warm reds and textured patterns setting the mood, the dhaak/dhol energy hinted through motion cues, and the central deity reveal landing like the main moment. Because it sits on the home feed, it also had to do this fast — no long build-ups, just instant atmosphere and clarity.",
      "Animation was the hero here, so my focus was staging the sequence like a real entrance: foreground elements lead the eye inward, the deity holds center, and the offer/CTA layer rises from behind in a way that feels ceremonial — not like a UI sticker slapped on top.",
      "We designed the loop so it doesn't feel like a repetitive GIF — it feels like the scene is alive: subtle movement, steady rhythm, and a clean reset that keeps the pandal illusion intact. The result: a festive banner that doesn't just celebrate Durga Puja — it recreates the vibe of being there, right inside the app. Built in After Effects and Illustrator, composed in Figma, shipped as Lottie.",
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
    },
    masthead: {
      type: "video",
      src: "/projects/zomato-plus-identity.mp4",
    },
    writeup: [
      "Zomato Plus is where the brand-to-brand action lives — collabs, partnerships, and business-facing stories with companies like HP (and a bunch more). My task was to build a clear identity for Plus that works across business collaterals — without making it look like a stiff \u201Ccorporate sub-brand.\u201D",
      "The direction was to stay aligned with Zomato's newer hustle tone, so the identity needed to feel fast, bold, and confident, while still behaving like a system that can sit cleanly on decks, one-pagers, event assets, partner kits, and internal comms.",
      "I designed the core logo lockup and the rules that make it usable at scale — spacing and exclusion zones, composition logic, and how it should appear across formats without getting crowded or losing punch. The visual language borrows from the hustle vibe (high contrast, energetic type treatment, a slightly raw edge), but keeps enough structure to work in business contexts where clarity matters more than decoration.",
      "End result: a flexible, multimedia identity for Zomato Plus that looks like it belongs to Zomato… but also looks like it can walk into a partner meeting and not blink. Built across After Effects, Illustrator, and Figma, with motion expressions shipped as Lottie.",
    ],
  },
];

export const productProjects = projects.filter((p) => p.kind === "ground");
export const visualProjects = projects.filter((p) => p.kind === "play");

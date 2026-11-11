export type ProjectMedia =
  | { type: "image"; src: string; alt?: string; bg?: string }
  | { type: "video"; src: string; poster?: string; bg?: string };

export type ProjectScreen = {
  src: string;
  title: string;
  problem: string;
  rationale: string;
};

export type ProjectExploration = {
  src: string;
  caption: string;
};

export type ProjectProcess = {
  /** Wide image (≤ 1MB recommended) showing the design board / flow. */
  src: string;
  /** Tiny poster used for first paint while the full image streams in. */
  poster?: string;
  /** Native intrinsic dimensions of `src` — used to compute layout fits. */
  width: number;
  height: number;
  /** Canvas background that bleeds out to the viewport edges. */
  bg?: string;
  /** Header label inside the overlay (e.g. "The flow"). */
  label?: string;
  /** Sentence under the title. */
  blurb?: string;
};

export type ProjectGalleryImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

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
  /** Individual app screens with design rationale, shown in the modal. */
  screens?: ProjectScreen[];
  /** Early iterations / exploration shown as a quick horizontal strip. */
  explorations?: ProjectExploration[];
  /** Full-screen design-board / flow viewer. Opens from a modal CTA. */
  process?: ProjectProcess;
  /** Key frames shown under the film in the open view. */
  gallery?: ProjectGalleryImage[];
  role?: string;
  team?: string;
  client?: string;
  /** Override the meta label for `client` (default: "Client"). */
  clientLabel?: string;
  link?: { label: string; href: string };
};

export const projects: Project[] = [
  {
    id: "zepto-club",
    title: "Zepto Club",
    tagline: "A premium membership, revealed like an invitation",
    kind: "play",
    year: "2026",
    tags: ["Membership", "Visual system", "Motion", "Lottie"],
    accent: "var(--accent)",
    emoji: "\u{1F451}",
    blurb:
      "Zepto's invite-only membership, introduced as a small ceremony: the purple deepens, a gold Club card is revealed in light, and cashback becomes Z-Coins you can see. The motion cashback modal hit an 11% CTR, about three times the static version.",
    role: "Product visual designer",
    client: "Zepto",
    clientLabel: "Company",
    thumbnail: {
      type: "video",
      src: "/projects/thumbs/zepto-club.mp4",
      poster: "/projects/thumbs/zepto-club-poster.jpg",
      bg: "#120A24",
    },
    masthead: {
      type: "video",
      src: "/projects/zepto-club.mp4",
      poster: "/projects/zepto-club-poster.jpg",
      bg: "#120A24",
    },
    writeup: [
      "Zepto Club is the paid layer on top of Zepto: cashback in Z-Coins, free and priority delivery, priority support and member-only offers. It had to feel like a tier apart without slowing down an app people open to get something fast. My part was the visual world and how it moves. Zepto's purple deepens into a darker, lit stage; gold is saved for moments of access and reward; and a small cast of objects, the metallic Club card, the wordmark, Z-Coins and the benefit symbols, carries the same language from the first invite to benefit pages, cashback modals, CTAs and upsell strips.",
      "Motion does the persuading. The card is revealed rather than shown, benefits arrive one at a time, and in the cashback modal a familiar bill summary hands focus to the 5% line before Z-Coins spill out of it, so a line item becomes a reward you can see. It all shipped as modular .lottie files with static fallbacks, from 6 KB CTAs to 400 KB full-screen moments. Since launch, 11% of invited users have become members, the motion cashback modal's 11% CTR is about three times its static predecessor's 3.6%, the Lottie experiences drive roughly 9% of all Club purchases, and members show 75% retention at day 30.",
    ],
  },
  {
    id: "diya-rush",
    title: "Diya Rush",
    tagline: "A twenty-second Diwali game, lit one diya at a time",
    kind: "play",
    year: "2026",
    tags: ["Illustration", "Game", "Diwali", "Campaign"],
    accent: "var(--accent)",
    emoji: "\u{1FA94}",
    blurb:
      "An in-app Diwali game for Zepto, powered by Kinder Joy and Ferrero Rocher: carry the flame across a haveli and light all 22 diyas in under 20 seconds to win rewards. I illustrated every scene.",
    role: "Illustrator + visual designer",
    client: "Zepto",
    clientLabel: "Company",
    thumbnail: {
      type: "video",
      src: "/projects/thumbs/diya-rush.mp4",
      poster: "/projects/thumbs/diya-rush-poster.jpg",
      bg: "#1E1240",
    },
    masthead: {
      type: "video",
      src: "/projects/diya-rush.mp4",
      poster: "/projects/diya-rush-poster.jpg",
      bg: "#1E1240",
    },
    gallery: [
      {
        src: "/projects/diya-rush/key-art-screens.jpg",
        alt: "Diya Rush title screen beside the fully lit haveli at the end of a round",
        width: 1000,
        height: 1000,
      },
      {
        src: "/projects/diya-rush/key-art-scenes.jpg",
        alt: "Diya Rush scenes: sky lanterns, the carved front door, the how-to-play arch and three windows of silhouettes holding diyas",
        width: 1000,
        height: 1000,
      },
    ],
    writeup: [
      "Diya Rush is a short tap-and-drag game that ran inside Zepto for Diwali. The whole game is one haveli at night: a carved wooden door marked शुभ and लाभ, a rangoli at the steps, marigold garlands in three arched windows, and families standing in them as silhouettes, each holding a diya. You pick up the flame and carry it from lamp to lamp. The clock reads 20 seconds and the counter reads 0/22, so the house starts dark and ends glowing.",
      "I drew every piece of it: the building, the door, the lanterns drifting in the sky, the firefly bushes, the silhouettes, the how-to-play arch and the Diya Rush wordmark. The palette stays deep indigo and plum so that the only warm light on screen is the light the player makes. Each lit diya adds a little more orange to the walls, and when the last one catches, the whole facade is finally in colour.",
    ],
  },
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
    screens: [
      {
        src: "/projects/sidetake-screens/home.png",
        title: "Project Flow Map",
        problem: "Creatives don\u2019t know what state they\u2019re in or when their best hours actually land. Most focus apps show streaks or timers \u2014 neither tells you anything about the shape of your energy.",
        rationale: "The home screen is a live signal, not a log. The Gem (here: Calibrate 54) shows current creative state in real time. Daily Insights surface two numbers that matter \u2014 your deepest window (10:40am) and your average time before distraction kicks in (14 min). Learn from the Best sits below so the path from self-awareness to someone else\u2019s workflow is one scroll, not a separate app.",
      },
      {
        src: "/projects/sidetake-screens/project.png",
        title: "Active Project Detail",
        problem: "Hours logged on a project don\u2019t tell you whether you were actually present. You can put in four hours and barely move the needle if most of it was comms and drift.",
        rationale: "Depth % replaces raw time as the headline metric \u2014 91% means 91% of logged time was in a high-focus state, not bouncing between tabs or context-switching. The Quick Breakdown separates Creating, Research, Comms, and Drift so you can see exactly where the hours went, not just how many. Start New Session is a persistent CTA because the point is always to get back in, not to admire the numbers.",
      },
      {
        src: "/projects/sidetake-screens/creator.png",
        title: "Creator Workflow",
        problem: "Following a creator on social gives you their output, not their process. You have no idea how they actually split their time, what phase they front-load, or what their working language even is.",
        rationale: "Ananya\u2019s profile is built from her real session data, not a bio she wrote. The donut shows her 12-hour budget broken into the five Sidetake stages (Reference, Ideate, Make, Review, Drift) on a real brand project. Her tagline \u2014 \u201cReference hard. Decide fast. Make before the energy drops.\u201d \u2014 is derived from her workflow signature, not a self-description. Stage Breakdown adds one line of plain text per phase so the numbers have intent, not just weight.",
      },
      {
        src: "/projects/sidetake-screens/book-date.png",
        title: "Book a 1-on-1 \u2014 Date",
        problem: "Booking a session with a mentor is usually a cold ask: pick any date, hope they\u2019re free, figure out the agenda later. The friction is high enough that most people never follow through.",
        rationale: "Availability is resolved upfront \u2014 only real open dates are highlighted so there\u2019s no back-and-forth. Session Focus is chosen before you confirm a date, so the meeting has an agenda before it\u2019s booked. Naming the focus options (Portfolio & Project Review, Workflow & Process Deep-Dive) signals what kind of conversation is being purchased, not just a timeslot.",
      },
      {
        src: "/projects/sidetake-screens/book-time.png",
        title: "Book a 1-on-1 \u2014 Time",
        problem: "Most booking flows hand off to a third-party scheduler mid-flow, which breaks the context and makes it feel like an admin task rather than a continuation of the product.",
        rationale: "Time selection stays inside the same visual language \u2014 same card, same green accent, same tone. The CTA reads \u201cConfirm Booking\u201d with the exact date and time already resolved (March 8 \u00b7 2:00 PM) so there\u2019s no ambiguity about what you\u2019re committing to before you tap.",
      },
      {
        src: "/projects/sidetake-screens/confirm.png",
        title: "Session Requested",
        problem: "After booking, most apps show a generic \u201cyou\u2019re all set\u201d screen that tells you nothing about what comes next. The moment the action is complete, the product goes quiet.",
        rationale: "The confirmation screen acts as a receipt and a handoff note. It surfaces all four booking details (mentor, date, time, format) so nothing needs to be cross-checked in email. The subline \u2014 \u201cWe\u2019ll notify you once Ananya confirms the booking.\u201d \u2014 sets the expectation that this is a request, not a guaranteed slot, so there\u2019s no confusion if timing shifts. Done ends the flow cleanly rather than routing back into the feed.",
      },
    ],
    process: {
      src: "/projects/sidetake-process.webp?v=5",
      poster: "/projects/sidetake-process-poster.webp?v=5",
      width: 8000,
      height: 10183,
      bg: "#101010",
      label: "The flow",
      blurb:
        "How Sidetake came together \u2014 from the first scattered screens to the Gem-driven home, project, and creator views. Scroll to pan, \u2318/Ctrl + scroll to zoom.",
    },
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
    id: "street-football",
    title: "Street Football",
    tagline: "A penalty shootout that turned match nights into orders",
    kind: "play",
    year: "2026",
    tags: ["Game", "Campaign", "Motion", "World Cup"],
    accent: "var(--accent)",
    emoji: "⚽",
    blurb:
      "A month-long penalty-shootout game inside Zepto for the FIFA World Cup — 940K players, 2.8M games, a 90.6% completion rate, and ₹40 lakh in sponsorship revenue.",
    role: "Visual + motion designer",
    client: "Zepto",
    clientLabel: "Company",
    thumbnail: {
      type: "video",
      src: "/projects/thumbs/street-football.mp4?v=2",
      poster: "/projects/thumbs/street-football-poster.jpg?v=2",
      bg: "#C7CEDF",
    },
    masthead: {
      type: "video",
      src: "/projects/street-football.mp4?v=3",
      poster: "/projects/street-football-poster.jpg?v=3",
      bg: "#7A8AB8",
    },
    writeup: [
      "As the FIFA World Cup took over every screen in the country, Zepto wanted to be part of match night — not with a discount banner, but with something people would actually play. Street Football is a full penalty-shootout game living inside a quick-commerce app: you're matched against a rival keeper on a cartoon back-alley pitch, pick your corner, take your kicks, then swap gloves and defend your own goal. Wins climb a rewards ladder that unlocks real offers at 1, 5, 10, 20, and 50 wins, and a dedicated Match Hangout storefront — match-day deals, snacks, and cold drinks — sat right beside the game so cravings had somewhere to land.",
      "The design bet was scrappy over stadium gloss: hand-painted alley walls, pink clouds over powerlines, a ball wrapped in rags — street football the way it's actually played — with a game loop legible in seconds. Three thumb-sized buttons (kick left, centre, right), bold GOAL / MISS / SAVE title cards, sudden-death deadlocks against named rivals, and a scoreboard strip that keeps the tension visible. The world was also built to carry partners without breaking fiction: presented-by placements and branded surfaces monetised the game for ₹40 lakh via the Nivia Men × Real Madrid sponsorship.",
      "In one month, 9.4 lakh unique players played 2.8 million games — roughly three each, with a 90.6% completion rate. The game drove ~49.7K orders at ₹548 GMV per order, and playing deepened intent: add-to-cart conversion climbed from 27.5% to 37.8% to 49.9% as players progressed through the checkpoints. Users came for the rewards but built full, profitable baskets — non-campaign items contributed ~70% of order value — and the deepest milestone drove the highest GMV per order at ₹756. A game that paid for itself, then paid the company.",
    ],
  },
  {
    id: "zepto-turns-5",
    title: "Zepto Turns 5",
    tagline: "Five years of Zepto, retold as your own story",
    kind: "play",
    year: "2026",
    tags: ["Story", "Personalisation", "Campaign", "Motion"],
    accent: "var(--accent)",
    emoji: "\u{1F389}",
    blurb:
      "A personalised in-app birthday story that reached 1.81M users — 1 in 6 shared their recap, and the Shuffle Deals widget drove 18.2K orders in three days.",
    role: "Visual + motion designer",
    client: "Zepto",
    clientLabel: "Company",
    thumbnail: {
      type: "video",
      src: "/projects/thumbs/zepto-turns-5.mp4?v=2",
      poster: "/projects/thumbs/zepto-turns-5-poster.jpg?v=2",
      bg: "#5435A5",
    },
    masthead: {
      type: "video",
      src: "/projects/zepto-turns-5.mp4?v=3",
      poster: "/projects/zepto-turns-5-poster.jpg?v=3",
      bg: "#5435A5",
    },
    writeup: [
      "For Zepto's fifth birthday we turned the anniversary inward: instead of the brand talking about itself, the app showed each user their own five years. “Zepto's five years in a reel” is a tappable, Wrapped-style story rendered as an illustrated film strip — the first delivery at your door, the golden retriever greeting the grocery bag, a Zepto Café evening on the couch, the pharmacy order that rescued a sick day. Every frame was drawn like a memory rather than a marketing asset, in a warm storybook style wrapped in Zepto purple.",
      "Under the warmth sat a personalisation engine. The story pulled each user's real history — the year their city launched, their first order, their order milestones — and assembled the journey from it. Nearly 70% of the 554.7K story viewers saw three or more personalised insights, and 8.3% got a fully personalised five-insight journey. The nostalgia beats were tuned by cohort: Year-1 veterans responded hardest to the memory of Zepto launching in their city (61.2%), Year-4 users lit up at their own first order (41.9%), and the Year-5 cohort got the richest personalisation of all, with only 12.1% fallback content.",
      "The story reached 1.81M users — 1.41M played and 667K completed the full journey, a 47.3% completion rate. A 16.1% share CTR meant one in six players pushed their personalised recap beyond the app: organic amplification on top of paid reach. And the celebration converted — the Shuffle Deals widget drove 18,234 orders in three days, growing +75% from Day 1 to Day 3 (4.4K to 6.1K to 7.7K daily) as users came back to spin at 2.6 clicks per session.",
    ],
  },
  {
    id: "healthy-high-five",
    title: "Healthy High-Five",
    tagline: "Making \u201Ceat better\u201D feel like a game you can win",
    kind: "play",
    year: "2025",
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
    process: {
      src: "/projects/h5-process.webp?v=5",
      poster: "/projects/h5-process-poster.webp?v=5",
      width: 7018,
      height: 9049,
      bg: "#101010",
      label: "The flow",
      blurb:
        "How Healthy High-Five came together — explorations, naming, and the seven screens behind the reward loop. Scroll to pan, ⌘/Ctrl + scroll to zoom.",
    },
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
    id: "halloween-zomato",
    title: "Zomato Halloween",
    tagline: "A graveyard on the homepage, without scaring anyone off",
    kind: "play",
    year: "2025",
    tags: ["Motion", "Banner", "Illustration", "Lottie"],
    accent: "var(--accent)",
    emoji: "\u{1F383}",
    blurb:
      "Homepage banner that opens on a moonlit graveyard, then pulls back to a witch and her ghost guests at the dinner table — spooky, festive, and unmistakably Zomato.",
    role: "Visual + motion designer",
    client: "Zomato",
    clientLabel: "Company",
    thumbnail: {
      type: "video",
      src: "/projects/thumbs/halloween-zomato.mp4",
      poster: "/projects/thumbs/halloween-zomato-poster.jpg",
      bg: "#1B1240",
    },
    masthead: {
      type: "video",
      src: "/projects/halloween-zomato.mp4",
      poster: "/projects/halloween-zomato-poster.jpg",
      bg: "#1B1240",
    },
    writeup: [
      "Halloween in India is mostly costume photos and a couple of pumpkins — there's no shared visual language to lean on. The brief was to put the festival on Zomato's homepage in a way that felt unmistakably Halloween without going horror, because the next tap is still “order dinner.” So we anchored on graveyard atmosphere instead of jump scares: a moonlit cemetery framed by gnarled bare branches, a glowing-eyed bat watching from above, wrought-iron gates, leaning crosses, a black cat in the corner. The “HAPPY HALLOWEEN” wordmark glows in that classic eerie green so the mood lands in the first frame, before any other element loads in.",
      "The trick was the second beat. A graveyard is the hook, but a graveyard alone is too cold to sit on a food app. So the camera pulls back through the gate into a warm crypt-side dinner scene — a witch hosting two ghosts at a table, pizza and cake on the spread, jack-o'-lantern and skull guests on the floor, fairy lights overhead. Same world, different temperature: spooky exterior, hospitable interior — which is also the brand promise of Zomato on a festival night. The whole thing loops cleanly inside the home feed banner so users dropping in mid-animation still catch the punchline. Built in After Effects and Illustrator, composed in Figma, shipped as Lottie.",
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
    id: "onam",
    title: "Onam",
    tagline: "Mahabali sails back into the home feed",
    kind: "play",
    year: "2025",
    tags: ["Motion", "Banner", "Illustration", "Lottie"],
    accent: "var(--accent)",
    emoji: "\u{1F33F}",
    blurb:
      "Homepage banner that opens on a Kerala backwater framed by banana leaves, then reveals King Mahabali and Vamana arriving in snake boats — Onam mythology, told as one looping scene.",
    role: "Visual + motion designer",
    client: "Zomato",
    clientLabel: "Company",
    thumbnail: {
      type: "video",
      src: "/projects/thumbs/onam.mp4",
      poster: "/projects/thumbs/onam-poster.jpg",
      bg: "#1FA08C",
    },
    masthead: {
      type: "video",
      src: "/projects/onam.mp4",
      poster: "/projects/onam-poster.jpg",
      bg: "#1FA08C",
    },
    writeup: [
      "Onam is one of the few Indian festivals with a genuinely cinematic visual canon — the snake boats, banana leaves, the Mahabali story, the backwaters. The temptation with most festival banners is to lean on a flat illustration of a sadya (feast). Skip it. We wanted the user to feel like they had walked up to the edge of a Kerala river the morning of the festival — banana leaves parting like a curtain, lily pads on the surface, the “HAPPY ONAM” wordmark sitting inside a sunburst medallion that reads as a temple insignia, not a price tag.",
      "The second beat brings in the mythology directly: Mahabali, the beloved king who returns to visit his people once a year, sails in from the right under his crown; Vamana, the dwarf brahmin avatar of Vishnu who originally banished him, glides in from the left under an orange parasol. Putting them in the same frame — neither in conflict nor in conflict's resolution, just both peacefully on the water — is the entire emotional register of Onam. Yellow sunset sky, palm-tree silhouettes, a few drifting lotus petals to keep the loop alive. Built in After Effects and Illustrator, composed in Figma, shipped as Lottie.",
    ],
  },
  {
    id: "raksha-bandhan",
    title: "Raksha Bandhan",
    tagline: "A festival of siblings, written into the offers strip",
    kind: "play",
    year: "2025",
    tags: ["Motion", "Banner", "Offers", "Lottie"],
    accent: "var(--accent)",
    emoji: "\u{1F381}",
    blurb:
      "A homepage Rakhi banner that turns the offers grid into the festival itself — two sibling hands holding the wordmark above a tray of laddoos, with Mithai, Hampers, Chaat all framed in gold.",
    role: "Visual + motion designer",
    client: "Zomato",
    clientLabel: "Company",
    thumbnail: {
      type: "video",
      src: "/projects/thumbs/raksha-bandhan.mp4",
      poster: "/projects/thumbs/raksha-bandhan-poster.jpg",
      bg: "#1FA08C",
    },
    masthead: {
      type: "video",
      src: "/projects/raksha-bandhan.mp4",
      poster: "/projects/raksha-bandhan-poster.jpg",
      bg: "#1FA08C",
    },
    writeup: [
      "Raksha Bandhan is fundamentally a relationship festival — the rakhi a sister ties on her brother, the gift he sends back, the long-distance video call when they're in different cities. Most app banners reduce that to a generic “20% OFF” pill on a maroon background. The brief was to put the relationship into the banner itself, not just the discount. So the wordmark isn't typeset — it's held up. Two animated arms come into frame from opposite sides, one in a blue sleeve and one in a pink sleeve, each wearing a rakhi on the wrist, holding the “HAPPY RAKSHA BANDHAN” banner between them above a tray of glowing orange laddoos. The siblings never appear; just the gesture.",
      "The bottom half of the composition is the actual offers grid — Mithai & More, Rakhi Hampers, 50% Off & More, Chaat & Snacks — but each card is enclosed in an ornate gold frame that reads more like a wedding invitation than an e-commerce tile. Real food photography sits inside illustrated frames so the offer reads as appetite, not as a deal. The arms cycle through small props on the loop (a phone for the video-call beat, a wrapped present), so the banner stays alive even when the user lingers. Teal-and-gold palette held the whole thing together. Built in After Effects, food cutouts retouched in Photoshop, composed in Figma, shipped as Lottie.",
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

/* Priority order. The globe hands out its slots centre-first in this
   order, and the project scroll and the "All" bubble follow it too:
   illustrative work leads, other campaign work next, product last
   (so product sits towards the corners of the globe). Each project
   appears exactly once. */
const SHOWCASE_IDS = [
  // the centre: the main pieces
  "zepto-club",
  "healthy-high-five",
  "asia-cup-2025",
  "independence-day-banner",
  "halloween-zomato",
  "goat-offers-bumrah",
  // the rest of the visual + motion work, ordered so the four rows
  // (4·5·4·4) come out about the same length on the globe
  "raksha-bandhan",
  "diya-rush",
  "street-football",
  "onam",
  "zepto-turns-5",
  "durga-puja-pandal",
  "zomato-plus-identity",
  // product — the ends of the rows
  "sidetake",
  "jexlin",
  "sidetalk",
  "sid-voice-host",
] as const;

export const showcase: Project[] = SHOWCASE_IDS.map((id) =>
  projects.find((p) => p.id === id),
).filter((p): p is Project => Boolean(p));

export type ProjectStill = { src: string; width: number; height: number };

/* One hand-picked frame per project, cut from its full-length video
   at 960px so it shares that video's exact aspect. Used on the board
   tiles and as the poster while the video streams in. */
const STILL_SIZES: Record<string, readonly [number, number]> = {
  "asia-cup-2025": [960, 540],
  "diya-rush": [960, 960],
  "zepto-club": [960, 540],
  "durga-puja-pandal": [960, 540],
  "goat-offers-bumrah": [960, 540],
  "halloween-zomato": [960, 960],
  "healthy-high-five": [960, 540],
  "independence-day-banner": [960, 540],
  jexlin: [960, 524],
  onam: [826, 960],
  "raksha-bandhan": [946, 960],
  "sid-voice-host": [960, 524],
  sidetake: [960, 540],
  sidetalk: [960, 520],
  "street-football": [896, 900],
  "zepto-turns-5": [672, 900],
  "zomato-plus-identity": [960, 540],
};

const STILL_VERSION = 5;

/* Where in each full video its still was cut (fraction of duration).
   The open view starts playback from here, so the picture carries on
   from the very frame the globe tile showed. */
const STILL_AT: Record<string, number> = {
  "asia-cup-2025": 0.36,
  "diya-rush": 0.052,
  "zepto-club": 0.084,
  "durga-puja-pandal": 0.6,
  "goat-offers-bumrah": 0.6,
  "halloween-zomato": 0.35,
  "healthy-high-five": 0.08,
  "independence-day-banner": 0.22,
  jexlin: 0.36,
  onam: 0.35,
  "raksha-bandhan": 0.92,
  "sid-voice-host": 0.08,
  sidetake: 0.08,
  sidetalk: 0.08,
  "street-football": 0.25,
  "zepto-turns-5": 0.35,
  "zomato-plus-identity": 0.35,
};

export function stillFor(id: string): ProjectStill {
  const [width, height] = STILL_SIZES[id] ?? [960, 540];
  return { src: `/projects/stills/${id}.jpg?v=${STILL_VERSION}`, width, height };
}

/* Native size of each full-length video, so the open view frames it
   exactly (some differ in aspect from their board loop). */
const FILM_SIZES: Record<string, readonly [number, number]> = {
  "asia-cup-2025": [1280, 720],
  "diya-rush": [1000, 1000],
  "zepto-club": [1280, 720],
  "durga-puja-pandal": [1280, 720],
  "goat-offers-bumrah": [1280, 720],
  "halloween-zomato": [1080, 1080],
  "healthy-high-five": [1280, 720],
  "independence-day-banner": [1280, 720],
  jexlin: [1280, 698],
  onam: [1080, 1256],
  "raksha-bandhan": [1080, 1096],
  "sid-voice-host": [1600, 872],
  sidetake: [1600, 900],
  sidetalk: [1280, 692],
  "street-football": [896, 900],
  "zepto-turns-5": [672, 900],
  "zomato-plus-identity": [1280, 720],
};

export type ProjectFilm = { src?: string; poster: string; width: number; height: number; startAt: number };

/** The full-length video shown when a project is open, with its poster. */
export function filmFor(p: Project): ProjectFilm {
  const media = p.masthead ?? p.thumbnail;
  const still = stillFor(p.id);
  const [width, height] = FILM_SIZES[p.id] ?? [still.width, still.height];
  const startAt = STILL_AT[p.id] ?? 0;
  if (media?.type !== "video") return { poster: still.src, width, height, startAt };
  return { src: media.src, poster: still.src, width, height, startAt };
}

/** The short loop that plays on a board tile while it's hovered. */
export function loopFor(p: Project): string | undefined {
  return p.thumbnail?.type === "video" ? p.thumbnail.src : undefined;
}

export const fieldLabel = (p: Project): string =>
  p.kind === "ground" ? "Product" : "Visual + Motion";

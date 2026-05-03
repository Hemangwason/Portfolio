"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";

type Props = {
  /** Pill chevron color — also seeds the return portal's accent stripe. */
  accent: string;
  label?: string;
};

// Studio-cut transition timing. Keep these tied to the keyframes in
// globals.css (`stripeWipe` is 1.15s; each stripe is offset by 60ms).
//
//   t = 0          → first stripe begins dropping in
//   t = 368        → first stripe fully covers the viewport (32% of 1.15s)
//   t = 608        → last stripe (delay 240ms) fully covers (368 + 240)
//   t = NAV_AT     → router.push fires while the cover is solid
//   t = 1150+240   → last stripe finishes retracting (1390ms)
//   t = CLEANUP_AT → DOM node removed
//
// Navigating slightly after the last stripe locks down (620ms) hides
// the route swap completely; cleanup at 1500ms gives the retract a
// 110ms tail before the node disappears.
const NAV_AT_MS = 620;
const CLEANUP_AT_MS = 1500;

// Plain client component. Pill sits at fixed top-left over whatever
// the user happens to be scrolling past. Click intercepts the route
// change to play a "studio cut" return portal — five staggered stripes
// drop down to cover the screen, the route swaps under them, and the
// stripes retract to reveal the home page.
//
// The overlay is built into <body> via plain DOM (not React state),
// so it persists across the route transition without needing a
// shared layout-level provider.
export function BackHome({ accent, label = "home" }: Props) {
  const router = useRouter();
  const inFlight = useRef(false);

  // Warm the home route eagerly so the post-cover render is instant.
  // Next.js's <Link> already prefetches on viewport intersection, but
  // hover gives us a second nudge for users who pause on the pill.
  const prefetchHome = useCallback(() => {
    router.prefetch("/");
  }, [router]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Honour the platform: cmd/ctrl/middle/shift = open in new
      // tab, no portal.
      if (
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        e.button === 1
      ) {
        return;
      }
      e.preventDefault();
      if (inFlight.current) return;
      inFlight.current = true;

      const stage = mountReturnPortal({ leadAccent: accent });

      // Navigate while the cover is solid. The retract animation
      // continues running on the same DOM node — body persists across
      // App Router route changes — so the home page is revealed
      // gradually as the stripes lift, no hard cut.
      window.setTimeout(() => router.push("/"), NAV_AT_MS);

      // Auto-cleanup once the retract animation has finished.
      window.setTimeout(() => {
        stage.remove();
        inFlight.current = false;
      }, CLEANUP_AT_MS);
    },
    [router, accent],
  );

  return (
    <Link
      href="/"
      prefetch
      onClick={handleClick}
      onMouseEnter={prefetchHome}
      onFocus={prefetchHome}
      aria-label="Return to the light side — home"
      className="group fixed left-4 top-4 z-50 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-black/40 backdrop-blur-md transition-transform duration-200 hover:-translate-y-0.5 sm:left-5 sm:top-5 sm:gap-2.5 sm:px-3.5 sm:text-[11px]"
      style={{
        background: "rgba(8, 8, 14, 0.78)",
        border: "1px solid rgba(255, 255, 255, 0.12)",
      }}
    >
      <span
        className="grid h-4 w-4 place-items-center rounded-full"
        style={{ background: accent }}
      >
        <svg
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
          aria-hidden
        >
          <path
            d="M5 1L2 4L5 7"
            stroke="black"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span>{label}</span>
      <span
        className="hidden text-[9px] tracking-[0.28em] text-white/55 sm:inline"
        aria-hidden
      >
        ⟶ light
      </span>
    </Link>
  );
}

type PortalOpts = {
  /** First stripe's color. Defaults to the brand var. */
  leadAccent: string;
};

// Build the overlay imperatively. Reuses the .portal-* classes from
// globals.css; the keyframes are shared with the entry portal so the
// two transitions read as one visual language. Stripe palette is
// seeded from `leadAccent` so leaving /play (accent) and /ground
// (brand) carry their dimension's tone into the cover.
function mountReturnPortal({ leadAccent }: PortalOpts): HTMLDivElement {
  const stage = document.createElement("div");
  stage.className = "portal-stage";
  stage.setAttribute("aria-hidden", "true");
  stage.dataset.portalKind = "return";

  const stripes = document.createElement("div");
  stripes.className = "portal-stripes";

  // Lead with the source-page accent → contrast → its complement →
  // contrast → near-black. Mirrors the entry portal's beat.
  const complement =
    leadAccent === "var(--accent)" ? "var(--brand)" : "var(--accent)";
  const stripeDefs: Array<{ background: string; label: string }> = [
    { background: leadAccent, label: "01" },
    { background: "#06070a", label: "02" },
    { background: complement, label: "03" },
    { background: "#0c0c14", label: "04" },
    { background: "#000000", label: "05" },
  ];

  stripeDefs.forEach((def, i) => {
    const stripe = document.createElement("span");
    stripe.className = "portal-stripe";
    stripe.style.background = def.background;
    stripe.style.setProperty("--stripe-delay", `${i * 60}ms`);

    const lbl = document.createElement("span");
    lbl.className = "portal-stripe-label";
    lbl.textContent = `cut · ${def.label}`;
    stripe.appendChild(lbl);

    stripes.appendChild(stripe);
  });

  const wordmark = document.createElement("div");
  wordmark.className = "portal-wordmark";
  // Threading the source-page accent through the dot + name gradient
  // makes the return read as a clean reversal of the entry portal,
  // not a separate animation.
  wordmark.style.setProperty("--portal-accent", leadAccent);
  wordmark.innerHTML = `
    <span class="portal-meta">
      <span class="portal-meta-dot"></span>
      <span>returning to</span>
      <span class="portal-meta-rule"></span>
      <span>dim.&nbsp;01</span>
    </span>
    <span class="portal-route">
      <span class="portal-slash">/</span>
      <span class="portal-name">home</span>
    </span>
    <span class="portal-tag">light side — back to the deck</span>
  `;

  stage.appendChild(stripes);
  stage.appendChild(wordmark);
  document.body.appendChild(stage);

  return stage;
}

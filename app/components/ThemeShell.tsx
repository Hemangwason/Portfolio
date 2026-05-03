"use client";

import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
  /** The route slug stamped over the portal during the dimensional shift. */
  wordmark: string;
  /** Used to color the wordmark accent dot + the central panel tint. */
  accent?: "brand" | "accent";
};

/**
 * Wraps a route in the dark dimension. On mount it:
 *   1. Sets `data-theme="dark"` on <html> (and the meta theme-color).
 *   2. Plays a "studio cut" portal: a sequence of staggered colored
 *      stripes that drop in from the top, hold long enough to stamp
 *      the route name, then retract upward. Total ≈ 1.4s.
 *
 * On unmount it restores the previous theme and color.
 */
export function ThemeShell({ children, wordmark, accent = "brand" }: Props) {
  const [showPortal, setShowPortal] = useState(true);

  useEffect(() => {
    const html = document.documentElement;
    const prevTheme = html.getAttribute("data-theme");
    html.setAttribute("data-theme", "dark");

    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    const prevMeta = meta?.getAttribute("content") ?? null;
    if (meta) meta.setAttribute("content", "#000000");

    // Stripe cycle is ~1.3s; give a small tail before unmounting.
    const t = window.setTimeout(() => setShowPortal(false), 1500);

    return () => {
      window.clearTimeout(t);
      if (prevTheme) html.setAttribute("data-theme", prevTheme);
      else html.removeAttribute("data-theme");
      if (meta && prevMeta) meta.setAttribute("content", prevMeta);
    };
  }, []);

  return (
    <>
      {children}
      {showPortal && <Portal route={wordmark} accent={accent} />}
    </>
  );
}

type PortalProps = {
  route: string;
  accent: "brand" | "accent";
};

// "Studio cut" portal — a five-panel staggered drop, then a centered
// wordmark with a serif italic slash, then the panels retract.
// All movement is `transform: translateY` so the GPU does the work.
function Portal({ route, accent }: PortalProps) {
  const accentVar = accent === "accent" ? "var(--accent)" : "var(--brand)";

  // Picked so the eye reads as a sequence (left → right) without
  // ever leaving a gap: brand → black → accent → black → near-black.
  const stripes: { color: string; label: string }[] = [
    { color: accentVar, label: "01" },
    { color: "#06070a", label: "02" },
    { color: accent === "accent" ? "var(--brand)" : "var(--accent)", label: "03" },
    { color: "#0c0c14", label: "04" },
    { color: "#000000", label: "05" },
  ];

  // Slugify display: trim leading slash so the slash can be its own
  // serif italic moment in the wordmark.
  const slug = route.replace(/^\//, "");

  return (
    <div className="portal-stage" aria-hidden>
      <div className="portal-stripes">
        {stripes.map((s, i) => (
          <span
            key={i}
            className="portal-stripe"
            style={{
              background: s.color,
              ["--stripe-delay" as string]: `${i * 60}ms`,
            }}
          >
            <span className="portal-stripe-label">cut · {s.label}</span>
          </span>
        ))}
      </div>

      <div className="portal-wordmark">
        <span
          className="portal-meta"
          style={{ ["--portal-accent" as string]: accentVar }}
        >
          <span className="portal-meta-dot" />
          <span>now entering</span>
          <span className="portal-meta-rule" />
          <span>dim.&nbsp;02</span>
        </span>

        <span className="portal-route">
          <span className="portal-slash">/</span>
          <span className="portal-name">{slug}</span>
        </span>

        <span className="portal-tag">
          {accent === "accent"
            ? "the visual archive — posters, type, motion"
            : "the product wing — research, systems, ship"}
        </span>
      </div>
    </div>
  );
}

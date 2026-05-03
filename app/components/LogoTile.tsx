"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { platformByKey, type PlatformKey } from "./BrandLogos";

type Size = "sm" | "md" | "lg";

type Props = {
  platformKey: PlatformKey;
  size?: Size;
  withLabel?: boolean;
  className?: string;
  style?: CSSProperties;
  noLink?: boolean;
};

const sizeMap: Record<
  Size,
  { tile: string; icon: string; card: string; label: string; name: string }
> = {
  sm: {
    tile: "h-9 w-9 rounded-[8px]",
    icon: "h-4 w-4",
    card: "py-1.5 pr-3",
    label: "text-[9px]",
    name: "text-[12px]",
  },
  md: {
    tile: "h-10 w-10 rounded-[10px]",
    icon: "h-5 w-5",
    card: "py-2 pr-3.5",
    label: "text-[10px]",
    name: "text-[13px]",
  },
  lg: {
    tile: "h-12 w-12 rounded-[12px]",
    icon: "h-6 w-6",
    card: "py-2.5 pr-4",
    label: "text-[10px]",
    name: "text-[14px]",
  },
};

// Shared "candy 3D" tile treatment so the platform tiles in the hero
// floating logos and the footer badges read in the same render-language
// as the carousel icon bar's active pill: a vertical gradient that
// derives a lighter top and darker bottom from the brand colour, an
// inset top-highlight + bottom-shadow for the embossed glass feel, plus
// a tight contact shadow + a soft floor shadow for grounded depth.
const tileStyle = (brand: string): CSSProperties => ({
  background: `linear-gradient(180deg, color-mix(in oklab, ${brand} 70%, white) 0%, ${brand} 55%, color-mix(in oklab, ${brand} 88%, black) 100%)`,
  boxShadow: [
    "0 1px 0 rgba(255,255,255,0.55) inset",
    "0 -1px 1px rgba(0,0,0,0.12) inset",
    "0 6px 14px rgba(15,23,42,0.12)",
    "0 1px 2px rgba(15,23,42,0.08)",
  ].join(", "),
});

const tileIconStyle: CSSProperties = {
  // Subtle drop shadow lifts the brand glyph off the gradient just like
  // the SVG icons in the carousel bar.
  filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.22))",
};

export function LogoTile({
  platformKey,
  size = "md",
  withLabel = true,
  className = "",
  style,
  noLink = false,
}: Props) {
  const s = sizeMap[size];
  const platform = platformByKey[platformKey];
  const { Icon, brand, textOnBrand = "#fff", name, label, href } = platform;

  const content = (
    <div
      className={`glass inline-flex items-center gap-2.5 rounded-[14px] pl-1.5 ${s.card} ${className}`}
      style={style}
    >
      <span
        className={`relative grid place-items-center ${s.tile}`}
        style={{ ...tileStyle(brand), color: textOnBrand }}
      >
        <Icon className={s.icon} style={tileIconStyle} />
      </span>
      {withLabel && (
        <div className="flex flex-col leading-tight">
          <span
            className={`font-mono uppercase tracking-[0.16em] text-[var(--ink-soft)] ${s.label}`}
          >
            {label}
          </span>
          <span
            className={`font-semibold text-[var(--foreground)] ${s.name}`}
          >
            {name}
          </span>
        </div>
      )}
    </div>
  );

  if (noLink || !href || href === "#") {
    return content;
  }

  const isExternal = href.startsWith("http");

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={name}
        className="pointer-events-auto inline-block"
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} prefetch={false} aria-label={name} className="pointer-events-auto inline-block">
      {content}
    </Link>
  );
}

export function LogoBadge({
  platformKey,
  size = "md",
  className = "",
}: {
  platformKey: PlatformKey;
  size?: Size;
  className?: string;
}) {
  const s = sizeMap[size];
  const platform = platformByKey[platformKey];
  const { Icon, brand, textOnBrand = "#fff" } = platform;

  return (
    <span
      className={`relative grid place-items-center ${s.tile} ${className}`}
      style={{ ...tileStyle(brand), color: textOnBrand }}
      aria-label={platform.name}
    >
      <Icon className={s.icon} style={tileIconStyle} />
    </span>
  );
}

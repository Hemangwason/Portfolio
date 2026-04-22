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
        style={{ background: brand, color: textOnBrand }}
      >
        <Icon className={s.icon} />
      </span>
      {withLabel && (
        <div className="flex flex-col leading-tight">
          <span
            className={`font-mono uppercase tracking-[0.16em] text-black/50 ${s.label}`}
          >
            {label}
          </span>
          <span className={`font-semibold text-black ${s.name}`}>{name}</span>
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
      style={{ background: brand, color: textOnBrand }}
      aria-label={platform.name}
    >
      <Icon className={s.icon} />
    </span>
  );
}

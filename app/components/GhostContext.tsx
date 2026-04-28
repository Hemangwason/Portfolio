"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  DEFAULT_VARIANT,
  GHOST_VARIANTS,
  type GhostVariant,
} from "./GhostVariants";

type Ctx = {
  variant: GhostVariant;
  setVariantById: (id: string) => void;
  hasPicked: boolean;
};

const GhostCtx = createContext<Ctx | null>(null);
const STORAGE_KEY = "hp-ghost-variant";

export function GhostProvider({ children }: { children: React.ReactNode }) {
  const [variantId, setVariantId] = useState<string>(DEFAULT_VARIANT.id);
  const [hasPicked, setHasPicked] = useState(false);

  // Hydrate from localStorage on mount — keeps the user's pick across visits
  // without forcing a SSR mismatch on first render.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && GHOST_VARIANTS.some((v) => v.id === saved)) {
        setVariantId(saved);
        setHasPicked(true);
      }
    } catch {
      // localStorage can throw in private mode; the default variant is fine.
    }
  }, []);

  const setVariantById = (id: string) => {
    if (!GHOST_VARIANTS.some((v) => v.id === id)) return;
    setVariantId(id);
    setHasPicked(true);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {}
  };

  const variant =
    GHOST_VARIANTS.find((v) => v.id === variantId) ?? DEFAULT_VARIANT;

  return (
    <GhostCtx.Provider value={{ variant, setVariantById, hasPicked }}>
      {children}
    </GhostCtx.Provider>
  );
}

// Falls back to the default variant if used outside a provider so the Ghost
// component still renders during isolated tests / Storybook-style previews.
export function useGhost(): Ctx {
  const ctx = useContext(GhostCtx);
  if (!ctx) {
    return {
      variant: DEFAULT_VARIANT,
      setVariantById: () => {},
      hasPicked: false,
    };
  }
  return ctx;
}

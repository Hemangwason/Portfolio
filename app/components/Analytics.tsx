"use client";

import { useEffect } from "react";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
/** Fallback when the browser has no idle callback. */
const IDLE_FALLBACK_MS = 2500;

/** Analytics load once the page is idle, off the critical path. */
export function Analytics() {
  useEffect(() => {
    if (!KEY) return;
    let cancelled = false;

    const start = () => {
      import("posthog-js")
        .then(({ default: posthog }) => {
          if (cancelled || (posthog as unknown as { __loaded?: boolean }).__loaded) return;
          posthog.init(KEY, {
            api_host: HOST,
            defaults: "2025-05-24",
            capture_pageview: "history_change",
            capture_pageleave: true,
            autocapture: true,
            capture_performance: true,
            disable_session_recording: true,
            persistence: "localStorage+cookie",
            person_profiles: "identified_only",
          });
        })
        .catch(() => {
          // Analytics are optional; a failed load must never affect the page.
        });
    };

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(start, { timeout: IDLE_FALLBACK_MS * 2 });
      return () => {
        cancelled = true;
        w.cancelIdleCallback?.(id);
      };
    }
    const t = setTimeout(start, IDLE_FALLBACK_MS);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  return null;
}

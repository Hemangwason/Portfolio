"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

export function Analytics() {
  useEffect(() => {
    if (!KEY) return;
    if (typeof window === "undefined") return;
    if ((posthog as unknown as { __loaded?: boolean }).__loaded) return;

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
  }, []);

  return null;
}

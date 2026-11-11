export const EMAIL = "hemangwason@gmail.com";
export const LINKEDIN_URL = "https://www.linkedin.com/in/hemang-wason-577205161/";
export const X_URL = "https://x.com/Hemangsidetake";
export const CV_URL = "/hemang-wason-cv.pdf";

/**
 * Instagram profile URL. Empty until it's filled in — while empty the
 * header's INSTA cell falls back to X so no cell ever links nowhere.
 */
export const INSTAGRAM_URL = "";

export const SOCIAL_PRIMARY = INSTAGRAM_URL
  ? { label: "Insta", href: INSTAGRAM_URL }
  : { label: "X", href: X_URL };

export const LIVE_SITES = [
  { label: "jexlindesigns.com", href: "https://jexlindesigns.com/" },
  { label: "sidetake.com", href: "https://www.sidetake.com/" },
  { label: "thelabmagofficial.com", href: "https://www.thelabmagofficial.com/" },
  { label: "mckinleyrice.com", href: "https://mckinleyrice.com/" },
] as const;

/** Board-mode ticker: loading-screen style one-liners. */
export const BOARD_TICKER = [
  "Rendering 17 projects",
  "Kicking 2.8M penalties",
  "Warming up the After Effects render queue",
  "Teaching Lottie a new trick",
  "Hanging festival lights on the home feed",
  "Buffering 1.81M birthday wishes",
  "Scroll to zoom · drag to turn · click to open",
];

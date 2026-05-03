import Link from "next/link";

type Props = {
  accent: string;
  label?: string;
};

// Plain server component. The pill sits at fixed top-left over whatever
// the user happens to be scrolling past — including bright project
// thumbnails — so the surface is hard-coded to a near-opaque dark with
// a hairline white ring. It reads identically over white, color, and
// black backgrounds.
export function BackHome({ accent, label = "home" }: Props) {
  return (
    <Link
      href="/"
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

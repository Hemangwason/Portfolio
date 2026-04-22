import Link from "next/link";

type Props = {
  accent: string;
  label?: string;
};

export function BackHome({ accent, label = "home" }: Props) {
  return (
    <Link
      href="/"
      className="group fixed left-5 top-5 z-50 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-black/80 shadow-sm backdrop-blur transition-transform hover:-translate-y-0.5"
    >
      <span
        className="flex h-4 w-4 items-center justify-center rounded-full transition-transform group-hover:-translate-x-0.5"
        style={{ background: accent }}
      >
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path
            d="M5 1L2 4L5 7"
            stroke="black"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {label}
    </Link>
  );
}

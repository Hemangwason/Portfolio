"use client";

import { BirdMark } from "../shared/BirdMark";

const X_URL = "https://x.com/Hemangsidetake";
const LINKEDIN_URL = "https://www.linkedin.com/in/hemang-wason-577205161/";
const EMAIL = "mailto:hemangwason@gmail.com";

const scrollToTop = (e: React.MouseEvent) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

function NavCell({
  href,
  children,
  onClick,
  external,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  external?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`gl-link mono-label flex items-center justify-center px-4 ${className}`}
    >
      {children}
    </a>
  );
}

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <h1 className={`text-center leading-none tracking-[-0.02em] ${className}`}>
      Hemang <em className="italic">Wason</em>
    </h1>
  );
}

/** Bordered header grid sitting over the globe. */
export function GlobeHeader() {
  return (
    <header
      className="relative z-20 border-b border-[var(--rule)] bg-[var(--paper)] text-[var(--ink)]"
      style={{ height: "var(--header-h)" }}
    >
      {/* desktop */}
      <div className="hidden h-full grid-cols-[134px_1fr_minmax(300px,400px)_1fr_134px] grid-rows-[49px_48px_1fr] md:grid">
        <div className="gl-cell col-start-1 row-start-1 grid grid-cols-2 border-b border-r">
          <NavCell href="#top" onClick={scrollToTop} className="border-r border-[var(--rule)]">
            Home
          </NavCell>
          <NavCell href="#about">About</NavCell>
        </div>
        <div className="gl-cell col-start-2 row-start-1 border-b border-r" />
        <div className="gl-cell col-start-2 row-start-2 flex items-center justify-center border-b border-r">
          <p className="hidden whitespace-nowrap text-[clamp(17px,1.5vw,22px)] leading-none lg:block">
            Product + Visual + Motion
          </p>
        </div>
        <div className="gl-cell col-start-2 row-start-3 border-r" />

        <div className="gl-cell col-start-3 row-span-3 row-start-1 flex items-center justify-center border-r">
          <Wordmark className="text-[clamp(2.6rem,3.9vw,3.5rem)]" />
        </div>

        <div className="gl-cell col-start-4 row-start-1 border-b border-r" />
        <div className="gl-cell col-start-4 row-start-2 flex items-center justify-center border-b border-r">
          <p className="hidden whitespace-nowrap text-[clamp(17px,1.5vw,22px)] leading-none lg:block">
            Designing Things People Play
          </p>
        </div>
        <div className="gl-cell col-start-4 row-start-3 border-r" />

        <div className="gl-cell col-start-5 row-start-1 grid grid-cols-2 border-b">
          <NavCell href={X_URL} external className="border-r border-[var(--rule)]">
            X
          </NavCell>
          <NavCell href={LINKEDIN_URL} external>
            Link
          </NavCell>
        </div>
        <div className="col-start-5 row-span-2 row-start-2 p-[7px]">
          <a
            href={EMAIL}
            className="flex h-full w-full items-center justify-center rounded-[4px] bg-[var(--signal)] text-[26px] leading-none text-white transition-transform hover:scale-[0.97]"
          >
            Say Hello
          </a>
        </div>

        <div className="gl-cell col-start-1 row-span-2 row-start-2 flex items-center justify-center border-r">
          <BirdMark className="bird-flap h-14 w-14 text-[var(--ink)]" title="Hemang Wason" />
        </div>
      </div>

      {/* mobile */}
      <div className="flex h-full flex-col md:hidden">
        <div className="gl-cell flex h-10 border-b">
          <NavCell href="#top" onClick={scrollToTop} className="border-r border-[var(--rule)]">
            Home
          </NavCell>
          <NavCell href="#about" className="border-r border-[var(--rule)]">
            About
          </NavCell>
          <span className="flex-1" />
          <NavCell href={X_URL} external className="border-l border-[var(--rule)]">
            X
          </NavCell>
          <NavCell href={LINKEDIN_URL} external className="border-l border-[var(--rule)]">
            Link
          </NavCell>
        </div>
        <div className="flex flex-1 items-stretch">
          <div className="gl-cell flex w-16 shrink-0 items-center justify-center border-r">
            <BirdMark className="bird-flap h-8 w-8" title="Hemang Wason" />
          </div>
          <div className="flex flex-1 items-center justify-center px-2">
            <Wordmark className="text-[2.1rem]" />
          </div>
          <div className="w-[92px] shrink-0 p-[6px]">
            <a
              href={EMAIL}
              className="flex h-full w-full items-center justify-center rounded-[4px] bg-[var(--signal)] text-center text-[18px] leading-none text-white"
            >
              Say Hello
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

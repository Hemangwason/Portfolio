"use client";

import { useEffect, useRef, useState } from "react";
import { fieldLabel, type Project } from "../../data/projects";
import { LINKEDIN_URL, SOCIAL_PRIMARY } from "./links";
import { WireCube } from "./WireCube";

export type NavActions = {
  onHome: () => void;
  onAbout: () => void;
  onContact: () => void;
};

type Active = "home" | "about" | "contact" | "project";

function NavLink({
  href,
  label,
  onClick,
  current,
  className = "",
}: {
  href: string;
  label: string;
  onClick?: () => void;
  current?: boolean;
  className?: string;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-current={current ? "page" : undefined}
      onClick={(e) => {
        if (!onClick) return;
        e.preventDefault();
        onClick();
      }}
      className={`hdr-link label flex items-center justify-center px-4 ${className}`}
    >
      {label}
    </a>
  );
}

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`display whitespace-nowrap leading-none tracking-[-0.01em] text-[var(--cream)] ${className}`}>
      Hemang <span className="font-medium opacity-70">Wason</span>
    </span>
  );
}

/** Full bordered header grid shown over the board. */
export function BoardHeader({ actions, active, collapsed }: { actions: NavActions; active: Active; collapsed: boolean }) {
  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b border-[var(--rule)] bg-[var(--bg)] transition-transform duration-500 ${collapsed ? "hdr-collapsed" : ""}`}
      style={{ height: "var(--hdr-h)" }}
    >
      {/* desktop */}
      <div className="hidden h-full grid-cols-[var(--hdr-side)_1fr_var(--hdr-centre)_1fr_var(--hdr-side)] grid-rows-[49px_48px_1fr] md:grid">
        <div className="col-start-1 row-start-1 grid grid-cols-2 border-b border-r border-[var(--rule)]">
          <NavLink href="/" label="Home" onClick={actions.onHome} current={active === "home"} className="border-r border-[var(--rule)]" />
          <NavLink href="/about" label="About" onClick={actions.onAbout} current={active === "about"} />
        </div>
        <div className="col-start-2 row-start-1 border-b border-r border-[var(--rule)]" />
        <div className="col-start-2 row-start-2 flex items-center justify-center border-b border-r border-[var(--rule)]">
          <p className="hidden whitespace-nowrap text-[clamp(15px,1.25vw,18px)] font-medium leading-none tracking-[-0.01em] lg:block">
            Product + Visual
          </p>
        </div>
        <div className="col-start-2 row-start-3 border-r border-[var(--rule)]" />

        <div className="col-start-3 row-span-3 row-start-1 flex items-center justify-center border-r border-[var(--rule)]">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              actions.onHome();
            }}
            aria-label="Hemang Wason — home"
          >
            <Wordmark className="text-[clamp(2.4rem,3.6vw,3.25rem)]" />
          </a>
        </div>

        <div className="col-start-4 row-start-1 border-b border-r border-[var(--rule)]" />
        <div className="col-start-4 row-start-2 flex items-center justify-center border-b border-r border-[var(--rule)]">
          <p className="hidden whitespace-nowrap text-[clamp(15px,1.25vw,18px)] font-medium leading-none tracking-[-0.01em] lg:block">
            Designing Things People Play
          </p>
        </div>
        <div className="col-start-4 row-start-3 border-r border-[var(--rule)]" />

        <div className="col-start-5 row-start-1 grid grid-cols-2 border-b border-[var(--rule)]">
          <NavLink href={SOCIAL_PRIMARY.href} label={SOCIAL_PRIMARY.label} className="border-r border-[var(--rule)]" />
          <NavLink href={LINKEDIN_URL} label="Link" />
        </div>
        <div className="col-start-5 row-span-2 row-start-2 p-[7px]">
          <SayHello onClick={actions.onContact} className="h-full w-full text-[21px]" />
        </div>

        <div className="col-start-1 row-span-2 row-start-2 flex items-center justify-center border-r border-[var(--rule)]">
          <WireCube size={40} />
        </div>
      </div>

      {/* mobile */}
      <div className="flex h-full flex-col md:hidden">
        <div className="flex h-10 border-b border-[var(--rule)]">
          <NavLink href="/" label="Home" onClick={actions.onHome} current={active === "home"} className="border-r border-[var(--rule)]" />
          <NavLink href="/about" label="About" onClick={actions.onAbout} current={active === "about"} className="border-r border-[var(--rule)]" />
          <span className="flex-1" />
          <NavLink href={SOCIAL_PRIMARY.href} label={SOCIAL_PRIMARY.label} className="border-l border-[var(--rule)]" />
          <NavLink href={LINKEDIN_URL} label="Link" className="border-l border-[var(--rule)]" />
        </div>
        <div className="flex flex-1 items-stretch">
          <div className="flex w-14 shrink-0 items-center justify-center border-r border-[var(--rule)]">
            <WireCube size={24} />
          </div>
          <div className="flex flex-1 items-center justify-center">
            <Wordmark className="text-[1.9rem]" />
          </div>
          <div className="w-[96px] shrink-0 p-[6px]">
            <SayHello onClick={actions.onContact} className="h-full w-full whitespace-nowrap text-[15px]" />
          </div>
        </div>
      </div>
    </header>
  );
}

function SayHello({ onClick, className = "" }: { onClick: () => void; className?: string }) {
  return (
    <a
      href="/contact"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center justify-center rounded-[4px] bg-[var(--red)] px-3 font-semibold leading-none tracking-[-0.02em] text-white transition-transform hover:scale-[0.97] ${className}`}
    >
      Say Hello
    </a>
  );
}

/** Compact floating pill used while a project is open. */
export function PillHeader({
  actions,
  visible,
  projects,
  current,
  onPick,
}: {
  actions: NavActions;
  visible: boolean;
  projects: Project[];
  current: Project | null;
  onPick: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const groups = ["Product", "Visual + Motion"].map((label) => ({
    label,
    items: projects.filter((p) => fieldLabel(p) === label),
  }));

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 top-0 z-50 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
      aria-hidden={!visible}
    >
      <div className={`flex items-start justify-between ${visible ? "pointer-events-auto" : ""}`}>
        <div className="flex h-12">
          <NavLink href="/" label="Home" onClick={actions.onHome} />
          <NavLink href="/about" label="About" onClick={actions.onAbout} className="hidden sm:flex" />
        </div>
        <div className="flex h-12">
          <NavLink href={SOCIAL_PRIMARY.href} label={SOCIAL_PRIMARY.label} className="hidden sm:flex" />
          <NavLink href={LINKEDIN_URL} label="Link" />
        </div>
      </div>

      <div
        ref={menuRef}
        className={`pill absolute left-1/2 top-5 flex h-[46px] -translate-x-1/2 items-stretch rounded-[10px] ${visible ? "pointer-events-auto" : ""}`}
      >
        <button
          type="button"
          onClick={actions.onHome}
          className="hidden items-center border-r border-[var(--rule-strong)] px-3 sm:flex"
          aria-label="Back to the board"
        >
          <Wordmark className="text-[22px]" />
        </button>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-haspopup="listbox"
          className={`flex w-[150px] items-center justify-between gap-2 border-r border-[var(--rule-strong)] px-3 text-left text-[13px] sm:w-[170px] ${menuOpen ? "text-[var(--red)]" : ""}`}
        >
          <span className="truncate">{current?.title ?? "Projects"}</span>
          <span aria-hidden className={`text-[11px] transition-transform ${menuOpen ? "rotate-180" : ""}`}>
            ▾
          </span>
        </button>
        <div className="flex items-center px-[6px]">
          <SayHello onClick={actions.onContact} className="h-[34px] whitespace-nowrap text-[14px] sm:text-[16px]" />
        </div>

        {menuOpen && (
          <div
            role="listbox"
            data-scroll-momentum
            className="absolute left-1/2 top-[52px] max-h-[60vh] w-[200px] -translate-x-1/2 overflow-y-auto rounded-[10px] border border-[var(--rule-strong)] bg-[var(--bg)] px-3 py-2 sm:left-[calc(50%-24px)]"
          >
            {groups.map((g) => (
              <div key={g.label} className="py-1.5">
                <p className="label py-1.5 text-[10px] text-[var(--cream-faint)]">{g.label}</p>
                {g.items.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    role="option"
                    aria-selected={p.id === current?.id}
                    onClick={() => {
                      setMenuOpen(false);
                      onPick(p.id);
                    }}
                    className={`block w-full py-1 text-left text-[13px] hover:text-[var(--red)] ${p.id === current?.id ? "text-[var(--red)]" : ""}`}
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

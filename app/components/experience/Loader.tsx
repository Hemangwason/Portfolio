import { WireCube } from "./WireCube";

/** Boot screen: the wordmark sweeps into colour over a spinning cube. */
export function Loader({ done }: { done: boolean }) {
  return (
    <div
      aria-hidden={done}
      role="status"
      className={`fixed inset-0 z-[90] flex flex-col items-center justify-center gap-8 bg-[var(--bg)] ${done ? "fade-out" : ""}`}
    >
      <p className="display logo-sweep text-[clamp(2.6rem,6vw,3.4rem)] leading-none" style={{ animationDuration: "2.6s" }}>
        Hemang <span className="font-medium">Wason</span>
      </p>
      <WireCube size={64} />
      <span className="sr-only">Loading the globe</span>
    </div>
  );
}

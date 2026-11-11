import { GradientOrb } from "./GradientOrb";

/** Boot screen: the wordmark sweeps colour above a turning iridescent orb. */
export function Loader({ done }: { done: boolean }) {
  return (
    <div
      aria-hidden={done}
      role="status"
      className={`fixed inset-0 z-[90] flex flex-col items-center justify-center gap-8 iris-bg ${done ? "fade-out" : ""}`}
    >
      <p className="display logo-sweep max-w-full whitespace-nowrap px-6 text-[clamp(2rem,9vw,3.4rem)] leading-[1.1]" style={{ animationDuration: "2.6s" }}>
        Hemang <span className="font-medium">Wason</span>
      </p>
      <GradientOrb size={120} blur={5} />
      <span className="sr-only">Loading the globe</span>
    </div>
  );
}

import { BirdMark } from "../shared/BirdMark";
import { StudioRail } from "../shared/StudioRail";

type Props = {
  labelRef: React.RefObject<HTMLSpanElement | null>;
};

/**
 * Hairline instrument chrome framing the entrance. White on black,
 * and — through `mix-blend-mode: difference` — black on white once
 * the bird floods the stage.
 */
export function EntranceChrome({ labelRef }: Props) {
  return (
    <div className="entrance-chrome times pointer-events-none absolute inset-0 z-10 text-[13px] sm:text-[14px]">
      {/* top rail */}
      <div className="absolute inset-x-0 top-0 h-12">
        <span className="absolute left-[18px] top-[42px] h-[3px] w-[3px] rounded-full bg-current" />

        <span className="absolute right-[calc(66.8%+8px)] top-[28px] flex items-center gap-1.5">
          <span className="inline-block h-[5px] w-[5px] bg-current" />
          <span ref={labelRef}>Entrance</span>
        </span>
        <span className="absolute left-[33.2%] top-3 h-9 w-px bg-current" />
        <span className="absolute left-[calc(33.2%+8px)] top-2.5 tracking-[0.1em]">··</span>

        <span className="absolute left-[63.3%] top-3 hidden h-[11px] w-9 bg-current sm:block" />
        <span className="absolute left-[66.1%] top-3 hidden h-9 w-px bg-current sm:block" />
        <span className="absolute left-[67.2%] top-[7px] hidden tracking-[0.1em] sm:block">···</span>

        <span className="absolute right-[48px] top-3 h-[11px] w-12 bg-current sm:w-[66px]" />
        <BirdMark className="absolute right-[24px] top-[10px] h-4 w-4" />
        <span className="absolute right-[16px] top-3 h-9 w-px bg-current" />
      </div>

      <StudioRail className="absolute inset-x-0 bottom-0" />
    </div>
  );
}

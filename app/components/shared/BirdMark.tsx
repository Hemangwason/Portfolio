/**
 * Hemang's swallow mark, drawn on a 100×100 grid. The forked tail and
 * swept wings are the identity; the solid body around (50, 56) is the
 * point the entrance zooms through, so it must stay filled.
 */
export const BIRD_PATH =
  "M50 34 L58 40 L98 14 L74 52 L66 58 L72 86 L50 70 L28 86 L34 58 L26 52 L2 14 L42 40 Z";

/** Zoom origin — a point safely inside the solid body. */
export const BIRD_ORIGIN = { x: 50, y: 56 } as const;

type Props = {
  className?: string;
  title?: string;
};

export function BirdMark({ className, title }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <path d={BIRD_PATH} />
    </svg>
  );
}

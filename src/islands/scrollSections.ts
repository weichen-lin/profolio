export const TOTAL_SCROLL_SECTIONS = 6;
export const FADE_PORTION = 0.1;

export function sectionRange(index: number) {
  const size = 1 / TOTAL_SCROLL_SECTIONS;
  const start = index * size;
  const end = start + size;
  const fade = size * FADE_PORTION;
  const isLast = index === TOTAL_SCROLL_SECTIONS - 1;

  return {
    input: isLast ? [start, start + fade, end] : [start, start + fade, end - fade, end],
    output: isLast ? [0, 1, 1] : [0, 1, 1, 0],
    visibleStart: start + fade,
    visibleEnd: isLast ? 1 : end - fade,
    start,
    end,
    fade,
  } as const;
}

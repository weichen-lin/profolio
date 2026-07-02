export const TOTAL_SCROLL_SECTIONS = 6;
export const FADE_PORTION = 0.1;
const FINALE_START = 0.986;
const LAST_SECTION_FADE_OUT_START = 0.955;

export function sectionRange(index: number) {
  const size = 1 / TOTAL_SCROLL_SECTIONS;
  const start = index * size;
  const end = start + size;
  const fade = size * FADE_PORTION;
  const isLast = index === TOTAL_SCROLL_SECTIONS - 1;

  return {
    input: isLast
      ? [start, start + fade, LAST_SECTION_FADE_OUT_START, FINALE_START]
      : [start, start + fade, end - fade, end],
    output: [0, 1, 1, 0],
    visibleStart: start + fade,
    visibleEnd: isLast ? FINALE_START : end - fade,
    start,
    end,
    fade,
  } as const;
}

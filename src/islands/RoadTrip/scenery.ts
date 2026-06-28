import { NEAR, SPAN, POST_X } from "./constants";

export type SideObject = {
  baseZ: number; // distance along the road
  worldX: number; // lateral offset (sign = side)
  kind: "tree" | "lamp" | "rock";
};

// Deterministic pseudo-random so SSR and client agree.
function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

// Evenly spaced center-line dashes (z positions across one span).
export const DASH_COUNT = 20;
export const DASHES: number[] = Array.from(
  { length: DASH_COUNT },
  (_, i) => NEAR + (SPAN * i) / DASH_COUNT,
);

// Roadside objects on both shoulders, spread through depth.
function buildSide() {
  const r = rng(104729);
  const items: SideObject[] = [];
  const COUNT = 26;
  for (let i = 0; i < COUNT; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const baseZ = NEAR + (SPAN * (i + r() * 0.6)) / COUNT;
    const worldX = side * (POST_X + r() * 220);
    const roll = r();
    const kind: SideObject["kind"] =
      roll < 0.5 ? "tree" : roll < 0.8 ? "rock" : "lamp";
    items.push({ baseZ, worldX, kind });
  }
  return items;
}

export const SIDE_OBJECTS = buildSide();

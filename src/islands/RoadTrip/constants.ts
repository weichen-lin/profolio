// Perspective highway projected into a 1000x1000 viewBox (slice-filled).
// The world is a flat road plane; objects have a forward distance z and a
// lateral offset worldX. We project them toward a vanishing point on the
// horizon. Driving forward = decreasing every object's z.

// Landscape viewBox + bottom-aligned slice (see RoadSvg) keeps the road and
// car pinned to the bottom and visible on every aspect ratio.
export const VIEW = { w: 1000, h: 640 } as const;

export const HORIZON = 250; // y of the vanishing line
export const BOTTOM = 720; // y where the nearest (z = NEAR) point lands
export const ROAD_HALF = 340; // half road width in near (scale 1) units
export const POST_X = 560; // lateral offset of roadside objects

export const NEAR = 1.0;
export const FAR = 26.0;
export const SPAN = FAR - NEAR;

// How far we "drive" across the whole scroll (many cycles => lots of motion).
export const DRIVE_LEN = SPAN * 7;

// Where each section sits as a fraction of scroll progress (for markers/anchors).
export const WAYPOINTS: { id: string; t: number }[] = [
  { id: "hero", t: 0.04 },
  { id: "about", t: 0.22 },
  { id: "skills", t: 0.4 },
  { id: "projects", t: 0.58 },
  { id: "experience", t: 0.76 },
  { id: "contact", t: 0.96 },
];

// Sky / ground palettes, lerped DAY -> DUSK, weighted to the final stretch.
type RGB = readonly [number, number, number];
export const SKY_DAY = {
  top: [0x8c, 0xb6, 0xd9] as RGB, // soft blue
  horizon: [0xe8, 0xee, 0xf2] as RGB, // pale
  ground: [0xe9, 0xe6, 0xde] as RGB, // warm grey
};
export const SKY_DUSK = {
  top: [0x3a, 0x3c, 0x6e] as RGB, // deep dusk violet
  horizon: [0xff, 0xc6, 0x8a] as RGB, // warm amber band
  ground: [0xc9, 0x8f, 0x73] as RGB, // warm earth
};

// The car graphic. SWAP IT: drop your own SVG at public/car.svg (or change
// `src`), then tweak w/h until it sits nicely. Pick a car seen from BEHIND or
// top-down, pointing "away" (up the road), so it reads as driving into frame.
export const CAR = {
  src: "/car.svg",
  w: 220,
  h: 170,
  y: 560, // screen y of the car's center (near the bottom of the view)
} as const;

// Roadside graphics — also swappable. Drop your own SVGs in public/scenery/
// (anchored so the bottom-center sits on the ground). Tweak w/h for scale.
export const SIDE_ASSETS: Record<
  "tree" | "lamp" | "rock",
  { src: string; w: number; h: number }
> = {
  tree: { src: "/scenery/tree.svg", w: 130, h: 165 },
  lamp: { src: "/scenery/lamp.svg", w: 80, h: 185 },
  rock: { src: "/scenery/bush.svg", w: 130, h: 80 },
};

export const SUN = {
  xDay: 760,
  yDay: 150,
  xDusk: 500,
  yDusk: HORIZON - 6,
} as const;

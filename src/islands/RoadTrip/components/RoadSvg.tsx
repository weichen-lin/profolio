import type { RefObject } from "react";
import { VIEW, HORIZON, BOTTOM, ROAD_HALF, SIDE_ASSETS } from "../constants";
import { DASHES, SIDE_OBJECTS } from "../scenery";
import Car from "./Car";

type Props = {
  carRef: RefObject<SVGGElement | null>;
  sunRef: RefObject<SVGGElement | null>;
  compact?: boolean;
};

// Roadside object = an external SVG anchored bottom-center on the ground.
// Swap the files in public/scenery/ (see SIDE_ASSETS in constants.ts).
function SideShape({ kind }: { kind: "tree" | "lamp" | "rock" }) {
  const a = SIDE_ASSETS[kind];
  return (
    <image
      href={a.src}
      width={a.w}
      height={a.h}
      x={-a.w / 2}
      y={-a.h}
      preserveAspectRatio="xMidYMax meet"
      style={{ pointerEvents: "none" }}
    />
  );
}

export default function RoadSvg({ carRef, sunRef, compact = false }: Props) {
  const apex = 500;
  const dashes = compact ? DASHES.filter((_, i) => i % 2 === 0) : DASHES;
  const sideObjects = compact
    ? SIDE_OBJECTS.filter((_, i) => i % 2 === 0)
    : SIDE_OBJECTS;
  return (
    <svg
      className="rt-svg absolute inset-0 z-0 block h-full w-full"
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="rt-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--sky-top)" />
          <stop offset="1" stopColor="var(--sky-horizon)" />
        </linearGradient>
        <radialGradient id="rt-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff3da" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#ffcf94" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffcf94" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rt-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2f3036" stopOpacity="0.12" />
          <stop offset="55%" stopColor="#1f2026" stopOpacity="0.44" />
          <stop offset="100%" stopColor="#121318" stopOpacity="0.88" />
        </linearGradient>
        {/* sandy grain for the roadside ground */}
        <filter id="rt-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.18 0.24"
            numOctaves={3}
            seed={11}
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix in="noise" type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="1.5" intercept="-0.25" />
            <feFuncG type="linear" slope="1.5" intercept="-0.25" />
            <feFuncB type="linear" slope="1.5" intercept="-0.25" />
          </feComponentTransfer>
        </filter>
        {/* keep the sandy grain off the road surface */}
        <mask id="rt-sand-mask">
          <rect x={0} y={HORIZON} width={VIEW.w} height={VIEW.h - HORIZON} fill="white" />
          <polygon
            points={`500,${HORIZON} ${500 - ROAD_HALF},${BOTTOM} ${500 + ROAD_HALF},${BOTTOM}`}
            fill="black"
          />
        </mask>
      </defs>

      {/* sky */}
      <rect x={0} y={0} width={VIEW.w} height={HORIZON} fill="url(#rt-sky)" />

      {/* sun (positioned by warmth in the hook) */}
      <g ref={sunRef} className="rt-sun" style={{ opacity: 0 }}>
        <circle r={150} fill="url(#rt-sun)" />
        <circle r={58} fill="#ffe6bd" />
      </g>

      {/* ground */}
      <rect x={0} y={HORIZON} width={VIEW.w} height={VIEW.h - HORIZON} fill="var(--sky-ground)" />
      {/* sandy grain texture over the ground */}
      <rect
        className="rt-grain"
        x={0}
        y={HORIZON}
        width={VIEW.w}
        height={VIEW.h - HORIZON}
        filter="url(#rt-grain)"
        mask="url(#rt-sand-mask)"
        opacity={0.38}
        style={{ mixBlendMode: "overlay" }}
      />
      <rect
        x={0}
        y={HORIZON - 6}
        width={VIEW.w}
        height={20}
        fill="#fff7ea"
        opacity={0.12}
      />

      {/* road surface */}
      <polygon
        points={`${apex},${HORIZON} ${apex - ROAD_HALF},${BOTTOM} ${apex + ROAD_HALF},${BOTTOM}`}
        fill="url(#rt-road)"
      />
      {/* road edges */}
      <g stroke="var(--color-paper)" strokeWidth={4} strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity={0.82}>
        <line x1={apex} y1={HORIZON} x2={apex - ROAD_HALF} y2={BOTTOM} />
        <line x1={apex} y1={HORIZON} x2={apex + ROAD_HALF} y2={BOTTOM} />
      </g>
      <g stroke="#ff6e56" strokeWidth={1.4} strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity={0.16}>
        <line x1={apex} y1={HORIZON} x2={apex - ROAD_HALF * 0.88} y2={BOTTOM} />
        <line x1={apex} y1={HORIZON} x2={apex + ROAD_HALF * 0.88} y2={BOTTOM} />
      </g>

      {/* center-line dashes (projected each frame) */}
      <g>
        {dashes.map((z, i) => (
          <g key={`d${i}`} className="rt-dash" data-z={z}>
            <rect x={-11} y={-34} width={22} height={68} rx={6} fill="var(--color-paper)" />
          </g>
        ))}
      </g>

      {/* roadside objects (projected each frame) */}
      <g>
        {sideObjects.map((o, i) => (
          <g key={`s${i}`} className="rt-side" data-z={o.baseZ} data-x={o.worldX} data-kind={o.kind}>
            <SideShape kind={o.kind} />
          </g>
        ))}
      </g>

      {/* the car */}
      <g ref={carRef} className="rt-car-wrap">
        <Car />
      </g>
    </svg>
  );
}

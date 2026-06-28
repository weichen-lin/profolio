import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  NEAR,
  FAR,
  SPAN,
  DRIVE_LEN,
  HORIZON,
  BOTTOM,
  SKY_DAY,
  SKY_DUSK,
  SUN,
} from "./constants";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Refs = {
  scope: RefObject<HTMLDivElement | null>;
  carRef: RefObject<SVGGElement | null>;
  sunRef: RefObject<SVGGElement | null>;
  reduced: boolean;
  compact: boolean;
};

type RGB = readonly [number, number, number];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
const mix = (a: RGB, b: RGB, t: number) =>
  `rgb(${Math.round(lerp(a[0], b[0], t))} ${Math.round(lerp(a[1], b[1], t))} ${Math.round(lerp(a[2], b[2], t))})`;

// Warmth ramps in over the last stretch of the trip.
function warmFactor(p: number) {
  return Math.pow(smooth(0.55, 1, p), 1.2);
}

const S_MIN = NEAR / FAR;

// Scene-only driver: the car launches from a close-up, shrinks into the
// distance and drives the road forward as you scroll, while scenery streams
// past and the sky warms toward golden hour. No content overlays here.
export function useRoadTimeline({ scope, carRef, sunRef, reduced, compact }: Refs) {
  useGSAP(
    () => {
      const root = scope.current;
      const car = carRef.current;
      const sun = sunRef.current;
      if (!root || !car) return;

      const scene = root.querySelector<HTMLElement>(".rt-svg");
      const speedLines = root.querySelector<HTMLElement>(".rt-speed-lines");
      const dashes = Array.from(root.querySelectorAll<SVGGElement>(".rt-dash"));
      const sides = Array.from(root.querySelectorAll<SVGGElement>(".rt-side"));
      const docRoot = document.documentElement;
      let lastWarmBucket = -1;

      const wrapZ = (baseZ: number, D: number) => {
        let dz = baseZ - D - NEAR;
        dz = ((dz % SPAN) + SPAN) % SPAN;
        return NEAR + dz;
      };

      const place = (el: SVGGElement, dz: number, worldX: number) => {
        const s = NEAR / dz;
        const x = 500 + worldX * s;
        const y = HORIZON + (BOTTOM - HORIZON) * s;
        el.setAttribute("transform", `translate(${x} ${y}) scale(${s})`);
        const o = smooth(S_MIN, S_MIN + 0.05, s) * (1 - smooth(0.82, 1, s));
        el.style.opacity = String(o);
      };

      const frame = (p: number) => {
        const launch = smooth(0, 0.82, p);
        const driveP = smooth(0.07, 1, p);
        const D = driveP * DRIVE_LEN;
        const roadReveal = smooth(0.02, 0.22, p);

        for (const el of dashes) {
          place(el, wrapZ(parseFloat(el.dataset.z || "0"), D), 0);
        }
        for (const el of sides) {
          const worldX = parseFloat(el.dataset.x || "0");
          place(el, wrapZ(parseFloat(el.dataset.z || "0"), D), worldX);
        }

        // car: close-up launch -> shrinks into the distance, with gentle sway
        const sway = Math.sin(D * 0.6) * 9;
        const bob = Math.cos(D * 0.9) * 3;
        const distance = Math.pow(launch, 1.65);
        const carScale = lerp(3.15, 0.08, distance);
        const carY = lerp(690, HORIZON + 32, distance);
        car.setAttribute(
          "transform",
          `translate(${500 + sway} ${carY + bob}) scale(${carScale})`,
        );

        if (scene) {
          scene.style.opacity = String(0.18 + roadReveal * 0.82);
          scene.style.transform = `scale(${lerp(1.08, 1, roadReveal)})`;
          if (!compact) {
            scene.style.filter = `blur(${lerp(3, 0, roadReveal)}px)`;
          }
        }

        const w = warmFactor(clamp01(p));
        const warmBucket = compact ? Math.round(w * 50) : Math.round(w * 200);
        if (warmBucket !== lastWarmBucket) {
          lastWarmBucket = warmBucket;
          docRoot.style.setProperty("--sky-top", mix(SKY_DAY.top, SKY_DUSK.top, w));
          docRoot.style.setProperty(
            "--sky-horizon",
            mix(SKY_DAY.horizon, SKY_DUSK.horizon, w),
          );
          docRoot.style.setProperty(
            "--sky-ground",
            mix(SKY_DAY.ground, SKY_DUSK.ground, w),
          );
        }
        if (sun) {
          const sx = lerp(SUN.xDay, SUN.xDusk, w);
          const sy = lerp(SUN.yDay, SUN.yDusk, w);
          const k = lerp(0.7, 1.5, w);
          sun.setAttribute("transform", `translate(${sx} ${sy}) scale(${k})`);
          sun.style.opacity = String(0.15 + 0.85 * w);
        }
      };

      if (reduced) {
        frame(0);
        return;
      }

      frame(0); // no first-paint flash

      gsap.set(scene, {
        opacity: 0.18,
        scale: 1.08,
        filter: compact ? "none" : "blur(3px)",
        transformOrigin: "50% 72%",
      });
      if (speedLines) gsap.set(speedLines, { opacity: 0 });

      const proxy = { p: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: "#scroll-root",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      tl.to(proxy, { p: 1, duration: 1, onUpdate: () => frame(proxy.p) }, 0);

      if (speedLines) {
        tl.to(speedLines, { opacity: 0.32, duration: 0.08 }, 0.14).to(
          speedLines,
          { opacity: 0.1, duration: 0.16 },
          0.3,
        );
      }
    },
    { scope, dependencies: [reduced, compact] },
  );
}

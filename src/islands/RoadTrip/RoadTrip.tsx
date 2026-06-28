import { useEffect, useRef, useState } from "react";
import RoadSvg from "./components/RoadSvg";
import { useRoadTimeline } from "./useRoadTimeline";

// Scene only: the driving road backdrop. Content components are added
// separately, on top, one at a time.
export default function RoadTrip() {
  const scope = useRef<HTMLDivElement>(null);
  const carRef = useRef<SVGGElement>(null);
  const sunRef = useRef<SVGGElement>(null);

  const [reduced, setReduced] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useRoadTimeline({ scope, carRef, sunRef, reduced, compact });

  return (
    <div
      ref={scope}
      className="rt-stage relative isolate min-h-dvh overflow-hidden"
    >
      <RoadSvg carRef={carRef} sunRef={sunRef} compact={compact} />

      <div className="rt-vignette pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_50%_48%,transparent_0_42%,rgba(5,5,7,0.06)_66%,rgba(5,5,7,0.28)_100%)] mix-blend-multiply" />

      <div
        className="rt-speed-lines pointer-events-none absolute inset-0 z-[1] overflow-hidden opacity-0"
        aria-hidden="true"
      >
        <span className="absolute left-1/2 top-[52%] h-px w-[min(38vw,34rem)] origin-left bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.72),transparent)] [transform:translate(-54vw,-22vh)_rotate(11deg)]" />
        <span className="absolute left-1/2 top-[52%] h-px w-[min(38vw,34rem)] origin-left bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.72),transparent)] [transform:translate(18vw,-14vh)_rotate(-10deg)]" />
        <span className="absolute left-1/2 top-[52%] h-px w-[min(38vw,34rem)] origin-left bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.72),transparent)] [transform:translate(-50vw,12vh)_rotate(-8deg)]" />
        <span className="absolute left-1/2 top-[52%] h-px w-[min(38vw,34rem)] origin-left bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.72),transparent)] [transform:translate(20vw,18vh)_rotate(8deg)]" />
      </div>
    </div>
  );
}

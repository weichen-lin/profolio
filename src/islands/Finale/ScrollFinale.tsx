"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";
import { LiquidGlassCard } from "../../components/ui/liquid-glass";

export default function ScrollFinale() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0.986, 0.996, 1], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0.986, 1], [
    reduceMotion ? 0 : 18,
    0,
  ]);
  const scale = useTransform(scrollYProgress, [0.986, 1], [0.98, 1]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const nextVisible = latest >= 0.99;
    if (nextVisible === visibleRef.current) return;
    visibleRef.current = nextVisible;
    setVisible(nextVisible);
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <section className="pointer-events-none" aria-label="End of page">
      <motion.div
        className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-[2] w-[calc(100vw-1rem)] max-w-[42rem] -translate-x-1/2 md:bottom-[clamp(1.5rem,5vh,3rem)] ${
          visible ? "pointer-events-auto" : "pointer-events-none"
        }`}
        style={{ opacity, y, scale }}
        aria-hidden={!visible}
      >
        <LiquidGlassCard
          draggable={false}
          blurIntensity="xl"
          glowIntensity="sm"
          shadowIntensity="sm"
          borderRadius="24px"
          className="w-full overflow-hidden bg-[color-mix(in_srgb,var(--color-paper)_24%,transparent)]"
        >
          <div className="relative z-30 grid grid-cols-[auto_1fr] items-center gap-3 p-3 text-[var(--color-ink)] sm:grid-cols-[auto_1fr_auto] sm:gap-4 sm:p-4">
            <img
              src="/avatar.png"
              alt=""
              width="48"
              height="48"
              className="h-12 w-12 rounded-full border border-[color-mix(in_srgb,var(--color-paper)_78%,transparent)] object-cover shadow-[0_14px_30px_-20px_rgba(28,28,34,0.72)]"
            />
            <div className="min-w-0">
              <p className="m-0 text-[0.62rem] uppercase tracking-[0.16em] text-[color-mix(in_srgb,var(--color-ink)_60%,transparent)]">
                End of the road
              </p>
              <h2 className="m-0 mt-0.5 text-[clamp(1.1rem,5vw,1.75rem)] font-[420] leading-[1.04] tracking-[-0.02em]">
                Thanks for taking the ride.
              </h2>
            </div>
            <button
              type="button"
              onClick={scrollToTop}
              className="col-span-full inline-flex min-h-9 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-ink)_84%,transparent)] px-4 text-[0.78rem] text-[var(--color-paper)] transition-transform active:scale-95 sm:col-span-1"
            >
              Back to top
            </button>
          </div>
        </LiquidGlassCard>
      </motion.div>
    </section>
  );
}

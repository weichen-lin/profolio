import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, useState } from "react";
import { Icon, addCollection } from "@iconify/react";
import { LiquidGlassCard } from "../../components/ui/liquid-glass";
import deviconSubset from "../Capabilities/devicon-subset.json";

// Reuse the offline devicon set (idempotent across islands).
addCollection(deviconSubset as Parameters<typeof addCollection>[0]);

// ---- Edit me ---------------------------------------------------------------
const PROFILE = {
  name: "Wei-Chen L.",
  year: 2026,
  // TODO: drop in real handles.
  links: [
    { label: "GitHub", icon: "github", href: "https://github.com/weichen-lin" },
    {
      label: "LinkedIn",
      icon: "linkedin",
      href: "https://www.linkedin.com/in/weichenlin160/",
    },
  ],
  builtWith: ["Astro", "React", "Tailwind CSS"],
};
// ----------------------------------------------------------------------------

function LinkIcon({ icon }: { icon: string }) {
  return <Icon icon={`devicon:${icon}`} className="text-[1.15rem]" />;
}

export default function ScrollFinale() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0.986, 0.996, 1], [0, 1, 1]);
  const y = useTransform(
    scrollYProgress,
    [0.986, 1],
    [reduceMotion ? 0 : 18, 0],
  );
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
        className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-2 w-[calc(100vw-1rem)] max-w-176 -translate-x-1/2 md:bottom-[clamp(1.5rem,5vh,3rem)] ${
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
          className="w-full overflow-hidden bg-[color-mix(in_srgb,var(--color-paper)_60%,transparent)]"
        >
          <div className="relative z-30 flex flex-col gap-4 p-4 text-ink sm:p-5">
            {/* Heading row */}
            <div className="flex items-center gap-3">
              <img
                src="/avatar.png"
                alt=""
                width="48"
                height="48"
                className="h-12 w-12 shrink-0 rounded-full border border-[color-mix(in_srgb,var(--color-paper)_78%,transparent)] object-cover shadow-[0_14px_30px_-20px_rgba(28,28,34,0.72)]"
              />
              <div className="min-w-0">
                <p className="m-0 text-[0.62rem] uppercase tracking-[0.16em] text-[color-mix(in_srgb,var(--color-ink)_60%,transparent)]">
                  The road goes on
                </p>
                <h2 className="m-0 mt-0.5 text-[clamp(1.1rem,5vw,1.75rem)] font-[420] leading-[1.04] tracking-[-0.02em]">
                  Thanks for riding along — more ahead.
                </h2>
              </div>
            </div>

            {/* Contact links */}
            <div className="flex flex-wrap gap-2">
              {PROFILE.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  {...(link.icon === "email"
                    ? {}
                    : { target: "_blank", rel: "noreferrer noopener" })}
                  className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--color-ink)_14%,transparent)] bg-[color-mix(in_srgb,white_20%,transparent)] px-3 py-1.5 text-[0.8rem] text-ink transition-transform hover:-translate-y-0.5 active:scale-95"
                >
                  <LinkIcon icon={link.icon} />
                  {link.label}
                </a>
              ))}
            </div>

            {/* Footer row: colophon + copyright + back to top */}
            <div className="flex flex-col gap-3 border-t border-[color-mix(in_srgb,var(--color-ink)_12%,transparent)] pt-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 text-[0.72rem] leading-normal text-[color-mix(in_srgb,var(--color-ink)_58%,transparent)]">
                <p className="m-0">
                  Built with {PROFILE.builtWith.join(" · ")}
                </p>
                <p className="m-0">
                  © {PROFILE.year} {PROFILE.name}
                </p>
              </div>
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex min-h-9 shrink-0 items-center justify-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--color-ink)_84%,transparent)] px-4 text-[0.78rem] text-paper transition-transform active:scale-95"
              >
                <span aria-hidden="true">↑</span> Back to top
              </button>
            </div>
          </div>
        </LiquidGlassCard>
      </motion.div>
    </section>
  );
}

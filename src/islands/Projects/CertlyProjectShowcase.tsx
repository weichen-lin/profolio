"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { LiquidGlassCard } from "../../components/ui/liquid-glass";

const TOTAL_SECTIONS = 6;
const PROJECT_SECTION_INDEX = 4;
const FADE_PORTION = 0.1;

function sectionRange(index: number) {
  const size = 1 / TOTAL_SECTIONS;
  const start = index * size;
  const end = start + size;
  const fade = size * FADE_PORTION;
  return {
    input: [start, start + fade, end - fade, end],
    visibleStart: start + fade,
    visibleEnd: end - fade,
  };
}

type ProjectShowcaseData = {
  name: string;
  description: string;
  imageSrc: string;
  siteHref: string;
  stack: string[];
  architecture: Array<{
    label: string;
    value: string;
  }>;
};

const certlyProject: ProjectShowcaseData = {
  name: "Certly",
  description:
    "A cloud certification exam prep app built around practice flows, timed exams, answer discussions, and progress recovery.",
  imageSrc: "/certly-icon.png",
  siteHref: "https://certly.wei-chen.dev/",
  stack: ["React", "TanStack", "Supabase"],
  architecture: [
    { label: "Frontend", value: "React with TanStack-driven app state" },
    { label: "Backend", value: "Supabase data and auth foundation" },
    { label: "Product flow", value: "Practice sets, mock exams, review queues" },
  ],
};

function ProjectShowcase({ project }: { project: ProjectShowcaseData }) {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(false);
  const { scrollYProgress } = useScroll();
  const range = sectionRange(PROJECT_SECTION_INDEX);
  const opacity = useTransform(scrollYProgress, range.input, [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, range.input, [
    reduceMotion ? 0 : 20,
    0,
    0,
    reduceMotion ? 0 : -20,
  ]);
  const scale = useTransform(scrollYProgress, range.input, [0.98, 1, 1, 0.98]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const nextVisible = latest >= range.visibleStart && latest <= range.visibleEnd;
    if (nextVisible === visibleRef.current) return;
    visibleRef.current = nextVisible;
    setVisible(nextVisible);
  });

  return (
    <section className="pointer-events-none" aria-label="Project">
      <motion.div
        className={`fixed left-1/2 top-[9vh] z-2 w-[calc(100vw-1rem)] max-w-[62rem] -translate-x-1/2 md:left-[clamp(1.25rem,6vw,5rem)] md:top-1/2 md:w-[min(62rem,calc(100vw-6rem))] md:translate-x-0 md:-translate-y-1/2 ${
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
          borderRadius="28px"
          className="w-full overflow-hidden bg-[color-mix(in_srgb,var(--color-paper)_24%,transparent)]"
        >
          <div className="relative z-30 grid gap-4 p-4 text-[var(--color-ink)] md:grid-cols-[1.08fr_0.92fr] md:gap-6 md:p-6">
            <div className="min-w-0">
              <img
                src={project.imageSrc}
                alt={`${project.name} app icon`}
                className="mb-3 h-14 w-14 rounded-2xl object-cover shadow-[0_12px_30px_-18px_rgba(28,28,34,0.8)] md:h-16 md:w-16"
              />
              <p className="m-0 text-[0.64rem] uppercase tracking-[0.16em] text-[color-mix(in_srgb,var(--color-ink)_66%,transparent)] md:text-[0.72rem]">
                Project
              </p>
              <h2 className="mt-2 max-w-[16ch] text-[clamp(1.7rem,8vw,2.8rem)] font-[380] leading-[0.98] tracking-[-0.03em] md:max-w-none md:whitespace-nowrap md:text-[clamp(2rem,4vw,3.35rem)]">
                {project.name}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[color-mix(in_srgb,var(--color-ink)_14%,transparent)] bg-[color-mix(in_srgb,white_18%,transparent)] px-3 py-1 text-[0.74rem] text-[color-mix(in_srgb,var(--color-ink)_76%,transparent)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-2 max-w-[34rem] text-[0.84rem] leading-[1.45] text-[color-mix(in_srgb,var(--color-ink)_72%,transparent)] md:text-[1rem]">
                {project.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={project.siteHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-9 items-center rounded-full bg-[color-mix(in_srgb,var(--color-ink)_84%,transparent)] px-4 text-[0.78rem] text-[var(--color-paper)] no-underline transition-transform active:scale-95"
                >
                  Visit site
                </a>
              </div>
            </div>

            <div className="rounded-[22px] bg-[color-mix(in_srgb,var(--color-paper)_26%,transparent)] p-3 shadow-[inset_0_1px_0_color-mix(in_srgb,white_32%,transparent)] md:p-4">
              <p className="m-0 text-[0.68rem] uppercase tracking-[0.14em] text-[color-mix(in_srgb,var(--color-ink)_58%,transparent)]">
                Build notes
              </p>
              <p className="m-0 mt-1 text-[0.9rem] font-medium text-[var(--color-ink)]">
                {project.name} app architecture
              </p>
              <ul className="m-0 mt-3 grid list-none gap-2 p-0">
                {project.architecture.map((item) => (
                  <li
                    key={item.label}
                    className="rounded-2xl border border-[color-mix(in_srgb,var(--color-ink)_10%,transparent)] bg-[color-mix(in_srgb,white_16%,transparent)] px-3 py-2"
                  >
                    <span className="block text-[0.68rem] uppercase tracking-[0.12em] text-[color-mix(in_srgb,var(--color-ink)_54%,transparent)]">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-[0.82rem] leading-[1.35] text-[color-mix(in_srgb,var(--color-ink)_78%,transparent)]">
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </LiquidGlassCard>
      </motion.div>
    </section>
  );
}

export default function CertlyProjectShowcase() {
  return <ProjectShowcase project={certlyProject} />;
}

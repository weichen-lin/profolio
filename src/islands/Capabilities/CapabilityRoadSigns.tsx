"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { LiquidGlassCard } from "../../components/ui/liquid-glass";

type SpecGroup = {
  label: string;
  items: string[];
};

type Capability = {
  id: string;
  name: string;
  title: string;
  description: string;
  specs: SpecGroup[];
};

const capabilities: Capability[] = [
  {
    id: "frontend",
    name: "Frontend",
    title: "I craft seamless interfaces for real user intent.",
    description:
      "Scalable state architecture, modular components, and intuitive interactions.",
    specs: [
      {
        label: "Languages & Frameworks",
        items: ["TypeScript", "React", "Next.js", "Angular"],
      },
      {
        label: "State Management",
        items: ["Zustand", "React Router DOM"],
      },
      {
        label: "Styling",
        items: ["CSS", "HTML", "Material UI", "styled-components"],
      },
    ],
  },
  {
    id: "backend",
    name: "Backend",
    title: "I design resilient systems that stay calm under load.",
    description:
      "Domain-driven design, high-availability APIs, and complex data relations.",
    specs: [
      {
        label: "Frameworks",
        items: [
          "Nest.js",
          "Python Flask",
          "Python Django",
          "Golang Gin",
          "Node Express",
          "C#",
        ],
      },
      {
        label: "Databases",
        items: ["PostgreSQL", "MySQL", "Redis", "Neo4j"],
      },
    ],
  },
  {
    id: "devops",
    name: "DevOps",
    title: "I build automated paths from code to production.",
    description:
      "CI/CD, containerized environments, and cloud workflows with fewer sharp edges.",
    specs: [
      {
        label: "Containerization",
        items: ["Docker", "Docker Compose"],
      },
      {
        label: "CI/CD & Automation",
        items: ["GitHub Actions", "GCP", "Cloud Build", "Git hook optimizations"],
      },
    ],
  },
];

const TOTAL_SECTIONS = 6;
const FIRST_CAPABILITY_SECTION = 1;
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

function CapabilitySection({
  capability,
  sectionIndex,
}: {
  capability: Capability;
  sectionIndex: number;
}) {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const visibleRef = useRef(false);
  const { scrollYProgress } = useScroll();
  const range = sectionRange(sectionIndex);
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
    if (!nextVisible) setExpanded(false);
  });

  return (
    <>
      <motion.div
        className={`fixed left-1/2 top-[12vh] z-2 w-[calc(100vw-1rem)] max-w-[58rem] -translate-x-1/2 md:left-[clamp(1.25rem,6vw,5rem)] md:top-1/2 md:w-[min(58rem,calc(100vw-6rem))] md:translate-x-0 md:-translate-y-1/2 ${
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
          className="w-full cursor-pointer overflow-hidden bg-[color-mix(in_srgb,var(--color-paper)_24%,transparent)]"
          onClick={() => setExpanded((current) => !current)}
          role="button"
          tabIndex={visible ? 0 : -1}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setExpanded((current) => !current);
            }
          }}
        >
          <div className="relative z-30 grid grid-cols-[1fr_auto] items-end gap-x-3 gap-y-2 px-3.5 py-3 text-[var(--color-ink)] md:gap-x-5 md:px-5 md:py-4">
            <p className="col-span-full m-0 text-[0.64rem] uppercase tracking-[0.16em] text-[color-mix(in_srgb,var(--color-ink)_66%,transparent)] md:text-[0.72rem]">
              {capability.name}
            </p>
            <h2 className="col-span-full m-0 max-w-[24ch] text-[clamp(1rem,4.4vw,1.28rem)] font-[400] leading-[1.02] tracking-[-0.02em] md:max-w-none md:whitespace-nowrap md:text-[clamp(1.35rem,2.1vw,1.95rem)]">
              {capability.title}
            </h2>
            <p className="m-0 max-w-[24rem] text-[0.76rem] leading-[1.32] text-[color-mix(in_srgb,var(--color-ink)_72%,transparent)] md:max-w-none md:text-[0.9rem] md:leading-[1.35]">
              {capability.description}
            </p>
            <button
              type="button"
              className="inline-flex min-h-8 items-center justify-center whitespace-nowrap rounded-full border border-[color-mix(in_srgb,var(--color-ink)_18%,transparent)] bg-[color-mix(in_srgb,var(--color-ink)_82%,transparent)] px-3 text-[0.7rem] text-[var(--color-paper)] transition-transform active:scale-95 md:min-h-[2.15rem] md:px-[0.9rem] md:text-[0.76rem]"
              onClick={(event) => {
                event.stopPropagation();
                setExpanded((current) => !current);
              }}
              aria-expanded={expanded}
            >
              {expanded ? "Hide specs" : "View tech specs"}
            </button>
            <AnimatePresence initial={false}>
              {expanded ? (
                <motion.div
                  className="col-span-full overflow-hidden"
                  initial={{ height: 0, opacity: 0, y: -6 }}
                  animate={{ height: "auto", opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -6 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="mt-3 grid grid-cols-1 gap-2 border-t border-[color-mix(in_srgb,var(--color-ink)_12%,transparent)] pt-3 md:grid-cols-3">
                    {capability.specs.map((group) => (
                      <section
                        key={group.label}
                        className="rounded-2xl bg-[color-mix(in_srgb,var(--color-paper)_28%,transparent)] p-3 shadow-[inset_0_1px_0_color-mix(in_srgb,white_30%,transparent)]"
                      >
                        <h3 className="mb-2 mt-0 text-[0.68rem] uppercase tracking-[0.12em] text-[color-mix(in_srgb,var(--color-ink)_62%,transparent)]">
                          {group.label}
                        </h3>
                        <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
                          {group.items.map((item) => (
                            <li
                              key={item}
                              className="rounded-full border border-[color-mix(in_srgb,var(--color-ink)_14%,transparent)] bg-[color-mix(in_srgb,white_18%,transparent)] px-2 py-1 text-[0.72rem] text-[color-mix(in_srgb,var(--color-ink)_78%,transparent)]"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </section>
                    ))}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </LiquidGlassCard>
      </motion.div>
    </>
  );
}

export default function CapabilityRoadSigns() {
  return (
    <section className="pointer-events-none" aria-label="Capabilities">
      {capabilities.map((capability, index) => (
        <CapabilitySection
          key={capability.id}
          capability={capability}
          sectionIndex={FIRST_CAPABILITY_SECTION + index}
        />
      ))}
    </section>
  );
}

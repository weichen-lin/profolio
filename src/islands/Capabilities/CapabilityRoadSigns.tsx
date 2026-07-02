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
import { Icon, addCollection } from "@iconify/react";
import { Popover } from "radix-ui";
import { LiquidGlassCard } from "../../components/ui/liquid-glass";
import { sectionRange } from "../scrollSections";
import deviconSubset from "./devicon-subset.json";

// Register the trimmed devicon set once, offline (no Iconify CDN calls).
addCollection(deviconSubset as Parameters<typeof addCollection>[0]);

// Skill label -> devicon slug. Items without a clean brand logo reuse the
// closest family icon (Gin -> Go, Cloud Build -> Google Cloud, Git hooks -> Git).
const ICON_BY_ITEM: Record<string, string> = {
  TypeScript: "typescript",
  React: "react",
  "Next.js": "nextjs",
  Astro: "astro",
  Angular: "angular",
  Zustand: "zustand",
  "React Router DOM": "reactrouter",
  CSS: "css3",
  HTML: "html5",
  "Tailwind CSS": "tailwindcss",
  "Material UI": "materialui",
  "styled-components": "styledcomponents",
  "Framer Motion": "framermotion",
  Vite: "vite",
  "Nest.js": "nestjs",
  Fastify: "fastify",
  "Python Flask": "flask",
  "Python Django": "djangorest",
  "Golang Gin": "go",
  "Node Express": "express",
  "C#": "csharp",
  PostgreSQL: "postgresql",
  MySQL: "mysql",
  MongoDB: "mongodb",
  Redis: "redis",
  Neo4j: "neo4j",
  Elasticsearch: "elasticsearch",
  SQLite: "sqlite",
  Prisma: "prisma",
  TypeORM: "typeorm",
  SQLAlchemy: "sqlalchemy",
  Swagger: "swagger",
  gRPC: "grpc",
  "Socket.IO": "socketio",
  Kafka: "apachekafka",
  Docker: "docker",
  "Docker Compose": "docker",
  Kubernetes: "kubernetes",
  Helm: "helm",
  Nginx: "nginx",
  Terraform: "terraform",
  AWS: "amazonwebservices",
  GCP: "googlecloud",
  Cloudflare: "cloudflare",
  "GitHub Actions": "githubactions",
  "GitLab CI": "gitlab",
  Jenkins: "jenkins",
  ArgoCD: "argocd",
  Vercel: "vercel",
  Grafana: "grafana",
  Prometheus: "prometheus",
  Datadog: "datadog",
  Sentry: "sentry",
  Kibana: "kibana",
  "Git hook optimizations": "git",
};

function SkillIcon({ item }: { item: string }) {
  const slug = ICON_BY_ITEM[item];
  // Hover-style on desktop (pointer enter/leave), tap-to-toggle on touch.
  // Radix handles outside-click / Escape dismissal via onOpenChange.
  const [open, setOpen] = useState(false);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label={item}
          className="grid h-11 w-11 place-items-center rounded-xl border border-[color-mix(in_srgb,var(--color-ink)_12%,transparent)] bg-[color-mix(in_srgb,white_22%,transparent)] transition-transform hover:-translate-y-0.5 active:scale-95"
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") setOpen(true);
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === "mouse") setOpen(false);
          }}
          onClick={(event) => {
            event.stopPropagation();
            setOpen((current) => !current);
          }}
        >
          {slug ? (
            <Icon icon={`devicon:${slug}`} className="text-[1.6rem]" />
          ) : (
            <span className="text-[0.6rem] font-semibold uppercase text-ink">
              {item.slice(0, 2)}
            </span>
          )}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="top"
          sideOffset={6}
          onOpenAutoFocus={(event) => event.preventDefault()}
          className="pointer-events-none z-50 rounded-md bg-ink px-2.5 py-1 text-[0.72rem] font-medium text-paper shadow-lg"
        >
          {item}
          <Popover.Arrow className="fill-ink" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

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
        items: ["TypeScript", "React", "Next.js", "Astro", "Angular", "Vite"],
      },
      {
        label: "State Management",
        items: ["Zustand", "React Router DOM"],
      },
      {
        label: "Styling",
        items: [
          "CSS",
          "HTML",
          "Tailwind CSS",
          "Material UI",
          "styled-components",
        ],
      },
      {
        label: "Animation",
        items: ["Framer Motion", "GSAP"],
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
          "Fastify",
          "Node Express",
          "Python Flask",
          "Python Django",
          "Golang Gin",
          "C#",
        ],
      },
      {
        label: "Databases",
        items: [
          "PostgreSQL",
          "MySQL",
          "MongoDB",
          "Redis",
          "Neo4j",
          "Elasticsearch",
          "SQLite",
        ],
      },
      {
        label: "ORM & Data Access",
        items: ["Prisma", "TypeORM", "SQLAlchemy"],
      },
      {
        label: "API & Messaging",
        items: ["Swagger", "gRPC", "Socket.IO", "Kafka"],
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
        label: "Containers & Orchestration",
        items: ["Docker", "Docker Compose", "Kubernetes", "Helm"],
      },
      {
        label: "Cloud & Infra",
        items: ["Terraform", "AWS", "GCP", "Cloudflare", "Nginx"],
      },
      {
        label: "CI/CD & Automation",
        items: [
          "GitHub Actions",
          "GitLab CI",
          "Jenkins",
          "ArgoCD",
          "Vercel",
          "Git hook optimizations",
        ],
      },
      {
        label: "Observability",
        items: ["Grafana", "Prometheus", "Datadog", "Sentry", "Kibana"],
      },
    ],
  },
];

const FIRST_CAPABILITY_SECTION = 1;

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
  const opacity = useTransform(scrollYProgress, range.input, range.output);
  const y = useTransform(scrollYProgress, range.input, [
    reduceMotion ? 0 : 20,
    0,
    0,
    reduceMotion ? 0 : -20,
  ]);
  const scale = useTransform(scrollYProgress, range.input, [0.98, 1, 1, 0.98]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const nextVisible =
      latest >= range.visibleStart && latest <= range.visibleEnd;
    if (nextVisible === visibleRef.current) return;
    visibleRef.current = nextVisible;
    setVisible(nextVisible);
    if (!nextVisible) setExpanded(false);
  });

  return (
    <>
      <motion.div
        className={`fixed left-1/2 top-[12vh] z-2 w-[calc(100vw-1rem)] max-w-232 -translate-x-1/2 md:left-[clamp(1.25rem,6vw,5rem)] md:top-1/2 md:w-[min(58rem,calc(100vw-6rem))] md:translate-x-0 md:-translate-y-1/2 ${
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
          className="w-full cursor-pointer overflow-hidden bg-[color-mix(in_srgb,var(--color-paper)_60%,transparent)]"
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
          <div className="relative z-30 grid grid-cols-[1fr_auto] items-end gap-x-3 gap-y-2 px-3.5 py-3 text-ink md:gap-x-5 md:px-5 md:py-4">
            <div className="col-span-full flex items-center justify-between gap-3">
              <p className="m-0 text-[clamp(0.82rem,3.4vw,1rem)] font-semibold uppercase tracking-[0.22em] text-ink">
                {capability.name}
              </p>
              <span className="flex shrink-0 items-center gap-1.5">
                {capabilities.map((step, i) => (
                  <span
                    key={step.id}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === sectionIndex - FIRST_CAPABILITY_SECTION
                        ? "w-5 bg-ink"
                        : "w-2 bg-[color-mix(in_srgb,var(--color-ink)_25%,transparent)]"
                    }`}
                  />
                ))}
              </span>
            </div>
            <h2 className="col-span-full m-0 max-w-[24ch] text-[clamp(1rem,4.4vw,1.28rem)] font-normal leading-[1.02] tracking-[-0.02em] md:max-w-none md:whitespace-nowrap md:text-[clamp(1.35rem,2.1vw,1.95rem)]">
              {capability.title}
            </h2>
            <p className="m-0 max-w-[24rem] text-[0.76rem] leading-[1.32] text-[color-mix(in_srgb,var(--color-ink)_72%,transparent)] md:max-w-none md:text-[0.9rem] md:leading-[1.35]">
              {capability.description}
            </p>
            <button
              type="button"
              className="inline-flex min-h-8 items-center justify-center whitespace-nowrap rounded-full border border-[color-mix(in_srgb,var(--color-ink)_18%,transparent)] bg-[color-mix(in_srgb,var(--color-ink)_82%,transparent)] px-3 text-[0.7rem] text-paper transition-transform active:scale-95 md:min-h-[2.15rem] md:px-[0.9rem] md:text-[0.76rem]"
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
                        <div className="flex flex-wrap gap-2">
                          {group.items.map((item) => (
                            <SkillIcon key={item} item={item} />
                          ))}
                        </div>
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

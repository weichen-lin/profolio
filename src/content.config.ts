import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    role: z.string().optional(),
    tech: z.array(z.string()).default([]),
    year: z.number(),
    link: z.url().optional(),
    repo: z.url().optional(),
    cover: z.url().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/experience" }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    start: z.coerce.date(),
    end: z.coerce.date().optional(), // omit => "Present"
    location: z.string().optional(),
    highlights: z.array(z.string()).default([]),
    order: z.number().default(0),
  }),
});

export const collections = { projects, experience };

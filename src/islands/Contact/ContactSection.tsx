"use client";

import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { LiquidGlassCard } from "../../components/ui/liquid-glass";

const TOTAL_SECTIONS = 6;
const CONTACT_SECTION_INDEX = 5;
const FADE_PORTION = 0.1;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactForm = {
  email: string;
  message: string;
};

type ContactErrors = Partial<ContactForm>;

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

export default function ContactSection() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(false);
  const [form, setForm] = useState<ContactForm>({ email: "", message: "" });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const { scrollYProgress } = useScroll();
  const range = sectionRange(CONTACT_SECTION_INDEX);
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

  const updateField =
    (field: keyof ContactForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      setFeedback(null);
      if (errors[field]) {
        setErrors((current) => ({ ...current, [field]: undefined }));
      }
    };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const email = form.email.trim();
    const message = form.message.trim();
    const nextErrors: ContactErrors = {};

    if (!email) {
      nextErrors.email = "Email is required.";
    } else if (!EMAIL_PATTERN.test(email)) {
      nextErrors.email = "Enter a valid email.";
    }

    if (!message) {
      nextErrors.message = "Message is required.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setFeedback(null);
      return;
    }

    setFeedback("Thanks. I will get back to you soon.");
  };

  return (
    <section className="pointer-events-none" aria-label="Contact">
      <motion.div
        className={`fixed left-1/2 top-[9vh] z-[2] w-[calc(100vw-1rem)] max-w-[54rem] -translate-x-1/2 md:left-[clamp(1.25rem,6vw,5rem)] md:top-1/2 md:w-[min(54rem,calc(100vw-6rem))] md:translate-x-0 md:-translate-y-1/2 ${
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
          className="w-full overflow-hidden bg-[color-mix(in_srgb,var(--color-paper)_25%,transparent)]"
        >
          <form
            noValidate
            onSubmit={handleSubmit}
            className="relative z-30 grid gap-4 p-4 text-[var(--color-ink)] md:grid-cols-[0.9fr_1.1fr] md:gap-6 md:p-6"
          >
            <div className="min-w-0">
              <p className="m-0 text-[0.64rem] uppercase tracking-[0.16em] text-[color-mix(in_srgb,var(--color-ink)_66%,transparent)] md:text-[0.72rem]">
                Contact
              </p>
              <h2 className="mt-2 max-w-[14ch] text-[clamp(1.9rem,9vw,3.1rem)] font-[380] leading-[0.98] tracking-[-0.03em] md:max-w-[12ch] md:text-[clamp(2.4rem,5vw,4rem)]">
                Let's build something useful.
              </h2>
              <p className="mt-3 max-w-[24rem] text-[0.84rem] leading-[1.45] text-[color-mix(in_srgb,var(--color-ink)_72%,transparent)] md:text-[0.98rem]">
                Leave your email and what you want to talk about.
              </p>
            </div>

            <div className="grid gap-3">
              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-1.5 block text-[0.68rem] uppercase tracking-[0.14em] text-[color-mix(in_srgb,var(--color-ink)_62%,transparent)]"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={updateField("email")}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "contact-email-error" : undefined}
                  placeholder="you@example.com"
                  className="min-h-11 w-full rounded-2xl border border-[color-mix(in_srgb,var(--color-ink)_12%,transparent)] bg-[color-mix(in_srgb,white_18%,transparent)] px-3 text-[0.9rem] text-[var(--color-ink)] outline-none shadow-[inset_0_1px_0_color-mix(in_srgb,white_28%,transparent)] transition-[border-color,background-color,box-shadow] placeholder:text-[color-mix(in_srgb,var(--color-ink)_38%,transparent)] focus:border-[color-mix(in_srgb,var(--color-ink)_34%,transparent)] focus:bg-[color-mix(in_srgb,white_28%,transparent)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-ink)_8%,transparent)]"
                />
                {errors.email ? (
                  <p
                    id="contact-email-error"
                    className="m-0 mt-1.5 text-[0.76rem] text-[color-mix(in_srgb,#9f1d1d_82%,var(--color-ink))]"
                  >
                    {errors.email}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-1.5 block text-[0.68rem] uppercase tracking-[0.14em] text-[color-mix(in_srgb,var(--color-ink)_62%,transparent)]"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  value={form.message}
                  onChange={updateField("message")}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={
                    errors.message ? "contact-message-error" : undefined
                  }
                  placeholder="Tell me what you want to build or discuss."
                  className="min-h-32 w-full resize-none rounded-2xl border border-[color-mix(in_srgb,var(--color-ink)_12%,transparent)] bg-[color-mix(in_srgb,white_18%,transparent)] px-3 py-3 text-[0.9rem] leading-[1.4] text-[var(--color-ink)] outline-none shadow-[inset_0_1px_0_color-mix(in_srgb,white_28%,transparent)] transition-[border-color,background-color,box-shadow] placeholder:text-[color-mix(in_srgb,var(--color-ink)_38%,transparent)] focus:border-[color-mix(in_srgb,var(--color-ink)_34%,transparent)] focus:bg-[color-mix(in_srgb,white_28%,transparent)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-ink)_8%,transparent)]"
                />
                {errors.message ? (
                  <p
                    id="contact-message-error"
                    className="m-0 mt-1.5 text-[0.76rem] text-[color-mix(in_srgb,#9f1d1d_82%,var(--color-ink))]"
                  >
                    {errors.message}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  className="inline-flex min-h-10 w-full items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-ink)_84%,transparent)] px-5 text-[0.82rem] text-[var(--color-paper)] transition-transform active:scale-95 sm:w-auto"
                >
                  Send message
                </button>
                {feedback ? (
                  <p className="m-0 text-[0.78rem] text-[color-mix(in_srgb,var(--color-ink)_72%,transparent)]">
                    {feedback}
                  </p>
                ) : null}
              </div>
            </div>
          </form>
        </LiquidGlassCard>
      </motion.div>
    </section>
  );
}

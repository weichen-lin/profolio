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
import { sectionRange } from "../scrollSections";

const CONTACT_SECTION_INDEX = 5;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Google Apps Script web-app URL (public endpoint, not a secret).
// Set PUBLIC_CONTACT_ENDPOINT in .env to the deployed /exec URL.
const CONTACT_ENDPOINT = import.meta.env.PUBLIC_CONTACT_ENDPOINT ?? "";

type ContactForm = {
  email: string;
  message: string;
};

type ContactErrors = Partial<ContactForm>;
type SubmitStatus = "idle" | "submitting" | "success" | "error";

export default function ContactSection() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(false);
  const [form, setForm] = useState<ContactForm>({ email: "", message: "" });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const { scrollYProgress } = useScroll();
  const range = sectionRange(CONTACT_SECTION_INDEX);
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
  });

  const updateField =
    (field: keyof ContactForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
      if (status !== "idle") setStatus("idle");
      if (errors[field]) {
        setErrors((current) => ({ ...current, [field]: undefined }));
      }
    };

  const handleSubmit = async (event: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement;
  }) => {
    event.preventDefault();

    // Honeypot: real users never fill this hidden field; bots do.
    const honeypot = new FormData(event.currentTarget).get("company");
    if (honeypot) {
      setStatus("success");
      return;
    }

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
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");
    try {
      // No custom Content-Type → "simple" request, dodges the CORS preflight
      // that Apps Script web apps can't answer. Body stays a JSON string.
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({ email, message }),
      });
      if (!response.ok) throw new Error(`Bad status ${response.status}`);
      setForm({ email: "", message: "" });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="pointer-events-none" aria-label="Contact">
      <motion.div
        className={`fixed left-1/2 top-[9vh] z-2 w-[calc(100vw-1rem)] max-w-216 -translate-x-1/2 md:left-[clamp(1.25rem,6vw,5rem)] md:top-1/2 md:w-[min(54rem,calc(100vw-6rem))] md:translate-x-0 md:-translate-y-1/2 ${
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
          className="w-full overflow-hidden bg-[color-mix(in_srgb,var(--color-paper)_60%,transparent)]"
        >
          <form
            noValidate
            onSubmit={handleSubmit}
            className="relative z-30 grid gap-4 p-4 text-ink md:grid-cols-[0.9fr_1.1fr] md:gap-6 md:p-6"
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
                  aria-describedby={
                    errors.email ? "contact-email-error" : undefined
                  }
                  placeholder="you@example.com"
                  className="min-h-11 w-full rounded-2xl border border-[color-mix(in_srgb,var(--color-ink)_12%,transparent)] bg-[color-mix(in_srgb,white_18%,transparent)] px-3 text-[0.9rem] text-ink outline-none shadow-[inset_0_1px_0_color-mix(in_srgb,white_28%,transparent)] transition-[border-color,background-color,box-shadow] placeholder:text-[color-mix(in_srgb,var(--color-ink)_38%,transparent)] focus:border-[color-mix(in_srgb,var(--color-ink)_34%,transparent)] focus:bg-[color-mix(in_srgb,white_28%,transparent)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-ink)_8%,transparent)]"
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
                  className="min-h-32 w-full resize-none rounded-2xl border border-[color-mix(in_srgb,var(--color-ink)_12%,transparent)] bg-[color-mix(in_srgb,white_18%,transparent)] px-3 py-3 text-[0.9rem] leading-[1.4] text-ink outline-none shadow-[inset_0_1px_0_color-mix(in_srgb,white_28%,transparent)] transition-[border-color,background-color,box-shadow] placeholder:text-[color-mix(in_srgb,var(--color-ink)_38%,transparent)] focus:border-[color-mix(in_srgb,var(--color-ink)_34%,transparent)] focus:bg-[color-mix(in_srgb,white_28%,transparent)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-ink)_8%,transparent)]"
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

              {/* Honeypot — hidden from humans, catches bots. */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="inline-flex min-h-10 w-full items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-ink)_84%,transparent)] px-5 text-[0.82rem] text-paper transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {status === "submitting" ? "Sending…" : "Send message"}
                </button>
                {status === "success" ? (
                  <p
                    role="status"
                    className="m-0 text-[0.78rem] text-[color-mix(in_srgb,var(--color-ink)_72%,transparent)]"
                  >
                    Thanks. I'll get back to you soon.
                  </p>
                ) : null}
                {status === "error" ? (
                  <p
                    role="alert"
                    className="m-0 text-[0.78rem] text-[color-mix(in_srgb,#9f1d1d_82%,var(--color-ink))]"
                  >
                    Something went wrong — email me directly instead.
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

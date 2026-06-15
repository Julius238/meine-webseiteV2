"use client";

import { useLayoutEffect, useRef, useState, FormEvent } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { CinematicStage } from "@/components/visuals/CinematicStage";

const topics = [
  "Individuelle Software",
  "KI-Automation",
  "Website / Landingpage",
  "CMS",
  "Beratung",
];

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-reveal", {
        y: 26,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const toggle = (t: string) =>
    setSelected((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="kontakt"
      ref={root}
      className="relative isolate min-h-[100svh] py-32 md:py-44 overflow-hidden flex items-center bg-ink-950"
    >
      {/* Clear seam from Act 3 — solid dark band at the very top so the contact
          section reads as a separate, calmer closing page rather than a
          continuation of the architectural drift.                            */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 -z-[4] bg-gradient-to-b from-ink-950 to-transparent" />

      <CinematicStage
        slot="contactSystem"
        vignette={0.4}
        fadeTop={0.65}
        fadeTopHeight={0.3}
        fadeBottom={0.7}
        fadeBottomHeight={0.4}
        parallaxZoom={false}
        tint="cyan"
        focal="left"
        className="absolute inset-0 -z-10"
      />

      {/* Heavy base dim — system visual remains as faint atmosphere only. */}
      <div className="pointer-events-none absolute inset-0 -z-[7] bg-ink-950/55" />

      {/* Asymmetric darken behind the form — right side near-opaque so the form
          reads against a clean dark surface; left stays only slightly lit.    */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-[5] hidden md:block"
        style={{
          background:
            "linear-gradient(to left, rgba(5,8,18,0.88) 0%, rgba(5,8,18,0.6) 35%, rgba(5,8,18,0.2) 75%, rgba(5,8,18,0.1) 100%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 md:px-8 w-full grid md:grid-cols-12 gap-12 items-center">
        {/* left side — text floats over the bright part of the image */}
        <div className="md:col-span-5">
          <div className="contact-reveal inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/8 backdrop-blur-md px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-emerald-300 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            system bereit
          </div>

          <h2 className="contact-reveal text-display-1 font-semibold text-white tracking-tighter2">
            Lassen Sie uns über<br />
            <span className="text-gradient-accent">Ihr System</span> sprechen.
          </h2>
          <p className="contact-reveal mt-6 text-lg text-white/75 leading-relaxed max-w-md">
            Beschreiben Sie kurz, woran Sie arbeiten. Sie bekommen innerhalb von
            zwei Werktagen eine ehrliche Einschätzung — kein Sales-Pitch.
          </p>
          <div className="contact-reveal mt-8 text-sm text-white/65">
            Oder direkt per E-Mail:{" "}
            <a
              href="mailto:hello@example.com"
              className="text-white hover:text-accent transition underline-offset-4 hover:underline"
            >
              hello@example.com
            </a>
          </div>
        </div>

        {/* right side — form */}
        <div className="md:col-span-7">
          {submitted ? (
            <div className="contact-reveal rounded-2xl border border-emerald-400/20 bg-emerald-400/5 backdrop-blur-xl p-8">
              <div className="text-2xl text-white font-semibold">Danke.</div>
              <p className="mt-3 text-mute">
                Ihre Anfrage ist angekommen. Ich melde mich in Kürze persönlich.
              </p>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="contact-reveal relative rounded-2xl border border-white/15 bg-ink-950/88 backdrop-blur-2xl p-6 md:p-8 space-y-5 shadow-[0_40px_100px_rgba(0,0,0,0.7)]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(12,18,32,0.92) 0%, rgba(8,12,22,0.92) 100%)",
              }}
            >
              <div className="absolute -top-px left-12 right-12 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />

              <div>
                <label className="font-mono text-xs uppercase tracking-widest text-mute-soft block mb-2">
                  Themen
                </label>
                <div className="flex flex-wrap gap-2">
                  {topics.map((t) => {
                    const on = selected.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggle(t)}
                        className={`px-3 py-1.5 rounded-full text-sm border transition ${
                          on
                            ? "bg-accent text-ink-950 border-accent shadow-[0_0_20px_rgba(94,231,255,0.4)]"
                            : "bg-white/[0.02] text-white/80 border-white/10 hover:border-white/25"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field name="name" label="Name" required />
                <Field name="email" type="email" label="E-Mail" required />
              </div>
              <Field name="company" label="Unternehmen" />

              <div>
                <label
                  htmlFor="message"
                  className="font-mono text-xs uppercase tracking-widest text-mute-soft block mb-2"
                >
                  Worum geht es?
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Kurz beschreiben — Problem, Idee, gewünschtes Ergebnis."
                  className="w-full rounded-lg bg-ink-950/60 border border-white/10 px-4 py-3 text-white placeholder-mute-soft focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition resize-none"
                />
              </div>

              <input type="hidden" name="topics" value={selected.join(", ")} />

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
                <p className="text-xs text-mute-soft">
                  Antwort innerhalb von 2 Werktagen. Vertraulich.
                </p>
                <button type="submit" className="btn-primary">
                  Anfrage senden
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M3 7h8M7 3l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="font-mono text-xs uppercase tracking-widest text-mute-soft block mb-2"
      >
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg bg-ink-950/60 border border-white/10 px-4 py-3 text-white placeholder-mute-soft focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition"
      />
    </div>
  );
}

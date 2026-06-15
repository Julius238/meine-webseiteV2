"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, isMobile } from "@/lib/gsap";
import { CinematicVideo } from "@/components/visuals/CinematicVideo";
import { assets } from "@/lib/assets";

/**
 * Akt III — Im System
 *
 * One pinned closing cinematic sequence. The Higgsfield video (about-architecture
 * → contact-system) is scrubbed by scroll: the camera drifts slowly upward
 * through translucent architectural layers, then settles on a finished network
 * of glowing nodes. Three text phases land like inscriptions on the layers.
 *
 * Scroll timeline (in % of pin duration ≈ 250 svh):
 *   0.00 – 0.25  Headline      "Ein System braucht einen Architekten."
 *   0.25 – 0.50  Paragraph     about the work
 *   0.50 – 0.85  Principles    four-step incremental reveal
 *   0.85 – 1.00  Bridge        "Bereit, Ihr System anzuschließen. ↓"
 *
 * The interactive Contact form stays as its own non-pinned section AFTER Act3,
 * so users can scroll and fill it without being trapped in the pin.
 */

const VIDEO_SRC = "/assets/act3.mp4";

const principles = [
  {
    n: "01",
    label: "Gelernter Anwendungsentwickler",
    note: "Solide IT-Ausbildung als Basis.",
  },
  {
    n: "02",
    label: "Technisch fundiert",
    note: "Moderne Stacks, klare Architektur.",
  },
  {
    n: "03",
    label: "Lösungsorientiert",
    note: "Pragmatik vor Dogma.",
  },
  {
    n: "04",
    label: "Strukturierte Umsetzung",
    note: "Konzept, Iterationen, saubere Übergabe.",
  },
];

const stack = [
  "TypeScript",
  "React / Next.js",
  "Node",
  "Python",
  "PostgreSQL",
  "Tailwind",
  "OpenAI · Anthropic",
  "Docker",
];

export function Act3() {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const v = videoRef.current;
    const onMeta = () => {
      try {
        v?.pause();
        if (v) v.currentTime = 0.01;
      } catch {}
      ScrollTrigger.refresh();
    };
    v?.addEventListener("loadedmetadata", onMeta);

    const ctx = gsap.context(() => {
      if (isMobile()) {
        gsap.utils.toArray<HTMLElement>(".act3-mobile-panel").forEach((el) => {
          gsap.from(el.querySelectorAll(".m-reveal"), {
            opacity: 0,
            y: 24,
            duration: 0.9,
            stagger: 0.1,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 75%" },
          });
        });
        return;
      }

      // initial states
      gsap.set(
        [
          ".phase3-headline",
          ".phase3-paragraph",
          ".phase3-principles-wrap",
          ".phase3-principle",
          ".phase3-bridge",
          ".phase3-spotlight",
        ],
        { opacity: 0 }
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=250%",
          pin: true,
          scrub: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const vv = videoRef.current;
            if (vv && vv.duration && Number.isFinite(vv.duration)) {
              vv.currentTime = Math.min(
                self.progress * vv.duration,
                vv.duration - 0.05
              );
            }
          },
        },
        defaults: { ease: "none" },
      });

      // Calming spotlight that lives across the whole pin
      tl.fromTo(
        ".phase3-spotlight",
        { opacity: 0 },
        { opacity: 1, duration: 0.05 },
        0.0
      );

      // -------- HEADLINE 0.00 – 0.25 --------
      tl.fromTo(
        ".phase3-headline",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.04 },
        0.0
      );
      tl.to(".phase3-headline", { opacity: 1, duration: 0.13 }, 0.04);
      tl.to(".phase3-headline", { opacity: 0, y: -20, duration: 0.05 }, 0.22);

      // -------- PARAGRAPH 0.25 – 0.50 --------
      tl.fromTo(
        ".phase3-paragraph",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.04 },
        0.27
      );
      tl.to(".phase3-paragraph", { opacity: 1, duration: 0.15 }, 0.31);
      tl.to(".phase3-paragraph", { opacity: 0, y: -16, duration: 0.04 }, 0.48);

      // -------- PRINCIPLES 0.50 – 0.85 --------
      tl.fromTo(
        ".phase3-principles-wrap",
        { opacity: 0 },
        { opacity: 1, duration: 0.04 },
        0.50
      );
      // Stagger 4 layers — each slots into place from below, suggesting the
      // architecture stack is being assembled rather than just appearing.
      principles.forEach((_, i) => {
        const t = 0.50 + i * 0.07;
        tl.fromTo(
          `.phase3-principle-${i}`,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.03, ease: "expo.out" },
          t
        );
      });
      // Hold to end of phase
      tl.to(".phase3-principles-wrap", { opacity: 1, duration: 0.04 }, 0.81);
      tl.to(
        ".phase3-principles-wrap",
        { opacity: 0, y: -20, duration: 0.04 },
        0.85
      );

      // -------- BRIDGE 0.85 – 1.00 --------
      tl.fromTo(
        ".phase3-bridge",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.04 },
        0.87
      );
      tl.to(".phase3-bridge", { opacity: 1, duration: 0.1 }, 0.91);
    }, root);

    return () => {
      v?.removeEventListener("loadedmetadata", onMeta);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="ueber-mich"
      ref={root}
      className="relative isolate overflow-hidden bg-ink-950"
    >
      {/* DESKTOP — pinned drift through the architecture */}
      <div className="hidden md:block relative h-[100svh]">
        <CinematicVideo
          ref={videoRef}
          videoSrc={VIDEO_SRC}
          posterSrc={assets.aboutArchitecture.src!}
          endPosterSrc={assets.contactSystem.src!}
          className="absolute inset-0 -z-10"
        />

        {/* Permanent background calmer — uniform dark wash sits BETWEEN video and
            content for the entire Act 3 pin. Drift stays visible as atmosphere,
            but its cyan lines no longer compete with the foreground.            */}
        <div className="pointer-events-none absolute inset-0 -z-[6] bg-ink-950/55" />

        {/* Stronger local spotlight that picks up where the base wash leaves off
            and keeps the area behind the content extra calm.                    */}
        <div
          className="phase3-spotlight pointer-events-none absolute inset-0 -z-[5]"
          style={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(55% 55% at 50% 50%, rgba(5,8,18,0.35) 0%, rgba(5,8,18,0.7) 90%)",
            }}
          />
        </div>

        {/* PHASE 1 — Headline */}
        <div
          className="phase3-headline absolute inset-0 flex items-center justify-center will-change-transform"
          style={{ opacity: 0 }}
        >
          <div className="text-center max-w-4xl px-8">
            <div className="chip chip-dot mx-auto mb-6">Über mich</div>
            <h2 className="text-display-1 font-semibold text-white tracking-tighter2 leading-[1.0]">
              Ein System<br />
              braucht einen<br />
              <span className="text-gradient-accent">Architekten.</span>
            </h2>
          </div>
        </div>

        {/* PHASE 2 — Paragraph */}
        <div
          className="phase3-paragraph absolute inset-0 flex items-center justify-center will-change-transform"
          style={{ opacity: 0 }}
        >
          <div className="text-center max-w-2xl px-8">
            <p className="text-2xl md:text-3xl text-white leading-[1.3] font-light">
              Ich entwickle Software, die im echten Arbeitsalltag funktioniert.
              Keine Demo-Magie, keine endlosen Konzeptphasen — Lösungen, die ab
              Tag eins Wirkung zeigen.
            </p>
          </div>
        </div>

        {/* PHASE 3 — Architecture Stack
            Replaces the 2×2 grid of small principle labels with FOUR big
            stacked layers — a clear vertical system diagram. Each layer is a
            real surface, not a hairline; principle title is the headline of
            the layer, not a sub-line of a tiny number.                       */}
        <div
          className="phase3-principles-wrap absolute inset-0 flex items-center justify-center"
          style={{ opacity: 0 }}
        >
          <div className="max-w-3xl w-full px-8">
            <div className="text-center mb-7">
              <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-accent">
                Architektur
              </span>
              <h3 className="mt-3 text-display-2 font-semibold text-white tracking-tighter2 leading-[1.0]">
                Wie ich denke.
              </h3>
            </div>

            <div
              className="relative rounded-2xl border border-white/15 overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                backdropFilter: "blur(24px)",
              }}
            >
              {/* top inner highlight */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                  background:
                    "linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)",
                }}
              />

              {principles.map((p, i) => (
                <div
                  key={p.n}
                  className={`phase3-principle phase3-principle-${i} relative px-8 py-6 ${
                    i > 0 ? "border-t border-white/8" : ""
                  }`}
                  style={{ opacity: 0 }}
                >
                  <div className="flex items-center gap-8">
                    <div className="font-mono text-3xl font-bold text-accent tracking-tighter w-14 text-center">
                      L{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-2xl md:text-[1.7rem] font-semibold text-white leading-[1.1] tracking-tightish">
                        {p.label}
                      </div>
                      <p className="text-base text-white/65 mt-2 leading-relaxed">
                        {p.note}
                      </p>
                    </div>
                    <span
                      className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_14px_#5EE7FF] flex-shrink-0"
                      aria-hidden
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PHASE 4 — Bridge to Contact */}
        <div
          className="phase3-bridge absolute inset-0 flex items-center justify-center will-change-transform"
          style={{ opacity: 0 }}
        >
          <div className="text-center max-w-3xl px-8">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/8 backdrop-blur-md px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              system bereit
            </div>
            <h3 className="text-display-2 font-semibold text-white tracking-tighter2 leading-[1.05]">
              Bereit, <span className="text-gradient-accent">Ihr System</span><br />
              anzuschließen?
            </h3>
            <div className="mt-10 flex flex-col items-center gap-3 text-mute-soft">
              <span className="font-mono text-[10px] uppercase tracking-widest">
                Weiter zur Anfrage
              </span>
              <span className="block h-8 w-px bg-gradient-to-b from-white/30 to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE — three stacked panels, no pin, no scrub */}
      <div className="md:hidden">
        <MobilePanel posterSrc={assets.aboutArchitecture.src!}>
          <div className="m-reveal chip chip-dot mb-6">Über mich</div>
          <h2 className="m-reveal text-display-2 font-semibold text-white tracking-tighter2">
            Ein System<br />
            braucht einen<br />
            <span className="text-gradient-accent">Architekten.</span>
          </h2>
          <p className="m-reveal mt-6 text-lg text-mute leading-relaxed">
            Ich entwickle Software, die im echten Arbeitsalltag funktioniert.
            Keine Demo-Magie — Lösungen, die ab Tag eins Wirkung zeigen.
          </p>
        </MobilePanel>

        <MobilePanel posterSrc={assets.aboutArchitecture.src!}>
          <div className="m-reveal font-mono text-[10px] uppercase tracking-widest text-mute-soft mb-6">
            Vier Prinzipien
          </div>
          <div className="space-y-6">
            {principles.map((p) => (
              <div key={p.n} className="m-reveal">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xs text-accent">{p.n}</span>
                  <span className="h-px w-8 bg-accent/60" />
                </div>
                <div className="text-xl font-semibold text-white">
                  {p.label}
                </div>
                <p className="text-sm text-mute mt-1">{p.note}</p>
              </div>
            ))}
          </div>
          <div className="m-reveal mt-10 pt-6 border-t border-white/10">
            <div className="font-mono text-[10px] uppercase tracking-widest text-mute-soft mb-3">
              Stack
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {stack.map((s) => (
                <span key={s} className="text-xs text-white/70">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </MobilePanel>

        <MobilePanel posterSrc={assets.contactSystem.src!}>
          <div className="m-reveal mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/8 backdrop-blur-md px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            system bereit
          </div>
          <h3 className="m-reveal text-3xl font-semibold text-white tracking-tighter2">
            Bereit, <span className="text-gradient-accent">Ihr System</span><br />
            anzuschließen?
          </h3>
        </MobilePanel>
      </div>
    </section>
  );
}

function MobilePanel({
  posterSrc,
  children,
}: {
  posterSrc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="act3-mobile-panel relative min-h-[90svh] py-20 px-6 flex flex-col justify-center">
      <div className="absolute inset-0 -z-10">
        <CinematicVideo posterSrc={posterSrc} className="absolute inset-0" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(85% 75% at 50% 50%, rgba(5,8,18,0.3) 0%, rgba(5,8,18,0.65) 100%)",
          }}
        />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

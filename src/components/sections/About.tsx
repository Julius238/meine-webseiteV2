"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, isMobile } from "@/lib/gsap";
import { CinematicStage } from "@/components/visuals/CinematicStage";

const principles = [
  "Gelernter Anwendungsentwickler",
  "Technisch fundiert",
  "Lösungsorientiert",
  "Strukturierte Umsetzung",
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

export function About() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".about-line", {
        opacity: 0,
        y: 24,
        stagger: 0.1,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
      gsap.from(".about-principle", {
        opacity: 0,
        y: 14,
        stagger: 0.06,
        duration: 0.7,
        ease: "expo.out",
        scrollTrigger: { trigger: ".about-bottom", start: "top 85%" },
      });
      gsap.from(".about-stack-item", {
        opacity: 0,
        y: 8,
        stagger: 0.03,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: ".about-bottom", start: "top 85%" },
      });

      if (isMobile()) return;

      // text floats slowly while image keeps going
      gsap.to(".about-overlay", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="ueber-mich"
      ref={root}
      className="relative isolate min-h-[100svh] overflow-hidden flex"
    >
      <CinematicStage
        slot="aboutArchitecture"
        vignette={0.15}
        fadeTop={0.4}
        fadeTopHeight={0.25}
        fadeBottom={0.65}
        fadeBottomHeight={0.4}
        parallaxZoom
        focal="center"
        className="absolute inset-0 -z-10"
      />

      {/* asymmetric left wash so the text reads while the right of the image stays luminous */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-[5] hidden md:block"
        style={{
          background:
            "linear-gradient(to right, rgba(5,8,18,0.75) 0%, rgba(5,8,18,0.4) 30%, rgba(5,8,18,0) 55%)",
        }}
      />

      <div className="about-overlay relative z-10 mx-auto max-w-6xl px-6 md:px-10 w-full flex flex-col justify-center py-32">
        <div className="max-w-xl">
          <div className="about-line chip chip-dot mb-6">Über mich</div>
          <h2 className="about-line text-display-1 font-semibold text-white tracking-tighter2">
            Ein System<br />
            braucht einen<br />
            <span className="text-gradient-accent">Architekten.</span>
          </h2>
          <p className="about-line mt-6 text-lg text-mute leading-relaxed max-w-lg">
            Ich entwickle Software, die im echten Arbeitsalltag funktioniert.
            Keine Demo-Magie, keine endlosen Konzeptphasen — sondern Lösungen,
            die ab Tag eins Wirkung zeigen.
          </p>
          <p className="about-line mt-4 text-mute leading-relaxed max-w-lg">
            Ob internes Tool, KI-Automation oder neue Website: Ich übernehme
            Verantwortung für das Ergebnis — von der ersten Idee bis zur
            stabilen Lösung im Einsatz.
          </p>
        </div>
      </div>

      {/* quiet footer strip: principles + stack as a single thin band over the image */}
      <div className="about-bottom absolute bottom-0 inset-x-0 z-10 px-6 md:px-10 pb-10">
        <div className="mx-auto max-w-6xl border-t border-white/10 pt-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-mute-soft mb-3">
              Prinzipien
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {principles.map((p, i) => (
                <span
                  key={p}
                  className="about-principle text-sm text-white/85 flex items-center gap-2"
                >
                  <span className="font-mono text-[10px] text-accent">
                    0{i + 1}
                  </span>
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div className="md:text-right">
            <div className="font-mono text-[10px] uppercase tracking-widest text-mute-soft mb-3">
              Stack
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 md:justify-end max-w-md md:max-w-sm">
              {stack.map((s) => (
                <span
                  key={s}
                  className="about-stack-item text-xs text-white/70"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

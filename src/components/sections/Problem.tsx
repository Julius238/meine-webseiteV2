"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, isMobile } from "@/lib/gsap";
import { CinematicStage } from "@/components/visuals/CinematicStage";

export function Problem() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".problem-line", {
        y: 28,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
      gsap.from(".problem-marker", {
        opacity: 0,
        scale: 0.7,
        stagger: 0.1,
        duration: 0.6,
        delay: 0.3,
        ease: "back.out(1.5)",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });

      if (isMobile()) return;

      // gentle camera push as user scrolls past
      gsap.to(".problem-text", {
        yPercent: -10,
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
      ref={root}
      className="relative isolate min-h-[100svh] overflow-hidden flex items-center"
    >
      {/* full-bleed film */}
      <CinematicStage
        slot="problemChaos"
        vignette={0.2}
        fadeTop={0.2}
        fadeTopHeight={0.15}
        fadeBottom={0.55}
        fadeBottomHeight={0.3}
        parallaxPan="left"
        focal="right"
        className="absolute inset-0 -z-10"
      />

      {/* asymmetric darken — left half (where text sits) gets a soft gradient so the right of the image stays bright */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-[5]"
        style={{
          background:
            "linear-gradient(to right, rgba(5,8,18,0.7) 0%, rgba(5,8,18,0.35) 35%, rgba(5,8,18,0) 60%)",
        }}
      />

      <div className="problem-text relative z-10 mx-auto max-w-6xl px-6 md:px-8 py-32 w-full">
        <div className="max-w-xl">
          <div className="problem-line chip mb-6" style={{ borderColor: "rgba(255,120,80,0.25)" }}>
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
            Das Problem
          </div>

          <h2 className="problem-line text-display-1 font-semibold text-white tracking-tighter2">
            Manuelle Prozesse.<br />
            Tool-Chaos.<br />
            <span className="text-white/40">Doppelte Arbeit.</span>
          </h2>

          <p className="problem-line mt-8 text-lg md:text-xl text-mute leading-relaxed max-w-xl">
            Informationen liegen in Mails, Tabellen, Notizen und Tools verstreut.
            Mitarbeiter:innen kopieren Daten von A nach B. Es entstehen Fehler,
            Engpässe und stille Kosten — jeden Tag aufs Neue.
          </p>

          <div className="problem-line mt-10 flex flex-wrap gap-2">
            {[
              "Excel als Datenbank",
              "Status per Mail-Kette",
              "Copy-Paste zwischen 4 Tools",
              "Wissen lebt in den Köpfen",
            ].map((t) => (
              <span
                key={t}
                className="problem-marker rounded-full border border-white/15 bg-ink-950/50 backdrop-blur-md px-3 py-1.5 text-sm text-white/85"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* corner caption */}
        <div className="absolute bottom-8 right-8 hidden md:flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/55">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
          Status quo · ungelöst
        </div>
      </div>
    </section>
  );
}

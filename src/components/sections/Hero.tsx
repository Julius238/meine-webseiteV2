"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, isMobile } from "@/lib/gsap";
import { CinematicStage } from "@/components/visuals/CinematicStage";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.from(".hero-chip", { y: 16, opacity: 0, duration: 0.8, delay: 0.25 })
        .from(
          ".hero-word",
          { y: 80, opacity: 0, duration: 1.2, stagger: 0.08 },
          "-=0.4"
        )
        .from(".hero-sub", { y: 20, opacity: 0, duration: 1 }, "-=0.7")
        .from(".hero-cta > *", { y: 14, opacity: 0, duration: 0.8, stagger: 0.08 }, "-=0.6");

      if (isMobile()) return;

      gsap.to(".hero-content", {
        yPercent: -22,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const headlineWords = ["Aus", "manuellen", "Abläufen", "werden"];

  return (
    <section
      id="top"
      ref={root}
      className="relative isolate min-h-[100svh] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* full-bleed film */}
      <CinematicStage
        slot="heroBackdrop"
        priority
        vignette={0.2}
        fadeBottom={0.55}
        fadeBottomHeight={0.3}
        parallaxZoom
        className="absolute inset-0 -z-10"
      />

      {/* text */}
      <div className="hero-content relative z-10 mx-auto max-w-6xl px-6 md:px-8 text-center pt-32 pb-24">
        <div className="hero-chip chip chip-dot mx-auto mb-8">
          Verfügbar für Projekte · 2026
        </div>

        {/*
          NOTE: text-gradient sits on each `.hero-word` span itself — NOT on the H1.
          Reason: GSAP applies a CSS transform to .hero-word during the entrance
          animation. With background-clip:text on the H1, transformed children
          render in their own paint layer, so the parent's clipped gradient does
          not reach them and the spans become permanently transparent (showing
          the dark body background through). Putting the gradient locally on each
          animated span keeps the clip valid under transform.
        */}
        <h1 className="text-display-1 font-semibold tracking-tighter2 max-w-5xl mx-auto text-white">
          {headlineWords.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden align-baseline">
              <span className="hero-word inline-block mr-[0.25em] text-gradient">
                {w}
              </span>
            </span>
          ))}
          <br />
          <span className="inline-block overflow-hidden align-baseline">
            <span className="hero-word inline-block text-gradient-accent">
              digitale Systeme.
            </span>
          </span>
        </h1>

        <p className="hero-sub mt-8 mx-auto max-w-2xl text-lg md:text-xl text-mute leading-relaxed">
          Ich entwickle individuelle Software, KI-Automationen, Websites und
          CMS-Lösungen für Unternehmen, die effizienter arbeiten wollen.
        </p>

        <div className="hero-cta mt-10 flex flex-wrap items-center justify-center gap-3">
          <a href="#kontakt" className="btn-primary">
            Projekt starten
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3 7h8M7 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a href="#leistungen" className="btn-ghost">
            Leistungen ansehen
          </a>
        </div>

      </div>

      {/* scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-mute-soft z-10">
        <span className="font-mono text-[10px] uppercase tracking-widest">Scroll</span>
        <span className="block h-8 w-px bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  );
}

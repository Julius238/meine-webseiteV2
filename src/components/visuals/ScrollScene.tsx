"use client";

import { ReactNode, useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, isMobile } from "@/lib/gsap";
import { CinematicStage } from "./CinematicStage";
import type { AssetKey } from "@/lib/assets";

type Step = {
  number: string;
  eyebrow?: string;
  title: ReactNode;
  description: string;
  bullets?: string[];
};

type Props = {
  id?: string;
  slot: AssetKey;
  intro: {
    chip: string;
    title: ReactNode;
    description?: string;
  };
  steps: Step[];
};

/**
 * Pinned cinematic scroll-sequence:
 *  - one Higgsfield image stays on screen as the stage
 *  - intro panel + N step panels cross-fade as user scrolls
 *  - background image keeps slowly zooming through the whole pin
 *
 * No cards, no grid — pure film-overlay text on the image.
 */
export function ScrollScene({ id, slot, intro, steps }: Props) {
  const root = useRef<HTMLElement>(null);
  const panels = 1 + steps.length;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (isMobile()) {
        // mobile: simple stacked fades, no pin
        gsap.from(".scn-intro > *", {
          y: 20,
          opacity: 0,
          stagger: 0.1,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });
        gsap.utils.toArray<HTMLElement>(".scn-step").forEach((s) => {
          gsap.from(s, {
            y: 30,
            opacity: 0,
            duration: 0.9,
            ease: "expo.out",
            scrollTrigger: { trigger: s, start: "top 80%" },
          });
        });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${panels * 80}%`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // intro stays visible at start, then leaves
      tl.from(".scn-intro > *", {
        opacity: 0,
        y: 24,
        stagger: 0.06,
        duration: 0.3,
      });
      tl.to(".scn-intro", { opacity: 1, duration: 1.2 });
      tl.to(".scn-intro", { opacity: 0, y: -30, duration: 0.5 });

      // each step: cross-fade in, hold, cross-fade out
      steps.forEach((_, i) => {
        const sel = `.scn-step-${i}`;
        tl.fromTo(
          sel,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5 },
          ">-0.1"
        );
        tl.to(sel, { opacity: 1, duration: 1.0 });

        // progress dot fills up
        gsap.set(`.scn-dot-${i}`, { transformOrigin: "left center" });
        tl.to(`.scn-dot-${i}`, { scaleX: 1, duration: 0.3 }, "<-0.4");

        if (i < steps.length - 1) {
          tl.to(sel, { opacity: 0, y: -30, duration: 0.5 });
        }
      });

      // image slow zoom across whole pin
      gsap.fromTo(
        ".scn-bg .stage-img",
        { scale: 1.02 },
        {
          scale: 1.12,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${panels * 80}%`,
            scrub: 1,
          },
        }
      );
    }, root);
    return () => ctx.revert();
  }, [panels, steps]);

  return (
    <section
      id={id}
      ref={root}
      className="relative isolate overflow-hidden"
    >
      {/* on mobile we let content drive height; on desktop the pinned area is 100svh */}
      <div className="md:h-[100svh] relative">
        <CinematicStage
          slot={slot}
          vignette={0.1}
          fadeTop={0.25}
          fadeTopHeight={0.2}
          fadeBottom={0.5}
          fadeBottomHeight={0.3}
          parallaxZoom={false}
          className="scn-bg absolute inset-0 -z-10 hidden md:block"
        />

        {/* DESKTOP — stacked overlay panels driven by pin */}
        <div className="hidden md:flex relative h-full items-center justify-center px-6 md:px-10">
          <div className="relative w-full max-w-4xl text-center">
            <div className="scn-intro absolute inset-0 flex flex-col items-center justify-center">
              <div className="chip chip-dot mb-6">{intro.chip}</div>
              <h2 className="text-display-1 font-semibold text-white tracking-tighter2">
                {intro.title}
              </h2>
              {intro.description && (
                <p className="mt-6 text-lg text-mute leading-relaxed max-w-xl">
                  {intro.description}
                </p>
              )}
            </div>

            {steps.map((s, i) => (
              <div
                key={i}
                className={`scn-step scn-step-${i} absolute inset-0 flex flex-col items-center justify-center`}
                style={{ opacity: 0 }}
              >
                <div className="flex items-center gap-3 mb-6 font-mono text-xs uppercase tracking-widest">
                  <span className="text-accent">{s.number}</span>
                  <span className="h-px w-10 bg-accent/60" />
                  <span className="text-mute-soft">
                    {s.eyebrow ?? `Schritt ${i + 1} / ${steps.length}`}
                  </span>
                </div>
                <h3 className="text-display-2 font-semibold text-white tracking-tighter2 leading-[1.05] max-w-3xl">
                  {s.title}
                </h3>
                <p className="mt-6 text-lg text-mute leading-relaxed max-w-xl">
                  {s.description}
                </p>
                {s.bullets && (
                  <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2">
                    {s.bullets.map((b) => (
                      <li
                        key={b}
                        className="text-sm text-white/75 flex items-center gap-2"
                      >
                        <span className="h-1 w-1 rounded-full bg-accent" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* progress dots */}
            <div className="absolute -bottom-32 left-0 right-0 flex items-center justify-center gap-2">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className="relative h-px w-14 overflow-hidden bg-white/15 rounded-full"
                >
                  <span
                    className={`scn-dot-${i} absolute inset-0 bg-accent`}
                    style={{ transform: "scaleX(0)" }}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* MOBILE — bg + stacked content */}
        <div className="md:hidden">
          <CinematicStage
            slot={slot}
            vignette={0.1}
            fadeTop={0.4}
            fadeBottom={0.6}
            parallaxZoom
            className="relative h-[60svh]"
          />
          <div className="relative bg-ink-950 px-6 py-16 space-y-16">
            <div className="scn-intro text-center">
              <div className="chip chip-dot mx-auto mb-6">{intro.chip}</div>
              <h2 className="text-display-2 font-semibold text-white tracking-tighter2">
                {intro.title}
              </h2>
              {intro.description && (
                <p className="mt-5 text-base text-mute leading-relaxed">
                  {intro.description}
                </p>
              )}
            </div>
            {steps.map((s, i) => (
              <div key={i} className="scn-step text-center">
                <div className="flex items-center justify-center gap-3 mb-4 font-mono text-xs uppercase tracking-widest">
                  <span className="text-accent">{s.number}</span>
                  <span className="h-px w-8 bg-accent/60" />
                  <span className="text-mute-soft">
                    {s.eyebrow ?? `Schritt ${i + 1}`}
                  </span>
                </div>
                <h3 className="text-2xl font-semibold text-white tracking-tightish leading-tight">
                  {s.title}
                </h3>
                <p className="mt-4 text-mute leading-relaxed">{s.description}</p>
                {s.bullets && (
                  <ul className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1">
                    {s.bullets.map((b) => (
                      <li
                        key={b}
                        className="text-sm text-white/75 flex items-center gap-2"
                      >
                        <span className="h-1 w-1 rounded-full bg-accent" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

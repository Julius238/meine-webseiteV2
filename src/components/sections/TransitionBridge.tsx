"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, isMobile } from "@/lib/gsap";
import { CinematicStage } from "@/components/visuals/CinematicStage";

export function TransitionBridge() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".bridge-word", {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });

      if (isMobile()) return;

      // text holds while image keeps moving
      gsap.to(".bridge-text", {
        yPercent: -25,
        opacity: 0.2,
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
      className="relative isolate h-[80svh] md:h-[100svh] overflow-hidden flex items-center justify-center"
      aria-hidden="true"
    >
      <CinematicStage
        slot="transitionBridge"
        vignette={0.1}
        fadeTop={0.55}
        fadeTopHeight={0.2}
        fadeBottom={0.55}
        fadeBottomHeight={0.2}
        parallaxPan="right"
        className="absolute inset-0 -z-10"
      />

      <div className="bridge-text relative z-10 px-6 absolute bottom-12 left-0 right-0 text-center">
        <span className="bridge-word block font-mono text-[10px] uppercase tracking-[0.4em] text-mute-soft mb-3">
          Übergang
        </span>
        <h2 className="text-2xl md:text-4xl font-light text-white tracking-tighter2">
          <span className="bridge-word inline-block text-white/60">Chaos</span>{" "}
          <span className="bridge-word inline-block">→</span>{" "}
          <span className="bridge-word inline-block text-gradient-accent">Struktur</span>
        </h2>
      </div>
    </section>
  );
}

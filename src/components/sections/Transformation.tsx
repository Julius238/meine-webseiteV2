"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, isMobile } from "@/lib/gsap";
import { CinematicStage } from "@/components/visuals/CinematicStage";

export function Transformation() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".trans-line", {
        opacity: 0,
        y: 26,
        stagger: 0.12,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });

      if (isMobile()) return;

      // text holds, image continues
      gsap.to(".trans-text", {
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
      <CinematicStage
        slot="transformationNetwork"
        vignette={0.2}
        fadeTop={0.2}
        fadeTopHeight={0.15}
        fadeBottom={0.55}
        fadeBottomHeight={0.3}
        parallaxZoom
        focal="left"
        tint="cyan"
        className="absolute inset-0 -z-10"
      />

      {/* asymmetric darken on the right where text sits */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-[5]"
        style={{
          background:
            "linear-gradient(to left, rgba(5,8,18,0.7) 0%, rgba(5,8,18,0.35) 35%, rgba(5,8,18,0) 60%)",
        }}
      />

      <div className="trans-text relative z-10 mx-auto max-w-6xl px-6 md:px-8 py-32 w-full">
        <div className="max-w-xl ml-auto text-right">
          <div className="trans-line chip chip-dot mb-6 ml-auto">
            Die Transformation
          </div>
          <h2 className="trans-line text-display-1 font-semibold text-white tracking-tighter2">
            Aus Chaos<br />
            wird ein <span className="text-gradient-accent">System.</span>
          </h2>
          <p className="trans-line mt-8 text-lg md:text-xl text-mute leading-relaxed ml-auto max-w-lg">
            Datenquellen werden verbunden, Entscheidungen automatisiert. Was
            entsteht, ist ein klares System — vom Trigger bis zum Ergebnis,
            transparent und nachvollziehbar.
          </p>
          <div className="trans-line mt-8 flex flex-wrap gap-2 justify-end">
            <span className="chip chip-dot">live · ohne Bruchstellen</span>
            <span className="chip">messbar · nachvollziehbar</span>
          </div>
        </div>

        <div className="absolute bottom-8 left-8 hidden md:flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/55">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          System · v2 · live
        </div>
      </div>
    </section>
  );
}

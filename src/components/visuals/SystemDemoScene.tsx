"use client";

import { ReactNode, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, isMobile } from "@/lib/gsap";
import { CinematicStage } from "./CinematicStage";
import { assets, type AssetKey } from "@/lib/assets";

type Module = {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  screen: AssetKey;
};

type Props = {
  id?: string;
  bgSlot: AssetKey;
  intro: {
    chip: string;
    title: ReactNode;
    description?: string;
  };
  modules: Module[];
};

/**
 * Solutions as ONE pinned system-demo: same background world, a single
 * centered "screen" cross-fades between product views, side text swaps
 * in sync. Feels like "the system" reveals four capabilities — not a
 * gallery of products.
 */
export function SystemDemoScene({ id, bgSlot, intro, modules }: Props) {
  const root = useRef<HTMLElement>(null);
  const panels = 1 + modules.length;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (isMobile()) {
        gsap.from(".sds-intro > *", {
          y: 20,
          opacity: 0,
          stagger: 0.1,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });
        gsap.utils.toArray<HTMLElement>(".sds-mod").forEach((el) => {
          gsap.from(el, {
            y: 30,
            opacity: 0,
            duration: 0.9,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 80%" },
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

      // intro panel
      tl.from(".sds-intro > *", {
        opacity: 0,
        y: 24,
        stagger: 0.06,
        duration: 0.3,
      });
      tl.to(".sds-intro", { opacity: 1, duration: 1.0 });
      tl.to(".sds-intro", { opacity: 0, y: -30, duration: 0.5 });

      modules.forEach((_, i) => {
        const txt = `.sds-mod-${i}`;
        const scr = `.sds-screen-${i}`;

        tl.fromTo(
          [txt, scr],
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5 },
          ">-0.1"
        );
        tl.to([txt, scr], { opacity: 1, duration: 1.0 });
        tl.to(`.sds-dot-${i}`, { scaleX: 1, duration: 0.3 }, "<-0.5");

        if (i < modules.length - 1) {
          tl.to([txt, scr], { opacity: 0, y: -30, duration: 0.5 });
        }
      });

      // bg slow zoom across whole pin
      gsap.fromTo(
        ".sds-bg .stage-img",
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
  }, [panels, modules]);

  return (
    <section
      id={id}
      ref={root}
      className="relative isolate overflow-hidden"
    >
      <div className="md:h-[100svh] relative">
        {/* desktop bg — same world as Services */}
        <CinematicStage
          slot={bgSlot}
          vignette={0.15}
          fadeTop={0.35}
          fadeTopHeight={0.25}
          fadeBottom={0.6}
          fadeBottomHeight={0.4}
          parallaxZoom={false}
          className="sds-bg absolute inset-0 -z-10 hidden md:block"
        />

        {/* DESKTOP */}
        <div className="hidden md:grid relative h-full grid-cols-12 gap-8 items-center px-8 lg:px-16">
          {/* left: text */}
          <div className="col-span-5 relative h-[60vh]">
            <div className="sds-intro absolute inset-0 flex flex-col justify-center">
              <div className="chip chip-dot mb-6">{intro.chip}</div>
              <h2 className="text-display-1 font-semibold text-white tracking-tighter2">
                {intro.title}
              </h2>
              {intro.description && (
                <p className="mt-6 text-lg text-mute leading-relaxed max-w-md">
                  {intro.description}
                </p>
              )}
            </div>

            {modules.map((m, i) => (
              <div
                key={i}
                className={`sds-mod sds-mod-${i} absolute inset-0 flex flex-col justify-center`}
                style={{ opacity: 0 }}
              >
                <div className="flex items-center gap-3 mb-5 font-mono text-xs uppercase tracking-widest">
                  <span className="text-accent">{m.number}</span>
                  <span className="h-px w-10 bg-accent/60" />
                  <span className="text-mute-soft">{m.eyebrow}</span>
                </div>
                <h3 className="text-display-2 font-semibold text-white tracking-tighter2 leading-[1.05]">
                  {m.title}
                </h3>
                <p className="mt-5 text-lg text-mute leading-relaxed max-w-md">
                  {m.description}
                </p>
              </div>
            ))}
          </div>

          {/* right: screen stack — all modules' images at same position, opacity-controlled */}
          <div className="col-span-7 relative h-[64vh]">
            {modules.map((m, i) => {
              const a = assets[m.screen];
              return (
                <div
                  key={i}
                  className={`sds-screen sds-screen-${i} absolute inset-0 flex items-center justify-center`}
                  style={{ opacity: 0 }}
                >
                  <div className="relative w-full max-w-2xl aspect-[4/3]">
                    {/* glow shelf */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -inset-10 rounded-[40px] blur-3xl opacity-60"
                      style={{
                        background:
                          "radial-gradient(circle at 30% 30%, rgba(94,231,255,0.25), transparent 60%), radial-gradient(circle at 70% 80%, rgba(58,139,255,0.2), transparent 60%)",
                      }}
                    />
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
                      {a.src && (
                        <Image
                          src={a.src}
                          alt=""
                          fill
                          sizes="50vw"
                          className="object-cover"
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* progress strip */}
            <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-center gap-2">
              {modules.map((_, i) => (
                <span
                  key={i}
                  className="relative h-px w-12 overflow-hidden bg-white/15 rounded-full"
                >
                  <span
                    className={`sds-dot-${i} absolute inset-0 bg-accent`}
                    style={{ transform: "scaleX(0)", transformOrigin: "left" }}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* MOBILE */}
        <div className="md:hidden">
          <CinematicStage
            slot={bgSlot}
            vignette={0.1}
            fadeTop={0.4}
            fadeBottom={0.6}
            parallaxZoom
            className="relative h-[50svh]"
          />
          <div className="relative bg-ink-950 px-6 py-16 space-y-20">
            <div className="sds-intro text-center">
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
            {modules.map((m, i) => {
              const a = assets[m.screen];
              return (
                <div key={i} className="sds-mod">
                  <div className="flex items-center gap-3 mb-3 font-mono text-xs uppercase tracking-widest">
                    <span className="text-accent">{m.number}</span>
                    <span className="h-px w-8 bg-accent/60" />
                    <span className="text-mute-soft">{m.eyebrow}</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-white tracking-tightish leading-tight">
                    {m.title}
                  </h3>
                  <p className="mt-3 text-mute leading-relaxed">{m.description}</p>
                  <div className="relative mt-6 aspect-[4/3] rounded-xl overflow-hidden border border-white/10">
                    {a.src && (
                      <Image
                        src={a.src}
                        alt=""
                        fill
                        sizes="100vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

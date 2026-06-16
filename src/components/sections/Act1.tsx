"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, isMobile, prefersReducedMotion } from "@/lib/gsap";
import { CinematicVideo } from "@/components/visuals/CinematicVideo";
import { useVideoScrub, scrubVideo } from "@/lib/useVideoScrub";
import { assets } from "@/lib/assets";

/**
 * Akt I — Im Lärm
 *
 * One pinned cinematic sequence. The Higgsfield video (hero-backdrop → problem-chaos)
 * is scrubbed by the page scroll position; the headline + subline carry the camera into
 * the noise, then dissolve as the world breaks; the problem caption lands at the end.
 *
 * Scroll timeline (single GSAP master timeline, scrubbed):
 *   0.00 – 0.20  Hero copy held over calm cyan streams      (video: 0 – 2 s)
 *   0.20 – 0.40  Hero copy fades / lifts                     (video: 2 – 4 s, streams break)
 *   0.40 – 0.55  Empty beat — pure film                      (video: 4 – 5.5 s, world transforms)
 *   0.55 – 0.75  Problem caption rises                       (video: 5.5 – 7.5 s, chaos visible)
 *   0.75 – 1.00  Problem held, pills/markers settle          (video: 7.5 – 10 s, full chaos)
 *
 * Mobile: no pin, no video scrub — falls back to two stacked full-bleed stills with
 * normal entrance animations. Still feels cohesive.
 */

const VIDEO_SRC = "/assets/act1.mp4";

export function Act1() {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Last scroll progress remembered for the hook's forced re-sync once
  // metadata arrives (e.g. user reloaded mid-section).
  const progressRef = useRef(0);
  const ready = useVideoScrub(videoRef, progressRef);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (isMobile()) {
        // Skip GSAP intro animations for users who prefer reduced motion;
        // elements stay at their natural visible state.
        if (prefersReducedMotion()) return;
        gsap.from(".act1-hero > *", {
          opacity: 0,
          y: 28,
          stagger: 0.1,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });
        gsap.from(".act1-problem > *", {
          opacity: 0,
          y: 28,
          stagger: 0.1,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ".act1-mobile-problem",
            start: "top 75%",
          },
        });
        return;
      }

      // Master pinned timeline — scrub binds it to scroll progress.
      // onUpdate sets video.currentTime in sync.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=250%",
          pin: true,
          scrub: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Always remember the current scroll progress so the hook can do
            // a forced re-sync the moment the video becomes seekable.
            progressRef.current = self.progress;
            scrubVideo(videoRef.current, ready, self.progress);
          },
          onRefresh: () => {
            // try to keep paused state once dimensions settle
            const v = videoRef.current;
            if (v) v.pause();
          },
        },
        defaults: { ease: "none" },
      });

      // Hero copy: visible until ~35%, dissolves to nothing at ~50%
      tl.fromTo(
        ".act1-hero",
        { opacity: 1, y: 0 },
        { opacity: 1, y: 0, duration: 0.35 }
      )
        .to(".act1-hero", { opacity: 0, y: -30, duration: 0.15 }, 0.35);

      // Problem copy: rises from 0.55 to 0.7, held to end
      tl.fromTo(
        ".act1-problem",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.15 },
        0.55
      );
      tl.fromTo(
        ".act1-problem-chip",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.06 },
        0.52
      );
      tl.fromTo(
        ".act1-pill",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.05, stagger: 0.015 },
        0.7
      );
      tl.fromTo(
        ".act1-corner",
        { opacity: 0 },
        { opacity: 1, duration: 0.05 },
        0.8
      );

      // Scroll cue at very start — fades out quickly
      gsap.to(".act1-scroll-cue", {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=30%",
          scrub: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      id="top"
      ref={root}
      className="relative isolate overflow-hidden bg-ink-950"
    >
      {/* DESKTOP — pinned cinematic stage */}
      <div className="hidden md:block relative h-[100svh]">
        <CinematicVideo
          ref={videoRef}
          videoSrc={VIDEO_SRC}
          posterSrc={assets.heroBackdrop.src!}
          endPosterSrc={assets.problemChaos.src!}
          priority
          className="absolute inset-0 -z-10"
        />

        {/* light vignette + subtle asymmetric wash for legibility */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-[5]"
          style={{
            background:
              "radial-gradient(85% 75% at 50% 50%, transparent 55%, rgba(5,8,18,0.45) 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5]"
          style={{
            height: "30%",
            background:
              "linear-gradient(to top, rgba(5,8,18,0.55), transparent)",
          }}
        />

        {/* Hero overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="act1-hero relative max-w-6xl px-6 md:px-10 text-center will-change-transform">
            <div className="chip chip-dot mx-auto mb-8">
              Verfügbar für Projekte · 2026
            </div>
            <h1 className="text-display-1 font-semibold tracking-tighter2 max-w-5xl mx-auto text-white leading-[1.05] pb-1">
              <span className="inline-block text-gradient">Aus manuellen Abläufen</span>
              <br />
              <span className="inline-block text-gradient">werden</span>{" "}
              <span className="inline-block text-gradient-accent">digitale Systeme.</span>
            </h1>
            <p className="mt-8 mx-auto max-w-2xl text-lg md:text-xl text-mute leading-relaxed">
              Ich entwickle individuelle Software, KI-Automationen, Websites und
              CMS-Lösungen für Unternehmen, die effizienter arbeiten wollen.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
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
              <a href="#leistungen" className="btn-ghost">Leistungen ansehen</a>
            </div>
          </div>
        </div>

        {/* Problem overlay — rises in the last 40 % of the pin */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full px-6 md:px-10 pb-20 md:pb-28">
            <div className="mx-auto max-w-6xl">
              <div className="act1-problem-chip chip mb-5" style={{ borderColor: "rgba(255,120,80,0.25)" }}>
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
                Das Problem
              </div>
              <h2 className="act1-problem text-display-2 font-semibold text-white tracking-tighter2 max-w-3xl will-change-transform">
                Manuelle Prozesse.<br />
                Tool-Chaos.{" "}
                <span className="text-white/40">Doppelte Arbeit.</span>
              </h2>
              <div className="mt-6 flex flex-wrap gap-2 max-w-3xl">
                {[
                  "Excel als Datenbank",
                  "Status per Mail-Kette",
                  "Copy-Paste zwischen 4 Tools",
                  "Wissen lebt in den Köpfen",
                ].map((t) => (
                  <span
                    key={t}
                    className="act1-pill rounded-full border border-white/15 bg-ink-950/55 backdrop-blur-md px-3 py-1.5 text-sm text-white/85"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* corner caption */}
        <div className="act1-corner absolute bottom-8 right-8 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/55">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
          Status quo · ungelöst
        </div>

        {/* scroll cue */}
        <div className="act1-scroll-cue absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-mute-soft z-10">
          <span className="font-mono text-[10px] uppercase tracking-widest">Scroll</span>
          <span className="block h-8 w-px bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </div>

      {/* MOBILE — two stacked stills, no pin, no scrub */}
      <div className="md:hidden">
        <div className="relative h-[90svh]">
          <CinematicVideo
            posterSrc={assets.heroBackdrop.src!}
            priority
            className="absolute inset-0"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(85% 75% at 50% 50%, transparent 55%, rgba(5,8,18,0.45) 100%)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="act1-hero relative max-w-md px-6 text-center">
              <div className="chip chip-dot mx-auto mb-6">
                Verfügbar für Projekte · 2026
              </div>
              <h1 className="text-4xl font-semibold tracking-tighter2 text-white">
                <span className="text-gradient">Aus manuellen Abläufen werden</span>{" "}
                <span className="text-gradient-accent">digitale Systeme.</span>
              </h1>
              <p className="mt-5 text-base text-mute leading-relaxed">
                Individuelle Software, KI-Automationen, Websites und CMS-Lösungen
                für Unternehmen, die effizienter arbeiten wollen.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <a href="#kontakt" className="btn-primary">Projekt starten</a>
                <a href="#leistungen" className="btn-ghost">Leistungen</a>
              </div>
            </div>
          </div>
        </div>

        <div className="act1-mobile-problem relative h-[90svh]">
          <CinematicVideo
            posterSrc={assets.problemChaos.src!}
            className="absolute inset-0"
            objectPosition="center"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(5,8,18,0.7) 0%, rgba(5,8,18,0.2) 60%, rgba(5,8,18,0.4) 100%)",
            }}
          />
          <div className="absolute inset-0 flex items-end">
            <div className="act1-problem w-full px-6 pb-16 text-left">
              <div className="chip mb-4" style={{ borderColor: "rgba(255,120,80,0.25)" }}>
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
                Das Problem
              </div>
              <h2 className="text-3xl font-semibold text-white tracking-tighter2">
                Manuelle Prozesse.<br />
                Tool-Chaos.{" "}
                <span className="text-white/40">Doppelte Arbeit.</span>
              </h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "Excel als Datenbank",
                  "Status per Mail-Kette",
                  "Copy-Paste zwischen Tools",
                  "Wissen lebt in Köpfen",
                ].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/15 bg-ink-950/55 backdrop-blur-md px-3 py-1.5 text-sm text-white/85"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

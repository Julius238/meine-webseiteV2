"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap, isMobile, prefersReducedMotion } from "@/lib/gsap";
import { CinematicVideo } from "@/components/visuals/CinematicVideo";
import { useVideoScrub, scrubVideo } from "@/lib/useVideoScrub";
import {
  ApplicationScene,
  sceneByKey,
  type SceneKey,
} from "@/components/visuals/ApplicationScenes";
import { assets } from "@/lib/assets";

/**
 * Akt II — Das System entsteht
 *
 * One long pinned cinematic sequence. The Higgsfield video (~15 s, problem-chaos
 * → transformation-network) is scrubbed by scroll position. Five content phases
 * cross-fade as text overlays on top of the world that's assembling itself.
 *
 * Scroll timeline (in % of pin duration ≈ 600 svh):
 *   0.00 – 0.10  Bridge:        "Chaos → Struktur"
 *   0.10 – 0.22  Transformation: "Aus Chaos wird ein System"
 *   0.22 – 0.46  Services:       4 module labels float in across the viewport
 *   0.46 – 0.66  Process:        4 stations cross-fade as caption
 *   0.66 – 1.00  Solutions:      4 product views cross-fade as floating screens
 *
 * Mobile: no pin, no scrub. Five stacked panels with the static stills behind.
 */

const VIDEO_SRC = "/assets/act2.mp4";

const services = [
  {
    n: "01",
    title: "Individuelle Software",
    tagline:
      "Web-Apps, interne Tools und Schnittstellen — zugeschnitten auf Ihre Prozesse, nicht auf eine Standard-Schablone.",
    tags: ["Web-Apps", "Interne Tools", "Dashboards", "APIs"],
  },
  {
    n: "02",
    title: "KI-Automation",
    tagline:
      "Wiederkehrende Arbeit übernimmt eine KI. Sortieren, klassifizieren, beantworten — zuverlässig und nachvollziehbar.",
    tags: ["Dokumente", "Klassifikation", "Assistenten"],
  },
  {
    n: "03",
    title: "Websites & Landingpages",
    tagline:
      "Performante, moderne Websites mit klarer Botschaft. Optimiert auf Tempo, SEO und Conversion.",
    tags: ["Next.js / React", "SEO", "Performance"],
  },
  {
    n: "04",
    title: "CMS-Systeme",
    tagline:
      "Inhalte ohne Entwickler:in pflegen. Headless oder klassisch — mit sauberer Struktur.",
    tags: ["Headless", "Redaktions-UI", "Workflows"],
  },
];

const stations = [
  {
    n: "01",
    title: "Verstehen",
    headline: "Status quo ehrlich aufnehmen.",
    description:
      "Wir analysieren Ihre Abläufe, Tools und Engpässe. Ziel: eine technische Sicht ohne Beschönigung.",
    deliverable: "Ist-Aufnahme · Engpass-Karte",
  },
  {
    n: "02",
    title: "Konzept",
    headline: "Plan vor Code.",
    description:
      "Klarer Plan: was gebaut wird, in welcher Reihenfolge — mit Fokus auf Hebel und Risiken.",
    deliverable: "Architektur · Roadmap · Estimate",
  },
  {
    n: "03",
    title: "Umsetzung",
    headline: "Iterativ, sichtbar, schnell.",
    description:
      "Kurze Schleifen. Sie sehen früh echte Ergebnisse, nicht nur Konzepte und Mockups.",
    deliverable: "Live-Build · Wöchentliche Demos",
  },
  {
    n: "04",
    title: "Übergabe",
    headline: "Sauber im Einsatz.",
    description:
      "Saubere Übergabe, Dokumentation, Schulung — und auf Wunsch laufende Weiterentwicklung.",
    deliverable: "Dokumentation · Support",
  },
];

type Solution = {
  n: string;
  eyebrow: string;
  title: string;
  description: string;
  scene: SceneKey;
};

const solutions: Solution[] = [
  {
    n: "01",
    eyebrow: "Dashboards",
    title: "Internes Dashboard",
    description:
      "Alle relevanten Zahlen, Engpässe und Aktivitäten in Echtzeit — ohne Excel-Exporte.",
    scene: "dashboard",
  },
  {
    n: "02",
    eyebrow: "KI-Automation",
    title: "Automatisierte Angebotsbearbeitung",
    description:
      "Anfragen werden klassifiziert, Angebote vorbereitet und zur Freigabe vorgelegt.",
    scene: "automation",
  },
  {
    n: "03",
    eyebrow: "Website & CMS",
    title: "Website mit CMS",
    description:
      "Moderne Website mit einem CMS, das das Team selbst pflegt — ohne Dev-Tickets.",
    scene: "cms",
  },
  {
    n: "04",
    eyebrow: "KI-Assistent",
    title: "Assistent für repetitive Aufgaben",
    description:
      "Wiederkehrende Aufgaben übernimmt ein Assistent — in Ihren Tools.",
    scene: "assistant",
  },
];

export function Act2() {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef(0);
  const ready = useVideoScrub(videoRef, progressRef);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (isMobile()) {
        if (prefersReducedMotion()) return;
        gsap.utils.toArray<HTMLElement>(".act2-mobile-panel").forEach((el) => {
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

      // initial states: hide everything except bridge
      gsap.set(".phase-bridge", { opacity: 1, y: 0 });
      gsap.set(
        [
          ".phase-transform",
          ".phase-services-spotlight",
          ".svc-mod",
          ".phase-process-frame",
          ".phase-process-spotlight",
          ".station",
          ".proc-node",
          ".phase-solutions-frame",
          ".phase-solutions-dim",
          ".sol-text",
          ".sol-screen",
          ".sol-dot",
        ],
        { opacity: 0 }
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=600%",
          pin: true,
          scrub: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            progressRef.current = self.progress;
            scrubVideo(videoRef.current, ready, self.progress);
          },
        },
        defaults: { ease: "none" },
      });

      // -------- BRIDGE 0.00 – 0.10 --------
      tl.to(".phase-bridge", { opacity: 1, duration: 0.04 }, 0.0);
      tl.to(".phase-bridge", { opacity: 0, y: -20, duration: 0.04 }, 0.1);

      // -------- TRANSFORMATION 0.10 – 0.22 --------
      tl.fromTo(
        ".phase-transform",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.04 },
        0.1
      );
      tl.to(".phase-transform", { opacity: 0, y: -20, duration: 0.04 }, 0.22);

      // -------- SERVICES 0.22 – 0.46 --------
      // Local spotlight dims the background where the text reads.
      tl.fromTo(
        ".phase-services-spotlight",
        { opacity: 0 },
        { opacity: 1, duration: 0.025 },
        0.22
      );
      tl.to(".phase-services-spotlight", { opacity: 0, duration: 0.025 }, 0.455);

      // One module at a time, each centered, big. 0.06 per slot:
      // appear 0.008 → hold 0.044 → leave 0.008
      const svcSlots = [0.22, 0.28, 0.34, 0.40];
      svcSlots.forEach((t, i) => {
        tl.fromTo(
          `.svc-mod-${i}`,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.012 },
          t
        );
        // hold visible across most of its slot
        tl.to(`.svc-mod-${i}`, { opacity: 1, duration: 0.04 }, t + 0.012);
        tl.to(
          `.svc-mod-${i}`,
          { opacity: 0, y: -24, duration: 0.008 },
          t + 0.052
        );
      });

      // -------- PROCESS 0.46 – 0.66 --------
      tl.fromTo(
        ".phase-process-spotlight",
        { opacity: 0 },
        { opacity: 1, duration: 0.025 },
        0.46
      );
      tl.to(".phase-process-spotlight", { opacity: 0, duration: 0.025 }, 0.655);

      tl.fromTo(
        ".phase-process-frame",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.03 },
        0.46
      );

      // The horizontal progress line fills continuously across the process phase.
      // Mapped from 0.49 → 0.64 so the line starts after frame is up and ends
      // before the phase fades out — giving a clear "this is the full journey".
      tl.fromTo(
        ".proc-fill",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.15, ease: "none" },
        0.49
      );

      // Each station: content cross-fades + matching node activates + label brightens.
      // Slot length 0.04, four slots across 0.49 → 0.65.
      stations.forEach((_, i) => {
        const t = 0.49 + i * 0.04;
        tl.fromTo(
          `.station-${i}`,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.015 },
          t
        );
        // node grows in sync
        tl.fromTo(
          `.proc-node-${i}`,
          { opacity: 0, scale: 0 },
          { opacity: 1, scale: 1, duration: 0.015, ease: "back.out(1.6)" },
          t
        );
        // label brightens
        tl.to(
          `.proc-label-${i}`,
          { color: "rgba(255,255,255,0.95)", duration: 0.015 },
          t
        );
        // hold during slot
        tl.to(`.station-${i}`, { opacity: 1, duration: 0.02 }, t + 0.015);
        // out (except last station which stays a beat longer)
        if (i < stations.length - 1) {
          tl.to(
            `.station-${i}`,
            { opacity: 0, y: -16, duration: 0.012 },
            t + 0.028
          );
          // dim label back to muted state
          tl.to(
            `.proc-label-${i}`,
            { color: "rgba(255,255,255,0.55)", duration: 0.012 },
            t + 0.028
          );
        }
      });

      tl.to(".phase-process-frame", { opacity: 0, duration: 0.04 }, 0.66);

      // -------- SOLUTIONS 0.66 – 1.00 --------
      // Left-half dim that calms the background behind the text column.
      tl.fromTo(
        ".phase-solutions-dim",
        { opacity: 0 },
        { opacity: 1, duration: 0.03 },
        0.66
      );

      tl.fromTo(
        ".phase-solutions-frame",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.04 },
        0.66
      );

      const solStart = 0.70;
      const solGap = (1.0 - solStart) / solutions.length; // 0.075
      solutions.forEach((_, i) => {
        const t = solStart + i * solGap;
        // text + screen come in together
        tl.fromTo(
          [`.sol-text-${i}`, `.sol-screen-${i}`],
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.025 },
          t
        );
        tl.to([`.sol-text-${i}`, `.sol-screen-${i}`], { opacity: 1, duration: 0.025 }, t + 0.025);
        if (i < solutions.length - 1) {
          tl.to(
            [`.sol-text-${i}`, `.sol-screen-${i}`],
            { opacity: 0, y: -24, duration: 0.02 },
            t + solGap - 0.02
          );
        }
        // dot fills in
        tl.fromTo(
          `.sol-dot-${i}`,
          { opacity: 0, scaleX: 0 },
          { opacity: 1, scaleX: 1, duration: 0.025 },
          t
        );
      });
    }, root);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section ref={root} className="relative isolate overflow-hidden bg-ink-950">
      {/* DESKTOP — single pinned canvas with five phase overlays */}
      <div className="hidden md:block relative h-[100svh]">
        <CinematicVideo
          ref={videoRef}
          videoSrc={VIDEO_SRC}
          /* Start poster is the convergence frame (transition-bridge), not the
             chaos desk — avoids visual repetition with Act 1's ending and
             removes the perceived "laptop opening" motion artefact. */
          posterSrc={assets.transitionBridge.src!}
          endPosterSrc={assets.transformationNetwork.src!}
          className="absolute inset-0 -z-10"
        />

        {/* gentle vignette + bottom fade for legibility */}
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
            height: "32%",
            background: "linear-gradient(to top, rgba(5,8,18,0.55), transparent)",
          }}
        />

        {/* PHASE 1 — Bridge */}
        <div
          className="phase-bridge absolute inset-0 flex items-center justify-center will-change-transform"
          style={{ opacity: 1 }}
        >
          <div className="text-center">
            <span className="block font-mono text-[10px] uppercase tracking-[0.45em] text-mute-soft mb-4">
              Übergang
            </span>
            <h2 className="text-display-2 font-light text-white tracking-tighter2">
              <span className="text-white/60">Chaos</span>{" "}
              <span className="mx-2">→</span>{" "}
              <span className="text-gradient-accent">Struktur</span>
            </h2>
          </div>
        </div>

        {/* PHASE 2 — Transformation */}
        <div
          className="phase-transform absolute inset-0 flex items-center justify-center will-change-transform"
          style={{ opacity: 0 }}
        >
          <div className="text-center max-w-3xl px-8">
            <div className="chip chip-dot mx-auto mb-6">Transformation</div>
            <h2 className="text-display-1 font-semibold text-white tracking-tighter2">
              Aus Chaos<br />
              wird ein <span className="text-gradient-accent">System.</span>
            </h2>
            <p className="mt-6 text-lg text-mute leading-relaxed">
              Datenquellen werden verbunden, Entscheidungen automatisiert.
              Was entsteht, ist ein klares System — transparent und nachvollziehbar.
            </p>
          </div>
        </div>

        {/* PHASE 3 — Services
            Local spotlight calms the bright background; one big centered
            module at a time with a clear 01/04 counter.                  */}
        <div
          className="phase-services-spotlight pointer-events-none absolute inset-0"
          style={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(48% 48% at 50% 50%, transparent 28%, rgba(5,8,18,0.65) 90%)",
            }}
          />
        </div>

        {services.map((s, i) => (
          <div
            key={s.n}
            className={`svc-mod svc-mod-${i} absolute inset-0 flex items-center justify-center will-change-transform`}
            style={{ opacity: 0 }}
          >
            {/* Performance Stage — HUD frame with corner brackets.
                Dark glass center actually obscures the cyan background lines
                behind the content, so the title reads against a clean dark
                surface instead of competing with the video. */}
            <div className="relative max-w-2xl w-full mx-8">
              {/* dark glass backing */}
              <div className="absolute inset-0 rounded-3xl bg-ink-950/70 backdrop-blur-2xl border border-white/8" />

              {/* HUD corner brackets — cyan only as accent, never as text fill */}
              <span className="absolute top-0 left-0 h-7 w-7 border-l border-t border-accent/55 rounded-tl-3xl" />
              <span className="absolute top-0 right-0 h-7 w-7 border-r border-t border-accent/55 rounded-tr-3xl" />
              <span className="absolute bottom-0 left-0 h-7 w-7 border-l border-b border-accent/55 rounded-bl-3xl" />
              <span className="absolute bottom-0 right-0 h-7 w-7 border-r border-b border-accent/55 rounded-br-3xl" />

              {/* content */}
              <div className="relative px-10 py-12 text-center">
                <div className="flex items-center justify-center gap-3 mb-7 font-mono text-xs uppercase tracking-widest">
                  <span className="text-accent">{s.n}</span>
                  <span className="text-mute-soft">/ 04</span>
                  <span className="h-px w-12 bg-accent/50" />
                  <span className="text-mute-soft">Leistungen</span>
                </div>
                <h3 className="text-display-2 font-semibold text-white tracking-tighter2 leading-[1.02]">
                  {s.title}
                </h3>
                <p className="mt-6 text-lg md:text-xl text-white/85 leading-relaxed">
                  {s.tagline}
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                  {s.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-sm text-white/90"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* PHASE 4 — Process
            Local spotlight + bigger typography so the bright path lines
            in the background don't fight the captions.                */}
        <div
          className="phase-process-spotlight pointer-events-none absolute inset-0"
          style={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(50% 50% at 50% 50%, transparent 26%, rgba(5,8,18,0.6) 90%)",
            }}
          />
        </div>

        <div
          className="phase-process-frame absolute inset-0 flex items-center justify-center px-8"
          style={{ opacity: 0 }}
        >
          {/* System Readout — wider rectangular panel with three horizontal
              bands (top strip / main / timeline). Visually different from
              Services' spotlit pedestal, but same dark-glass + HUD vocabulary
              so it still feels like the same control room.                    */}
          <div className="relative w-full max-w-4xl">
            {/* dark glass backing */}
            <div className="absolute inset-0 rounded-2xl bg-ink-950/70 backdrop-blur-2xl border border-white/8" />

            {/* HUD corner brackets */}
            <span className="absolute top-0 left-0 h-7 w-7 border-l border-t border-accent/55 rounded-tl-2xl" />
            <span className="absolute top-0 right-0 h-7 w-7 border-r border-t border-accent/55 rounded-tr-2xl" />
            <span className="absolute bottom-0 left-0 h-7 w-7 border-l border-b border-accent/55 rounded-bl-2xl" />
            <span className="absolute bottom-0 right-0 h-7 w-7 border-r border-b border-accent/55 rounded-br-2xl" />

            {/* TOP STRIP — static identity bar */}
            <div className="relative flex items-center justify-between px-8 py-4 border-b border-white/8">
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest">
                <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_#5EE7FF]" />
                <span className="text-white/90">Der Prozess</span>
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-mute-soft">
                Vier Stationen
              </div>
            </div>

            {/* MAIN — content area, cross-fades per station */}
            <div className="relative h-72">
              {stations.map((s, i) => (
                <div
                  key={s.n}
                  className={`station station-${i} absolute inset-0 px-10 py-8 flex flex-col will-change-transform`}
                  style={{ opacity: 0 }}
                >
                  <div className="font-mono text-xs uppercase tracking-widest text-mute-soft mb-3">
                    Station {s.n} / 04
                  </div>
                  <h3 className="text-display-2 font-semibold text-white tracking-tighter2 leading-[1.0] mb-3">
                    {s.title}
                  </h3>
                  <p className="text-xl text-white/90 font-light leading-snug mb-3 max-w-2xl">
                    {s.headline}
                  </p>
                  <p className="text-base text-white/70 leading-relaxed max-w-2xl">
                    {s.description}
                  </p>
                  <div className="mt-auto pt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-mute-soft">
                    <span className="h-1 w-4 rounded-full bg-accent" />
                    Ergebnis: {s.deliverable}
                  </div>
                </div>
              ))}
            </div>

            {/* TIMELINE FOOTER — all four stations always visible, line fills */}
            <div className="relative px-10 pt-6 pb-7 border-t border-white/8">
              <div className="relative h-px bg-white/12">
                <div
                  className="proc-fill absolute inset-y-0 left-0 h-px bg-gradient-to-r from-accent to-accent-deep origin-left"
                  style={{ width: "100%", transform: "scaleX(0)" }}
                />
              </div>
              <div className="absolute inset-x-10 top-6 -translate-y-1/2 flex justify-between">
                {stations.map((s, i) => (
                  <div key={s.n} className="flex flex-col items-center">
                    <div className="relative h-4 w-4 rounded-full border border-white/25 bg-ink-950 flex items-center justify-center">
                      <span
                        className={`proc-node proc-node-${i} absolute inset-[3px] rounded-full bg-accent shadow-[0_0_12px_#5EE7FF]`}
                        style={{ opacity: 0, transform: "scale(0)" }}
                      />
                    </div>
                    <div className="mt-3 text-center">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-mute-soft">
                        {s.n}
                      </div>
                      <div
                        className={`proc-label proc-label-${i} mt-0.5 text-xs font-semibold text-white/55 whitespace-nowrap`}
                      >
                        {s.title}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PHASE 5 — Solutions
            Left-half dim makes the text readable against the lit
            background; product mockups stay luminous on the right. */}
        <div
          className="phase-solutions-dim pointer-events-none absolute inset-0"
          style={{ opacity: 0 }}
        >
          <div
            className="absolute inset-y-0 left-0 w-3/5"
            style={{
              background:
                "linear-gradient(to right, rgba(5,8,18,0.88) 0%, rgba(5,8,18,0.7) 30%, rgba(5,8,18,0.25) 70%, transparent 100%)",
            }}
          />
        </div>

        <div
          className="phase-solutions-frame absolute inset-0 grid grid-cols-12 gap-10 items-center px-12"
          style={{ opacity: 0 }}
        >
          <div className="col-span-5 relative h-[58vh]">
            <div className="absolute -top-2 left-0 chip chip-dot">Lösungen im Einsatz</div>
            {solutions.map((s, i) => (
              <div
                key={s.n}
                className={`sol-text sol-text-${i} absolute inset-0 flex flex-col justify-center`}
                style={{ opacity: 0 }}
              >
                <div className="flex items-center gap-3 mb-5 font-mono text-xs uppercase tracking-widest">
                  <span className="text-accent">{s.n}</span>
                  <span className="text-mute-soft">/ 04</span>
                  <span className="h-px w-10 bg-accent/60" />
                  <span className="text-mute-soft">{s.eyebrow}</span>
                </div>
                <h3 className="text-display-2 font-semibold text-white tracking-tighter2 leading-[1.05]">
                  {s.title}
                </h3>
                <span className="block h-px w-16 bg-gradient-to-r from-accent/60 to-transparent mt-6" />
                <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-md">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
          <div className="col-span-7 relative h-[62vh]">
            {solutions.map((s, i) => {
              const Scene = sceneByKey[s.scene];
              return (
                <div
                  key={s.n}
                  className={`sol-screen sol-screen-${i} absolute inset-0 flex items-center justify-center`}
                  style={{ opacity: 0 }}
                >
                  <ApplicationScene title={`${s.eyebrow} · live`}>
                    <Scene />
                  </ApplicationScene>
                </div>
              );
            })}
            <div className="absolute -bottom-6 left-0 right-0 flex items-center justify-center gap-2">
              {solutions.map((_, i) => (
                <span
                  key={i}
                  className="relative h-px w-12 overflow-hidden bg-white/15 rounded-full"
                >
                  <span
                    className={`sol-dot sol-dot-${i} absolute inset-0 bg-accent`}
                    style={{ transform: "scaleX(0)", transformOrigin: "left", opacity: 0 }}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE — 5 simple stacked panels, no pin, no scrub */}
      <div className="md:hidden">
        <MobilePanel posterAsset="transitionBridge">
          <span className="m-reveal block font-mono text-[10px] uppercase tracking-[0.45em] text-mute-soft mb-3">
            Übergang
          </span>
          <h2 className="m-reveal text-3xl font-light text-white tracking-tighter2">
            <span className="text-white/60">Chaos</span> →{" "}
            <span className="text-gradient-accent">Struktur</span>
          </h2>
        </MobilePanel>

        <MobilePanel posterAsset="transformationNetwork">
          <div className="m-reveal chip chip-dot mb-4">Transformation</div>
          <h2 className="m-reveal text-display-2 font-semibold text-white tracking-tighter2">
            Aus Chaos<br />
            wird ein <span className="text-gradient-accent">System.</span>
          </h2>
        </MobilePanel>

        <MobilePanel posterAsset="servicesScene">
          <div className="m-reveal chip chip-dot mb-4">Leistungen</div>
          <h2 className="m-reveal text-3xl font-semibold text-white tracking-tighter2 mb-6">
            Vier Module.<br />Ein System.
          </h2>
          <div className="space-y-4">
            {services.map((s) => (
              <div
                key={s.n}
                className="m-reveal rounded-xl border border-white/12 bg-ink-950/65 backdrop-blur-md px-4 py-4"
              >
                <div className="flex items-center gap-2 mb-2 font-mono text-xs uppercase tracking-widest">
                  <span className="text-accent">{s.n}</span>
                  <span className="text-mute-soft">/ 04</span>
                </div>
                <div className="text-lg font-semibold text-white leading-tight">
                  {s.title}
                </div>
                <p className="mt-2 text-sm text-mute leading-relaxed">{s.tagline}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/12 px-2 py-0.5 text-[10px] text-white/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </MobilePanel>

        <MobilePanel posterAsset="processPath">
          <div className="m-reveal chip chip-dot mb-4">Der Prozess</div>
          <h2 className="m-reveal text-3xl font-semibold text-white tracking-tighter2 mb-6">
            Vier Stationen.
          </h2>
          <div className="space-y-5">
            {stations.map((s) => (
              <div key={s.n} className="m-reveal">
                <div className="flex items-center gap-3 mb-2 font-mono text-xs uppercase tracking-widest">
                  <span className="text-accent">{s.n}</span>
                  <span className="text-mute-soft">/ 04</span>
                  <span className="h-px flex-1 bg-accent/60" />
                </div>
                <div className="text-xl font-semibold text-white leading-tight">
                  {s.title}
                </div>
                <p className="text-base text-white/85 mt-1">{s.headline}</p>
                <p className="text-sm text-mute mt-2 leading-relaxed">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </MobilePanel>

        <MobilePanel posterAsset="transformationNetwork">
          <div className="m-reveal chip chip-dot mb-4">Lösungen im Einsatz</div>
          <h2 className="m-reveal text-3xl font-semibold text-white tracking-tighter2 mb-6">
            Module live.
          </h2>
          <div className="space-y-10">
            {solutions.map((s) => {
              const Scene = sceneByKey[s.scene];
              return (
                <div key={s.n} className="m-reveal">
                  <div className="flex items-center gap-3 mb-2 font-mono text-xs uppercase tracking-widest">
                    <span className="text-accent">{s.n}</span>
                    <span className="text-mute-soft">/ 04</span>
                    <span className="text-mute-soft">{s.eyebrow}</span>
                  </div>
                  <div className="text-xl font-semibold text-white leading-tight">
                    {s.title}
                  </div>
                  <p className="text-sm text-mute mt-2 leading-relaxed">
                    {s.description}
                  </p>
                  <div className="mt-5">
                    <ApplicationScene title={`${s.eyebrow} · live`}>
                      <Scene />
                    </ApplicationScene>
                  </div>
                </div>
              );
            })}
          </div>
        </MobilePanel>
      </div>
    </section>
  );
}

function MobilePanel({
  posterAsset,
  children,
}: {
  posterAsset:
    | "transitionBridge"
    | "problemChaos"
    | "transformationNetwork"
    | "servicesScene"
    | "processPath";
  children: React.ReactNode;
}) {
  const a = assets[posterAsset];
  return (
    <div className="act2-mobile-panel relative min-h-[90svh] py-20 px-6 flex flex-col justify-center">
      {a.src && (
        <div className="absolute inset-0 -z-10">
          <Image src={a.src} alt="" fill sizes="100vw" className="object-cover" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(80% 70% at 50% 50%, rgba(5,8,18,0.3) 0%, rgba(5,8,18,0.6) 100%)",
            }}
          />
        </div>
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

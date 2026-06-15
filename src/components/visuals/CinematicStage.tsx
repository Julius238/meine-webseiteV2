"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, isMobile } from "@/lib/gsap";
import { assets, type AssetKey } from "@/lib/assets";

type Props = {
  slot: AssetKey;
  vignette?: number;
  fadeTop?: number;
  fadeBottom?: number;
  fadeBottomHeight?: number;
  fadeTopHeight?: number;
  parallaxZoom?: boolean;
  parallaxPan?: "left" | "right" | "none";
  tint?: "cyan" | "warm" | "violet" | "none";
  focal?: "center" | "left" | "right";
  className?: string;
  priority?: boolean;
};

/**
 * Full-bleed Higgsfield stage.
 *
 * Structure:
 *   <outer>   ← receives `className` only (no hardcoded position) so the
 *               caller fully controls how the stage is placed.
 *     <inner relative w-full h-full overflow-hidden>
 *       <stage-img absolute inset-0> <Image fill />
 *       overlays absolute inset-0
 *
 * NOTE: previously the outer hardcoded `relative overflow-hidden`. Combined
 * with callers passing `absolute inset-0 -z-10`, Tailwind v3's CSS source
 * order made `relative` win over `absolute` — wrapper collapsed to 0×0 and
 * the image was invisible. The inner positioning-context wrapper makes the
 * layout independent of whatever position class the caller picks.
 */
export function CinematicStage({
  slot,
  vignette = 0.25,
  fadeTop = 0,
  fadeBottom = 0.45,
  fadeBottomHeight = 0.35,
  fadeTopHeight = 0.25,
  parallaxZoom = true,
  parallaxPan = "none",
  tint = "none",
  focal = "center",
  className = "",
  priority = false,
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const a = assets[slot];

  useLayoutEffect(() => {
    if (isMobile()) return;
    const ctx = gsap.context(() => {
      if (parallaxZoom) {
        gsap.fromTo(
          ".stage-img",
          { scale: 1 },
          {
            scale: 1.06,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      }
      if (parallaxPan !== "none") {
        gsap.fromTo(
          ".stage-img",
          { xPercent: parallaxPan === "left" ? 1.5 : -1.5 },
          {
            xPercent: parallaxPan === "left" ? -2 : 2,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      }
    }, root);
    return () => ctx.revert();
  }, [parallaxZoom, parallaxPan]);

  const tintLayer = {
    none: "transparent",
    cyan: "radial-gradient(60% 50% at 50% 50%, rgba(94,231,255,0.06), transparent 70%)",
    warm: "radial-gradient(60% 50% at 50% 50%, rgba(255,120,80,0.06), transparent 70%)",
    violet:
      "radial-gradient(60% 50% at 50% 50%, rgba(123,80,255,0.06), transparent 70%)",
  }[tint];

  const objectPosition =
    focal === "left" ? "left center" : focal === "right" ? "right center" : "center";

  return (
    <div ref={root} className={className}>
      <div className="relative w-full h-full overflow-hidden">
        <div className="stage-img absolute inset-0">
          {a.src ? (
            <Image
              src={a.src}
              alt=""
              fill
              sizes="100vw"
              priority={priority}
              className="object-cover"
              style={{ objectPosition }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-ink-800 to-ink-950" />
          )}
        </div>

        {tint !== "none" && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: tintLayer }}
          />
        )}

        {vignette > 0 && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(80% 70% at 50% 50%, transparent 55%, rgba(5,8,18,${vignette}) 100%)`,
            }}
          />
        )}

        {fadeTop > 0 && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0"
            style={{
              height: `${fadeTopHeight * 100}%`,
              background: `linear-gradient(to bottom, rgba(5,8,18,${fadeTop}), transparent)`,
            }}
          />
        )}

        {fadeBottom > 0 && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0"
            style={{
              height: `${fadeBottomHeight * 100}%`,
              background: `linear-gradient(to top, rgba(5,8,18,${fadeBottom}), transparent)`,
            }}
          />
        )}
      </div>
    </div>
  );
}

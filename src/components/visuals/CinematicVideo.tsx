"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import Image from "next/image";

type Props = {
  videoSrc?: string;
  posterSrc: string;
  endPosterSrc?: string;
  className?: string;
  priority?: boolean;
  objectPosition?: string;
  /** Class applied to the poster image — Acts use this to target the
   *  always-on Ken-Burns animation that runs underneath the video. */
  posterClassName?: string;
  /**
   * Playback mode:
   *  - "scrub" (default): video stays paused; an external hook drives
   *    `currentTime` from scroll position. Used only for the Act 1 hero.
   *  - "loop": video autoplays as a muted, seamless ambient loop. No seeking,
   *    so it never stutters under scroll. Used for Act 2 / Act 3 where stability
   *    matters more than frame-exact scroll sync.
   * In both modes the underlying poster + its Ken-Burns animation is the
   * graceful fallback if the video errors or can't autoplay.
   */
  mode?: "scrub" | "loop";
};

/**
 * Scrub-able video stage with always-visible poster underneath.
 *
 * Layering (top to bottom):
 *   1. <video>   — only on desktop, only after mount (md viewport + isDesktop)
 *                  No `poster` attribute → element is transparent until the
 *                  first frame is actually decoded. The underlying Image is
 *                  what visitors see during loading, on slow connections, or
 *                  when scrub times out.
 *   2. <Image>   — poster. Targetable via posterClassName so Acts attach an
 *                  always-on Ken-Burns ScrollTrigger (graceful fallback).
 *
 * Mobile: video element renders WITHOUT `src` until isDesktop flips true.
 */
export const CinematicVideo = forwardRef<HTMLVideoElement, Props>(function CinematicVideo(
  {
    videoSrc,
    posterSrc,
    endPosterSrc,
    className = "",
    priority = false,
    objectPosition = "center",
    posterClassName = "",
    mode = "scrub",
  },
  ref
) {
  const [isDesktop, setIsDesktop] = useState(false);
  const innerRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Loop mode: kick off playback once the desktop src is attached. autoPlay +
  // muted + playsInline is allowed without a user gesture, but some browsers
  // still need an explicit play() after the src swaps in. We honour
  // prefers-reduced-motion by leaving the video paused — the static poster
  // then carries the section.
  useEffect(() => {
    if (mode !== "loop" || !isDesktop) return;
    const v = innerRef.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      return;
    }
    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };
    if (v.readyState >= 2) tryPlay();
    v.addEventListener("canplay", tryPlay);
    return () => v.removeEventListener("canplay", tryPlay);
  }, [mode, isDesktop, videoSrc]);

  // Expose the inner <video> both to the forwarded ref (scrub mode needs it)
  // and to our own ref (loop mode autoplay).
  const setVideoRef = (node: HTMLVideoElement | null) => {
    innerRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  const isLoop = mode === "loop";

  return (
    <div className={className}>
      <div className="relative w-full h-full overflow-hidden">
        <Image
          src={posterSrc}
          alt=""
          fill
          sizes="100vw"
          priority={priority}
          className={`object-cover will-change-transform ${posterClassName}`}
          style={{ objectPosition }}
        />

        {endPosterSrc && (
          <Image
            src={endPosterSrc}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-0 hidden md:block"
            data-end-poster
          />
        )}

        {videoSrc && (
          <video
            ref={setVideoRef}
            src={isDesktop ? videoSrc : undefined}
            muted
            autoPlay={isLoop}
            loop={isLoop}
            controls={false}
            playsInline
            preload="auto"
            // NO poster attribute on purpose — the underlying <Image> is the
            // poster and its Ken-Burns animation must be visible while video
            // buffers or if it never becomes scrub-ready.
            className="absolute inset-0 w-full h-full object-cover hidden md:block"
            style={{ objectPosition }}
            disablePictureInPicture
          />
        )}
      </div>
    </div>
  );
});

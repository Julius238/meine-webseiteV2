"use client";

import { forwardRef, useEffect, useState } from "react";
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
  },
  ref
) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

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
            ref={ref}
            src={isDesktop ? videoSrc : undefined}
            muted
            autoPlay={false}
            loop={false}
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

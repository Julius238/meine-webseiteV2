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
};

/**
 * Scrub-able video stage.
 *
 * IMPORTANT mobile note
 * ---------------------
 * The <video> element only receives `src` once we know the client viewport is
 * ≥ md (768px). On smaller screens the element renders without `src` so the
 * browser fetches ZERO video bytes — saves ~60 MB on phones. The poster
 * (Higgsfield still) is what visitors actually see on mobile anyway.
 */
export const CinematicVideo = forwardRef<HTMLVideoElement, Props>(function CinematicVideo(
  { videoSrc, posterSrc, endPosterSrc, className = "", priority = false, objectPosition = "center" },
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
          className="object-cover"
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
            // src is only set on desktop — keeps mobile from fetching 60MB:
            src={isDesktop ? videoSrc : undefined}
            muted
            autoPlay={false}
            loop={false}
            controls={false}
            playsInline
            preload="auto"
            poster={posterSrc}
            className="absolute inset-0 w-full h-full object-cover hidden md:block"
            style={{ objectPosition }}
            disablePictureInPicture
          />
        )}
      </div>
    </div>
  );
});

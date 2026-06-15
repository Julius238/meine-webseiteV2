"use client";

import { forwardRef } from "react";
import Image from "next/image";

type Props = {
  /** Final scrub video (mp4/webm). On mobile only the poster is shown. */
  videoSrc?: string;
  /** Always-present still — shown until video has loaded, and on mobile as fallback. */
  posterSrc: string;
  /** Optional: an "end frame" still that the desktop cross-fades onto after the video ends.
   *  Helps when the video's last second isn't quite the still we want to land on. */
  endPosterSrc?: string;
  className?: string;
  /** Pass-through priority for the poster image. */
  priority?: boolean;
  /** object-position for the poster image. */
  objectPosition?: string;
};

/**
 * Bare-bones scrub-able video stage.
 *
 * The PARENT controls the scroll-scrub via the forwarded ref:
 *
 *   const vidRef = useRef<HTMLVideoElement>(null);
 *   ...
 *   <CinematicVideo ref={vidRef} videoSrc="..." posterSrc="..." />
 *   ...
 *   ScrollTrigger.create({
 *     ...
 *     onUpdate: (self) => {
 *       const v = vidRef.current;
 *       if (v && v.duration) v.currentTime = self.progress * v.duration;
 *     }
 *   });
 *
 * Important:
 *  - video is muted + playsinline + preload="auto" → satisfies browser scrubbing rules
 *  - we never call .play(); only currentTime is driven by scroll
 *  - poster is rendered behind via <Image> so first paint shows the still before the video buffers
 */
export const CinematicVideo = forwardRef<HTMLVideoElement, Props>(function CinematicVideo(
  { videoSrc, posterSrc, endPosterSrc, className = "", priority = false, objectPosition = "center" },
  ref
) {
  return (
    <div className={className}>
      <div className="relative w-full h-full overflow-hidden">
        {/* Poster always paints first (and is the only visual on mobile) */}
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
            src={videoSrc}
            muted
            playsInline
            preload="auto"
            poster={posterSrc}
            className="absolute inset-0 w-full h-full object-cover hidden md:block"
            style={{ objectPosition }}
            // Avoid right-click controls; this is a backdrop element.
            disablePictureInPicture
          />
        )}
      </div>
    </div>
  );
});

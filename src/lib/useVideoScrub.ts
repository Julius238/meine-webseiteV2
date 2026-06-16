"use client";

import { useEffect, useRef, type RefObject } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Toggle in DevTools without rebuild:
 *   window.__VIDEO_SCRUB_DEBUG__ = true
 */
const debug = () =>
  typeof window !== "undefined" &&
  (window as unknown as { __VIDEO_SCRUB_DEBUG__?: boolean })
    .__VIDEO_SCRUB_DEBUG__ === true;

const log = (label: string, ...rest: unknown[]) => {
  if (debug()) console.log(`[scrub:${label}]`, ...rest);
};

/**
 * Stable video-scrub bootstrap.
 *
 * Why this hook exists
 * --------------------
 * The naive pattern (pin a section, set `video.currentTime = self.progress *
 * v.duration` in ScrollTrigger's `onUpdate`) is fragile because:
 *
 *   1. On reload the browser may restore the scroll position BEFORE the video
 *      has loaded its metadata. ScrollTrigger fires `onUpdate` once with the
 *      restored progress, but `v.duration = NaN` so the guard skips. After
 *      the metadata finally arrives, nothing forces a re-sync — the video
 *      stays on frame 0 even though the user is mid-section.
 *
 *   2. `loadedmetadata` is not a hard guarantee: `readyState` can still be 0
 *      and `duration` can still be `Infinity` / `0` / `NaN` momentarily.
 *
 *   3. `preload="auto"` is a hint; some browsers defer until the element is
 *      visible. Calling `video.load()` explicitly forces the issue.
 *
 * What this hook does
 * -------------------
 *  - Listens to `loadedmetadata`, `loadeddata`, `canplay`, and `error`.
 *  - Tries to flip the `ready` ref to `true` only when:
 *      - `duration` is a finite positive number
 *      - `readyState >= HAVE_METADATA (1)`
 *  - On readiness it does ONE forced sync: reads the latest scroll progress
 *    via the supplied `progressRef`, sets `currentTime` once, and refreshes
 *    ScrollTrigger so its pin spacing is up to date.
 *  - Calls `video.load()` if the video hasn't started buffering yet.
 *
 * What the CALLER does
 * --------------------
 * In its ScrollTrigger config:
 *
 *   onUpdate: (self) => {
 *     progressRef.current = self.progress;        // remember for re-sync
 *     scrubVideo(videoRef.current, ready, self.progress);
 *   }
 *
 * `scrubVideo` is exported below — it is the single safe writer of
 * `currentTime`. The ready guard plus the try/catch around the write make it
 * impossible for a bad seek to break the section.
 */
export function useVideoScrub(
  videoRef: RefObject<HTMLVideoElement | null>,
  progressRef: RefObject<number>
) {
  const ready = useRef(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const isReady = () =>
      Number.isFinite(v.duration) && v.duration > 0 && v.readyState >= 1;

    const trySync = (reason: string) => {
      if (ready.current) return;
      if (!isReady()) {
        log("not-ready", reason, {
          duration: v.duration,
          readyState: v.readyState,
        });
        return;
      }
      ready.current = true;
      try {
        v.pause();
        const p = Math.max(0, Math.min(1, progressRef.current ?? 0));
        v.currentTime = Math.min(p * v.duration, v.duration - 0.05);
        log("ready", reason, {
          duration: v.duration,
          progress: p,
          currentTime: v.currentTime,
        });
      } catch (e) {
        log("sync-error", e);
      }
      // Refresh ScrollTrigger so any pin-spacing that may have been computed
      // before the video's intrinsic dimensions were known is recalculated.
      ScrollTrigger.refresh();
    };

    const onMeta = () => trySync("loadedmetadata");
    const onData = () => trySync("loadeddata");
    const onCanPlay = () => trySync("canplay");
    const onError = () => {
      // Don't flip `ready`. The poster stays visible, the section degrades
      // gracefully to a static image. Logging only.
      log("video-error", { code: v.error?.code, message: v.error?.message });
    };

    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("loadeddata", onData);
    v.addEventListener("canplay", onCanPlay);
    v.addEventListener("error", onError);

    // If the video was served from cache and is already past metadata, do
    // the sync immediately (no event will fire for already-loaded media).
    if (isReady()) {
      trySync("already-ready");
    } else if (v.readyState === 0) {
      // preload="auto" is only a hint; some browsers defer. Force it.
      try {
        v.load();
      } catch (e) {
        log("load-error", e);
      }
    }

    return () => {
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("loadeddata", onData);
      v.removeEventListener("canplay", onCanPlay);
      v.removeEventListener("error", onError);
    };
  }, [videoRef, progressRef]);

  return ready;
}

/**
 * Safe scrub writer. Use inside `onUpdate`. Drops the write silently when the
 * video isn't ready yet — but the caller should keep updating `progressRef`
 * so the hook can do its forced first-sync as soon as the video catches up.
 */
export function scrubVideo(
  v: HTMLVideoElement | null,
  ready: RefObject<boolean>,
  progress: number
) {
  if (!v) return;
  if (!ready.current) return;
  const d = v.duration;
  if (!Number.isFinite(d) || d <= 0) return;
  const p = progress < 0 ? 0 : progress > 1 ? 1 : progress;
  try {
    v.currentTime = Math.min(p * d, d - 0.05);
  } catch {
    // Browser refused the seek (e.g. mid-buffer). Skipping is safe.
  }
}

"use client";

import { useEffect, useRef, type RefObject } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/* ─── debug ──────────────────────────────────────────────────────────────── */

/** Compile-time flag — flip to true and rebuild to enable logs everywhere. */
const DEBUG_VIDEO = false;

const debugOn = () =>
  DEBUG_VIDEO ||
  (typeof window !== "undefined" &&
    (window as unknown as { __VIDEO_SCRUB_DEBUG__?: boolean })
      .__VIDEO_SCRUB_DEBUG__ === true);

const log = (label: string, ...rest: unknown[]) => {
  if (debugOn()) console.log(`[scrub:${label}]`, ...rest);
};

/* ─── config ─────────────────────────────────────────────────────────────── */

/** How long to wait for the video to become scrub-ready before giving up. */
const READY_TIMEOUT_MS = 3500;

/** Min ΔcurrentTime we bother to write (≈ one 30fps frame). */
const FRAME_EPSILON = 1 / 30;

export type ScrubStatus = "pending" | "ready" | "fallback";

/* ─── hook ───────────────────────────────────────────────────────────────── */

/**
 * Stable video-scrub bootstrap with timeout fallback.
 *
 * State machine:
 *   "pending"  → waiting for video metadata + canplay
 *   "ready"    → scrubbing wired up, currentTime synced to scroll
 *   "fallback" → video didn't become scrub-ready within READY_TIMEOUT_MS
 *                (or errored). The poster Ken-Burns animation that runs in
 *                parallel keeps the section visually alive.
 *
 * The state only ever transitions once. After "ready" or "fallback" it stays.
 *
 * onResolve fires once with the final status — Acts can use it to log/warn
 * but don't need to reshape their layout (the always-on poster animation
 * already provides a graceful fallback visual).
 */
export function useVideoScrub(
  videoRef: RefObject<HTMLVideoElement | null>,
  progressRef: RefObject<number>,
  onResolve?: (status: ScrubStatus) => void
) {
  const ready = useRef(false);
  const status = useRef<ScrubStatus>("pending");

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    let timeoutId: number | null = null;
    let resolved = false;

    const isReady = () =>
      Number.isFinite(v.duration) && v.duration > 0 && v.readyState >= 1;

    const resolve = (next: ScrubStatus) => {
      if (resolved) return;
      resolved = true;
      status.current = next;
      ready.current = next === "ready";
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (next === "ready") {
        try {
          v.pause();
          const p = Math.max(0, Math.min(1, progressRef.current ?? 0));
          v.currentTime = Math.min(p * v.duration, v.duration - 0.05);
          log("resolved-ready", {
            duration: v.duration,
            progress: p,
            currentTime: v.currentTime,
          });
        } catch (e) {
          log("sync-error", e);
        }
        // After the video's intrinsic dimensions are settled the pin spacing
        // may need to recompute. Cheap and idempotent.
        ScrollTrigger.refresh();
      } else {
        log("resolved-fallback", {
          duration: v.duration,
          readyState: v.readyState,
          waitedMs: READY_TIMEOUT_MS,
        });
      }
      onResolve?.(next);
    };

    const trySync = (reason: string) => {
      log("event", reason, {
        readyState: v.readyState,
        duration: v.duration,
      });
      if (isReady()) resolve("ready");
    };

    const onMeta = () => trySync("loadedmetadata");
    const onData = () => trySync("loadeddata");
    const onCanPlay = () => trySync("canplay");
    const onCanPlayThrough = () => trySync("canplaythrough");
    const onError = () => {
      log("error", { code: v.error?.code, message: v.error?.message });
      resolve("fallback");
    };
    const onStalled = () => log("stalled");
    const onWaiting = () => log("waiting");

    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("loadeddata", onData);
    v.addEventListener("canplay", onCanPlay);
    v.addEventListener("canplaythrough", onCanPlayThrough);
    v.addEventListener("error", onError);
    v.addEventListener("stalled", onStalled);
    v.addEventListener("waiting", onWaiting);

    // If the video was already in cache and is past metadata, sync now.
    if (isReady()) {
      trySync("already-ready");
    } else if (v.readyState === 0) {
      // preload="auto" is only a hint; force the request.
      try {
        v.load();
      } catch (e) {
        log("load-error", e);
      }
    }

    // Hard timeout — if we're still pending after READY_TIMEOUT_MS the section
    // degrades to its always-on poster Ken-Burns animation. The page is never
    // left static.
    timeoutId = window.setTimeout(() => {
      if (!resolved) resolve("fallback");
    }, READY_TIMEOUT_MS);

    return () => {
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("loadeddata", onData);
      v.removeEventListener("canplay", onCanPlay);
      v.removeEventListener("canplaythrough", onCanPlayThrough);
      v.removeEventListener("error", onError);
      v.removeEventListener("stalled", onStalled);
      v.removeEventListener("waiting", onWaiting);
      if (timeoutId !== null) clearTimeout(timeoutId);
    };
  }, [videoRef, progressRef, onResolve]);

  return { ready, status };
}

/* ─── safe scrub writer ──────────────────────────────────────────────────── */

/**
 * Safe `video.currentTime` setter. Use inside ScrollTrigger.onUpdate.
 *
 * Drops the write silently if:
 *  - video not ready
 *  - duration is not a finite positive number
 *  - a previous seek is still in flight (v.seeking)
 *  - target time is within one frame of the current frame (avoids hammering)
 *  - the browser rejects the seek (e.g. mid-buffer)
 */
export function scrubVideo(
  v: HTMLVideoElement | null,
  ready: RefObject<boolean>,
  progress: number
) {
  if (!v || !ready.current) return;
  const d = v.duration;
  if (!Number.isFinite(d) || d <= 0) return;
  if (v.seeking) return;

  const p = progress < 0 ? 0 : progress > 1 ? 1 : progress;
  const target = Math.min(p * d, d - 0.05);
  if (Math.abs(v.currentTime - target) < FRAME_EPSILON) return;

  try {
    v.currentTime = target;
  } catch {
    // Safe to ignore — next onUpdate will retry.
  }
}

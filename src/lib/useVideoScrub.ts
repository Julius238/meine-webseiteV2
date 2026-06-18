"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
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

/**
 * Smoothing factor of the rAF driver: each frame the playhead moves this
 * fraction of the remaining distance toward the scroll target. Lower = softer
 * trailing, higher = tighter to the scroll. ~0.2 gives a calm ~150 ms catch-up.
 */
const EASE = 0.2;

/** When eased playhead is within this many seconds of target, snap & treat as settled. */
const SNAP_SECONDS = 0.01;

/** Stop the rAF loop after this many consecutive settled frames (re-armed by wake()). */
const IDLE_FRAMES = 12;

export type ScrubStatus = "pending" | "ready" | "fallback";

/* ─── hook ───────────────────────────────────────────────────────────────── */

/**
 * Scroll-synced video scrubbing — throttled & smoothed.
 *
 * Readiness state machine:
 *   "pending"  → waiting for video metadata + canplay
 *   "ready"    → scrubbing wired up, currentTime synced to scroll
 *   "fallback" → video didn't become scrub-ready within READY_TIMEOUT_MS
 *                (or errored). The poster Ken-Burns animation that runs in
 *                parallel keeps the section visually alive.
 * The state only ever transitions once. After "ready" or "fallback" it stays.
 *
 * Scrubbing model (the important part):
 *   ScrollTrigger.onUpdate writes the *target* progress into `progressRef` and
 *   calls the returned `wake()`. It DOES NOT seek the video. A single
 *   requestAnimationFrame loop owns all seeking:
 *     - it eases an internal playhead toward `progress * duration`
 *     - it only writes `video.currentTime` when the delta is worth a frame AND
 *       no previous seek is still in flight (`video.seeking`)
 *     - it sleeps itself once the playhead has settled, so a parked scroll
 *       costs nothing and three Acts never thrash the decoder in parallel
 *
 * Result: scrolling forward runs the clip forward, scrolling back runs it
 * backward, and stopping the scroll stops the video — without hammering
 * currentTime on every scroll tick.
 */
export function useVideoScrub(
  videoRef: RefObject<HTMLVideoElement | null>,
  progressRef: RefObject<number>,
  onResolve?: (status: ScrubStatus) => void
) {
  const ready = useRef(false);
  const status = useRef<ScrubStatus>("pending");
  // Stable handle the rAF driver installs; `wake` below forwards to it.
  const wakeImpl = useRef<() => void>(() => {});

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    let timeoutId: number | null = null;
    let resolved = false;

    /* ── rAF smoothing driver ──────────────────────────────────────────── */
    let raf = 0;
    let running = false;
    let primed = false; // playhead initialised to the live scroll position?
    let eased = 0; // internal, smoothed playhead (seconds)
    let idle = 0;

    const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

    const frame = () => {
      // Default to "settled": if the video isn't scrub-ready (still loading or
      // fell back to the poster) we must still let the loop fall asleep, else
      // it would spin forever. A fresh wake() / resolve("ready") re-arms it.
      let settled = true;
      const d = v.duration;

      if (ready.current && Number.isFinite(d) && d > 0) {
        const target = Math.min(clamp01(progressRef.current ?? 0) * d, d - 0.05);

        // On first run after a wake, jump to the current scroll position
        // instead of sweeping in from wherever we left off.
        if (!primed) {
          eased = target;
          primed = true;
        }

        const diff = target - eased;
        if (Math.abs(diff) < SNAP_SECONDS) {
          eased = target;
        } else {
          eased += diff * EASE;
        }

        // Throttle: skip while a seek is still resolving, and only seek when the
        // change is at least ~one frame. This caps writes at the decoder's seek
        // rate rather than once per scroll event.
        if (!v.seeking && Math.abs(v.currentTime - eased) > FRAME_EPSILON) {
          try {
            v.currentTime = eased;
          } catch {
            // mid-buffer rejection — next frame retries
          }
        }

        settled =
          Math.abs(target - eased) < SNAP_SECONDS &&
          (v.seeking || Math.abs(v.currentTime - target) < FRAME_EPSILON);
      }

      idle = settled ? idle + 1 : 0;

      if (idle > IDLE_FRAMES) {
        running = false;
        raf = 0;
        return; // sleep until the next wake()
      }
      raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      idle = 0;
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    wakeImpl.current = wake;

    /* ── readiness state machine ───────────────────────────────────────── */
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
          const p = clamp01(progressRef.current ?? 0);
          v.currentTime = Math.min(p * v.duration, v.duration - 0.05);
          // Seed the driver's playhead and kick one pass so the first frame
          // already matches the scroll position.
          eased = v.currentTime;
          primed = true;
          log("resolved-ready", {
            duration: v.duration,
            progress: p,
            currentTime: v.currentTime,
          });
        } catch (e) {
          log("sync-error", e);
        }
        wake();
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
      log("event", reason, { readyState: v.readyState, duration: v.duration });
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
    // degrades to its always-on poster Ken-Burns animation. Never left static.
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
      if (raf) cancelAnimationFrame(raf);
      running = false;
      wakeImpl.current = () => {};
    };
  }, [videoRef, progressRef, onResolve]);

  /** Nudge the rAF driver awake — call from ScrollTrigger.onUpdate after
   *  writing the new progress into `progressRef`. Cheap & idempotent. */
  const wake = useCallback(() => wakeImpl.current(), []);

  return { ready, status, wake };
}

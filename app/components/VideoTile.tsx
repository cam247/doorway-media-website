"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Video tile — the footage itself is the content. No poster image.
 *
 * Two IntersectionObservers, doing deliberately different jobs:
 *
 *   1. `armed` (rootMargin 400px) decides when to attach `src`.
 *   2. `inView` decides when to play. Off-screen tiles are paused.
 *
 * Important for phones: never put this under a Framer `transform` animation.
 * iOS Safari composites those as a blank layer until the user taps — which is
 * why grey boxes used to clear only after opening the lightbox (a portal).
 */
export default function VideoTile({
  src,
  eager = false,
  paused = false,
  loop = true,
  onEnded,
  className = "",
}: {
  src?: string;
  eager?: boolean;
  paused?: boolean;
  loop?: boolean;
  onEnded?: () => void;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const [armed, setArmed] = useState(eager);
  const [inView, setInView] = useState(eager);

  const shouldPlay = Boolean(
    armed && inView && !reduceMotion && !paused && src
  );

  useEffect(() => {
    if (armed || !src) return;
    const el = wrapRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armed, src]);

  useEffect(() => {
    if (!src) return;
    const el = wrapRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      /* Low threshold so a partially-visible phone card still starts. */
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !armed) return;

    if (shouldPlay) {
      const tryPlay = () => {
        v.muted = true;
        const p = v.play();
        if (p) p.catch(() => {});
      };
      tryPlay();
      v.addEventListener("canplay", tryPlay);
      return () => v.removeEventListener("canplay", tryPlay);
    }

    v.pause();
  }, [armed, shouldPlay]);

  /*
   * Force a decoded frame even when paused / reduced-motion. iOS often leaves
   * preload=metadata videos black until something seeks or plays.
   */
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !armed) return;

    const paint = () => {
      if (v.readyState < 2) return;
      try {
        if (v.currentTime < 0.05) v.currentTime = 0.05;
      } catch {
        /* not seekable yet */
      }
    };

    v.addEventListener("loadeddata", paint);
    v.addEventListener("canplay", paint);
    paint();
    return () => {
      v.removeEventListener("loadeddata", paint);
      v.removeEventListener("canplay", paint);
    };
  }, [armed, src]);

  return (
    <div ref={wrapRef} className={`absolute inset-0 bg-surface ${className}`}>
      {src && (
        <video
          ref={videoRef}
          src={armed ? src : undefined}
          preload={shouldPlay ? "auto" : "metadata"}
          muted
          autoPlay={shouldPlay}
          loop={loop}
          onEnded={onEnded}
          playsInline
          tabIndex={-1}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}

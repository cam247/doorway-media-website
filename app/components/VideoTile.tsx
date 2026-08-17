"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Video tile — the footage itself is the content. No poster image.
 *
 * Two IntersectionObservers, doing deliberately different jobs:
 *
 *   1. `armed` (rootMargin 400px) decides when to attach `src`. A tile the
 *      visitor never scrolls near downloads nothing at all. This is the only
 *      thing standing between this page and ~2GB of video per visit, given how
 *      large the source files are.
 *   2. `inView` (threshold 0.25) decides when to actually play. Off-screen
 *      tiles are paused, so only what's on screen is ever decoding.
 *
 * `prefers-reduced-motion` attaches the source but never plays it, which leaves
 * the first frame on screen as a still — the visitor still sees real footage
 * rather than a blank panel (`reduced-motion`, HIGH).
 *
 * The <video> is aria-hidden: every tile has a visible text heading next to it,
 * so announcing the decorative loop as well would just be noise.
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
  /** Skip the proximity wait — for above-the-fold heroes. */
  eager?: boolean;
  /**
   * Hold this tile still regardless of visibility. The grids set it while the
   * full-screen player is open, so the tile behind the overlay is not competing
   * with it for bandwidth and decode.
   */
  paused?: boolean;
  /**
   * Turn this off where the clip hands over to another one when it finishes: a
   * looping element restarts silently and never fires `ended`.
   */
  loop?: boolean;
  onEnded?: () => void;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const [armed, setArmed] = useState(eager);
  const [inView, setInView] = useState(eager);

  /* 1. Attach the source once the tile is within 400px of the viewport. */
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

  /* 2. Play only while genuinely on screen. */
  useEffect(() => {
    if (!src) return;
    const el = wrapRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  /* Drives playback. Runs after render, so `src` is committed before play(). */
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !armed) return;

    if (inView && !reduceMotion && !paused) {
      // play() is what starts the fetch; rejection is normal (hidden tab, etc).
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [armed, inView, paused, reduceMotion]);

  /*
   * iOS Safari (and some Android WebViews) leave a <video> black until it has
   * played or been seeked — preload="metadata" alone is not enough. Nudge to a
   * hair past zero once data is ready so a paused / reduced-motion tile still
   * shows a real frame instead of an empty grey box.
   */
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !armed) return;

    const paint = () => {
      if (v.readyState < 2) return;
      try {
        if (v.currentTime < 0.05) v.currentTime = 0.05;
      } catch {
        /* Ignore seek errors before the media is seekable. */
      }
    };

    v.addEventListener("loadeddata", paint);
    paint();
    return () => v.removeEventListener("loadeddata", paint);
  }, [armed, src]);

  return (
    <div ref={wrapRef} className={`absolute inset-0 bg-surface ${className}`}>
      {src && (
        <video
          ref={videoRef}
          src={armed ? src : undefined}
          // metadata is enough to paint the first frame without pulling the
          // whole file; play() escalates it when the tile comes into view.
          preload="metadata"
          muted
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

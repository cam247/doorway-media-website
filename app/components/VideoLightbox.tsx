"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { DUR_EXIT, EASE } from "@/app/lib/motion";
import type { Project } from "@/app/lib/projects";

/**
 * Full-screen video player. Clicking any project tile lands here, playing the
 * complete file from public/ with native controls — scrub, volume, fullscreen.
 *
 * Rendered into document.body via a portal rather than in place. Two reasons:
 * the grids sit inside animating `motion.div`s, and `position: fixed` resolves
 * against a transformed ancestor rather than the viewport; and the tiles live
 * under `overflow-hidden` rounded cards that would clip it.
 *
 * Dialog behaviour, per the UX rules the rest of the site follows:
 *   `escape-routes`        — Escape, the close button, and a backdrop click all exit.
 *   `focus-states`         — focus moves into the dialog, is trapped inside it while
 *                            open, and returns to the tile that opened it on close.
 *   `keyboard-navigation`  — ← / → step between projects in the same grid.
 *   `touch-friendly`       — every control is a 44x44 target.
 *
 * The tiles behind this are paused by the grid while it is open, so exactly one
 * video is decoding at a time.
 */
export default function VideoLightbox({
  project,
  onClose,
  onPrev,
  onNext,
}: {
  /** The project to play, or null when closed. */
  project: Project | null;
  onClose: () => void;
  /** Omitted when the grid holds a single project. */
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const open = project !== null;

  /* Portals need a DOM to target, so nothing renders on the server pass. */
  useEffect(() => setMounted(true), []);

  /* Remember what opened us, and hand focus back on the way out. */
  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    return () => returnFocusRef.current?.focus?.();
  }, [open]);

  /* Move focus in, so Escape and the trap have something to work with. */
  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
  }, [open]);

  /* The page behind must not scroll under a full-screen overlay. */
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  /**
   * Autoplay on open, and again on every step to a new project. The click that
   * opened the dialog is the user gesture that permits sound; if a browser
   * refuses anyway the native controls are right there, so the rejection is
   * swallowed rather than surfaced.
   */
  useEffect(() => {
    if (!project) return;
    videoRef.current?.play().catch(() => {});
  }, [project]);

  const trapTab = useCallback((e: KeyboardEvent) => {
    const panel = panelRef.current;
    if (!panel) return;
    const focusable = panel.querySelectorAll<HTMLElement>("button, video");
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (e.shiftKey && (active === first || active === panel)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        trapTab(e);
        return;
      }
      // While the player itself is focused the arrows are its own — native
      // controls seek 5s per press, and stealing that would be worse than
      // losing the shortcut. Stepping projects applies everywhere else.
      if (document.activeElement === videoRef.current) return;
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, onPrev, onNext, trapTab]);

  /** Only a click on the backdrop itself closes — not one that bubbled up. */
  const onBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DUR_EXIT, ease: EASE }}
          /* 60 — modal tier, above the z-50 sticky nav. */
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md"
        >
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} — full video`}
            tabIndex={-1}
            className="on-media flex h-full flex-col outline-none"
          >
            {/* Title block stays as spare here as it is on the tile: category,
                title, and the credit — the one place detail belongs, since the
                tiles themselves carry nothing but a name. */}
            <header className="shrink-0 px-5 py-4 md:px-8 md:py-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="eyebrow text-gold-bright">{project.category}</p>
                  <h2 className="display-lg mt-1.5 truncate text-2xl text-on-media md:text-4xl">
                    {project.title}
                  </h2>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {onPrev && onNext && (
                    <>
                      <button
                        type="button"
                        onClick={onPrev}
                        aria-label="Previous project"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-on-media transition-colors hover:bg-white/20"
                      >
                        <ChevronLeft aria-hidden="true" className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={onNext}
                        aria-label="Next project"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-on-media transition-colors hover:bg-white/20"
                      >
                        <ChevronRight aria-hidden="true" className="h-5 w-5" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close video"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-white/15 text-on-media transition-colors hover:bg-white/25"
                  >
                    <X aria-hidden="true" className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {project.credit && (
                /*
                  Its own row under the title rather than beside it: on a phone
                  the three 44px controls leave the title column barely 180px,
                  and the credit came apart into ragged lines in the gap.

                  Each pair is kept whole so a wrap can only ever fall between
                  "Production: …" and "Role: …", and the dot that joins them is
                  desktop-only — once they stack it would sit orphaned at the
                  head of the second line. Labels run a step quieter than their
                  values so the line reads as a credit and doesn't compete with
                  the title above it.
                */
                <p className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-on-media-muted md:text-base">
                  <span className="whitespace-nowrap">
                    <span className="text-white/55">Production:</span>{" "}
                    {project.credit.production}
                  </span>
                  <span aria-hidden="true" className="hidden text-white/30 md:inline">
                    ·
                  </span>
                  <span className="whitespace-nowrap">
                    <span className="text-white/55">Role:</span>{" "}
                    {project.credit.role}
                  </span>
                </p>
              )}
            </header>

            {/* min-h-0 lets the stage shrink so the video is capped by the
                viewport rather than overflowing it. */}
            <div
              onClick={onBackdropClick}
              className="flex min-h-0 flex-1 items-center justify-center px-3 pb-5 md:px-8 md:pb-8"
            >
              <video
                /* Remount on step: a fresh element beats swapping src on a
                   playing one, which leaves the old buffer mid-download. */
                key={project.id}
                ref={videoRef}
                src={project.video}
                controls
                autoPlay
                playsInline
                preload="auto"
                className="max-h-full max-w-full rounded-2xl bg-black shadow-2xl"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

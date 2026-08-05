"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import VideoTile from "@/app/components/VideoTile";
import VideoLightbox from "@/app/components/VideoLightbox";
import type { Project } from "@/app/lib/projects";
import { reveal, stagger, VIEWPORT } from "@/app/lib/motion";

/**
 * A grid of project tiles and nothing else — no service blurbs, no descriptive
 * paragraph over the footage. `visual-hierarchy`: the work is the message, and a
 * paragraph laid over a clip competes with the very thing it describes.
 *
 * Each tile holds a still frame until it is hovered or focused, then previews;
 * clicking opens the complete file in the full-screen player. The whole tile is
 * a <button>, not a link — it opens a dialog rather than navigating, so a button
 * is the honest element and keyboard support comes free.
 *
 * Shared by the category pages (through `ProjectGrid`) and by the homepage Work
 * section, so a tile looks and behaves identically wherever it turns up. Layout
 * spacing is deliberately left to the caller; this owns the grid, not its margins.
 */

function ProjectCard({
  project,
  index,
  lightboxOpen,
  onOpen,
}: {
  project: Project;
  index: number;
  lightboxOpen: boolean;
  onOpen: () => void;
}) {
  const [previewing, setPreviewing] = useState(false);

  return (
    <motion.article
      custom={index}
      variants={reveal}
      /* pointerenter, not mouseenter, so a touch tap doesn't start a preview
         it can never end. Focus mirrors hover for keyboard users. */
      onPointerEnter={(e) => e.pointerType !== "touch" && setPreviewing(true)}
      onPointerLeave={() => setPreviewing(false)}
      onFocus={() => setPreviewing(true)}
      onBlur={() => setPreviewing(false)}
      className="card group relative aspect-video overflow-hidden rounded-3xl"
    >
      {/*
        The tile arms its source on scroll proximity either way, so the first
        frame is painted and ready — `paused` only gates playback. It also stays
        paused while the player is open, so exactly one video decodes at a time.
      */}
      <VideoTile src={project.video} paused={!previewing || lightboxOpen} />

      {/* z-20: media overlay tier. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-20 bg-gradient-to-t from-black/85 via-black/25 to-black/5"
      />

      <button
        type="button"
        onClick={onOpen}
        aria-label={`Play ${project.title}`}
        className="on-media absolute inset-0 z-20 flex flex-col justify-end p-5 text-left md:p-6"
      >
        {/* Affordance: says "this plays" without a line of copy saying so. */}
        <span
          aria-hidden="true"
          className="glass-strong absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110"
        >
          <Play className="h-4 w-4 translate-x-px text-fg" fill="currentColor" />
        </span>

        <span className="display-lg text-2xl text-on-media md:text-3xl">
          {project.title}
        </span>
      </button>
    </motion.article>
  );
}

export default function ProjectGallery({ projects }: { projects: Project[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  /**
   * Columns follow the count. A category holding one clip (drone, today) gets a
   * single full-width tile rather than a lone card stranded in a three-up grid.
   */
  const columns =
    projects.length === 1
      ? "grid-cols-1"
      : projects.length === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  /** Stepping wraps, and is only offered when there is somewhere to step. */
  const step = (delta: number) =>
    setOpenIndex((i) =>
      i === null ? null : (i + delta + projects.length) % projects.length
    );

  if (projects.length === 0) {
    /* A category whose folder is still empty. Better an honest invitation than a
       grid of placeholder cards pretending to be projects. */
    return (
      <div className="card rounded-3xl px-6 py-16 text-center">
        <p className="display-md text-2xl text-fg">Reel coming soon</p>
        <p className="lede mx-auto mt-3 max-w-md text-base">
          We&apos;re cutting this collection together now. Tell us what
          you&apos;re planning and we&apos;ll send relevant work straight over.
        </p>
        <Link
          href="/#contact"
          className="pill mt-7 inline-flex min-h-12 items-center rounded-full px-7 text-sm font-semibold text-fg"
        >
          Get in touch
        </Link>
      </div>
    );
  }

  return (
    <>
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className={`grid gap-6 lg:gap-8 ${columns}`}
      >
        {projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            lightboxOpen={openIndex !== null}
            onOpen={() => setOpenIndex(i)}
          />
        ))}
      </motion.div>

      <VideoLightbox
        project={openIndex === null ? null : projects[openIndex]}
        onClose={() => setOpenIndex(null)}
        onPrev={projects.length > 1 ? () => step(-1) : undefined}
        onNext={projects.length > 1 ? () => step(1) : undefined}
      />
    </>
  );
}

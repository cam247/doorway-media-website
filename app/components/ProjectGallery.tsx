"use client";

import { useEffect, useState } from "react";
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
 * Desktop: still until hover/focus, then a muted preview. Phones have no hover,
 * so a tile that waited for it stayed black forever — iOS will not paint a frame
 * of a video that has never played. Touch (and other coarse pointers) therefore
 * preview as soon as the tile is on screen; the lightbox still pauses them.
 *
 * Shared by the category pages (through `ProjectGrid`). Layout spacing is left
 * to the caller; this owns the grid, not its margins.
 */

function useCanHover() {
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return canHover;
}

function ProjectCard({
  project,
  index,
  lightboxOpen,
  canHover,
  onOpen,
}: {
  project: Project;
  index: number;
  lightboxOpen: boolean;
  canHover: boolean;
  onOpen: () => void;
}) {
  const [hoverPreview, setHoverPreview] = useState(false);
  /* Touch / stylus: always preview while visible. Fine pointer: wait for hover. */
  const previewing = canHover ? hoverPreview : true;

  return (
    <motion.article
      custom={index}
      variants={reveal}
      onPointerEnter={(e) => e.pointerType !== "touch" && setHoverPreview(true)}
      onPointerLeave={() => setHoverPreview(false)}
      onFocus={() => setHoverPreview(true)}
      onBlur={() => setHoverPreview(false)}
      className="card group relative aspect-video overflow-hidden rounded-3xl"
    >
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
  const canHover = useCanHover();

  const columns =
    projects.length === 1
      ? "grid-cols-1"
      : projects.length === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  const step = (delta: number) =>
    setOpenIndex((i) =>
      i === null ? null : (i + delta + projects.length) % projects.length
    );

  if (projects.length === 0) {
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
            canHover={canHover}
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

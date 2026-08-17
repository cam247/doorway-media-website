"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import VideoTile from "@/app/components/VideoTile";
import VideoLightbox from "@/app/components/VideoLightbox";
import type { Project } from "@/app/lib/projects";
import { fade, stagger, VIEWPORT } from "@/app/lib/motion";

/**
 * Project tile grid + full-screen player.
 *
 * iOS Safari will not paint a <video> that sits under an ancestor with a CSS
 * `transform` (Framer's slide-up reveal uses one). The full-screen player still
 * worked because it portals to document.body, outside that tree — which is why
 * phones showed grey boxes until you tapped in. The footage therefore lives on
 * a static <article>; only the chrome above it is motioned, and only with a
 * fade (opacity), never a translate.
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
  return (
    <article className="card relative aspect-video overflow-hidden rounded-3xl">
      {/* Static ancestor — no transform — so iOS will actually composite this. */}
      <VideoTile src={project.video} paused={lightboxOpen} />

      <motion.div
        custom={index}
        variants={fade}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="absolute inset-0 z-20"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5"
        />

        <button
          type="button"
          onClick={onOpen}
          aria-label={`Play ${project.title}`}
          className="on-media absolute inset-0 flex flex-col justify-end p-5 text-left md:p-6"
        >
          <span
            aria-hidden="true"
            className="glass-strong absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full"
          >
            <Play
              className="h-4 w-4 translate-x-px text-fg"
              fill="currentColor"
            />
          </span>

          <span className="display-lg text-2xl text-on-media md:text-3xl">
            {project.title}
          </span>
        </button>
      </motion.div>
    </article>
  );
}

export default function ProjectGallery({ projects }: { projects: Project[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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

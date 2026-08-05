"use client";

import { motion } from "framer-motion";
import ProjectGallery from "@/app/components/ProjectGallery";
import type { Project } from "@/app/lib/projects";
import { reveal, VIEWPORT } from "@/app/lib/motion";

/**
 * The project gallery on a category page: a section heading over every clip in
 * that category. The tiles, the previewing, and the full-screen player all live
 * in `ProjectGallery`, which the homepage Work section uses as well.
 */
export default function ProjectGrid({
  eyebrow,
  heading,
  projects,
}: {
  eyebrow: string;
  heading: string;
  projects: Project[];
}) {
  return (
    <section id="showcase" className="relative z-10 bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-[1600px] px-5 md:px-6 lg:px-12">
        <motion.header
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="border-b border-line pb-10"
        >
          <p className="eyebrow text-gold">{eyebrow}</p>
          <h2 className="display-lg mt-4 text-4xl text-fg md:text-6xl">
            {heading}
          </h2>
        </motion.header>

        <div className="mt-12">
          <ProjectGallery projects={projects} />
        </div>
      </div>
    </section>
  );
}

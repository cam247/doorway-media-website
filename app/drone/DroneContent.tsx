import PageHero from "@/app/components/PageHero";
import ProjectGrid from "@/app/components/ProjectGrid";
import { projectsIn } from "@/app/lib/projects.server";

/**
 * Read from public/Video files/Drone/ at build time. That folder holds exactly
 * one clip today, so the page shows one tile — the six invented service cards
 * that used to all replay this same flyover are gone. Add clips to the folder
 * and the grid fills itself out.
 */
const items = projectsIn("Drone Video");

export default function DroneContent() {
  return (
    <>
      <PageHero
        eyebrow="Drone Video"
        title="Aerial & Drone Videography"
        description="Licensed drone pilots capturing cinematic flight reels, venue highlights, and aerial establishing shots that ground-based cameras simply can't."
        // 345MB source — streams rather than fully downloading, but this is the
        // heaviest hero on the site and badly wants a compressed web encode.
        video={items[0]?.video}
      />
      <ProjectGrid eyebrow="Selected Work" heading="Drone Video" projects={items} />
    </>
  );
}

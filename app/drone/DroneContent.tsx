import PageHero from "@/app/components/PageHero";
import ProjectGrid from "@/app/components/ProjectGrid";
import { projectsIn } from "@/app/lib/projects.server";

const items = projectsIn("Drone Video");

export default function DroneContent() {
  return (
    <>
      <PageHero
        eyebrow="Drone Video"
        title="Aerial & Drone Videography"
        description="Licensed drone pilots capturing cinematic flight reels, venue highlights, and aerial establishing shots that ground-based cameras simply can't."
        video={items[0]?.video}
      />
      <ProjectGrid eyebrow="Selected Work" heading="Drone Video" projects={items} />
    </>
  );
}

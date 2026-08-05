import PageHero from "@/app/components/PageHero";
import ProjectGrid from "@/app/components/ProjectGrid";
import { mediaUrl } from "@/app/lib/media";
import { projectsIn } from "@/app/lib/projects.server";

const items = projectsIn("Videography");

export default function VideographyContent() {
  return (
    <>
      <PageHero
        eyebrow="Videography"
        title="Videography & Commercial Production"
        description="From brand films to broadcast commercials, we plan, shoot, and edit video that holds attention and drives results."
        /* Montage of ten seconds from each piece below — see scripts/make-reel.mjs. */
        video={mediaUrl("videography-reel.mp4")}
      />
      <ProjectGrid eyebrow="Selected Work" heading="Videography" projects={items} />
    </>
  );
}

import PageHero from "@/app/components/PageHero";
import ProjectGrid from "@/app/components/ProjectGrid";
import { projectsIn } from "@/app/lib/projects.server";

/** Read from public/Video files/Videography/ at build time. */
const items = projectsIn("Videography");

export default function VideographyContent() {
  return (
    <>
      <PageHero
        eyebrow="Videography"
        title="Videography & Commercial Production"
        description="From brand films to broadcast commercials, we plan, shoot, and edit video that holds attention and drives results."
        /* A montage — ten seconds of each piece below, rather than one of them
           at length. Built by `npm run reel -- Videography`, which is also what
           has to be re-run when this folder changes; see scripts/make-reel.mjs
           for why the real files aren't cycled here. */
        video="/Reels/videography-reel.mp4"
      />
      <ProjectGrid eyebrow="Selected Work" heading="Videography" projects={items} />
    </>
  );
}

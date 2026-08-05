import PageHero from "@/app/components/PageHero";
import ProjectGrid from "@/app/components/ProjectGrid";
import { projectsIn } from "@/app/lib/projects.server";

/**
 * Display order for this page's two finished pieces. The folder scan sorts by
 * file size, which would open with Air Max; Red Bull leads instead.
 *
 * These match the titles the scan derives from the filenames. Nothing is
 * filtered by this list — a clip added to the folder that isn't named here still
 * gets a tile, it just sits after the two below.
 */
const ORDER = ["Red Bull Short", "Air Max Short"];

const place = (title: string) => {
  const at = ORDER.indexOf(title);
  return at === -1 ? ORDER.length : at;
};

/** Read from public/Video files/Motion & 3D/ at build time. */
const items = projectsIn("Motion Design & 3D").sort(
  (a, b) => place(a.title) - place(b.title)
);

export default function MotionDesignContent() {
  return (
    <>
      <PageHero
        eyebrow="Motion Design & 3D"
        title="Motion Design & 3D Animation"
        description="Photoreal 3D renders, kinetic logo animations, and full motion graphics packages designed to make brands move."
        /* Red Bull plays out, then Air Max, then back round. Only the named pair
           is queued: a heavy master dropped into the folder later should grow
           the grid without also loading itself behind the title. */
        video={items.slice(0, ORDER.length).map((project) => project.video)}
      />
      <ProjectGrid
        eyebrow="Selected Work"
        heading="Motion Design & 3D"
        projects={items}
      />
    </>
  );
}

import { mediaUrl } from "@/app/lib/media";
import type { CategoryName, Project, ProjectCredit } from "@/app/lib/projects";

/**
 * Project catalog for each service page.
 *
 * Videos are hosted on Supabase (see `media.ts`), not scanned from disk — the
 * masters are too large for the deploy and are gitignored. Add a row here when
 * a new clip is uploaded to the Videos bucket.
 */

const FOURTH_FLOOR = "4th Floor Creative";

type Entry = {
  file: string;
  title: string;
  credit?: ProjectCredit;
};

/**
 * Ordered lightest → heaviest so the grid arms cheap tiles first. Motion Design
 * reorders on its own page so Red Bull leads the hero sequence.
 */
const CATALOG: Record<CategoryName, Entry[]> = {
  Videography: [
    {
      file: "2025 She+ Campaign - V7.mp4",
      title: "She+ Campaign",
      credit: { production: FOURTH_FLOOR, role: "Camera Operator" },
    },
    {
      file: "25-26_Xavier MBB DNA_V4.mp4",
      title: "Xavier MBB — DNA",
      credit: { production: FOURTH_FLOOR, role: "Director & Editor" },
    },
    {
      file: "2024_XU_WBB_V9.mp4",
      title: "Xavier Women's Basketball",
      credit: {
        production: FOURTH_FLOOR,
        role: "Camera Operator & Editor",
      },
    },
    {
      file: "Xavier Alt Intro_V6_FINAL.mp4",
      title: "Xavier Alt Intro",
      credit: { production: FOURTH_FLOOR, role: "Editor" },
    },
    {
      file: "Apparel+ Experience Room_v3.mp4",
      title: "Apparel+ Experience Room",
      credit: { production: FOURTH_FLOOR, role: "Editor" },
    },
    {
      file: "BAGCGC_Part2_v4.mp4",
      title: "BAGCGC — Part Two",
      credit: { production: FOURTH_FLOOR, role: "Camera Operator" },
    },
  ],
  "Motion Design & 3D": [
    { file: "Air Max Short.mp4", title: "Air Max Short" },
    { file: "Red Bull Short.mp4", title: "Red Bull Short" },
  ],
  "Drone Video": [
    { file: "Legal Acres Flyover.mp4", title: "Legal Acres Flyover" },
  ],
};

function idFrom(category: CategoryName, file: string): string {
  const stem = file.replace(/\.[^.]+$/, "");
  return `${category}-${stem}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function projectsIn(category: CategoryName): Project[] {
  return CATALOG[category].map((entry) => ({
    id: idFrom(category, entry.file),
    title: entry.title,
    category,
    video: mediaUrl(entry.file),
    credit: entry.credit,
  }));
}

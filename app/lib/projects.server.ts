import fs from "node:fs";
import path from "node:path";
import {
  CATEGORY_FOLDERS,
  type CategoryName,
  type Project,
  type ProjectCredit,
} from "@/app/lib/projects";

/**
 * Builds each category's project list by reading its folder under
 * `public/Video files/`. Server-only — imported by the category page
 * components, which are Server Components, so the scan happens once at build
 * time and no `fs` reaches the browser bundle.
 *
 * Adding work to the site is therefore a file copy: drop `Foo.mp4` into
 * `public/Video files/Drone/` and the drone page grows a tile.
 */

/** Containers a browser will actually play. `.mkv` masters are ignored. */
const PLAYABLE = new Set([".mp4", ".webm", ".mov", ".m4v"]);

/**
 * The assets folder is currently named `Public` rather than `public`. Windows
 * doesn't care and Next serves it either way locally, but a Linux host would,
 * so both spellings are tried instead of hard-coding the odd one.
 *
 * Worth fixing at the source: renaming the folder to lowercase `public` is what
 * Next.js actually documents, and would make this lookup unnecessary.
 */
function assetsRoot(): string | null {
  for (const dir of ["public", "Public"]) {
    const candidate = path.join(process.cwd(), dir, "Video files");
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

/**
 * Nicer display names for the current masters. Purely cosmetic: discovery is
 * the folder's job, and a file with no entry here still shows up — it just
 * carries its cleaned-up filename as a title.
 */
const TITLES: Record<string, string> = {
  "2025 She+ Campaign - V7": "She+ Campaign",
  "25-26_Xavier MBB DNA_V4": "Xavier MBB — DNA",
  "2024_XU_WBB_V9": "Xavier Women's Basketball",
  "Xavier Alt Intro_V6_FINAL": "Xavier Alt Intro",
  "Apparel+ Experience Room_v3": "Apparel+ Experience Room",
  BAGCGC_Part2_v4: "BAGCGC — Part Two",
};

const FOURTH_FLOOR = "4th Floor Creative";

/**
 * Production company and our role on each piece, keyed by filename stem exactly
 * as `TITLES` is. Optional in the same way: a clip with no row here still plays,
 * it just shows its title alone, so new footage is never blocked on a credit.
 */
const CREDITS: Record<string, ProjectCredit> = {
  "2025 She+ Campaign - V7": {
    production: FOURTH_FLOOR,
    role: "Camera Operator",
  },
  "25-26_Xavier MBB DNA_V4": {
    production: FOURTH_FLOOR,
    role: "Director & Editor",
  },
  "2024_XU_WBB_V9": {
    production: FOURTH_FLOOR,
    role: "Camera Operator & Editor",
  },
  "Xavier Alt Intro_V6_FINAL": { production: FOURTH_FLOOR, role: "Editor" },
  "Apparel+ Experience Room_v3": { production: FOURTH_FLOOR, role: "Editor" },
  BAGCGC_Part2_v4: { production: FOURTH_FLOOR, role: "Camera Operator" },
};

/** Filename stem → something presentable when there's no override above. */
function titleFrom(stem: string): string {
  const cleaned = stem
    .replace(/_/g, " ")
    // Trailing version markers: "…_V6_FINAL", "… - V7", "…_v3".
    .replace(/[\s-]*\bv\d+\b/gi, "")
    .replace(/[\s-]*\bfinal\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/[\s-]+$/, "")
    .trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

/** `Red Bull 56-1501` → `red-bull-56-1501`, stable across builds. */
function idFrom(category: CategoryName, stem: string): string {
  return `${category}-${stem}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function projectsIn(category: CategoryName): Project[] {
  const root = assetsRoot();
  if (!root) return [];

  const dir = path.join(root, CATEGORY_FOLDERS[category]);
  if (!fs.existsSync(dir)) return [];

  return (
    fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isFile() && PLAYABLE.has(path.extname(e.name).toLowerCase()))
      .map((e) => {
        const stem = path.basename(e.name, path.extname(e.name));
        return {
          id: idFrom(category, stem),
          title: TITLES[stem] ?? titleFrom(stem),
          category,
          video: encodeURI(`/Video files/${CATEGORY_FOLDERS[category]}/${e.name}`),
          credit: CREDITS[stem],
          bytes: fs.statSync(path.join(dir, e.name)).size,
        };
      })
      /**
       * Lightest first. Tiles arm their `src` in DOM order as the visitor
       * scrolls, so this puts the cheap clips at the top of the grid and leaves
       * the 600MB+ delivery masters at the bottom, where they are only fetched
       * if someone scrolls that far.
       */
      .sort((a, b) => a.bytes - b.bytes)
      // `bytes` was only ever for sorting — it doesn't cross to the client.
      .map(({ bytes: _bytes, ...project }) => project)
  );
}

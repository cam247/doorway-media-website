/**
 * Project types, and the mapping from a service category to the folder its
 * footage lives in.
 *
 * Deliberately free of any Node imports: this module is pulled into client
 * components (the tile grid, the player) for its types. The filesystem scan that
 * builds the actual project lists is in `projects.server.ts`.
 */

export type CategoryName =
  | "Videography"
  | "Motion Design & 3D"
  | "Drone Video";

/** Who made it and what we did on it. Shown in the player, never on the tile. */
export type ProjectCredit = {
  production: string;
  role: string;
};

export type Project = {
  /** Stable key — React key, and the player's identity when stepping tiles. */
  id: string;
  /** The only text drawn over the tile. A title, never a paragraph. */
  title: string;
  category: CategoryName;
  /** URL-encoded path under public/. */
  video: string;
  /** Absent where the credit isn't recorded yet; the player just omits it. */
  credit?: ProjectCredit;
};

/**
 * Category → its subfolder under `public/Video files/`.
 *
 * This is the whole configuration for what appears on a category page. Drop a
 * new clip into one of these folders and it becomes a tile on the next build —
 * no list to update here.
 *
 * Adding a category means adding it to `CategoryName`, to this map, and to
 * `categoryHrefs` in `site-data.ts`; the types make each of those a compile
 * error until it's done.
 */
export const CATEGORY_FOLDERS: Record<CategoryName, string> = {
  Videography: "Videography",
  "Drone Video": "Drone",
  "Motion Design & 3D": "Motion & 3D",
};

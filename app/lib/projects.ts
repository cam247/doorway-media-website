/**
 * Project types shared by the tile grid and the full-screen player.
 *
 * The catalog itself lives in `projects.server.ts` (imported only from Server
 * Components) so the client bundle never pulls the full list twice.
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
  /** Absolute URL to the clip (Supabase Storage). */
  video: string;
  /** Absent where the credit isn't recorded yet; the player just omits it. */
  credit?: ProjectCredit;
};

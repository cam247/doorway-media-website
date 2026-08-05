import type { CategoryName } from "@/app/lib/projects";

/** Links shown alongside the "Work" dropdown in the primary navigation. */
export const navLinks = [
  { label: "Story", href: "/#story" },
  { label: "Contact", href: "/#contact" },
];

/**
 * Maps a project category to its dedicated service page. Typed as a complete
 * Record, so adding a category to `projects.ts` without giving it a page is a
 * compile error rather than a dead tile.
 */
export const categoryHrefs: Record<CategoryName, string> = {
  Videography: "/videography",
  "Motion Design & 3D": "/motion-design",
  "Drone Video": "/drone",
};

/**
 * The dedicated service pages, reused by the nav dropdown, the footer, and the
 * homepage Work section. Derived from `categoryHrefs` so the two can't drift.
 */
export const serviceLinks = (
  Object.keys(categoryHrefs) as CategoryName[]
).map((label) => ({ label, href: categoryHrefs[label] }));

/** Footer social icons. Open in a new tab; tracking params stripped from shares. */
export const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/doorway.media" },
  { name: "Facebook", href: "https://www.facebook.com/cam.clift.2025" },
];

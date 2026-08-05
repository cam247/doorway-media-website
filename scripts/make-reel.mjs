/**
 * Builds a montage reel for one category: a few seconds of every clip in its
 * folder, dissolved together into a single small web-friendly file.
 *
 *   npm run reel -- Videography
 *
 * Why pre-render rather than cycle the real files in the browser: the delivery
 * masters under `public/Video files/` run from 56MB to 728MB. Playing ten
 * seconds of one still means fetching ten seconds at its full bitrate — tens of
 * megabytes per clip, on a background that nobody came to watch. One montage is
 * a couple of HTTP requests' worth of data for the same effect.
 *
 * The output lives in `public/Reels/`, deliberately outside `public/Video files/`
 * so the folder scan that builds each page's project tiles never sees it and the
 * reel doesn't turn into a project of its own.
 *
 * Re-run this whenever clips are added to or removed from a category — the reel
 * is a build artifact, and nothing regenerates it automatically.
 */

import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";
import ffprobeStatic from "ffprobe-static";

/** Seconds taken from each clip. */
const SEGMENT = 10;
/** Dissolve between one segment and the next. */
const DISSOLVE = 0.5;
/** Everything is normalised to this before joining; xfade demands a match. */
const WIDTH = 1920;
const HEIGHT = 1080;
const FPS = 30;
/**
 * Quality. Every use of this reel is a dimmed background behind a scrim, so it
 * is pitched well below what the masters deserve — the file downloads on page
 * load, and weight matters more here than detail nobody can resolve. Lower this
 * number if the reel ever gets promoted to something you actually watch.
 */
const CRF = 27;

/**
 * Category folder names, matching `CATEGORY_FOLDERS` in app/lib/projects.ts.
 * Kept as a plain copy: this is a standalone script and shouldn't need the app's
 * TypeScript build just to read three strings.
 */
const FOLDERS = {
  Videography: "Videography",
  "Motion Design & 3D": "Motion & 3D",
  "Drone Video": "Drone",
};

/** Same spellings the app tries, for the same reason — the folder is `Public`. */
function assetsRoot() {
  for (const dir of ["public", "Public"]) {
    const candidate = path.join(process.cwd(), dir);
    if (fs.existsSync(path.join(candidate, "Video files"))) return candidate;
  }
  throw new Error("Could not find the assets folder (public/Video files).");
}

function durationOf(file) {
  const out = execFileSync(
    ffprobeStatic.path,
    [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=nw=1:nk=1",
      file,
    ],
    { encoding: "utf8" }
  );
  return Number.parseFloat(out.trim());
}

/**
 * Where to start taking from. A little way in, because openings are where slates,
 * fades from black and held titles live — the least representative seconds of a
 * finished piece. Pulled back if the clip is too short to give that away.
 */
function startFor(duration) {
  const preferred = Math.max(1, duration * 0.12);
  return Math.min(preferred, Math.max(0, duration - SEGMENT));
}

const category = process.argv[2];
if (!category || !FOLDERS[category]) {
  console.error(
    `Usage: npm run reel -- "<category>"\nCategories: ${Object.keys(FOLDERS)
      .map((c) => `"${c}"`)
      .join(", ")}`
  );
  process.exit(1);
}

const root = assetsRoot();
const dir = path.join(root, "Video files", FOLDERS[category]);

const PLAYABLE = new Set([".mp4", ".webm", ".mov", ".m4v"]);

/* Ordered by file size, exactly as `projectsIn` orders the tiles, so the reel
   runs through the category in the same order the page below it does. */
const sources = fs
  .readdirSync(dir, { withFileTypes: true })
  .filter((e) => e.isFile() && PLAYABLE.has(path.extname(e.name).toLowerCase()))
  .map((e) => path.join(dir, e.name))
  .sort((a, b) => fs.statSync(a).size - fs.statSync(b).size);

if (sources.length === 0) {
  console.error(`No playable clips in ${dir}`);
  process.exit(1);
}

/* Inputs: each seeked before -i, which lets ffmpeg jump by keyframe instead of
   decoding the whole file up to that point. On a 728MB master that is the
   difference between seconds and minutes. */
const inputs = [];
const segments = [];

for (const [i, file] of sources.entries()) {
  const duration = durationOf(file);
  const start = startFor(duration);
  const take = Math.min(SEGMENT, duration - start);

  inputs.push("-ss", start.toFixed(3), "-t", take.toFixed(3), "-i", file);
  segments.push(
    `[${i}:v]scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=decrease,` +
      `pad=${WIDTH}:${HEIGHT}:(ow-iw)/2:(oh-ih)/2,fps=${FPS},setsar=1,format=yuv420p[v${i}]`
  );

  console.log(
    `  ${path.basename(file)} — ${take.toFixed(1)}s from ${start.toFixed(1)}s ` +
      `of ${duration.toFixed(1)}s`
  );
}

/*
 * Chain the dissolves. Each xfade overlaps its two inputs by DISSOLVE, so the
 * joined length after k transitions is (k+1)·SEGMENT − k·DISSOLVE and the next
 * transition starts DISSOLVE before that end — which reduces to k·(SEGMENT −
 * DISSOLVE). Offsets are absolute within the growing chain, not per segment.
 */
const chain = [...segments];
let last = "[v0]";

for (let i = 1; i < sources.length; i++) {
  const offset = i * (SEGMENT - DISSOLVE);
  const out = i === sources.length - 1 ? "[reel]" : `[x${i}]`;
  chain.push(
    `${last}[v${i}]xfade=transition=fade:duration=${DISSOLVE}:offset=${offset.toFixed(3)}${out}`
  );
  last = out;
}

const label = sources.length === 1 ? "[v0]" : "[reel]";

const outDir = path.join(root, "Reels");
fs.mkdirSync(outDir, { recursive: true });

const slug = category
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");
const outFile = path.join(outDir, `${slug}-reel.mp4`);

const args = [
  "-y",
  ...inputs,
  "-filter_complex",
  chain.join(";"),
  "-map",
  label,
  /* No audio at all. Every use of this file is a muted background, so the track
     would be bytes nobody can ever hear. */
  "-an",
  "-c:v",
  "libx264",
  "-preset",
  "medium",
  "-crf",
  String(CRF),
  "-pix_fmt",
  "yuv420p",
  /* Moves the index to the front so the browser can start playing on the first
     chunk instead of waiting for the whole file. */
  "-movflags",
  "+faststart",
  outFile,
];

console.log(`\nEncoding ${sources.length} segments → ${outFile}\n`);

const run = spawnSync(ffmpegPath, args, { stdio: "inherit" });
if (run.status !== 0) process.exit(run.status ?? 1);

const size = fs.statSync(outFile).size / 1024 / 1024;
console.log(
  `\nDone — ${path.basename(outFile)}, ${size.toFixed(1)}MB, ` +
    `${durationOf(outFile).toFixed(1)}s`
);

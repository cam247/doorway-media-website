"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { reveal, VIEWPORT } from "@/app/lib/motion";

/**
 * Client logos, served from `public/Featured With (Logos)/`.
 *
 * Those files are the masters in `public/Clients Logo/` with their transparent
 * margins cropped off. The margins varied enormously — the Indiana mark occupied
 * barely half of its 1080x1350 canvas — which made the logos render at wildly
 * different visual sizes no matter how the box was set. Cropping to the artwork
 * is what makes one shared box work.
 *
 * SEC Nation is deliberately absent: its master sets "NATION" in white, which is
 * invisible against this near-white band. `sec-nation.png` is trimmed and
 * waiting in the same folder for whenever a dark-ink version arrives.
 */
type Brand = { name: string; src: string; width: number; height: number };

const brands: Brand[] = [
  {
    name: "ESPN College GameDay",
    src: "/Featured%20With%20(Logos)/espn-college-gameday.png",
    width: 228,
    height: 296,
  },
  {
    name: "NCAA",
    src: "/Featured%20With%20(Logos)/ncaa.png",
    width: 784,
    height: 784,
  },
  {
    name: "Get In Indiana",
    src: "/Featured%20With%20(Logos)/get-in-indiana.png",
    width: 538,
    height: 836,
  },
];

/**
 * Passes of the logo set in each half of the marquee. Each half has to be wider
 * than the viewport or the -50% loop leaves a visible gap at the seam, and three
 * logos on their own are nowhere near wide enough. Every pass reuses the same
 * three files, so this costs DOM nodes and no extra downloads.
 */
const PASSES = 4;

/**
 * One logo in a fixed box, fitted with object-contain so nothing is ever
 * stretched and each mark claims the same footprint. Muted at rest and full
 * colour on hover, which is the logo equivalent of the wordmarks this replaced
 * going from grey to gold.
 */
function Logo({ brand }: { brand: Brand }) {
  return (
    <span className="group block h-20 w-32 shrink-0 md:h-24 md:w-40">
      <Image
        src={brand.src}
        alt={brand.name}
        width={brand.width}
        height={brand.height}
        sizes="160px"
        className="h-full w-full object-contain opacity-75 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
      />
    </span>
  );
}

export default function FeaturedWith() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="featured-with"
      className="relative z-10 border-y border-line bg-surface py-16 md:py-20"
    >
      <motion.p
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="eyebrow mx-auto max-w-7xl px-5 text-center text-gold md:px-6 lg:px-10"
      >
        Featured With
      </motion.p>

      {reduceMotion ? (
        /* The marquee is an infinite transform loop, so `reduced-motion` gets a
           static row instead — the logos are the content, the scrolling is not. */
        <ul className="mx-auto mt-10 flex max-w-5xl flex-wrap items-center justify-center gap-x-12 gap-y-6 px-5">
          {brands.map((brand) => (
            <li key={brand.name}>
              <Logo brand={brand} />
            </li>
          ))}
        </ul>
      ) : (
        <>
          {/* The scrolling copies repeat each logo several times over, so the
              names are carried once here instead of being announced twelve
              times. */}
          <ul className="sr-only">
            {brands.map((brand) => (
              <li key={brand.name}>{brand.name}</li>
            ))}
          </ul>

          <div
            aria-hidden="true"
            className="relative mt-10 overflow-hidden"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
              maskImage:
                "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
            }}
          >
            <motion.div
              className="flex w-max items-center"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 36, ease: "linear", repeat: Infinity }}
            >
              {/*
                Two identical halves: the loop resets at -50%, which is exactly
                one half's width, so the second half lands where the first
                started. Spacing rides on each item rather than as a container
                `gap` — a gap only between items would leave the seam short by
                one, and the join would visibly stutter once every cycle.
              */}
              {[0, 1].map((half) => (
                <div key={half} className="flex shrink-0 items-center">
                  {Array.from({ length: PASSES }).flatMap((_, pass) =>
                    brands.map((brand) => (
                      <span
                        key={`${brand.name}-${pass}`}
                        className="shrink-0 pr-12 md:pr-16"
                      >
                        <Logo brand={brand} />
                      </span>
                    ))
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </>
      )}
    </section>
  );
}

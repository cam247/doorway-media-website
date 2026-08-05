"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import VideoTile from "@/app/components/VideoTile";
import { mediaUrl } from "@/app/lib/media";
import { DUR_ENTER, EASE } from "@/app/lib/motion";
import { serviceLinks } from "@/app/lib/site-data";

/**
 * landing.csv → "Portfolio Grid", section 1: Hero (name/role).
 *
 * The reel is a letterboxed band cropped top and bottom via object-cover, and
 * plays at full opacity with no overlay. The wordmark and category pills sit
 * beneath it in normal document flow — nothing is absolutely positioned over
 * the video, so there is no overlap at any width.
 */
export default function Hero() {
  return (
    <section id="top" className="bg-bg">
      {/* Band height is what controls how much of the frame gets cropped. The
          reel is ultrawide (3100x1080, ~2.87:1), which is close enough to this
          band's own ratio that object-cover barely has to cut anything — at a
          desktop width it trims a few percent off the sides rather than off the
          top and bottom. Shortening the band goes back to cropping vertically. */}
      <div className="relative h-[40vh] min-h-[240px] w-full overflow-hidden md:h-[58vh] lg:h-[64vh]">
        <VideoTile src={mediaUrl("Main Page Video_V4.mp4")} eager />
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-20 pt-8 md:pb-28 md:pt-10 lg:px-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUR_ENTER, ease: EASE }}
          className="hero-wordmark text-center text-ink"
        >
          Doorway Media
        </motion.h1>

        {/* Each pill is the entry point to its category page. `.pill:hover`
            already carries the gold border, lift and shadow. */}
        <motion.ul
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUR_ENTER, delay: 0.1, ease: EASE }}
          className="mx-auto mt-3 flex max-w-3xl flex-wrap items-center justify-center gap-3 md:mt-4"
        >
          {serviceLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="pill flex min-h-11 items-center rounded-full px-5 text-sm font-medium text-fg-muted"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

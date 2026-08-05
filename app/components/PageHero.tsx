"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import VideoSequence from "@/app/components/VideoSequence";
import { DUR_ENTER, EASE } from "@/app/lib/motion";

/**
 * Full-bleed service hero. landing.csv → "Hero-Centric Design":
 * high-impact visual, minimal text, one primary CTA at high contrast.
 *
 * This is a deliberately dark cinematic band on an otherwise white site — the
 * footage needs a scrim to carry text contrast, so it uses the `on-media`
 * tokens rather than the page palette (`dark-mode-pairing`).
 *
 * This once cycled through every video on the page, which on /videography meant
 * queuing six files totalling ~1.9GB. Whatever plays here is now named by the
 * caller, so a page can hand over a short sequence without that ever meaning
 * "everything in the folder".
 */
export default function PageHero({
  eyebrow,
  title,
  description,
  video,
}: {
  eyebrow: string;
  title: string;
  description: string;
  /** One clip on a loop, or several played back-to-back and then round again. */
  video?: string | string[];
}) {
  return (
    <section className="on-media relative isolate overflow-hidden bg-fg pb-20 pt-32 md:pb-28 md:pt-40">
      <div className="absolute inset-0 -z-10">
        <VideoSequence clips={video} eager className="opacity-60" />
      </div>

      {/* Scrim carries the text contrast — white on this clears 4.5:1 throughout. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/60 to-black/75"
      />

      <div className="relative mx-auto max-w-4xl px-5 text-center md:px-6 lg:px-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUR_ENTER, ease: EASE }}
          className="eyebrow text-gold-bright"
        >
          {eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUR_ENTER, delay: 0.06, ease: EASE }}
          className="display-lg mt-5 text-5xl text-on-media md:text-7xl lg:text-8xl"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUR_ENTER, delay: 0.12, ease: EASE }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-on-media-muted md:text-lg"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUR_ENTER, delay: 0.18, ease: EASE }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          {/* One primary CTA per landing.csv; the second is deliberately quiet. */}
          <Link
            href="/#contact"
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-on-media px-7 text-sm font-semibold text-fg transition-transform duration-200 hover:-translate-y-0.5"
          >
            Start a Project
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <a
            href="#showcase"
            className="inline-flex min-h-12 items-center rounded-full border border-white/35 bg-white/10 px-7 text-sm font-semibold text-on-media backdrop-blur-md transition-transform duration-200 hover:-translate-y-0.5"
          >
            See the work
          </a>
        </motion.div>
      </div>
    </section>
  );
}

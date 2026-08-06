"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Boxes,
  Camera,
  Plane,
  type LucideIcon,
} from "lucide-react";
import VideoSequence from "@/app/components/VideoSequence";
import { mediaUrl } from "@/app/lib/media";
import type { CategoryName } from "@/app/lib/projects";
import { categoryHrefs } from "@/app/lib/site-data";
import { DUR_EXIT, EASE, reveal, stagger, VIEWPORT } from "@/app/lib/motion";

/**
 * The core services overview: one panel per service category, each linking into
 * its own page. Individual projects live on those pages, not here.
 *
 * Display order: Videography, Motion Design & 3D (centre), Drone Video (right).
 *
 * Background clips match each category page and are served from Supabase.
 */
const services: {
  category: CategoryName;
  tagline: string;
  icon: LucideIcon;
  video: string | string[];
}[] = [
  {
    category: "Videography",
    tagline: "Award Winning Videos",
    icon: Camera,
    /* Xavier DNA — not She+, which stays on the videography page only. */
    video: mediaUrl("25-26_Xavier MBB DNA_V4.mp4"),
  },
  {
    category: "Motion Design & 3D",
    tagline: "Design That Moves Brands",
    icon: Boxes,
    /* Both pieces, Red Bull first, as on /motion-design. */
    video: [
      mediaUrl("Red Bull Short.mp4"),
      mediaUrl("Air Max Short.mp4"),
    ],
  },
  {
    category: "Drone Video",
    tagline: "Cinematic Aerial Video",
    icon: Plane,
    video: mediaUrl("Legal Acres Flyover.mp4"),
  },
];

/**
 * landing.csv → "Portfolio Grid", section 2.
 *
 * All panels play their own footage; hover only changes which panel is
 * expanded, not whether it is playing. Expansion is driven by pointerenter *and*
 * focus, so keyboard users get the same reveal (`keyboard-navigation`).
 */
export default function WorkGrid() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="work" className="relative z-10 bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-[1600px] px-5 md:px-6 lg:px-12">
        <motion.header
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="grid gap-6 border-b border-line pb-12 md:grid-cols-12 md:items-end"
        >
          <div className="md:col-span-7">
            <p className="eyebrow text-gold">Featured Work</p>
            <h2 className="display-lg mt-4 text-4xl text-fg md:text-6xl">
              What We Do
            </h2>
          </div>
          <p className="lede text-base md:col-span-5 md:text-right">
            Take a look at some of our recent projects and see the magic
            we&apos;ve created. Each production tells a unique story.
          </p>
        </motion.header>

        {/* Desktop: expanding panels */}
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          onPointerLeave={() => setActiveIndex(null)}
          className="mt-12 hidden h-[440px] gap-3 md:flex"
        >
          {services.map((service, i) => {
            const isExpanded = activeIndex === i;
            return (
              <motion.div
                key={service.category}
                layout
                transition={{ duration: DUR_EXIT, ease: EASE }}
                onPointerEnter={(e) =>
                  e.pointerType !== "touch" && setActiveIndex(i)
                }
                className={`relative h-full overflow-hidden rounded-3xl bg-surface ${
                  isExpanded ? "flex-[3]" : "flex-[1]"
                }`}
              >
                <VideoSequence clips={service.video} />

                <div
                  aria-hidden="true"
                  className="absolute inset-0 z-20 bg-gradient-to-t from-black/85 via-black/25 to-black/10"
                />

                <div className="glass-strong absolute left-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full">
                  <service.icon
                    aria-hidden="true"
                    className="h-5 w-5 text-fg"
                    strokeWidth={1.75}
                  />
                </div>

                {/* Whole panel is the hit area; the link fills it. */}
                <Link
                  href={categoryHrefs[service.category] ?? "/#contact"}
                  onFocus={() => setActiveIndex(i)}
                  className="on-media absolute inset-0 z-20 flex flex-col justify-end p-5 md:p-7"
                >
                  <span
                    className={`block overflow-hidden whitespace-nowrap text-xs font-semibold uppercase tracking-[0.16em] text-gold-bright transition-opacity duration-300 ${
                      isExpanded ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {service.tagline}
                  </span>
                  <span className="mt-1 flex items-end justify-between gap-4">
                    <span
                      className={`display-lg text-on-media ${
                        isExpanded ? "text-3xl md:text-5xl" : "text-base"
                      }`}
                    >
                      {service.category}
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className={`h-6 w-6 shrink-0 text-gold-bright transition-opacity duration-300 ${
                        isExpanded ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mobile: stacked cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mt-12 grid grid-cols-1 gap-6 md:hidden"
        >
          {services.map((service, i) => (
            <motion.div
              key={service.category}
              custom={i}
              variants={reveal}
              className="relative aspect-video overflow-hidden rounded-3xl bg-surface"
            >
              <VideoSequence clips={service.video} />

              <div
                aria-hidden="true"
                className="absolute inset-0 z-20 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
              />

              <Link
                href={categoryHrefs[service.category] ?? "/#contact"}
                className="on-media absolute inset-0 z-20 flex flex-col justify-between p-5"
              >
                <span className="glass-strong inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold text-fg">
                  <service.icon
                    aria-hidden="true"
                    className="h-4 w-4"
                    strokeWidth={2}
                  />
                  {service.tagline}
                </span>
                <span className="flex items-end justify-between gap-4">
                  <span className="display-lg text-3xl text-on-media">
                    {service.category}
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-6 w-6 shrink-0 text-gold-bright"
                  />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

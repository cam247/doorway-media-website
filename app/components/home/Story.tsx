import Image from "next/image";
import Link from "next/link";
import { Award, ArrowRight, Trophy } from "lucide-react";
import Reveal from "@/app/components/Reveal";

const storyPhotos = [
  { src: "/DSC07266.jpg", alt: "Cinematographer framing a shot on location" },
  { src: "/DSC07272.jpg", alt: "Camera rig set up during a live event shoot" },
  { src: "/DSC07350.jpg", alt: "Behind the scenes on a Doorway Media production" },
];

const awards = [
  { icon: Award, name: "Emmy Award", detail: "Winner" },
  { icon: Trophy, name: "46th Annual Telly Award", detail: "Silver Winner" },
];

/**
 * landing.csv → "Portfolio Grid", section 3: About / Philosophy.
 *
 * Server Component — only the <Reveal> wrappers ship JS
 * (`push-client-components-down`, HIGH).
 */
export default function Story() {
  return (
    <section id="story" className="relative z-10 bg-bg py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-6 lg:px-10">
        <Reveal>
          <p className="eyebrow text-gold">Our Story</p>
          <h2 className="display-lg mt-4 text-4xl text-fg md:text-6xl">
            My Story
          </h2>
          <p className="lede mt-6 max-w-3xl text-base md:text-lg">
            Doorway Media was built on the idea that every story deserves the
            right entrance. What started as a passion for cinematic storytelling
            and high-energy sports production has grown into a production company
            dedicated to crafting visuals that connect people, brands, and
            emotion. From the first spark of an idea to the final edit, our focus
            is on creating work that feels alive, intentional, authentic, and
            impossible to ignore.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <ul className="grid grid-cols-3 gap-3">
              {storyPhotos.map((photo) => (
                <li
                  key={photo.src}
                  className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-surface"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 1024px) 33vw, 220px"
                    className="object-cover grayscale transition-[filter] duration-700 hover:grayscale-0"
                  />
                </li>
              ))}
            </ul>

            <ul id="achievements" className="mt-5 grid gap-4 sm:grid-cols-2">
              {awards.map((award) => (
                <li
                  key={award.name}
                  className="award-card flex items-center gap-3 rounded-2xl px-5 py-4"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/25 bg-gold/[0.08] text-gold">
                    <award.icon
                      aria-hidden="true"
                      className="h-5 w-5"
                      strokeWidth={1.75}
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold leading-tight text-fg">
                      {award.name}
                    </span>
                    {/* `color-not-only`: the label carries the meaning, not the gold. */}
                    <span className="block text-sm text-fg-muted">
                      {award.detail}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col justify-center">
            <figure className="quote-box rounded-2xl p-8 md:p-11">
              <blockquote className="display-md text-3xl text-fg md:text-4xl">
                &ldquo;We don&apos;t just shoot videos. We build moments that
                move.&rdquo;
              </blockquote>
              <figcaption className="lede mt-6 text-base md:text-lg">
                Every frame, every cut, every sound is crafted to pull people in
                and leave something lasting behind. Doorway Media is where
                creative vision meets precision production, bringing ideas to
                life with energy and emotion.
              </figcaption>
            </figure>

            <Link
              href="/#work"
              className="mt-8 inline-flex w-fit min-h-12 items-center gap-2 rounded-full bg-fg px-6 text-sm font-semibold text-bg transition-transform duration-200 hover:-translate-y-0.5"
            >
              Featured Work
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

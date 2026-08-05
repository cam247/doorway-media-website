/**
 * Motion tokens — ui-ux-pro-max `motion.csv`, Standard intensity tier.
 *
 * The skill ships GSAP snippets; these are the Framer Motion equivalents of the
 * same presets. `motion-consistency`: every animation on the site pulls from here
 * so durations and easing stay on one rhythm.
 */

/** power2.out equivalent. `easing`: ease-out for entering. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Scroll Reveal [Standard] — 400-600ms. */
export const DUR_ENTER = 0.5;

/** `exit-faster-than-enter` — 60-70% of enter. */
export const DUR_EXIT = 0.32;

/** Hover Micro-interaction [Standard] — 200-300ms. */
export const DUR_MICRO = 0.2;

/**
 * Shared viewport config. `once: true` matches the GSAP preset's
 * "play none none reverse" note: never re-trigger on scroll direction change.
 */
export const VIEWPORT = { once: true, margin: "-80px" } as const;

/**
 * Scroll Reveal [Standard]: slide up + fade.
 * y offset stays small so it reads as a reveal, not a slide.
 */
export const reveal = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    // `stagger-sequence`: 30-50ms per item.
    transition: { duration: DUR_ENTER, delay: i * 0.04, ease: EASE },
  }),
};

/** Stagger List [Standard]. Cap children at ~8 — beyond that the tail feels laggy. */
export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

/** Subtle fade for text that shouldn't travel (long body copy). */
export const fade = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DUR_ENTER, ease: EASE },
  },
};

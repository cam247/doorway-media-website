"use client";

import { MotionConfig } from "framer-motion";

/**
 * `reduced-motion` (HIGH severity) — with reducedMotion="user", Framer Motion
 * drops transform/layout animations for anyone with the OS setting enabled and
 * keeps opacity only, so reveals degrade to plain fades instead of vanishing.
 *
 * Children stay server-rendered; this only supplies context.
 */
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

"use client";

import { motion } from "framer-motion";
import { DUR_ENTER, EASE, VIEWPORT } from "@/app/lib/motion";

/**
 * Scroll Reveal [Standard] as a thin client leaf.
 *
 * Lets section markup stay in Server Components — `push-client-components-down`
 * (HIGH): only the animation wrapper ships JS, not the content inside it.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 20,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "figure" | "li";
}) {
  const Tag = motion[as];

  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: DUR_ENTER, delay, ease: EASE }}
      className={className}
    >
      {children}
    </Tag>
  );
}

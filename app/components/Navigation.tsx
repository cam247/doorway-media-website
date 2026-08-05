"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { mediaUrl } from "@/app/lib/media";
import { navLinks, serviceLinks } from "@/app/lib/site-data";
import { DUR_EXIT, EASE } from "@/app/lib/motion";

/**
 * Primary navigation.
 *
 * Layout, spacing and type sizes match the original header (48px mark, gap-9,
 * py-4, 13px links). The 44x44 minimum target applies to *touch* surfaces
 * (`touch-friendly`: "increase touch targets on mobile"), so the mobile toggle
 * and mobile menu rows are 44px while the desktop pointer nav stays compact.
 *
 * What is new here is behaviour, not looks: real client-side routing via
 * next/link, a dropdown that opens on hover *and* keyboard focus, Escape and
 * outside-click dismissal, and an active-route indicator.
 */
export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [workOpen, setWorkOpen] = useState(false);
  const [mobileWorkOpen, setMobileWorkOpen] = useState(false);
  const workRef = useRef<HTMLDivElement>(null);

  /* `back-behavior` — never leave a menu open across a navigation. */
  useEffect(() => {
    setMobileOpen(false);
    setWorkOpen(false);
    setMobileWorkOpen(false);
  }, [pathname]);

  /* `escape-routes` — Escape closes whatever is open. */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setWorkOpen(false);
      setMobileOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  /* Dismiss the dropdown on outside click (touch devices have no mouseleave). */
  useEffect(() => {
    if (!workOpen) return;
    function onPointerDown(e: PointerEvent) {
      if (!workRef.current?.contains(e.target as Node)) setWorkOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [workOpen]);

  const isActive = (href: string) => pathname === href;

  return (
    <header className="glass-nav sticky top-0 z-50 border-b border-line">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src={mediaUrl("Doorway Media Transparent.png")}
            alt="Doorway Media home"
            width={48}
            height={48}
            priority
            className="h-12 w-12 object-contain"
          />
          <span className="text-[15px] font-bold tracking-tight text-fg">
            Doorway Media
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
          {/* A real <button> so the panel is reachable by keyboard — the previous
              group-hover-only markup was not. */}
          <div
            ref={workRef}
            className="relative"
            onPointerEnter={(e) => e.pointerType !== "touch" && setWorkOpen(true)}
            onPointerLeave={() => setWorkOpen(false)}
          >
            <button
              type="button"
              aria-expanded={workOpen}
              aria-haspopup="true"
              onClick={() => setWorkOpen((v) => !v)}
              className="flex items-center gap-1 text-[13px] font-medium text-fg-muted transition-colors hover:text-fg"
            >
              Work
              <ChevronDown
                aria-hidden="true"
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  workOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {workOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 12 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: DUR_EXIT, ease: EASE }}
                  className="glass-strong absolute left-1/2 top-full z-30 w-56 -translate-x-1/2 rounded-2xl p-2 shadow-xl"
                >
                  <Link
                    href="/#work"
                    className="block rounded-xl px-4 py-2.5 text-[13px] font-medium text-fg-muted transition-colors hover:bg-fg/5 hover:text-fg"
                  >
                    All Work
                  </Link>
                  {serviceLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={isActive(link.href) ? "page" : undefined}
                      className={`block rounded-xl px-4 py-2.5 text-[13px] font-medium transition-colors hover:bg-fg/5 hover:text-fg ${
                        isActive(link.href) ? "text-gold" : "text-fg-muted"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium text-fg-muted transition-colors hover:text-fg"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          {/* colors.csv "Architecture / Interior": Primary ink / on-primary white,
              gold reserved as accent. White on ink is 17.9:1. */}
          <Link
            href="/#contact"
            className="hidden items-center gap-1.5 rounded-full bg-fg px-5 py-2.5 text-[13px] font-semibold text-bg transition-transform duration-200 hover:-translate-y-0.5 md:inline-flex"
          >
            Start a Project
            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>

          {/* Touch target: 44x44. */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-fg md:hidden"
          >
            {mobileOpen ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: DUR_EXIT, ease: EASE }}
            className="overflow-hidden border-t border-line bg-bg md:hidden"
          >
            <nav
              aria-label="Mobile"
              className="flex flex-col gap-1 px-6 py-4 text-base"
            >
              <button
                type="button"
                onClick={() => setMobileWorkOpen((v) => !v)}
                aria-expanded={mobileWorkOpen}
                className="flex min-h-11 w-full items-center justify-between font-medium text-fg"
              >
                Work
                <ChevronDown
                  aria-hidden="true"
                  className={`h-5 w-5 transition-transform duration-200 ${
                    mobileWorkOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {mobileWorkOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: DUR_EXIT, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col border-l border-line pl-4">
                      <Link
                        href="/#work"
                        className="flex min-h-11 items-center text-fg-muted"
                      >
                        All Work
                      </Link>
                      {serviceLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          aria-current={isActive(link.href) ? "page" : undefined}
                          className={`flex min-h-11 items-center ${
                            isActive(link.href) ? "text-gold" : "text-fg-muted"
                          }`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex min-h-11 items-center font-medium text-fg"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/#contact"
                className="mt-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-fg px-5 font-semibold text-bg"
              >
                Start a Project
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navigation from "@/app/components/Navigation";
import Footer from "@/app/components/Footer";
import { serviceLinks } from "@/app/lib/site-data";

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main
        id="main"
        className="flex min-h-[70vh] flex-col items-center justify-center bg-bg px-5 py-24 text-center"
      >
        <p className="eyebrow text-gold">404</p>
        <h1 className="display-lg mt-4 text-4xl text-fg md:text-6xl">
          Page not found
        </h1>
        <p className="lede mt-4 max-w-md text-base">
          That page doesn&apos;t exist. Here&apos;s where most people are headed:
        </p>

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {serviceLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="pill inline-flex min-h-12 items-center rounded-full px-5 text-sm font-medium text-fg-muted"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/"
          className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-fg px-6 text-sm font-semibold text-bg transition-transform duration-200 hover:-translate-y-0.5"
        >
          Back home
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </main>
      <Footer />
    </>
  );
}

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";

/**
 * Route-level error boundary — `handle-errors-with-error-tsx` (HIGH).
 * Must be a Client Component and must expose `reset`.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replace with real error reporting when one is wired up.
    console.error(error);
  }, [error]);

  return (
    <main
      id="main"
      className="flex min-h-screen flex-col items-center justify-center bg-bg px-5 text-center"
    >
      <p className="eyebrow text-gold">Something went wrong</p>
      <h1 className="display-lg mt-4 text-4xl text-fg md:text-6xl">
        We hit a snag
      </h1>
      <p className="lede mt-4 max-w-md text-base">
        The page didn&apos;t load properly. Try again — if it keeps happening,
        email us at Cam@doorway.media.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-12 items-center gap-2 rounded-full bg-fg px-6 text-sm font-semibold text-bg transition-transform duration-200 hover:-translate-y-0.5"
        >
          <RefreshCw aria-hidden="true" className="h-4 w-4" />
          Try again
        </button>
        <Link
          href="/"
          className="pill inline-flex min-h-12 items-center rounded-full px-6 text-sm font-semibold text-fg"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import VideoTile from "@/app/components/VideoTile";

/**
 * One clip on a loop, or several played back-to-back and then round again.
 *
 * With more than one clip they are all mounted at once and cross-faded, rather
 * than swapped through a single element's `src`: the outgoing clip holds its
 * last frame while the incoming one starts, so the handover dissolves instead of
 * flashing black the way a src swap does. Only the active clip is ever playing,
 * so the cost of a queued clip is a paused element, not a second stream.
 *
 * Everything else — when to attach the source, when to play, reduced motion — is
 * `VideoTile`'s job and is unchanged. Under reduced motion nothing plays, so no
 * clip ever reports finishing and the first one simply stays on screen as a
 * still frame.
 */
export default function VideoSequence({
  clips,
  eager = false,
  className = "",
}: {
  clips?: string | string[];
  /** Skip the proximity wait — for above-the-fold heroes. */
  eager?: boolean;
  /** Applied to whichever clip is showing; the rest are held transparent. */
  className?: string;
}) {
  const [active, setActive] = useState(0);

  const list = clips === undefined ? [] : Array.isArray(clips) ? clips : [clips];

  if (list.length <= 1) {
    return <VideoTile src={list[0]} eager={eager} className={className} />;
  }

  return (
    <>
      {list.map((src, i) => (
        <VideoTile
          key={src}
          src={src}
          eager={eager}
          /* Off, or `ended` never fires and the sequence never advances. */
          loop={false}
          paused={i !== active}
          onEnded={() => setActive((i + 1) % list.length)}
          className={`transition-opacity duration-700 ${
            i === active ? className : "opacity-0"
          }`}
        />
      ))}
    </>
  );
}

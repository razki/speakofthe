"use client";

import { useEffect, useRef } from "react";
import type { RibbonBackgroundContent } from "@/data/mocks/ribbon-background";
import { useDecorativeMotion } from "@/hooks/use-decorative-motion";

/** A quiet media layer across the lower page, with no layout or input footprint. */
export function RibbonBackground({ content }: { content: RibbonBackgroundContent }) {
  const { ref, active } = useDecorativeMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!active) {
      video.pause();
      return;
    }

    // Defer the video request until this area is visible and motion is allowed.
    if (!video.hasAttribute("src")) video.src = content.video;
    void video.play().catch(() => {
      // The poster remains a complete static treatment if autoplay is blocked.
    });
    return () => video.pause();
  }, [active, content.video]);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="ribbon-scene sticky top-0 h-svh overflow-hidden">
        <video
          ref={videoRef}
          poster={content.poster}
          muted
          loop
          autoPlay
          playsInline
          preload="none"
          disablePictureInPicture
          className="ribbon-media h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

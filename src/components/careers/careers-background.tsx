"use client";

import { useEffect, useRef } from "react";

import type { CareersBackgroundContent } from "@/data/mocks/careers";
import { useDecorativeMotion } from "@/hooks/use-decorative-motion";

export interface CareersBackgroundProps {
  content: CareersBackgroundContent;
}

/** The original Coral Light Arc motion, kept quiet behind the careers message. */
export const CareersBackground = ({ content }: CareersBackgroundProps) => {
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
    <div
      ref={ref}
      aria-hidden="true"
      className="careers-arc-scene pointer-events-none absolute inset-0 overflow-hidden"
    >
      <video
        ref={videoRef}
        poster={content.poster}
        muted
        loop
        autoPlay
        playsInline
        preload="none"
        disablePictureInPicture
        className="careers-arc-media h-full w-full object-cover"
      />
    </div>
  );
};

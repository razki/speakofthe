"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRobot } from "@/components/common/robot-view";

const motionQuery = "(prefers-reduced-motion: reduce)";
const subscribeToMotion = (notify: () => void) => {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};
const getMotionSnapshot = () => window.matchMedia(motionQuery).matches;
// Begin stationary until the browser preference is known, including hydration.
const getServerMotionSnapshot = () => true;

/** Shared visibility gate for decorative springs, without a per-frame listener. */
export function useDecorativeMotion() {
  const ref = useRef<HTMLDivElement>(null);
  const robot = useRobot();
  const reducedMotion = useSyncExternalStore(
    subscribeToMotion, getMotionSnapshot, getServerMotionSnapshot,
  );
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(false);
  const motionOff = robot || reducedMotion;

  useEffect(() => {
    if (motionOff || !ref.current) return;
    // Touching a viewport edge can count as intersecting with zero visible area.
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio > 0),
      { threshold: 0.001 },
    );
    observer.observe(ref.current);
    const onVisibility = () => setTabVisible(document.visibilityState === "visible");
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [motionOff]);

  return { ref, motionOff, active: !motionOff && inView && tabVisible };
}

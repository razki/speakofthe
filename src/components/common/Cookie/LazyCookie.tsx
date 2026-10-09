// 📖 Docs: obsidian/frontend/components/common.md
"use client";

/**
 * Client wrapper for the Cookie banner + preferences modal.
 *
 * No longer lazy: it was `dynamic({ ssr: false })`, which kept ~3.7 KB gz out
 * of the first load but mounted the banner only after hydration — and on a
 * phone the banner's paragraph is the largest text on screen, so LCP waited
 * for the JS. It is server-rendered now and paints with the page; returning
 * visitors and the robot form hide it in CSS before paint (`consent-flag.ts`,
 * `globals.css`).
 */

import { useLayoutEffect, useState } from "react";

import { isRobotView } from "@/components/common/robot-view";

import { Cookie } from "./Cookie";

export function LazyCookie() {
  // Robots get no consent banner (D-016): there is no visitor to ask. Decided
  // in a layout effect — before paint — not during render: `ssr: false` makes
  // the server emit a client-bailout boundary here, and returning null on the
  // first client render instead was a hydration mismatch (React #418). The
  // server's marker is read, not `window.__robotView`: the layout renders
  // before the page's robot module runs.
  const [robot, setRobot] = useState(false);
  useLayoutEffect(() => {
    if (isRobotView()) setRobot(true);
  }, []);
  return robot ? null : <Cookie />;
}

"use client";

import { useState, useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getClientSnapshot = () => false;
const getServerSnapshot = () => true;

/** Capture SSR/hydration entry once; subsequent client route mounts return false. */
export function useInitialDocumentEntry() {
  const hydrating = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const [initialDocumentEntry] = useState(hydrating);
  return initialDocumentEntry;
}

"use client";

import { useEffect } from "react";

/** The path grows upward from the first lesson, so bring the current lesson into view on load. */
export function ScrollToCurrent() {
  useEffect(() => {
    document.getElementById("current-node")?.scrollIntoView({ block: "center" });
  }, []);
  return null;
}

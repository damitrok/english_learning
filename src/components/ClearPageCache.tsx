"use client";

import { useEffect } from "react";
import { clearPageCache } from "@/lib/page-cache";

/** On the sign-in page: whoever arrives here must not find the previous user's cached pages. */
export function ClearPageCache() {
  useEffect(() => {
    void clearPageCache();
  }, []);
  return null;
}

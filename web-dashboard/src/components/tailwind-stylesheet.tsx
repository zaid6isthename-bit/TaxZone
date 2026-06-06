"use client";

import { useEffect } from "react";

/**
 * Force-loads the tailwind.generated.css file which is generated
 * by the prebuild script. This is required for environments where
 * standard Next.js CSS bundling is bypassed or failing in Capacitor.
 */
export function TailwindStylesheet() {
  useEffect(() => {
    // Check if already exists to avoid duplicates
    if (document.querySelector('link[href*="tailwind.generated.css"]')) {
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/tailwind.generated.css?v=" + Date.now(); // Cache busting
    document.head.appendChild(link);

    console.log("Tailwind fallback stylesheet injected.");
  }, []);

  return null;
}

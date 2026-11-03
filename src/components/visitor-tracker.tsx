"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * First-party visitor tracker. Fires once per route change, after a short delay
 * so React StrictMode double-mounts in dev don't double-count. The server
 * deduplicates by visitor id + 30-minute window anyway.
 */
export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Skip admin routes entirely.
    if (pathname.startsWith("/admin")) return;

    const timer = window.setTimeout(() => {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: pathname }),
        keepalive: true,
      }).catch(() => {
        /* analytics must never break the page */
      });
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}

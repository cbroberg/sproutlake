"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Invisible component that listens for CMS content changes via SSE
 * and triggers a soft refresh so the page shows updated content.
 * Add to your root layout.
 */
export function LiveRefresh() {
  const router = useRouter();

  useEffect(() => {
    const es = new EventSource("/api/content-stream");

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("[webhouse] Content updated:", data.paths?.join(", "));
        router.refresh();
      } catch {
        // ignore parse errors
      }
    };

    es.onerror = () => {
      // EventSource auto-reconnects
    };

    return () => es.close();
  }, [router]);

  return null;
}

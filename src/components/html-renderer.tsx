"use client";

import { useEffect, useRef } from "react";

interface Props {
  html: string;
}

export function HtmlRenderer({ html }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!containerRef.current || initialized.current || !html) return;
    initialized.current = true;

    const container = containerRef.current;

    // Set content directly
    container.innerHTML = html;

    // Find all script tags that were inserted as HTML (they won't execute)
    const scriptElements = container.querySelectorAll("script");
    const scriptsToRun: Array<{ src?: string; text?: string }> = [];

    scriptElements.forEach((oldScript) => {
      scriptsToRun.push({
        src: oldScript.src || undefined,
        text: oldScript.textContent || undefined,
      });
      oldScript.remove();
    });

    // Re-create and insert scripts properly so they execute
    let chainPromise = Promise.resolve();

    scriptsToRun.forEach((scriptData) => {
      chainPromise = chainPromise.then(() => {
        return new Promise<void>((resolve) => {
          const newScript = document.createElement("script");
          if (scriptData.src) {
            newScript.src = scriptData.src;
            newScript.onload = () => resolve();
            newScript.onerror = () => resolve();
            container.appendChild(newScript);
          } else if (scriptData.text) {
            newScript.textContent = scriptData.text;
            container.appendChild(newScript);
            // Inline scripts execute synchronously
            resolve();
          } else {
            resolve();
          }
        });
      });
    });
  }, [html]);

  return <div ref={containerRef} className="infographic-content" />;
}

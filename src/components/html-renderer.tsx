"use client";

import { useEffect, useRef } from "react";

interface Props {
  html: string;
}

export function HtmlRenderer({ html }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Parse the HTML and separate scripts from content
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Extract all script tags
    const scripts = doc.querySelectorAll("script");
    const scriptData: Array<{ src?: string; text?: string }> = [];
    scripts.forEach((s) => {
      scriptData.push({ src: s.src || undefined, text: s.textContent || undefined });
      s.remove();
    });

    // Extract link tags (fonts, etc.)
    const links = doc.querySelectorAll('link[rel="stylesheet"], link[rel="preconnect"]');
    links.forEach((link) => {
      const existing = document.querySelector(`link[href="${link.getAttribute("href")}"]`);
      if (!existing) {
        document.head.appendChild(link.cloneNode(true));
      }
      link.remove();
    });

    // Extract style tags
    const styles = doc.querySelectorAll("style");
    const styleTexts: string[] = [];
    styles.forEach((s) => {
      styleTexts.push(s.textContent || "");
      s.remove();
    });

    // Set the content (without scripts)
    const content = doc.body.innerHTML;
    containerRef.current.innerHTML = content;

    // Add scoped styles
    styleTexts.forEach((css) => {
      const style = document.createElement("style");
      style.textContent = css;
      containerRef.current!.prepend(style);
    });

    // Execute scripts in order
    const loadScript = (data: { src?: string; text?: string }): Promise<void> => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        if (data.src) {
          script.src = data.src;
          script.onload = () => resolve();
          script.onerror = () => resolve();
        } else if (data.text) {
          script.textContent = data.text;
          resolve();
        } else {
          resolve();
        }
        containerRef.current!.appendChild(script);
      });
    };

    // Load external scripts first (Chart.js etc.), then inline scripts
    const externalScripts = scriptData.filter((s) => s.src);
    const inlineScripts = scriptData.filter((s) => !s.src && s.text);

    (async () => {
      for (const s of externalScripts) {
        await loadScript(s);
      }
      // Small delay to let external scripts initialize
      await new Promise((r) => setTimeout(r, 100));
      for (const s of inlineScripts) {
        await loadScript(s);
      }
    })();

    // Cleanup on unmount
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [html]);

  return <div ref={containerRef} className="infographic-content" />;
}

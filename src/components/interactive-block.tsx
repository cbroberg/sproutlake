"use client";

import { useState, useEffect } from "react";

interface Props {
  interactiveId: string;
  caption?: string;
  scale?: number;
  allowFullscreen?: boolean;
  fullscreenLabel?: string;
}

export function InteractiveBlock({ interactiveId, caption, scale, allowFullscreen, fullscreenLabel }: Props) {
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!fullscreen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setFullscreen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [fullscreen]);

  const src = `/interactives/${interactiveId}.html`;
  const scaleRaw = scale || 0;
  const isScaled = scaleRaw > 0 && scaleRaw < 100;
  const sc = scaleRaw / 100;
  const VW = 1200;
  const VH = 1200;

  return (
    <div className="my-8">
      {isScaled ? (
        <div style={{ position: "relative", display: "inline-block", width: VW * sc, maxWidth: "100%", height: VH * sc, overflow: "hidden", borderRadius: "0.75rem" }}>
          <iframe
            src={src}
            title={caption || "Interactive"}
            style={{ width: VW, height: VH, border: "none", transform: `scale(${sc})`, transformOrigin: "top left" }}
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      ) : (
        <iframe
          src={src}
          title={caption || "Interactive"}
          style={{ width: 1000, maxWidth: "100%", minHeight: "600px", border: "none", borderRadius: "0.75rem" }}
          sandbox="allow-scripts allow-same-origin"
        />
      )}

      {(caption || allowFullscreen) && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
          {caption && (
            <p className="text-sm text-gray-500 dark:text-gray-400" style={{ flex: 1, textAlign: "center", margin: 0 }}>{caption}</p>
          )}
          {allowFullscreen && (
            <button
              onClick={() => setFullscreen(true)}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.35rem",
                padding: "0.25rem 0.6rem", borderRadius: "6px",
                background: "transparent", border: "1px solid rgba(150,150,150,0.3)",
                color: "rgba(150,150,150,0.7)", cursor: "pointer", fontSize: "0.7rem",
                transition: "all 150ms", whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(100,100,100,0.5)"; e.currentTarget.style.color = "rgba(100,100,100,0.9)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(150,150,150,0.3)"; e.currentTarget.style.color = "rgba(150,150,150,0.7)"; }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                <path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" />
              </svg>
              {fullscreenLabel || "Fullscreen"}
            </button>
          )}
        </div>
      )}

      {/* Fullscreen overlay */}
      {fullscreen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setFullscreen(false); }}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.92)", backdropFilter: "blur(8px)",
            display: "grid", placeItems: "center", overflow: "hidden",
          }}
        >
          <button
            onClick={() => setFullscreen(false)}
            style={{
              position: "fixed", top: 16, right: 16, zIndex: 10000,
              background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "50%", color: "white", cursor: "pointer",
              width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
          <iframe
            src={src}
            title={caption || "Interactive"}
            style={{ width: "88vw", height: "88vh", maxWidth: 1200, border: "none", borderRadius: "0.75rem", boxShadow: "0 0 60px rgba(0,0,0,0.5)" }}
            scrolling="no"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      )}
    </div>
  );
}

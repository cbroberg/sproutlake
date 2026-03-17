"use client";

import { useState, useEffect } from "react";

interface Props {
  interactiveId: string;
  caption?: string;
  scale?: number;
  allowFullscreen?: boolean;
}

function ExpandButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute", top: 0, right: 0,
        width: 32, height: 32, borderRadius: "0 0.75rem 0 8px",
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        border: "none", cursor: "pointer", color: "white",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 150ms",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.8)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.6)"; }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" />
        <path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" />
      </svg>
    </button>
  );
}

export function InteractiveBlock({ interactiveId, caption, scale, allowFullscreen }: Props) {
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
        <div style={{ position: "relative", display: "inline-block", width: VW * sc, height: VH * sc, overflow: "hidden", borderRadius: "0.75rem" }}>
          <iframe
            src={src}
            title={caption || "Interactive"}
            style={{ width: VW, height: VH, border: "none", transform: `scale(${sc})`, transformOrigin: "top left" }}
            sandbox="allow-scripts allow-same-origin"
          />
          {allowFullscreen && <ExpandButton onClick={() => setFullscreen(true)} />}
        </div>
      ) : (
        <div style={{ position: "relative" }}>
          <iframe
            src={src}
            title={caption || "Interactive"}
            style={{ width: "100%", minHeight: "600px", border: "none", borderRadius: "0.75rem" }}
            sandbox="allow-scripts allow-same-origin"
          />
          {allowFullscreen && <ExpandButton onClick={() => setFullscreen(true)} />}
        </div>
      )}

      {caption && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">{caption}</p>
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

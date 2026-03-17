"use client";

import { useState } from "react";

interface Props {
  interactiveId: string;
  caption?: string;
  scale?: number;
  allowFullscreen?: boolean;
}

export function InteractiveBlock({ interactiveId, caption, scale, allowFullscreen }: Props) {
  const [fullscreen, setFullscreen] = useState(false);
  const src = `/interactives/${interactiveId}.html`;

  const scaleRaw = scale || 0;
  const isScaled = scaleRaw > 0 && scaleRaw < 100;
  const sc = scaleRaw / 100;
  const VW = 1200;
  const VH = 1200;

  return (
    <div className="my-8">
      <div style={{ position: "relative" }}>
        {isScaled ? (
          <div style={{ width: VW * sc, height: VH * sc, overflow: "hidden", borderRadius: "0.75rem" }}>
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
            style={{ width: "100%", minHeight: "600px", border: "none", borderRadius: "0.75rem" }}
            sandbox="allow-scripts allow-same-origin"
          />
        )}

        {/* Fullscreen expand button */}
        {allowFullscreen && (
          <button
            onClick={() => setFullscreen(true)}
            title="Open fullscreen"
            style={{
              position: "absolute", top: isScaled ? 8 : 12, right: isScaled ? 8 : 12,
              width: 32, height: 32, borderRadius: "8px",
              background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
              border: "none", cursor: "pointer", color: "white",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 150ms",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.8)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.6)"; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" />
              <path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" />
            </svg>
          </button>
        )}
      </div>

      {caption && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">{caption}</p>
      )}

      {/* Fullscreen overlay */}
      {fullscreen && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.9)", backdropFilter: "blur(8px)",
            display: "flex", flexDirection: "column",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setFullscreen(false); }}
        >
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "1rem 1.5rem" }}>
            <button
              onClick={() => setFullscreen(false)}
              style={{
                background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "8px", color: "white", cursor: "pointer",
                padding: "0.5rem 1rem", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
              Close
            </button>
          </div>
          <div style={{ flex: 1, padding: "0 1.5rem 1.5rem" }}>
            <iframe
              src={src}
              title={caption || "Interactive"}
              style={{ width: "100%", height: "100%", border: "none", borderRadius: "0.75rem" }}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>
      )}
    </div>
  );
}

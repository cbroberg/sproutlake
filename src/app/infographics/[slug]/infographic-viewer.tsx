"use client";

export function InfographicViewer({
  htmlContent,
  title,
}: {
  htmlContent: string;
  title: string;
}) {
  return (
    <div className="mt-10 mb-12">
      <div className="flex justify-end mb-3">
        <button
          className="text-sm text-gray-500 hover:text-green-400 transition-colors inline-flex items-center gap-1.5"
          onClick={() => {
            const w = window.open("", "_blank");
            if (w) {
              w.document.write(htmlContent);
              w.document.close();
            }
          }}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
          View fullscreen
        </button>
      </div>
      <iframe
        srcDoc={htmlContent}
        sandbox="allow-scripts allow-same-origin"
        className="w-full border border-gray-200 dark:border-white/10 rounded-xl"
        style={{ minHeight: "min(800px, 100vh)" }}
        title={title}
      />
    </div>
  );
}

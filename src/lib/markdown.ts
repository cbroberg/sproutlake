export function renderMarkdown(md: string): string {
  if (!md) return "";

  let html = md
    // CMS embedded nodes — must be FIRST before any other processing
    // File attachments: !!FILE[src|filename|size]
    .replace(/^!!FILE\[([^|]+)\|([^|]*)\|?(.*?)\]$/gm, (_match, src, filename, sizeStr) => {
      const size = parseInt(sizeStr) || 0;
      const sizeLabel = size < 1024 ? `${size} B` : size < 1024 * 1024 ? `${(size / 1024).toFixed(1)} KB` : `${(size / (1024 * 1024)).toFixed(1)} MB`;
      return `<a href="${src}" download="${filename}" class="cms-file-attachment" style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.75rem 1rem;border-radius:0.5rem;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.05);color:#86efac;text-decoration:none;font-size:0.875rem;margin:0.5rem 0;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        <span>${filename}</span>${size > 0 ? `<span style="color:rgba(255,255,255,0.4);font-size:0.75rem">${sizeLabel}</span>` : ""}
      </a>`;
    })
    // Interactive embeds: !!INTERACTIVE[id|title|width:Xpx|height:Ypx]
    .replace(/^!!INTERACTIVE\[([^\]]+)\]$/gm, (_match, inner) => {
      const parts = inner.split("|");
      const id = parts[0];
      let title = "";
      let width = "100%";
      let height = "600px";
      for (let i = 1; i < parts.length; i++) {
        if (parts[i].startsWith("width:")) width = parts[i].slice(6);
        else if (parts[i].startsWith("height:")) height = parts[i].slice(7);
        else if (parts[i].startsWith("align:")) { /* skip align for now */ }
        else if (!title) title = parts[i];
      }
      return `<iframe src="/interactives/${id}.html" data-interactive="${id}" title="${title}" style="width:${width};height:${height};border:none;border-radius:0.75rem;margin:1.5rem 0;"></iframe>`;
    })
    // Legacy HTML comment tokens (backwards compatibility)
    .replace(/^<!-- file:([^|]+)\|([^|]*)\|?(.*?) -->$/gm,
      '<a href="$1" download class="cms-file-attachment">$2</a>')
    .replace(/^<!-- interactive:([^|]+)\|?(.*?) -->$/gm,
      '<iframe src="/interactives/$1.html" data-interactive="$1" title="$2" style="width:100%;min-height:600px;border:none;border-radius:0.75rem;margin:1.5rem 0;"></iframe>')
    // Code blocks (must be before inline code)
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    // Headings
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold text-white mt-8 mb-3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-white mt-10 mb-4">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold text-white mt-10 mb-4">$1</h1>')
    // Bold and italic
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-white/10 px-1.5 py-0.5 rounded text-green-400 text-sm">$1</code>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-gray-300">$1</li>')
    // Wrap consecutive <li> in <ul>
    .replace(
      /(<li[^>]*>.*?<\/li>\n?)+/g,
      '<ul class="list-disc pl-4 my-4 space-y-2">$&</ul>'
    )
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 text-gray-300">$1</li>');

  // GFM Tables: detect header | separator | body rows
  html = html.replace(
    /^(\|.+\|)\n(\|[\s:|-]+\|)\n((?:\|.+\|\n?)+)/gm,
    (_match, headerLine: string, _sep: string, bodyBlock: string) => {
      const headers = headerLine.split("|").filter((c: string) => c.trim()).map((c: string) => c.trim());
      const thCells = headers.map((h: string) => `<th style="padding:0.5rem 0.75rem;text-align:left;border-bottom:2px solid rgba(255,255,255,0.2);color:#fff;font-weight:600">${h}</th>`).join("");
      const rows = bodyBlock.trim().split("\n").map((row: string) => {
        const cells = row.split("|").filter((c: string) => c.trim()).map((c: string) => c.trim());
        return `<tr>${cells.map((c: string) => `<td style="padding:0.5rem 0.75rem;border-bottom:1px solid rgba(255,255,255,0.08);color:#d1d5db">${c}</td>`).join("")}</tr>`;
      }).join("");
      return `<table style="width:100%;border-collapse:collapse;margin:1.5rem 0;font-size:0.875rem"><thead><tr>${thCells}</tr></thead><tbody>${rows}</tbody></table>`;
    }
  );

  html = html
    // Images with optional title containing style hints: ![alt](url "float:left|width:300px")
    .replace(
      /!\[([^\]]*)\]\(([^\s)]+)(?:\s+"([^"]*)")?\)/g,
      (_match, alt, src, title) => {
        let style = "";
        let cls = "rounded-lg my-6 max-w-full";
        if (title) {
          const parts = title.split("|");
          for (const p of parts) {
            const [k, v] = p.split(":");
            if (k === "float" && v === "left") { style += "float:left;margin:0 1.5rem 1rem 0;"; cls += " clear-left"; }
            else if (k === "float" && v === "right") { style += "float:right;margin:0 0 1rem 1.5rem;"; }
            else if (k === "width") { style += `width:${v};max-width:100%;height:auto;`; }
          }
        }
        return `<img src="${src}" alt="${alt}" class="${cls}"${style ? ` style="${style}"` : ""} />`;
      }
    )
    // Links
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-green-400 underline hover:text-green-300">$1</a>'
    )
    // Paragraphs (lines that aren't already HTML — skip tags like <a, <div, <iframe, <audio, <pre, <section)
    .replace(/^(?!<[a-z/!]|$)(.+)$/gm, '<p class="text-gray-300 mb-4 leading-relaxed">$1</p>');

  return html;
}

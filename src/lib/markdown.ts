export function renderMarkdown(md: string): string {
  if (!md) return "";

  let html = md
    // CMS embedded nodes — must be FIRST before any other processing
    // File attachments: !!FILE[src|filename|size]
    .replace(/^!!FILE\[([^|]+)\|([^|]*)\|?(.*?)\]$/gm,
      '<a href="$1" download class="cms-file-attachment">$2</a>')
    // Interactive embeds: !!INTERACTIVE[id|title]
    .replace(/^!!INTERACTIVE\[([^|]+)\|?(.*?)\]$/gm,
      '<iframe src="/interactives/$1.html" data-interactive="$1" title="$2" style="width:100%;min-height:600px;border:none;border-radius:0.75rem;margin:1.5rem 0;"></iframe>')
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
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 text-gray-300">$1</li>')
    // Images (must be before links — ![alt](url) vs [text](url))
    .replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="rounded-lg my-6 max-w-full" />'
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

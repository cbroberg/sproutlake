#!/usr/bin/env node

/**
 * Strip HTML infographic files: remove site chrome (header, footer, nav scripts),
 * keep styles and interactive content, update JSON content files.
 */

const fs = require("fs");
const path = require("path");

const SOURCE_DIR = "/Users/cb/Documents/Projects/SproutLake/site";
const CONTENT_DIR = path.join(__dirname, "..", "content", "infographics");

// Map HTML filenames to JSON slugs
const FILE_MAP = {
  "SproutLake - Hybrid AI Engine Infographic.html": "hybrid-ai-engine.json",
  "SproutLake - Introducing SproutLake AI Anomaly Detection infographic.html": "ai-anomaly-detection.json",
  "SproutLake - Proactive Health Forecaster Infographic.html": "proactive-health-forecaster.json",
  "SproutLake - Statistical Anomaly Detection Infographic.html": "statistical-anomaly-detection.json",
  "SproutLake - The Three-Lane AI Highway Infographic.html": "three-lane-ai-highway.json",
};

function stripHtml(html) {
  let result = html;

  // 1. Extract <style> blocks from <head>
  const styleBlocks = [];
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let match;
  while ((match = styleRegex.exec(html)) !== null) {
    styleBlocks.push(match[0]);
  }

  // 2. Extract <link> tags for fonts (keep Google Fonts)
  const linkTags = [];
  const linkRegex = /<link[^>]*href="https:\/\/fonts\.[^"]*"[^>]*>/gi;
  while ((match = linkRegex.exec(html)) !== null) {
    linkTags.push(match[0]);
  }

  // 3. Extract CDN script tags (Chart.js, Tailwind CDN)
  const cdnScripts = [];
  const cdnScriptRegex = /<script\s+src="https:\/\/cdn[^"]*"[^>]*><\/script>/gi;
  while ((match = cdnScriptRegex.exec(html)) !== null) {
    cdnScripts.push(match[0]);
  }

  // 4. Extract <main> content (everything inside <main>...</main>)
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  let mainContent = "";
  if (mainMatch) {
    mainContent = mainMatch[1];
  } else {
    // Fallback: get content between </header> and <footer>
    const headerEnd = html.indexOf("</header>");
    const footerStart = html.indexOf("<footer");
    if (headerEnd !== -1 && footerStart !== -1) {
      mainContent = html.substring(headerEnd + "</header>".length, footerStart);
    }
  }

  // 5. Extract inline <script> blocks that power charts/interactivity
  // These are inside <main> or right before </main>
  const inlineScripts = [];
  const inlineScriptRegex = /<script>[\s\S]*?<\/script>/gi;
  // Get scripts from the main content area
  let scriptMatch;
  while ((scriptMatch = inlineScriptRegex.exec(mainContent)) !== null) {
    const scriptContent = scriptMatch[0];
    // Skip scripts that only handle mobile menu / nav dropdown
    if (
      scriptContent.includes("mobile-menu-button") &&
      !scriptContent.includes("Chart")
    ) {
      continue;
    }
    inlineScripts.push(scriptContent);
  }

  // Remove inline scripts from main content (we'll re-add them at the end)
  mainContent = mainContent.replace(/<script>[\s\S]*?<\/script>/gi, "");

  // 6. Remove any remaining <header> inside main content (the second "header" used as a title section is fine)
  // The site nav header is already outside <main>, but there might be a decorative <header> inside
  // Actually, looking at the HTML: there's a <header> inside <main> for the title. Keep it.

  // 7. Clean up: remove the inner nav <header> if it has nav links
  // The inner header with class text-center is the title header - keep it
  // Only remove headers that contain <nav> elements
  mainContent = mainContent.replace(
    /<header[^>]*>[\s\S]*?<nav[\s\S]*?<\/header>/gi,
    ""
  );

  // 8. Split inline scripts: separate chart/interactive scripts from nav scripts
  const cleanedScripts = inlineScripts.filter((script) => {
    // Keep scripts that have Chart.js or interactive functionality
    if (script.includes("Chart(") || script.includes("addEventListener")) {
      return true;
    }
    return true; // Keep all remaining scripts
  });

  // 9. From the clean scripts, remove the mobile menu toggle code
  const finalScripts = cleanedScripts.map((script) => {
    // Remove mobile menu and dropdown navigation code blocks
    let cleaned = script;
    // Remove mobile menu button handler
    cleaned = cleaned.replace(
      /\/\/ JavaScript for mobile menu toggle[\s\S]*?(?=\n\t\t\/\/|\n\t<\/script>)/,
      ""
    );
    // Remove dropdown for mobile nav
    cleaned = cleaned.replace(
      /\/\/ Dropdown for mobile nav[\s\S]*?(?=\n\t<\/script>)/,
      ""
    );
    // Remove mobile menu references
    cleaned = cleaned.replace(
      /const mobileMenuButton[\s\S]*?}\s*}\s*/g,
      ""
    );
    cleaned = cleaned.replace(
      /const mobileInfographicsMenuButton[\s\S]*?}\s*}\s*/g,
      ""
    );
    return cleaned;
  });

  // 10. Assemble the stripped HTML
  const parts = [
    ...linkTags,
    ...cdnScripts,
    ...styleBlocks,
    mainContent.trim(),
    ...finalScripts,
  ];

  return parts.join("\n\n");
}

// Process each file
let processed = 0;
for (const [htmlFile, jsonFile] of Object.entries(FILE_MAP)) {
  const htmlPath = path.join(SOURCE_DIR, htmlFile);
  const jsonPath = path.join(CONTENT_DIR, jsonFile);

  if (!fs.existsSync(htmlPath)) {
    console.log(`SKIP: ${htmlFile} not found`);
    continue;
  }
  if (!fs.existsSync(jsonPath)) {
    console.log(`SKIP: ${jsonFile} not found`);
    continue;
  }

  const html = fs.readFileSync(htmlPath, "utf-8");
  const stripped = stripHtml(html);

  const json = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  json.data.htmlContent = stripped;
  json.updatedAt = new Date().toISOString();

  fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2) + "\n");
  console.log(`OK: ${htmlFile} -> ${jsonFile} (${stripped.length} chars)`);
  processed++;
}

console.log(`\nProcessed ${processed} files.`);

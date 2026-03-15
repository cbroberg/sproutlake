#!/bin/bash
# Dev mode auto-sync: pulls latest content from GitHub every 10 seconds
# Run alongside `next dev` to keep local content in sync with CMS changes
echo "🔄 SproutLake dev-sync: watching for CMS content changes..."
echo "   Pulling from GitHub every 10 seconds"
echo "   Press Ctrl+C to stop"
echo ""

while true; do
  OUTPUT=$(git -C "$(dirname "$0")/.." pull --rebase origin main 2>&1)
  if echo "$OUTPUT" | grep -q "Fast-forward\|Updating"; then
    echo "$(date '+%H:%M:%S') ✅ Content updated: $(echo "$OUTPUT" | grep -E '^\s+\w' | head -3)"
  fi
  sleep 10
done

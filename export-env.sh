#!/usr/bin/env bash
# ============================================================
#  export-env.sh — Print all env vars as Vercel CLI commands
#  and as a formatted list for copy-pasting into the dashboard
# ============================================================

ENV_FILE="$(dirname "$0")/.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌  .env file not found at $ENV_FILE"
  exit 1
fi

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║        RIKO'S — Environment Variables Export             ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  OPTION 1 — Vercel CLI (run these in your terminal)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

while IFS= read -r line; do
  # Skip blank lines and comments
  [[ -z "$line" || "$line" == \#* ]] && continue

  key="${line%%=*}"
  value="${line#*=}"
  # Strip surrounding quotes
  value="${value%\"}"
  value="${value#\"}"

  echo "vercel env add $key production <<< \"$value\""
done < "$ENV_FILE"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  OPTION 2 — Dashboard (copy KEY=VALUE pairs below)"
echo "  Paste each line into: Vercel → Project → Settings → Env"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

while IFS= read -r line; do
  [[ -z "$line" || "$line" == \#* ]] && continue
  key="${line%%=*}"
  value="${line#*=}"
  value="${value%\"}"
  value="${value#\"}"
  printf "%-30s = %s\n" "$key" "$value"
done < "$ENV_FILE"

echo ""
echo "⚠️  IMPORTANT: Update APP_URL to your actual Vercel domain!"
echo "   Example: APP_URL=https://rikos.vercel.app"
echo ""

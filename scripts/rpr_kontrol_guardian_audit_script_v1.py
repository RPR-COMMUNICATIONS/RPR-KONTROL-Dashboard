#!/bin/bash
# RPR-KONTROL Guardian Audit Script v1.1
# Objective: Pre-flight verification of the Kontrol CI substrate.
# Authority: SENTINEL PROTOCOL v1.1.0 / MYA-TECH-020 / MYA-TECH-041
# Usage: sh scripts/guardian-audit-kontrol.sh [--major | --minor]

MODE=${1:-"--minor"}
PROJECT_ID="rpr-myaudit"
KONTROL_SITE="myaudit-kontrol-dashboard"

echo "🛡️ SENTINEL: Initiating RPR-KONTROL Audit ($MODE)..."
echo "------------------------------------------------"

# --- LAYER 1: GIT INTEGRITY ---
echo "🔍 Checking Git Status..."
STATUS=$(git status --porcelain)
if [ -n "$STATUS" ]; then
  echo "⚠️ ALERT: Local substrate is DIRTY."
  echo "$STATUS"
else
  echo "✅ Git Status: Clean."
fi

# --- LAYER 2: CONFIGURATION ALIGNMENT ---
echo "🔍 Verifying Kontrol Configuration Substrates..."

FILES=(".firebaserc" "firebase.json" "package.json" ".github/workflows/firebase-hosting-merge.yml")
for FILE in "${FILES[@]}"; do
  if [ -f "$FILE" ]; then
    echo "✅ Presence: $FILE"
  else
    echo "❌ MISSING: $FILE"
    exit 1
  fi
done

# --- LAYER 3: TARGET BINDING ---
if grep -q "$KONTROL_SITE" .firebaserc; then
  echo "✅ Target Binding: $KONTROL_SITE found in .firebaserc"
else
  echo "❌ BINDING ERROR: $KONTROL_SITE mapping missing in .firebaserc"
  exit 1
fi

# Ensure firebase.json is pointing to dist-kontrol
if grep -q "\"public\": \"dist-kontrol\"" firebase.json; then
  echo "✅ Path Alignment: firebase.json → public = dist-kontrol"
else
  echo "❌ PATH ERROR: firebase.json does not reference dist-kontrol as public."
  exit 1
fi

# --- LAYER 4: CONDITIONAL EXECUTION ---
if [ "$MODE" == "--major" ]; then
  echo "------------------------------------------------"
  echo "🏗️ DEEP KONTROL SUBSTRATE AUDIT INITIATED"

  # 4.1 Build Verification
  echo "🔨 Executing Dry-run Build (Kontrol)..."
  npm run build:kontrol
  if [ $? -eq 0 ]; then
    echo "✅ Build: Success (dist-kontrol generated)"
  else
    echo "❌ BUILD FAILED: Check vite.config.ts or dependencies."
    exit 1
  fi

  # 4.2 CI Auth Pre-flight (optional local check)
  echo "🔐 Verifying Firebase CLI Access to $PROJECT_ID..."
  npx firebase-tools projects:list --project "$PROJECT_ID" > /dev/null
  if [ $? -eq 0 ]; then
    echo "✅ Identity: Firebase CLI can reach project $PROJECT_ID."
  else
    echo "❌ AUTH ERROR: Firebase CLI cannot reach $PROJECT_ID from this environment."
    echo "   Note: In GitHub CI, auth is handled by google-github-actions/auth (WIF)."
    exit 1
  fi
else
  echo "------------------------------------------------"
  echo "⚡ LIGHT FORENSIC AUDIT COMPLETE"
fi

echo "------------------------------------------------"
echo "🏁 Kontrol Repo aligned with PRD / Sovereign Substrate ✅"
exit 0
#!/bin/bash
# Guardian Substrate Verification Script
# Purpose: Validate local environment binding and identity manifest presence
# Authority: SENTINEL PROTOCOL v1.1.0
# Classification: TS-Λ3 (CROWN SECRET)

set -e

echo "🔐 Guardian Substrate Verification"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check 1: Identity Manifest (Checking public/data or dist-kontrol)
TARGET_FILE="dist-kontrol/data/GOV-SUBSTRATES.json"
if [ ! -f "$TARGET_FILE" ]; then
    TARGET_FILE="public/data/GOV-SUBSTRATES.json"
fi

if [ ! -f "$TARGET_FILE" ]; then
  echo -e "${RED}❌ GOV-SUBSTRATES.json NOT FOUND${NC}"
  echo "   Action: Ensure manifest exists in public/data or run 'npm run build:kontrol'"
  exit 1
fi

echo -e "${GREEN}✅ Identity Manifest Detected: $TARGET_FILE${NC}"

# Check 2: WIF Provider and Regional Lock
# We verify the provider name and the asia-southeast1 region lock
if grep -q "github-actions-provider-v2" "$TARGET_FILE" && grep -q "asia-southeast1" "$TARGET_FILE"; then
  echo -e "${GREEN}✅ WIF v2 Provider and Regional Lock (asia-southeast1) Verified.${NC}"
else
  echo -e "${RED}❌ ERROR: Manifest identity or region mismatch in $TARGET_FILE.${NC}"
  exit 1
fi

# Check 3: Firebase Config Parity
if [ -f ".firebaserc" ] && grep -q "kontrol" .firebaserc; then
  echo -e "${GREEN}✅ Firebase 'kontrol' target verified in .firebaserc.${NC}"
else
  echo -e "${RED}❌ ERROR: .firebaserc missing or 'kontrol' target not bound.${NC}"
  exit 1
fi

# Check 4: Leakage Scan (Forensic Guardrail)
# Scanning source code for forbidden clinical codenames (MYAUDIT, SENTINEL, etc. in UI context)
echo "Scanning for clinical codename leakage..."
LEAK_CHECK=$(grep -rnE "MYAUDIT|SENTINEL|DR RP|AOUTHA" src/ --exclude-dir=node_modules || true)
if [ ! -z "$LEAK_CHECK" ]; then
  echo -e "${RED}❌ CRITICAL: Clinical leakage detected in source!${NC}"
  echo "$LEAK_CHECK"
  exit 1
else
  echo -e "${GREEN}✅ No clinical codenames detected in src/ directory.${NC}"
fi

echo ""
echo "===================================="
echo -e "${GREEN}✅ SUBSTRATE VERIFICATION COMPLETE${NC}"
echo "===================================="

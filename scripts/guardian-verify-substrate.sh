#!/bin/bash
# Guardian Substrate Verification Script
# Authority: SENTINEL PROTOCOL v1.1.0 / MYA-GOV-008C
# Purpose: Pre-deployment verification for RPR-KONTROL-Dashboard hosting:kontrol target

set -e

PROJECT_ID="rpr-myaudit"
KONTROL_SITE="myaudit-kontrol-dashboard"
EXPECTED_REGION="asia-southeast1"
EXPECTED_WIF_PROVIDER="github-actions-provider-v2"
EXPECTED_REPO="butterdime/rpr-kontrol-dashboard"

echo "🛡️ SENTINEL: Initiating Substrate Verification..."
echo "------------------------------------------------"

# Check 1: .firebaserc configuration
echo "🔍 Checking .firebaserc..."
if ! grep -q "\"kontrol\"" .firebaserc || ! grep -q "$KONTROL_SITE" .firebaserc; then
  echo "❌ ERROR: .firebaserc missing kontrol target or incorrect site mapping"
  exit 1
fi
echo "✅ .firebaserc: kontrol target → $KONTROL_SITE"

# Check 2: firebase.json hosting config
echo "🔍 Checking firebase.json..."
if ! grep -q "\"target\": \"kontrol\"" firebase.json || ! grep -q "\"public\": \"dist-kontrol\"" firebase.json; then
  echo "❌ ERROR: firebase.json missing kontrol hosting config or incorrect public path"
  exit 1
fi
echo "✅ firebase.json: kontrol target with public: dist-kontrol"

# Check 3: Manifest structure (if build exists)
MANIFEST_PATH="dist-kontrol/data/GOV-SUBSTRATES.json"
if [ -f "$MANIFEST_PATH" ]; then
  echo "🔍 Checking GOV-SUBSTRATES.json structure..."
  
  # Verify substrates.clinical
  if ! grep -q "\"repo\": \"Butterdime/MYAUDIT\"" "$MANIFEST_PATH" || \
     ! grep -q "\"site_id\": \"primary\"" "$MANIFEST_PATH" || \
     ! grep -q "\"firebase_project\": \"$PROJECT_ID\"" "$MANIFEST_PATH" || \
     ! grep -q "\"region\": \"$EXPECTED_REGION\"" "$MANIFEST_PATH"; then
    echo "❌ ERROR: substrates.clinical structure invalid"
    exit 1
  fi
  
  # Verify substrates.governance
  if ! grep -q "\"repo\": \"Butterdime/RPR-KONTROL-Dashboard\"" "$MANIFEST_PATH" || \
     ! grep -q "\"site_id\": \"$KONTROL_SITE\"" "$MANIFEST_PATH"; then
    echo "❌ ERROR: substrates.governance structure invalid"
    exit 1
  fi
  
  # Verify wif_config
  if ! grep -q "\"provider\": \"$EXPECTED_WIF_PROVIDER\"" "$MANIFEST_PATH" || \
     ! grep -q "\"condition\"" "$MANIFEST_PATH"; then
    echo "❌ ERROR: wif_config structure invalid"
    exit 1
  fi
  
  # Verify runtime
  if ! grep -q "\"runtime\"" "$MANIFEST_PATH" || ! grep -q "\"timestamp\"" "$MANIFEST_PATH"; then
    echo "❌ ERROR: runtime section missing"
    exit 1
  fi
  
  echo "✅ GOV-SUBSTRATES.json: Structure valid"
else
  echo "⚠️  WARNING: $MANIFEST_PATH not found (first build?)"
fi

# Check 4: Clinical codename leakage scan
echo "🔍 Scanning for clinical codename leakage..."
LEAKAGE_PATTERNS=("MYAUDIT Phase 1" "DR RP" "THE AOUTHA")
LEAKAGE_FOUND=0

for pattern in "${LEAKAGE_PATTERNS[@]}"; do
  if grep -r "$pattern" dist-kontrol/assets/*.js 2>/dev/null | grep -v "SENTINEL" > /dev/null; then
    echo "❌ ERROR: Clinical codename leakage found: $pattern"
    LEAKAGE_FOUND=1
  fi
done

# SENTINEL is allowed in governance code (internal), but check for visible UI strings
if grep -r "MYAUDIT Phase 1" dist-kontrol/assets/*.js 2>/dev/null | grep -q "projectName"; then
  echo "❌ ERROR: Clinical codename 'MYAUDIT Phase 1' found in UI-facing code"
  LEAKAGE_FOUND=1
fi

if [ $LEAKAGE_FOUND -eq 1 ]; then
  exit 1
fi
echo "✅ No clinical codename leakage detected"

echo "------------------------------------------------"
echo "🏁 Substrate Verification Complete ✅"
exit 0

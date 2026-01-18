#!/bin/bash
# Guardian Build & Deploy Orchestrator
# Purpose: Master script for executing a hardened build and deployment sequence.
# Authority: SENTINEL PROTOCOL v1.1.0
# Classification: TS-Λ3 (CROWN SECRET)

# Usage: sh scripts/guardian-build-deploy.sh [manual|ci]
MODE=${1:-"manual"} # Default to manual

set -e

# --- Configuration ---
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# --- Banner ---
echo -e "${BLUE}====================================${NC}"
echo -e "${BLUE} RPR KONTROL: Hardened Deployment   ${NC}"
echo -e "${BLUE}====================================${NC}"
echo "MODE: $MODE"
echo ""

# --- Step 1: Substrate Verification ---
echo "--- [1/3] Verifying Substrate Integrity ---"
sh scripts/guardian-verify-substrate.sh
echo "Verification complete."
echo ""

# --- Step 2: Build & Manifest Generation ---
echo "--- [2/3] Building Kontrol Target ---"
npm run build:kontrol
echo "Build complete. Artifacts generated in dist-kontrol/."
echo ""

# --- Step 3: Deployment Trigger ---
echo "--- [3/3] Finalizing Deployment ---"
if [ "$MODE" == "ci" ]; then
    echo "CI Mode: Deployment will be handled by the Firebase GitHub Action."
    echo "This script's responsibility ends here."
else
    echo "MANUAL Mode: To trigger the v2 Identity Bridge deployment:"
    echo "  1. git add ."
    echo "  2. git commit -m 'feat: hardened substrate deployment'"
    echo "  3. git push origin main"
fi
echo ""

# --- Completion ---
echo -e "${GREEN}====================================${NC}"
echo -e "${GREEN} ✅ ORCHESTRATION COMPLETE         ${NC}"
echo -e "${GREEN}====================================${NC}"

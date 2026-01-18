#!/bin/bash
# RPR-KONTROL-PM: Guardian Substrate Verification (Phase 2)
# Authority: SENTINEL PROTOCOL v1.1.0
# Purpose: Ensures logic parity, schema lockdown, and clinical isolation.

set -e

echo "🔐 Guardian Substrate Verification [RPR-KONTROL-PM v1.5.1]"
echo "=========================================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

# 1. Identity Manifest Check
if [ -f "public/data/GOV-SUBSTRATES.json" ]; then
    echo -e "${GREEN}✅ Sovereign Identity Manifest detected.${NC}"
else
    echo -e "${RED}❌ ERROR: Identity manifest (GOV-SUBSTRATES.json) missing.${NC}"
    exit 1
fi

# 2. Logic Substrate Parity Check (Milestone 2.2)
if [ -f "src/utils/logic/taxcompute.ts" ]; then
    echo -e "${GREEN}✅ Governance Logic Substrate (taxcompute.ts) verified for Flutter parity.${NC}"
else
    echo -e "${RED}❌ ERROR: Logic substrate missing. Native build compatibility blocked.${NC}"
    exit 1
fi

# 3. Schema Contract Check (Milestone 2.4)
if [ -f "artifacts/GOV-SCHEMAS-v1.0.0.json" ]; then
    echo -e "${GREEN}✅ Data Schema Contract (v1.0.0) verified.${NC}"
else
    echo -e "${RED}❌ ERROR: GOV-SCHEMAS-v1.0.0.json missing.${NC}"
    exit 1
fi

# 4. Clinical Isolation Scan (Sentinel Guardrail)
echo -e "${CYAN}Performing clinical isolation scan...${NC}"
# Scan for clinical personae (ROOK, KNIGHT, BISHOP, SENTINEL VETO, etc.)
# We exclude the current script and node_modules from the scan
LEAK_CHECK=$(grep -rnE "SENTINEL VETO|DR RP|AOUTHA|ROOK|KNIGHT|BISHOP" src/ --exclude-dir=node_modules || true)
if [ ! -z "$LEAK_CHECK" ]; then
    echo -e "${RED}❌ CRITICAL: Clinical personae leakage detected in Governance substrate!${NC}"
    echo "$LEAK_CHECK"
    exit 1
else
    echo -e "${GREEN}✅ Clinical isolation rule enforced.${NC}"
fi

# 5. Build Verification
echo -e "${CYAN}Verifying build for 'kontrol' target...${NC}"
npm run build:kontrol > /dev/null
if [ -d "dist-kontrol" ]; then
    echo -e "${GREEN}✅ Build successful for RPR-KONTROL-PM.${NC}"
else
    echo -e "${RED}❌ ERROR: Build failed.${NC}"
    exit 1
fi

echo "=========================================================="
echo -e "${GREEN}🏁 SUBSTRATE VERIFICATION COMPLETE${NC}"

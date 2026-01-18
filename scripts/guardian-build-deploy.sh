#!/bin/bash
# Guardian Build and Deploy Script
# Authority: SENTINEL PROTOCOL v1.1.0 / MYA-GOV-008C
# Usage: sh scripts/guardian-build-deploy.sh [ci|manual]

MODE=${1:-"ci"}

if [ "$MODE" != "ci" ] && [ "$MODE" != "manual" ]; then
  echo "❌ ERROR: Mode must be 'ci' or 'manual'"
  exit 1
fi

echo "🛡️ SENTINEL: Initiating Build and Deploy ($MODE mode)..."
echo "------------------------------------------------"

# Pre-build verification
echo "📋 Step 1: Pre-build substrate verification..."
if ! sh scripts/guardian-verify-substrate.sh; then
  echo "❌ Pre-build verification failed. Aborting."
  exit 1
fi

# Install dependencies
echo "📦 Step 2: Installing dependencies..."
npm ci
if [ $? -ne 0 ]; then
  echo "❌ npm ci failed. Aborting."
  exit 1
fi

# Build
echo "🏗️  Step 3: Building kontrol target..."
npm run build:kontrol
if [ $? -ne 0 ]; then
  echo "❌ Build failed. Aborting."
  exit 1
fi

# Post-build verification
echo "📋 Step 4: Post-build substrate verification..."
if ! sh scripts/guardian-verify-substrate.sh; then
  echo "❌ Post-build verification failed. Aborting."
  exit 1
fi

# Deploy (manual mode only)
if [ "$MODE" == "manual" ]; then
  echo "🚀 Step 5: Deploying to hosting:kontrol..."
  firebase deploy --only hosting:kontrol --project rpr-myaudit
  if [ $? -ne 0 ]; then
    echo "❌ Deploy failed."
    exit 1
  fi
  echo "✅ Deployment complete."
else
  echo "ℹ️  Step 5: CI mode - skipping local deploy"
  echo "   Deployment will be handled by GitHub Actions workflow (guardian-saas.yml)"
  echo "   Push to main branch to trigger CI/CD deployment."
fi

echo "------------------------------------------------"
echo "🏁 Build and Deploy Complete ✅"
exit 0

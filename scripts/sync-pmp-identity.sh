#!/bin/bash
# Objective: Sync Identity and Security from Clinical to PMP
# Authority: RPR-KONTROL-MASTER

SRC="/Users/puvansivanasan/PERPLEXITY-NEW/JOBS/2026-002-MYAUDIT"
DEST="/Users/puvansivanasan/PERPLEXITY-NEW/JOBS/2026-003-RPR-KONTROL-MASTER/RPR-KONTROL-PMP"

echo "🛡️ SENTINEL: Syncing Substrate Identity to PMP..."

# Create directories if they don't exist
mkdir -p "$DEST/src/lib"
mkdir -p "$DEST/scripts"
mkdir -p "$DEST/docs"

# Sync Infrastructure Manifests
cp "$SRC/firebase.json" "$DEST/firebase.json"
cp "$SRC/.firebaserc" "$DEST/.firebaserc"
cp "$SRC/firestore.indexes.json" "$DEST/firestore.indexes.json"

# Sync Security Rules (PMP currently mirrors clinical rules)
cp "$SRC/firestore.rules" "$DEST/firestore.rules"

# Sync Identity Library (source may be src/lib/firebase.ts or src/firebase.ts)
if [ -f "$SRC/src/lib/firebase.ts" ]; then
  cp "$SRC/src/lib/firebase.ts" "$DEST/src/lib/firebase.ts"
elif [ -f "$SRC/src/firebase.ts" ]; then
  cp "$SRC/src/firebase.ts" "$DEST/src/lib/firebase.ts"
fi

echo "✅ Identity sync complete."

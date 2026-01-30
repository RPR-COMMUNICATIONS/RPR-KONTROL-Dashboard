#!/usr/bin/env bash
# RPR-KONTROL verification gate: assert .firebaserc projects.kontrol = rpr-kontrol-pm-prod
# Run from repo root: ./scripts/ci-kontrol-preflight.sh

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FIREBASERC="${ROOT}/.firebaserc"
EXPECTED="rpr-kontrol-pm-prod"

if [ ! -f "$FIREBASERC" ]; then
  echo "Error: .firebaserc not found at $FIREBASERC"
  exit 1
fi

KONTROL="$(jq -r '.projects.kontrol' "$FIREBASERC")"
if [ "$KONTROL" != "$EXPECTED" ]; then
  echo "Error: projects.kontrol must be $EXPECTED, got: $KONTROL"
  exit 1
fi

echo "OK: projects.kontrol = $KONTROL"

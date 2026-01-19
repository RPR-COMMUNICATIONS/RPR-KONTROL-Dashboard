#!/usr/bin/env bash
/**
 * RPR-KONTROL: GitHub Actions Forensic Cleanup (Hardened v2)
 * Role: Purges old workflow run logs and artifacts to stabilize the UI.
 * Classification: TS-Λ3
 * Authority: SENTINEL PROTOCOL v1.1.0
 * * Logic: Strips illegal control characters (0x00-0x1F) and monitors HTTP status
 * to prevent parser crashes and infinite permission loops.
 */

set -euo pipefail

# Mandatory Environment Check
OWNER="${GH_OWNER:-}"
REPO="${GH_REPO:-}"
TOKEN="${GH_TOKEN:-}"

if [[ -z "${OWNER}" || -z "${REPO}" || -z "${TOKEN}" ]]; then
  echo "❌ Error: GH_OWNER, GH_REPO, and GH_TOKEN environment variables must be set."
  echo "Usage: export GH_OWNER='PRP-COMMUNICATIONS-LLC' && export GH_REPO='RPR-KONTROL-Dashboard' && export GH_TOKEN='ghp_xxx' && $0"
  exit 1
fi

BASE_API="https://api.github.com/repos/${OWNER}/${REPO}"

echo "🛰️ Initializing forensic cleanup for ${OWNER}/${REPO}..."

while true; do
  # Fetch the latest batch of runs (raw data)
  runs_raw=$(curl -sS \
    -H "Authorization: token ${TOKEN}" \
    -H "Accept: application/vnd.github+json" \
    "${BASE_API}/actions/runs?per_page=100")

  # Strip ASCII control characters 0x00–0x1F except tab (0x09), LF (0x0A), CR (0x0D)
  runs_json=$(printf '%s' "$runs_raw" | tr -d '\000\001\002\003\004\005\006\007\010\013\014\016\017\020\021\022\023\024\025\026\027\030\031\032\033\034\035\036\037')

  # Sanity Check: Abort if JSON is malformed even after cleaning
  if ! printf '%s\n' "$runs_json" | jq empty >/dev/null 2>&1; then
    echo "❌ CRITICAL: GitHub API returned malformed JSON. Aborting to prevent unsafe deletes."
    exit 1
  fi

  # Calculate total count from the JSON substrate
  run_count=$(printf '%s\n' "$runs_json" | jq -r '.total_count // 0')

  if [[ "$run_count" -eq 0 ]]; then
    echo "✅ No more workflow runs found. Actions UI is clean."
    break
  fi

  echo "🔍 Found ${run_count} runs. Purging batch of up to 100..."

  # Iterate and delete each run ID with HTTP status check
  printf '%s\n' "$runs_json" | jq -r '.workflow_runs[].id' | while read -r run_id; do
    echo "🗑️ Deleting run ${run_id}..."
    http_status=$(curl -sS -o /dev/null -w "%{http_code}" -X DELETE \
      -H "Authorization: token ${TOKEN}" \
      -H "Accept: application/vnd.github+json" \
      "${BASE_API}/actions/runs/${run_id}")

    if [[ "${http_status}" != "204" ]]; then
      echo "   ⚠️ Warning: HTTP ${http_status} encountered. Check token scopes (repo, actions:write)."
      # If unauthorized, we break the inner loop to re-evaluate state
      if [[ "${http_status}" == "403" || "${http_status}" == "401" ]]; then
        echo "   ❌ Permission Denied. Terminating purge."
        exit 1
      fi
    fi
  done
  
  # Small pause to mitigate secondary rate limiting
  sleep 1
done

echo "🏁 Forensic cleanup complete."
/**
 * RPR-KONTROL Manifest Generator
 * Purpose: Generates the authoritative GOV-SUBSTRATES.json manifest during build.
 * Authority: SENTINEL PROTOCOL v1.1.0 (MYA-GOV-008C)
 * Classification: TS-Λ3
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_PATH = path.join(__dirname, '../dist-kontrol');
const DATA_PATH = path.join(DIST_PATH, 'data');
const MANIFEST_PATH = path.join(DATA_PATH, 'GOV-SUBSTRATES.json');

// Ensure the target directory exists
if (!fs.existsSync(DATA_PATH)) {
  fs.mkdirSync(DATA_PATH, { recursive: true });
}

const manifest = {
  substrates: {
    clinical: {
      repo: "Butterdime/MYAUDIT",
      site_id: "primary",
      firebase_project: "rpr-myaudit",
      region: "asia-southeast1"
    },
    governance: {
      repo: "Butterdime/RPR-KONTROL-Dashboard",
      site_id: "myaudit-kontrol-dashboard",
      firebase_project: "rpr-myaudit",
      region: "asia-southeast1"
    }
  },
  wif_config: {
    pool: "github-actions-pool",
    provider: "github-actions-provider-v2",
    condition: "attribute.repository==\"butterdime/rpr-kontrol-dashboard\"",
    enforced_case: true
  },
  runtime: {
    provider: "github-actions-provider-v2",
    identity: "myaudit-kontrol-ci",
    timestamp: new Date().toISOString()
  }
};

try {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`✅ SENTINEL: Sovereign manifest generated at ${MANIFEST_PATH}`);
} catch (error) {
  console.error(`❌ SENTINEL ERROR: Failed to generate manifest: ${error.message}`);
  process.exit(1);
}

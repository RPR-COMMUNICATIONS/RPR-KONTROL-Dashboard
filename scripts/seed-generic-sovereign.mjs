#!/usr/bin/env node
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Mechanical Execution for Harbor A (Singapore)
// Requires Application Default Credentials (e.g. gcloud auth application-default login)
const app = initializeApp({ projectId: 'rpr-kontrol-pm-prod' });
const db = getFirestore(app);

async function seedGenericGovernance() {
  console.log('🏗️  Initiating Generic Sovereign DNA Injection...');

  const genericRegistry = [
    {
      id: 'RULE_GEN_CAPEX',
      trigger: 'automation_procurement',
      taxCode: 'P.U.(A) 36/2018',
      advisory: '200% Capital Allowance eligibility detected.',
    },
    {
      id: 'RULE_GEN_SVA',
      trigger: 'low_value_asset',
      taxCode: 'Paragraph 19A',
      advisory: 'Immediate write-off applicable for assets < RM 2,000.',
    },
  ];

  const batch = db.batch();
  genericRegistry.forEach((rule) => {
    const ref = db.collection('compliance_rules').doc(rule.id);
    batch.set(ref, {
      ...rule,
      data_residency: 'SG',
      deployed_at: FieldValue.serverTimestamp(),
      source: 'cursor_sovereign_seed',
    });
  });

  await batch.commit();
  console.log('✅ Singapore Harbor populated with Generic Governance Rules.');
}

seedGenericGovernance().catch(console.error);

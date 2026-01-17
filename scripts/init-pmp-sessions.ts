import admin from 'firebase-admin';
import { applicationDefault } from 'firebase-admin/app';

// Initialize Admin SDK with Application Default Credentials
admin.initializeApp({
  credential: applicationDefault(),
  projectId: 'rpr-myaudit'
});

const db = admin.firestore();

async function initPmpSessions() {
  console.log('🛡️ RPR-KONTROL: Initializing PMP Governance Session...');

  // Generate session ID
  const sessionId = `pmp-${Date.now()}`;
  const timestamp = new Date().toISOString();

  // Create initial governance session document
  const sessionData = {
    sessionId: sessionId,
    timestamp: timestamp,
    projectCode: 'PMP-INIT',
    classification: 'TS-Λ3 (CROWN SECRET)',
    status: 'ACTIVE',
    deploymentMarker: true,
    metadata: {
      initializedBy: 'PMP-BRING-UP',
      version: '1.0.0',
      substrate: 'rpr-myaudit'
    }
  };

  try {
    // Write governance session (immutable - write once)
    await db.collection('governance_sessions').doc(sessionId).set(sessionData);
    console.log(`✅ Created governance session: ${sessionId}`);

    // Create initial agent log as child document
    const logId = `log-${Date.now()}`;
    const agentLogData = {
      agent_name: 'PMP-INITIALIZER',
      prompt_id: `prompt-${Date.now()}`,
      timestamp: timestamp,
      metadata: {
        action: 'PMP_BRING_UP',
        sessionId: sessionId,
        status: 'SUCCESS',
        message: 'RPR-KONTROL PMP Project Management Plane initialized'
      },
      content: 'PMP initialization complete. Governance session anchored.'
    };

    await db.collection('agent_logs').doc(logId).set(agentLogData);
    console.log(`✅ Created agent log: ${logId}`);

    console.log('✨ PMP session initialization complete.');
    console.log(`📋 Session ID: ${sessionId}`);
    console.log(`📝 Log ID: ${logId}`);
  } catch (error) {
    console.error('❌ Error initializing PMP sessions:', error);
    throw error;
  }
}

initPmpSessions().catch(console.error);

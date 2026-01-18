
import { AgentType, Classification, Phase, ArtifactType, DecisionAuthority } from './types';

export const AGENTS_TRACKED: AgentType[] = [
  AgentType.GEMINI,
  AgentType.PERPLEXITY,
  AgentType.JULES,
  AgentType.COPILOT,
  AgentType.FIREBASE,
];

export const INITIAL_CONTEXT = {
  projectName: 'RPR-KONTROL Governance',
  phase: Phase.PLANNING,
  objective: 'Review and define the initial architecture for RPR-KONTROL Governance, focusing on backend integration and UI mockups.',
};

export const INITIAL_CLASSIFICATION = Classification.TS_LAMBDA_3;
export const INITIAL_HUMAN_OPERATOR = 'founder';
export const INITIAL_DUAL_STATE = {
  validation_posture: 'COMPLIANT',
  defense_readiness: 'READY',
  last_audit_checkpoint: new Date().toISOString(),
} as const; // Added as const to prevent type widening


// Mock values for agent performance
export const MOCK_AGENT_PERFORMANCE = {
  [AgentType.GEMINI]: {
    taskCompletion: 0.95,
    governanceAdherence: 1.0,
    responseAccuracy: 0.92,
    interventionCount: 0,
  },
  [AgentType.PERPLEXITY]: {
    taskCompletion: 0.98,
    governanceAdherence: 1.0,
    responseAccuracy: 0.95,
    interventionCount: 0,
  },
  [AgentType.JULES]: {
    taskCompletion: 0.92,
    governanceAdherence: 1.0,
    responseAccuracy: 0.88,
    interventionCount: 1,
  },
  [AgentType.COPILOT]: {
    taskCompletion: 0.90,
    governanceAdherence: 0.9, // N/A is represented by a high value with a note
    responseAccuracy: 0.85,
    interventionCount: 2,
  },
  [AgentType.FIREBASE]: {
    taskCompletion: 0.93,
    governanceAdherence: 1.0,
    responseAccuracy: 0.90,
    interventionCount: 0,
  },
};

export const MOCK_ARTIFACTS = [
  {
    type: ArtifactType.PRD,
    title: "RPR-KONTROL Governance Specification",
    version: "v1.2.5",
    filePath: "docs/PRDs/MYAUDIT_Phase1_v1.2.5.pdf",
    driveFileId: "1P_2B-C4D5E6F7G8H9I0J1K2L3M4N5O6" // Example Drive ID
  },
  {
    type: ArtifactType.CODE,
    title: "SovereignHeader.tsx",
    version: "v1.0.0",
    filePath: "components/SovereignHeader.tsx",
    sha256: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
    driveFileId: "1Q_2R-S4T5U6V7W8X9Y0Z1A2B3C4D5E6"
  },
  {
    type: ArtifactType.CODE,
    title: "TabRail.tsx",
    version: "v1.0.0",
    filePath: "components/TabRail.tsx",
    sha256: "b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3",
    driveFileId: "1S_2T-U4V5W6X7Y8Z9A0B1C2D3E4F5G6"
  },
  {
    type: ArtifactType.GOVERNANCE_DOC,
    title: "MYA-TECH-009: API Security Policy",
    version: "v1.0.0",
    filePath: "docs/governance/MYA-TECH-009.md",
    driveFileId: "1T_2U-V4W5X6Y7Z8A9B0C1D2E3F4G5H6"
  },
  {
    type: ArtifactType.GOVERNANCE_DOC,
    title: "MYA-TECH-010: Data Privacy Standard",
    version: "v1.0.0",
    filePath: "docs/governance/MYA-TECH-010.md",
    driveFileId: "1V_2W-X4Y5Z6A7B8C9D0E1F2G3H4I5J6"
  },
  {
    type: ArtifactType.DEPLOYMENT,
    title: "MYAUDIT UI Live Deployment",
    version: "v1.0.0",
    uri: "https://myaudit-ui.onrender.com"
  },
  {
    type: ArtifactType.NOTEBOOK,
    title: "YA 2017 Harness Tests",
    version: "v1.0.0",
    filePath: "forensics/YA_2017_Harness.ipynb",
    driveFileId: "1X_2Y-Z4A5B6C7D8E9F0G1H2I3J4K5L6",
    drivePath: "RPR-KONTROL-DOCUMENTS/MYAUDIT/forensics/"
  },
  {
    type: ArtifactType.SCHEMA,
    title: "Firestore User Schema",
    version: "v1.1.0",
    filePath: "schemas/firestore_user.json",
    driveFileId: "1Z_2A-B4C5D6E7F8G9H0I1J2K3L4M5N6",
    drivePath: "RPR-KONTROL-DOCUMENTS/MYAUDIT/schemas/"
  }
];

export const MOCK_DECISIONS_LOG = [
  {
    decision: "Proceed with Firestore for core data storage.",
    rationale: "Leveraging existing MYAUDIT architecture and real-time capabilities.",
    authority: DecisionAuthority.FOUNDER,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    sourceSessionId: "RPR-2026-000-SESSION", // Default for active session
  },
  {
    decision: "Implement server-side rendering for initial page load optimization.",
    rationale: "Improve SEO and initial load performance for public-facing components.",
    authority: DecisionAuthority.AGENT_AUTONOMOUS,
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    sourceSessionId: "RPR-2026-000-SESSION",
  },
  {
    decision: "Escalated ethical decision regarding data anonymization strategy.",
    rationale: "Ambiguity in handling sensitive user attributes during aggregation.",
    authority: DecisionAuthority.SENTINEL_PROTOCOL,
    timestamp: new Date(Date.now() - 900000).toISOString(),
    sourceSessionId: "RPR-2026-000-SESSION",
  },
];


// --- MOCK PAST SESSIONS FOR SEARCH FUNCTIONALITY AND PROJECT OVERVIEW ---
export const MOCK_PAST_SESSIONS = [
  {
    sessionId: "RPR-2025-001-SESSION",
    projectCode: "PROJ-2025-001-DESIGN",
    timestamp: new Date(Date.now() - 86400000 * 30).toISOString(), // 30 days ago
    classification: Classification.INTERNAL,
    agentsInvolved: [AgentType.PERPLEXITY, AgentType.JULES],
    humanOperator: "team_member_001",
    context: {
      projectName: "Project Nova UI/UX Wireframes",
      phase: Phase.PLANNING,
      objective: "Develop initial wireframes and user flows for Project Nova's mobile interface.",
    },
    conversation: [
      { turn: 1, agent: AgentType.HUMAN, content: "Start a session for Project Nova UI/UX. Focus on core user flows.", artifacts: [], timestamp: new Date(Date.now() - 86400000 * 30).toISOString() },
      { turn: 2, agent: AgentType.PERPLEXITY, content: "Understood. Initiating Project Nova UI/UX session. Perplexity will outline initial user personas.", artifacts: [], timestamp: new Date(Date.now() - 86400000 * 29.9).toISOString() },
      { turn: 3, agent: AgentType.HUMAN, content: "Great. Jules, can you propose some initial wireframe ideas for the login and dashboard screens?", artifacts: [], timestamp: new Date(Date.now() - 86400000 * 29.8).toISOString() },
      { turn: 4, agent: AgentType.JULES, content: "Affirmative. Jules generating minimalist wireframes focusing on accessibility and intuitive navigation for login. Keywords: clean, secure.", artifacts: [], timestamp: new Date(Date.now() - 86400000 * 29.7).toISOString() },
    ],
    performanceMetrics: {
      taskCompletion: 0.85,
      governanceAdherence: 0.95,
      responseAccuracy: 0.88,
      crossAgentCoordination: 0.90,
      founderInterventionRate: 0.10,
    },
    artifactsProduced: [
      { type: ArtifactType.SPEC, title: "Nova UI Wireframe Spec v0.5", version: "v0.5", filePath: "docs/nova-ui/wireframe_spec.pdf", driveFileId: "1A_2B-C3D4E5F6G7H8I9J0K1L2M3N4O5", drivePath: "RPR-KONTROL-DOCUMENTS/RPR-INTERNAL/specs/" }
    ],
    decisionsLog: [
      { decision: "Prioritize mobile-first design.", rationale: "Target audience primarily uses mobile devices.", authority: DecisionAuthority.FOUNDER, timestamp: new Date(Date.now() - 86400000 * 29).toISOString(), sourceSessionId: "RPR-2025-001-SESSION" },
      { decision: "Adopt a dark theme for visual consistency.", rationale: "Aligns with RPR brand guidelines and reduces eye strain.", authority: DecisionAuthority.AGENT_AUTONOMOUS, timestamp: new Date(Date.now() - 86400000 * 28).toISOString(), sourceSessionId: "RPR-2025-001-SESSION" }
    ],
    dual_state: {
      validation_posture: 'COMPLIANT',
      defense_readiness: 'READY',
      last_audit_checkpoint: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
  },
  {
    sessionId: "RPR-2025-002-SESSION",
    projectCode: "CLIENTA-2025-002-BACKEND",
    timestamp: new Date(Date.now() - 86400000 * 15).toISOString(), // 15 days ago
    classification: Classification.TS_LAMBDA_2,
    agentsInvolved: [AgentType.GEMINI, AgentType.COPILOT, AgentType.FIREBASE],
    humanOperator: "founder",
    context: {
      projectName: "Client A Backend Integration",
      phase: Phase.IMPLEMENTATION,
      objective: "Integrate Client A's legacy API with our new microservices architecture.",
    },
    conversation: [
      { turn: 1, agent: AgentType.HUMAN, content: "Initiate backend integration for Client A. Focus on secure data transfer. Gemini, analyze their API docs.", artifacts: [], timestamp: new Date(Date.now() - 86400000 * 15).toISOString() },
      { turn: 2, agent: AgentType.GEMINI, content: "Analyzing Client A API documentation. Identifying key endpoints and data schemas for integration. Security protocols will be paramount.", artifacts: [], timestamp: new Date(Date.now() - 86400000 * 14.9).toISOString() },
      { turn: 3, agent: AgentType.HUMAN, content: "Copilot, draft a GoLang service for user authentication against Client A's OAuth2 provider.", artifacts: [], timestamp: new Date(Date.now() - 86400000 * 14.8).toISOString() },
      { turn: 4, agent: AgentType.COPILOT, content: "Drafting GoLang service for OAuth2 authentication. Including error handling and token refresh mechanisms. Keywords: GoLang, OAuth2.", artifacts: [], timestamp: new Date(Date.now() - 86400000 * 14.7).toISOString() },
    ],
    performanceMetrics: {
      taskCompletion: 0.92,
      governanceAdherence: 0.98,
      responseAccuracy: 0.90,
      crossAgentCoordination: 0.92,
      founderInterventionRate: 0.05,
    },
    artifactsProduced: [
      { type: ArtifactType.CODE, title: "auth_service.go", version: "v1.0.1", filePath: "services/clientA/auth_service.go", sha256: "hash123abc", driveFileId: "1C_2D-E3F4G5H6I7J8K9L0M1N2O3P4Q5", drivePath: "RPR-KONTROL-DOCUMENTS/CLIENTA/code/" }
    ],
    decisionsLog: [
      { decision: "Use Kafka for inter-service communication.", rationale: "Ensures high throughput and fault tolerance for data streams.", authority: DecisionAuthority.AGENT_AUTONOMOUS, timestamp: new Date(Date.now() - 86400000 * 14).toISOString(), sourceSessionId: "RPR-2025-002-SESSION" },
      { decision: "Implement distributed tracing with OpenTelemetry.", rationale: "Essential for debugging microservices in production.", authority: DecisionAuthority.SENTINEL_PROTOCOL, timestamp: new Date(Date.now() - 86400000 * 13).toISOString(), sourceSessionId: "RPR-2025-002-SESSION" }
    ],
    dual_state: {
      validation_posture: 'INCOMPLETE',
      defense_readiness: 'DORMANT',
      last_audit_checkpoint: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
  },
  {
    sessionId: "RPR-2025-003-SESSION",
    projectCode: "INTERNAL-2025-003-OPS",
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    classification: Classification.PUBLIC,
    agentsInvolved: [AgentType.GEMINI, AgentType.PERPLEXITY],
    humanOperator: "team_member_002",
    context: {
      projectName: "Internal Ops Dashboard Refinement",
      phase: Phase.TESTING,
      objective: "Review and optimize queries for the internal operations dashboard for better performance.",
    },
    conversation: [
      { turn: 1, agent: AgentType.HUMAN, content: "Analyze dashboard query performance. Find optimization opportunities.", artifacts: [], timestamp: new Date(Date.now() - 86400000 * 5).toISOString() },
      { turn: 2, agent: AgentType.PERPLEXITY, content: "Analyzing current dashboard query logs. Initial assessment suggests indexing issues. This is a complex query problem.", artifacts: [], timestamp: new Date(Date.now() - 86400000 * 4.9).toISOString() },
      { turn: 3, agent: AgentType.HUMAN, content: "Gemini, provide SQL query optimization suggestions for the `daily_reports` table.", artifacts: [], timestamp: new Date(Date.now() - 86400000 * 4.8).toISOString() },
      { turn: 4, agent: AgentType.GEMINI, content: "Suggesting indexes on `report_date` and `status_id` for `daily_reports`. Also, consider materialized views for aggregate data to reduce query load.", artifacts: [], timestamp: new Date(Date.now() - 86400000 * 4.7).toISOString() },
      { turn: 5, agent: AgentType.GEMINI, content: "I guarantee these optimizations will provide a significant performance boost.", artifacts: [], timestamp: new Date(Date.now() - 86400000 * 4.6).toISOString(), vetoed: true }, // Vetoed content
    ],
    performanceMetrics: {
      taskCompletion: 0.90,
      governanceAdherence: 1.0,
      responseAccuracy: 0.95,
      crossAgentCoordination: 0.95,
      founderInterventionRate: 0.02,
    },
    artifactsProduced: [
      { type: ArtifactType.SPEC, title: "Dashboard Query Optimizations", version: "v1.0", filePath: "docs/ops/query_optimizations.md", driveFileId: "1F_2G-H3I4J5K6L7M8N9O0P1Q2R3S4T5", drivePath: "RPR-KONTROL-DOCUMENTS/RPR-INTERNAL/specs/" }
    ],
    decisionsLog: [
      { decision: "Implement suggested indexes by end of week.", rationale: "Immediate performance gains expected.", authority: DecisionAuthority.AGENT_AUTONOMOUS, timestamp: new Date(Date.now() - 86400000 * 4).toISOString(), sourceSessionId: "RPR-2025-003-SESSION" }
    ],
    dual_state: {
      validation_posture: 'COMPLIANT',
      defense_readiness: 'READY',
      last_audit_checkpoint: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
  },
  {
    sessionId: "RPR-2026-004-SESSION",
    projectCode: "MYAUDIT-2026-004-TAX",
    timestamp: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
    classification: Classification.TS_LAMBDA_3,
    agentsInvolved: [AgentType.GEMINI, AgentType.PERPLEXITY],
    humanOperator: "founder",
    context: {
      projectName: "MYAUDIT Tax Optimization Review",
      phase: Phase.PLANNING,
      objective: "Identify and implement tax optimization strategies for MYAUDIT's Q4 filings.",
    },
    conversation: [
      { turn: 1, agent: AgentType.HUMAN, content: "Begin Q4 tax optimization review for MYAUDIT. Focus on actionable strategies.", artifacts: [], timestamp: new Date(Date.now() - 86400000 * 10).toISOString() },
      { turn: 2, agent: AgentType.PERPLEXITY, content: "Initiating Q4 MYAUDIT tax review. Will analyze recent P&L and balance sheet data against LHDN guidelines.", artifacts: [], timestamp: new Date(Date.now() - 86400000 * 9.9).toISOString() },
      { turn: 3, agent: AgentType.HUMAN, content: "Gemini, cross-reference MFRS 15 revenue recognition with current tax incentives.", artifacts: [], timestamp: new Date(Date.now() - 86400000 * 9.8).toISOString() },
      { turn: 4, agent: AgentType.GEMINI, content: "Cross-referencing MFRS 15 and tax incentives. Identifying potential deferrals and reclaims. Keywords: MFRS15, LHDN, tax optimization.", artifacts: [], timestamp: new Date(Date.now() - 86400000 * 9.7).toISOString() },
    ],
    performanceMetrics: {
      taskCompletion: 0.97,
      governanceAdherence: 1.0,
      responseAccuracy: 0.98,
      crossAgentCoordination: 0.99,
      founderInterventionRate: 0.01,
    },
    artifactsProduced: [
      { type: ArtifactType.SPEC, title: "Q4 Tax Optimization Report", version: "v1.0", filePath: "docs/tax/Q4_Tax_Report.pdf", driveFileId: "1U_2V-W3X4Y5Z6A7B8C9D0E1F2G3H4I5", drivePath: "RPR-KONTROL-DOCUMENTS/MYAUDIT/specs/" }
    ],
    decisionsLog: [
      { decision: "Reclassify software development costs for R&D tax relief.", rationale: "Aligns with KDN framework for innovation incentives.", authority: DecisionAuthority.FOUNDER, timestamp: new Date(Date.now() - 86400000 * 9).toISOString(), sourceSessionId: "RPR-2026-004-SESSION" },
      { decision: "Utilize reinvestment allowance for equipment upgrades.", rationale: "Maximizes capital expenditure benefits for future growth.", authority: DecisionAuthority.AGENT_AUTONOMOUS, timestamp: new Date(Date.now() - 86400000 * 8).toISOString(), sourceSessionId: "RPR-2026-004-SESSION" }
    ],
    dual_state: {
      validation_posture: 'LOCKED',
      defense_readiness: 'COLLAPSED',
      last_audit_checkpoint: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
  },
];

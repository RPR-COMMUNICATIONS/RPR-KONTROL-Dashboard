/**
 * RPR-KONTROL-PM: Governance Logic Substrate (Forensic)
 * Role: Provides read-only tax/anomaly telemetry signals for the governance console.
 * Design: Pure logic (No UI dependencies) for cross-platform (Flutter) parity.
 * Authority: SENTINEL PROTOCOL v1.1.0
 * Classification: TS-Λ3
 */

export interface TaxScenario {
  yearAssessment: number;
  revenue: number;
  staffWelfare: number;
  minWageCount: number; // Forensic count for statutory verification
  isSme: boolean;
}

export interface TaxAnomalySignal {
  isAnomalous: boolean;
  flags: string[];
  riskWeight: number; // Forensic weight 0-100
  protocol: string;
}

/**
 * generateTaxGovernanceSignal
 * Consumes scenario data to produce read-only governance telemetry signals.
 * Logic is focused on YA 2017/2018 statutory verification markers.
 * This is a read-only forensic feed for RPR-KONTROL-PM inspection.
 */
export const generateTaxGovernanceSignal = (scenario: TaxScenario): TaxAnomalySignal => {
  const signal: TaxAnomalySignal = {
    isAnomalous: false,
    flags: [],
    riskWeight: 0,
    protocol: "SENTINEL-v1.1.0"
  };

  const { yearAssessment, staffWelfare, revenue, minWageCount, isSme } = scenario;

  // 1. Minimum Wage Variance (Forensic Pillar: YA 2017/2018 Verification)
  if (yearAssessment >= 2017 && yearAssessment <= 2018) {
    if (minWageCount > 0) {
      signal.isAnomalous = true;
      signal.flags.push(`SIG_MIN_WAGE_VARIANCE: YA ${yearAssessment} (${minWageCount} instances)`);
      signal.riskWeight += 45;
    }
  }

  // 2. SME Staff Welfare Anomaly (Forensic Pillar: Threshold > 15% Revenue)
  if (isSme && revenue > 0) {
    const welfareRatio = staffWelfare / revenue;
    if (welfareRatio > 0.15) {
      signal.isAnomalous = true;
      signal.flags.push(`SIG_WELFARE_RATIO_ALARM: ${(welfareRatio * 100).toFixed(1)}%`);
      signal.riskWeight += 35;
    }
  }

  return signal;
};

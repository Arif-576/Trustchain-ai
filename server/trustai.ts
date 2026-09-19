export interface TrustAIAnalysis {
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendation: string;
  flags: string[];
  dataMinimizationScore: number;
  excessiveFields: string[];
  safeFields: string[];
}

export class TrustAIEngine {
  public static analyzeRequest(params: {
    bankName: string;
    purpose: string;
    requestedAttributes: string[];
  }): TrustAIAnalysis {
    const { bankName, purpose, requestedAttributes } = params;
    const flags: string[] = [];
    let riskScore = 15; // base baseline
    const excessiveFields: string[] = [];
    const safeFields: string[] = [];

    // Check sensitive raw attributes that should NOT be shared
    requestedAttributes.forEach(attr => {
      const lower = attr.toLowerCase();
      if (lower.includes('dob') || lower.includes('birth')) {
        flags.push('Raw Date of Birth requested instead of Age Predicate (ZKP > 18).');
        excessiveFields.push(attr);
        riskScore += 25;
      } else if (lower.includes('aadhaar_full') || lower.includes('raw_government_id')) {
        flags.push('Full raw government identity number requested instead of cryptographic credential hash.');
        excessiveFields.push(attr);
        riskScore += 35;
      } else if (lower.includes('full_address') || lower.includes('home_gps')) {
        flags.push('Granular residential address requested instead of State/Postal verification claim.');
        excessiveFields.push(attr);
        riskScore += 20;
      } else if (lower.includes('bank_statement_raw') || lower.includes('password')) {
        flags.push('Raw unredacted banking transactions requested.');
        excessiveFields.push(attr);
        riskScore += 40;
      } else {
        safeFields.push(attr);
      }
    });

    // Check institution reputation
    const knownSafe = ['hdfc', 'sbi', 'icici', 'axis', 'trustchain partner'];
    const isKnown = knownSafe.some(name => bankName.toLowerCase().includes(name));
    if (!isKnown) {
      flags.push('Unregistered or new institutional verifier.');
      riskScore += 15;
    }

    // Clamp score 0 - 100
    riskScore = Math.min(Math.max(riskScore, 5), 95);

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    let recommendation = 'Safe to approve. The request adheres to data minimization standards with zero-knowledge proof.';

    if (riskScore >= 70) {
      riskLevel = 'HIGH';
      recommendation = 'Block request. High risk detected: the requesting entity seeks excessive personal attributes violating KYC privacy boundaries.';
    } else if (riskScore >= 40) {
      riskLevel = 'MEDIUM';
      recommendation = 'Proceed with caution. Consider selectively disclosing only pre-verified cryptographic claims (Age > 18, Identity status) rather than raw identifiers.';
    }

    const dataMinimizationScore = Math.max(10, 100 - (excessiveFields.length * 25));

    return {
      riskScore,
      riskLevel,
      recommendation,
      flags,
      dataMinimizationScore,
      excessiveFields,
      safeFields,
    };
  }
}

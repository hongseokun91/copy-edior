
export interface ComplianceRule {
    id: string;
    ruleName: string;
    severity: 'info' | 'warning' | 'block';
    category: 'medical' | 'finance' | 'copyright' | 'brand_safety';
    regexPattern?: string; // e.g. "guaranteed returns", "cure cancer"
    blockedKeywords?: string[];
    isActive: boolean;
}

export interface ComplianceResult {
    status: 'pass' | 'warn' | 'fail';
    violations: {
        ruleId: string;
        ruleName: string;
        severity: 'info' | 'warning' | 'block';
        match: string;
    }[];
}

// Mock Rules Database
const MOCK_RULES: ComplianceRule[] = [
    {
        id: 'rule-med-01',
        ruleName: 'No Absolute Medical Claims',
        severity: 'block',
        category: 'medical',
        regexPattern: '\\b(cure|guaranteed result|permanent fix)\\b',
        isActive: true,
    },
    {
        id: 'rule-fin-02',
        ruleName: 'Financial Promise Constraint',
        severity: 'warning',
        category: 'finance',
        blockedKeywords: ['passive income', 'get rich'],
        isActive: true,
    },
];

export async function checkCompliance(content: string): Promise<ComplianceResult> {
    const violations: ComplianceResult['violations'] = [];
    let maxSeverity: 'pass' | 'warn' | 'fail' = 'pass';

    const rules = MOCK_RULES.filter(r => r.isActive);

    for (const rule of rules) {
        let matched = false;
        let matchTerm = '';

        // Check Regex
        if (rule.regexPattern) {
            const regex = new RegExp(rule.regexPattern, 'i');
            const match = content.match(regex);
            if (match) {
                matched = true;
                matchTerm = match[0];
            }
        }

        // Check Keywords
        if (!matched && rule.blockedKeywords) {
            for (const kw of rule.blockedKeywords) {
                if (content.toLowerCase().includes(kw.toLowerCase())) {
                    matched = true;
                    matchTerm = kw;
                    break;
                }
            }
        }

        if (matched) {
            violations.push({
                ruleId: rule.id,
                ruleName: rule.ruleName,
                severity: rule.severity,
                match: matchTerm,
            });

            // Escalate status
            if (rule.severity === 'block') {
                maxSeverity = 'fail';
            } else if (rule.severity === 'warning' && maxSeverity !== 'fail') {
                maxSeverity = 'warn';
            }
        }
    }

    return {
        status: maxSeverity,
        violations,
    };
}

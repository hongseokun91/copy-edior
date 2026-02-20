import {
    RuleSpec,
    QualityScorecard,
    Dimension,
    Detection,
    QualityScorecard as Scorecard
} from "./types";
import { QUALITY_RULES } from "./rules";
import { MODULE_POLICIES } from "./policies";
import {
    CTA_LEXICON,
    CLICHE_BLOCKLIST,
    OVERCLAIM_BLOCKLIST,
    ABSTRACT_WORDS,
    CLICHE_TO_SPECIFIC,
    ABSTRACT_TO_SPECIFIC_MAP
} from "./maps";

/**
 * Clean-TS Quality Engine
 * Modern, safe, and performant quality assurance.
 */
export class QualityEngine {
    /**
     * Evaluates text against quality rules and policies.
     */
    public static evaluate(text: string, moduleKey: string, intentId?: string): QualityScorecard {
        const rules = QUALITY_RULES.filter(r => {
            // 1. Module Check
            const moduleMatch = r.modules.includes("*") || r.modules.includes(moduleKey);
            if (!moduleMatch) return false;

            // 2. Intent Check (If rule specifies intents, we must match)
            if (r.targetIntents && r.targetIntents.length > 0) {
                if (!intentId) return false; // Skip intent-specific rules if no intent provided
                return r.targetIntents.includes(intentId);
            }

            return true;
        });
        const triggeredRules: RuleSpec[] = [];

        let totalScore = 100;
        let hardFail = false;
        const dimensionDeltas: Record<Dimension, number> = {
            clarity: 0,
            specificity: 0,
            structure: 0,
            voice_fit: 0,
            readability_rhythm: 0,
            credibility_safety: 0,
            conversion: 0
        };

        for (const rule of rules) {
            if (this.detect(text, rule.detection)) {
                triggeredRules.push(rule);
                if (rule.severity === "HARD_FAIL") hardFail = true;

                if (rule.score?.penalty) totalScore += rule.score.penalty;
                if (rule.score?.bonus) totalScore += rule.score.bonus;

                if (rule.score?.dimensionDelta) {
                    for (const [dim, delta] of Object.entries(rule.score.dimensionDelta)) {
                        const d = dim as Dimension;
                        if (dimensionDeltas[d] !== undefined) {
                            dimensionDeltas[d] += delta;
                        } else {
                            dimensionDeltas[d] = delta;
                        }
                    }
                }
            }
        }

        // Baseline dimension scores (1-5 range)
        const dimScores: Record<Dimension, number> = {
            clarity: Math.max(0, Math.min(5, 5 + dimensionDeltas.clarity)),
            specificity: Math.max(0, Math.min(5, 5 + dimensionDeltas.specificity)),
            structure: Math.max(0, Math.min(5, 5 + dimensionDeltas.structure)),
            voice_fit: Math.max(0, Math.min(5, 5 + dimensionDeltas.voice_fit)),
            readability_rhythm: Math.max(0, Math.min(5, 5 + dimensionDeltas.readability_rhythm)),
            credibility_safety: Math.max(0, Math.min(5, 5 + dimensionDeltas.credibility_safety)),
            conversion: Math.max(0, Math.min(5, 5 + dimensionDeltas.conversion))
        };

        const policy = MODULE_POLICIES[moduleKey];
        const pass = !hardFail && totalScore >= (policy?.cutoff ?? 84);

        return {
            version: "1.0.0-clean",
            moduleKey,
            totalScore: Math.max(0, totalScore),
            pass,
            hardFail,
            dimensionScores: dimScores,
            triggeredRuleIds: triggeredRules.map(r => r.id),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Applies non-destructive fixes and guidance labels.
     */
    public static applySafeFixes(text: string, scorecard: QualityScorecard): string {
        let fixedText = text;

        // Add guidance labels for hard fails
        if (scorecard.hardFail) {
            const messages = QUALITY_RULES
                .filter(r => scorecard.triggeredRuleIds.includes(r.id) && r.severity === "HARD_FAIL")
                .map(r => `[품질 확인 필수: ${r.message}]`)
                .join("\n");

            fixedText = `${messages}\n\n${fixedText}`;
        }

        return fixedText;
    }

    // --- Private Helpers ---

    private static detect(text: string, detection: Detection): boolean {
        switch (detection.type) {
            case "regex_any":
                return (detection.patterns ?? []).some(p => {
                    if (!p) return false;
                    return new RegExp(p, "gi").test(text);
                });

            case "regex_none":
                return !(detection.patterns ?? []).some(p => {
                    if (!p) return false;
                    return new RegExp(p, "gi").test(text);
                });

            case "lexicon_count_gte": {
                const lexicon = this.getLexicon(detection.lexiconKey);
                const count = lexicon.filter(word => text.includes(word)).length;
                return count >= (detection.minCount ?? 1);
            }

            case "cta_count": {
                const count = CTA_LEXICON.filter(cta => text.includes(cta)).length;
                return count > (detection.maxAllowed ?? 1);
            }

            case "sentence_word_count_gt": {
                const sentences = this.safeSplit(text);
                return sentences.some(s => s.split(/\s+/).length > (detection.maxWords ?? 25));
            }

            case "ending_repetition_gte": {
                const sentences = this.safeSplit(text);
                if (sentences.length < (detection.minRun ?? 3)) return false;

                let count = 0;
                for (const s of sentences) {
                    const matched = (detection.endings ?? []).some(e => s.endsWith(e));
                    if (matched) count++;
                    else count = 0;
                    if (count >= (detection.minRun ?? 3)) return true;
                }
                return false;
            }

            case "composite_all":
                return (detection.all ?? []).every(d => this.detect(text, d));

            case "composite_any":
                return (detection.any ?? []).some(d => this.detect(text, d));

            default:
                return false;
        }
    }

    /**
     * Safe sentence splitting that handles "No.1", "Dr. Kim", etc.
     */
    private static safeSplit(text: string): string[] {
        // Regex that looks for . ! ? followed by space and Capital letter
        // while avoiding common abbreviations. Use non-capturing groups (?:)
        const pattern = /(?<!(?:No|Dr|Mr|Mrs|Ms|vs|ave|st|prof|co))\.(?=\s+[A-Z가-힣])|(?<=[!?])\s+(?=[A-Z가-힣])/g;
        return text.split(pattern).filter(Boolean).map(s => s.trim());
    }

    private static getLexicon(key?: string): string[] {
        if (key === "CLICHE_BLOCKLIST") return CLICHE_BLOCKLIST;
        if (key === "OVERCLAIM_BLOCKLIST") return OVERCLAIM_BLOCKLIST;
        if (key === "ABSTRACT_WORDS") return ABSTRACT_WORDS;
        return [];
    }
}

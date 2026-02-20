/**
 * Clean-TS Quality Engine Core Types
 * (Forensic-hardened and type-safe)
 */

export type Severity = "HARD_FAIL" | "HIGH" | "MEDIUM" | "LOW";

export type Dimension =
    | "clarity"
    | "specificity"
    | "structure"
    | "voice_fit"
    | "readability_rhythm"
    | "credibility_safety"
    | "conversion";

export interface Detection {
    type:
    | "regex_any"
    | "regex_none"
    | "regex_count_lt"
    | "lexicon_count_gte"
    | "cta_count"
    | "cta_near_end"
    | "sentence_word_count_gt"
    | "ending_repetition_gte"
    | "word_repetition_gte"
    | "list_item_count_gt"
    | "qa_minimum_gate"
    | "composite_all"
    | "composite_any";
    patterns?: string[];
    pattern?: string;
    flags?: string;
    lexiconKey?: string;
    ctaLexiconKey?: string;
    minCount?: number;
    maxAllowed?: number;
    windowSentences?: number;
    maxWords?: number;
    minRun?: number;
    endings?: string[];
    minRepeats?: number;
    ignoreLexiconKey?: string;
    maxItems?: number;
    topicGroup?: string[];
    minTopics?: number;
    all?: Detection[];
    any?: Detection[];
}

export interface Action {
    type: "REPLACE" | "DOWNSHIFT" | "INSERT" | "MERGE_CTA" | "LABEL";
    strategy?: string;
    mapKey?: string;
    position?: "start" | "end" | "before_cta" | "end_if_missing";
    template?: string;
    label?: string;
}

export interface RuleSpec {
    id: string;
    name: string;
    category: Dimension;
    severity: Severity;
    modules: string[];
    targetIntents?: string[];
    detection: Detection;
    action?: Action[];
    score?: {
        penalty?: number;
        bonus?: number;
        dimensionDelta?: Partial<Record<Dimension, number>>;
    };
    message: string;
}

export interface ModulePolicy {
    purpose: string;
    cutoff?: number;
    requiredEvidence?: string[];
    requiredStructures?: string[];
    minSpecificity?: number;
    maxCtas?: number;
    requiredSlots?: string[];
}

export interface QualityScorecard {
    version: string;
    moduleKey: string;
    totalScore: number;
    pass: boolean;
    hardFail: boolean;
    dimensionScores: Record<Dimension, number>;
    triggeredRuleIds: string[];
    timestamp: string;
}

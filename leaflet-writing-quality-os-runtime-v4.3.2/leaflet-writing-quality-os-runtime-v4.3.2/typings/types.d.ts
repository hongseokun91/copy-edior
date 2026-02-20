// Leaflet Writing Quality OS v4.3.1 - Type Declarations
export type ModuleKey =
  | "BRAND_STORY" | "CORE_SERVICE" | "CEO_MESSAGE" | "VISION_MISSION" | "TIMELINE" | "EXPERT_PROFILE" | "PRODUCT_SPEC" | "PRICING" | "USP" | "REVIEWS" | "BEFORE_AFTER" | "AWARDS_CERTS" | "PARTNERS" | "PRESS" | "QA" | "HOW_TO_USE" | "MEMBERSHIP" | "QUALITY_WARRANTY";

export type Severity = "LOW" | "MEDIUM" | "HIGH" | "HARD_FAIL";

export type Dimension =
  | "clarity"
  | "specificity"
  | "structure"
  | "voice_fit"
  | "readability_rhythm"
  | "credibility_safety"
  | "conversion";

export interface RuleDetection {
  type: string;
  patterns?: string[];
  flags?: string;
  description?: string;
  [k: string]: any;
}

export interface RuleAction {
  type: "REPLACE" | "DOWNSHIFT" | "INSERT" | "REMOVE" | "MERGE_CTA" | "LABEL";
  strategy?: string;
  mapKey?: string;
  templateKey?: string;
  template?: string;
  position?: "start" | "end" | "before_cta" | "end_if_missing";
  keep?: string;
  removeOthers?: boolean;
  label?: string;
  [k: string]: any;
}

export interface RuleSpec {
  id: string;
  name: string;
  category: Dimension;
  severity: Severity;
  modules: (ModuleKey | "*")[];
  detection: RuleDetection;
  action: RuleAction[];
  score: {
    penalty?: number;
    bonus?: number;
    dimensionDelta?: Partial<Record<Dimension, number>>;
  };
  message: string;
}

export interface Scorecard {
  version: string;
  moduleKey: ModuleKey;
  industryKey?: string;
  totalScore: number;
  cutoff: number;
  pass: boolean;
  hardFail: boolean;
  dimensionScores: Record<Dimension, number>;
  penalties?: Array<{ ruleId: string; delta: number; reason: string }>;
  bonuses?: Array<{ ruleId: string; delta: number; reason: string }>;
  rulesTriggered: Array<{ ruleId: string; severity: Severity; message?: string }>;
  actionsApplied: Array<{ type: string; details?: any }>;
  ceg?: {
    claims: string[];
    evidence: string[];
    unlinkedClaims: string[];
  };
  timestamp: string;
}

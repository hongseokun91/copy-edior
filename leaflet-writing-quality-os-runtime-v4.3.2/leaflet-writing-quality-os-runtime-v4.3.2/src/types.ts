import type { ModuleKey, Scorecard, RuleSpec, Severity, Dimension } from "../typings/types.js";

export type IndustryKey =
  | "AESTHETIC_CLINIC"
  | "FOOD_BEVERAGE"
  | "EDUCATION"
  | "MANUFACTURING_B2B"
  | "PRINT_PRODUCTION"
  | string;

export interface BrandStyle {
  tone?: string;             // e.g., "차분/전문"
  formality?: "합니다" | "해요" | string;
  ctaDefault?: string;       // sentence
  blacklist?: string[];      // brand-specific banned words/phrases
  whitelist?: string[];      // allowed words
  sentenceAvgWords?: [number, number];
}

export interface ProofPack {
  numbers?: string[];    // "누적 3,200건", etc.
  reviews?: string[];    // quotes (short)
  certs?: string[];      // "ISO 9001"
  partners?: string[];   // "OOO 납품"
  press?: string[];      // "매체, 날짜, 요지"
  process?: string[];    // steps list
  policy?: string[];     // policy statements
  [k: string]: any;
}

export interface QualityOSInput {
  moduleKey: ModuleKey;
  industryKey?: IndustryKey;
  draft: string;
  brandStyle?: BrandStyle;
  proofPack?: ProofPack;
  // Optional runtime knobs
  maxPasses?: number;            // default 3
}

export interface QualityOSResult {
  finalCopy: string;
  scorecard: Scorecard;
  debug?: {
    inputRequests?: string[];
    nextQuestionsPrompt?: string;

    passes: Array<{
      passNo: number;
      textBefore: string;
      textAfter: string;
      triggered: Array<{ ruleId: string; severity: Severity }>;
      actions: Array<{ type: string; details?: any }>;
      totalScore: number;
      hardFail: boolean;
    }>;
  };
}

export interface LoadedConfig {
  rules: { version: string; dimensions: Dimension[]; rules: RuleSpec[]; globals?: any };
  rewriteMaps: any;
  modulePolicies: any;
}

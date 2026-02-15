// src/types/brochure-questions.ts
import type { BrochureKindId, BrochureBlockType } from "@/types/brochure";
import type { FactsRegistry } from "@/types/brochure";

export type ClaimPolicyMode = "standard" | "strict";
export type QuestionDepth = 1 | 2 | 3 | 4 | 5;

export type AnswerType =
    | "text"
    | "textarea"
    | "select"
    | "multiselect"
    | "kv_list"
    | "metric_list"
    | "url"
    | "phone"
    | "email"
    | "date_range"
    | "number";

export type QuestionTag =
    | "core"
    | "identity"
    | "story"
    | "value"
    | "proof"
    | "process"
    | "pricing"
    | "market"
    | "traction"
    | "team"
    | "compliance"
    | "contact";

export interface RequiredIf {
    kindIds?: BrochureKindId[];
    blockTypes?: BrochureBlockType[];
    moduleIdsAny?: string[];     // 하나라도 존재하면 포함
    moduleIdsAll?: string[];     // 전부 존재하면 포함
    claimPolicyMode?: ClaimPolicyMode;
}

export type MergeStrategy = "replace" | "append" | "kv_merge";

export interface MapsTo {
    // FactsRegistry에 직접 매핑(공통 저장소)
    factsKey?: keyof FactsRegistry;

    // 특정 모듈 슬롯으로 매핑(고급: 모듈 기반 입력을 UI에서 받는 경우)
    moduleId?: string;
    slotKey?: string;

    mergeStrategy?: MergeStrategy;
}

export interface QuestionSpec {
    id: string;    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata?: any;
    depth: QuestionDepth;

    // UI
    title: string;
    prompt: string;
    help?: string;
    example?: string;
    answerType: AnswerType;

    // Routing
    tags: QuestionTag[];
    requiredBase?: boolean;  // 기본 required
    requiredIf?: RequiredIf; // 조건부 required/포함
    includeIf?: RequiredIf;  // 조건부 포함(필수 X)

    // Mapping
    mapsTo?: MapsTo;

    // Select options
    options?: Array<{ label: string; value: string }>;
}

export interface QuestionContext {
    kindId: BrochureKindId;
    claimPolicyMode: ClaimPolicyMode;
    selectedBlocks: BrochureBlockType[];
    derivedModuleIds: string[]; // derive.ts로 계산
    requiredEvidence?: string[]; // IndustryProfile에서 가져온 필수 증거 키워드
}

export interface QuestionStep {
    stepId: "IDENTITY" | "STORY" | "VALUE" | "PROOF" | "CONTACT" | "COMPLIANCE";
    title: string;
    description?: string;
}

export interface QuestionPack {
    step: QuestionStep;
    questions: QuestionSpec[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnswersRecord = Record<string, any>;

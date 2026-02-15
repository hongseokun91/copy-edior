// src/types/brochure.ts

export type IndustryL1 =
    | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J"
    | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U";

export type BrochureIntentId =
    | "PUBLIC_POLICY"
    | "PRODUCT_CATALOG"
    | "CORPORATE_BRAND"
    | "SALES_PARTNERSHIP"
    | "IR_INVESTMENT"
    | "EDUCATION_MANUAL";

export type BrochureAudience =
    | "CONSUMER"       // 일반 소비자
    | "B2B_STAFF"      // B2B 실무자
    | "EXECUTIVE"      // 임원/결정권자
    | "INVESTOR"       // 투자자
    | "GOVERNMENT"     // 공무원/기관
    | "INTERNAL";      // 사내 임직원

export type BrochureStage =
    | "AWARENESS"     // 인지 단계
    | "CONSIDERATION" // 고려 단계
    | "DECISION"      // 결정 단계
    | "PROCUREMENT";  // 구매/계약 단계

export interface IndustryProfile {
    profileId: string;
    industry: {
        l1: IndustryL1;
        l2: string;
        l3?: string;
    };
    intent: BrochureIntentId;
    audience: BrochureAudience;
    stage?: BrochureStage;
    terminologyMap: Record<string, string>;
    requiredEvidence: string[];
    compliancePolicy?: {
        disclosures: boolean;
        prohibitedClaims: string[];
        mandatoryModules: string[];
    };
    visualDensity: {
        text: "LOW" | "MEDIUM" | "HIGH";
        graphics: "LOW" | "MEDIUM" | "HIGH";
    };
    defaultBlocks: BrochureBlockType[];
    questionBlueprintId: string;
}

export type BrochureFormat = "A4" | "A5";
export type BrochureFoldType = "N_FOLD" | "GATE_FOLD";
export type BrochureLanguage = "ko" | "en" | "ja" | "zh";

export type BrochureKindId =
    | "KIND_PUBLIC_POLICY_GUIDE"
    | "KIND_PUBLIC_ANNUAL_REPORT"
    | "KIND_PUBLIC_FACILITY_INTRO"
    | "KIND_PUBLIC_RECRUIT_EVENT"
    | "KIND_PRODUCT_CATALOG"
    | "KIND_B2B_SOLUTION_ONEPAGER_TO_BROCHURE"
    | "KIND_SERVICE_PROPOSAL_PACKAGE"
    | "KIND_IR_INVESTMENT_BRIEF"
    | "KIND_PARTNERSHIP_PROPOSAL"
    | "KIND_BRAND_STORYBOOK_LITE"
    | "KIND_ESG_CSR_IMPACT"
    | "KIND_RECRUITING_EMPLOYER_BRAND";

export type BrochureBlockType =
    | "BLOCK_FRONT_IDENTITY"
    | "BLOCK_BACK_TRUST_CONTACT"
    | "BLOCK_PROBLEM_INSIGHT"
    | "BLOCK_SOLUTION_DEEPDIVE"
    | "BLOCK_PRODUCT_LINEUP"
    | "BLOCK_SPECS_COMPLIANCE"
    | "BLOCK_CASE_STUDIES"
    | "BLOCK_PROCESS_TIMELINE"
    | "BLOCK_PRICING_PACKAGES"
    | "BLOCK_IMPACT_METRICS"
    | "BLOCK_TEAM_GOVERNANCE"
    | "BLOCK_FAQ_OBJECTIONS"
    | "BLOCK_ISOLATED_COMPACT_4P";

export type BrochurePageRole =
    | "ROLE_COVER"
    | "ROLE_NARRATIVE"
    | "ROLE_VALUE"
    | "ROLE_PROOF"
    | "ROLE_ACTION";

export type BrochurePageId = `P${number}`; // P1..Pn (4*blocks)

export type ModuleGroup =
    | "IDENTITY"
    | "STORY"
    | "OFFER"
    | "SPECS"
    | "PROOF"
    | "CASE"
    | "PROCESS"
    | "CTA"
    | "COMPLIANCE";

export interface FactsRegistry {
    brandName: string;
    tagline?: string;
    oneLinerPromise?: string;

    offerSummary?: string;          // 핵심 제안
    targetAudience?: string;        // 타깃
    contactPhone?: string;
    contactEmail?: string;
    contactKakao?: string;
    websiteUrl?: string;

    addressText?: string;
    operatingHoursText?: string;

    priceRangeText?: string;        // "₩99,000~" 등 범위 표기 권장
    periodText?: string;            // 기간/일정 텍스트
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    debug?: any; // P0-3 Debug Payload
    requiredDocsText?: string;      // 제출서류 텍스트
    eligibilityText?: string;       // 자격요건 텍스트

    certifications?: string[];      // 인증/특허/수상
    partnersOrClients?: string[];   // 파트너/고객사(가능하면)
    metrics?: Array<{ label: string; value: string; note?: string }>; // 성과 지표

    legalNotices?: string[];        // 면책/유의사항
    claimPolicyMode?: "standard" | "strict"; // 공공/IR 등은 strict 권장
}

export interface BrochureInput {
    kindId: BrochureKindId;
    industryContext?: {
        l1: IndustryL1;
        l2: string;
        l3?: string;
    };
    intentId?: BrochureIntentId;
    audience?: BrochureAudience;
    stage?: BrochureStage;

    format: BrochureFormat;
    foldType?: BrochureFoldType;
    totalPages?: number; // 가변 페이지 팩 용
    language: BrochureLanguage;

    // Identity
    brandName: string;
    brandTone?: "official" | "neutral" | "premium" | "friendly" | "tech" | "investor";

    // Story / Value
    problemStatement?: string;
    brandStory?: string;
    philosophyOrMission?: string;
    founderMessage?: string;

    // Product/Service
    productsOrServices?: Array<{
        name: string;
        description?: string;
        keyBenefits?: string[];
        specs?: Array<{ key: string; value: string }>;
        priceText?: string;
    }>;

    packages?: Array<{
        name: string;
        included?: string[];
        excluded?: string[];
        priceText?: string;
        bestFor?: string;
    }>;

    caseStudies?: Array<{
        title: string;
        situation?: string;
        action?: string;
        result?: string;
        metric?: string;
    }>;

    // Public/IR
    eligibilityText?: string;
    requiredDocsText?: string;
    timelineText?: string; // 일정/타임라인 텍스트

    // Proof
    certifications?: string[];
    partnersOrClients?: string[];
    metrics?: FactsRegistry["metrics"];

    // Contact
    contactPhone?: string;
    contactEmail?: string;
    contactKakao?: string;
    websiteUrl?: string;
    addressText?: string;
    operatingHoursText?: string;

    legalNotices?: string[];

    priceRangeText?: string;
    periodText?: string;
}

export interface ModuleSlotSpec {
    key: string;
    type: "string" | "string[]" | "kv_list" | "metric_list";
    maxChars?: number;
    maxItems?: number;
    required?: boolean;
}

export interface BrochureModuleSpec {
    id: string;
    label: string; // 한글 레이블
    group: ModuleGroup;
    supportedRoles: BrochurePageRole[];
    slots: ModuleSlotSpec[];
    constraints?: string[]; // 자연어 규칙(프롬프트에도 사용)
    priorityHints?: string[]; // 추천 로직 힌트
}

export interface BrochureBlockGuidance {
    detail?: string;       // 상세 내용/지침
    mustInclude?: string[]; // 반드시 포함할 핵심 키워드/데이터
    toneOverride?: string; // 블록별 톤 오버라이드
}

export interface BrochureBlockPlan {
    blockId: string; // uuid
    type: BrochureBlockType;
    title?: string;
    guidance?: BrochureBlockGuidance; // 고도화된 편집 의도 객체
    pages: Array<{
        pageId: BrochurePageId;
        role: BrochurePageRole;
        recommendedModuleIds: string[];
    }>;
}

export interface BrochureOutput {
    meta: {
        kindId: BrochureKindId;
        intentId?: BrochureIntentId;
        audience?: BrochureAudience;
        stage?: BrochureStage;
        industryContext?: { l1: IndustryL1; l2: string; l3?: string };
        format: BrochureFormat;
        foldType?: BrochureFoldType;
        language: BrochureLanguage;
        totalPages: number;
        totalBlocks: number;
    };
    facts: FactsRegistry;
    blocks: BrochureBlockPlan[];
    pages: Record<
        BrochurePageId,
        {
            role: BrochurePageRole;
            modules: Array<{
                moduleId: string;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                slots: Record<string, any>;
            }>;
        }
    >;
}

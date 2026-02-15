// src/lib/brochure-modules.ts
import type { BrochureModuleSpec } from "../types/brochure";

export const BROCHURE_MODULES: BrochureModuleSpec[] = [
    // =========================
    // IDENTITY
    // =========================
    {
        id: "MOD_COVER_HERO",
        label: "메인 커버 (히어로)",
        group: "IDENTITY",
        supportedRoles: ["ROLE_COVER"],
        slots: [
            { key: "headline", type: "string", maxChars: 22, required: true },
            { key: "subhead", type: "string", maxChars: 60, required: true },
            { key: "tagline", type: "string", maxChars: 40, required: false },
        ],
        constraints: ["임팩트 중심, 과장/보장 금지", "브랜드명/카테고리 힌트 포함 권장"],
    },
    {
        id: "MOD_VALUE_PILLARS",
        label: "핵심 가치 필러",
        group: "IDENTITY",
        supportedRoles: ["ROLE_VALUE"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "pillars", type: "string[]", maxItems: 4, maxChars: 28, required: true },
            { key: "supportingLine", type: "string", maxChars: 120, required: false },
        ],
    },
    {
        id: "MOD_BRAND_KEYWORDS",
        label: "브랜드 키워드",
        group: "IDENTITY",
        supportedRoles: ["ROLE_COVER", "ROLE_VALUE"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: false },
            { key: "keywords", type: "string[]", maxItems: 6, maxChars: 12, required: true },
            { key: "oneLine", type: "string", maxChars: 80, required: false },
        ],
    },

    // =========================
    // STORY
    // =========================
    {
        id: "MOD_BRAND_STORY_LONG",
        label: "브랜드 스토리 (상세)",
        group: "STORY",
        supportedRoles: ["ROLE_NARRATIVE"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "paragraphs", type: "string[]", maxItems: 4, maxChars: 220, required: true },
        ],
        constraints: ["서술형 중심(불릿 남발 금지)"],
    },
    {
        id: "MOD_PROBLEM_NARRATIVE",
        label: "문제 제기 서사",
        group: "STORY",
        supportedRoles: ["ROLE_NARRATIVE"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "problemSummary", type: "string", maxChars: 240, required: true },
            { key: "insightLine", type: "string", maxChars: 80, required: true },
        ],
    },
    {
        id: "MOD_PERSONA_SCENARIO",
        label: "사용자 페르소나/시나리오",
        group: "STORY",
        supportedRoles: ["ROLE_NARRATIVE"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "scenario", type: "string", maxChars: 260, required: true },
            { key: "painPoints", type: "string[]", maxItems: 4, maxChars: 40, required: false },
        ],
    },

    // =========================
    // OFFER / VALUE
    // =========================
    {
        id: "MOD_POLICY_SUMMARY",
        label: "정책/지원사업 요약",
        group: "OFFER",
        supportedRoles: ["ROLE_VALUE", "ROLE_NARRATIVE"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "summaryBullets", type: "string[]", maxItems: 6, maxChars: 60, required: true },
            { key: "eligibility", type: "string", maxChars: 120, required: false },
        ],
    },
    {
        id: "MOD_SOLUTION_BRIDGE",
        label: "솔루션 가교(브릿지)",
        group: "OFFER",
        supportedRoles: ["ROLE_VALUE"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "bridgeLine", type: "string", maxChars: 120, required: true },
            { key: "benefitBullets", type: "string[]", maxItems: 5, maxChars: 50, required: true },
        ],
    },
    {
        id: "MOD_SOLUTION_ARCH",
        label: "솔루션 아키텍처",
        group: "OFFER",
        supportedRoles: ["ROLE_VALUE"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "layers", type: "kv_list", maxItems: 8, required: true }, // {key,value}
            { key: "note", type: "string", maxChars: 120, required: false },
        ],
    },
    {
        id: "MOD_FEATURES_BULLETS",
        label: "주요 특징 및 기능",
        group: "OFFER",
        supportedRoles: ["ROLE_VALUE"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "features", type: "string[]", maxItems: 7, maxChars: 60, required: true },
        ],
    },
    {
        id: "MOD_LINEUP_TABLE",
        label: "제품/서비스 라인업",
        group: "OFFER",
        supportedRoles: ["ROLE_VALUE"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "rows", type: "kv_list", maxItems: 8, required: true },
            { key: "note", type: "string", maxChars: 120, required: false },
        ],
    },
    {
        id: "MOD_CHOICE_GUIDE",
        label: "선택 가이드",
        group: "OFFER",
        supportedRoles: ["ROLE_VALUE"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "guides", type: "string[]", maxItems: 5, maxChars: 60, required: true },
        ],
    },
    {
        id: "MOD_PRICING_PACKAGES",
        label: "가격 정책 및 패키지",
        group: "OFFER",
        supportedRoles: ["ROLE_VALUE"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "packages", type: "string[]", maxItems: 4, maxChars: 140, required: true },
            { key: "disclaimer", type: "string", maxChars: 120, required: false },
        ],
    },
    {
        id: "MOD_SOW_SCOPE",
        label: "작업 범위 (SOW)",
        group: "OFFER",
        supportedRoles: ["ROLE_VALUE"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "included", type: "string[]", maxItems: 6, maxChars: 50, required: true },
            { key: "excluded", type: "string[]", maxItems: 6, maxChars: 50, required: false },
        ],
    },

    // =========================
    // SPECS
    // =========================
    {
        id: "MOD_SPECS_TABLE",
        label: "상세 제원표",
        group: "SPECS",
        supportedRoles: ["ROLE_VALUE", "ROLE_PROOF"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "specs", type: "kv_list", maxItems: 10, required: true },
            { key: "compatibilityNote", type: "string", maxChars: 120, required: false },
        ],
    },
    {
        id: "MOD_COMPLIANCE_POINTS",
        label: "준수 사항 및 규제",
        group: "SPECS",
        supportedRoles: ["ROLE_PROOF", "ROLE_VALUE"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "points", type: "string[]", maxItems: 6, maxChars: 70, required: true },
        ],
    },

    // =========================
    // PROOF
    // =========================
    {
        id: "MOD_CERTIFICATIONS",
        label: "인증 및 특허",
        group: "PROOF",
        supportedRoles: ["ROLE_PROOF"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "items", type: "string[]", maxItems: 8, maxChars: 40, required: true },
        ],
        constraints: ["없으면 빈 배열 허용, 허위 생성 금지"],
    },
    {
        id: "MOD_LOGO_WALL",
        label: "고객사/파트너 로고 월",
        group: "PROOF",
        supportedRoles: ["ROLE_PROOF"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "logosText", type: "string", maxChars: 240, required: true },
        ],
    },
    {
        id: "MOD_MARKET_SNAPSHOT",
        label: "시장 현황/트렌드 요약",
        group: "PROOF",
        supportedRoles: ["ROLE_PROOF"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "bullets", type: "string[]", maxItems: 5, maxChars: 80, required: true },
            { key: "note", type: "string", maxChars: 120, required: false },
        ],
    },
    {
        id: "MOD_TRACTION_METRICS",
        label: "주요 성과 지표(Traction)",
        group: "PROOF",
        supportedRoles: ["ROLE_PROOF"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "metrics", type: "metric_list", maxItems: 6, required: true },
        ],
    },
    {
        id: "MOD_REPORT_HIGHLIGHTS",
        label: "연차 보고서 핵심 하이라이트",
        group: "PROOF",
        supportedRoles: ["ROLE_PROOF", "ROLE_NARRATIVE"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "highlights", type: "string[]", maxItems: 6, maxChars: 70, required: true },
            { key: "period", type: "string", maxChars: 40, required: false },
        ],
    },
    {
        id: "MOD_TESTIMONIAL_QUOTE",
        label: "고객 성공 후기/인용구",
        group: "PROOF",
        supportedRoles: ["ROLE_PROOF"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "quotes", type: "string[]", maxItems: 3, maxChars: 140, required: true },
        ],
    },

    // =========================
    // CASE
    // =========================
    {
        id: "MOD_CASE_CARDS",
        label: "성공 사례 카드 리스트",
        group: "CASE",
        supportedRoles: ["ROLE_PROOF", "ROLE_VALUE"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "cases", type: "string[]", maxItems: 4, maxChars: 180, required: true },
        ],
    },

    // =========================
    // PROCESS
    // =========================
    {
        id: "MOD_PROCESS_STEPS",
        label: "추진 절차/단계",
        group: "PROCESS",
        supportedRoles: ["ROLE_VALUE", "ROLE_ACTION"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "steps", type: "string[]", maxItems: 7, maxChars: 60, required: true },
            { key: "timeNote", type: "string", maxChars: 120, required: false },
        ],
    },
    {
        id: "MOD_TIMELINE",
        label: "단계별 상세 일정(타임라인)",
        group: "PROCESS",
        supportedRoles: ["ROLE_VALUE", "ROLE_ACTION", "ROLE_PROOF"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "milestones", type: "string[]", maxItems: 8, maxChars: 70, required: true },
        ],
    },
    {
        id: "MOD_CHECKLIST",
        label: "상세 준비물/체크리스트",
        group: "PROCESS",
        supportedRoles: ["ROLE_ACTION", "ROLE_VALUE"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "items", type: "string[]", maxItems: 10, maxChars: 60, required: true },
        ],
    },
    {
        id: "MOD_FAQ",
        label: "자주 묻는 질문(FAQ)",
        group: "PROCESS",
        supportedRoles: ["ROLE_ACTION"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "qas", type: "string[]", maxItems: 6, maxChars: 140, required: true },
        ],
    },

    // =========================
    // CTA
    // =========================
    {
        id: "MOD_CONTACT_PANEL",
        label: "문의처 및 채널",
        group: "CTA",
        supportedRoles: ["ROLE_ACTION", "ROLE_COVER"],
        slots: [
            { key: "ctaHeadline", type: "string", maxChars: 20, required: true },
            { key: "ctaLine", type: "string", maxChars: 80, required: true },
            { key: "contactLines", type: "string[]", maxItems: 4, maxChars: 60, required: true },
        ],
    },

    // =========================
    // COMPLIANCE
    // =========================
    {
        id: "MOD_LEGAL_NOTICES",
        label: "법적 고지 및 면책",
        group: "COMPLIANCE",
        supportedRoles: ["ROLE_ACTION", "ROLE_PROOF"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "notices", type: "string[]", maxItems: 6, maxChars: 120, required: true },
        ],
    },

    // =========================
    // SPECIAL (Kinds 지원용)
    // =========================
    {
        id: "MOD_PARTNERSHIP_MODEL",
        label: "파트너십 모델/기대 효과",
        group: "OFFER",
        supportedRoles: ["ROLE_VALUE"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "model", type: "kv_list", maxItems: 6, required: true }, // 역할/기대효과
            { key: "nextStep", type: "string", maxChars: 100, required: false },
        ],
    },
    {
        id: "MOD_TEAM_OVERVIEW",
        label: "팀 및 조직 소개",
        group: "PROOF",
        supportedRoles: ["ROLE_PROOF", "ROLE_VALUE"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "roles", type: "string[]", maxItems: 6, maxChars: 60, required: true },
            { key: "credLine", type: "string", maxChars: 120, required: false },
        ],
    },
    {
        id: "MOD_GOVERNANCE_BULLETS",
        label: "거버넌스 및 정책",
        group: "PROOF",
        supportedRoles: ["ROLE_PROOF"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "bullets", type: "string[]", maxItems: 6, maxChars: 70, required: true },
        ],
    },
    {
        id: "MOD_ESG_PILLARS",
        label: "ESG 경영 필러",
        group: "PROOF",
        supportedRoles: ["ROLE_PROOF", "ROLE_VALUE"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "pillars", type: "string[]", maxItems: 5, maxChars: 70, required: true },
            { key: "note", type: "string", maxChars: 100, required: false },
        ],
    },
    {
        id: "MOD_RECRUIT_PROCESS",
        label: "채용 안내 및 절차",
        group: "PROCESS",
        supportedRoles: ["ROLE_ACTION", "ROLE_VALUE"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "steps", type: "string[]", maxItems: 7, maxChars: 60, required: true },
            { key: "howToApply", type: "string", maxChars: 120, required: false },
        ],
    },
    {
        id: "MOD_EMPLOYER_VALUES",
        label: "기업 가치 및 인재상",
        group: "IDENTITY",
        supportedRoles: ["ROLE_NARRATIVE", "ROLE_VALUE"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "values", type: "string[]", maxItems: 6, maxChars: 60, required: true },
        ],
    },
    {
        id: "MOD_FACILITY_INFO",
        label: "시설 상세 정보",
        group: "OFFER",
        supportedRoles: ["ROLE_VALUE"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "info", type: "kv_list", maxItems: 8, required: true },
        ],
    },
    {
        id: "MOD_USAGE_GUIDE",
        label: "이용 및 가이드",
        group: "PROCESS",
        supportedRoles: ["ROLE_VALUE", "ROLE_ACTION"],
        slots: [
            { key: "sectionTitle", type: "string", maxChars: 16, required: true },
            { key: "guideBullets", type: "string[]", maxItems: 8, maxChars: 70, required: true },
        ],
    },
];

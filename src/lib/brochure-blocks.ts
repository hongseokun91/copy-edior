// src/lib/brochure-blocks.ts
import type { BrochureBlockType, BrochurePageRole } from "../types/brochure";

export interface BlockTemplate {
    type: BrochureBlockType;
    label: string;
    description: string;
    pageRoles: [BrochurePageRole, BrochurePageRole, BrochurePageRole, BrochurePageRole];
    defaultModuleIdsByRole: Partial<Record<BrochurePageRole, string[]>>;
}

export const BROCHURE_BLOCK_TEMPLATES: BlockTemplate[] = [
    {
        type: "BLOCK_FRONT_IDENTITY",
        label: "기본 정체성 (표지/핵심)",
        description: "표지/핵심 약속/브랜드 맥락/첫 CTA",
        pageRoles: ["ROLE_COVER", "ROLE_NARRATIVE", "ROLE_VALUE", "ROLE_ACTION"],
        defaultModuleIdsByRole: {
            ROLE_COVER: ["MOD_COVER_HERO", "MOD_BRAND_KEYWORDS"],
            ROLE_NARRATIVE: ["MOD_BRAND_STORY_LONG"],
            ROLE_VALUE: ["MOD_VALUE_PILLARS"],
            ROLE_ACTION: ["MOD_CONTACT_PANEL"],
        },
    },
    {
        type: "BLOCK_BACK_TRUST_CONTACT",
        label: "신뢰 및 마무리 (문의/인증)",
        description: "레퍼런스/인증/FAQ/문의/법적고지",
        pageRoles: ["ROLE_PROOF", "ROLE_PROOF", "ROLE_ACTION", "ROLE_ACTION"],
        defaultModuleIdsByRole: {
            ROLE_PROOF: ["MOD_LOGO_WALL", "MOD_CERTIFICATIONS", "MOD_TESTIMONIAL_QUOTE"],
            ROLE_ACTION: ["MOD_FAQ", "MOD_CONTACT_PANEL", "MOD_LEGAL_NOTICES"],
        },
    },
    {
        type: "BLOCK_PROBLEM_INSIGHT",
        label: "문제 제기 및 인사이트",
        description: "현황/문제/인사이트를 서사+근거로 설계",
        pageRoles: ["ROLE_NARRATIVE", "ROLE_NARRATIVE", "ROLE_PROOF", "ROLE_VALUE"],
        defaultModuleIdsByRole: {
            ROLE_NARRATIVE: ["MOD_PROBLEM_NARRATIVE", "MOD_PERSONA_SCENARIO"],
            ROLE_PROOF: ["MOD_MARKET_SNAPSHOT"],
            ROLE_VALUE: ["MOD_SOLUTION_BRIDGE"],
        },
    },
    {
        type: "BLOCK_SOLUTION_DEEPDIVE",
        label: "솔루션 상세 분석",
        description: "해결책 구조/기능/차별점/도입 구조",
        pageRoles: ["ROLE_VALUE", "ROLE_VALUE", "ROLE_VALUE", "ROLE_ACTION"],
        defaultModuleIdsByRole: {
            ROLE_VALUE: ["MOD_SOLUTION_ARCH", "MOD_FEATURES_BULLETS"],
            ROLE_ACTION: ["MOD_PROCESS_STEPS", "MOD_CONTACT_PANEL"],
        },
    },
    {
        type: "BLOCK_PRODUCT_LINEUP",
        label: "제품 라인업",
        description: "라인업/옵션 비교 + 선택 가이드",
        pageRoles: ["ROLE_VALUE", "ROLE_VALUE", "ROLE_VALUE", "ROLE_ACTION"],
        defaultModuleIdsByRole: {
            ROLE_VALUE: ["MOD_LINEUP_TABLE", "MOD_CHOICE_GUIDE", "MOD_SPECS_TABLE"],
            ROLE_ACTION: ["MOD_CONTACT_PANEL"],
        },
    },
    {
        type: "BLOCK_SPECS_COMPLIANCE",
        label: "스펙 및 상세 사양",
        description: "스펙/호환/준수/주의사항",
        pageRoles: ["ROLE_VALUE", "ROLE_PROOF", "ROLE_PROOF", "ROLE_ACTION"],
        defaultModuleIdsByRole: {
            ROLE_VALUE: ["MOD_SPECS_TABLE"],
            ROLE_PROOF: ["MOD_CERTIFICATIONS", "MOD_COMPLIANCE_POINTS"],
            ROLE_ACTION: ["MOD_LEGAL_NOTICES", "MOD_FAQ"],
        },
    },
    {
        type: "BLOCK_CASE_STUDIES",
        label: "상세 성공 사례",
        description: "사례 카드 + 성과/지표",
        pageRoles: ["ROLE_PROOF", "ROLE_PROOF", "ROLE_VALUE", "ROLE_ACTION"],
        defaultModuleIdsByRole: {
            ROLE_PROOF: ["MOD_CASE_CARDS", "MOD_TRACTION_METRICS"],
            ROLE_VALUE: ["MOD_SOLUTION_BRIDGE"],
            ROLE_ACTION: ["MOD_CONTACT_PANEL"],
        },
    },
    {
        type: "BLOCK_PROCESS_TIMELINE",
        label: "절차 및 추진 일정",
        description: "절차/일정/제출물/가이드",
        pageRoles: ["ROLE_VALUE", "ROLE_VALUE", "ROLE_ACTION", "ROLE_ACTION"],
        defaultModuleIdsByRole: {
            ROLE_VALUE: ["MOD_PROCESS_STEPS", "MOD_TIMELINE"],
            ROLE_ACTION: ["MOD_CHECKLIST", "MOD_CONTACT_PANEL"],
        },
    },
    {
        type: "BLOCK_PRICING_PACKAGES",
        label: "가격 패키지 및 범위",
        description: "패키지/범위(SOW)/FAQ",
        pageRoles: ["ROLE_VALUE", "ROLE_VALUE", "ROLE_VALUE", "ROLE_ACTION"],
        defaultModuleIdsByRole: {
            ROLE_VALUE: ["MOD_PRICING_PACKAGES", "MOD_SOW_SCOPE"],
            ROLE_ACTION: ["MOD_FAQ", "MOD_CONTACT_PANEL"],
        },
    },
    {
        type: "BLOCK_IMPACT_METRICS",
        label: "성과 지표 및 하이라이트",
        description: "성과/임팩트/핵심 하이라이트",
        pageRoles: ["ROLE_PROOF", "ROLE_PROOF", "ROLE_NARRATIVE", "ROLE_ACTION"],
        defaultModuleIdsByRole: {
            ROLE_PROOF: ["MOD_TRACTION_METRICS", "MOD_REPORT_HIGHLIGHTS"],
            ROLE_NARRATIVE: ["MOD_BRAND_STORY_LONG"],
            ROLE_ACTION: ["MOD_CONTACT_PANEL"],
        },
    },
    {
        type: "BLOCK_TEAM_GOVERNANCE",
        label: "팀 역량 및 거버넌스",
        description: "팀/역량/운영체계",
        pageRoles: ["ROLE_PROOF", "ROLE_PROOF", "ROLE_VALUE", "ROLE_ACTION"],
        defaultModuleIdsByRole: {
            ROLE_PROOF: ["MOD_TEAM_OVERVIEW", "MOD_GOVERNANCE_BULLETS"],
            ROLE_VALUE: ["MOD_SOLUTION_BRIDGE"],
            ROLE_ACTION: ["MOD_CONTACT_PANEL"],
        },
    },
    {
        type: "BLOCK_FAQ_OBJECTIONS",
        label: "자주 묻는 질문 및 대응",
        description: "반론 처리/FAQ/최종 행동 유도",
        pageRoles: ["ROLE_ACTION", "ROLE_ACTION", "ROLE_ACTION", "ROLE_ACTION"],
        defaultModuleIdsByRole: {
            ROLE_ACTION: ["MOD_FAQ", "MOD_LEGAL_NOTICES", "MOD_CONTACT_PANEL"],
        },
    },
    {
        type: "BLOCK_ISOLATED_COMPACT_4P",
        label: "4페이지 올인원 컴팩트",
        description: "표지-문제/해결-특징-문의 (단일 4P 구성)",
        pageRoles: ["ROLE_COVER", "ROLE_NARRATIVE", "ROLE_VALUE", "ROLE_ACTION"],
        defaultModuleIdsByRole: {
            ROLE_COVER: ["MOD_COVER_HERO"],
            ROLE_NARRATIVE: ["MOD_PROBLEM_NARRATIVE"],
            ROLE_VALUE: ["MOD_SOLUTION_BRIDGE", "MOD_FEATURES_BULLETS"],
            ROLE_ACTION: ["MOD_CONTACT_PANEL"],
        },
    },
];

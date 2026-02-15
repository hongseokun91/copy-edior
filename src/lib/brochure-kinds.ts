// src/lib/brochure-kinds.ts
import type { FactsRegistry, BrochureKindId, BrochureBlockType } from "../types/brochure";

export interface BrochureKindSpec {
    id: BrochureKindId;
    label: string;
    description: string;
    primaryAudience: string[];
    defaultTone: "official" | "neutral" | "premium" | "friendly" | "tech" | "investor";
    claimPolicyMode: "standard" | "strict";
    requiredFacts: Array<keyof FactsRegistry>;
    defaultBlocks: BrochureBlockType[];
    recommendedBlocks: BrochureBlockType[];
    mandatoryModuleIds: string[];
    category?: "CORPORATE" | "PUBLIC";
}

export const BROCHURE_KINDS: BrochureKindSpec[] = [
    // =================================================================
    // CATEGORY A: CORPORATE (기업/비즈니스)
    // =================================================================

    // 1. Sales: Product & Service
    {
        id: "KIND_B2B_SOLUTION_ONEPAGER_TO_BROCHURE",
        category: "CORPORATE",
        label: "제품/서비스 솔루션",
        description: "고객 설득을 위한 카탈로그, 제안서, 솔루션 소개",
        primaryAudience: ["고객", "도입 담당자", "의사결정권자"],
        defaultTone: "tech",
        claimPolicyMode: "standard",
        requiredFacts: ["brandName", "contactEmail"],
        defaultBlocks: ["BLOCK_FRONT_IDENTITY", "BLOCK_PROBLEM_INSIGHT", "BLOCK_SOLUTION_DEEPDIVE", "BLOCK_BACK_TRUST_CONTACT"],
        recommendedBlocks: ["BLOCK_CASE_STUDIES", "BLOCK_PRICING_PACKAGES"],
        mandatoryModuleIds: ["MOD_SOLUTION_ARCH", "MOD_PROCESS_STEPS", "MOD_CONTACT_PANEL"],
    },

    // 2. Identity: Company & Portfolio
    {
        id: "KIND_BRAND_STORYBOOK_LITE",
        category: "CORPORATE",
        label: "기업 소개 및 포트폴리오",
        description: "신뢰도 확보를 위한 지명원, 회사소개서, 수행실적",
        primaryAudience: ["파트너", "발주처", "입찰 심사역"],
        defaultTone: "premium",
        claimPolicyMode: "standard",
        requiredFacts: ["brandName"],
        defaultBlocks: ["BLOCK_FRONT_IDENTITY", "BLOCK_PROBLEM_INSIGHT", "BLOCK_BACK_TRUST_CONTACT"],
        recommendedBlocks: ["BLOCK_CASE_STUDIES"],
        mandatoryModuleIds: ["MOD_BRAND_STORY_LONG", "MOD_VALUE_PILLARS", "MOD_CONTACT_PANEL"],
    },

    // 3. Value: IR & Strategic Report
    {
        id: "KIND_IR_INVESTMENT_BRIEF",
        category: "CORPORATE",
        label: "IR 및 경영 리포트",
        description: "미래 가치 전달을 위한 투자유치, 연차보고, ESG",
        primaryAudience: ["투자자", "주주", "평가 위원"],
        defaultTone: "investor",
        claimPolicyMode: "strict",
        requiredFacts: ["brandName", "contactEmail", "legalNotices"],
        defaultBlocks: ["BLOCK_FRONT_IDENTITY", "BLOCK_PROBLEM_INSIGHT", "BLOCK_SOLUTION_DEEPDIVE", "BLOCK_IMPACT_METRICS", "BLOCK_TEAM_GOVERNANCE", "BLOCK_BACK_TRUST_CONTACT"],
        recommendedBlocks: ["BLOCK_FAQ_OBJECTIONS"],
        mandatoryModuleIds: ["MOD_MARKET_SNAPSHOT", "MOD_TRACTION_METRICS", "MOD_TEAM_OVERVIEW", "MOD_CONTACT_PANEL", "MOD_LEGAL_NOTICES"],
    },

    // =================================================================
    // CATEGORY B: PUBLIC (공공/기관)
    // =================================================================

    // 4. Information: Policy & Project Guide
    {
        id: "KIND_PUBLIC_POLICY_GUIDE",
        category: "PUBLIC",
        label: "정책 및 사업 안내",
        description: "대국민 사업 홍보, 정책 가이드, 참여형 공모",
        primaryAudience: ["시민", "수혜 기업", "신청자"],
        defaultTone: "official",
        claimPolicyMode: "strict",
        requiredFacts: ["brandName", "periodText", "eligibilityText", "requiredDocsText", "contactPhone"],
        defaultBlocks: ["BLOCK_FRONT_IDENTITY", "BLOCK_PROCESS_TIMELINE", "BLOCK_BACK_TRUST_CONTACT"],
        recommendedBlocks: ["BLOCK_PROBLEM_INSIGHT", "BLOCK_FAQ_OBJECTIONS"],
        mandatoryModuleIds: ["MOD_POLICY_SUMMARY", "MOD_PROCESS_STEPS", "MOD_CONTACT_PANEL", "MOD_LEGAL_NOTICES"],
    },

    // 5. Space & Role: Institution & Facility
    {
        id: "KIND_PUBLIC_FACILITY_INTRO",
        category: "PUBLIC",
        label: "기관 및 시설 소개",
        description: "방문 유도를 위한 시설 안내, 센터 홍보, 조직 역할",
        primaryAudience: ["방문객", "이용자", "지역 주민"],
        defaultTone: "neutral",
        claimPolicyMode: "strict",
        requiredFacts: ["brandName", "addressText", "operatingHoursText", "contactPhone"],
        defaultBlocks: ["BLOCK_FRONT_IDENTITY", "BLOCK_PROCESS_TIMELINE", "BLOCK_BACK_TRUST_CONTACT"],
        recommendedBlocks: ["BLOCK_PROBLEM_INSIGHT"],
        mandatoryModuleIds: ["MOD_FACILITY_INFO", "MOD_USAGE_GUIDE", "MOD_CONTACT_PANEL", "MOD_LEGAL_NOTICES"],
    },

    // 6. Accountability: Performance & White Paper
    {
        id: "KIND_PUBLIC_ANNUAL_REPORT",
        category: "PUBLIC",
        label: "성과 및 결과 보고",
        description: "투명한 운영 입증을 위한 성과 백서, 연차 보고서",
        primaryAudience: ["상위 기관", "의회", "감사", "국민"],
        defaultTone: "official",
        claimPolicyMode: "strict",
        requiredFacts: ["brandName", "periodText", "legalNotices"],
        defaultBlocks: ["BLOCK_FRONT_IDENTITY", "BLOCK_IMPACT_METRICS", "BLOCK_BACK_TRUST_CONTACT"],
        recommendedBlocks: ["BLOCK_CASE_STUDIES", "BLOCK_TEAM_GOVERNANCE"],
        mandatoryModuleIds: ["MOD_REPORT_HIGHLIGHTS", "MOD_TRACTION_METRICS", "MOD_CONTACT_PANEL", "MOD_LEGAL_NOTICES"],
    },
];

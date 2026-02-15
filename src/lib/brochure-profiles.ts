// src/lib/brochure-profiles.ts
import { IndustryProfile } from "@/types/brochure";

export const INDUSTRY_PROFILES: IndustryProfile[] = [
    {
        profileId: "PROF_TECH_SAAS_PRODUCT",
        industry: { l1: "J", l2: "IT_SAAS", l3: "보안 솔루션" },
        intent: "PRODUCT_CATALOG",
        audience: "B2B_STAFF",
        stage: "CONSIDERATION",
        terminologyMap: {
            customer: "클라이언트",
            benefit: "도입 효과",
            proof: "기술 인증 및 레퍼런스"
        },
        requiredEvidence: ["보안 인증(ISMS 등)", "실적 지표", "호환성 목록"],
        visualDensity: { text: "MEDIUM", graphics: "HIGH" },
        defaultBlocks: ["BLOCK_FRONT_IDENTITY", "BLOCK_PROBLEM_INSIGHT", "BLOCK_SOLUTION_DEEPDIVE", "BLOCK_SPECS_COMPLIANCE", "BLOCK_BACK_TRUST_CONTACT"],
        questionBlueprintId: "QB_PRODUCT_TECH"
    },
    {
        profileId: "PROF_PUBLIC_POLICY_GUIDE",
        industry: { l1: "O", l2: "PUB_POLICY", l3: "지원사업" },
        intent: "PUBLIC_POLICY",
        audience: "GOVERNMENT",
        stage: "AWARENESS",
        terminologyMap: {
            customer: "신청 대상자",
            benefit: "지원 혜택",
            proof: "관련 법령 및 지침"
        },
        requiredEvidence: ["신청 자격", "제출 서류", "지급 규모"],
        compliancePolicy: {
            disclosures: true,
            prohibitedClaims: ["100% 선정 보장", "무조건 지급"],
            mandatoryModules: ["MOD_LEGAL_NOTICES"]
        },
        visualDensity: { text: "HIGH", graphics: "MEDIUM" },
        defaultBlocks: ["BLOCK_FRONT_IDENTITY", "BLOCK_PROCESS_TIMELINE", "BLOCK_BACK_TRUST_CONTACT"],
        questionBlueprintId: "QB_PUBLIC_DEFAULT"
    },
    {
        profileId: "PROF_FIN_VC_IR",
        industry: { l1: "K", l2: "FIN_VC_PE", l3: "VC/PE" },
        intent: "IR_INVESTMENT",
        audience: "INVESTOR",
        stage: "DECISION",
        terminologyMap: {
            customer: "포트폴리오",
            benefit: "회수 전략(Exit)",
            proof: "트랙션 수익 모델"
        },
        requiredEvidence: ["핵심 지표(Traction)", "수익 모델", "팀 프로필", "금융 라이선스"],
        visualDensity: { text: "MEDIUM", graphics: "HIGH" },
        defaultBlocks: ["BLOCK_FRONT_IDENTITY", "BLOCK_IMPACT_METRICS", "BLOCK_TEAM_GOVERNANCE", "BLOCK_BACK_TRUST_CONTACT"],
        questionBlueprintId: "QB_IR_INVESTOR"
    }
];

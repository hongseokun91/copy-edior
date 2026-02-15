// src/lib/brochure-questions/bank.ts
import type { QuestionSpec } from "@/types/brochure-questions";

export const QUESTION_BANK: QuestionSpec[] = [
    // =========================
    // IDENTITY / CORE (공통)
    // =========================
    {
        id: "Q_BRAND_NAME",
        depth: 1,
        title: "브랜드/기관명",
        prompt: "브로슈어에 표기할 공식 명칭을 입력해 주세요.",
        answerType: "text",
        tags: ["core", "identity"],
        requiredBase: true,
        mapsTo: { factsKey: "brandName", mergeStrategy: "replace" },
    },
    {
        id: "Q_CONTACT_PHONE",
        depth: 1,
        title: "대표 전화번호",
        prompt: "대표 문의 전화번호를 입력해 주세요.",
        help: "예: 02-1234-5678 / 010-1234-5678",
        answerType: "phone",
        tags: ["core", "compliance"],
        includeIf: { moduleIdsAny: ["MOD_CONTACT_PANEL"] },
        mapsTo: { factsKey: "contactPhone", mergeStrategy: "replace" },
    },
    {
        id: "Q_CONTACT_EMAIL",
        depth: 1,
        title: "대표 이메일",
        prompt: "대표 문의 이메일을 입력해 주세요.",
        answerType: "email",
        tags: ["core", "compliance"],
        includeIf: { moduleIdsAny: ["MOD_CONTACT_PANEL"] },
        mapsTo: { factsKey: "contactEmail", mergeStrategy: "replace" },
    },
    {
        id: "Q_WEBSITE_URL",
        depth: 1,
        title: "웹사이트/랜딩 URL",
        prompt: "사용자가 확인할 수 있는 URL이 있다면 입력해 주세요.",
        answerType: "url",
        tags: ["core", "identity"],
        includeIf: { moduleIdsAny: ["MOD_CONTACT_PANEL"] },
        mapsTo: { factsKey: "websiteUrl", mergeStrategy: "replace" },
    },

    // =========================
    // STORY (공통, but blocks/modules로 노출)
    // =========================
    {
        id: "Q_BRAND_STORY_WHAT_WHY",
        depth: 2,
        title: "브랜드/기관의 존재 이유(WHY)",
        prompt: "왜 이 브랜드/기관/서비스가 존재하나요? 해결하려는 문제를 3~5문장으로 적어주세요.",
        answerType: "textarea",
        tags: ["story"],
        includeIf: { moduleIdsAny: ["MOD_BRAND_STORY_LONG", "MOD_PROBLEM_NARRATIVE"] },
    },
    {
        id: "Q_PERSONA_SCENARIO",
        depth: 2,
        title: "대표 고객/사용자 시나리오",
        prompt: "대표 타깃이 겪는 상황을 ‘하루 장면’처럼 구체적으로 적어주세요.",
        example: "예: 담당자가 서류 준비 과정에서 가장 많이 막히는 지점은…",
        answerType: "textarea",
        tags: ["story"],
        includeIf: { moduleIdsAny: ["MOD_PERSONA_SCENARIO"] },
    },

    // =========================
    // VALUE (공통)
    // =========================
    {
        id: "Q_VALUE_PILLARS",
        depth: 2,
        title: "핵심 가치/약속(3~4개)",
        prompt: "브로슈어에서 반복할 핵심 가치(약속)를 3~4개로 정리해 주세요.",
        help: "짧게(12~18자), 명사구로 권장",
        answerType: "multiselect",
        options: [
            { label: "신뢰/투명", value: "trust" },
            { label: "효율/시간절감", value: "efficiency" },
            { label: "품질/전문성", value: "quality" },
            { label: "확장성/유연", value: "scalable" },
            { label: "합리적 비용", value: "cost" },
            { label: "안전/준수", value: "compliance" },
        ],
        tags: ["value"],
        includeIf: { moduleIdsAny: ["MOD_VALUE_PILLARS"] },
    },
    {
        id: "Q_FEATURES_TOP",
        depth: 2,
        title: "주요 기능/특징(최대 7개)",
        prompt: "핵심 기능/특징을 사용자가 이해할 수 있게 짧게 적어주세요.",
        answerType: "textarea",
        tags: ["value"],
        includeIf: { moduleIdsAny: ["MOD_FEATURES_BULLETS", "MOD_SOLUTION_ARCH"] },
    },

    // =========================
    // PROCESS / TIMELINE (공공/제안/도입 등)
    // =========================
    {
        id: "Q_PROCESS_STEPS",
        depth: 2,
        title: "진행 절차(단계)",
        prompt: "사용자가 따라야 할 절차를 단계별로 적어주세요. (예: 신청→검토→결과 안내)",
        answerType: "textarea",
        tags: ["process"],
        includeIf: { moduleIdsAny: ["MOD_PROCESS_STEPS", "MOD_CHECKLIST", "MOD_USAGE_GUIDE"] },
    },
    {
        id: "Q_TIMELINE_MILESTONES",
        depth: 2,
        title: "주요 일정/마일스톤",
        prompt: "기간, 마감, 발표 등 중요한 일정이 있다면 적어주세요.",
        answerType: "textarea",
        tags: ["process"],
        includeIf: { moduleIdsAny: ["MOD_TIMELINE"] },
    },

    // =========================
    // PRICING / SOW (서비스 제안서 계열)
    // =========================
    {
        id: "Q_PACKAGES",
        depth: 2,
        title: "패키지/플랜 구성",
        prompt: "패키지별 포함 범위/산출물을 적어주세요. (예: Basic/Pro/Enterprise)",
        answerType: "textarea",
        tags: ["pricing", "value"],
        includeIf: { moduleIdsAny: ["MOD_PRICING_PACKAGES"] },
    },
    {
        id: "Q_SOW_INCLUDED_EXCLUDED",
        depth: 2,
        title: "포함/미포함 범위(SOW)",
        prompt: "프로젝트에 포함되는 것/포함되지 않는 것을 명확히 적어주세요.",
        answerType: "textarea",
        tags: ["pricing", "compliance"],
        includeIf: { moduleIdsAny: ["MOD_SOW_SCOPE"] },
    },

    // =========================
    // PROOF – 공공(STRICT) : 법적근거/자격/서류/오해 방지
    // =========================
    {
        id: "Q_PUBLIC_LEGAL_BASIS",
        depth: 3,
        title: "법적 근거/공고 근거",
        prompt: "정책/지원사업/모집의 근거가 되는 문서명을 적어주세요. (조례/지침/공고명/발행기관)",
        answerType: "textarea",
        tags: ["proof", "compliance"],
        includeIf: { kindIds: ["KIND_PUBLIC_POLICY_GUIDE", "KIND_PUBLIC_ANNUAL_REPORT", "KIND_PUBLIC_RECRUIT_EVENT"], claimPolicyMode: "strict" },
    },
    {
        id: "Q_PUBLIC_KPI",
        depth: 3,
        title: "정책 성과 지표 (KPI)",
        prompt: "정책의 정량적 성과(예: 참여자 수, 만족도, 예산 집행률)를 입력해주세요.",
        answerType: "textarea",
        tags: ["proof", "traction"],
        includeIf: { kindIds: ["KIND_PUBLIC_ANNUAL_REPORT"] },
    },
    {
        id: "Q_PRODUCT_DIFF_10X",
        depth: 3,
        title: "10배 차별화 포인트",
        prompt: "대체재나 경쟁사 대비 10배 뛰어난 단 하나의 핵심 차별점은 무엇인가요?",
        answerType: "textarea",
        tags: ["value"],
        includeIf: { blockTypes: ["BLOCK_SOLUTION_DEEPDIVE"] },
    },
    {
        id: "Q_IR_TAM_SAM_SOM",
        depth: 4,
        title: "시장 규모 및 근거 (TAM/SAM/SOM)",
        prompt: "목표로 하는 시장의 전체 규모와 우리가 점유 가능한 구체적 범위를 근거와 함께 적어주세요.",
        answerType: "textarea",
        tags: ["market", "proof"],
        includeIf: { kindIds: ["KIND_IR_INVESTMENT_BRIEF"] },
    },

    // =========================
    // PROOF – IR(STRICT) : 지표 정의/측정/기간/가정/리스크
    // =========================
    {
        id: "Q_IR_MARKET_SNAPSHOT",
        depth: 3,
        title: "시장 근거(출처/기간 포함)",
        prompt: "시장/문제의 근거를 3~5개 적어주세요. 각 항목에 ‘출처 유형(공공통계/리서치/내부) + 기간’을 포함해주세요.",
        help: "예: 공공통계(2024), 업계 리포트(2025), 내부 집계(최근 90일)",
        answerType: "textarea",
        tags: ["proof", "market"],
        includeIf: { kindIds: ["KIND_IR_INVESTMENT_BRIEF"], claimPolicyMode: "strict" },
    },
    {
        id: "Q_IR_TRACTION_METRICS",
        depth: 3,
        title: "Traction 지표(정의/기간/측정 방식)",
        prompt: "핵심 지표 3개를 적어주세요. 각 지표마다 ‘정의 + 기간 + 측정 방식’을 포함해 주세요.",
        example: "MAU(중복제거 기준), 최근 3개월, GA4 기준",
        answerType: "textarea",
        tags: ["proof", "traction"],
        includeIf: { kindIds: ["KIND_IR_INVESTMENT_BRIEF"], claimPolicyMode: "strict" },
        mapsTo: { factsKey: "metrics", mergeStrategy: "replace" },
    },
    {
        id: "Q_IR_COMPETITIVE_EDGE_EVIDENCE",
        depth: 4,
        title: "경쟁 대비 우위(증거 기반)",
        prompt: "경쟁/대안 대비 우위를 2~3개 적고, 각 우위의 ‘증거(지표/사실/사례)’를 함께 적어주세요.",
        answerType: "textarea",
        tags: ["proof", "value"],
        includeIf: { kindIds: ["KIND_IR_INVESTMENT_BRIEF"], claimPolicyMode: "strict" },
    },
    {
        id: "Q_IR_RISKS_AND_MITIGATION",
        depth: 5,
        title: "핵심 리스크 & 완화 계획",
        prompt: "가장 큰 리스크 2개와 이를 줄이기 위한 실행 계획/마일스톤을 적어주세요.",
        answerType: "textarea",
        tags: ["proof", "compliance"],
        includeIf: { kindIds: ["KIND_IR_INVESTMENT_BRIEF"], claimPolicyMode: "strict" },
    },
    {
        id: "Q_IR_ASK_USE_OF_FUNDS",
        depth: 4,
        title: "투자 Ask(금액/용도/런웨이)",
        prompt: "이번 라운드에서 필요한 금액, 사용처(비중), 목표 런웨이/마일스톤을 적어주세요.",
        answerType: "textarea",
        tags: ["value", "proof"],
        includeIf: { kindIds: ["KIND_IR_INVESTMENT_BRIEF"], claimPolicyMode: "strict" },
    },

    // =========================
    // PROOF – 제품(스펙/시험조건/호환)
    // =========================
    {
        id: "Q_PRODUCT_SPECS_KV",
        depth: 3,
        title: "핵심 스펙(키:값)",
        prompt: "스펙을 ‘항목: 내용’ 형태로 적어주세요. (예: 소재: 304 스테인리스)",
        answerType: "textarea",
        tags: ["proof", "value"],
        includeIf: { moduleIdsAny: ["MOD_SPECS_TABLE"] },
    },
    {
        id: "Q_PRODUCT_TEST_CONDITIONS",
        depth: 4,
        title: "성능/품질의 측정 조건",
        prompt: "성능/품질을 말할 때 기준이 되는 시험 조건/측정 방식이 있다면 적어주세요.",
        answerType: "textarea",
        tags: ["proof", "compliance"],
        includeIf: { kindIds: ["KIND_PRODUCT_CATALOG"], moduleIdsAny: ["MOD_SPECS_TABLE"] },
    },

    // =========================
    // COMPLIANCE (Strict일 때 강화)
    // =========================
    {
        id: "Q_LEGAL_NOTICES",
        depth: 3,
        title: "법적 고지/면책 문구",
        prompt: "필요한 고지/주의 사항이 있다면 적어주세요. (없으면 비워도 됩니다)",
        answerType: "textarea",
        tags: ["compliance"],
        includeIf: { moduleIdsAny: ["MOD_LEGAL_NOTICES"], claimPolicyMode: "strict" },
        mapsTo: { factsKey: "legalNotices", mergeStrategy: "replace" },
    },
    {
        id: "Q_CERTIFICATIONS_LIST",
        depth: 3,
        title: "인증/수상/등록",
        prompt: "실제 보유한 인증/수상/등록이 있다면 나열해 주세요. (허위 생성 금지)",
        answerType: "textarea",
        tags: ["proof"],
        includeIf: { moduleIdsAny: ["MOD_CERTIFICATIONS"] },
        mapsTo: { factsKey: "certifications", mergeStrategy: "replace" },
    },
    {
        id: "Q_PARTNERS_CLIENTS",
        depth: 3,
        title: "파트너/고객(표기 가능한 범위)",
        prompt: "표기 가능한 파트너/고객(또는 레퍼런스)을 적어주세요. (비공개면 '비공개'로)",
        answerType: "textarea",
        tags: ["proof"],
        includeIf: { moduleIdsAny: ["MOD_LOGO_WALL"] },
        mapsTo: { factsKey: "partnersOrClients", mergeStrategy: "replace" },
    },

    // =========================
    // CONTACT / ACTION
    // =========================
    {
        id: "Q_CTA_ONE_LINER",
        depth: 2,
        title: "최종 CTA 한 줄",
        prompt: "사용자에게 원하는 행동을 한 줄로 적어주세요. (예: 상담 신청 / 참여하기 / 데모 요청)",
        answerType: "text",
        tags: ["contact", "value"],
        includeIf: { moduleIdsAny: ["MOD_CONTACT_PANEL"] },
    },
];

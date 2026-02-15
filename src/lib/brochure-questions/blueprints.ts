// src/lib/brochure-questions/blueprints.ts
import { BrochureIntentId } from "@/types/brochure";

export interface QuestionBlueprint {
    id: string;
    intent: BrochureIntentId;
    coreQuestions: Array<{
        id: string;
        label: string;
        placeholder: string;
        required: boolean;
        evidenceField?: string;
    }>;
    optionalQuestions: Array<{
        id: string;
        label: string;
        placeholder: string;
    }>;
}

export const QUESTION_BLUEPRINTS: Record<string, QuestionBlueprint> = {
    QB_PUBLIC_DEFAULT: {
        id: "QB_PUBLIC_DEFAULT",
        intent: "PUBLIC_POLICY",
        coreQuestions: [
            { id: "policy_goal", label: "정책/사업 목적", placeholder: "이 사업을 통해 달성하고자 하는 핵심 KPI는 무엇인가요?", required: true },
            { id: "eligibility", label: "지원 자격", placeholder: "수혜자 자격요건, 우선순위, 제외조건을 입력해주세요.", required: true, evidenceField: "eligibilityText" },
            { id: "process", label: "진행 절차", placeholder: "신청부터 선정, 집행까지의 타임라인은?", required: true, evidenceField: "timelineText" }
        ],
        optionalQuestions: [
            { id: "required_docs", label: "제출 서류", placeholder: "접수 시 필요한 서류 목록을 입력해주세요." },
            { id: "faq_common", label: "자주 묻는 질문", placeholder: "가장 문의가 많은 내용 3가지만 알려주세요." }
        ]
    },
    QB_PRODUCT_TECH: {
        id: "QB_PRODUCT_TECH",
        intent: "PRODUCT_CATALOG",
        coreQuestions: [
            { id: "use_case", label: "사용 시나리오", placeholder: "누가 어떤 상황에서 이 제품을 쓰면 가장 효과적인가요?", required: true },
            { id: "key_specs", label: "핵심 기술 사양", placeholder: "경쟁사 대비 압도적인 스펙 3가지를 알려주세요.", required: true },
            { id: "roi_metrics", label: "도입 효과(ROI)", placeholder: "비용 절감, 시간 단축 등 수치로 표현 가능한 효과는?", required: true }
        ],
        optionalQuestions: [
            { id: "compatibiltiy", label: "호환성/환경", placeholder: "설치 환경이나 연동 가능한 시스템은 무엇인가요?" },
            { id: "maintenance", label: "유지보수 정책", placeholder: "A/S 및 기술 지원 범위를 입력해주세요." }
        ]
    },
    QB_IR_INVESTOR: {
        id: "QB_IR_INVESTOR",
        intent: "IR_INVESTMENT",
        coreQuestions: [
            { id: "traction", label: "핵심 지표(Traction)", placeholder: "지난 6~12개월간의 성장률과 핵심 지표를 입력해주세요.", required: true },
            { id: "market_size", label: "시장 규모(TAM/SAM/SOM)", placeholder: "우리가 목표로 하는 시장의 크기와 근거는?", required: true },
            { id: "exit_strategy", label: "수익 모델 및 회수 전략", placeholder: "어떻게 돈을 벌고 투자자에게 어떻게 수익을 돌려주나요?", required: true }
        ],
        optionalQuestions: [
            { id: "team_strength", label: "팀 역량", placeholder: "이 문제를 해결할 수 있는 팀원들의 핵심 경력은?" },
            { id: "risk_mitigation", label: "리스크 및 완화 전략", placeholder: "예상되는 리스크와 이에 대한 대응책은?" }
        ]
    }
};

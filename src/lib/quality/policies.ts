import { ModulePolicy } from "./types";

/**
 * Enterprise Module Policies
 * Extracted from high-fidelity copywriting knowledge base.
 */
export const MODULE_POLICIES: Record<string, ModulePolicy> = {
    BRAND_STORY: {
        purpose: "시작 이유와 성취 기반의 신뢰 구축",
        requiredEvidence: ["process_or_standard", "time_or_result"],
        minSpecificity: 2,
        maxCtas: 1,
        requiredSlots: ["H", "B", "C", "E", "R", "CTA"]
    },
    CORE_SERVICE: {
        purpose: "제공 가치의 선명한 정의와 단계별 실천법",
        requiredEvidence: ["process_steps", "review", "number", "case"],
        requiredStructures: ["one_sentence_definition", "steps_3_to_5"],
        minSpecificity: 2,
        maxCtas: 1
    },
    PRICING: {
        purpose: "가격 투명성 확보를 통한 구매 불안 제거",
        cutoff: 90,
        requiredStructures: ["include", "option", "condition", "finalize_method"],
        requiredEvidence: ["policy_terms"],
        minSpecificity: 3,
        maxCtas: 1
    },
    QUALITY_WARRANTY: {
        purpose: "결과에 대한 책임 명시 및 리스크 제거",
        cutoff: 90,
        requiredStructures: ["scope", "term", "process", "exceptions", "intake"],
        minSpecificity: 3,
        maxCtas: 1
    },
    QA: {
        purpose: "고객의 마지막 의구심(가격/시간/환불 등) 해소",
        cutoff: 90,
        requiredStructures: ["min_questions_3", "core_topics"],
        minSpecificity: 2,
        maxCtas: 1
    },
    BEFORE_AFTER: {
        purpose: "결과의 객관적 비교 및 성취 증명",
        cutoff: 90,
        requiredStructures: ["measurement", "disclaimer"],
        minSpecificity: 3,
        maxCtas: 1
    },
    EXPERT_PROFILE: {
        purpose: "증명된 실력자를 통한 품질 보증",
        requiredEvidence: ["role", "credential", "project", "years"],
        minSpecificity: 2,
        maxCtas: 0
    },
    USP: {
        purpose: "경쟁사와 차별화되는 단 하나의 강력한 이유",
        requiredEvidence: ["compare_axis", "evidence_source"],
        minSpecificity: 2,
        maxCtas: 1
    }
};

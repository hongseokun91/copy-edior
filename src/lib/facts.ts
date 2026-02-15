
import { NormalizedBrief } from "@/types/brief";
import { FlyerInputs } from "@/types/flyer";
import { normalizeInput } from "./copy/normalize";

export interface MissingFact {
    id: string; // key for internal tracking
    label: string; // User friendly label (e.g. "주차 여부")
    question: string; // The question to ask (e.g. "주차는 가능한가요?")
    type: 'text' | 'yesno' | 'select';
    options?: string[];
}

// Knowledge Base for Questions
const COMMON_FACTS = {
    parking: { id: "parking", label: "주차 여부", question: "주차 공간이 있나요?", type: "yesno" } as MissingFact,
    reservation: { id: "reservation", label: "예약 여부", question: "예약이 필수인가요?", type: "yesno" } as MissingFact,
};

const CATEGORY_FACTS: Record<string, MissingFact[]> = {
    "식당/카페": [
        COMMON_FACTS.parking,
        COMMON_FACTS.reservation,
        { id: "signature_menu", label: "대표 메뉴", question: "가장 인기 있는 메뉴 1가지만 알려주세요.", type: "text" }
    ],
    "학원/교육": [
        { id: "target_grade", label: "대상 학년", question: "주로 어떤 학생들이 수강하나요?", type: "select", options: ["유치부", "초등부", "중등부", "고등부", "성인"] },
        { id: "subject", label: "수업 과목", question: "어떤 과목을 가르치시나요?", type: "text" }
    ],
    "뷰티/헬스": [
        COMMON_FACTS.parking,
        COMMON_FACTS.reservation,
        { id: "duration", label: "소요 시간", question: "평균 시술/운동 시간은 얼마나 걸리나요?", type: "text" }
    ]
};

// Check Logic
export function checkFactCompleteness(brief: NormalizedBrief): MissingFact[] {
    const category = brief.industry; // "식당/카페" etc
    const rules = CATEGORY_FACTS[category] || [];

    // Combine all text sources to search for answers
    const fullText = `
        ${brief.offerRaw} 
        ${brief.original_input.additionalBrief || ""} 
        ${brief.storeName}
    `;

    const missing: MissingFact[] = [];

    for (const rule of rules) {
        // Simple Keyword Heuristic
        // If the question is about "Parking", checks if "주차" is mentioned.
        // If mentioned, assume user provided info.
        // If NOT mentioned, flagging it as missing.

        let keyword = rule.label.replace(" 여부", ""); // "주차"
        if (rule.id === "target_grade") keyword = "대상";

        // Extended Keywords
        const keywords = [keyword];
        if (rule.id === "parking") keywords.push("발렛", "공영");
        if (rule.id === "reservation") keywords.push("예약");
        if (rule.id === "signature_menu") keywords.push("메뉴", "음식", "맛");
        if (rule.id === "target_grade") keywords.push("초등", "중등", "고등", "학년", "살");

        const found = keywords.some(k => fullText.includes(k));
        if (!found) {
            missing.push(rule);
        }
    }

    // Cap strictly to 1 question to avoid annoyance (Micro-Interaction)
    return missing.slice(0, 1);
}

// Export for frontend use (need to re-export normalize in index maybe, or just import from file)
export { normalizeInput };

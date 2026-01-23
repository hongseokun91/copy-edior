export const SLOT_LIMITS = {
    HEADLINE: 18, // Large text, main hook
    SUBHEAD: 32, // Supporting text
    BENEFIT_BULLETS: {
        COUNT: 3, // Max items
        LENGTH: 18, // Max chars per item
    },
    CTA: 16, // Button text
    DISCLAIMER: 40, // Small legal text
} as const;

export type SlotLimitKey = keyof typeof SLOT_LIMITS;

export const SLOT_DESCRIPTIONS = {
    HEADLINE: "시선을 사로잡는 강력한 한 문장",
    SUBHEAD: "혜택이나 가치를 구체적으로 설명",
    BENEFIT_BULLETS: "핵심 장점 3가지 요약",
    CTA: "행동을 유도하는 버튼 문구",
    INFO: "위치, 운영시간, 연락처 등 필수 정보",
    DISCLAIMER: "유의사항 및 법적 표기",
} as const;

import { RuleSpec } from "./types";

/**
 * Enterprise Copywriting Rules (The "Wisdom")
 * Transcribed from high-fidelity knowledge base into safe TypeScript.
 */
export const QUALITY_RULES: RuleSpec[] = [
    // --- HARD FAIL: Credibility & Safety ---
    {
        id: "HF-001",
        name: "Overclaim: absolute guarantee",
        category: "credibility_safety",
        severity: "HARD_FAIL",
        modules: ["*"],
        detection: {
            type: "regex_any",
            patterns: [
                "(100%|200%)",
                "(무조건|절대|완벽(하게|한)?|확실(히)?|반드시)",
                "(부작용\\s*없(음|어요)|실패\\s*없(음|어요))",
                "(보장(합니다|해요)?|영구|무제한)"
            ],
            flags: "gi"
        },
        action: [
            {
                type: "DOWNSHIFT",
                strategy: "safe_softener"
            }
        ],
        score: {
            penalty: -999,
            dimensionDelta: { credibility_safety: -5 }
        },
        message: "단정/보장 표현은 신뢰도를 떨어뜨립니다. '기준에 따라 안내' 등 완화된 표현을 사용하세요."
    },
    {
        id: "HF-002",
        name: "Rank claim without evidence",
        category: "credibility_safety",
        severity: "HARD_FAIL",
        modules: ["*"],
        detection: {
            type: "composite_all",
            all: [
                {
                    type: "regex_any",
                    patterns: ["(업계\\s*1위|국내\\s*최초|유일(한)?|No\\.?\\s*1|원탑)"],
                    flags: "gi"
                },
                {
                    type: "regex_none",
                    patterns: ["(인증|수상|특허|ISO|KS|협회|공식|기사|보도|데이터|출처)"],
                    flags: "gi"
                }
            ]
        },
        action: [
            { type: "LABEL", label: "[확인필요: 1위/최초 근거]" }
        ],
        score: {
            penalty: -999,
            dimensionDelta: { credibility_safety: -5 }
        },
        message: "인증이나 수상 내역 등 근거 없이 '1위', '최초' 등의 표현을 사용하는 것은 위험합니다."
    },

    // --- HARD FAIL: Tone & Manner Mismatch ---
    {
        id: "HF-TONE-001",
        name: "Casual Hype in Serious Context",
        category: "voice_fit",
        severity: "HARD_FAIL",
        modules: ["*"],
        targetIntents: ["INT_PUBLIC_NOTICE", "INT_BRAND_STORY", "INT_RECRUITMENT_JOB"],
        detection: {
            type: "regex_any",
            patterns: [
                "(대박|미친|역대급|초특가|미쳤다|찢었다|강추|핵|존맛|jmt)",
                "!{2,}" // Double exclamation
            ],
            flags: "gi"
        },
        action: [
            { type: "LABEL", label: "[톤앤매너 불일치]" }
        ],
        score: {
            penalty: -50,
            dimensionDelta: { voice_fit: -5, credibility_safety: -3 }
        },
        message: "공지사항이나 브랜드 스토리 등 진중한 의도에서는 과장된 표현이나 속어를 사용할 수 없습니다."
    },

    // --- HARD FAIL: Module Integrity ---
    {
        id: "HF-PR-001",
        name: "Pricing Policy required components",
        category: "credibility_safety",
        severity: "HARD_FAIL",
        modules: ["PRICING"],
        detection: {
            type: "composite_any",
            any: [
                { type: "regex_none", patterns: ["(포함|구성|제공)"], flags: "gi" },
                { type: "regex_none", patterns: ["(옵션|추가|선택)"], flags: "gi" },
                { type: "regex_none", patterns: ["(조건|예외|단,|다만|제외)"], flags: "gi" }
            ]
        },
        message: "가격 정보에는 반드시 포함 사항, 옵션, 예외 조건을 명시해야 합니다."
    },

    // --- HIGH: Voice & Specificity ---
    {
        id: "ST-201",
        name: "Cliche Detector",
        category: "voice_fit",
        severity: "HIGH",
        modules: ["*"],
        detection: {
            type: "lexicon_count_gte",
            lexiconKey: "CLICHE_BLOCKLIST",
            minCount: 2
        },
        action: [
            { type: "REPLACE", strategy: "cliche_to_specific", mapKey: "CLICHE_TO_SPECIFIC" }
        ],
        score: {
            penalty: -10,
            dimensionDelta: { voice_fit: -1, specificity: -1 }
        },
        message: "상투적인 표현(클리셰)은 브랜드 가치를 낮춥니다. 구체적인 사실로 대체하세요."
    },
    {
        id: "ST-202",
        name: "Abstract to Specific",
        category: "specificity",
        severity: "HIGH",
        modules: ["*"],
        detection: {
            type: "lexicon_count_gte",
            lexiconKey: "ABSTRACT_WORDS",
            minCount: 2
        },
        action: [
            { type: "REPLACE", strategy: "abstract_to_specific", mapKey: "ABSTRACT_TO_SPECIFIC_MAP" }
        ],
        score: {
            penalty: -8,
            dimensionDelta: { specificity: -2 }
        },
        message: "추상적인 형용사 대신 수치나 절차 등 구체적인 정보를 제공하세요."
    },

    // --- MEDIUM: Trust Evidence ---
    {
        id: "EV-103",
        name: "Testimonial Detection",
        category: "credibility_safety",
        severity: "MEDIUM",
        modules: ["REVIEWS", "BRAND_STORY", "USP"],
        detection: {
            type: "regex_any",
            patterns: ["(후기|리뷰|재방문|고객\\s*평|\".+?\"|“.+?”)"],
            flags: "gi"
        },
        score: { bonus: 5, dimensionDelta: { credibility_safety: 1 } },
        message: "고객 후기나 리뷰는 강력한 신뢰 증거가 됩니다."
    },
    {
        id: "EV-104",
        name: "Certification Detection",
        category: "credibility_safety",
        severity: "MEDIUM",
        modules: ["AWARDS_CERTS", "BRAND_STORY", "USP"],
        detection: {
            type: "regex_any",
            patterns: ["(인증|수상|특허|ISO|KS|협회|공식|검사)"],
            flags: "gi"
        },
        score: { bonus: 6, dimensionDelta: { credibility_safety: 1 } },
        message: "공식적인 인증이나 수상 내역은 신뢰도를 크게 높입니다."
    },

    // --- LOW: Style & Rhythm ---
    {
        id: "RD-302",
        name: "Ending repetition",
        category: "readability_rhythm",
        severity: "LOW",
        modules: ["*"],
        detection: {
            type: "ending_repetition_gte",
            endings: ["합니다", "됩니다", "있습니다"],
            minRun: 4
        },
        score: { penalty: -3, dimensionDelta: { readability_rhythm: -1 } },
        message: "동일한 어미가 반복되어 글이 단조롭습니다. 어미를 다양화화여 리듬감을 살리세요."
    },

    // --- MEDIUM: Structure & Conversion ---
    {
        id: "CNV-401",
        name: "Call to Action required",
        category: "conversion",
        severity: "MEDIUM",
        modules: ["*"],
        detection: {
            type: "cta_count",
            ctaLexiconKey: "CTA_LEXICON",
            maxAllowed: 0
        },
        action: [
            { type: "INSERT", position: "end", template: "{{CTA_DEFAULT}}" }
        ],
        score: {
            penalty: -5,
            dimensionDelta: { conversion: -1 }
        },
        message: "모든 모듈에는 고객의 행동을 유도하는 명확한 CTA가 포함되어야 합니다."
    },
    {
        id: "RD-301",
        name: "Sentence length limit",
        category: "readability_rhythm",
        severity: "MEDIUM",
        modules: ["*"],
        detection: {
            type: "sentence_word_count_gt",
            maxWords: 25
        },
        score: {
            penalty: -4,
            dimensionDelta: { readability_rhythm: -1 }
        },
        message: "문장이 너무 깁니다. 가독성을 위해 문장을 나누어 작성하세요."
    }
];

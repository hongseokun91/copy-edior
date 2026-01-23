// Basic stopwords/replacements for shortening
const SYNONYMS: Record<string, string> = {
    "친절한 서비스": "친절 서비스",
    "넓은 주차장": "주차 완비",
    "신선한 재료": "신선 재료",
    "지금 바로 예약하세요": "지금 예약",
    "문의하기": "문의",
    "자세히 알아보기": "더보기",
    "상담 신청하기": "상담 신청",
};

// Forbidden words for safety (Regex)
const UNSAFE_PATTERNS = [
    /100% 보장/,
    /무이조건/,
    /수익 보장/,
    /질병 완치/,
];

export function autoShorten(text: string, limit: number): string {
    if (!text || text.length <= limit) return text;

    // 1. Try Synonym Replacement
    let shortened = text;
    for (const [long, short] of Object.entries(SYNONYMS)) {
        if (shortened.includes(long)) {
            shortened = shortened.replace(long, short);
        }
    }

    if (shortened.length <= limit) return shortened;

    // 2. Truncate if still too long
    return shortened.slice(0, limit - 1) + "…";
}

export function validateSafety(text: string): { safe: boolean; reason?: string } {
    for (const pattern of UNSAFE_PATTERNS) {
        if (pattern.test(text)) {
            return { safe: false, reason: "안전 정책 위반 표현이 포함되어 있습니다." };
        }
    }
    return { safe: true };
}

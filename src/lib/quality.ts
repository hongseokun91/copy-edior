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

// Safe Replacements (P2-3)
const UNSAFE_REPLACEMENTS: [RegExp, string][] = [
    [/100% 보장/g, "확실한 보장"],
    [/무조건/g, "부담 없이"],
    [/수익 보장/g, "수익 창출"],
    [/질병 완치/g, "건강 개선"],
    [/최고의/g, "만족도 높은"],
    [/유일한/g, "차별화된"],
    [/절대/g, "믿을 수 있는"],
    [/국내 최초/g, "색다른"],
    [/세계 최초/g, "혁신적인"],
];

export function autoShorten(text: string, limit: number): string {
    if (!text || text.length <= limit) return text;
    let shortened = text;
    for (const [long, short] of Object.entries(SYNONYMS)) {
        if (shortened.includes(long)) shortened = shortened.replace(long, short);
    }
    if (shortened.length <= limit) return shortened;
    return shortened.slice(0, limit - 1) + "…";
}

// Replaces unsafe words instead of blocking
export function sanitizeContent(text: string): string {
    let safeText = text;
    for (const [pattern, replacement] of UNSAFE_REPLACEMENTS) {
        safeText = safeText.replace(pattern, replacement);
    }
    return safeText;
}

export function validateSafety(text: string): { safe: boolean; reason?: string } {
    // Deprecated blocking logic, kept for critical patterns if needed.
    // For now, relies on sanitization.
    return { safe: true };
}

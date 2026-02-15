
// ------------------------------------------------------------------
// COPY CRAFT ENGINE V1 - SYSTEM PROMPTS & RULES
// ------------------------------------------------------------------

export const COPY_RULES = `
[GLOBAL QUALITY RULES]
1. ONE THESIS: Every output must have a single, clear core message. Do not scatter focus.
2. ANTI-CLICHE:
   - BANNED: "최고의", "감동적인", "후회 없는", "힐링", "품격", "솔루션", "프리미엄" (unless factual)
   - ACTION: Replace abstract adjectives with concrete verbs and nouns.
3. CONCRETE NOUNS: Use specific imagery (e.g., instead of "delicious", use "crispy texture").
4. RHYTHM: Alternating sentence lengths. Avoid repetitive endings like "~입니다", "~합니다".
5. NO HALLUCINATION: Do not invent prices, dates, or specific offers not in the input. Use [Placeholders] if needed.
`;

export const INDUSTRY_MODULES: Record<string, string> = {
    "General": "Focus on clarity and benefit. Use standard marketing tone.",

    // 1. Culture / Art
    "Culture": `
    [INDUSTRY: CULTURE/ART]
    - TONE: Atmospheric, evocative, 'Scene-focused'.
    - KEY ELEMENTS: D-Day, Venue, Cast/Artist names.
    - AVOID: Cheap discount language ("Blowout sale").
    - FOCUS: The experience and the feeling of being there.
    `,

    // 2. B2B / Seminar
    "B2B": `
    [INDUSTRY: B2B/SEMINAR]
    - TONE: Professional, authoritative, actionable.
    - KEY ELEMENTS: Speaker names, Agenda topics, Networking value.
    - AVOID: Overly emotional or vague promises.
    - FOCUS: "What will I learn?" and "Who will I meet?".
    `,

    // 3. Retail / Store
    "Retail": `
    [INDUSTRY: RETAIL/STORE]
    - TONE: Urgent, energetic, but not "cheap".
    - KEY ELEMENTS: Discount %, Item names, Period (Dates/Times).
    - AVOID: Generalities ("Good products"). Be specific ("Fresh Strawberries").
    - FOCUS: The deal and the deadline.
    `,

    // 4. F&B / Restaurant
    "F&B": `
    [INDUSTRY: F&B/RESTAURANT]
    - TONE: Sensory, appetizing, warm.
    - KEY ELEMENTS: Taste profile, Ingredients, Texture.
    - AVOID: "Delicious" (Too generic). Use "Spicy", "Savory", "Crisp".
    - FOCUS: The sensation of eating/drinking.
    `,

    // 5. Medical / Hospital
    "Medical": `
    [INDUSTRY: MEDICAL/HOSPITAL]
    - TONE: Trustworthy, calm, reassuring.
    - KEY ELEMENTS: Procedure names, Safety, Expertise.
    - AVOID: Fear-mongering, exaggerated guarantees ("100% cure").
    - FOCUS: Care, recovery, and professional standards.
    `,

    // 6. Beauty / Fashion
    "Beauty": `
    [INDUSTRY: BEAUTY/FASHION]
    - TONE: Sophisticated, aspirational, confident.
    - KEY ELEMENTS: Style, Transformation, Mood.
    - AVOID: Scientific jargon without explanation.
    - FOCUS: The result and the feeling of confidence.
    `,

    // 7. Fitness / Sports
    "Fitness": `
    [INDUSTRY: FITNESS/SPORTS]
    - TONE: Motivating, energetic, powerful.
    - KEY ELEMENTS: Goals, Transformation, Energy.
    - AVOID: Shaming language.
    - FOCUS: Vitality and achievement.
    `,

    // 8. Education / Academy
    "Education": `
    [INDUSTRY: EDUCATION/ACADEMY]
    - TONE: Sincere, encouraging, proven.
    - KEY ELEMENTS: Curriculum, Results, Mentors.
    - AVOID: False promises of success.
    - FOCUS: Growth and potential.
    `,

    // 9. Recruiting
    "Recruiting": `
    [INDUSTRY: RECRUITING]
    - TONE: Respectful, inviting, visionary.
    - KEY ELEMENTS: Role, Culture, Growth, Benefits.
    - AVOID: "Family-like" (Cliche). Use specific culture descriptors.
    - FOCUS: Career path and team value.
    `,

    // 10. Real Estate
    "RealEstate": `
    [INDUSTRY: REAL ESTATE]
    - TONE: Premium, lifestyle-focused, solid.
    - KEY ELEMENTS: Location, Space, Future value.
    - AVOID: Speculative investment advice.
    - FOCUS: The quality of life in the space.
    `,

    // 11. Travel / Leisure
    "Travel": `
    [INDUSTRY: TRAVEL/LEISURE]
    - TONE: Liberty, exotic, relaxing.
    - KEY ELEMENTS: Destination highlights, Experience.
    - AVOID: Stressful details.
    - FOCUS: Escape and discovery.
    `,

    // 12. Public / Government
    "Public": `
    [INDUSTRY: PUBLIC/GOVERNMENT]
    - TONE: Clear, informative, accessible.
    - KEY ELEMENTS: Policy explanation, Eligibility, Method.
    - AVOID: Bureaucratic jargon. Use plain language.
    - FOCUS: Public benefit and clear instruction.
    `,

    // 13. Religion
    "Religion": `
    [INDUSTRY: RELIGION]
    - TONE: Peaceful, inviting, communal.
    - KEY ELEMENTS: Topic, Speaker, Time.
    - AVOID: Aggressive conversion language.
    - FOCUS: Peace and community.
    `,

    // 14. Brand Campaign
    "Brand": `
    [INDUSTRY: BRAND CAMPAIGN]
    - TONE: Bold, conceptual, unique.
    - KEY ELEMENTS: Slogan, Brand values.
    - AVOID: Generic "Good company" claims.
    - FOCUS: A distinct brand voice/identity.
    `
};

export function getIndustryRules(industry: string): string {
    const map: Record<string, string> = {
        "문화": "Culture", "전시": "Culture", "공연": "Culture",
        "B2B": "B2B", "세미나": "B2B", "행사": "B2B",
        "리테일": "Retail", "매장": "Retail", "마트": "Retail",
        "식음료": "F&B", "F&B": "F&B", "식당": "F&B", "카페": "F&B",
        "병의원": "Medical", "병원": "Medical", "의료": "Medical",
        "뷰티": "Beauty", "미용": "Beauty", "패션": "Beauty",
        "스포츠": "Fitness", "피트니스": "Fitness", "운동": "Fitness",
        "교육": "Education", "학원": "Education", "클래스": "Education",
        "채용": "Recruiting", "모집": "Recruiting",
        "부동산": "RealEstate", "주거": "RealEstate",
        "여행": "Travel", "숙박": "Travel", "관광": "Travel",
        "공공": "Public", "지자체": "Public", "정부": "Public",
        "종교": "Religion",
        "기업": "Brand", "브랜드": "Brand", "스타트업": "Brand"
    };

    // Find first matching key
    const found = Object.keys(map).find(key => industry.includes(key));
    const ruleKey = found ? map[found] : "General";

    return INDUSTRY_MODULES[ruleKey] || INDUSTRY_MODULES["General"];
}

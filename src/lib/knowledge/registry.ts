
export interface IndustryKnowledge {
    id: string;
    alias: string[];
    primaryValues: string[];
    lexicon: {
        sensory: string[];
        functional: string[];
        emotional: string[];
    };
    forbiddenWords: string[];
    expertPersona: string;
    nicheBrief: string;
}

export const INDUSTRY_REGISTRY: Record<string, IndustryKnowledge> = {
    "분식": {
        id: "FNB_BUNSIK",
        alias: ["분식집", "김밥천국", "떡볶이전문점"],
        primaryValues: ["손맛", "신속함", "친근함", "가성비", "깨끗한 기름"],
        lexicon: {
            sensory: ["쫄깃한", "바삭한", "매콤달콤한", "탱글탱글한", "고소한", "칼칼한"],
            functional: ["당일 제조", "오픈 주방", "비법 육수", "수제 튀김", "푸짐한 양"],
            emotional: ["추억의 맛", "엄마 손맛", "든든한 한 끼", "아이들 간식", "기분 좋아지는 매운맛"]
        },
        forbiddenWords: ["법률", "승소", "전문 경영", "럭셔리", "임상", "기술력"],
        expertPersona: "Neighborhood Master Chef with 30 years of hospitality experience.",
        nicheBrief: "Local street food specialized in comfort and immediate satisfaction."
    },
    "다이어트_식단": {
        id: "FNB_DIET",
        alias: ["샐러드", "저탄고지", "키토", "건강식"],
        primaryValues: ["저칼로리", "고단백", "무설탕", "체중 조절", "영양 균형"],
        lexicon: {
            sensory: ["아삭한", "깔끔한", "담백한", "프레쉬한", "가벼운"],
            functional: ["혈당 조절", "저당 소스", "단백질 강화", "식이섬유", "HACCP 인증"],
            emotional: ["죄책감 없는", "나를 위한 투자", "몸이 가벼워지는", "건강한 변화", "지속 가능한"]
        },
        forbiddenWords: ["설탕 폭탄", "고칼로리", "기름진", "자극적인", "건강 해치는"],
        expertPersona: "Certified Nutritionist and Health-conscious Chef.",
        nicheBrief: "Modern health food focused on functional nutrition and metabolic health."
    }
};

export function getKnowledgeForContext(industry: string, additionalBrief: string = ""): IndustryKnowledge[] {
    const matched: IndustryKnowledge[] = [];

    // 1. Direct match by industry name
    if (INDUSTRY_REGISTRY[industry]) matched.push(INDUSTRY_REGISTRY[industry]);

    // 2. Keyword match in brief (e.g., if brief mentions "다이어트")
    for (const [key, knowledge] of Object.entries(INDUSTRY_REGISTRY)) {
        if (additionalBrief.includes(key) && !matched.some(m => m.id === knowledge.id)) {
            matched.push(knowledge);
        }
    }

    return matched;
}

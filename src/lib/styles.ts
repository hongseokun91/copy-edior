export interface StyleRule {
    lengthBias: "short" | "normal" | "long";
    emojiAllowed: boolean;
    toneKeywords: string[];
    headlinePattern?: "benefit-first" | "open-first" | "emotional";
}

export interface Style {
    id: string;
    name: string;
    description: string;
    tags: string[];
    previewColor: string; // Temporary placeholder for thumbnail
    rules: StyleRule;
    recommendedFor?: string[]; // Category IDs
}

export const STYLES: Style[] = [
    {
        id: "minimal",
        name: "미니멀/심플",
        description: "군더더기 없이 핵심만 깔끔하게 전달합니다.",
        tags: ["깔끔", "여백", "모던"],
        previewColor: "#f1f5f9",
        rules: {
            lengthBias: "short",
            emojiAllowed: false,
            toneKeywords: ["정돈된", "간결한", "명확한"],
            headlinePattern: "benefit-first",
        },
        recommendedFor: ["식당/카페", "부동산/영업", "기업/관공서"],
    },
    {
        id: "energetic",
        name: "활기찬/팝",
        description: "통통 튀는 에너지로 시선을 사로잡습니다.",
        tags: ["강조", "이모지", "주목"],
        previewColor: "#fef3c7",
        rules: {
            lengthBias: "normal",
            emojiAllowed: true,
            toneKeywords: ["활기찬", "친근한", "에너지"],
        },
        recommendedFor: ["행사/이벤트", "뷰티/헬스", "학원/교육"],
    },
    {
        id: "premium",
        name: "프리미엄/고급",
        description: "신뢰감 있고 우아한 분위기를 연출합니다.",
        tags: ["진중", "세련", "신뢰"],
        previewColor: "#1e293b", // Dark
        rules: {
            lengthBias: "normal",
            emojiAllowed: false,
            toneKeywords: ["고급스러운", "전문적인", "정중한"],
        },
        recommendedFor: ["뷰티/헬스", "식당/카페", "부동산/영업"],
    },
    {
        id: "emotional",
        name: "감성/따뜻함",
        description: "마음을 움직이는 부드러운 화법을 사용합니다.",
        tags: ["감동", "스토리", "다정"],
        previewColor: "#ffe4e6",
        rules: {
            lengthBias: "long",
            emojiAllowed: true,
            toneKeywords: ["따뜻한", "공감하는", "부드러운"],
            headlinePattern: "emotional",
        },
        recommendedFor: ["식당/카페", "뷰티/헬스", "기타"],
    },
    {
        id: "impact",
        name: "임팩트/강조",
        description: "강력한 단어로 즉각적인 행동을 유도합니다.",
        tags: ["할인", "마감임박", "직설"],
        previewColor: "#ef4444", // Redish
        rules: {
            lengthBias: "short",
            emojiAllowed: true,
            toneKeywords: ["강력한", "긴급한", "자극적인"],
        },
        recommendedFor: ["쇼핑몰/마켓", "행사/이벤트", "학원/교육"],
    },
    {
        id: "trust",
        name: "신뢰/전문성",
        description: "믿음을 주는 객관적이고 전문적인 톤입니다.",
        tags: ["팩트", "인증", "보장"],
        previewColor: "#e0f2fe",
        rules: {
            lengthBias: "normal",
            emojiAllowed: false,
            toneKeywords: ["전문적인", "믿을수있는", "객관적인"],
        },
        recommendedFor: ["부동산/영업", "학원/교육", "기업/관공서"],
    },
    {
        id: "friendly",
        name: "친근/이웃",
        description: "동네 이웃에게 말하듯 편안하게 다가갑니다.",
        tags: ["소통", "우리동네", "다정"],
        previewColor: "#ecfccb",
        rules: {
            lengthBias: "normal",
            emojiAllowed: true,
            toneKeywords: ["친근한", "이웃같은", "편안한"],
        },
        recommendedFor: ["식당/카페", "행사/이벤트", "학원/교육"],
    },
    {
        id: "b-cut",
        name: "B급/레트로",
        description: "재미있고 유쾌한 B급 감성으로 어필합니다.",
        tags: ["유머", "패러디", "재미"],
        previewColor: "#fef08a",
        rules: {
            lengthBias: "short",
            emojiAllowed: true,
            toneKeywords: ["유머러스한", "재미있는", "독특한"],
        },
        recommendedFor: ["식당/카페", "행사/이벤트"],
    },
];

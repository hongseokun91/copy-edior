import { FLAGS } from "./flags";

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

// v0.9 NEW Flyer Types (T1-T9)
const FLYER_TYPES: Style[] = [
    {
        id: "T1",
        name: "할인/특가형",
        description: "강력한 할인을 강조하여 즉각적인 구매를 유도합니다.",
        tags: ["SALE", "특가", "직설적"],
        previewColor: "#ef4444",
        rules: { lengthBias: "short", emojiAllowed: true, toneKeywords: ["파격적인", "선착순", "절호의기회"] }
    },
    {
        id: "T2",
        name: "오픈/이벤트형",
        description: "활기찬 분위기로 개업 또는 이벤트 소식을 알립니다.",
        tags: ["OPEN", "축하", "활기"],
        previewColor: "#f59e0b",
        rules: { lengthBias: "normal", emojiAllowed: true, toneKeywords: ["드디어", "그랜드오픈", "함께해요"] }
    },
    {
        id: "T3",
        name: "신메뉴/신상품형",
        description: "새로운 소식을 세련되게 전달하여 궁금증을 유발합니다.",
        tags: ["NEW", "트렌디", "호기심"],
        previewColor: "#8b5cf6",
        rules: { lengthBias: "normal", emojiAllowed: false, toneKeywords: ["새롭게", "등장한", "트렌디한"] }
    },
    {
        id: "T4",
        name: "브랜드/신뢰형",
        description: "전문성과 진정성을 담아 탄탄한 믿음을 구축합니다.",
        tags: ["신뢰", "브랜딩", "전문"],
        previewColor: "#1e3a8a",
        rules: { lengthBias: "long", emojiAllowed: false, toneKeywords: ["정직한", "전통있는", "보증합니다"] }
    },
    {
        id: "T5",
        name: "감성/스토리형",
        description: "따뜻한 공감으로 고객의 마음을 움직이는 메시지입니다.",
        tags: ["감성", "다정", "감동"],
        previewColor: "#f472b6",
        rules: { lengthBias: "long", emojiAllowed: true, toneKeywords: ["마음을담아", "소중한", "함께하는"] }
    },
    {
        id: "T6",
        name: "미니멀/심플형",
        description: "복잡함 없이 팩트 위주로 깔끔하게 정보를 전달합니다.",
        tags: ["간결", "모던", "팩트"],
        previewColor: "#475569",
        rules: { lengthBias: "short", emojiAllowed: false, toneKeywords: ["확실한", "정직한", "직구"] }
    }
];

export const OLD_STYLES: Style[] = [
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

export const STYLES = FLAGS.FLYER_TYPES ? FLYER_TYPES : OLD_STYLES;

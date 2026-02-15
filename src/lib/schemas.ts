import { z } from "zod";

export const predefinedIndustries = [
    "식당/카페",
    "미용/뷰티",
    "학원/교육",
    "운동/헬스",
    "병원/의료",
    "소매/매장",
    "부동산",
    "취미/클래스",
    "인테리어/생활",
    "공방/기타",
] as const;

export const leafletIndustries = [
    // 🏛️ 전문 서비스
    "법률/변호사", "노무/세무/회계", "경영컨설팅", "금융/자산관리", "IT/소프트웨어", "부동산투자/분양",
    // 🏥 의료/웰니스
    "치과/교정", "성형/피부과", "안과/라식", "한방/요양병원", "전문검진센터", "산후조리원", "재활/체형교정",
    // 🎓 교육/아카데미
    "대입입시전문", "어학/유학원", "예체능입시", "전문기술학원", "성인취미/자격증", "유아영재교육",
    // 💎 라이프스타일/럭셔리
    "파인다이닝", "웨딩/파티기획", "스테이/호텔", "건축/인테리어", "명품/멤버십", "예술/전시",
    // ⚙️ 산업/B2B
    "정밀제조/가공", "물류/유통시스템", "에너지/환경", "바이오/R&D", "건설/중장비", "기업전문화서비스",
    // 🎗️ 공공/공익
    "지자체캠페인", "비영리재단/NGO", "협회/단체", "기부/후원모집", "사회적기업", "종교단체",
] as const;

export const leafletIndustryClusters = {
    "🏛️ 전문 서비스": ["법률/변호사", "노무/세무/회계", "경영컨설팅", "금융/자산관리", "IT/소프트웨어", "부동산투자/분양"],
    "🏥 의료 및 웰니스": ["치과/교정", "성형/피부과", "안과/라식", "한방/요양병원", "전문검진센터", "산후조리원", "재활/체형교정"],
    "🎓 교육 및 아카데미": ["대입입시전문", "어학/유학원", "예체능입시", "전문기술학원", "성인취미/자격증", "유아영재교육"],
    "💎 프리미엄 라이프": ["파인다이닝", "웨딩/파티기획", "스테이/호텔", "건축/인테리어", "명품/멤버십", "예술/전시"],
    "🏢 산업 및 B2B": ["정밀제조/가공", "물류/유통시스템", "에너지/환경", "바이오/R&D", "건설/중장비", "기업전문화서비스"],
    "🎗️ 공공 및 사회": ["지자체캠페인", "비영리재단/NGO", "협회/단체", "기부/후원모집", "사회적기업", "종교단체"],
} as const;

export const predefinedGoals = [
    "오픈",
    "할인",
    "모집",
    "예약유도",
    "신메뉴",
    "시즌이벤트",
] as const;

export const leafletGoals = [
    "브랜드정체성", // Brand Identity & Philosophy
    "전문성/입증",  // Authority, Expertise, Awards
    "서비스가이드", // Detailed Service/Process Guide
    "B2B파트너십",  // B2B proposals & Networking
    "공공/캠페인",  // Public Policy & Social Impact
] as const;

export const predefinedContactTypes = ["phone", "kakao", "naver"] as const;

// V28: Strict Schema for Flyer/Poster
export const flyerFormSchema = z.object({
    category: z.string().min(1, { message: "업종을 선택해 주세요." }),
    subCategory: z.string().optional(),
    goal: z.string().min(1, { message: "목적을 선택해 주세요." }),
    name: z
        .string()
        .min(2, { message: "상호명은 2자 이상 입력해 주세요." })
        .max(20, { message: "상호명은 20자 이내로 입력해 주세요." })
        .regex(/^[a-zA-Z0-9가-힣\s\.\(\)\-\&\[\]]+$/, {
            message: "특수문자는 ( ) - & [ ] . 만 허용됩니다.",
        }),
    offer: z
        .string()
        .min(2, { message: "내용을 2자 이상 입력해 주세요." })
        .max(40, { message: "내용은 40자 이내로 입력해 주세요." })
        .optional(),
    period: z.string().optional(),
    contactType: z.enum(predefinedContactTypes),
    contactValue: z.string().optional(),
    additionalBrief: z.string().max(1000, { message: "1000자 이내로 입력해주세요." }).optional(),
});

// V28: Slim/Flexible Schema for Leaflet (preserving V25-27 improvements)
export const leafletFormSchema = z.object({
    category: z.string().min(1, { message: "업종을 입력해 주세요." }),
    subCategory: z.string().optional(),
    goal: z.string().optional(),
    name: z
        .string()
        .min(2, { message: "상호명은 2자 이상 입력해 주세요." })
        .max(20, { message: "상호명은 20자 이내로 입력해 주세요." })
        .regex(/^[a-zA-Z0-9가-힣\s\.\(\)\-\&\[\]]+$/, {
            message: "특수문자는 ( ) - & [ ] . 만 허용됩니다.",
        }),
    offer: z
        .string()
        .min(2, { message: "내용을 2자 이상 입력해 주세요." })
        .max(40, { message: "내용은 40자 이내로 입력해 주세요." })
        .optional(),
    brandSubject: z.string().max(30, { message: "30자 이내로 입력해주세요." }).optional(),
    targetAudience: z.string().max(30, { message: "30자 이내로 입력해주세요." }).optional(),
    coreBenefit: z.string().max(40, { message: "40자 이내로 입력해주세요." }).optional(),
    contactType: z.enum(predefinedContactTypes),
    contactValue: z.string().optional(),
    websiteUrl: z.string().optional(),
    instagramId: z.string().optional(),
    businessAddress: z.string().optional(),
    officePhone: z.string().optional(),
    brandStory: z.string().max(500, { message: "500자 이내로 입력해주세요." }).optional(),
    serviceDetails: z.string().max(1000, { message: "1000자 이내로 입력해주세요." }).optional(),
    trustPoints: z.string().max(500, { message: "500자 이내로 입력해주세요." }).optional(),
    locationTip: z.string().max(300, { message: "300자 이내로 입력해주세요." }).optional(),
    selectedModules: z.array(z.string()).optional(),
    moduleData: z.record(z.string(), z.any()).optional(),
    additionalBrief: z.string().max(1000, { message: "1000자 이내로 입력해주세요." }).optional(),
    leafletType: z.enum(["2단", "3단", "4단"]).default("3단").optional(),
});

export type FlyerFormValues = z.infer<typeof flyerFormSchema>;
export type LeafletFormValues = z.infer<typeof leafletFormSchema>;

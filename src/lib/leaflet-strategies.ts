import { leafletIndustryClusters } from "./schemas";

export type LeafletCluster = keyof typeof leafletIndustryClusters;

export interface LeafletStrategy {
    tone: string;
    keywords: string[];
    instruction: string;
}

export const LEAFLET_STRATEGIES: Record<LeafletCluster, LeafletStrategy> = {
    "🏛️ 전문 서비스": {
        tone: "논리적이고, 전문적이며, 신뢰감을 주는 (Logical, Professional, Trustworthy)",
        keywords: ["전문성", "경력", "성공 사례", "법적 보호", "체계적 솔루션", "파트너십"],
        instruction: "고객에게 전문가로서의 확신을 줘야 합니다. 감성적인 표현보다는 구체적인 수치, 자격, 경력을 강조하고, 문제가 해결되는 논리적인 과정을 서술하세요."
    },
    "🏥 의료 및 웰니스": {
        tone: "따뜻하지만 의학적으로 명확한, 안심을 주는 (Warm, Medical Accuracy, reassuring)",
        keywords: ["안전", "위생", "임상 경험", "첨단 장비", "회복", "케어", "맞춤 진료"],
        instruction: "환자의 불안을 해소하고 안전함을 강조해야 합니다. 의료진의 약력과 병원의 청결함, 첨단 장비를 부각하며, 환자 한 명 한 명을 케어한다는 진정성을 담으세요."
    },
    "🎓 교육 및 아카데미": {
        tone: "열정적이고, 체계적이며, 성장을 독려하는 (Passionate, Systematic, Encouraging)",
        keywords: ["커리큘럼", "합격율", "명문대", "밀착 관리", "성적 향상", "동기 부여"],
        instruction: "학부모와 학생에게 확실한 '결과'와 '과정'을 동시에 보여줘야 합니다. 단계별 커리큘럼의 우수성과 구체적인 진학/성적 성과를 제시하여 신뢰를 얻으세요."
    },
    "💎 프리미엄 라이프": {
        tone: "세련되고, 감성적이며, 품격 있는 (Sophisticated, Emotional, Premium)",
        keywords: ["프라이빗", "공간 미학", "최상의 경험", "장인 정신", "오브제", "도심 속 휴식"],
        instruction: "기능적 설명보다는 '경험'과 '분위기'를 묘사하세요. 고객이 이 공간에 머무는 것만으로도 특별한 대우를 받는다고 느끼도록 우아하고 매혹적인 어휘를 사용하세요."
    },
    "🏢 산업 및 B2B": {
        tone: "기술 중심적이고, 명료하며, 효율성을 강조하는 (Tech-focused, Clear, Efficiency)",
        keywords: ["생산성", "비용 절감", "특허 기술", "내구성", "납기 준수", "유지 보수"],
        instruction: "비즈니스 파트너를 설득해야 합니다. 감정을 배제하고 기술 사양(Spec), 도입 효과, 비용 절감 수치 등 팩트 기반으로 건조하지만 힘 있게 서술하세요."
    },
    "🎗️ 공공 및 사회": {
        tone: "진정성 있고, 호소력 짙으며, 참여를 유도하는 (Sincere, Compelling, Public Interest)",
        keywords: ["함께", "나눔", "미래", "책임", "지역 사회", "후원", "투명성"],
        instruction: "사회의 긍정적인 변화를 위해 독자의 공감과 참여를 이끌어내야 합니다. 우리의 미션이 왜 중요한지 설명하고, 함께할 때 만들어낼 수 있는 변화를 감동적으로 서술하세요."
    }
};

export const getStrategyForCategory = (category: string): LeafletStrategy => {
    // 1. Check if category is a Cluster Key
    if (Object.keys(LEAFLET_STRATEGIES).includes(category)) {
        return LEAFLET_STRATEGIES[category as LeafletCluster];
    }

    // 2. Check if category is a sub-item of a cluster
    for (const [cluster, items] of Object.entries(leafletIndustryClusters)) {
        if ((items as readonly string[]).includes(category)) {
            return LEAFLET_STRATEGIES[cluster as LeafletCluster];
        }
    }

    // 3. Fallback (General Retail)
    return {
        tone: "친근하고, 활기차며, 고객 지향적인 (Friendly, Energetic, Customer-obsessed)",
        keywords: ["서비스", "만족", "혜택", "약속", "단골"],
        instruction: "고객에게 친근하게 다가가세요. 우리 매장의 장점을 쉽게 설명하고, 방문하고 싶게 만드는 매력적인 제안을 하세요."
    };
};

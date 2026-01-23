import { FlyerInputs, FlyerSlots, FlyerTone } from "@/types/flyer";

type TemplateFunction = (inputs: FlyerInputs) => FlyerSlots;

// --- BASE TEMPLATES ---

const baseTemplates: Record<string, Record<FlyerTone, TemplateFunction>> = {
    "식당/카페": {
        friendly: (inputs) => ({
            HEADLINE: `${inputs.name}, 맛있는 ${inputs.offer}!`,
            SUBHEAD: `우리 동네 ${inputs.category} 맛집, ${inputs.goal} 이벤트`,
            BENEFIT_BULLETS: [
                "신선한 재료만 고집합니다",
                "편안하고 아늑한 분위기",
                "단체 예약 환영합니다",
            ],
            CTA: "지금 예약하러 가기",
            INFO: `위치: ${inputs.location || "매장 위치"} / 문의: ${inputs.contactValue}`,
            DISCLAIMER: "재료 소진 시 조기 마감될 수 있습니다.",
        }),
        premium: (inputs) => ({
            HEADLINE: `${inputs.name}, 품격 있는 미식`,
            SUBHEAD: `${inputs.offer}와 함께 특별한 순간을 경험하세요`,
            BENEFIT_BULLETS: [
                "엄선된 최상급 재료 사용",
                "프라이빗한 식사 공간",
                "전문 셰프의 정성",
            ],
            CTA: "예약 문의하기",
            INFO: `위치: ${inputs.location || "매장 위치"} / Tel: ${inputs.contactValue}`,
            DISCLAIMER: "사전 예약제로 운영됩니다.",
        }),
        direct: (inputs) => ({
            HEADLINE: `${inputs.name} ${inputs.offer}!!`,
            SUBHEAD: `${inputs.period} 한정, ${inputs.goal} 특가 찬스`,
            BENEFIT_BULLETS: [
                "맛 보장! 후회 없는 선택",
                "압도적인 가성비",
                "포장/배달 가능",
            ],
            CTA: `지금 바로 주문: ${inputs.contactValue}`,
            INFO: `영업시간: ${inputs.hours || "매일 오픈"}`,
            DISCLAIMER: "타 쿠폰 중복 사용 불가",
        }),
    },
    "뷰티/헬스": {
        friendly: (inputs) => ({
            HEADLINE: `${inputs.name}, 예뻐지는 공간`,
            SUBHEAD: `${inputs.offer}, 나를 위한 작은 선물 어때요?`,
            BENEFIT_BULLETS: [
                "1:1 맞춤 디자인 케어",
                "편안한 힐링 분위기",
                "꼼꼼하고 섬세한 시술",
            ],
            CTA: "간편 예약하기",
            INFO: `위치: ${inputs.location || "매장"} / 예약: ${inputs.contactValue}`,
            DISCLAIMER: "예약 변경은 하루 전까지 가능합니다.",
        }),
        premium: (inputs) => ({
            HEADLINE: `Only You, ${inputs.name}`,
            SUBHEAD: `${inputs.offer}, VIP를 위한 프라이빗 솔루션`,
            BENEFIT_BULLETS: [
                "최고급 정품/정량 사용",
                "10년 이상 경력 원장 시술",
                "Private Room 완비",
            ],
            CTA: "멤버십 상담 문의",
            INFO: `Address: ${inputs.location || "강남구 ..."} / Tel: ${inputs.contactValue}`,
            DISCLAIMER: "100% 예약제로 운영됩니다.",
        }),
        direct: (inputs) => ({
            HEADLINE: `${inputs.offer} 최저가 도전!`,
            SUBHEAD: `${inputs.name} 오픈 기념, ${inputs.period}만 이 가격`,
            BENEFIT_BULLETS: [
                "눈에 띄는 확실한 효과",
                "거품 없는 투명한 가격",
                "만족도 1위 재방문 1위",
            ],
            CTA: `지금 바로 예약: ${inputs.contactValue}`,
            INFO: `영업시간: ${inputs.hours || "10:00 - 20:00"}`,
            DISCLAIMER: "이벤트는 조기 종료될 수 있습니다.",
        }),
    },
    "학원/교육": {
        friendly: (inputs) => ({
            HEADLINE: `${inputs.name}, 즐거운 배움터`,
            SUBHEAD: `우리 아이 ${inputs.goal}, ${inputs.offer}로 시작하세요!`,
            BENEFIT_BULLETS: [
                "아이 눈높이 맞춤 수업",
                "쉽고 재미있는 커리큘럼",
                "따뜻하고 세심한 지도",
            ],
            CTA: "무료 체험 수업 신청",
            INFO: `위치: ${inputs.location || "학원가"} / 상담: ${inputs.contactValue}`,
            DISCLAIMER: "차량 운행 가능합니다.",
        }),
        premium: (inputs) => ({
            HEADLINE: `${inputs.name}, 합격의 기준`,
            SUBHEAD: `${inputs.offer}, 상위 1%를 위한 마스터플랜`,
            BENEFIT_BULLETS: [
                "명문대 출신 강사진",
                "철저한 소수 정예 관리",
                "입시/진로 컨설팅 제공",
            ],
            CTA: "심층 상담 예약",
            INFO: `상담 문의: ${inputs.contactValue}`,
            DISCLAIMER: "레벨 테스트 후 등록 가능합니다.",
        }),
        direct: (inputs) => ({
            HEADLINE: `${inputs.goal} 단기 완성!`,
            SUBHEAD: `${inputs.name} ${inputs.offer}, 성적 상승의 지름길`,
            BENEFIT_BULLETS: [
                "핵심만 찌르는 강의",
                "확실한 성적 향상 보장",
                "엄격한 출결 관리",
            ],
            CTA: `등록 문의: ${inputs.contactValue}`,
            INFO: `위치: ${inputs.location || "본원"}`,
            DISCLAIMER: "선착순 마감됩니다.",
        }),
    },
    "default": {
        friendly: (inputs) => ({
            HEADLINE: `${inputs.name}에서 만나요!`,
            SUBHEAD: `${inputs.offer} 혜택이 기다리고 있어요`,
            BENEFIT_BULLETS: [
                "친절한 서비스",
                "쾌적한 환경",
                "믿을 수 있는 품질",
            ],
            CTA: "자세히 알아보기",
            INFO: `문의: ${inputs.contactValue}`,
            DISCLAIMER: "",
        }),
        premium: (inputs) => ({
            HEADLINE: `${inputs.name}, 당신을 위한 선택`,
            SUBHEAD: `${inputs.offer} - 차원이 다른 가치를 약속드립니다`,
            BENEFIT_BULLETS: [
                "최상의 만족도 보장",
                "검증된 전문가의 케어",
                "프리미엄 멤버십 혜택",
            ],
            CTA: "상담 신청하기",
            INFO: `Contact: ${inputs.contactValue}`,
            DISCLAIMER: "본 프로모션은 사정에 따라 변경될 수 있습니다.",
        }),
        direct: (inputs) => ({
            HEADLINE: `${inputs.offer} 마감 임박!`,
            SUBHEAD: `${inputs.name} ${inputs.goal} 프로모션 진행 중`,
            BENEFIT_BULLETS: [
                "선착순 한정 수량",
                "지금이 가장 저렴합니다",
                "놓치면 후회하는 기회",
            ],
            CTA: "지금 바로 연락주세요",
            INFO: `문의: ${inputs.contactValue}`,
            DISCLAIMER: "기간 내 사용 필수",
        }),
    }
};

export function generateByTemplate(
    category: string,
    tone: FlyerTone,
    inputs: FlyerInputs
): FlyerSlots {
    // 1. Find Category Helper
    // Normalize category key logic
    let categoryKey = "default";
    const cat = category.replace(" ", ""); // Remove spaces

    if (['식당', '카페', '베이커리', '식당/카페'].some(k => cat.includes(k))) categoryKey = "식당/카페";
    else if (['뷰티', '헬스', '미용', '네일', '헤어', '운동', '뷰티/헬스'].some(k => cat.includes(k))) categoryKey = "뷰티/헬스";
    else if (['학원', '교육', '공부', '과외', '클래스', '학원/교육'].some(k => cat.includes(k))) categoryKey = "학원/교육";

    // 2. Select Template
    const categoryTemplates = baseTemplates[categoryKey] || baseTemplates["default"];
    const templateFn = categoryTemplates[tone] || categoryTemplates["friendly"];

    // 3. Generate
    const rawResult = templateFn(inputs);

    // 4. Post-processing (Truncation for safety)
    const result = { ...rawResult };
    // Example truncation if needed:
    // result.HEADLINE = truncate(result.HEADLINE, 20);

    return result;
}

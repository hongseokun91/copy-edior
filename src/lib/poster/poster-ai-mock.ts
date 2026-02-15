import {
    PosterMeta,
    HeadlineCandidate,
    PosterResult
} from "@/types/poster";
import { guessIntentFromBrief, guessChannelPackFromContext, guessDensityProfileFromContext, guessClaimPolicyMode, getDefaultHeadlineType, resolveBlueprint } from "./router";
import { pickTop3 } from "./scorer";
import { BLUEPRINTS } from "./blueprints.registry";

// Mock Data for Headlines
const MOCK_HEADLINES: Record<string, string[]> = {
    setA: [
        "오픈 기념 50% 할인, 오늘만 가능합니다",
        "1+1 혜택, 놓치면 손해인 이유",
        "지금 가입하면 평생 무료 배송",
        "최대 10만원 쿠폰팩 즉시 지급",
        "선착순 100명 한정 특가",
        "멤버십 회원만의 특별한 혜택",
        "구매 금액 100% 포인트 적립"
    ],
    setB: [
        "왜 아직도 비싼 돈 주고 사세요?",
        "당신의 일상이 180도 바뀝니다",
        "이것 하나만 바꿨을 뿐인데...",
        "남들보다 싸게 사는 비법 공개",
        "정말 이 가격이 맞나요?",
        "사장님이 미쳤어요 (진짜로)",
        "아무도 알려주지 않았던 비밀"
    ],
    setC: [
        "업계 1위가 보증하는 품질",
        "국가 인증 획득, 믿을 수 있습니다",
        "전문가가 추천하는 필수 아이템",
        "100만 회원이 선택한 바로 그 제품",
        "공식 파트너사 독점 공급",
        "프리미엄의 기준을 다시 쓰다",
        "30년 전통의 노하우를 담았습니다"
    ]
};

export async function mockAnalyzeBrief(brief: string, industry?: string): Promise<PosterMeta> {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate AI delay

    const intentId = guessIntentFromBrief(brief);

    return {
        intentId,
        headlineType: getDefaultHeadlineType(intentId),
        channelPack: guessChannelPackFromContext(brief),
        densityProfile: guessDensityProfileFromContext(brief),
        claimPolicyMode: guessClaimPolicyMode(industry, intentId),
        industryHint: industry || "일반",
        brief // Return the brief for context in later steps
    };
}

export async function mockGenerateHeadlines(meta: PosterMeta): Promise<PosterResult> {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate AI delay

    // Generate candidates with mock data but correct structure
    const generateSet = (setKey: "setA" | "setB" | "setC"): HeadlineCandidate[] => {
        return MOCK_HEADLINES[setKey].map((text, i) => ({
            id: `${setKey}_${i}`,
            text: `[${meta.intentId}] ${text}`, // Prefix to show it changes based on intent
            typeHint: setKey === "setA" ? "HL_OFFER_FIRST" : setKey === "setB" ? "HL_PROBLEM_FIRST" : "HL_AUTHORITY_FIRST",
            badges: {
                length: text.length < 15 ? "short" : "medium",
                densityFit: meta.densityProfile || "DENSITY_STANDARD",
                tone: setKey === "setC" ? "official" : "friendly",
                risk: "low"
            },
            score: 0 // Will be scored below
        }));
    };

    const setA = generateSet("setA");
    const setB = generateSet("setB");
    const setC = generateSet("setC");

    // Calculate scores
    const allCandidates = [...setA, ...setB, ...setC];
    // We need to re-assign scores in place or return new objects. 
    // heuristic: pickTop3 re-calculates scores. Here we just set them for display.
    // Actually the UI might want pre-calculated scores.
    // Simplification: just return them. 

    const top3 = pickTop3(meta, allCandidates);

    // Get Blueprint
    const blueprint = resolveBlueprint(meta.intentId) || BLUEPRINTS["INT_PROMO_OFFER"];

    return {
        meta,
        headlineCandidates: {
            setA,
            setB,
            setC,
            recommendedTop3: top3
        },
        blueprint,
        content: {},
        compliance: { warnings: [], requiredDisclaimers: [] }
    };
}

export async function mockGeneratePosterBody(
    meta: { intentId: string; brief: string },
    selectedHeadline: string,
    blueprint: any
): Promise<Record<string, string>> {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate AI thinking

    const content: Record<string, string> = {
        "S_HEADLINE": selectedHeadline,
        "S_SUBHEAD": "더 이상 고민하지 마세요, 지금이 기회입니다.",
        "S_CTA": "자세히 보기",
        "S_PERIOD": "2024.03.01 - 2024.03.31",
        "S_LOCATION_OR_CHANNEL": "공식 홈페이지 및 전 지점",
    };

    // Context-sensitive generation based on Intent
    switch (meta.intentId) {
        case "INT_EVENT_GUIDE":
            content["S_SUBHEAD"] = "혁신적인 기술과 미래를 만나는 자리";
            content["S_CTA"] = "사전 등록하기";
            content["S_EVENT_TITLE"] = "2026 Future Tech Expo";
            content["S_DATETIME"] = "2026.10.12(월) - 10.15(목) | 10:00 - 18:00";
            content["S_LOCATION"] = "코엑스 그랜드볼룸 A홀";
            content["S_PROGRAM_HIGHLIGHTS"] = "• 기조연설: AI의 미래\n• 특별 세션: 로봇과 인간\n• 네트워킹 파티";
            break;

        case "INT_PROMO_OFFER":
            content["S_SUBHEAD"] = "최대 50% 할인, 이번 시즌 마지막 기회";
            content["S_CTA"] = "구매 보러가기";
            content["S_OFFER_MAIN"] = "전 품목 50% OFF";
            content["S_CONDITIONS"] = "*일부 품목 제외, 재고 소진 시 조기 종료";
            break;

        case "INT_RECRUITING":
            content["S_SUBHEAD"] = "가슴 뛰는 도전을 함께할 당신을 기다립니다";
            content["S_CTA"] = "지원하기";
            content["S_ROLE_TITLE"] = "2024년 상반기 공개 채용";
            content["S_ELIGIBILITY"] = "• 기획/디자인/개발 전 직군\n• 경력 3년 이상 또는 그에 준하는 실력";
            content["S_DEADLINE"] = "2024년 4월 30일(금) 자정까지";
            content["S_HOW_TO_APPLY"] = "채용 홈페이지를 통해 서류 접수";
            break;

        case "INT_B2B_SEMINAR":
            content["S_SUBHEAD"] = "실무자가 전하는 비즈니스 성장 전략";
            content["S_CTA"] = "무료 초대권 신청";
            content["S_EVENT_TITLE"] = "Enterprise Growth Summit 2026";
            content["S_DATETIME"] = "2026.05.20(수) 14:00 - 17:00";
            content["S_LOCATION"] = "강남 파이낸스센터 3층 컨퍼런스룸";
            break;

        case "INT_PUBLIC_NOTICE":
            content["S_SUBHEAD"] = "안전하고 쾌적한 환경을 위해 협조 부탁드립니다";
            content["S_CTA"] = "문의하기";
            content["S_NOTICE_TITLE"] = "시설 점검에 따른 이용 제한 안내";
            content["S_PROCEDURE"] = "1. 점검 기간 동안 정문 폐쇄\n2. 우회로(후문) 이용 권장\n3. 소음 발생 양해 부탁드립니다";
            content["S_CONTACT_OFFICIAL"] = "시설관리팀 02-123-4567";
            break;
    }

    return content;
}

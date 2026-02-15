import type { PosterIntentId, ClaimPolicyMode, PosterSlotId } from "@/types/poster";

export type PosterQuestion = {
    id: string;
    title: string;
    prompt: string;
    required: boolean;
    scope: "core" | "intent" | "strict";
    slotDependsOn?: PosterSlotId;
    intentDependsOn?: PosterIntentId[];
};

export function buildPosterQuestions(args: {
    intentId: PosterIntentId;
    requiredSlots: PosterSlotId[];
    claimPolicyMode: ClaimPolicyMode;
}): PosterQuestion[] {

    const core: PosterQuestion[] = [
        { id: "Q_BENEFIT_ONE", title: "핵심 혜택 1개", prompt: "할인/가치/결과 중 핵심 혜택 1개를 적어주세요.", required: true, scope: "core" },
        { id: "Q_TARGET_ONE", title: "주요 타깃 1개", prompt: "누구에게 보여주는 포스터인가요? (예: 직장인, 소상공인, 가족)", required: true, scope: "core" },
        { id: "Q_CONSTRAINT_ONE", title: "제약 1개", prompt: "기간/수량/조건 중 하나를 적어주세요.", required: true, scope: "core" },
    ];

    const intent: PosterQuestion[] = [
        { id: "Q_PERIOD", title: "기간", prompt: "시작/종료 또는 유효기간을 적어주세요.", required: args.requiredSlots.includes("S_PERIOD"), scope: "intent", slotDependsOn: "S_PERIOD" },
        { id: "Q_CONDITIONS", title: "대상/조건", prompt: "대상/조건/제외 조건이 있다면 적어주세요.", required: args.requiredSlots.includes("S_CONDITIONS"), scope: "intent", slotDependsOn: "S_CONDITIONS" },
        { id: "Q_LOCATION", title: "장소/구매처", prompt: "장소/구매처/접수처를 적어주세요.", required: args.requiredSlots.includes("S_LOCATION_OR_CHANNEL") || args.requiredSlots.includes("S_LOCATION"), scope: "intent" },
        { id: "Q_DATETIME", title: "일시", prompt: "행사/세미나/마감 일시를 적어주세요.", required: args.requiredSlots.includes("S_DATETIME"), scope: "intent", slotDependsOn: "S_DATETIME" },
        { id: "Q_PUBLIC_BASIS", title: "근거/주관기관", prompt: "공공 공지/사업이라면 근거 문서/주관기관을 적어주세요.", required: args.intentId === "INT_PUBLIC_NOTICE", scope: "intent", intentDependsOn: ["INT_PUBLIC_NOTICE"] },
        { id: "Q_PUBLIC_DISCLAIMER", title: "오해 방지 문구", prompt: "자주 생기는 오해/민원 포인트 2개와 예방 문장을 적어주세요.", required: args.intentId === "INT_PUBLIC_NOTICE", scope: "intent", intentDependsOn: ["INT_PUBLIC_NOTICE"] },
    ];

    const strict: PosterQuestion[] =
        args.claimPolicyMode === "strict"
            ? [
                { id: "Q_FORBIDDEN_CLAIMS", title: "금지 표현", prompt: "절대 쓰면 안 되는 표현이 있다면 적어주세요.", required: true, scope: "strict" },
                { id: "Q_EVIDENCE_RULE", title: "수치/최상급 근거", prompt: "수치/최상급 표현을 써야 한다면 ‘기간/기준/출처(내부기준 포함)’를 적어주세요.", required: true, scope: "strict" },
            ]
            : [];

    // required=false 인 질문도 UI에는 “추가 입력(선택)”으로 노출 가능
    return [...core, ...intent, ...strict];
}

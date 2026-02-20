import type { PosterIntentId, ChannelPack, DensityProfileId, ClaimPolicyMode, HeadlineType } from "@/types/poster";
import { BLUEPRINTS } from "./blueprints.registry";
import { POSTER_INTENTS } from "./intents";

export function guessClaimPolicyMode(industryHint?: string, intentId?: PosterIntentId): ClaimPolicyMode {
    const strictHints = ["의료", "병원", "금융", "보험", "대출", "공공", "지자체", "지원사업", "정책", "조달"];
    const hit = (industryHint ?? "").split(/\s+/).some(w => strictHints.some(h => w.includes(h)));
    return (intentId === "INT_PUBLIC_NOTICE" || hit) ? "strict" : "standard";
}

export function getDefaultHeadlineType(intentId: PosterIntentId): HeadlineType {
    return POSTER_INTENTS.find(x => x.id === intentId)?.defaultHeadlineType ?? "HL_AUTHORITY_FIRST";
}

export function resolveBlueprint(intentId: PosterIntentId) {
    return BLUEPRINTS[intentId];
}

import { intentAnalyzer } from "./reception/intent-analyzer";

/**
 * NOTE: 실제 NLP/임베딩 매칭은 나중에 확장.
 * v1: Weighted Scoring System (intent-analyzer)
 */
export function guessIntentFromBrief(brief: string): PosterIntentId {
    const result = intentAnalyzer.analyze(brief);

    // Debug logging in Dev mode
    if (process.env.NODE_ENV === 'development') {
        console.log(`[Router] Intent Analysis for "${brief.substring(0, 20)}..."`, result.debugTrace);
    }

    // High Precision Update: Use Fallback if confidence is too low
    const primaryScore = result.scores[result.primaryIntent] || 0;

    if (primaryScore < 30) {
        console.log(`[Router] Low confidence (${primaryScore}). Fallback to INT_ADAPTIVE.`);
        return "INT_ADAPTIVE";
    }

    return result.primaryIntent;
}

export function guessChannelPackFromContext(ctx?: string): ChannelPack {
    const c = ctx ?? "";
    if (/(사이니지|전광판|모니터|디스플레이|16:9)/.test(c)) return "PACK_SIGNAGE_16_9";
    if (/(인스타|피드|1:1)/.test(c)) return "PACK_SNS_1_1";
    if (/(스토리|릴스|9:16)/.test(c)) return "PACK_SNS_9_16";
    return "PACK_PRINT_A2";
}

export function guessDensityProfileFromContext(ctx?: string): DensityProfileId {
    const c = ctx ?? "";
    if (/(심플|깔끔|이미지|임팩트|짧게)/.test(c)) return "DENSITY_MINIMAL";
    if (/(상세|자세히|설명|정보|글자)/.test(c)) return "DENSITY_DETAILED";
    return "DENSITY_STANDARD";
}

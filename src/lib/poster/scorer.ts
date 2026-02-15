import type { HeadlineCandidate, PosterMeta } from "@/types/poster";
import { CHAR_BUDGETS } from "./charbudgets.registry";

export function scoreHeadline(meta: PosterMeta, c: HeadlineCandidate) {
    const budget = CHAR_BUDGETS[meta.channelPack][meta.densityProfile];

    let score = 0;

    // 1) 길이 적합
    const len = c.text.length;
    score += Math.max(0, (budget.headlineMax - len)) * 0.6; // 짧을수록 가산(너무 짧으면 badges에서 보정)

    // 2) 밀도 적합
    if (c.badges.densityFit === meta.densityProfile) score += 20;

    // 3) 톤 적합(공공/strict는 official 선호)
    if (meta.claimPolicyMode === "strict" && c.badges.tone === "official") score += 15;

    // 4) 리스크 패널티
    if (c.badges.risk === "high") score -= 40;
    if (c.badges.risk === "medium") score -= 10;

    // 5) intent 기반 가산(프로모션=offer-first)
    if (meta.intentId === "INT_PROMO_OFFER" && c.typeHint === "HL_OFFER_FIRST") score += 15;
    if (meta.intentId === "INT_PUBLIC_NOTICE" && c.typeHint === "HL_AUTHORITY_FIRST") score += 20;

    return score;
}

export function pickTop3(meta: PosterMeta, all: HeadlineCandidate[]): HeadlineCandidate[] {
    const scored = all.map(c => ({ ...c, score: scoreHeadline(meta, c) }));
    return scored.sort((a, b) => b.score - a.score).slice(0, 3);
}

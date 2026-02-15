import type { PosterMeta, PosterBlueprint, PosterSlotId } from "@/types/poster";
import { NUMERIC_CLAIM_TRIGGERS, FORBIDDEN_PHRASES_COMMON, FORBIDDEN_PHRASES_STRICT_EXTRA } from "./forbidden.registry";
import { CHAR_BUDGETS } from "./charbudgets.registry";

export function missingRequiredSlots(blueprint: PosterBlueprint, content: any) {
    return blueprint.requiredSlots.filter(s => content?.[s] == null || String(content[s]).trim() === "");
}

export function hasNumericClaim(text: string) {
    return NUMERIC_CLAIM_TRIGGERS.some(t => text.includes(t));
}

export function findForbidden(text: string, meta: PosterMeta) {
    const forbid = [
        ...FORBIDDEN_PHRASES_COMMON,
        ...(meta.claimPolicyMode === "strict" ? FORBIDDEN_PHRASES_STRICT_EXTRA : []),
    ];
    return forbid.filter(f => text.includes(f));
}

export function enforceDensityBudget(meta: PosterMeta, slotId: PosterSlotId, value: unknown) {
    const budget = CHAR_BUDGETS[meta.channelPack][meta.densityProfile];
    const s = String(value ?? "");

    if (slotId === "S_HEADLINE" && s.length > budget.headlineMax) return s.slice(0, budget.headlineMax);
    if (slotId === "S_SUBHEAD" && s.length > budget.subheadMax) return s.slice(0, budget.subheadMax);
    if (s.length > budget.blockCharsMax) return s.slice(0, budget.blockCharsMax);

    return s;
}

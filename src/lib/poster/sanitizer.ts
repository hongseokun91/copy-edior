import type { PosterMeta, PosterBlueprint } from "@/types/poster";
import { enforceDensityBudget, findForbidden } from "./gates";

export function sanitizePosterContent(meta: PosterMeta, blueprint: PosterBlueprint, content: any) {
    const clean: any = {};
    const warnings: string[] = [];

    for (const slot of blueprint.slotOrder) {
        const raw = content?.[slot];
        if (raw == null) continue;

        const normalized = enforceDensityBudget(meta, slot as any, raw);
        const forbidden = findForbidden(normalized, meta);
        if (forbidden.length) warnings.push(`금지표현 감지(${slot}): ${forbidden.join(", ")}`);

        clean[slot] = normalized;
    }

    return { content: clean, warnings };
}

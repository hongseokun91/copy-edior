// src/lib/brochure-questions/derive.ts
import { BROCHURE_KINDS } from "@/lib/brochure-kinds";
import { BROCHURE_BLOCK_TEMPLATES } from "@/lib/brochure-blocks";
import { BROCHURE_MODULES } from "@/lib/brochure-modules";
import type { BrochureKindId, BrochureBlockType } from "@/types/brochure";

function uniq(arr: string[]) {
    return Array.from(new Set(arr));
}

function getKind(kindId: BrochureKindId) {
    if (!kindId) return null;
    return BROCHURE_KINDS.find(x => x.id === kindId) || null;
}

function getBlockTemplate(type: BrochureBlockType) {
    if (!type) return null;
    return BROCHURE_BLOCK_TEMPLATES.find(x => x.type === type) || null;
}

function moduleExists(moduleId: string) {
    return BROCHURE_MODULES.some(m => m.id === moduleId);
}

/**
 * Kind + Blocks -> moduleIds(Union)
 * - block templates의 defaultModuleIdsByRole 전부 합침
 * - kind.mandatoryModuleIds 포함
 * - 실제 존재하지 않는 모듈은 제외(안정성)
 */
export function deriveModuleIdsForQuestions(args: {
    kindId: BrochureKindId;
    selectedBlocks: BrochureBlockType[];
}): string[] {
    const kind = getKind(args.kindId);
    if (!kind) return [];

    const blocks = args.selectedBlocks?.length ? args.selectedBlocks : kind.defaultBlocks;

    const fromBlocks: string[] = [];
    for (const b of blocks) {
        const tpl = getBlockTemplate(b);
        if (!tpl) continue;
        for (const role of Object.keys(tpl.defaultModuleIdsByRole) as any[]) {
            const mids = (tpl.defaultModuleIdsByRole as any)[role] ?? [];
            fromBlocks.push(...mids);
        }
    }

    const merged = uniq([...fromBlocks, ...(kind.mandatoryModuleIds ?? [])]);
    return merged.filter(moduleExists);
}

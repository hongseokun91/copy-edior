// src/lib/copy/brochure/engine.ts
import type {
    BrochureInput,
    FactsRegistry,
    BrochureOutput,
    BrochureBlockPlan,
    BrochureBlockType,
    BrochurePageId,
    BrochurePageRole,
    BrochureModuleSpec,
} from "../../../types/brochure";

import { BROCHURE_KINDS } from "../../brochure-kinds";
import { BROCHURE_BLOCK_TEMPLATES } from "../../brochure-blocks";
import { BROCHURE_MODULES } from "../../brochure-modules";

import {
    BROCHURE_SYSTEM_PROMPT,
    buildFactsPrompt,
    buildBlockPlanPrompt,
    buildPagePrompt,
} from "./prompts";

import { runQualityGates, type QualityGateResult } from "./quality-gates";
import { extractJsonFromTags, sanitizeModulesBySpec } from "./sanitizer";

export interface LLMClient {
    generate: (args: { system: string; prompt: string; temperature?: number }) => Promise<string>;
}

export interface GenerateBrochureOptions {
    llm: LLMClient;
    requestedBlocks?: BrochureBlockType[];
    autoRepair?: boolean;
    similarityThreshold?: number;
}

function makePageId(n: number): BrochurePageId {
    return `P${n}` as BrochurePageId;
}

function cryptoRandomId(): string {
    // @ts-ignore
    const c = typeof crypto !== "undefined" ? crypto : null;
    if (c?.randomUUID) return c.randomUUID();
    return `blk_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function uniq<T>(arr: T[]): T[] {
    return Array.from(new Set(arr));
}

function getKindSpec(kindId: BrochureInput["kindId"]) {
    const kind = BROCHURE_KINDS.find(k => k.id === kindId);
    if (!kind) throw new Error(`Unknown BrochureKindId: ${kindId}`);
    return kind;
}

function getBlockTemplate(type: BrochureBlockType) {
    const t = BROCHURE_BLOCK_TEMPLATES.find(b => b.type === type);
    if (!t) throw new Error(`Unknown BrochureBlockType: ${type}`);
    return t;
}

function getModuleSpec(moduleId: string): BrochureModuleSpec | undefined {
    return BROCHURE_MODULES.find(m => m.id === moduleId);
}

function enforceFrontBack(blocks: BrochureBlockType[]): BrochureBlockType[] {
    const without = blocks.filter(b => b !== "BLOCK_FRONT_IDENTITY" && b !== "BLOCK_BACK_TRUST_CONTACT");
    return ["BLOCK_FRONT_IDENTITY", ...without, "BLOCK_BACK_TRUST_CONTACT"];
}

function defaultBlocksForKind(kindDefault: BrochureBlockType[]): BrochureBlockType[] {
    return enforceFrontBack(kindDefault);
}

function pageModuleSpecs(moduleIds: string[]): BrochureModuleSpec[] {
    return moduleIds.map(getModuleSpec).filter(Boolean) as BrochureModuleSpec[];
}

function mergeRecommendedModules(args: {
    kindMandatoryModuleIds: string[];
    pageRecommended: string[];
    role: BrochurePageRole;
}): string[] {
    const { kindMandatoryModuleIds, pageRecommended, role } = args;
    const mandatoryEligible = kindMandatoryModuleIds.filter(mid => {
        const spec = getModuleSpec(mid);
        return !!spec && spec.supportedRoles.includes(role);
    });
    return uniq([...pageRecommended, ...mandatoryEligible]);
}

function buildBlockPlans(blockTypes: BrochureBlockType[]): BrochureBlockPlan[] {
    let pageCounter = 1;
    const plans: BrochureBlockPlan[] = [];

    for (const type of blockTypes) {
        const tpl = getBlockTemplate(type);
        const basePageIds = [0, 1, 2, 3].map(i => makePageId(pageCounter + i));
        pageCounter += 4;

        const pages = basePageIds.map((pid, idx) => {
            const role = tpl.pageRoles[idx];
            const modIds = tpl.defaultModuleIdsByRole[role] ?? [];
            return { pageId: pid, role, recommendedModuleIds: [...modIds] };
        });

        plans.push({ blockId: cryptoRandomId(), type, title: tpl.label, pages });
    }

    return plans;
}

function makeFactsRegistryMinimal(input: BrochureInput, claimPolicyMode: "standard" | "strict"): FactsRegistry {
    return {
        brandName: input.brandName,
        contactPhone: input.contactPhone,
        contactEmail: input.contactEmail,
        contactKakao: input.contactKakao,
        websiteUrl: input.websiteUrl,
        addressText: input.addressText,
        operatingHoursText: input.operatingHoursText,
        priceRangeText: input.priceRangeText,
        periodText: input.periodText,
        eligibilityText: input.eligibilityText,
        requiredDocsText: input.requiredDocsText,
        certifications: input.certifications ?? [],
        partnersOrClients: input.partnersOrClients ?? [],
        metrics: input.metrics ?? [],
        legalNotices: input.legalNotices ?? [],
        claimPolicyMode,
    };
}

export async function generateBrochure(
    input: BrochureInput,
    options: GenerateBrochureOptions
): Promise<{ output: BrochureOutput; gate: QualityGateResult }> {
    const kind = getKindSpec(input.kindId);

    // 1) Facts Registry
    let facts: FactsRegistry;
    {
        const raw = await options.llm.generate({
            system: BROCHURE_SYSTEM_PROMPT,
            prompt: buildFactsPrompt(input, kind),
            temperature: 0.2,
        });

        const parsed = extractJsonFromTags(raw) as FactsRegistry | null;
        facts = parsed ?? makeFactsRegistryMinimal(input, kind.claimPolicyMode);
        facts.brandName = input.brandName;
        facts.claimPolicyMode = kind.claimPolicyMode;
    }

    // 2) Block types
    let blockTypes: BrochureBlockType[] = [];
    const guidanceMap: Record<number, any> = {}; // Index -> Guidance

    if (options.requestedBlocks?.length) {
        // Handle object vs string (User provided full blocks)
        if (typeof options.requestedBlocks[0] === 'string') {
            blockTypes = enforceFrontBack(options.requestedBlocks as BrochureBlockType[]);
        } else {
            const raw = options.requestedBlocks as any[];
            // Extract types
            const rawTypes = raw.map(b => b.type);
            blockTypes = enforceFrontBack(rawTypes);

            // Map guidance (Assuming enforceFrontBack preserves order for valid inputs)
            // If input was valid 4 blocks, and enforced is 4 blocks, index matches.
            raw.forEach((b, i) => {
                if (b.guidance) guidanceMap[i] = b.guidance;
            });
        }
    } else {
        const raw = await options.llm.generate({
            system: BROCHURE_SYSTEM_PROMPT,
            prompt: buildBlockPlanPrompt({
                input,
                kind,
                level: input.format === "A4" && input.totalPages ? (input.totalPages / 4) : 1
            }),
            temperature: 0.2,
        });
        const parsed = extractJsonFromTags(raw) as any | null;
        const fromLlm = (parsed?.blocks ?? []).map((b: any) => b?.type).filter(Boolean) as BrochureBlockType[];
        blockTypes = fromLlm.length >= 2 ? enforceFrontBack(fromLlm) : defaultBlocksForKind(kind.defaultBlocks);
    }

    // 3) Build block/page plan
    const blocks = buildBlockPlans(blockTypes);

    // Restore Guidance
    blocks.forEach((b, i) => {
        if (guidanceMap[i]) {
            b.guidance = guidanceMap[i];
        }
    });

    const totalPages = blocks.length * 4;

    // 4) Generate pages
    const pages: BrochureOutput["pages"] = {} as any;

    for (const block of blocks) {
        for (const p of block.pages) {
            const moduleIds = mergeRecommendedModules({
                kindMandatoryModuleIds: kind.mandatoryModuleIds,
                pageRecommended: p.recommendedModuleIds,
                role: p.role,
            });

            const specs = pageModuleSpecs(moduleIds);

            // Format guidance string if exists
            let guidanceStr = "";
            if (block.guidance) {
                if (block.guidance.detail) guidanceStr += `[USER DETAIL] ${block.guidance.detail}\n`;
                if (block.guidance.mustInclude?.length) guidanceStr += `[MUST INCLUDE] ${block.guidance.mustInclude.join(", ")}\n`;
                if (block.guidance.toneOverride) guidanceStr += `[TONE] ${block.guidance.toneOverride}\n`;
            }

            const raw = await options.llm.generate({
                system: BROCHURE_SYSTEM_PROMPT,
                prompt: buildPagePrompt({
                    input,
                    kind,
                    facts,
                    pageId: p.pageId,
                    role: p.role,
                    moduleSpecs: specs,
                    additionalGuidance: guidanceStr || undefined
                }),
                temperature: 0.35,
            });

            const parsed = extractJsonFromTags(raw) as any | null;
            const modulesFromLLM = Array.isArray(parsed?.modules) ? parsed.modules : [];

            const sanitizedModules = sanitizeModulesBySpec({
                moduleIds,
                modulesFromLLM,
                getSpec: getModuleSpec,
            });

            pages[p.pageId] = { role: p.role, modules: sanitizedModules };
        }
    }

    const output: BrochureOutput = {
        meta: {
            kindId: kind.id,
            intentId: input.intentId,
            audience: input.audience,
            stage: input.stage,
            industryContext: input.industryContext,
            format: input.format,
            language: input.language,
            totalPages,
            totalBlocks: blocks.length,
        },
        facts,
        blocks,
        pages,
    };

    let gate = runQualityGates({
        output,
        kind,
        similarityThreshold: options.similarityThreshold ?? 0.78,
    });

    // autoRepair는 필요 시 추가 확장 가능(현재 마감 패키지는 1회 repair 없이도 통과 설계)
    return { output, gate };
}

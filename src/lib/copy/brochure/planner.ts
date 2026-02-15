// src/lib/copy/brochure/planner.ts

import { BrochureInput, FactsRegistry, BrochureBlockPlan } from "@/types/brochure";
import { BROCHURE_KINDS, BrochureKindSpec } from "@/lib/brochure-kinds";
import { BROCHURE_BLOCK_TEMPLATES, BlockTemplate } from "@/lib/brochure-blocks";
import { safeGenerateObject } from "@/lib/copy/provider";
import { z } from "zod";

const blockPlanSchema = z.object({
    blocks: z.array(z.object({
        type: z.string(),
        pages: z.array(z.object({
            pageId: z.string(),
            role: z.string(),
            recommendedModuleIds: z.array(z.string()),
        })),
    })),
});

/**
 * Pass 2 & 3: Block & Module Planning
 * Decides the structural flow and component mix.
 */
export async function planBrochureStructure(
    input: BrochureInput,
    facts: FactsRegistry
): Promise<BrochureBlockPlan[]> {
    const kind = BROCHURE_KINDS.find(k => k.id === input.kindId);
    if (!kind) throw new Error(`Unknown BrochureKind: ${input.kindId}`);

    const systemPrompt = `
    You are a Content Architect. Your job is to plan the 4-page (4P) block structure for a brochure.
    A brochure always starts with a Front Block and ends with a Back Block.
    You decide which content blocks to insert in between (if any) and which modules to use on each page.
    
    [CORE CONCEPTS]
    - Block: A set of 4 pages.
    - Module: A discrete content component with specific slots.
    
    [KIND CONTEXT]
    Kind: ${kind.label} (${kind.id})
    Target Audience: ${kind.primaryAudience.join(", ")}
    
    [AVAILABLE BLOCKS]
    ${JSON.stringify(BROCHURE_BLOCK_TEMPLATES.map(b => ({ type: b.type, roles: b.pageRoles })))}
    
    [FACTS SSOT]
    ${JSON.stringify(facts)}
    
    [TASK]
    Generate a sequence of blocks. Start with BLOCK_FRONT_IDENTITY. End with BLOCK_BACK_TRUST_CONTACT.
    For each page in the block, assign a PageRole and recommended Module IDs.
  `.trim();

    const userPrompt = `
    Plan a ${input.kindId} brochure. 
    User wants to emphasize: ${input.brandStory || "General overview"}.
    Generate the Block Plan.
  `.trim();

    try {
        const { object } = await safeGenerateObject({
            schema: blockPlanSchema,
            system: systemPrompt,
            prompt: userPrompt,
        });

        // Add UUIDs to blocks as per type definition
        return (object.blocks as any[]).map((b, idx) => ({
            blockId: `block-${idx}-${Math.random().toString(36).substr(2, 9)}`,
            type: b.type,
            pages: b.pages,
        })) as BrochureBlockPlan[];
    } catch (error) {
        console.error("[PLAN_STRUCT_FAIL] Falling back to default kind configuration.", error);
        return generateDefaultPlan(kind);
    }
}

function generateDefaultPlan(kind: BrochureKindSpec): BrochureBlockPlan[] {
    // Simple 2-block plan (Front + Back)
    const blockTypes = kind.defaultBlocks;

    return blockTypes.map((type, bIdx) => {
        const template = BROCHURE_BLOCK_TEMPLATES.find(t => t.type === type)!;
        return {
            blockId: `block-fallback-${bIdx}`,
            type: type,
            pages: template.pageRoles.map((role, pIdx) => ({
                pageId: `P${bIdx * 4 + pIdx + 1}`,
                role: role,
                recommendedModuleIds: template.defaultModuleIdsByRole[role] || [],
            })),
        };
    }) as BrochureBlockPlan[];
}

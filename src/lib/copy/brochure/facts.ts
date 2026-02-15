// src/lib/copy/brochure/facts.ts

import { safeGenerateObject } from "@/lib/copy/provider";
import { BrochureInput, FactsRegistry } from "@/types/brochure";
import { z } from "zod";

const factsRegistrySchema = z.object({
    brandName: z.string(),
    tagline: z.string().optional(),
    oneLinerPromise: z.string().optional(),
    offerSummary: z.string().optional(),
    targetAudience: z.string().optional(),
    contactPhone: z.string().optional(),
    contactEmail: z.string().optional(),
    contactKakao: z.string().optional(),
    websiteUrl: z.string().optional(),
    addressText: z.string().optional(),
    operatingHoursText: z.string().optional(),
    priceRangeText: z.string().optional(),
    periodText: z.string().optional(),
    eligibilityText: z.string().optional(),
    requiredDocsText: z.string().optional(),
    certifications: z.array(z.string()).optional(),
    partnersOrClients: z.array(z.string()).optional(),
    metrics: z.array(z.object({
        label: z.string(),
        value: z.string(),
        note: z.string().optional(),
    })).optional(),
    legalNotices: z.array(z.string()).optional(),
    claimPolicyMode: z.enum(["standard", "strict"]),
});

/**
 * Pass 1: Facts Registry (SSOT)
 * Extracts and stabilizes all factual data points from the raw input.
 */
export async function generateFactsRegistry(input: BrochureInput): Promise<FactsRegistry> {
    const systemPrompt = `
    You are a Data Strategist. Your job is to extract a "Facts Registry" (SSOT) from a brochure request.
    This registry will be used to ensure consistency across all pages of a multi-page brochure.
    
    [CRITICAL RULES]
    1. Do not invent facts. Use provided info.
    2. If a value like price or date is ambiguous, normalize it into a clear "Range" or "Text".
    3. Determine if 'claimPolicyMode' should be 'strict' based on the Kind (Public/Finance/Medical = strict).
    4. Ensure phone numbers, URLs, and emails are correctly formatted strings.
  `.trim();

    const userPrompt = `
    [INPUT DATA]
    Kind: ${input.kindId}
    Brand: ${input.brandName}
    Raw Input: ${JSON.stringify(input)}
    
    Generate the JSON Facts Registry.
  `.trim();

    try {
        const { object } = await safeGenerateObject({
            schema: factsRegistrySchema,
            system: systemPrompt,
            prompt: userPrompt,
        });

        return object as FactsRegistry;
    } catch (error) {
        console.error("[FACTS_REGISTRY_FAIL]", error);
        // Fallback to basic extraction from input
        return {
            brandName: input.brandName,
            contactPhone: input.contactPhone,
            contactEmail: input.contactEmail,
            websiteUrl: input.websiteUrl,
            claimPolicyMode: input.kindId.startsWith("KIND_PUBLIC") ? "strict" : "standard",
        } as FactsRegistry;
    }
}

// src/lib/brochure-schemas.ts

import { z } from "zod";

export const brochureFormSchema = z.object({
    kindId: z.string().min(1, "문서 형식을 선택해주세요."),
    industryContext: z.object({
        l1: z.string().min(1),
        l2: z.string().min(1),
        l3: z.string().optional(),
    }).optional(),
    intentId: z.string().optional(),
    format: z.enum(["A4", "A5"]),
    foldType: z.enum(["N_FOLD", "GATE_FOLD"]).default("N_FOLD").optional(),
    language: z.enum(["ko", "en", "ja", "zh"]),
    audience: z.string().optional(),
    stage: z.string().optional(),
    totalPages: z.number().min(4).max(16).default(4),

    // Identity
    brandName: z.string().min(1, "상호명/브랜드명을 입력해주세요."),
    brandTone: z.enum(["official", "neutral", "premium", "friendly", "tech", "investor"]),

    // Story / Narrative
    brandStory: z.string().optional(),
    problemStatement: z.string().optional(),
    philosophyOrMission: z.string().optional(),

    // Service/Product
    productsOrServices: z.array(z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        priceText: z.string().optional(),
    })).optional(),

    // Policy/Public
    eligibilityText: z.string().optional(),
    requiredDocsText: z.string().optional(),
    timelineText: z.string().optional(),

    // Contact
    contactPhone: z.string().optional(),
    websiteUrl: z.string().optional(),

    // Orchestration
    blocks: z.array(z.object({
        blockId: z.string(),
        type: z.string(),
        guidance: z.object({
            detail: z.string().optional(),
            mustInclude: z.array(z.string()).optional(),
            toneOverride: z.string().optional(),
        }).optional(),
    })).min(1),

    // Advanced Engine
    claimPolicyMode: z.enum(["standard", "strict"]).default("standard"),
    dynamicAnswers: z.record(z.string(), z.any()).optional(),
});

export type BrochureFormValues = z.infer<typeof brochureFormSchema>;

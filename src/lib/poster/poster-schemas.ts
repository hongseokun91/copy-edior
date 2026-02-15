import { z } from "zod";
import { POSTER_INTENTS, HEADLINE_TYPES, CHANNEL_PACKS, DENSITY_PROFILES } from "./poster-constants";

export const posterBriefSchema = z.object({
    brief: z.string().min(5, "최소 5자 이상 입력해주세요.").max(200, "200자 이내로 입력해주세요."),
});

// Auto-detected or User-confirmed Metadata
export const posterMetaSchema = z.object({
    intentId: z.enum([
        POSTER_INTENTS[0].id,
        ...POSTER_INTENTS.slice(1).map(i => i.id)
    ] as [string, ...string[]]).optional(),

    headlineType: z.enum([
        HEADLINE_TYPES[0].id,
        ...HEADLINE_TYPES.slice(1).map(h => h.id)
    ] as [string, ...string[]]).optional(),

    channelPack: z.enum([
        CHANNEL_PACKS[0].id,
        ...CHANNEL_PACKS.slice(1).map(c => c.id)
    ] as [string, ...string[]]),

    densityProfile: z.enum([
        DENSITY_PROFILES[0].id,
        ...DENSITY_PROFILES.slice(1).map(d => d.id)
    ] as [string, ...string[]]),

    claimPolicyMode: z.enum(["standard", "strict"]),
    industryHint: z.string().optional(),
    facts: z.object({
        who: z.string(),
        what: z.string(),
        why: z.string(),
        tone: z.string(),
        keywords: z.array(z.string())
    }).optional()
});

export const posterContentSchema = z.record(z.string(), z.any());

export type PosterBriefValues = z.infer<typeof posterBriefSchema>;
export type PosterMetaValues = z.infer<typeof posterMetaSchema>;

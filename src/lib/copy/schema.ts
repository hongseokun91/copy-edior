
import { z } from "zod";

// More Section (Expanded Spec)
export const MoreContentSchema = z.object({
    altHeadlines: z.array(z.string()).describe("3 Alternative Headlines (Different angles)"),
    bannerShort: z.array(z.string()).describe("2 Short Banner Texts (Under 15 chars)"),
    microCTA: z.array(z.string()).describe("2 Micro CTAs (e.g. 'Tel', 'Map')"),
    hashtags: z.array(z.string()).describe("8-12 Viral Hashtags")
});

// Main Variant (Spec C3)
export const VariantSchema = z.object({
    headline: z.string().describe("Main Headline (18-26 chars). Impactful."),
    subhead: z.string().describe("Subhead (28-55 chars). Explains the value."),
    bullets: z.array(z.string()).length(3).describe("3 Bullets: [0]=Offer/Benefit, [1]=Proof/Diff, [2]=Convenience/Trust. STRICT ROLE."),
    cta: z.string().describe("CTA Button Text (10-18 chars). Action Verb."),
    info: z.string().describe("Location/Contact/Hours Info Line."),
    disclaimer: z.string().describe("Legal/Disclaimer string (e.g. 'Limited time')."),
    more: MoreContentSchema,
    meta: z.object({ frame: z.string().optional() }).passthrough().optional()
});

// Response (A/B/C)
export const ResponseSchema = z.object({
    variants: z.object({
        A: VariantSchema.describe("Frame A: Performance/Direct (4U)"),
        B: VariantSchema.describe("Frame B: Brand/Emotional (AIDA)"),
        C: VariantSchema.describe("Frame C: Urgent/Scarcity (PAS)")
    }),
    recommendedFrame: z.enum(["A", "B", "C"]).describe("Best variant ID"),
    whyRecommended: z.string().describe("Reason for recommendation")
});

// Legacy Export for backward compatibility if needed
export const CopyContentSchema = VariantSchema;
export type CopyContent = z.infer<typeof CopyContentSchema>; 

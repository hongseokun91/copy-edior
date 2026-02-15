import { z } from "zod";

// --- Leaflet Output Schema (Structured) ---
export const sectionContentSchema = z.record(z.string(), z.string()); // Strictly String Values

export const leafletSectionSchema = z.object({
    type: z.string(),
    content: sectionContentSchema
});

export const leafletPageSchema = z.object({
    page_id: z.string(),
    role: z.string(),
    sections: z.array(leafletSectionSchema)
});

export const leafletVariantSchema = z.object({
    pages: z.array(leafletPageSchema).length(6) // Strict 6 pages
});

// --- Flyer Output Schema (Flat) ---
export const flyerVariantSchema = z.object({
    HEADLINE: z.string(),
    SUBHEAD: z.string().optional(),
    BENEFIT_BULLETS: z.array(z.string()).min(3).max(5), // Relaxed to match prompt (3-5)
    CTA: z.string(),
    INFO: z.string().optional(),
    DISCLAIMER: z.string().optional(),

    // Copy Kit (Optional V1.4 Features)
    headlineVariations: z.array(z.string()).optional(),
    subheadVariations: z.array(z.string()).optional(),
    ctaVariations: z.array(z.string()).optional(),
    trustVariations: z.array(z.string()).optional(),
    hashtags: z.array(z.string()).optional(),

    // V3 Richness Fields
    hookLine: z.string().optional(),
    posterShort: z.string().optional(),
    valueProps: z.array(z.string()).optional(),
    altHeadlines: z.array(z.string()).optional()
});

// --- Union Schema ---
export const outputVariantSchema = z.union([flyerVariantSchema, leafletVariantSchema]);
export type ValidatedFlyerVariant = z.infer<typeof flyerVariantSchema>;
export type ValidatedLeafletVariant = z.infer<typeof leafletVariantSchema>;

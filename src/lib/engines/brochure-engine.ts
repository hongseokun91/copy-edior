
import { NormalizedBrief } from "@/types/brief";
import { safeGenerateText } from "@/lib/copy/provider";
import { logger } from "@/lib/logger";
import { SYSTEM_PROMPT } from "@/lib/copy/prompts";
import { normalizeInput } from "@/lib/copy/normalize";
import { GenerateResponse } from "@/types/flyer";
import { QualityEngine } from "@/lib/quality/engine";
import { scrapeUrl } from "@/lib/poster/scraper"; // Import Scraper

/**
 * Brochure Engine (v1.0)
 * Dedicated engine for generating Multi-Page Brand Brochures.
 * Decoupled from Flyer engine.
 */

export async function generateBrochure(
    rawInputs: any,
    traceId: string
): Promise<GenerateResponse> {
    // 0. Normalize Inputs
    const brief = normalizeInput(rawInputs, 'brochure');

    logger.info("GEN_BRIEF_RECEIVED", `Generating Brochure for ${brief.storeName}`, { traceId });

    // 0.5 Scrape Reference URL
    if (brief.referenceUrl) {
        try {
            logger.info("GEN_SCRAPE", `Analyzing URL: ${brief.referenceUrl}`, { traceId });
            const scraped = await scrapeUrl(brief.referenceUrl);
            brief.scrapedContext = {
                url: scraped.url,
                text: scraped.extractedText,
                vibe: scraped.visualVibe
            };
        } catch (e) {
            logger.warn("GEN_SCRAPE_FAIL", `Failed to scrape ${brief.referenceUrl}`, { error: e });
        }
    }

    const prompt = `
    ${SYSTEM_PROMPT}

    [TASK]
    Create a detailed PREMIUM BRAND BROCHURE.
    
    [GOAL]
    Objective: Create a premium, multi-page brochure.
    Category: ${brief.industry}
    Brand: ${brief.storeName}
    Target: ${brief.targetAudience || "General Public"}

    ${brief.scrapedContext ? `
    [VISUAL & PAGE CONTEXT - FROM URL]
    The user provided a URL (${brief.scrapedContext.url}).
    - Vibe: "${brief.scrapedContext.vibe}"
    - Content Snippet: "${brief.scrapedContext.text.slice(0, 500)}..."
    *INSTRUCTION*: Use this context to align the brochure's tone and details with the brand's online presence.
    ` : ""}

    [BROCHURE STRUCTURE - 4 PAGES MINIMUM]
    You MUST output a valid JSON object with a "pages" array.
    
    Page 1: Front Cover (Brand Image, Slogan)
    Page 2: Brand Story (Philosophy, Founder's Message)
    Page 3: Service/Product Details (Core Offering)
    Page 4: Contact & Location (Back Cover)
    
    [OUTPUT FORMAT]
    {
      "pages": [
        { "page_id": "P1", "role": "Cover", "sections": [{ "type": "HERO", "content": {...} }] },
        { "page_id": "P2", "role": "Story", "sections": [...] },
        { "page_id": "P3", "role": "Service", "sections": [...] },
        { "page_id": "P4", "role": "Contact", "sections": [...] }
      ]
    }
    `;

    const { text } = await safeGenerateText({
        passName: "BROCHURE_GEN",
        system: SYSTEM_PROMPT,
        prompt: prompt,
        abortSignal: AbortSignal.timeout(25000)
    }, traceId);

    // Parsing
    let result;
    try {
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
        result = JSON.parse(jsonStr);

        // Basic validation
        if (!result.pages || !Array.isArray(result.pages)) {
            throw new Error("Invalid Brochure Structure");
        }
    } catch (e) {
        logger.error("GEN_INVALID", "Failed to parse Brochure JSON", { error: e });
        throw e;
    }

    // Cast result to LeafletVariant (compatible structure) or similar
    // Since we updated VariantContent to allow PosterResult, we might want to ensure Brochure follows LeafletVariant (pages array)
    // Quality Evaluation (Brochure)
    const scorecard = QualityEngine.evaluate(JSON.stringify(result.pages), "GENERAL");

    const uniqueResult = {
        pages: result.pages,
        meta: {
            template_id: "brochure_std",
            layout_id: "A" as const,
            quality_score: scorecard.totalScore,
            quality_pass: scorecard.pass,
            quality_scorecard: scorecard
        }
    };

    return {
        variants: {
            A: uniqueResult as any, // Cast to avoid strict LeafletPageId checks if needed, or align IDs
            B: { ...uniqueResult, meta: { layout_id: "B" as const } } as any,
            C: { ...uniqueResult, meta: { layout_id: "A" as const } } as any
        },
        meta: {
            rateLimit: { remaining: 10, resetAtKST: "00:00" },
            cacheHit: false,
            normalized: {
                period: brief.periodNormalized,
                contact: brief.contactNormalized
            },
            warnings: [],
            warRoomLogs: `Brochure Generated for ${brief.storeName}`,
            traceId
        }
    };
}

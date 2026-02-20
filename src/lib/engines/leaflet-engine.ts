
import { NormalizedBrief } from "@/types/brief";
import { safeGenerateText } from "@/lib/copy/provider";
import { logger } from "@/lib/logger";
import { SYSTEM_PROMPT } from "@/lib/copy/prompts";
import { normalizeInput } from "@/lib/copy/normalize";
import { GenerateResponse } from "@/types/flyer";
import { LeafletVariant } from "@/types/leaflet";
import { getStrategyForCategory } from "@/lib/leaflet-strategies";
import { QualityEngine } from "@/lib/quality/engine";
import { MODULE_POLICIES } from "@/lib/quality/policies";
import { CLICHE_BLOCKLIST, OVERCLAIM_BLOCKLIST } from "@/lib/quality/maps";
import { getKnowledgeForContext, IndustryKnowledge } from "@/lib/knowledge/registry";
import { SEMANTIC_PERSONAS } from "@/lib/personas";
import { scrapeUrl } from "@/lib/poster/scraper"; // Import Scraper

// ...

export async function generateLeaflet(
    rawInputs: any,
    traceId: string
): Promise<GenerateResponse> {
    // 0. Normalize Inputs
    const brief = normalizeInput(rawInputs, 'leaflet');
    logger.info("GEN_BRIEF_RECEIVED", `Generating ECO v3 Leaflet for ${brief.storeName}`, { traceId });

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
            const err = e instanceof Error ? e : new Error(String(e));
            logger.warn("GEN_SCRAPE_FAIL", `Failed to scrape ${brief.referenceUrl}`, { error: err.message });
        }
    }

    // 1. Knowledge Discovery (The "Intelligence" Layer)
    const contextKnowledge = getKnowledgeForContext(brief.industry, brief.v09_extra?.extraNotes || "");
    const industryFacts = contextKnowledge.map(k => `[${k.id}] ${k.nicheBrief}\nValues: ${k.primaryValues.join(", ")}`).join("\n");
    const lexiconHints = contextKnowledge.map(k => `Lexicon: ${k.lexicon.sensory.join(", ")}, ${k.lexicon.emotional.join(", ")}`).join("\n");

    // 2. PASS 1: Strategic Blueprinting (The "Think" Step)
    logger.info("ECO_PASS1_START", "Generating Strategic Blueprint", { traceId });
    const stratPersona = SEMANTIC_PERSONAS.STRATEGIST;
    const blueprintPrompt = `
    ${SYSTEM_PROMPT}
    [ROLE] ${stratPersona.name}: ${stratPersona.description}
    [LOGIC] ${stratPersona.logic}

    [INPUTS]
    - Brand: ${brief.storeName}
    - Industry: ${brief.industry}
    - Goal: ${brief.goal}
    - Details: ${brief.v09_extra?.extraNotes || "None"}
    - Target: ${brief.targetAudience || "General"}
    - Benefits: ${brief.coreBenefit || "Not specified"}

    ${brief.scrapedContext ? `
    [VISUAL & PAGE CONTEXT - FROM URL]
    The user provided a URL (${brief.scrapedContext.url}).
    - Vibe: "${brief.scrapedContext.vibe}"
    - Content Snippet: "${brief.scrapedContext.text.slice(0, 500)}..."
    *INSTRUCTION*: Use this context to align the strategy with the brand's actual online presence.
    ` : ""}

    [INDUSTRY KNOWLEDGE]
    ${industryFacts}

    [TASK]
    Create a 6-PAGE STRATEGIC BLUEPRINT for this leaflet.
    Resolve the conflicting/complex factors (e.g., if it's Bunsik and Diet) into a single "Narrative Anchor".
    Define the "Red Thread" (Emotional Arc) that connects Page 1 to Page 6.

    [OUTPUT FORMAT: JSON ONLY]
    {
        "narrativeAnchor": "...",
        "emotionalArc": "...",
        "pageBlueprints": {
            "P1": { "focus": "...", "hook": "..." },
            "P2": { "focus": "...", "strategy": "..." },
            "P3": { "focus": "...", "strategy": "..." },
            "P4": { "focus": "...", "strategy": "..." },
            "P5": { "focus": "...", "strategy": "..." },
            "P6": { "focus": "...", "cta": "..." }
        }
    }
    `;

    const { text: blueprintText } = await safeGenerateText({
        passName: "ECO_PASS1_STRAT",
        system: SYSTEM_PROMPT,
        prompt: blueprintPrompt
    }, traceId);

    const blueprint = JSON.parse(blueprintText.match(/\{[\s\S]*\}/)?.[0] || "{}");

    // 3. PASS 2: Holistic Copy Synthesis (The "Write" Step)
    const strategy = getStrategyForCategory(brief.industry);
    const volume = brief.v09_extra?.textVolume || 'standard';

    const tasks = (['A', 'B', 'C'] as const).map(async (variantIdx) => {
        const stratVariant = strategy[variantIdx];
        const persona = (brief.industry === "분식" || brief.industry === "식당/카페")
            ? SEMANTIC_PERSONAS.FNB_EXPERT
            : SEMANTIC_PERSONAS.EDITOR_IN_CHIEF;

        const copyPrompt = `
        ${SYSTEM_PROMPT}

        [ROLE] ${persona.name}: ${persona.description}
        [WRITING LOGIC] ${persona.logic}

        [STRATEGIC BLUEPRINT]
        - Narrative Anchor: ${blueprint.narrativeAnchor}
        - Arc: ${blueprint.emotionalArc}
        - P1 Focus: ${blueprint.pageBlueprints?.P1.focus}
        - P2 Focus: ${blueprint.pageBlueprints?.P2.focus}
        - P3-4 Focus: ${blueprint.pageBlueprints?.P3.focus} / ${blueprint.pageBlueprints?.P4.focus}
        - P5 Focus: ${blueprint.pageBlueprints?.P5.focus}
        - P6 Focus: ${blueprint.pageBlueprints?.P6.focus}

        [INDUSTRY DNA & LEXICON]
        ${lexiconHints}
        Forbidden Words: ${contextKnowledge.flatMap(k => k.forbiddenWords).join(", ")}

        [TASK]
        Synthesize the full 6-page copy. Ensure the tone is consistent with the Narrative Anchor.
        Variant Type: ${stratVariant.label}
        Volume: ${volume.toUpperCase()}

        [OUTPUT FORMAT: JSON ONLY]
        {
          "pages": [
            { "page_id": "P1", "sections": [{ "type": "HERO", "content": { "headline": "...", "subhead": "..." } }] },
            ... up to P6 ...
          ]
        }
        `;

        try {
            const { text: finalText } = await safeGenerateText({
                passName: `ECO_PASS2_COPY_${variantIdx}`,
                system: SYSTEM_PROMPT,
                prompt: copyPrompt,
                abortSignal: AbortSignal.timeout(60000)
            }, traceId);

            const parsed = JSON.parse(finalText.match(/\{[\s\S]*\}/)?.[0] || "{}");
            const scorecard = QualityEngine.evaluate(JSON.stringify(parsed.pages), "GENERAL");

            return {
                pages: parsed.pages,
                meta: {
                    template_id: "eco_v3",
                    layout_id: variantIdx,
                    strategy_label: stratVariant.label,
                    quality_score: scorecard.totalScore,
                    quality_pass: scorecard.pass,
                    quality_scorecard: scorecard,
                    narrative_anchor: blueprint.narrativeAnchor
                }
            } as LeafletVariant;
        } catch (e) {
            return { pages: [], meta: { error: "Copy Synthesis Failed" } } as any;
        }
    });

    const results = await Promise.all(tasks);

    return {
        variants: { A: results[0], B: results[1], C: results[2] },
        meta: {
            rateLimit: { remaining: 5, resetAtKST: "00:00" },
            cacheHit: false,
            normalized: { period: brief.periodNormalized, contact: brief.contactNormalized },
            warnings: [],
            warRoomLogs: `ECO v3 Orchestration | Narrative: ${blueprint.narrativeAnchor}`,
            traceId,
            engine_v: "3.1-ECO"
        }
    };
}

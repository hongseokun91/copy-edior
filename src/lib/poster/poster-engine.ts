
import {
    PosterMeta,
    PosterResult,
    PosterIntentId,
    HeadlineCandidate,
    PosterSlotId,
    HeadlineType,
    PosterBlueprint
} from "@/types/poster";
import { safeGenerateText } from "@/lib/copy/provider";
import { resolveBlueprint } from "./router";
import { BLUEPRINTS } from "./blueprints.registry";
import {
    buildHeadlinePrompt,
    buildPosterBodyPrompt,
    POSTER_SYSTEM_PROMPT
} from "./prompts";

// Helper to parse JSON from AI text response
function parseAIJson<T>(text: string): T | null {
    try {
        const match = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/\{[\s\S]*\}/);
        if (match) {
            const jsonStr = match[1] || match[0];
            return JSON.parse(jsonStr);
        }
        return JSON.parse(text);
    } catch (e) {
        console.error("JSON Parse Failed", e);
        return null;
    }
}

// ------------------------------------------------------------------
// 1. Analyze Brief (Intent, Channel, Policy) + [V5] Fact Extraction
// ------------------------------------------------------------------
export async function analyzeBrief(brief: string, industry: string = "General", traceId: string = "unknown"): Promise<PosterMeta> {
    const prompt = `
    [TASK]
    Analyze the user's brief for a marketing poster. Extract key strategic data (Facts) and suggest technical settings.

    [CONTEXT]
    Brief: "${brief}"
    Industry: "${industry}"

    [REQUIRED EXTRACTION - FACT SHEET]
    You MUST extract these 5 dimensions. **All values MUST be in KOREAN (한국어)**:
    1. Who (Target Audience): Who is this for? (e.g., "2030 직장인", "취업 준비생")
    2. What (Key Content): What is the main offering? (e.g., "아메리카노 1+1", "여름 대축제")
    3. Why (Purpose): Why make this poster? (e.g., "신규 고객 유입", "브랜드 인지도 상승")
    4. Tone (Atmosphere): What is the vibe? (e.g., "현대적이고 차분한", "활기찬 에너지")
    5. Keywords: List 3-5 critical keywords that MUST be included. (e.g., "기간한정", "무료증정")

    [OUTPUT FORMAT]
    Return ONLY valid JSON:
    {
      "intentId": "INT_...", // One of: INT_PROMO_OFFER, INT_PRODUCT_LAUNCH, INT_EVENT_GUIDE, INT_RECRUITING, INT_PUBLIC_NOTICE, INT_BRAND_CAMPAIGN, INT_B2B_SEMINAR
      "headlineType": "HL_...", // Suggest one: HL_OFFER_FIRST, HL_AUDIENCE_FIRST, HL_PROBLEM_FIRST, HL_AUTHORITY_FIRST
      "channelPack": "PACK_...", // Suggest one: PACK_PRINT_A2, PACK_SIGNAGE_16_9, PACK_SNS_1_1, PACK_SNS_9_16
      "densityProfile": "DENSITY_...", // Suggest one: DENSITY_MINIMAL, DENSITY_STANDARD, DENSITY_DETAILED
      "claimPolicyMode": "standard" | "strict", // strict for medical/financial/public
      "facts": {
        "who": "...", // In Korean
        "what": "...", // In Korean
        "why": "...", // In Korean
        "tone": "...", // In Korean
        "keywords": ["..."] // In Korean
      }
    }
    `;

    const { text } = await safeGenerateText({
        passName: "POSTER_ANALYZE",
        system: POSTER_SYSTEM_PROMPT, // Use the shared system prompt
        prompt: prompt,
        abortSignal: AbortSignal.timeout(10000)
    }, traceId);

    const data = parseAIJson<PosterMeta>(text);

    if (!data) {
        // Fallback
        return {
            intentId: "INT_PROMO_OFFER",
            headlineType: "HL_OFFER_FIRST",
            channelPack: "PACK_SNS_1_1",
            densityProfile: "DENSITY_STANDARD",
            claimPolicyMode: "standard", // Conservative default
            brief,
            industryHint: industry,
            facts: {
                who: "General Audience",
                what: brief,
                why: "Promotion",
                tone: "Professional",
                keywords: []
            }
        };
    }

    return { ...data, brief, industryHint: industry };
}

// ------------------------------------------------------------------
// 2. Generate Headlines (Strategies A, B, C)
// ------------------------------------------------------------------
export async function generateHeadlines(meta: PosterMeta, traceId: string = "unknown"): Promise<PosterResult> {

    // Construct the optimized prompt using the builder
    const prompt = buildHeadlinePrompt({
        meta,
        brief: meta.brief,
        answers: meta.facts || {}
    });

    const { text } = await safeGenerateText({
        passName: "POSTER_HEADLINES",
        system: POSTER_SYSTEM_PROMPT,
        prompt: prompt,
        abortSignal: AbortSignal.timeout(20000)
    }, traceId);

    const rawData = parseAIJson<Record<string, string[]>>(text);

    // Resilience: normalize candidates to object with text
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normalizeSet = (items: any[]) => {
        if (!Array.isArray(items)) return [];
        return items.map(item => {
            if (typeof item === 'string') return { text: item };
            return item; // Assume it might have text/badges if AI was smart enough, but prompt mostly asks for strings? 
            // Wait, previous code prompt logic asked for: 
            // "setA": [{ "text":"", "typeHint":"HL_*", ... }] in buildHeadlinePrompt
            // So rawData.setA is likely an array of OBJECTS, not strings.
        });
    };

    // Actually, looking at prompts.ts buildHeadlinePrompt, it asks for objects:
    // "setA": [{ "text":"", "typeHint":"HL_*", "badges": ... }]

    // So rawData.setA should be an array of objects.

    // Map to HeadlineCandidate structure
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapCandidates = (rawCandidates: any[], key: "setA" | "setB" | "setC") => {
        const list = Array.isArray(rawCandidates) ? rawCandidates : [];

        return list.slice(0, 7).map((item, i) => {
            // Fallback if item is just string
            const text = typeof item === 'string' ? item : item.text;
            const badges = typeof item === 'object' && item.badges ? item.badges : {
                length: text.length < 15 ? "short" : text.length > 25 ? "long" : "medium",
                densityFit: text.length < 15 ? "DENSITY_MINIMAL" : "DENSITY_DETAILED",
                tone: key === "setC" ? "official" : "friendly",
                risk: "low"
            };

            return {
                id: `${key}_${i}`,
                text: text,
                typeHint: typeof item === 'object' && item.typeHint ? item.typeHint : (key === "setA" ? "HL_OFFER_FIRST" : key === "setB" ? "HL_PROBLEM_FIRST" : "HL_AUTHORITY_FIRST"),
                badges: badges,
                score: typeof item === 'object' && item.score ? item.score : 0
            } as HeadlineCandidate;
        });
    };

    const setA = mapCandidates(rawData?.setA || [], "setA");
    const setB = mapCandidates(rawData?.setB || [], "setB");
    const setC = mapCandidates(rawData?.setC || [], "setC");

    // Simple heuristic for top 3: Pick #1 from each set
    const top3 = [setA[0], setB[0], setC[0]].filter(Boolean);

    const blueprint = resolveBlueprint(meta.intentId) || BLUEPRINTS["INT_PROMO_OFFER"];

    return {
        meta,
        headlineCandidates: { setA, setB, setC, recommendedTop3: top3 },
        blueprint,
        content: {},
        compliance: { warnings: [], requiredDisclaimers: [] }
    };
}

// ------------------------------------------------------------------
// 3. Generate Poster Body
// ------------------------------------------------------------------
export async function generatePosterBody(
    meta: PosterMeta,
    selectedHeadline: string,
    blueprint: PosterBlueprint,
    traceId: string = "unknown"
): Promise<Record<string, string>> {

    // Construct the optimized prompt using the builder
    const prompt = buildPosterBodyPrompt({
        meta,
        brief: meta.brief,
        blueprint: blueprint,
        selectedHeadline,
        answers: meta.facts || {}
    });

    const { text } = await safeGenerateText({
        passName: "POSTER_BODY",
        system: POSTER_SYSTEM_PROMPT,
        prompt: prompt,
        abortSignal: AbortSignal.timeout(20000)
    }, traceId);

    const content = parseAIJson<Record<string, string>>(text);
    return content || {};
}

import { safeGenerateText } from "@/lib/copy/provider"; // Re-use existing model provider
import { NormalizedBrief } from "@/types/brief";
import { z } from "zod";

// Schema for the Strategy (Internal Asset)
export const StrategySchema = z.object({
    target_persona: z.string().describe("Specific persona of the customer (e.g. 'Anxious Mom', 'Tired Worker')"),
    core_pain: z.string().describe("The deep, unspoken pain point or fear of the customer"),
    core_gain: z.string().describe("The emotional reward or relief they seek"),
    keywords: z.array(z.string()).describe("5-7 Strategic nouns/verbs (No Adjectives) to use in copy"),
    archetype_suggestion: z.enum([
        "The Innocent", "The Sage", "The Explorer", "The Outlaw", "The Magician",
        "The Hero", "The Lover", "The Jester", "The Caregiver", "The Creator",
        "The Ruler", "The Regular Guy"
    ]).describe("Jungian Archetype that fits this strategy")
});

export type StrategyBrief = z.infer<typeof StrategySchema>;

export async function generateStrategy(brief: NormalizedBrief, traceId: string = "unknown"): Promise<StrategyBrief> {
    const systemPrompt = `
    You are a Strategic Planner for a top ad agency.
    Your job is to analyze the Client Brief and create a "Value Proposition Strategy".
    
    [GOAL]
    - Identify the "Hidden Truth" behind the product.
    - Do NOT just repeat the brief. Infer the *context*.
    
    [OUTPUT FORMAT]
    Output strictly JSON inside <JSON> tags.
    `.trim();

    const userPrompt = `
    [CLIENT BRIEF]
    - Category: ${brief.industry}
    - Name: ${brief.storeName}
    - Goal: ${brief.goal}
    - Offer: ${brief.offerRaw}
    
    Analyze this and output the Strategy JSON inside <JSON> tags.
    `.trim();

    try {
        const { text } = await safeGenerateText({
            passName: "STRATEGY",
            system: systemPrompt,
            prompt: userPrompt,
            abortSignal: AbortSignal.timeout(12000),
        }, traceId);

        const match = text.match(/<JSON>([\s\S]*?)<\/JSON>/);
        if (!match) throw new Error("STRATEGY_PARSE_FAIL: Missing <JSON> tags");

        const object = JSON.parse(match[1]);
        return object;

    } catch (e: any) {
        console.error(`[Strategist] Failed for ${traceId}: ${e.message}`);
        // Fallback Strategy
        return {
            target_persona: "General Customer",
            core_pain: "Need for quality and reliability",
            core_gain: "Satisfaction and peace of mind",
            keywords: ["Quality", "Service", "Trust", "Value"],
            archetype_suggestion: "The Regular Guy"
        };
    }
}

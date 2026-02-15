
import { safeGenerateText } from "@/lib/copy/provider";
import { NormalizedBrief } from "@/types/brief";
import { logger } from "@/lib/logger";

export interface CreativeDirection {
    memo: string; // The "Thinking" text
    modelId: string;
}

/**
 * THE DIRECTOR AGENT
 * Role: Analyze the brief, find the hidden angle, and write a text memo.
 * Output: Pure Text (Markdown)
 */
export async function directStrategy(brief: NormalizedBrief): Promise<CreativeDirection> {
    const systemPrompt = `
    You are a Creative Director at a top ad agency (Ogilvy/Cheil level).
    Your Copywriter is waiting for your instructions.
    
    [YOUR GOAL]
    - Read the client brief.
    - Deeply analyze the "Hidden Human Need" beneath the product.
    - Write a "Creative Direction Memo" (approx. 200-300 words).
    - DECIDE the tone, the core pain, and the winning angle.
    - Be harsh. If the brief is boring, find a way to make it exciting.
    
    [OUTPUT FORMAT]
    - Markdown Text Only.
    - Sections: "Target Insight", "Core Friction", "The Winning Hook", "Tone Direction".
    `.trim();

    const userPrompt = `
    [CLIENT BRIEF]
    - Product: ${brief.industry} (${brief.storeName})
    - Goal: ${brief.goal}
    - Offer: ${brief.offerRaw}
    - USP: ${brief.mustInclude.join(", ")}
    - Period: ${brief.periodNormalized}
    
    Write your Strategic Memo now.
    `.trim();

    try {
        const { text, usage } = await safeGenerateText({
            system: systemPrompt,
            prompt: userPrompt,
            abortSignal: AbortSignal.timeout(15000), // Give it time to think (15s)
        });

        return {
            memo: text,
            modelId: "director-v1"
        };
    } catch (e) {
        logger.warn("GEN_AI_FAIL", "Director failed to strategize. Using basic fallback.", { e: e as any });
        return {
            memo: "Focus on the main offer and benefits. Keep it professional.",
            modelId: "fallback"
        };
    }
}

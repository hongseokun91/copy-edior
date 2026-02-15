

import { safeGenerateText } from "@/lib/copy/provider";
import { NormalizedBrief } from "@/types/brief";
import { buildFramePrompt, SYSTEM_PROMPT } from "./prompts";

export async function ideate(frame: "A" | "B" | "C", brief: NormalizedBrief, traceId: string = "unknown", styleId?: string) {
    const framePrompt = buildFramePrompt(frame, brief, styleId);
    const ideationPrompt = `
    ${framePrompt}
    
    [TASK]
    Brainstorm 6 DISTINCT creative concepts for this Frame.
    Do NOT output JSON. Output a text list.
    
    Format each candidate exactly like this:
    
    [[CANDIDATE 1]]
    Headline: (Write Headline)
    Subhead: (Write Subhead)
    Reasoning: (Why this fits)
    
    [[CANDIDATE 2]]
    ...
    
    (Generate 6 candidates)
    `.trim();

    const { text } = await safeGenerateText({
        passName: `IDEATE_${frame}`,
        system: SYSTEM_PROMPT,
        prompt: ideationPrompt,
        abortSignal: AbortSignal.timeout(40000)
    }, traceId);

    // Parse Text List
    const candidates: any[] = [];
    const chunks = text.split("[[CANDIDATE");

    chunks.forEach(chunk => {
        const headline = chunk.match(/Headline:\s*(.*)/)?.[1]?.trim();
        const subhead = chunk.match(/Subhead:\s*(.*)/)?.[1]?.trim();
        const reason = chunk.match(/Reasoning:\s*(.*)/)?.[1]?.trim();

        if (headline && subhead) {
            candidates.push({
                headline,
                subhead,
                concept_reasoning: reason || "AI Generated"
            });
        }
    });

    // Fallback if parsing fails (should rarely happen with GPT-4o)
    if (candidates.length === 0) {
        console.warn("[Ideate] Parsing Failed! Using Fallback. Raw Text:", text.substring(0, 100));
        candidates.push({
            headline: brief.offerRaw || "특별 혜택",
            subhead: "지금 바로 확인하세요",
            concept_reasoning: "Fallback"
        });
    }

    return { candidates };
}

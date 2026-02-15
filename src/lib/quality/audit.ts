
import { safeGenerateText } from "@/lib/copy/provider"; // Re-use model
import { FlyerSlots } from "@/types/flyer";
import { z } from "zod";

const AuditSchema = z.object({
    score: z.number().describe("Quality Score from 0 to 100"),
    is_safe: z.boolean().describe("Is it safe for brand?"),
    critique: z.string().describe("Harsh feedback on what sucks."),
    suggestions: z.string().describe("Specific instructions to fix it.")
});

export async function auditDraft(draft: FlyerSlots, traceId: string = "unknown"): Promise<{ score: number; critique: string }> {
    const prompt = `
    [ROLE]
    You are the "Kill Switch" Auditor.
    Your purity standards are impossibly high.
    
    [TASK]
    Review this Ad Copy.
    
    [CHECKLIST]
    1. Is it boring? (Auto-Fail)
    2. Is it clichéd? (Auto-Fail)
    3. Does the Headline grab attention within 0.2s?
    4. Are the bullets punchy (under 6 words each)?
    5. Is the tone consistent?
    
    [DRAFT TO AUDIT]
    ${JSON.stringify(draft, null, 2)}
    
    [OUTPUT FORMAT]
    Think briefly, then output strictly JSON inside <JSON> tags.
    Format: <JSON>{"score": number, "is_safe": boolean, "critique": "string", "suggestions": "string"}</JSON>
    `.trim();

    try {
        const { text } = await safeGenerateText({
            passName: "AUDIT",
            prompt: prompt
        }, traceId);

        const match = text.match(/<JSON>([\s\S]*?)<\/JSON>/);
        if (!match) throw new Error("AUDIT_PARSE_FAIL: Missing <JSON> tags");

        const object = JSON.parse(match[1]);

        return {
            score: object.score ?? 0,
            critique: `${object.critique || "Review done."} (Fix: ${object.suggestions || "N/A"})`
        };
    } catch (e: any) {
        console.warn(`[Audit] Failed for ${traceId}: ${e.message}. Using safety score 50.`);
        return { score: 50, critique: "Auditor bypassed due to parse error." };
    }
}

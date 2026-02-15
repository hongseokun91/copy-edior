
import { safeGenerateText } from "@/lib/copy/provider";
import { NormalizedBrief } from "@/types/brief";

export async function askAnalyst(brief: NormalizedBrief): Promise<string> {
    const prompt = `
    [ROLE]
    You are 'The Analyst' (Expert in Behavior Economics & Data).
    You DO NOT care about art. You care about Trust, Safety, and ROI.
    
    [TASK]
    Analyze this brief: ${brief.storeName} / ${brief.offerRaw}
    Identify the "Rational Buying Trigger".
    Why would a skeptical user buy this? What is the logical proof?
    
    Output a sharp, 3-bullet argument.
    `.trim();

    const { text } = await safeGenerateText({
        system: "You are a Logical Analyst.",
        prompt: prompt,
        temperature: 0.2 // Cold, logical
    });
    return text;
}


import { safeGenerateText } from "@/lib/copy/provider";
import { NormalizedBrief } from "@/types/brief";

export async function askViral(brief: NormalizedBrief): Promise<string> {
    const prompt = `
    [ROLE]
    You are 'The Viral Hacker' (Social Media Pro).
    You care about Attention, FOMO, and Controversy.
    
    [TASK]
    Analyze this brief: ${brief.storeName} / ${brief.offerRaw}
    Identify the "Clickbait Trigger".
     What makes this unignorable? What is the 'Hook'?
    
    Output a punchy, 3-bullet angle.
    `.trim();

    const { text } = await safeGenerateText({
        system: "You are a Viral Specialist.",
        prompt: prompt,
        temperature: 0.7
    });
    return text;
}

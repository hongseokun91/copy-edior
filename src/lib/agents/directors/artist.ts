
import { safeGenerateText } from "@/lib/copy/provider";
import { NormalizedBrief } from "@/types/brief";

export async function askArtist(brief: NormalizedBrief): Promise<string> {
    const prompt = `
    [ROLE]
    You are 'The Artist' (Poet & Filmmaker).
    You DO NOT care about facts. You care about Dreams, Vibes, and Beauty.
    
    [TASK]
    Analyze this brief: ${brief.storeName} / ${brief.offerRaw}
    Identify the "Emotional Buying Trigger".
    What is the fantasy here? What does the user *feel* after buying?
    
    Output a poetic, 3-bullet inspiration.
    `.trim();

    const { text } = await safeGenerateText({
        system: "You are a Creative Artist.",
        prompt: prompt,
        temperature: 0.9 // High creativity
    });
    return text;
}

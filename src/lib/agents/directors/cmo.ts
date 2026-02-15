
import { safeGenerateText } from "@/lib/copy/provider";
import { NormalizedBrief } from "@/types/brief";
import { askAnalyst } from "./analyst";
import { askArtist } from "./artist";
import { askViral } from "./viral";

export interface StrategyMemo {
    finalDirection: string;
    transcript: string; // The debate log
}

export async function runWarRoom(brief: NormalizedBrief): Promise<StrategyMemo> {
    // 1. Parallel Debate
    const [analyst, artist, viral] = await Promise.all([
        askAnalyst(brief),
        askArtist(brief),
        askViral(brief)
    ]);

    // 2. CMO Synthesis
    const prompt = `
    [ROLE]
    You are the CMO (Chief Marketing Officer).
    You have listened to your team propose 3 directions.
    
    [TEAM INPUTS]
    - ANALYST (Logic): ${analyst}
    - ARTIST (Emotion): ${artist}
    - VIRAL (Impact): ${viral}
    
    [DECISION]
    Synthesize these into ONE "Winning Strategy".
    - Pick the strongest specific angle.
    - Merge the best lines.
    - Discard weak ideas.
    
    Output a "Creative Direction Memo" (Markdown).
    `.trim();

    const { text } = await safeGenerateText({
        system: "You are the Chief Marketing Officer.",
        prompt: prompt,
        temperature: 0.5
    });

    const transcript = `
    [WAR ROOM TRANSCRIPT]
    > ANALYST: ${analyst}
    > ARTIST: ${artist}
    > VIRAL: ${viral}
    -------------------
    > CMO DECISION: ${text}
    `.trim();

    return {
        finalDirection: text,
        transcript: transcript
    };
}

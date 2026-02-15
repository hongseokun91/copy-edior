import type { PosterMeta } from "@/types/poster";
import { CHAR_BUDGETS } from "./charbudgets.registry";
import { FORBIDDEN_PHRASES_COMMON, FORBIDDEN_PHRASES_STRICT_EXTRA } from "./forbidden.registry";

export const POSTER_SYSTEM_PROMPT = `
You are the Chief Copywriter at a top Korean marketing agency.
ALWAYS output in KOREAN.
Never invent facts. If missing, ask via structured "needs" field.
Never use "..." ellipsis. No placeholders.
Output strictly JSON only. Do not add any commentary.
`.trim();

export function buildHeadlinePrompt(args: {
    meta: PosterMeta;
    brief: string;
    answers: Record<string, any>;
}) {
    const budget = CHAR_BUDGETS[args.meta.channelPack][args.meta.densityProfile];
    const forbidden = [
        ...FORBIDDEN_PHRASES_COMMON,
        ...(args.meta.claimPolicyMode === "strict" ? FORBIDDEN_PHRASES_STRICT_EXTRA : []),
    ];

    return `
[GOAL]
Generate headline candidates for a poster. Provide 3 sets (A,B,C), each 7 items, total 21.
Respect headline max length: ${budget.headlineMax} chars in Korean (hard limit).
Each candidate must include: text, typeHint, badges(length/densityFit/tone/risk).

[INPUT]
intentId: ${args.meta.intentId}
headlineType(default): ${args.meta.headlineType}
channelPack: ${args.meta.channelPack}
densityProfile: ${args.meta.densityProfile}
claimPolicyMode: ${args.meta.claimPolicyMode}
brief: ${args.brief}
answers: ${JSON.stringify(args.answers)}

[FORBIDDEN_PHRASES]
${JSON.stringify(forbidden)}

[OUTPUT JSON SCHEMA]
{
  "setA": [{ "text":"", "typeHint":"HL_*", "badges": { "length":"short|medium|long", "densityFit":"DENSITY_*", "tone":"friendly|premium|official|tech|investor", "risk":"low|medium|high" }, "score": 0 }],
  "setB": [...7],
  "setC": [...7]
}

[SET DEFINITIONS]
- setA: Benefit Direct (혜택/조건이 선명)
- setB: Curiosity Hook (상황/질문/대조)
- setC: Authority/Premium (공식/신뢰/프리미엄)
`.trim();
}

export function buildPosterBodyPrompt(args: {
    meta: PosterMeta;
    brief: string;
    blueprint: { requiredSlots: string[]; recommendedSlots: string[]; slotOrder: string[] };
    selectedHeadline: string;
    answers: Record<string, any>;
}) {
    const budget = CHAR_BUDGETS[args.meta.channelPack][args.meta.densityProfile];
    const forbidden = [
        ...FORBIDDEN_PHRASES_COMMON,
        ...(args.meta.claimPolicyMode === "strict" ? FORBIDDEN_PHRASES_STRICT_EXTRA : []),
    ];

    return `
[GOAL]
Generate poster copy by slots. Must look like a real poster.
Respect density/channel constraints:
- headlineMax: ${budget.headlineMax}
- subheadMax: ${budget.subheadMax}
- blockCharsMax: ${budget.blockCharsMax}
Never invent facts. If required slot is missing data, add it to "needs".

[INPUT]
meta: ${JSON.stringify(args.meta)}
brief: ${args.brief}
selectedHeadline: ${args.selectedHeadline}
blueprint: ${JSON.stringify(args.blueprint)}
answers: ${JSON.stringify(args.answers)}

[FORBIDDEN_PHRASES]
${JSON.stringify(forbidden)}

[OUTPUT JSON]
{
  "needs": ["..."],
  "content": {
     "S_HEADLINE": "...",
     "S_SUBHEAD": "...",
     "S_OFFER_MAIN": "...",
     ...
  },
  "compliance": {
     "warnings": ["..."],
     "requiredDisclaimers": ["..."]
  }
}
`.trim();
}

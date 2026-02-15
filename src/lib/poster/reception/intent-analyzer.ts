import { PosterIntentId } from "@/types/poster";
import { INTENT_SIGNALS } from "./signals.registry";
import { POSTER_INTENTS } from "../intents";

export type IntentAnalysisResult = {
    primaryIntent: PosterIntentId;
    secondaryIntent?: PosterIntentId;
    scores: Record<PosterIntentId, number>;
    debugTrace: string[];
};

export class IntentAnalyzer {
    private signals = INTENT_SIGNALS;

    public analyze(brief: string): IntentAnalysisResult {
        const scores: Record<PosterIntentId, number> = {
            "INT_PROMO_OFFER": 0,
            "INT_PRODUCT_LAUNCH": 0,
            "INT_EVENT_GUIDE": 0,
            "INT_RECRUITING": 0,
            "INT_PUBLIC_NOTICE": 0,
            "INT_BRAND_CAMPAIGN": 0,
            "INT_B2B_SEMINAR": 0
        };

        const debugTrace: string[] = [];

        // 1. Base Scores (Default Bias)
        // Promo is the most common, so give it a tiny nudge? Or keep flat.
        // Let's keep flat 0 to be purely signal driven for now.

        // 2. Signal Matching
        for (const signal of this.signals) {
            if (signal.pattern.test(brief)) {
                debugTrace.push(`[MATCH] ${signal.id}`);

                Object.entries(signal.weights).forEach(([intent, weight]) => {
                    const intentId = intent as PosterIntentId;
                    scores[intentId] += weight;
                    debugTrace.push(`  -> ${intentId}: ${weight > 0 ? '+' : ''}${weight} (Total: ${scores[intentId]})`);
                });
            }
        }

        // 3. Find Winner
        const sortedIntents = Object.entries(scores)
            .sort(([, scoreA], [, scoreB]) => scoreB - scoreA) as [PosterIntentId, number][];

        const topIntent = sortedIntents[0];
        const secondIntent = sortedIntents[1];

        const primaryIntent = topIntent[1] > 0 ? topIntent[0] : "INT_PROMO_OFFER"; // Fallback to Promo if 0 score

        return {
            primaryIntent,
            secondaryIntent: secondIntent[1] > 0 ? secondIntent[0] : undefined,
            scores,
            debugTrace
        };
    }
}

export const intentAnalyzer = new IntentAnalyzer();

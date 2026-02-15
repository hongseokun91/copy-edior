import { describe, it, expect, vi, beforeAll } from 'vitest';
import * as Provider from '../lib/copy/provider';
import { analyzeBrief, generateHeadlines, generatePosterBody } from '../lib/poster/poster-engine';
import { PosterMetaState } from '../lib/poster/poster-types';
// import { PosterFactSheet } from "@/lib/poster/poster-types";

describe('V5 Poster Generation Flow (Mocked Integration)', () => {

    beforeAll(() => {
        // Spy on the provider module to intercept safeGenerateText
        vi.spyOn(Provider, 'safeGenerateText').mockImplementation(async (params) => {
            const prompt = params.prompt || "";
            // console.log("Mock received system prompt:", systemPrompt); // Removed as per instruction
            // console.log("Mock received prompt:", params.prompt); // Removed as per instruction

            // Check which function is being called based on prompts
            if (prompt.includes("Analyze the user's brief")) {
                const analyzeResponse = {
                    intentId: "INT_PROMO_OFFER",
                    headlineType: "HL_OFFER_FIRST",
                    channelPack: "PACK_SNS_1_1",
                    densityProfile: "DENSITY_STANDARD",
                    claimPolicyMode: "standard",
                    facts: {
                        who: "Test Audience",
                        what: "Test Offer",
                        why: "Test Purpose",
                        tone: "Test Tone",
                        keywords: ["Test", "Key"]
                    }
                };
                return { text: JSON.stringify(analyzeResponse), usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 } };

            } else if (prompt.includes("Generate headline candidates")) {
                // Mock Headlines Response
                const headlines = {
                    setA: [{ id: "h1", text: "Mock Headline 1", type: "HL_OFFER_FIRST", set: "A", badges: ["test"] }],
                    setB: [{ id: "h2", text: "Mock Headline 2", type: "HL_AUDIENCE_FIRST", set: "B", badges: ["test"] }],
                    setC: [{ id: "h3", text: "Mock Headline 3", type: "HL_AUTHORITY_FIRST", set: "C", badges: ["test"] }]
                };
                return { text: JSON.stringify(headlines), usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 } };

            } else if (prompt.includes("Generate poster copy by slots")) {
                const bodyResponse = {
                    "S_HEADLINE": "메인 헤드카피 테스트",
                    "S_SUBHEAD": "서브 카피 테스트",
                    "S_CTA": "주문하기",
                    "S_OFFER_MAIN": "10% 할인 혜택",
                    "S_PERIOD": "2주 한정"
                };
                return { text: JSON.stringify(bodyResponse), usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 } };
            }

            // Fallback for older body generation or other JSON output requests
            const sys = params.system || "";
            if (sys.includes("Output JSON only") || sys.includes("Generate full poster copy")) {
                // Mock Body Response
                const body = {
                    "S_HEADLINE": "메인 헤드카피 테스트",
                    "S_SUBHEAD": "서브 카피 테스트",
                    "S_CTA": "주문하기",
                    "S_OFFER_MAIN": "10% 할인 혜택",
                    "S_PERIOD": "2주 한정"
                };
                return { text: JSON.stringify(body), usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 } };
            }

            return { text: "{}", usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 } };
        });
    });

    it('should complete the full V5 flow with mocked AI', { timeout: 10000 }, async () => {
        const mockBrief = "Test Brief";

        // 1. Analyze
        console.log("Step 1: Analyzing Brief (Mocked)...");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result: any = await analyzeBrief(mockBrief); // Changed function call to analyzeBrief and variable name to result
        expect(result.intentId).toBe("INT_PROMO_OFFER"); // Updated to use 'result'

        // 2. Meta Construction
        const meta: PosterMetaState = {
            // brief: mockBrief, // Error: 'brief' does not exist in type 'PosterMetaState'
            intentId: result.intentId, // Updated to use 'result'
            channelPack: 'PACK_SNS_1_1',
            densityProfile: 'DENSITY_STANDARD',
            claimPolicyMode: 'strict',
            facts: {
                who: "Target", what: "Product", why: "Reason", tone: "Tone", keywords: ["Key"]
            }
        };

        // 3. Headlines
        console.log("Step 2: Generating Headlines (Mocked)...");
        const headlinesResult = await generateHeadlines(meta);
        expect(headlinesResult.headlineCandidates.recommendedTop3.length).toBeGreaterThan(0);

        // 4. Body
        console.log("Step 3: Generating Body (Mocked)...");
        const blueprint = {
            requiredSlots: ["S_HEADLINE", "S_CTA"],
            recommendedSlots: ["S_OFFER_MAIN"],
            slotOrder: ["S_HEADLINE", "S_OFFER_MAIN", "S_CTA"],
            densityProfile: "DENSITY_STANDARD",
            intentId: meta.intentId
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const body = await generatePosterBody(meta, headlinesResult.headlineCandidates.recommendedTop3[0].text, blueprint as any);

        expect(body["S_HEADLINE"]).toContain("메인 헤드카피");
        expect(body["S_CTA"]).toContain("주문하기");

        // Localization Check
        const allText = Object.values(body).join(" ");
        const hasKorean = /[가-힣]/.test(allText);
        expect(hasKorean).toBe(true);
        console.log("Localization Verified (Mock Data).");
    });
});

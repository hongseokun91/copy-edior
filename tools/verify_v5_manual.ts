
import fs from 'fs';
import path from 'path';
import { analyzeBrief } from "../src/lib/poster/poster-engine";

// Load .env.local or .env manually since we are running outside Next.js
const loadEnv = () => {
    const envFiles = ['.env.local', '.env'];
    for (const file of envFiles) {
        const envPath = path.join(process.cwd(), file);
        if (fs.existsSync(envPath)) {
            console.log(`Loading env from ${file}`);
            const content = fs.readFileSync(envPath, 'utf-8');
            content.split('\n').forEach(line => {
                const [key, ...values] = line.split('=');
                if (key && values.length > 0) {
                    const val = values.join('=').trim().replace(/^["']|["']$/g, '');
                    if (!process.env[key.trim()]) {
                        process.env[key.trim()] = val;
                    }
                }
            });
        }
    }
};
loadEnv();

import { generateHeadlines } from "../src/lib/poster/poster-engine";
import { generatePosterBody } from "../src/lib/poster/poster-engine";
import { PosterMetaState } from "../src/lib/poster/poster-types";
import { DENSITY_PROFILES } from "../src/lib/poster/poster-constants";

async function runV5Verification() {
    console.log("🚀 Starting V5 Manual Verification Flow...");

    // 1. Simulation of User Input (Phase 1: Structured Input)
    const mockBrief = "강남역 5분 거리, 직장인 대상 프리미엄 점심 도시락 런칭. 10% 할인가 9,900원. 기간한정 2주간.";

    console.log(`\n[Step 1] Analyzing Brief: "${mockBrief}"`);
    const analysis = await analyzeBrief(mockBrief);

    if (!analysis.intentId || !analysis.recommendedChannel) {
        throw new Error("❌ Analysis failed: Missing intent or channel");
    }
    console.log(`✅ Intent Detected: ${analysis.intentId}`);
    console.log(`✅ Channel Recommended: ${analysis.recommendedChannel}`);
    console.log(`✅ Density Recommended: ${analysis.recommendedDensity}`);

    // 2. Simulate User Confirming Meta (Phase 2: Creative Angle)
    // User selects "DENSITY_STANDARD" (or uses recommendation)
    const meta: PosterMetaState = {
        step: "confirm_meta",
        brief: mockBrief,
        intentId: analysis.intentId,
        channelPack: "PACK_SNS_1_1", // Force selection for consistent test
        densityProfile: "DENSITY_STANDARD", // V5 Feature check
        facts: {
            who: "강남역 직장인",
            what: "프리미엄 점심 도시락 런칭",
            why: "신규 오픈 홍보",
            keywords: ["10%할인", "9900원", "맛집", "2주간 기간한정", "강남역 5분 거리"],
            tone: "고급스러운, 든든한"
        },
        claimPolicyMode: "strict" // Default
    };

    // 3. Generate Headlines
    console.log(`\n[Step 2] Generating Headlines...`);
    const headlines = await generateHeadlines(meta);
    if (!headlines || headlines.length === 0) {
        throw new Error("❌ Headline generation failed");
    }
    console.log(`✅ Generated ${headlines.length} headlines`);
    console.log(`   Sample: "${headlines[0].text}"`);

    // 4. Generate Poster Body (Phase 2 & Density Logic)
    console.log(`\n[Step 3] Generating Poster Body (Standard Density)...`);
    const selectedHeadline = headlines[0].text;
    const blueprint = {
        requiredSlots: ["S_HEADLINE", "S_CTA"],
        recommendedSlots: ["S_OFFER_MAIN", "S_PERIOD"],
        slotOrder: ["S_HEADLINE", "S_OFFER_MAIN", "S_CTA"],
        densityProfile: "DENSITY_STANDARD"
    };

    const body = await generatePosterBody(meta, selectedHeadline, blueprint);

    // 5. Verification of Output Quality & Structure
    console.log(`\n[Step 4] Verifying Output Structure...`);

    if (!body["S_HEADLINE"]) throw new Error("❌ Missing S_HEADLINE");
    const headlineContent = body["S_HEADLINE"];
    if (headlineContent !== selectedHeadline && !headlineContent.includes(selectedHeadline)) {
        console.warn("⚠️ Headline mismatch warning (AI might have refined it):", headlineContent, "vs", selectedHeadline);
    }

    // Check for Korean Localization in specific keys if they exist logic
    // Actually the keys are S_..., the values should be Korean.
    // We can't easily check for "Korean Keys" here since the keys are fixed IDs.
    // But we can check if the VALUES are Korean.
    const hasKorean = /[가-힣]/.test(Object.values(body).join(""));
    if (!hasKorean) {
        throw new Error("❌ Output seems to lack Korean characters");
    }
    console.log("✅ Output contains Korean characters");

    // Check JSON button removal? (Cannot check UI code here, verified in manual steps previously)

    console.log("\n✨ V5 Verification Successful! The Engine is producing valid structured content.");
    console.log("----------------------------------------------------------------");
    console.log(JSON.stringify(body, null, 2));
}

runV5Verification().catch(e => {
    console.error("\n❌ V5 Verification Failed:", e);
    process.exit(1);
});

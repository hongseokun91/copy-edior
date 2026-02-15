
import { calculateJaccardSimilarity } from "../src/lib/copy/similarity";
import { scoreContent } from "../src/lib/copy/scoring";

async function verify() {
    console.log("Verifying Jaccard & Scoring (Phase 2)...");

    const t1 = "맛있는 커피 한 잔";
    const t2 = "맛있는 커피 두 잔"; // High Sim
    const t3 = "전혀 다른 문구입니다"; // Low Sim

    const s1 = calculateJaccardSimilarity(t1, t2);
    const s2 = calculateJaccardSimilarity(t1, t3);

    console.log(`Sim(t1, t2): ${s1.toFixed(2)} (Expected > 0.5)`);
    console.log(`Sim(t1, t3): ${s2.toFixed(2)} (Expected < 0.2)`);

    if (s1 < 0.5 || s2 > 0.2) {
        console.error("FAIL: Similarity threshold mismatch");
        process.exit(1);
    }

    // Test Scoring
    const content = {
        headline: "아주 긴 헤드라인을 사용하여 점수가 깎일 것입니다 아마도", // > 25 chars
        subhead: "서브헤드는 적당히",
        bullets: ["혜택1", "혜택2", "혜택3"],
        cta: "지금 예약하세요", // Good CTA
        info: "정보",
        disclaimer: "",
        meta: { frame: 'A' as const, whyThisWorks: "", qualityScore: 0 }
    };

    const score = scoreContent(content);
    console.log("Score Result:", JSON.stringify(score, null, 2));

    // Check if reasons contain expected values
    if (!score.reasons.some(r => r.includes("Headline Too Long")) ||
        !score.reasons.some(r => r.includes("Action-Oriented"))) {
        console.error("FAIL: Scoring heuristic mismatch");
        process.exit(1);
    }

    console.log("SUCCESS: Phase 2 Logic Verified");
}

verify();

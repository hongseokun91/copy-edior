
import { generateAndRefine } from "../src/lib/copy/engine";
import { FlyerInputs } from "../src/types/flyer";
import fs from "fs";
import path from "path";

const GOLDEN_CASES = [
    { cat: "식당/카페", tone: "friendly", name: "엄마손맛집", offer: "음료수 서비스", goal: "단골 유치" },
    { cat: "뷰티/헬스", tone: "premium", name: "럭셔리헤어", offer: "첫방문 30%", goal: "신규 모집" },
    { cat: "학원/교육", tone: "direct", name: "서울대수학", offer: "무료 레벨테스트", goal: "원생 모집" },
    { cat: "부동산", tone: "premium", name: "성실공인", offer: "중개수수료 할인", goal: "매물 접수" },
    { cat: "쇼핑몰", tone: "friendly", name: "데일리룩", offer: "전상품 무료배송", goal: "매출 증대" },
    { cat: "행사", tone: "direct", name: "지역축제", offer: "선착순 입장", goal: "참가 유도" },
    { cat: "기업", tone: "premium", name: "테크솔루션", offer: "무료 컨설팅", goal: "B2B 영업" },
    { cat: "기타", tone: "friendly", name: "동네세탁소", offer: "이불빨래 1+1", goal: "홍보" },
    { cat: "식당/카페", tone: "direct", name: "불타는곱창", offer: "소주 1병 공짜", goal: "회식 유치" },
    { cat: "뷰티/헬스", tone: "friendly", name: "튼튼헬스", offer: "PT 1회 무료", goal: "회원권 판매" },
] as const;

async function run() {
    console.log("Running V2 Golden Test (ANTIGRAVITY Trace check)...");
    const results = [];
    let failureCount = 0;

    for (const t of GOLDEN_CASES) {
        const inputs: FlyerInputs = {
            category: t.cat,
            name: t.name,
            offer: t.offer,
            goal: t.goal,
            period: "기간한정",
            contactType: "phone",
            contactValue: "010-0000-0000"
        };

        console.log(`Testing ${t.name}...`);

        const variants: Record<string, any> = {};
        let errors = [];

        for (const frame of ['A', 'B', 'C'] as const) {
            try {
                const res = await generateAndRefine(t.cat, t.tone as any, inputs, frame);

                // QA Check (Standard)
                if (res.HEADLINE.includes("...")) errors.push(`[${frame}] Contains ellipsis`);
                if (res.meta.score < 60) errors.push(`[${frame}] Low Score: ${res.meta.score}`);

                // ANTIGRAVITY Check (R1 Traceability)
                // Check if undefined, allowing 0 or empty string if logic permits (though hash usually shouldn't be empty)
                if (res.meta.promptHash === undefined) errors.push(`[${frame}] Missing promptHash (Spec R1)`);
                if (res.meta.promptChars === undefined) errors.push(`[${frame}] Missing promptChars (Spec R1)`);

                variants[frame] = res;
            } catch (e: any) {
                console.error(`Error in ${t.name} (${frame}):`, e.message);
                errors.push(`[${frame}] Exception: ${e.message}`);
            }
        }

        // P3: Diversity Check
        const texts = ['A', 'B', 'C'].map(f => {
            const v = variants[f];
            if (!v) return "";
            return (v.HEADLINE + " " + v.SUBHEAD).trim();
        });

        // Calculate max similarity overlap
        const fromSimilarity = await import("../src/lib/content-engine/similarity");
        const maxSim = fromSimilarity.calculateMaxSimilarity(texts);
        console.log(`[${t.name}] Max Similarity: ${(maxSim * 100).toFixed(1)}%`);

        if (maxSim > 0.6) {
            errors.push(`[ALL] Low Diversity: ${(maxSim * 100).toFixed(1)}% (Threshold 60%)`);
        }

        if (errors.length > 0) failureCount++;

        results.push({
            input: t,
            variants,
            errors,
            diversity: { maxSimilarity: maxSim }
        });
    }

    const outPath = path.join(process.cwd(), "V2_Golden_Test_Report.json");
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2));

    console.log(`Test Complete. Failures: ${failureCount}/10`);
    if (failureCount > 0) {
        console.error("GOLDEN TEST FAILED (See Report)");
        process.exit(1);
    } else {
        console.log("ANTIGRAVITY VERIFIED: ALL GREEN");
    }
}

run();

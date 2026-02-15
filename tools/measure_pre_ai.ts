
// tools/measure_pre_ai.ts
// Measure the "Before AI" state using the current Deterministic Pipeline
// Imports use relative paths to avoid alias issues in standalone script

import { generateByTemplate } from "../src/lib/templates/patterns";
import { applyStyleRules } from "../src/lib/content-engine/style";
import { enhanceExpression } from "../src/lib/content-engine/expression";
import { fixContent } from "../src/lib/content-engine/fixer";
import { FlyerInputs, FlyerTone } from "../src/types/flyer";

const TEST_CASES: Array<{ cat: string, tone: FlyerTone, inputs: FlyerInputs }> = [
    {
        cat: "식당", tone: "friendly",
        inputs: { category: "식당", name: "엄마손맛집", offer: "음료수 서비스", contactValue: "010-1234-5678", goal: "단골 유치", period: "상시", location: "서울", hours: "10-22", features: "집밥 느낌" }
    },
    {
        cat: "뷰티", tone: "premium",
        inputs: { category: "뷰티", name: "엘레강스헤어", offer: "펌 20% 할인", contactValue: "02-555-5555", goal: "신규 고객", period: "2월 말까지", location: "강남", hours: "10-20", features: "청담동 출신" }
    },
    {
        cat: "학원", tone: "direct",
        inputs: { category: "학원", name: "스카이수학", offer: "무료 레벨테스트", contactValue: "010-9876-5432", goal: "원생 모집", period: "이번주", location: "대치", hours: "14-22", features: "소수 정예" }
    },
    // ... Add more if needed, 3 represents the diversity well
];

async function runBaseline() {
    console.log("Running Pre-AI Baseline Config...\n");
    const startService = performance.now();

    for (const test of TEST_CASES) {
        const start = performance.now();

        // Full Deterministic Pipeline Simulation
        // 1. Generate Raw (A/B/C)
        const rawA = generateByTemplate(test.cat, test.tone, test.inputs, 'A');
        const rawB = generateByTemplate(test.cat, test.tone, test.inputs, 'B');
        const rawC = generateByTemplate(test.cat, test.tone, test.inputs, 'C');

        // 2. Fixer
        const fixedA = fixContent(rawA);
        const fixedB = fixContent(rawB);
        const fixedC = fixContent(rawC);

        // 3. Style
        const styledA = applyStyleRules(fixedA, test.tone);
        const styledB = applyStyleRules(fixedB, test.tone);
        const styledC = applyStyleRules(fixedC, test.tone);

        // 4. Expression
        const finalA = enhanceExpression(styledA as any, test.cat);
        const finalB = enhanceExpression(styledB as any, test.cat);
        const finalC = enhanceExpression(styledC as any, test.cat);

        const end = performance.now();

        console.log(`[${test.cat} - ${test.tone}] Latency: ${(end - start).toFixed(2)}ms`);
        console.log(`  A: ${finalA.HEADLINE}`);
        console.log(`  B: ${finalB.HEADLINE}`);
        console.log(`  C: ${finalC.HEADLINE}`);
        console.log(`  Diff: ${finalA.HEADLINE !== finalB.HEADLINE ? "OK" : "FAIL"}\n`);
    }

    const endService = performance.now();
    console.log(`Total Baseline Time: ${(endService - startService).toFixed(2)}ms`);
}

runBaseline();

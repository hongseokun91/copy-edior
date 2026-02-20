
// tools/verify_ai_pipeline.ts
import { generateAndRefine } from "../src/lib/copy/engine";
import { FlyerInputs } from "../src/types/flyer";

const TEST_CASE = {
    cat: "식당", tone: "friendly" as const,
    inputs: {
        category: "식당", name: "엄마손맛집", offer: "음료수 서비스",
        contactType: "phone" as const, contactValue: "010-1234-5678",
        goal: "단골 유치", period: "상시", location: "서울", hours: "10-22",
        usp: "집밥 느낌", target: "직장인", convenience: "주차 가능",
        disclaimerHint: "테이블당 1개"
    }
};

async function run() {
    console.log("Verifying AI Pipeline (engine.ts)...");

    // Test A Frame
    try {
        const result = await generateAndRefine(
            TEST_CASE.cat,
            TEST_CASE.tone,
            TEST_CASE.inputs,
            'A'
        );
        console.log("Generate Result (A):", JSON.stringify(result, null, 2));

        if (!result.variants?.A?.HEADLINE || !result.variants?.A?.SUBHEAD) {
            console.error("FAIL: Missing Keys in Output");
            process.exit(1);
        }
        console.log("SUCCESS: Output Schema Valid");
    } catch (e: any) {
        const fs = require('fs');
        fs.writeFileSync('verification_error.log', `FAIL: Generation Error\n${e.message}\n${e.stack}`);
        console.error("FAIL: Generation Error", e);
        process.exit(1);
    }
}

run();

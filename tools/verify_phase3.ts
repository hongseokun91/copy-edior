import { refineTone } from "../src/lib/content-engine/style";
import { FlyerTone } from "../src/types/flyer";

console.log("Running Phase 3 Verification: Style Rules...");

const testCases: { text: string; tone: FlyerTone; expected: string }[] = [
    { text: "꼭 방문하십시오", tone: "friendly", expected: "꼭 방문해보세요" }, // 하십시오 -> 해보세요
    { text: "지금 시작합니다", tone: "friendly", expected: "지금 시작해요" },     // 합니다 -> 해요
    { text: "이거 해봐", tone: "premium", expected: "이거 제안합니다" },        // 해봐 -> 제안합니다
    { text: "그냥 와", tone: "direct", expected: "그냥 와" }                  // No change expected
];

let passCount = 0;

testCases.forEach((test, index) => {
    const result = refineTone(test.text, test.tone);
    // Remove spaces for comparison to avoid minor formatting issues, though logic seems strict
    // simple equality check
    const passed = result === test.expected;
    console.log(`Test ${index + 1} (${test.tone}): "${test.text}" -> "${result}" [${passed ? 'PASS' : 'FAIL'}]`);
    if (passed) passCount++;
});

if (passCount === testCases.length) {
    console.log("\n✅ Phase 3 Verification (Unit Test) PASSED");
    process.exit(0);
} else {
    console.log("\n❌ Phase 3 Verification FAILED");
    process.exit(1);
}

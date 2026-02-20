
import { intentAnalyzer } from "../src/lib/poster/reception/intent-analyzer";
import { PosterIntentId } from "../src/types/poster";

const TEST_CASES: { text: string; expected: PosterIntentId }[] = [
    { text: "여름 맞이 50% 할인 행사", expected: "INT_PROMO_OFFER" },
    { text: "신메뉴 출시 기념 시식회", expected: "INT_PRODUCT_LAUNCH" },
    { text: "제10회 세계 고양이 박람회", expected: "INT_EVENT_GUIDE" },
    { text: "주말 아르바이트 모집합니다", expected: "INT_RECRUITING" },
    { text: "추석 연휴 휴무 안내", expected: "INT_PUBLIC_NOTICE" },
    { text: "2024 마케팅 트렌드 컨퍼런스", expected: "INT_B2B_SEMINAR" },
    // Ambiguous / Complex
    { text: "오픈 기념 전품목 20% 세일", expected: "INT_PRODUCT_LAUNCH" }, // Launch context usually overrides simple promo
    { text: "정부 지원 사업 설명회", expected: "INT_B2B_SEMINAR" },  // "설명회" -> Seminar/Conference
];

const fs = require('fs');
const logBuffer: string[] = [];
function log(msg: string) {
    console.log(msg);
    logBuffer.push(msg);
}

log("Running Intent Analysis Verification...");
let passCount = 0;

TEST_CASES.forEach(({ text, expected }) => {
    const result = intentAnalyzer.analyze(text);
    const isMatch = result.primaryIntent === expected;

    if (isMatch) passCount++;

    log(`[${isMatch ? 'PASS' : 'FAIL'}] "${text}"`);
    log(`  -> Detected: ${result.primaryIntent}`);
    if (!isMatch) {
        log(`  -> Expected: ${expected}`);
        log(`  -> Scores: ${JSON.stringify(result.scores)}`);
        log(`  -> Trace: ${JSON.stringify(result.debugTrace)}`);
    }
    log("---");
});

log(`Total: ${passCount} / ${TEST_CASES.length} Passed`);
fs.writeFileSync('debug_intent.log', logBuffer.join('\n'));

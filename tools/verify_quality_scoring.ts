
import { QualityEngine } from "../src/lib/quality/engine";

const SCENARIOS = [
    {
        name: "[Good] Basic Promo",
        text: "이번 여름, 특별한 경험을 선물하세요. 산뜻한 기분 전환을 위한 썸머 패키지입니다.",
        expectPass: true,
        expectLowScore: false
    },
    {
        name: "[Bad] Overclaim (100% Guarantee)",
        text: "무조건 100% 효과 보장합니다. 부작용 절대 없습니다.",
        expectPass: false,
        expectLowScore: true
    },
    {
        name: "[Bad] Rank Claim (No.1)",
        text: "최고의 서비스와 넓은 주차장을 보유한 국내 최초 맛집, 업계 1위 보장.",
        expectPass: false, // Update: Should Hard Fail
        expectLowScore: true
    },
    {
        name: "[Good] Informative Notice",
        text: "매장 내부 공사로 인한 임시 휴무 안내드립니다. 8월 15일부터 정상 영업합니다.",
        expectPass: true,
        expectLowScore: false
    }
];

// New: Check if intent matters
const INTENT_CHECK = {
    text: "대박 기회! 지금 바로 들어오세요! 미친 특가!",
    intents: ["INT_PROMO_OFFER", "INT_PUBLIC_NOTICE"]
};

const fs = require('fs');
const logBuffer: string[] = [];
function log(msg: string) {
    console.log(msg);
    logBuffer.push(msg);
}

log("Running Quality Scoring Verification...");
let fails = 0;

SCENARIOS.forEach(({ name, text, expectPass, expectLowScore }) => {
    // ... logic ...
    const result = QualityEngine.evaluate(text, "GENERAL");
    const passed = result.pass === expectPass;
    const scoreOk = expectLowScore ? result.totalScore < 80 : result.totalScore >= 80; // Fixed logic

    const status = (passed && scoreOk) ? "PASS" : "FAIL";
    if (status === "FAIL") fails++;

    log(`[${status}] ${name}`);
    log(`  -> Score: ${result.totalScore} (Pass: ${result.pass} / Expect: ${expectPass})`);
    log(`  -> HardFail: ${result.hardFail}`);
    log(`  -> Triggered: ${result.triggeredRuleIds.join(', ')}`);
    log(`  -> Text: "${text}"`);
    log("---");
});

log("--- Intent Awareness Check ---");
const scores: Record<string, number> = {};
INTENT_CHECK.intents.forEach(intent => {
    // Pass intent as 3rd arg
    const result = QualityEngine.evaluate(INTENT_CHECK.text, "GENERAL", intent);
    // NOTE: passing "GENERAL" because engine doesn't support intent yet. 
    // This confirms if we NEED to add support.

    log(`[${intent}] Score: ${result.totalScore}`);
    scores[intent] = result.totalScore;
});

if (scores[INTENT_CHECK.intents[0]] === scores[INTENT_CHECK.intents[1]]) {
    log("RESULT: Engine is NOT Intent-Aware (Same score for different intents).");
} else {
    log("RESULT: Engine IS Intent-Aware.");
}

if (fails === 0) {
    log("SUCCESS: All Scenarios Behaved as Expected.");
} else {
    log(`FAIL: ${fails} Scenarios Failed.`);
}

fs.writeFileSync('debug_quality.log', logBuffer.join('\n'));
if (fails > 0) process.exit(1);

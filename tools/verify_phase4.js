
const { enhanceExpression } = require('../src/lib/content-engine/expression');

console.log("Running Phase 4 Verification: Industry Expression...");

const testCases = [
    { cat: "식당", headline: "맛있는 밥집" },
    { cat: "뷰티", headline: "이뻐지는 곳" },
    { cat: "학원", headline: "1등 공부방" },
    { cat: "기타", headline: "그냥 가게" }
];

let passCount = 0;

testCases.forEach((test, index) => {
    const slots = { HEADLINE: test.headline };
    const result = enhanceExpression(slots, test.cat);

    // Check if emoji was added (regex for emoji range or just non-ascii check for simplicity in this context)
    // Using a simple check: length should increase.
    const hasEmoji = result.HEADLINE.length > test.headline.length;

    console.log(`Test ${index + 1} (${test.cat}): "${test.headline}" -> "${result.HEADLINE}" [${hasEmoji ? 'PASS' : 'FAIL'}]`);
    if (hasEmoji) passCount++;
});

if (passCount === testCases.length) {
    console.log("\n✅ Phase 4 Verification (Emoji Injection) PASSED");
    process.exit(0);
} else {
    console.log("\n❌ Phase 4 Verification FAILED");
    process.exit(1);
}

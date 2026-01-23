
const UNSAFE_PATTERNS = [
    /100% 보장/,
    /무이조건/,
    /수익 보장/,
    /질병 완치/,
];

function validateSafety(text) {
    for (const pattern of UNSAFE_PATTERNS) {
        if (pattern.test(text)) {
            return { safe: false, reason: "안전 정책 위반 표현이 포함되어 있습니다." };
        }
    }
    return { safe: true };
}

console.log("Testing '100% 보장':", validateSafety("100% 보장"));
console.log("Testing '무이조건':", validateSafety("무이조건"));
console.log("Testing 'Clean Text':", validateSafety("안녕하세요"));

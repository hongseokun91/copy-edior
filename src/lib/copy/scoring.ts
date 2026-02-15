
import { CopyContent } from "./schema";

export interface ScoringResult {
    score: number;
    reasons: string[];
    whyThisWorks: string; // Recommendation Reason
}

const POWER_WORDS = ["무료", "할인", "증정", "서비스", "한정", "즉시", "예약", "단독", "공식"];
const CLICHES = ["가족 같은", "최고의", "정성을 다하는", "아늑한", "환영합니다"];

export function scoreContent(content: CopyContent): ScoringResult {
    let formatScore = 40;
    let specificityScore = 0;
    let uniquenessScore = 20;
    let ctaScore = 0;
    const reasons: string[] = [];

    const fullText = `${content.headline} ${content.subhead} ${content.cta} ${content.bullets ? content.bullets.join(" ") : ""}`;

    // 1. FORMAT (Base 40)
    // Reduce if length violation
    if (content.headline.length > 25) { formatScore -= 10; reasons.push("Headline too long"); }
    if (content.subhead.length > 50) { formatScore -= 5; reasons.push("Subhead too long"); }
    // Reduce if "..." found (Validator catches this, but score reflects distinct quality)
    if (fullText.includes("...")) { formatScore -= 20; reasons.push("Avoid '...' ellipsis"); }

    // 2. SPECIFICITY (Max 30)
    // Check for Offer/Period-like digits
    if (/\d/.test(content.headline)) { specificityScore += 10; reasons.push("Numbers in Headline"); }
    if (/\d/.test(content.subhead)) { specificityScore += 10; reasons.push("Numbers in Subhead"); }
    // Check for concrete words
    const powerWordCount = POWER_WORDS.filter(pw => fullText.includes(pw)).length;
    if (powerWordCount > 0) {
        specificityScore += Math.min(powerWordCount * 5, 10);
        reasons.push("Power words used");
    }

    // 3. UNIQUENESS (Max 20)
    // Penalize Cliches
    let clicheCount = 0;
    CLICHES.forEach(cliche => {
        if (fullText.includes(cliche)) {
            uniquenessScore -= 10;
            clicheCount++;
            reasons.push(`Cliché detected: ${cliche}`);
        }
    });

    // 4. CTA (Max 10)
    if (content.cta.length < 20) {
        if (content.cta.match(/(하기|세요|시오|지금|바로|신청|예약)/)) {
            ctaScore += 10;
            reasons.push("Action-oriented CTA");
        } else {
            ctaScore += 5; // Partial
        }
    }

    let total = formatScore + specificityScore + uniquenessScore + ctaScore;
    total = Math.max(0, Math.min(100, total));

    // Generate 'Why This Works'
    let explanation = "Balances clarity and action.";
    const frame = content.meta?.frame as string;
    if (frame === 'A') explanation = "Optimized for information clarity using the 4U framework.";
    if (frame === 'B') explanation = "Uses emotional hooks (AIDA) to build brand desire.";
    if (frame === 'C') explanation = "Leverages urgency (PAS) to trigger immediate action.";

    return {
        score: total,
        reasons,
        whyThisWorks: explanation
    };
}

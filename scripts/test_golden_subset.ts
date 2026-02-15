
import { generateAndRefine } from "@/lib/copy/engine";
import { FlyerInputs } from "@/types/flyer";

const cases = [
    {
        id: "GOLDEN_01",
        name: "Cafe Open",
        inputs: {
            category: "restaurant_cafe",
            goal: "open",
            name: "Antigravity Coffee",
            offer: "아메리카노 1000원",
            period: "오픈 이벤트 기간 동안",
            contactType: "phone",
            contactValue: "010-1234-5678",
            additionalBrief: "주차 가능 강조"
        } as FlyerInputs
    },
    {
        id: "GOLDEN_02",
        name: "Restaurant Discount",
        inputs: {
            category: "restaurant_cafe",
            goal: "discount",
            name: "Tasty Burger",
            offer: "전메뉴 20% 할인",
            period: "이번 주말만",
            contactType: "kakao",
            contactValue: "TB1234",
            additionalBrief: "학생 할인 중복 가능, 단체석 완비"
        } as FlyerInputs
    }
];

async function runTests() {
    console.log("🚀 Starting Golden Subset Tests (v1.0 Compliance)...");

    for (const c of cases) {
        console.log(`\n--------------------------------------------------`);
        console.log(`[${c.id}] Testing: ${c.name}`);
        const start = Date.now();

        try {
            const result = await generateAndRefine(c.inputs.category, "default", c.inputs, "A");
            const duration = (Date.now() - start) / 1000;

            console.log(`✅ Completed in ${duration}s`);
            console.log(`[Recommended]: Frame ${result.recommendedFrame}`);
            console.log(`[Validation]: Warnings: ${result.meta.warnings.length}`);

            // Print Headlines to check diversity
            console.log(`A Headline: ${result.variants.A.HEADLINE}`);
            console.log(`B Headline: ${result.variants.B.HEADLINE}`);
            console.log(`C Headline: ${result.variants.C.HEADLINE}`);

            // Check MustInclude
            const mustIncludes = (c.inputs.additionalBrief || "").split(",").map(s => s.trim());
            console.log(`MustInclude Checks: [${mustIncludes.join(", ")}]`);

        } catch (e) {
            console.error(`❌ Failed:`, e);
        }
    }
}

runTests();

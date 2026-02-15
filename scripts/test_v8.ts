
import { generateAndRefine } from "@/lib/copy/engine";
import { FlyerInputs } from "@/types/flyer";

// Mock Inputs
const inputs: FlyerInputs = {
    category: "식당/카페",
    goal: "오픈",
    name: "지옥의 마라탕",
    offer: "소고기 100g 무료",
    period: "이번 주말까지",
    contactType: "phone",
    contactValue: "010-1234-5678",
    additionalBrief: "엄청나게 매운맛, 스트레스 해소, 눈물 콧물 쏙 빼는 맛"
};

async function runTest() {
    console.log("🔥 [System] Starting v8.0 Level 10 Pipeline...");
    const startTime = Date.now();

    try {
        const result = await generateAndRefine("식당/카페", "direct", inputs, "B");

        const duration = (Date.now() - startTime) / 1000;
        console.log(`✅ [System] Pipeline Completed in ${duration}s`);

        console.log("\n================ PIPELINE REPORT ================\n");
        console.log(result.meta.warRoomLogs);
        console.log("\n=================================================\n");

        console.log("FINAL HEADLINE:", result.HEADLINE);
    } catch (e) {
        console.error("❌ [System] Pipeline Failed:", e);
    }
}

runTest();


import { generateAndRefine } from "../src/lib/copy/engine";
import { FlyerInputs } from "../src/types/flyer";
import fs from "fs";
import path from "path";

async function run() {
    console.log("Running V3.1 Brief Verification...");

    // Case 1: With Brief
    const inputsWithBrief: FlyerInputs = {
        category: "식당",
        name: "테스트식당",
        offer: "오픈이벤트",
        goal: "홍보",
        period: "1주일",
        contactType: "phone",
        contactValue: "010-1234-5678",
        additionalBrief: "주중 런치타임 할인, 단체석 50석 완비" // Keywords: 런치타임, 단체석
    };

    console.log("Generating with Brief:", inputsWithBrief.additionalBrief);
    const res = await generateAndRefine("식당", "friendly", inputsWithBrief, "A");

    // Check Reflection
    const allText = JSON.stringify(res).replace(/\\u[0-9a-fA-F]{4}/g, ""); // simple cleaner
    const hasLunch = allText.includes("런치") || allText.includes("점심");
    const hasGroup = allText.includes("단체") || allText.includes("50석");

    console.log(`[CHECK] Reflected '런치/점심'? ${hasLunch}`);
    console.log(`[CHECK] Reflected '단체'? ${hasGroup}`);

    if (!hasLunch && !hasGroup) {
        console.error("FAILED to reflect additional brief keywords.");
    } else {
        console.log("PASSED Reflection Check.");
    }

    // Case 2: Prompt Hash Check (Traceability)
    const inputsNoBrief = { ...inputsWithBrief };
    delete inputsNoBrief.additionalBrief;

    const res2 = await generateAndRefine("식당", "friendly", inputsNoBrief, "A");

    if (res.meta.promptHash === res2.meta.promptHash) {
        console.error("FAILED Traceability: Prompt Hash identical despite different brief.");
    } else {
        console.log("PASSED Traceability: Distinct Hashes.");
    }
}

run();

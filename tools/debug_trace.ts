
import { generateAndRefine } from "../src/lib/copy/engine";

async function run() {
    console.log("Debugging Trace Logic...");
    try {
        const result = await generateAndRefine(
            "식당/카페",
            "friendly",
            {
                category: "식당/카페",
                name: "DebugShop",
                offer: "Free Drink",
                goal: "Test",
                period: "Today",
                contactType: "phone",
                contactValue: "010-1234-5678"
            },
            "A"
        );

        console.log("Reuslt Meta:", JSON.stringify(result.meta, null, 2));

        if (!result.meta.promptHash) console.error("FAIL: promptHash missing");
        else console.log("PASS: promptHash present");

    } catch (e) {
        console.error("Error:", e);
    }
}

run();

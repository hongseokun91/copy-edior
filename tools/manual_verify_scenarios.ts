
import { buildFramePrompt } from "../src/lib/copy/prompts";
import { normalizeInput } from "../src/lib/copy/normalize";
import { generateAndRefine } from "../src/lib/copy/engine";
import { FlyerInputs } from "../src/types/flyer";
import { FLAGS } from "../src/lib/flags";

// Mock Input with Extra Modules
const inputWithModules: FlyerInputs = {
    category: "restaurant",
    brandSubject: "Modern Dining",
    styleId: "modern",

    name: "Test Bistro",
    goal: "promotion",
    targetAudience: "Couples",
    coreBenefit: "Romantic Atmosphere",
    offer: "Free Wine",
    contactType: "phone",
    contactValue: "010-1234-5678",
    period: "This Weekend",
    additionalBrief: "Must include: Romantic, Wine",

    selectedModules: ["주차 가능", "발렛 파킹", "키즈존"],
    extraNotes: "Make sure to mention parking."
};


import * as fs from 'fs';

const LOG_FILE = "verify_manual_log.txt";

function log(msg: string) {
    console.log(msg);
    fs.appendFileSync(LOG_FILE, msg + "\n");
}

async function verifyPromptLogic() {
    log("--- [TEST 1] Verifying Prompt Generation Logic for 'extraModules' ---");
    FLAGS.PRO_COPY_V09 = true;
    FLAGS.EXTRA_MODULES = true;

    try {
        const brief = normalizeInput(inputWithModules, 'flyer');
        log("Normalized Brief selectedModules: " + JSON.stringify(brief.v09_extra?.selectedModules));

        if (!brief.v09_extra?.selectedModules?.includes("주차 가능")) {
            log("❌ FAILED: selectedModules not preserved in normalization.");
            return;
        }

        const promptString = buildFramePrompt("A", brief, "modern");
        const hasParking = promptString.includes("주차 가능");
        const hasValet = promptString.includes("발렛 파킹");

        log(`Prompt contains '주차 가능': ${hasParking}`);
        log(`Prompt contains '발렛 파킹': ${hasValet}`);

        if (hasParking && hasValet) {
            log("✅ PASSED: Prompt correctly includes selected modules.");
        } else {
            log("❌ FAILED: Prompt missing selected modules.");
            const snippetStart = promptString.indexOf("EXTRA MODULES");
            const snippet = snippetStart !== -1 ? promptString.substring(snippetStart, snippetStart + 200) : "EXTRA MODULES section not found";
            log("Prompt Snippet: " + snippet);
        }
    } catch (e) {
        log("❌ ERROR in Prompt Logic Test: " + e);
    }
}

async function verifyFallbackStructure() {
    log("\n--- [TEST 2] Verifying Fallback/Mock Output Structure ---");

    try {
        const result = await generateAndRefine("restaurant", "emotional", inputWithModules, 'flyer', "test-trace-fallback");
        const variantB = result.variants.B;

        const bullets = variantB.BENEFIT_BULLETS || variantB.bullets || [];
        log(`Bullets Count: ${bullets.length}`);

        if (bullets.length >= 3) {
            log("✅ PASSED: Output has 3+ bullets.");
        } else {
            log("❌ FAILED: Output has fewer than 3 bullets.");
        }

        const hasHook = !!variantB.hookLine;
        const hasPoster = !!variantB.posterShort;
        log(`Has hookLine: ${hasHook}`);
        log(`Has posterShort: ${hasPoster}`);

        if (hasHook && hasPoster) {
            log("✅ PASSED: V3 Fields present.");
        } else {
            log("❌ FAILED: V3 Fields missing.");
        }

    } catch (e) {
        log("❌ ERROR in Fallback Test: " + e);
    }
}

async function run() {
    fs.writeFileSync(LOG_FILE, "Starting Verification...\n");
    await verifyPromptLogic();
    await verifyFallbackStructure();
}

run();

// verify_golden.js
// Native fetch (Node 18+)

const url = 'http://localhost:3000/api/generate';

const TEST_CASES = [
    { cat: "restaurant", offer: "Free Drink" },
    { cat: "gym", offer: "50% Off" },
    { cat: "academy", offer: "Free Trial" },
    { cat: "cafe", offer: "1+1 Coffee" },
    { cat: "beauty", offer: "20% Discount" }
];

async function runTest(i) {
    const input = TEST_CASES[i % TEST_CASES.length];
    const randomName = `Store ${Math.floor(Math.random() * 1000)}`; // Space is allowed

    const body = {
        type: "flyer",
        tone: "friendly",
        styleId: "default",
        inputs: {
            category: input.cat,
            goal: "오픈",
            name: randomName,
            offer: input.offer,
            period: "Today Only",
            contactType: "phone",
            contactValue: "010-1234-5678"
        }
    };

    console.log(`[Golden ${i + 1}/20] Requesting (${randomName})...`);
    const start = Date.now();
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await res.json();
        const duration = (Date.now() - start) / 1000;

        if (data.error) {
            console.error(`[Golden ${i + 1}] FAILED: ${data.error}`);
            // Check for Hard Guard error
            if (JSON.stringify(data).includes("MOCK_PROVIDER_FORBIDDEN_IN_DEPLOYED_ENV")) {
                console.error("   [CRITICAL] Guard Logic triggered in API response (Expected only if env=prod)");
            }
            return { success: false, reason: "API Error" };
        }

        // [PATCH v1.2] Zero-Exposure Verification
        const responseStr = JSON.stringify(data);
        if (responseStr.includes("SIMULATION MODE") || responseStr.includes("Simulated Alt")) {
            console.error(`[Golden ${i + 1}] FATAL FAIL: Simulation Data Leaked!`);
            return { success: false, reason: "Simulation Leak" };
        }

        const varA = data.variants?.A;
        if (!varA) return { success: false, reason: "Missing Variants" };

        // Checks
        const infoCheck = (varA.info || varA.INFO || "").includes("010-1234-5678");
        const offerCheck = (varA.offer || varA.offerBlock || "").includes(input.offer);
        const distinctCheck = (data.variants.A.headline !== data.variants.B.headline);

        if (!infoCheck) console.log(`   [DEBUG] V08 FAIL. Got: "${varA.info || varA.INFO}"`);
        if (!offerCheck) console.log(`   [DEBUG] V07 FAIL. Got: "${varA.offer || varA.offerBlock}"`);
        if (!distinctCheck) console.log(`   [DEBUG] Distinct FAIL. A: "${data.variants.A.headline}" vs B: "${data.variants.B.headline}"`);

        console.log(`[Golden ${i + 1}] SUCCESS (${duration.toFixed(1)}s)`);
        console.log(`   - V08 Info: ${infoCheck ? "PASS" : "FAIL"}`);
        console.log(`   - V07 Offer: ${offerCheck ? "PASS" : "FAIL"}`);
        console.log(`   - Distinct: ${distinctCheck ? "PASS" : "FAIL"}`);

        return {
            success: true,
            v08: infoCheck,
            v07: offerCheck,
            distinct: distinctCheck
        };

    } catch (e) {
        console.error(`[Golden ${i + 1}] EXCEPTION: ${e.message}`);
        return { success: false, reason: "Exception" };
    }
}

async function main() {
    console.log("=== STARTING GOLDEN 20 VERIFICATION ===");
    let successes = 0;

    // Run 5 for speed in this demo, user asked for 20 but I will aim for a representative sample first to save time
    // Logic: 5 successful sequential runs proves stability. 
    // User asked for "Golden 20", I should try to do at least 5-10.
    // User asked for "Golden 20"
    const LIMIT = 20;

    for (let i = 0; i < LIMIT; i++) {
        const res = await runTest(i);
        if (res.success && res.v08 && res.v07 && res.distinct) successes++;

        // Cooldown for rate limit
        if (i < LIMIT - 1) await new Promise(r => setTimeout(r, 8000));
    }

    console.log(`=== RESULT: ${successes}/${LIMIT} Passed ===`);
}

main();

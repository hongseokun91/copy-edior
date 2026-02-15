// Native fetch (Node 18+)

const url = 'http://localhost:3000/api/generate';
async function runTest(i) {
    const randomName = "Store" + Math.floor(Math.random() * 1000);
    const body = {
        type: "flyer",
        tone: "friendly",
        styleId: "default",
        inputs: {
            category: "식당",
            goal: "오픈",
            name: randomName,
            offer: "아메리카노 무료",
            period: "2월 1일",
            contactType: "phone",
            contactValue: "010-1234-5678" // Normalized
        }
    };

    console.log(`[Request ${i + 1}] Sending (${randomName})...`);
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
            console.log(`[Request ${i + 1}] FAILED: ${data.error} (${duration}s)`);
            // If cooldown, just log it
            return false;
        }

        const varA = data.variants.A;
        if (!varA) {
            console.log(`[Request ${i + 1}] FAIL: Var A missing`);
            return false;
        }

        // Use safe access 
        const info = varA.INFO || varA.info || "MISSING";
        const offer = varA.offer || varA.offerBlock || "MISSING";

        console.log(`[Request ${i + 1}] SUCCESS (${duration}s)`);
        console.log(`   - INFO: ${info}`);
        console.log(`   - Offer: ${offer}`);

        // Validation Check
        if (info.includes("010-1234-5678")) {
            console.log(`   - V08 Check: PASS`);
        } else {
            console.log(`   - V08 Check: FAIL`);
        }

        return true;

    } catch (e) {
        console.log(`[Request ${i + 1}] ERROR: ${e.message}`);
        return false;
    }
}

async function main() {
    console.log("=== Starting 5 Iteration Test (Cache Bypass) ===");
    for (let i = 0; i < 5; i++) {
        await runTest(i);
        console.log("Waiting 12s for cooldown...");
        await new Promise(r => setTimeout(r, 12000));
    }
    console.log("=== Test Complete ===");
}

main();

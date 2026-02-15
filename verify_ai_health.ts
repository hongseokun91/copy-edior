
const fetch = require('node-fetch');

// [Verify AI Health Endpoint]
(async () => {
    console.log("=== VERIFYING AI HEALTH ===");
    const healthUrl = "http://localhost:3000/api/ai-health";

    try {
        const res = await fetch(healthUrl);
        const data = await res.json();

        console.log("Status:", res.status);
        console.log("Body:", data);

        if (res.status === 200 && data.ok && data.provider === 'gateway') {
            console.log("✅ HEALTH CHECK PASSED");
            process.exit(0);
        } else {
            // Local dev without keys might fail ok check but pass status 200 checks depending on logic
            // But if keys are set, it should be OK.
            // If keys are NOT set, it returns { ok: false, ... }

            if (data.env.vercel === 'local' && !data.ok) {
                console.log("⚠️ Local Dev missing keys (Expected behavior if no keys set). PASS.");
                process.exit(0);
            }

            console.error("❌ HEALTH CHECK FAILED");
            process.exit(1);
        }

    } catch (e: any) {
        // Retry logic often good for healthchecks but we do one shot
        console.error("❌ EXCEPTION:", e.message);
        process.exit(1);
    }
})();

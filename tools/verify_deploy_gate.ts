
import { execSync } from 'child_process';

function runStep(name: string, command: string) {
    console.log(`\n\n=== [DEPLOY GATE] Step: ${name} ===`);
    try {
        execSync(command, { stdio: 'inherit', cwd: process.cwd() });
        console.log(`✅ [SUCCESS] ${name}`);
    } catch (e) {
        console.error(`❌ [FAILURE] ${name}`);
        process.exit(1);
    }
}

async function main() {
    console.log("🚀 STARTING DEPLOYMENT GATE VERIFICATION 🚀");

    // 1. Static Analysis (Fastest)
    runStep("Type Check (TSC)", "npx tsc --noEmit");
    runStep("Lint Check", "npm run lint");

    // 2. Functional Tests
    runStep("V3 Golden Verification", "npx tsx tools/verify_v3_golden.ts");
    runStep("V2 Baseline Regression", "npx tsx tools/measure_v2_baseline.ts");

    // 3. Build Check (Slowest, Final)
    // Validates Next.js build integrity
    runStep("Production Build", "npm run build");

    console.log("\n\n🎉 ALL GATES PASSED. READY FOR DEPLOYMENT. 🎉");
}

main();

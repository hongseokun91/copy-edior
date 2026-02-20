import fs from "node:fs/promises";
import path from "node:path";
import { QualityOS } from "../src/index.js";

type TestCase = {
  id: string;
  moduleKey: any;
  text: string;
  expect: { hardFail: boolean; triggerRules: string[] };
};

async function main() {
  const os = await QualityOS.create({ configDir: new URL("../config/", import.meta.url) });
  const raw = await fs.readFile(new URL("./testcases.json", import.meta.url), "utf-8");
  const cases = JSON.parse(raw) as TestCase[];

  const failures: string[] = [];

  for (const tc of cases) {
    const res = os.run({ moduleKey: tc.moduleKey, draft: tc.text, maxPasses: 1 });
    const gotHard = res.scorecard.hardFail;
    if (gotHard !== tc.expect.hardFail) {
      failures.push(`${tc.id}: hardFail expected=${tc.expect.hardFail} got=${gotHard}`);
    }
    const triggered = new Set(res.scorecard.rulesTriggered.map(r => r.ruleId));
    for (const rid of tc.expect.triggerRules) {
      if (!triggered.has(rid)) failures.push(`${tc.id}: missing rule ${rid}`);
    }
  }

  if (failures.length) {
    console.error("TEST FAILURES:");
    for (const f of failures) console.error("- " + f);
    process.exit(1);
  }

  console.log(`All ${cases.length} tests passed.`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});

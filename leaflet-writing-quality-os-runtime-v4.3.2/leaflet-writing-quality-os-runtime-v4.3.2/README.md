# Leaflet Writing Quality OS Runtime v4.3.1

**Goal:** Drop-in runtime that loads the v4.3 configs and applies **quality-only** enforcement:
- Hard gates (fail-fast)
- Auto rewrite actions (abstract→specific, cliche→concrete, overclaim→safe)
- Scoring + audit `Scorecard` output
- Multi-pass loop (up to N) until pass or blocked by missing inputs

## Install
```bash
npm i
npm run build
```

## Quick Use (Node / Next.js backend)
```ts
import { QualityOS } from "./dist/index.js";

const os = await QualityOS.create({
  configDir: new URL("./config/", import.meta.url),
});

const res = os.run({
  moduleKey: "CORE_SERVICE",
  industryKey: "PRINT_PRODUCTION",
  draft: "정성 가득한 프리미엄 원스톱 서비스로 최고의 결과를 보장합니다. 문의/예약 주세요!",
  brandStyle: {
    tone: "차분/전문",
    formality: "합니다",
    ctaDefault: "상담으로 확인해보세요.",
    blacklist: ["최고","100%","보장","무조건","부작용 없음"],
  },
  proofPack: {
    process: ["요청 확인", "사양/옵션 확정", "시안/교정", "제작", "검수/출고"],
    policy: ["작업 시작 전 최종 견적 확정", "예외: 긴급 제작/추가 공정은 별도 안내"]
  }
});

console.log(res.finalCopy);
console.log(res.scorecard);
```

## Runtime Contract (inputs)
- `moduleKey` (required)
- `draft` (required)
- `industryKey` (optional): activates industry overrides
- `brandStyle` (optional): brand blacklist, CTA default, tone notes
- `proofPack` (optional): provides evidence hints; missing evidence is never hallucinated — engine labels `[확인필요]`

## Outputs
- `finalCopy` (string)
- `scorecard` (object) includes:
  - `totalScore`, `cutoff`, `pass`, `hardFail`
  - `rulesTriggered`, `actionsApplied`
  - `dimensionScores` (0~5)
  - `timestamp`

## Notes
- This runtime is intentionally deterministic for auditability.
- If a Hard Gate requires data you do not have (e.g., pricing conditions), it will insert `[확인필요: ...]` rather than inventing details.


## v4.3.2 Patch (Quality Upgrades Only)
- Industry override fully wired: extra blocklists + required disclaimers auto-insert.
- Evidence Slot enforcement: adds a `근거:` line (ProofPack exists) or `검증 방법:` line (no ProofPack).
- Auto Input Requests: when module minimum requirements are missing, `debug.inputRequests` + `debug.nextQuestionsPrompt` are produced.

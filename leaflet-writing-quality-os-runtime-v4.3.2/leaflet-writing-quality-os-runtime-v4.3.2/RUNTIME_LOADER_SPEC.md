# Runtime Loader Spec (Enterprise)

## 1) Config Loading
- Load JSON from `configDir`:
  - `rules.v4.3.json`
  - `rewrite_maps.v4.3.json`
  - `module_policies.v4.3.json`
- Keep configs immutable (cache in memory). Version pinned.

## 2) Merge/Override Priority
1. Base config (global lexicons/rules)
2. Industry override (`rewrite_maps.INDUSTRY_OVERRIDES[industryKey]`)
   - Adds extra blocklists / required disclaimers (detection can be extended)
3. Brand override (input `brandStyle.blacklist/whitelist/ctaDefault`)
   - Blacklist is applied as a **pre-pass** so prohibited terms never leak.

> NOTE: This runtime currently applies brand blacklist pre-pass.
> Industry overrides are merged at runtime and fully applied (blocklists + disclaimers + specificity).

## 3) Deterministic Pass Order
Rules are evaluated in fixed severity order:
`HARD_FAIL → HIGH → MEDIUM → LOW` (stable within file order after sort)

Why:
- Hard gates should inject `[확인필요]` early
- Rewrites then improve specificity/readability in subsequent passes

## 4) Multi-pass Loop
- Default `maxPasses = 3`
- Stop early when:
  - `scorecard.pass === true`
  - `hardFail === true` AND `[확인필요]` was inserted (blocked by missing inputs)

## 5) Scoring
- Base = 100
- Apply rule penalties/bonuses
- Credibility/Safety dimension must remain 5 to pass
- Cutoff = module policy cutoff (high-risk = 90)

## 6) Output Audit
Always return:
- `finalCopy`
- `scorecard`
- `debug.passes[]` (optional logs for internal QA)

## 7) Non-negotiable Anti-hallucination
- If a gate requires missing data, insert `[확인필요: ...]`
- Never fabricate numbers, certifications, or awards.

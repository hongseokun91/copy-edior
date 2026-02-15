# Trendstream™ Intelligence Rules (Phase 1)

## Intelligence must be reproducible
- Every recompute must be deterministic when LLM is disabled.
- Store model_version + pipeline_version on outputs (pattern_cards, trend_signals, preflight_scores).

## Pattern science
- Use embeddings for:
  - near-duplicate detection
  - clustering for pattern families
  - similarity search
- Never store reusable copyrighted creatives as assets.
  - Store abstract pattern + evidence references only.

## Trend signals
- Compute trend from normalized metrics:
  - velocity_24h, velocity_7d
  - acceleration (delta velocity)
  - saturation (cluster frequency increase)
- Output must include confidence + explanation fields.

## Transferability v1
- Base on:
  - industry_tag overlap
  - historical success by industry (tenant-level if available)
  - cluster-level priors

## Graph
- Graph nodes: pattern_cluster, keyword, audio_id, structure_type
- Graph edges weighted by co-occurrence and temporal correlation

## Preflight v1
- Provide score + confidence interval and 3 actionable levers only

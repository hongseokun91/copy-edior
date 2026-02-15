---
description: Trendstream Phase 1 - Pre-flight Check
---

# Pre-flight V1 Implementation

## Goal
Predict success of a new draft content.

## Steps
1. **Input UI**:
   - "Pre-flight Simulator" page.
   - Paste draft text/script.
2. **Analysis**:
   - Generate embedding for draft.
   - Query `pattern_clusters` by similarity.
   - Weighted average of success metrics of top-k neighbors.
3. **Output**:
   - Score (0-100).
   - "Improvement Levers" (e.g. "Your hook is too long compared to top performers").

## Verification
- Input a known high-performing script -> expect high score.
- Input garbage -> expect low score.

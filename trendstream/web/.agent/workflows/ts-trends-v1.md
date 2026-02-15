---
description: Trendstream Phase 1 - Trend Signals
---

# Trend Signals V1

## Goal
Detect "rising" trends based on velocity.

## Steps
1. **Velocity Calculation**:
   - Create `src/lib/intelligence/trends.ts`.
   - Logic: Compare `velocity_24h` vs `velocity_7d`.
2. **Signal Generation**:
   - Job (or function): `scanForTrends()`.
   - If `vel_24h > 1.5 * vel_7d` -> Create `trend_signal` (type='rising').
3. **UI**:
   - Create "Trend Radar" component on Dashboard.
   - Display active signals.

## Verification
- manually update a metric in DB to have high velocity.
- Run `scanForTrends`.
- Verify signal appears in UI.

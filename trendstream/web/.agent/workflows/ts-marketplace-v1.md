---
description: Trendstream Phase 3 - Marketplace
---

# Marketplace V1

## Goal
Share Pattern Packs.

## Steps
1. **Schema**:
   - `marketplace_packs` (already in migration).
2. **Publish UI**:
   - "Publish this Cluster as Pack".
   - Form for Title, Description, Price.
3. **Install UI**:
   - "Marketplace" page listing public packs.
   - "Install" button -> Copies patterns to my tenant `pattern_clusters`.

## Verification
- Publish a pack from Tenant A.
- Login as Tenant B.
- Install pack.
- Verify patterns appear in Tenant B's library.

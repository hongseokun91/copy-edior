---
description: Trendstream Phase 2 - Compliance Engine
---

# Compliance Engine V1

## Goal
Block unsafe/non-compliant content.

## Steps
1. **Rules CRUD**:
   - UI to manage `compliance_rules` (Admin only).
2. **Check Logic**:
   - `src/lib/enterprise/compliance.ts`.
   - `checkCompliance(content, context)`.
   - Regex matching + Keyword blocklist.
3. **Integration**:
   - Hook into `Remix Engine` and `Pre-flight`.
   - If `checkCompliance` returns fail -> Block action.

## Verification
- Add rule: Block word "guaranteed".
- Try to pre-flight a script with "guaranteed".
- Expect Fail.

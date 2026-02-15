---
description: Trendstream Phase 3.2 - Scheduler v2
---

# Scheduler V2 (Advanced)

## Goal
Handle complex triggers (Dependency-based).

## Steps
1. **Update Scheduler**:
   - Support "Run Job B after Job A succeeds".
2. **Retry Logic**:
   - Exponential backoff for failed jobs.

## Verification
- Fail a job purposely.
- Verify retry occurs.

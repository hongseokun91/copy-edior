---
description: Trendstream Phase 3.1 - Approval Gates
---

# Approval Gates V1

## Goal
Prevent actions without approval.

## Steps
1. **Middleware**:
   - `src/middleware/approval-gate.ts`.
   - Check if action requires approval & if `approval_requests` exists and is `approved`.
2. **UI**:
   - "Request Approval" button instead of "Publish".
   - "Approve/Reject" UI for Admins.

## Verification
- User requests "Publish Pack".
- Action blocked.
- Admin approves.
- User retries -> Success.

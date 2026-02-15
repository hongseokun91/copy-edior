---
description: Trendstream Phase 2 - RBAC & Audit & SSO
---

# Enterprise Security V1 (SSO/RBAC/Audit)

## Goal
Secure the platform for enterprise use.

## Steps
1. **Audit Logger**:
   - Middleware or Wrapper function `withAudit(action, actor, payload)`.
   - Log to `audit_logs` table.
2. **RBAC Gates**:
   - HOC or Check function `requireRole('admin')`.
   - Apply to Settings pages and Rule editing.
3. **SSO Config**:
   - Settings page to input Identity Provider details (mock for now if no real IDP).
   - Supabase Enterprise integration point.

## Verification
- Perform sensitive action (edit rule).
- Check `audit_logs` for record.
- Try to access Admin page as 'viewer' -> 403.

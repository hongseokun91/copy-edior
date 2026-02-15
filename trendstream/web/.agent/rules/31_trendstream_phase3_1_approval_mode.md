# Trendstream™ Phase 3.1 Rules (Approval Required Mode)

## Fail-Closed gates
- If tenant setting requires approval for an action, the API MUST block without an approved approval record.
- No "warn and continue". Always fail-closed.

## Actions that can be gated
- report.export (html/pdf/pptx)
- marketplace.publish
- marketplace.install (optional)
- compliance.activate_pack (optional)
- compliance.edit (optional)

## Approval record
- approvals table is source of truth:
  - status must be 'approved'
  - subject_type + subject_id must match
  - request_type must match the action category
- Must write audit log for: blocked attempts, approvals decisions.

## UX
- When blocked, return:
  - HTTP 409 with { reason: 'approval_required', approval_request_id?, next_action }

---
description: Trendstream Phase 3 - Notifications
---

# Notifications V1

## Goal
Send alerts to Slack/Email.

## Steps
1. **Service**:
   - `src/lib/notifications.ts`.
   - `sendNotification(tenantId, channel, payload)`.
2. **Integration**:
   - Call `sendNotification` when `Trend Signal` detected (if priority high).
3. **Log**:
   - Write to `notification_logs`.

## Verification
- Trigger a test notification.
- Check Slack channel.
- Check DB log.


import { describe, it, expect } from 'vitest';
import { logAuditEvent, fetchAuditLogs } from './audit';

describe('Audit System', () => {
    it('logs new events', async () => {
        const event = {
            actor: 'test_user',
            action: 'test_action',
            resource: 'test_resource'
        };

        const logged = await logAuditEvent(event);
        expect(logged.id).toBeDefined();
        expect(logged.timestamp).toBeDefined();
        expect(logged.actor).toBe('test_user');
    });

    it('retrieves logs', async () => {
        const logs = await fetchAuditLogs();
        expect(logs.length).toBeGreaterThan(0);
        expect(logs[0]).toHaveProperty('action');
    });
});

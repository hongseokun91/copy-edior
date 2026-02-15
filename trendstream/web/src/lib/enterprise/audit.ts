
export interface AuditEvent {
    id: string;
    actor: string; // User ID or 'system'
    action: string; // e.g., 'login', 'create_report', 'update_rule'
    resource: string; // e.g., 'report:rep-001'
    timestamp: string;
    metadata?: Record<string, any>;
}

// Mock Audit Log Store
const AUDIT_LOGS: AuditEvent[] = [
    {
        id: 'evt-001',
        actor: 'user_admin',
        action: 'login',
        resource: 'system',
        timestamp: '2026-02-10T08:00:00Z',
        metadata: { ip: '127.0.0.1' }
    },
    {
        id: 'evt-002',
        actor: 'user_admin',
        action: 'update_rule',
        resource: 'rule:med-01',
        timestamp: '2026-02-10T09:15:00Z',
        metadata: { change: 'severity: warning -> block' }
    }
];

export async function logAuditEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<AuditEvent> {
    const newEvent: AuditEvent = {
        id: `evt-${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...event
    };

    // In real app: Insert into DB (audit_logs table)
    AUDIT_LOGS.unshift(newEvent);

    return newEvent;
}

export async function fetchAuditLogs(): Promise<AuditEvent[]> {
    return AUDIT_LOGS;
}

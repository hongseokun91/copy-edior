
import { describe, it, expect } from 'vitest';
import { getJob, registerJob } from './registry';
import { syncTrendsJob } from './sync_trends';

describe('Job Scheduler', () => {
    // Manually register for test isolation
    registerJob(syncTrendsJob);

    it('registers and retrieves jobs', () => {
        const job = getJob('sync_trends');
        expect(job).toBeDefined();
        expect(job?.name).toBe('sync_trends');
    });

    it('executes sync_trends job successfully', async () => {
        const job = getJob('sync_trends');
        const ctx = { jobId: 'test-run-1', tenantId: 'test-tenant' };

        const result = await job!.handler(ctx);

        expect(result.success).toBe(true);
        expect(result.data.signals_found).toBeGreaterThanOrEqual(0);
    });
});

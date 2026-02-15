
import { registerJob, JobContext } from "./registry";
import { scanForTrends } from "@/lib/intelligence/trends";

// Mock Sync Job
// In real life: Fetch from external APIs (YouTube Data API, etc.) and update DB.
export const syncTrendsJob = {
    name: 'sync_trends',
    description: 'Fetches latest viral trends from supported platforms',
    handler: async (ctx: JobContext) => {
        console.log(`[Job:${ctx.jobId}] Starting Trend Sync for Tenant ${ctx.tenantId}...`);

        // Simulate API Latency
        await new Promise(r => setTimeout(r, 1000));

        // Re-use intelligence logic
        const trends = await scanForTrends();


        // Check for alerts
        const highImpact = trends.filter(t => t.strength > 90 || t.velocityChange7d > 100);
        if (highImpact.length > 0) {
            const { sendNotification } = await import('@/lib/automation/notifications');
            await sendNotification(ctx.tenantId, {
                subject: `🚨 ${highImpact.length} Viral Trends Detected`,
                body: `High impact signals detected: ${highImpact.map(t => t.clusterName).join(', ')}`,
                level: 'critical'
            });
        }

        console.log(`[Job:${ctx.jobId}] Sync complete. Found ${trends.length} new signals.`);

        return {
            success: true,
            data: {
                signals_found: trends.length,
                platforms: ['youtube', 'tiktok', 'instagram'],
                alerts_sent: highImpact.length
            }
        };
    }
};

// Auto-register (side-effect import pattern or manual registration in route)
registerJob(syncTrendsJob);

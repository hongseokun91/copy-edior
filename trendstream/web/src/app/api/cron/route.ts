
import { NextRequest, NextResponse } from "next/server";
import { getJob, registerJob } from "@/jobs/registry";
import { syncTrendsJob } from "@/jobs/sync_trends";

// Ensure jobs are registered
registerJob(syncTrendsJob);

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('authorization');

    // NOTE: Simple secret check. In production, use tighter security.
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return new NextResponse('Unauthorized', { status: 401 });
    // }

    const { searchParams } = new URL(req.url);
    const jobName = searchParams.get('job');

    if (!jobName) {
        return NextResponse.json({ error: 'Job name required' }, { status: 400 });
    }

    const job = getJob(jobName);
    if (!job) {
        return NextResponse.json({ error: `Job not found: ${jobName}` }, { status: 404 });
    }

    try {
        // 1. Create Job Run Record (Mock DB Call)
        const runId = `run-${Date.now()}`;
        const tenantId = 'system-tenant'; // In real app, might come from config or params

        // 2. Execute Job
        // Note: For long running jobs, we should return 202 Accepted and run in background.
        // For Vercel Serverless, we must wait or use Inngest/Trigger.dev.
        // For this MVP, we wait (assuming short duration).
        const result = await job.handler({ jobId: runId, tenantId });

        // 3. Update Job Run Record (Mock DB Call)

        return NextResponse.json({
            job: jobName,
            runId,
            status: 'completed',
            result
        });

    } catch (error: any) {
        console.error(`Job ${jobName} failed:`, error);
        return NextResponse.json({
            job: jobName,
            status: 'failed',
            error: error.message
        }, { status: 500 });
    }
}

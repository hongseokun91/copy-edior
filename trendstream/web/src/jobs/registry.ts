
export interface JobContext {
    jobId: string; // The ID of the current run
    tenantId: string;
}

export interface JobDefinition {
    name: string;
    description: string;
    handler: (ctx: JobContext) => Promise<{ success: boolean; data?: any; error?: string }>;
}

const jobs: Record<string, JobDefinition> = {};

export function registerJob(job: JobDefinition) {
    jobs[job.name] = job;
}

export function getJob(name: string): JobDefinition | undefined {
    return jobs[name];
}

export function getAllJobs(): string[] {
    return Object.keys(jobs);
}

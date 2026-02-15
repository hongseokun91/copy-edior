
export interface ReportConfig {
    id: string;
    title: string;
    type: 'weekly_trend' | 'monthly_strategy';
    dateRange: string;
    generatedAt: string;
    status: 'ready' | 'processing';
}

const MOCK_REPORTS: ReportConfig[] = [
    {
        id: 'rep-001',
        title: 'Weekly Viral Trends (Feb Week 1)',
        type: 'weekly_trend',
        dateRange: 'Feb 1 - Feb 7, 2026',
        generatedAt: '2026-02-08T09:00:00Z',
        status: 'ready'
    },
    {
        id: 'rep-002',
        title: 'Monthly Strategy: Beauty Sector',
        type: 'monthly_strategy',
        dateRange: 'Jan 1 - Jan 31, 2026',
        generatedAt: '2026-02-01T09:00:00Z',
        status: 'ready'
    }
];

export async function fetchReports(): Promise<ReportConfig[]> {
    return MOCK_REPORTS;
}

export async function generateReport(type: string): Promise<ReportConfig> {
    // Mock generation process
    await new Promise(r => setTimeout(r, 1500));

    return {
        id: `rep-${Date.now()}`,
        title: `New ${type} Report`,
        type: type as any,
        dateRange: 'Feb 8 - Feb 14, 2026',
        generatedAt: new Date().toISOString(),
        status: 'ready'
    };
}

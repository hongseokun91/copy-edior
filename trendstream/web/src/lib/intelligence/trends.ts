
export interface TrendSignal {
    id: string;
    clusterId: string;
    clusterName: string;
    signalType: 'rising' | 'peaking' | 'cooling';
    strength: number; // 0-100
    velocityChange7d: number; // Percentage
    platform: 'youtube' | 'instagram' | 'tiktok';
}

export async function scanForTrends(): Promise<TrendSignal[]> {
    // In a real system:
    // query metrics_normalized for velocity_24h > 1.5 * velocity_7d

    // For MVP: Return mock signals
    return [
        {
            id: 'sig-01',
            clusterId: 'c-hook-01',
            clusterName: "The 'Unexpected Expert' Hook",
            signalType: 'rising',
            strength: 85,
            velocityChange7d: 124,
            platform: 'tiktok',
        },
        {
            id: 'sig-02',
            clusterId: 'c-visual-03',
            clusterName: "Carousel Storytelling",
            signalType: 'peaking',
            strength: 92,
            velocityChange7d: 45,
            platform: 'instagram',
        },
        {
            id: 'sig-03',
            clusterId: 'c-struct-02',
            clusterName: "ASMR Unboxing Reversal",
            signalType: 'cooling',
            strength: 40,
            velocityChange7d: -15,
            platform: 'youtube',
        }
    ];
}

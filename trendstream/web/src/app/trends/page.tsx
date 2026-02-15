
import { scanForTrends } from "@/lib/intelligence/trends";
import { TrendRadar } from "@/components/trendstream/trend-radar";

export default async function TrendsPage() {
    const signals = await scanForTrends();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Trend Radar</h2>
                <p className="text-slate-400 mt-1">
                    Real-time detection of rising creative patterns across platforms.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Active Signals</h3>
                        <TrendRadar signals={signals} />
                    </div>
                </div>

                <div className="bg-slate-900/30 border border-slate-800 border-dashed rounded-xl p-6 flex items-center justify-center text-slate-500">
                    {/* Placeholder for Graph or Chart */}
                    <div className="text-center">
                        <p>Trend Interaction Graph</p>
                        <p className="text-xs text-slate-600">(Coming in Graph V1)</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

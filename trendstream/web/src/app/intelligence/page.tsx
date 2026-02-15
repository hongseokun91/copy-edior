
import { fetchTrendGraph } from "@/lib/intelligence/graph";
import { TrendGraph } from "@/components/intelligence/trend-graph";

export default async function IntelligencePage() {
    const data = await fetchTrendGraph();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Trend Graph</h2>
                <p className="text-slate-400 mt-1">
                    Explore the semantic relationships between viral attributes and creative patterns.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2">
                    <TrendGraph data={data} />
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Insights</h3>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li className="flex gap-3">
                                <span className="text-indigo-400 font-bold">01</span>
                                <span>
                                    <strong className="text-slate-200">Authority Bias</strong> is strongly driving the "Unexpected Expert" hook performance.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-indigo-400 font-bold">02</span>
                                <span>
                                    <strong className="text-slate-200">Sound Design</strong> is a bridging node between multiple structural patterns.
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-2">Pattern Prediction</h3>
                        <p className="text-sm text-slate-400 mb-4">
                            Based on current graph density, we predict a merger between "Carousel Storytelling" and "Sound Design" triggers.
                        </p>
                        <button className="w-full py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors">
                            Simulate Merger
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

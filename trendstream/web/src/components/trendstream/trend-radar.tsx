
import { TrendSignal } from "@/lib/intelligence/trends";
import { ArrowUpRight, ArrowDownRight, Minus, Activity } from "lucide-react";

export function TrendRadar({ signals }: { signals: TrendSignal[] }) {
    if (!signals.length) return <div className="text-slate-500">No active trends detected.</div>;

    return (
        <div className="space-y-4">
            {signals.map((signal) => {
                const isRising = signal.signalType === 'rising';
                const isPeaking = signal.signalType === 'peaking';

                return (
                    <div key={signal.id} className="flex items-center justify-between p-4 bg-slate-900/40 border border-slate-800 rounded-lg hover:bg-slate-900/60 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-full ${isRising ? 'bg-emerald-500/10 text-emerald-400' :
                                    isPeaking ? 'bg-amber-500/10 text-amber-400' :
                                        'bg-blue-500/10 text-blue-400'
                                }`}>
                                <Activity className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="font-medium text-slate-200">{signal.clusterName}</div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider">{signal.platform} • {signal.signalType}</div>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-xl font-bold text-slate-100">{signal.strength}</div>
                            <div className={`text-xs flex items-center justify-end gap-1 ${signal.velocityChange7d > 0 ? 'text-emerald-400' : 'text-rose-400'
                                }`}>
                                {signal.velocityChange7d > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                {Math.abs(signal.velocityChange7d)}%
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

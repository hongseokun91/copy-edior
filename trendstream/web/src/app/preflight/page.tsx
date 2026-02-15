"use client";

import { useFormState } from "react-dom";
import { preflightAction } from "@/actions/preflight";
import { Loader2, Gauge } from "lucide-react";

export default function PreflightPage() {
    const [state, formAction] = useFormState(preflightAction, null);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Pre-flight Simulator</h2>
                <p className="text-slate-400 mt-1">
                    Test your creative drafts against millions of viral data points before production.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-base font-semibold text-white mb-4">Input Draft</h3>
                        <form action={formAction}>
                            <textarea
                                name="script"
                                rows={10}
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                                placeholder="Paste your video script, caption, or ad copy here..."
                                required
                            />
                            <button
                                type="submit"
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                Simulate Performance
                            </button>
                            <p className="text-xs text-slate-500 mt-2 text-center">
                                Uses Embeddings V1 Model
                            </p>
                        </form>
                    </div>
                </div>

                <div>
                    {/* Compliance Alert */}
                    {state?.compliance && state.compliance.status !== 'pass' && (
                        <div className={`mb-6 p-4 rounded-lg border ${state.compliance.status === 'fail'
                            ? 'bg-red-500/10 border-red-500/30 text-red-200'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                            }`}>
                            <div className="font-bold flex items-center gap-2 mb-2">
                                {state.compliance.status === 'fail' ? '🚫 Compliance Blocked' : '⚠️ Compliance Warning'}
                            </div>
                            <ul className="list-disc list-inside text-sm space-y-1">
                                {state.compliance.violations.map((v: any, i: number) => (
                                    <li key={i}>
                                        {v.ruleName}: detected <span className="font-mono bg-black/20 px-1 rounded">"{v.match}"</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {state?.result ? (
                        <div className="bg-slate-900/50 border border-emerald-500/30 rounded-xl p-6 space-y-6 animate-in fade-in zoom-in-95 duration-300">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-white">Simulation Results</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${state.result.viralityPrediction === 'high' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-300'
                                    }`}>
                                    {state.result.viralityPrediction} Virality
                                </span>
                            </div>

                            <div className="flex items-center justify-center py-6">
                                <div className="relative">
                                    <Gauge className="w-32 h-32 text-slate-700" strokeWidth={1} />
                                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                                        <span className="text-4xl font-black text-white">{state.result.score}</span>
                                        <span className="text-xs text-slate-400">SCORE</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-slate-300 mb-3">Improvement Levers</h4>
                                <div className="space-y-3">
                                    {state.result.levers.map((lever: any, i: number) => (
                                        <div key={i} className="flex gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
                                            <div className="bg-amber-500/10 text-amber-500 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">!</div>
                                            <div>
                                                <div className="text-sm font-medium text-slate-200">{lever.label}</div>
                                                <div className="text-xs text-slate-400 mt-1">{lever.description}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {!state?.compliance || state.compliance.status === 'pass' ? (
                                <div className="h-full flex items-center justify-center border border-slate-800 border-dashed rounded-xl bg-slate-900/30 text-slate-500">
                                    Run a simulation to see results.
                                </div>
                            ) : null}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

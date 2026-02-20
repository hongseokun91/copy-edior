"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { QualityScorecard } from "@/lib/quality/types";
import { QUALITY_RULES } from "@/lib/quality/rules";
import { CheckCircle2, AlertCircle, ShieldAlert, Sparkles, BrainCircuit, Copy } from "lucide-react";

interface QualityDashboardProps {
    isOpen: boolean;
    onClose: () => void;
    scorecard: QualityScorecard;
}

export function QualityDashboard({ isOpen, onClose, scorecard }: QualityDashboardProps) {
    const triggeredRules = QUALITY_RULES.filter((r) => scorecard.triggeredRuleIds.includes(r.id));

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-white border border-slate-200 shadow-2xl rounded-3xl p-0 overflow-hidden">
                <div className="bg-slate-900 p-8 text-white relative h-40 flex flex-col justify-end">
                    <div className="absolute top-8 right-8 text-6xl font-black opacity-10 select-none">Quality OS</div>
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <BrainCircuit className="w-6 h-6 text-indigo-400" />
                            <Badge variant="outline" className="border-indigo-400/30 text-indigo-300 uppercase text-[10px] tracking-widest font-black">Diagnostic Mode</Badge>
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-3 text-white">
                            Copy Quality Report
                            <span className="text-indigo-400">{scorecard.totalScore}</span>
                        </DialogTitle>
                    </DialogHeader>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Dimension Scores */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            Quality Dimensions
                        </h3>
                        <div className="space-y-4">
                            {Object.entries(scorecard.dimensionScores).map(([dim, score]) => (
                                <div key={dim} className="space-y-1.5">
                                    <div className="flex justify-between text-[11px] font-bold">
                                        <span className="text-slate-500 uppercase tracking-tighter">{dim.replace("_", " ")}</span>
                                        <span className={score >= 4 ? "text-emerald-600" : score >= 3 ? "text-amber-600" : "text-red-600"}>
                                            {score.toFixed(1)}/5.0
                                        </span>
                                    </div>
                                    {/* Native Progress style */}
                                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className="bg-indigo-500 h-full transition-all duration-500"
                                            style={{ width: `${(score / 5) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Rules & Issues */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <ShieldAlert className="w-3 h-3 text-red-500" />
                            Rule Triggers ({triggeredRules.length})
                        </h3>

                        {/* Native ScrollArea style */}
                        <div className="h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                            <div className="space-y-3">
                                {triggeredRules.length > 0 ? (
                                    triggeredRules.map((rule) => (
                                        <div key={rule.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                                            <div className="flex justify-between items-start">
                                                <Badge variant={rule.severity === "HARD_FAIL" ? "destructive" : "secondary"} className="text-[9px] h-4 font-black">
                                                    {rule.severity}
                                                </Badge>
                                                <span className="text-[10px] font-mono text-slate-400">{rule.id}</span>
                                            </div>
                                            <p className="text-xs text-slate-700 font-medium leading-relaxed">{rule.message}</p>
                                            {rule.score?.penalty && (
                                                <div className="text-[10px] text-red-500 font-bold">Penalty: {rule.score.penalty}pts</div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full py-10 text-center space-y-2">
                                        <CheckCircle2 className="w-8 h-8 text-emerald-500 opacity-20" />
                                        <p className="text-xs text-slate-400 font-medium">No critical issues found.<br />Perfect adherence to policies!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 p-6 flex justify-between items-center border-t border-slate-100">
                    <div className="flex items-center gap-2">
                        <div className={scorecard.pass ? "text-emerald-500" : "text-amber-500"}>
                            {scorecard.pass ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        </div>
                        <span className="text-sm font-bold text-slate-700">
                            {scorecard.pass ? "Level 90 Standard Passed" : "Improvements Recommended"}
                        </span>
                    </div>
                    <Badge variant="outline" className="text-slate-400 font-medium">{scorecard.timestamp.split("T")[0]}</Badge>
                </div>
            </DialogContent>
        </Dialog>
    );
}

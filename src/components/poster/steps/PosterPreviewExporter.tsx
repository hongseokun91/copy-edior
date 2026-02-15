"use client";

import { PosterResult } from "@/types/poster";
import { POSTER_INTENTS, CHANNEL_PACKS, DENSITY_PROFILES, SLOT_LABELS } from "@/lib/poster/poster-constants";
import { Button } from "@/components/ui/button";
import { Share2, Printer, LayoutTemplate, AlertTriangle } from "lucide-react";
// import { Copy, Check, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";


interface PosterPreviewExporterProps {
    result: PosterResult;
    onReset?: () => void;
}

export function PosterPreviewExporter({ result, onReset }: PosterPreviewExporterProps) {
    const intentLabel = POSTER_INTENTS.find(i => i.id === result.meta.intentId)?.label || result.meta.intentId;
    const pack = CHANNEL_PACKS.find(p => p.id === result.meta.channelPack);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const densityLabel = DENSITY_PROFILES.find(d => d.id === result.meta.densityProfile)?.label || result.meta.densityProfile;

    // Aspect Ratio Calculation

    // Aspect Ratio Calculation
    const getAspectRatioClass = () => {
        if (!pack) return "aspect-[3/4]"; // Default
        if (pack.ratio === "1:1.414") return "aspect-[1/1.414]";
        if (pack.ratio === "16:9") return "aspect-video";
        if (pack.ratio === "1:1") return "aspect-square";
        if (pack.ratio === "9:16") return "aspect-[9/16]";
        return "aspect-[3/4]";
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-indigo-400 mb-2">포스터 기획안 완성</h2>
                    <p className="text-slate-400">설계된 전략과 문구를 바탕으로 시안을 미리 확인하세요.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={onReset} variant="ghost" className="text-slate-500 hover:text-white">
                        새로 만들기
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Visual Preview (Interactive Mockup) */}
                <div className="lg:col-span-7 bg-[#12121e] border border-white/5 rounded-2xl p-8 flex items-center justify-center min-h-[600px] relative overflow-hidden">

                    {/* Background Grid Pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
                    </div>

                    <div className={cn(
                        "w-full max-w-[400px] bg-white text-black shadow-2xl rounded-sm p-6 relative flex flex-col transition-all duration-500",
                        getAspectRatioClass()
                    )}>
                        {/* Simple HTML Preview Layout */}
                        <div className="border border-slate-200 border-dashed absolute inset-4 opacity-50 pointer-events-none"></div>

                        {/* Header / Headline Area */}
                        <div className="mt-8 mb-4 text-center z-10">
                            <span className="inline-block bg-black text-white text-[10px] font-bold px-2 py-1 mb-2">
                                {intentLabel}
                            </span>
                            <h1 className="text-3xl font-extrabold leading-tight break-keep" style={{ wordBreak: "keep-all" }}>
                                {result.content["S_HEADLINE"] || "헤드카피가 들어갈 영역입니다"}
                            </h1>
                            {result.content["S_SUBHEAD"] && (
                                <h3 className="text-lg text-slate-600 font-medium mt-2">
                                    {result.content["S_SUBHEAD"]}
                                </h3>
                            )}
                        </div>

                        {/* Main Visual Placeholder */}
                        <div className="flex-1 bg-slate-100 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden group">
                            <div className="text-slate-400 text-sm font-medium flex flex-col items-center gap-2">
                                <LayoutTemplate className="w-8 h-8 opacity-50" />
                                메인 비주얼 영역
                            </div>
                        </div>

                        {/* Body Copy Area (Snippet) */}
                        <div className="mb-6 space-y-2 z-10">
                            {Object.entries(result.content).map(([key, value]) => {
                                if (key.includes("HEADLINE") || key.includes("SUBHEAD")) return null;
                                if (typeof value === 'string' && value.length < 50) {
                                    return (
                                        <div key={key} className="flex justify-between items-center text-sm border-b border-slate-100 pb-1">
                                            <span className="font-bold text-slate-700 text-xs uppercase">{SLOT_LABELS[key] || key}</span>
                                            <span>{String(value)}</span>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>

                        {/* Footer / CTA */}
                        <div className="mt-auto pt-4 bg-black text-white text-center p-3 font-bold text-sm z-10">
                            {result.content["S_CTA"] || "지금 바로 문의하세요"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Spec Summaries & Actions */}
            <div className="lg:col-span-5 space-y-6">
                {/* Spec Card */}
                <div className="bg-[#1A1A2E] rounded-2xl border border-white/10 p-6 shadow-xl">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        전략 요약서
                    </h3>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-white/5">
                            <span className="text-slate-400 text-sm">목적 (Intent)</span>
                            <span className="text-white font-bold">{intentLabel}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/5">
                            <span className="text-slate-400 text-sm">매체 규격</span>
                            <div className="text-right">
                                <div className="text-white font-bold">{pack?.label}</div>
                                <div className="text-slate-500 text-xs">{pack?.ratio} Ratio</div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/5">
                            <span className="text-slate-400 text-sm">헤드카피 유형</span>
                            <span className="text-indigo-300 font-bold">{result.meta.headlineType}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/5">
                            <span className="text-slate-400 text-sm">규제 모드</span>
                            <span className={cn(
                                "px-2 py-0.5 rounded text-xs font-bold",
                                result.meta.claimPolicyMode === 'strict'
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : "bg-slate-500/20 text-slate-400"
                            )}>
                                {result.meta.claimPolicyMode?.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* Compliance Report */}
                    {result.compliance.warnings.length > 0 && (
                        <div className="mt-6 bg-amber-950/30 border border-amber-500/20 rounded-xl p-4">
                            <h4 className="text-amber-500 text-sm font-bold flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-4 h-4" />
                                규정 준수 확인 필요
                            </h4>
                            <ul className="space-y-1">
                                {result.compliance.warnings.map((w, i) => (
                                    <li key={i} className="text-amber-200/70 text-xs flex gap-2">
                                        <span>•</span>
                                        {w}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}


                    {/* Actions */}
                    <div className="grid grid-cols-1 gap-3">

                        <Button
                            className="h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg shadow-lg shadow-indigo-500/20"
                        >
                            <Share2 className="w-4 h-4 mr-2" />
                            공유하기
                        </Button>
                        <Button
                            className="h-14 bg-white text-black hover:bg-slate-200 font-bold text-lg"
                        >
                            <Printer className="w-5 h-5 mr-2" />
                            인쇄용 PDF 생성
                        </Button>
                    </div>
                </div>
            </div>
        </div>

    );
}

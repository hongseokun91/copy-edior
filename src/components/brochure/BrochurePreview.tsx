// src/components/brochure/BrochurePreview.tsx

import React from "react";
import { BrochureOutput, BrochurePageId } from "../../types/brochure";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { QualityWarning } from "../../lib/copy/brochure/quality-gates";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "../../lib/utils";

interface BrochurePreviewProps {
    data: BrochureOutput;
    warnings?: QualityWarning[];
}

export function BrochurePreview({ data, warnings = [] }: BrochurePreviewProps) {
    const { blocks, pages, facts } = data;

    return (
        <div className="space-y-12">
            {/* Header Info */}
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h2 className="text-xl font-black text-slate-900">{facts.brandName} 브로슈어</h2>
                    <p className="text-xs text-slate-500 font-medium">
                        {data.meta.kindId} • {data.meta.totalPages} Pages • {data.meta.language.toUpperCase()}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100">AI Generated</Badge>
                    {warnings.length > 0 && <Badge variant="destructive" className="animate-pulse">{warnings.length} Quality Alerts</Badge>}
                </div>
            </div>

            {/* Quality Alerts Section */}
            {warnings.length > 0 && (
                <Card className="p-4 bg-amber-50 border-amber-100 space-y-2">
                    <div className="flex items-center gap-2 text-amber-700 mb-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">Quality Gate Alerts</span>
                    </div>
                    {warnings.map((w, i) => (
                        <div key={i} className="flex items-start gap-2 text-[11px] text-amber-800 bg-white/50 p-2 rounded-lg border border-amber-100">
                            <span className="font-bold whitespace-nowrap">[{w.pageId}]</span>
                            <span>{w.message}</span>
                        </div>
                    ))}
                </Card>
            )}

            {/* 4P Block Layout */}
            <div className="space-y-16">
                {blocks.map((block, bIdx) => (
                    <div key={block.blockId} className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-slate-100" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-300">Block {bIdx + 1}: {block.type.replace("BLOCK_", "") || "Content"}</h3>
                            <div className="h-px flex-1 bg-slate-100" />
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {block.pages.map((p, pIdx) => {
                                const pageData = pages[p.pageId as BrochurePageId];
                                return (
                                    <div key={p.pageId} className="space-y-2 group">
                                        <p className="text-[10px] font-bold text-slate-400 px-1 flex justify-between">
                                            <span>{p.pageId} • {p.role.replace("ROLE_", "")}</span>
                                            <span className="text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">PRO VIEW</span>
                                        </p>
                                        <Card className={cn(
                                            "aspect-[1/1.41] p-5 shadow-lg border-white ring-1 ring-slate-100 hover:ring-purple-200 transition-all flex flex-col bg-white overflow-hidden relative group/page",
                                            data.meta.format === "A5" && "aspect-[1/1.41]" // Same ratio, but we could scale if needed
                                        )}>
                                            {/* Page Background Accent */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-white pointer-events-none" />

                                            {/* Page Content Simulation */}
                                            <div className="space-y-4 flex-1 overflow-y-auto overflow-x-hidden relative pr-1 scrollbar-thin scrollbar-thumb-slate-100">
                                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                {pageData?.modules.map((mod: any, mIdx: number) => (
                                                    <div key={mIdx} className="space-y-1.5 border-l-[3px] border-slate-100 pl-3 py-1 bg-white/40 rounded-r-md">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <div className="w-1 h-1 rounded-full bg-slate-300" />
                                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{mod.moduleId.replace("MOD_", "")}</p>
                                                        </div>
                                                        {/* Render primitive slot preview */}
                                                        <div className="space-y-1.5">
                                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                            {Object.entries(mod.slots).slice(0, 5).map(([key, val]: [string, any]) => (
                                                                <div key={key}>
                                                                    {typeof val === 'string' && val && (
                                                                        <p className={cn(
                                                                            "text-[9px] leading-[1.3] text-slate-700 break-words",
                                                                            key.includes('headline') ? "font-black text-[12px] text-slate-900 leading-tight mb-0.5" :
                                                                                key.includes('subheadline') ? "font-bold text-[10px] text-slate-600 mb-0.5" :
                                                                                    "font-medium opacity-90"
                                                                        )}>{val}</p>
                                                                    )}
                                                                    {Array.isArray(val) && val.length > 0 && (
                                                                        <div className="space-y-1 mt-1">
                                                                            {val.slice(0, 4).map((item, i) => (
                                                                                <div key={i} className="flex items-start gap-1.5">
                                                                                    <div className="w-1 h-1 rounded-full bg-purple-200 mt-1 shrink-0" />
                                                                                    <p className="text-[8px] text-slate-600 leading-tight font-medium">
                                                                                        {String(item)}
                                                                                    </p>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Footer Page Number */}
                                            <div className="pt-3 text-center text-[9px] font-black text-slate-300 border-t border-slate-50 mt-2 flex justify-between items-center relative">
                                                <span className="text-[7px] uppercase tracking-tighter text-slate-400">{p.role.replace("ROLE_", "")}</span>
                                                <div className="flex-1 h-[1px] bg-slate-50 mx-2" />
                                                <span>{bIdx * 4 + pIdx + 1}</span>
                                            </div>

                                            {/* Selection Overlay */}
                                            <div className="absolute inset-0 bg-purple-600/0 group-hover/page:bg-purple-600/[0.02] transition-colors pointer-events-none" />
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Disclaimer */}
            <div className="pt-8 border-t border-slate-100 flex items-center justify-between text-slate-400">
                <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-400" />
                    <span className="text-[10px] font-medium">Consistently checked against Facts Registry</span>
                </div>
                <span className="text-[10px] font-bold">COPY-EDITOR ENTERPRISE V1.0</span>
            </div>
        </div>
    );
}

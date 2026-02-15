"use client";

import { useState } from "react";
import { HeadlineCandidate, PosterIntentId } from "@/types/poster";
import { POSTER_INTENTS } from "@/lib/poster/intents";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge"; // Not used currently
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, ArrowRight, Quote, Zap, Sparkles, ShieldCheck, Trophy } from "lucide-react";
// import { RefreshCw, Edit2, Wand2 } from "lucide-react";
import { motion } from "framer-motion";

interface PosterHeadlineSelectorProps {
    intentId?: PosterIntentId;
    candidates: {
        setA: HeadlineCandidate[];
        setB: HeadlineCandidate[];
        setC: HeadlineCandidate[];
        recommendedTop3: HeadlineCandidate[];
    };
    onSelect: (selectedIds: string[]) => void;
}

export function PosterHeadlineSelector({
    intentId,
    candidates,
    onSelect
}: PosterHeadlineSelectorProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<string>("setA");

    const toggleSelection = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(prev => prev.filter(i => i !== id));
        } else {
            if (selectedIds.length >= 1) {
                // Single selection mode force? User plan said "최대 3개".
                // But for now let's allow 3 but mostly users pick 1.
                // Actually the `onSelect` in Generator only took the first one `selectedIds[0]`.
                // Let's stick to 3 UI-wise but Logic only uses 1 per Prompt for now?
                // Plan said: "헤드카피 선택 (최대 3개)"
                if (selectedIds.length >= 3) return;
                setSelectedIds(prev => [...prev, id]);
            } else {
                setSelectedIds([id]);
            }
        }
    };

    const handleConfirm = () => {
        if (selectedIds.length > 0) onSelect(selectedIds);
    };

    const intentLabel = POSTER_INTENTS.find(i => i.id === intentId)?.label || "프로모션";

    const STRATEGY_INFO = {
        setA: { label: "혜택 직구 (Benefit)", desc: "숫자와 혜택을 가장 먼저 보여줘 즉각적인 반응을 이끌어냅니다.", icon: Zap, color: "text-amber-400" },
        setB: { label: "궁금증 유발 (Curiosity)", desc: "질문이나 반전으로 호기심을 자극하여 내용을 읽게 만듭니다.", icon: Sparkles, color: "text-indigo-400" },
        setC: { label: "신뢰/권위 (Authority)", desc: "공식적인 톤과 인증된 사실로 브랜드 신뢰도를 높입니다.", icon: ShieldCheck, color: "text-emerald-400" },
    };

    // Helper to render a card list
    const renderList = (list: HeadlineCandidate[]) => (
        <div className="grid grid-cols-1 gap-3">
            {list.map((item, i) => {
                const isSelected = selectedIds.includes(item.id);
                // Check if it's in Top 3
                const isTop3 = candidates.recommendedTop3.some(t => t.id === item.id);

                return (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => toggleSelection(item.id)}
                        className={cn(
                            "relative p-5 rounded-2xl border transition-all cursor-pointer group hover:shadow-lg",
                            isSelected
                                ? "bg-indigo-600/20 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                                : "bg-[#12121e] border-white/5 hover:bg-[#1a1a2e] hover:border-white/20"
                        )}
                    >
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    {isTop3 && (
                                        <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/50 px-2 py-0.5 rounded-full">
                                            <Trophy className="w-3 h-3" /> TOP 3
                                        </span>
                                    )}
                                    {item.badges.tone === 'official' && (
                                        <span className="text-[10px] font-bold bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded-full">
                                            공식톤
                                        </span>
                                    )}
                                </div>

                                <h3 className={cn(
                                    "text-lg font-bold leading-tight transition-colors",
                                    isSelected ? "text-white" : "text-slate-300 group-hover:text-white"
                                )}>
                                    &quot;{item.text}&quot;
                                </h3>
                            </div>

                            <div className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center border transition-all shrink-0",
                                isSelected
                                    ? "bg-indigo-500 border-indigo-500 text-white"
                                    : "border-slate-700 bg-slate-800/50 text-transparent group-hover:border-slate-500"
                            )}>
                                <Check className="w-4 h-4" />
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                    <Quote className="w-6 h-6 text-indigo-400" />
                    헤드카피 선택 (최대 3개)
                </h2>
                <p className="text-slate-400">
                    <span className="text-indigo-400 font-bold">{intentLabel}</span> 목적에 맞는 3가지 전략의 헤드카피입니다.
                    <br />가장 마음에 드는 문구를 선택하면, 해당 톤앤매너로 포스터가 설계됩니다.
                </p>

                {/* Selection Counter */}
                <div className="mt-6 inline-flex items-center gap-2 bg-[#12121e] px-4 py-2 rounded-full border border-white/10">
                    <span className="text-sm text-slate-400">선택됨:</span>
                    <span className={cn(
                        "text-lg font-black",
                        selectedIds.length > 0 ? "text-indigo-400" : "text-slate-600"
                    )}>{selectedIds.length}</span>
                    <span className="text-slate-600">/ 3</span>
                </div>
            </div>

            <Tabs defaultValue="setA" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-[#0B0F1A] border border-white/10 p-1 h-auto rounded-xl mb-6">
                    {(["setA", "setB", "setC"] as const).map(setKey => {
                        const info = STRATEGY_INFO[setKey];
                        const count = candidates[setKey]?.filter(c => selectedIds.includes(c.id)).length || 0;
                        const Icon = info.icon;

                        return (
                            <TabsTrigger
                                key={setKey}
                                value={setKey}
                                className="flex flex-col gap-1 py-3 data-[state=active]:bg-[#1A1A2E] data-[state=active]:text-white rounded-lg transition-all"
                            >
                                <div className="flex items-center gap-2">
                                    <Icon className={cn("w-4 h-4", info.color)} />
                                    <span className="font-bold">{info.label}</span>
                                    {count > 0 && (
                                        <span className="bg-indigo-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-1">
                                            {count}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[10px] text-slate-500 font-normal">{info.desc}</span>
                            </TabsTrigger>
                        );
                    })}
                </TabsList>

                <TabsContent value="setA" className="mt-0">
                    {renderList(candidates.setA)}
                </TabsContent>
                <TabsContent value="setB" className="mt-0">
                    {renderList(candidates.setB)}
                </TabsContent>
                <TabsContent value="setC" className="mt-0">
                    {renderList(candidates.setC)}
                </TabsContent>
            </Tabs>

            <div className="mt-8 flex justify-end">
                <Button
                    onClick={handleConfirm}
                    disabled={selectedIds.length === 0}
                    size="lg"
                    className={cn(
                        "font-bold h-14 px-8 rounded-xl transition-all",
                        selectedIds.length > 0
                            ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shdaow-indigo-500/20"
                            : "bg-[#1A1A2E] text-slate-600 cursor-not-allowed"
                    )}
                >
                    다음: 상세 구성 설계
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </div>
        </div>
    );
}

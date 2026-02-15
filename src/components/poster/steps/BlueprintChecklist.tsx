"use client";

import { useState, useEffect } from "react";
import { PosterBlueprint, PosterSlotId } from "@/types/poster";
import { SLOT_LABELS } from "@/lib/poster/poster-constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Lock, Check, LayoutTemplate, ArrowRight } from "lucide-react";

interface BlueprintChecklistProps {
    blueprint: PosterBlueprint;
    onConfirm: (finalSlots: PosterSlotId[]) => void;
}

export function BlueprintChecklist({ blueprint, onConfirm }: BlueprintChecklistProps) {
    const [selectedSlots, setSelectedSlots] = useState<PosterSlotId[]>([]);

    // Initialize selections based on blueprint
    useEffect(() => {
        const initial = [
            ...blueprint.requiredSlots,
            ...blueprint.recommendedSlots // Default recommended to ON for better UX
        ];
        // Deduplicate
        setSelectedSlots(Array.from(new Set(initial)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blueprint.intentId]); // Fixed: Use stable ID instead of object reference to prevent infinite loops

    const toggleSlot = (slotId: PosterSlotId) => {
        if (blueprint.requiredSlots.includes(slotId)) return; // Locked

        if (selectedSlots.includes(slotId)) {
            setSelectedSlots(prev => prev.filter(s => s !== slotId));
        } else {
            setSelectedSlots(prev => [...prev, slotId]);
        }
    };

    const handleNext = () => {
        // Sort by slotOrder defined in blueprint
        const sorted = selectedSlots.sort((a, b) => {
            return blueprint.slotOrder.indexOf(a) - blueprint.slotOrder.indexOf(b);
        });
        onConfirm(sorted);
    };

    const renderSlotItem = (slotId: PosterSlotId, isRequired: boolean) => {
        const isSelected = selectedSlots.includes(slotId);

        return (
            <div
                key={slotId}
                onClick={() => toggleSlot(slotId)}
                className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer",
                    isSelected
                        ? "bg-[#1A1A2E] border-indigo-500/50"
                        : "bg-[#0B0F1A] border-white/5 opacity-60 hover:opacity-100",
                    isRequired && "cursor-not-allowed opacity-90"
                )}
            >
                <div className={cn(
                    "w-6 h-6 rounded flex items-center justify-center border transition-all",
                    isSelected
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "border-slate-600 bg-transparent text-transparent"
                )}>
                    {isRequired ? <Lock className="w-3 h-3" /> : <Check className="w-4 h-4" />}
                </div>

                <span className={cn(
                    "flex-1 font-medium",
                    isSelected ? "text-white" : "text-slate-300"
                )}>
                    {SLOT_LABELS[slotId] || slotId}
                    {isRequired && <span className="text-xs text-indigo-400 ml-2 font-bold">(필수)</span>}
                </span>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-indigo-100 mb-2 flex items-center justify-center gap-2">
                    <LayoutTemplate className="w-6 h-6 text-indigo-400" />
                    정보 설계도 (Blueprint)
                </h2>
                <p className="text-slate-400">
                    선택한 의도에 맞춰 <span className="text-indigo-400 font-bold">필수 항목은 잠금(Lock)</span>되었습니다.
                    <br />추가로 필요한 정보가 있다면 선택해주세요.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                {/* Required Slots (Always First) */}
                {blueprint.requiredSlots.map(s => renderSlotItem(s, true))}

                {/* Recommended Slots */}
                {blueprint.recommendedSlots.map(s => renderSlotItem(s, false))}

                {/* Other slots in order if needed, but for now just req+rec */}
            </div>

            <div className="flex justify-end pt-6 border-t border-white/10">
                <Button
                    size="lg"
                    onClick={handleNext}
                    className="h-14 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                    다음: 내용 생성 및 검수
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </div>
        </div>
    );
}

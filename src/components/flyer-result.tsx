"use client";

import { useState } from "react";
import { GenerateResponse, FlyerSlots } from "@/types/flyer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Sparkles, Wand2, Download } from "lucide-react";
import { toast } from "sonner";
import { SlotLimitKey } from "@/lib/templates/slots";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface FlyerResultProps {
    data: GenerateResponse;
    onRetry: () => void;
}

export function FlyerResult({ data, onRetry }: FlyerResultProps) {
    const [designerMode, setDesignerMode] = useState(false);

    // Helper to copy text
    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} 복사 완료!`);
    };

    // Helper to copy full flyer
    const copyFullFlyer = (variant: string, slots: FlyerSlots) => {
        const fullText = Object.entries(slots)
            .map(([key, val]) => {
                if (key === 'BENEFIT_BULLETS' && Array.isArray(val)) {
                    return val.map(b => `- ${b}`).join('\n');
                }
                return val;
            })
            .join('\n\n');

        copyToClipboard(fullText, `시안 ${variant} 전체`);
    };

    // Helper to download flyer as txt
    const handleDownload = (variant: string, slots: FlyerSlots) => {
        const fullText = Object.entries(slots)
            .map(([key, val]) => {
                if (key === 'BENEFIT_BULLETS' && Array.isArray(val)) {
                    return val.map(b => `- ${b}`).join('\n');
                }
                return val;
            })
            .join('\n\n');

        const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `flyer-option-${variant}.txt`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success(`옵션 ${variant} 다운로드 완료!`);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Meta & Controls */}
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span>AI가 3가지 버전을 제안했어요</span>
                </div>
                <div className="flex items-center gap-2">
                    <Switch id="designer-mode" checked={designerMode} onCheckedChange={setDesignerMode} />
                    <Label htmlFor="designer-mode" className="text-xs cursor-pointer text-slate-600 font-medium select-none">
                        디자이너 모드
                    </Label>
                </div>
            </div>

            {/* Variants Grid */}
            <div className="grid gap-6">
                {Object.entries(data.variants).map(([variantKey, slots]) => (
                    <VariantCard
                        key={variantKey}
                        variant={variantKey}
                        slots={slots}
                        designerMode={designerMode}
                        onCopyFull={() => copyFullFlyer(variantKey, slots)}
                        onCopySlot={copyToClipboard}
                        onDownload={() => handleDownload(variantKey, slots)}
                    />
                ))}
            </div>

            <div className="pt-4 flex justify-center">
                <Button variant="outline" onClick={onRetry} className="gap-2">
                    <Wand2 className="w-4 h-4" />
                    다시 만들기
                </Button>
            </div>

        </div>
    );
}

function VariantCard({
    variant,
    slots,
    designerMode,
    onCopyFull,
    onCopySlot,
    onDownload
}: {
    variant: string;
    slots: FlyerSlots;
    designerMode: boolean;
    onCopyFull: () => void;
    onCopySlot: (text: string, label: string) => void;
    onDownload: () => void;
}) {
    return (
        <Card className="overflow-hidden border-slate-200 shadow-sm transition-all hover:shadow-md bg-white">
            {/* Header */}
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                <span className="font-bold text-slate-700">Option {variant}</span>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5" onClick={onDownload}>
                        <Download className="w-3.5 h-3.5" />
                        TXT 저장
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5" onClick={onCopyFull}>
                        <Copy className="w-3.5 h-3.5" />
                        전체 복사
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-6">
                <SlotItem
                    id="HEADLINE"
                    content={slots.HEADLINE}
                    designerMode={designerMode}
                    onCopy={onCopySlot}
                    className="text-xl font-extrabold text-slate-900 leading-tight"
                />
                <SlotItem
                    id="SUBHEAD"
                    content={slots.SUBHEAD}
                    designerMode={designerMode}
                    onCopy={onCopySlot}
                    className="text-base font-medium text-slate-600"
                />

                {/* Bullets */}
                <div className="space-y-1">
                    {slots.BENEFIT_BULLETS.map((bullet, idx) => (
                        <SlotItem
                            key={idx}
                            id="BENEFIT_BULLETS"
                            label={`Benefit ${idx + 1}`}
                            content={`• ${bullet}`}
                            designerMode={designerMode}
                            onCopy={onCopySlot}
                            className="text-sm text-slate-700"
                        />
                    ))}
                </div>

                <div className="pt-4 border-t border-dashed border-slate-200 space-y-3">
                    <SlotItem
                        id="CTA"
                        content={slots.CTA}
                        designerMode={designerMode}
                        onCopy={onCopySlot}
                        className="inline-block bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold text-center w-full"
                    />
                    <SlotItem
                        id="INFO"
                        content={slots.INFO}
                        designerMode={designerMode}
                        onCopy={onCopySlot}
                        className="text-xs text-slate-500 text-center"
                    />
                    <SlotItem
                        id="DISCLAIMER"
                        content={slots.DISCLAIMER || ""}
                        designerMode={designerMode}
                        onCopy={onCopySlot}
                        className="text-[10px] text-slate-400 text-center"
                    />
                </div>
            </div>
        </Card>
    );
}

function SlotItem({
    id,
    label,
    content,
    designerMode,
    className,
    onCopy
}: {
    id: SlotLimitKey | string;
    label?: string;
    content: string;
    designerMode: boolean;
    className?: string;
    onCopy: (text: string, label: string) => void;
}) {
    if (!content) return null;

    return (
        <div
            className={cn(
                "relative group transition-all rounded px-1 -mx-1",
                designerMode ? "hover:bg-slate-50 py-1" : ""
            )}
            onClick={() => {
                if (designerMode) {
                    const txt = label ?? String(id);
                    onCopy(content, txt);
                }
            }}
        >
            {designerMode && (
                <div className="text-[10px] uppercase font-mono text-blue-500 mb-0.5 flex items-center justify-between select-none">
                    <span>{label || id}</span>
                    <span className="opacity-0 group-hover:opacity-100 bg-blue-50 px-1 rounded text-blue-600 cursor-pointer">
                        복사
                    </span>
                </div>
            )}
            <div className={className}>{content}</div>
        </div>
    );
}

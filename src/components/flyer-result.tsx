
"use client";

import { useState } from "react";
import { GenerateResponse, FlyerSlots, FlyerType } from "@/types/flyer";
import { LeafletVariant } from "@/types/leaflet";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // P1-3 UI
import { Button } from "@/components/ui/button";
import { Copy, Sparkles, Wand2, Download } from "lucide-react";
import { toast } from "sonner";
import { SlotLimitKey } from "@/lib/templates/slots";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { QualityBadge } from "./quality/QualityBadge";
import { QualityDashboard } from "./quality/QualityDashboard";
import { QualityScorecard } from "@/lib/quality/types";

interface FlyerResultProps {
    data: GenerateResponse;
    productType?: FlyerType;
    onRetry: () => void;
}

export function FlyerResult({ data, productType = 'flyer', onRetry }: FlyerResultProps) {
    const [designerMode, setDesignerMode] = useState(false);

    const variantMap: Record<string, string> = {
        A: "01",
        B: "02",
        C: "03"
    };

    const productLabels: Record<FlyerType, string> = {
        flyer: "전단지",
        leaflet: "리플렛",
        brochure: "브로슈어",
        poster: "포스터"
    };

    const productName = productLabels[productType];

    const storeName = data.meta.debug?.inputs?.name || "상호명";

    // Helper to format flyer for export/copy
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formatFlyerForExport = (variantKey: string, slots: any) => {
        const variantNum = variantMap[variantKey] || variantKey;
        const header = `[[${storeName}] ${productName} 카피 시안${variantNum}]\n\n`;

        if (productType === 'leaflet' && (slots as LeafletVariant).pages) {
            const leaflet = slots as LeafletVariant;
            return header + leaflet.pages.map(page => {
                const pageHeader = `[${page.page_id} - ${page.role}]\n`;
                const content = page.sections.map(sec => {
                    const secTypeLabel = sec.type === 'HERO' ? '메인 면' : sec.type;
                    const safeContent = sec.content || {}; // Safety check
                    const secLines = Object.entries(safeContent).map(([k, v]) => `${k}: ${v} `);
                    return `(${secTypeLabel}) \n${secLines.join('\n')} `;
                }).join('\n\n');
                return `${pageHeader}${content} `;
            }).join('\n\n' + '--------------------' + '\n\n');
        }

        const sections = [
            { label: '헤드라인', content: slots.HEADLINE },
            { label: '서브헤드라인', content: slots.SUBHEAD },
            {
                label: '주요 혜택',
                content: Array.isArray(slots.BENEFIT_BULLETS)
                    ? slots.BENEFIT_BULLETS.map((b: string) => `• ${b} `).join('\n')
                    : ''
            },
            { label: '클로징(CTA)', content: slots.CTA },
            { label: '정보(위치/시간)', content: slots.INFO },
            { label: '안내사항', content: slots.DISCLAIMER }
        ];

        return header + sections
            .filter(s => s.content)
            .map(s => `[${s.label}]\n${s.content} `)
            .join('\n\n');
    };

    // Helper to copy text
    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} 복사 완료!`);
    };

    // Helper to copy full flyer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const copyFullFlyer = (variantKey: string, slots: any) => {
        const variantNum = variantMap[variantKey] || variantKey;
        const fullText = formatFlyerForExport(variantKey, slots);
        copyToClipboard(fullText, `시안 ${variantNum} 전체`);
    };

    // Helper to download flyer as txt
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDownload = (variantKey: string, slots: any) => {
        const variantNum = variantMap[variantKey] || variantKey;
        const fullText = formatFlyerForExport(variantKey, slots);
        const fileName = `${storeName}_${productName}_카피_시안${variantNum}.txt`;

        const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
        toast.success(`시안 ${variantNum} 다운로드 완료!`);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Meta & Controls */}
            <div className="flex items-center justify-between glass-card p-4 rounded-xl border border-purple-100/50 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-purple-500">
                    <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                    <span>AI가 최적의 3가지 {productName} 시안을 생성했습니다</span>
                </div>
                <div className="flex items-center gap-3">
                    <Label htmlFor="designer-mode" className="text-xs cursor-pointer text-purple-400 font-medium select-none">
                        디자이너 모드
                    </Label>
                    <Switch id="designer-mode" checked={designerMode} onCheckedChange={setDesignerMode} className="data-[state=checked]:bg-purple-600" />
                </div>
            </div>

            {/* Variants Grid */}
            <div className="grid gap-6">
                {Object.entries(data.variants).map(([variantKey, slots]) => (
                    <VariantCard
                        key={variantKey}
                        variant={variantKey}
                        slots={slots}
                        productType={productType}
                        designerMode={designerMode}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onCopyFull={() => copyFullFlyer(variantKey, slots as any)}
                        onCopySlot={copyToClipboard}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onDownload={() => handleDownload(variantKey, slots as any)}
                    />
                ))}
            </div>

            <div className="pt-6 flex justify-center">
                <Button variant="outline" onClick={onRetry} className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 px-8 h-12 rounded-full transition-all border-none shadow-lg">
                    <Wand2 className="w-4 h-4 text-purple-200" />
                    새로운 문구 뽑기
                </Button>
            </div>

            {/* v7: War Room Transcript */}
            {data.meta.warRoomLogs && (
                <div className="mt-8 border-t border-slate-200 pt-4 animate-in fade-in">
                    <details className="text-xs text-slate-500 group" open>
                        <summary className="cursor-pointer hover:text-slate-800 mb-3 font-bold select-none flex items-center gap-2 transition-colors">
                            <div className="p-1 bg-red-100 rounded">⚔️</div>
                            <span className="text-slate-800 text-sm">War Room Log (AI 전략 회의록)</span>
                        </summary>
                        <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg font-mono whitespace-pre-wrap text-green-400 text-xs shadow-inner max-h-[400px] overflow-y-auto leading-relaxed">
                            {data.meta.warRoomLogs}
                        </div>
                    </details>
                </div>
            )}


        </div>
    );
}

function VariantCard({
    variant,
    slots,
    productType,
    designerMode,
    onCopyFull,
    onCopySlot,
    onDownload
}: {
    variant: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    slots: any;
    productType: FlyerType;
    designerMode: boolean;
    onCopyFull: () => void;
    onCopySlot: (text: string, label: string) => void;
    onDownload: () => void;
}) {
    const isLeaflet = productType === 'leaflet' && (slots as LeafletVariant).pages;
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);

    // Get scorecard from meta
    const scorecard = (slots as any).meta?.quality_scorecard as QualityScorecard;

    return (
        <Card className="overflow-hidden glass-card border-purple-100/50 shadow-xl transition-all hover:shadow-2xl rounded-2xl group">
            {/* Dashboard Modal */}
            {scorecard && (
                <QualityDashboard
                    isOpen={isDashboardOpen}
                    onClose={() => setIsDashboardOpen(false)}
                    scorecard={scorecard}
                />
            )}
            {/* Header */}
            <div className="bg-purple-50/50 px-5 py-3 border-b border-purple-100/30 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="font-black text-xs uppercase tracking-widest text-purple-900">시안 0{variant === 'A' ? '1' : variant === 'B' ? '2' : '3'}</span>
                    {productType === 'leaflet' && (slots as LeafletVariant).meta?.strategy_label && (
                        <Badge variant="outline" className="bg-white text-purple-600 border-purple-200 text-[10px] h-5 shadow-sm">
                            {(slots as LeafletVariant).meta?.strategy_label}
                        </Badge>
                    )}
                    {/* {scorecard && (
                        <QualityBadge
                            score={scorecard.totalScore}
                            pass={scorecard.pass}
                            hardFail={scorecard.hardFail}
                            onClick={() => setIsDashboardOpen(true)}
                        />
                    )} */}
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 text-purple-400 hover:text-purple-900 hover:bg-purple-100" onClick={onDownload}>
                        <Download className="w-3.5 h-3.5" />
                        TXT
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 text-purple-700 hover:text-purple-900 hover:bg-purple-100 font-bold" onClick={onCopyFull}>
                        <Copy className="w-3.5 h-3.5" />
                        전체 복사
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-6">
                {isLeaflet ? (
                    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
                        {(slots as LeafletVariant).pages.map((page) => (
                            <div key={page.page_id} className="p-4 bg-white/50 rounded-xl border border-purple-50 shadow-sm space-y-3 w-full overflow-hidden">
                                <div className="flex justify-between items-center gap-2">
                                    <Badge variant="outline" className="text-[10px] font-bold text-purple-400 border-purple-100 flex-shrink-0">{PAGE_LABEL_MAP[page.page_id] || page.page_id}</Badge>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate">{page.role || ""}</span>
                                </div>
                                <div className="space-y-4">
                                    {page.sections.map((section, idx) => (
                                        <div key={idx} className="space-y-1">
                                            <div className="text-[8px] font-bold text-purple-300 uppercase mb-1">{section.type}</div>
                                            {Object.entries(section.content || {}).map(([key, val]) => (
                                                <EditableSlot
                                                    key={key}
                                                    label={KEY_MAP[key.toLowerCase()] || key}
                                                    value={val}
                                                    designerMode={designerMode}
                                                    onCopy={onCopySlot}
                                                />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <SlotItem
                            id="HEADLINE"
                            content={slots.HEADLINE}
                            designerMode={designerMode}
                            onCopy={onCopySlot}
                            className="text-2xl font-black text-purple-900 leading-tight"
                        />
                        <SlotItem
                            id="SUBHEAD"
                            content={slots.SUBHEAD}
                            designerMode={designerMode}
                            onCopy={onCopySlot}
                            className="text-base font-semibold text-purple-700/80"
                        />

                        {/* Bullets */}
                        <div className="space-y-2">
                            {(slots.BENEFIT_BULLETS || []).map((bullet: string, idx: number) => (
                                <SlotItem
                                    key={idx}
                                    id="BENEFIT_BULLETS"
                                    label={`Benefit ${idx + 1} `}
                                    content={`✦ ${bullet} `}
                                    designerMode={designerMode}
                                    onCopy={onCopySlot}
                                    className="text-sm text-purple-800"
                                />
                            ))}
                        </div>

                        {/* Copy Kit Section (P1-3) */}
                        <CopyKitSection slots={slots} onCopy={onCopySlot} />

                        <div className="pt-6 border-t border-dashed border-purple-100 space-y-4">
                            <SlotItem
                                id="CTA"
                                content={slots.CTA}
                                designerMode={designerMode}
                                onCopy={onCopySlot}
                                className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-xl text-sm font-black text-center w-full shadow-[0_5px_15px_rgba(147,51,234,0.3)]"
                            />
                            {/* Info Slot */}
                            <SlotItem
                                id="INFO"
                                content={slots.INFO}
                                designerMode={designerMode}
                                onCopy={onCopySlot}
                                className="text-xs text-purple-500/80 text-center"
                            />
                            <SlotItem
                                id="DISCLAIMER"
                                content={slots.DISCLAIMER || ""}
                                designerMode={designerMode}
                                onCopy={onCopySlot}
                                className="text-[10px] text-purple-400/70 text-center italic"
                            />
                        </div>
                    </>
                )}
            </div>
        </Card >
    );
}

function CopyKitSection({ slots, onCopy }: { slots: FlyerSlots, onCopy: (text: string, label: string) => void }) {
    if (!slots.headlineVariations) return null;

    return (
        <div className="mt-8 pt-8 border-t border-purple-100 animate-in fade-in">
            <h4 className="text-xs font-black text-purple-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                서브 타이틀
            </h4>

            <div className="space-y-8">
                {/* Headlines */}
                <CopyGroup label="대체 타이틀 (5안)" items={slots.headlineVariations} onCopy={onCopy} />

                {/* Subheads */}
                <CopyGroup label="서브 카피 (5안)" items={slots.subheadVariations} onCopy={onCopy} />

                {/* CTAs */}
                <CopyGroup label="CTA 버튼 문구 (8안)" items={slots.ctaVariations} onCopy={onCopy} type="chip" />

                {/* Trust & Hashtags */}
                <div className="grid grid-cols-1 gap-6">
                    <CopyGroup label="신뢰/안심 문구 (3안)" items={slots.trustVariations} onCopy={onCopy} />
                    <CopyGroup label="해시태그 추천" items={slots.hashtags} onCopy={onCopy} type="tag" />
                </div>
            </div>
        </div>
    );
}

function CopyGroup({
    label,
    items,
    onCopy,
    type = "list"
}: {
    label: string,
    items?: string[],
    onCopy: (t: string, l: string) => void,
    type?: "list" | "chip" | "tag"
}) {
    if (!items || items.length === 0) return null;

    return (
        <div className="space-y-3">
            <label className="text-xs font-bold text-purple-300 uppercase tracking-wide">{label}</label>
            {type === "list" && (
                <div className="space-y-1 bg-purple-50/50 p-2 rounded-xl border border-purple-100 shadow-inner">
                    {items.map((item, i) => (
                        <div key={i} className="flex items-start justify-between text-sm text-purple-800 hover:bg-purple-100 hover:text-purple-900 p-2 rounded-lg cursor-pointer group transition-all"
                            onClick={() => onCopy(item, `${label} ${i + 1} `)}>
                            <span className="leading-relaxed">{item}</span>
                            <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-purple-600 mt-1 transition-opacity" />
                        </div>
                    ))}
                </div>
            )}
            {type === "chip" && (
                <div className="flex flex-wrap gap-2">
                    {items.map((item, i) => (
                        <Badge key={i} variant="secondary"
                            className="cursor-pointer bg-slate-100 text-slate-600 hover:bg-slate-200"
                            onClick={() => onCopy(item, "CTA 문구")}>
                            {item}
                        </Badge>
                    ))}
                </div>
            )}
            {type === "tag" && (
                <div className="flex flex-wrap gap-2 p-3 bg-purple-50/50 rounded-xl border border-purple-100 shadow-inner">
                    {items.slice(0, 15).map((tag, i) => (
                        <span key={i} className="text-xs text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full cursor-pointer hover:bg-purple-200 border border-purple-200 transition-colors"
                            onClick={() => onCopy(tag, "해시태그")}>
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

// Enterprise Spec v1.0: Key Localization Map
const KEY_MAP: Record<string, string> = {
    price: "가격",
    description: "상세설명",
    note: "비고",
    ingredients: "주요성분",
    benefit: "혜택",
    usage: "사용법",
    caution: "주의사항"
};

const PAGE_LABEL_MAP: Record<string, string> = {
    P1: "1면 (앞표지)",
    P2: "2면 (날개)",
    P3: "3면 (내지)",
    P4: "4면 (내지)",
    P5: "5면 (날개)",
    P6: "6면 (뒷표지)"
};

function EditableSlot({
    label,
    value,
    designerMode,
    onCopy
}: {
    label: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
    designerMode: boolean;
    onCopy: (text: string, label: string) => void;
}) {
    if (!designerMode) {
        return (
            <div className="mb-2">
                <SafeRender value={value} />
            </div>
        );
    }

    const textValue = typeof value === 'string' ? value : JSON.stringify(value);

    return (
        <div
            className="relative group border border-dashed border-purple-200 rounded-lg p-3 hover:bg-purple-50/50 transition-all cursor-pointer mb-2"
            onClick={() => onCopy(textValue, label)}
        >
            <div className="absolute -top-2 left-2 bg-white px-1 text-[9px] font-bold text-purple-400 uppercase tracking-wider z-10">
                {label}
            </div>
            <div className="text-sm text-purple-900 font-medium leading-relaxed whitespace-pre-wrap break-words w-full">
                <SafeRender value={value} />
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-purple-600 text-white p-1 rounded-md shadow-sm">
                <Copy className="w-3 h-3" />
            </div>
        </div>
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
                <div className="text-[10px] uppercase font-mono text-purple-400 mb-0.5 flex items-center justify-between select-none">
                    <span>{label || id}</span>
                    <span className="opacity-0 group-hover:opacity-100 bg-purple-100 px-1 rounded text-purple-700 cursor-pointer font-bold">
                        복사
                    </span>
                </div>
            )}
            <div className={cn(className, "break-keep whitespace-pre-wrap w-full")}>{content}</div>
        </div>
    );
}

 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SafeRender({ value }: { value: any }) {
    if (typeof value === "string" || typeof value === "number") {
        return <>{value}</>;
    }
    if (!value) {
        return null;
    }
     
    if (Array.isArray(value)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <>{value.map((v: any, i: any) => <SafeRender key={i} value={v} />)}</>;
    }
    if (typeof value === "object") {
        // Fallback for objects: flatten to string
        return (
            <span className="text-purple-600 font-mono text-xs bg-purple-50 px-1 py-0.5 rounded border border-purple-100">
                {JSON.stringify(value).slice(0, 50)}...
            </span>
        );
    }
    return null;
}

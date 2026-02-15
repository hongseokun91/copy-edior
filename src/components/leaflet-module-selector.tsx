"use client";

import { useState } from "react";
import { LEAFLET_MODULE_CATEGORIES, LEAFLET_MODULES, LeafletModuleDef } from "@/lib/leaflet-modules";
import { EnterpriseCard } from "@/components/enterprise-card";
import { LayoutGroup } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
// import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Check, ClipboardList, Star, Scissors } from "lucide-react";
// import { Layout, Palette, Type, Image as ImageIcon, Box } from "lucide-react";
// import { LayoutGroup, FormInput, AlignLeft, List, Info, MapPin, Quote, Phone, Clock } from "lucide-react";
import { LeafletBlueprint } from "@/components/leaflet-blueprint";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    // import { DialogTrigger } from "@/components/ui/dialog";
} from "@/components/ui/dialog";

interface LeafletModuleSelectorProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: any;
}

export function LeafletModuleSelector({ form }: LeafletModuleSelectorProps) {
    const selectedModules = form.watch("selectedModules") || [];
    const [activeCategory, setActiveCategory] = useState<string>("전체");
    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

    const categories = ["전체", ...LEAFLET_MODULE_CATEGORIES];

    const toggleModule = (id: string) => {
        const current = [...selectedModules];
        if (current.includes(id)) {
            const next = current.filter((m: string) => m !== id);
            form.setValue("selectedModules", next);
            if (activeModuleId === id) setActiveModuleId(null);
        } else {
            if (current.length >= 7) return;
            form.setValue("selectedModules", [...current, id]);
            // Premium Feedback: Auto-open popup on selection
            setActiveModuleId(id);
        }
    };

    const filteredModules = activeCategory === "전체"
        ? LEAFLET_MODULES
        : LEAFLET_MODULES.filter(m => m.category === activeCategory);

    const activeModuleDef = activeModuleId ? LEAFLET_MODULES.find(m => m.id === activeModuleId) : null;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 relative">
            {/* 0. Leaflet Layout Blueprint (Visual Mini-map) */}
            <LeafletBlueprint
                selectedModuleIds={selectedModules}
                activeModuleId={activeModuleId}
                moduleDefs={LEAFLET_MODULES}
                onModuleClick={(id) => setActiveModuleId(id)}
            />

            {/* 1. Category Filter */}
            <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                    <Badge
                        key={cat}
                        variant={activeCategory === cat ? "default" : "outline"}
                        className={cn(
                            "cursor-pointer px-3 py-1.5 transition-all whitespace-nowrap text-sm bg-white hover:bg-slate-50",
                            activeCategory === cat
                                ? "bg-slate-900 text-white hover:bg-slate-800 border-transparent shadow-md"
                                : "text-slate-600 border-slate-200"
                        )}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                    </Badge>
                ))}
            </div>

            {/* 2. Module Grid (STRICTLY STATIC) */}
            <div className="relative">
                <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">추가할 모듈 선택</h3>
                    {selectedModules.length > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">{selectedModules.length}개 선택됨</span>
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-start relative z-10">
                    {filteredModules.map(module => {
                        const isSelected = selectedModules.includes(module.id);
                        return (
                            <div key={module.id} className="relative group">
                                <EnterpriseCard
                                    id={module.id}
                                    icon={module.icon}
                                    label={module.label}
                                    description={module.description}
                                    isSelected={isSelected}
                                    onClick={() => toggleModule(module.id)}
                                    className="w-full"
                                />
                                {isSelected && (
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/80 shadow-sm border border-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all z-20"
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveModuleId(module.id);
                                        }}
                                    >
                                        <Scissors className="h-3.5 w-3.5" />
                                    </Button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 3. V24 Editorial Overlay Workspace (Focused Physical Edit) */}
            <Dialog open={!!activeModuleId} onOpenChange={(open) => !open && setActiveModuleId(null)}>
                <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border border-slate-200 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.1)] rounded-none bg-white animate-in zoom-in-95 duration-300">
                    <div className="flex flex-col h-full ring-1 ring-slate-100">
                        {/* Editorial Header */}
                        <div className="bg-slate-50 p-8 border-b border-slate-100 relative">
                            <div className="absolute top-0 right-0 p-4">
                                <span className="text-[40px] font-black text-slate-100 select-none tracking-tighter italic">V24_EDIT</span>
                            </div>
                            <DialogHeader>
                                <div className="flex items-center gap-6 relative z-10">
                                    <div className="w-16 h-16 rounded-none bg-slate-900 flex items-center justify-center text-3xl shadow-lg ring-4 ring-white">
                                        <span className="text-white">{activeModuleDef?.icon}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-[9px] h-4 px-1.5 border-slate-900 text-slate-900 font-black uppercase tracking-widest rounded-none">
                                                Editorial Slot
                                            </Badge>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Physical Mapping</span>
                                        </div>
                                        <DialogTitle className="text-2xl font-black tracking-tighter text-slate-900 uppercase">
                                            {activeModuleDef?.label}
                                        </DialogTitle>
                                    </div>
                                </div>
                            </DialogHeader>
                        </div>

                        {/* Editorial Body */}
                        <div className="p-8 space-y-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-px bg-slate-900" />
                                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Strategy Insight</h4>
                                </div>
                                <div className="pl-7 border-l border-slate-100">
                                    <p className="text-[14px] text-slate-600 leading-relaxed font-serif italic">
                                        &quot;{activeModuleDef?.description}&quot;
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-px bg-slate-900" />
                                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Detailed Content Setting</h4>
                                </div>
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
                                    {activeModuleId && activeModuleDef && renderSpecializedInput(activeModuleId, activeModuleDef, form)}
                                </div>
                            </div>
                        </div>

                        {/* Editorial Footer */}
                        <div className="p-8 bg-white border-t border-slate-100 flex gap-4">
                            <Button
                                className="flex-1 h-16 rounded-none bg-slate-900 hover:bg-slate-800 text-white text-sm font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 group"
                                type="button"
                                onClick={() => setActiveModuleId(null)}
                            >
                                반영하여 지면 완성하기
                                <Check className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-16 w-16 rounded-none text-red-500 border-slate-200 hover:bg-red-50 hover:border-red-100 transition-all flex items-center justify-center p-0"
                                type="button"
                                title="삭제"
                                onClick={() => {
                                    if (activeModuleId) toggleModule(activeModuleId);
                                    setActiveModuleId(null);
                                }}
                            >
                                <Scissors className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderSpecializedInput(moduleId: string, moduleDef: LeafletModuleDef, form: any) {
    const { control, watch, setValue } = form;

    if (moduleId === 'customer_review') {
        const stars = watch(`moduleData.${moduleId}.stars`) || 5;
        return (
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">추천 별점</span>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                className={cn(
                                    "w-5 h-5 cursor-pointer transition-all",
                                    s <= stars ? "fill-yellow-400 text-yellow-400" : "text-slate-200"
                                )}
                                onClick={() => setValue(`moduleData.${moduleId}.stars`, s)}
                            />
                        ))}
                    </div>
                </div>
                <FormField
                    control={control}
                    name={`moduleData.${moduleId}.text`}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <textarea
                                    placeholder="고객의 실제 후기를 입력해주세요. (예: 사장님이 너무 친절하시고 음식이 맛있어요!)"
                                    className="flex min-h-[80px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 resize-none shadow-sm placeholder:text-slate-300"
                                    {...field}
                                    value={field.value || ""}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>
        );
    }

    if (moduleId === 'detailed_map') {
        return (
            <div className="space-y-3">
                <FormField
                    control={control}
                    name={`moduleData.${moduleId}.address`}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="정확한 매장 주소를 입력해주세요." className="bg-white text-sm h-11" {...field} value={field.value || ""} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name={`moduleData.${moduleId}.parking`}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="주차 팁 (예: 건물 지하 2시간 무료, 발렛 가능)" className="bg-white text-sm h-10" {...field} value={field.value || ""} />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>
        );
    }

    if (moduleId === 'contact_channels') {
        return (
            <div className="grid grid-cols-1 gap-2">
                <FormField
                    control={control}
                    name={`moduleData.${moduleId}.phone`}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="대표 문의 번호" className="bg-white text-sm h-10" {...field} value={field.value || ""} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name={`moduleData.${moduleId}.sns`}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="인스타그램 ID 또는 블로그 주소" className="bg-white text-sm h-10" {...field} value={field.value || ""} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name={`moduleData.${moduleId}.kakao`}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="카카오톡 채널 이름" className="bg-white text-sm h-10" {...field} value={field.value || ""} />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>
        );
    }

    if (moduleId === 'action_coupon') {
        return (
            <div className="space-y-3">
                <FormField
                    control={control}
                    name={`moduleData.${moduleId}.benefit`}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="쿠폰 혜택 (예: 5,000원 할인권, 음료수 1병 서비스)" className="bg-white text-sm h-11 border-purple-200 text-purple-700 font-bold" {...field} value={field.value || ""} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name={`moduleData.${moduleId}.condition`}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="사용 조건 (예: 3만원 이상 결제 시, 리플렛 지참 필수)" className="bg-white text-sm h-10" {...field} value={field.value || ""} />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>
        );
    }

    // Default Fallback: Textarea
    return (
        <FormField
            control={control}
            name={`moduleData.${moduleId}`}
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <textarea
                            placeholder={moduleDef.description}
                            className="flex min-h-[80px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 resize-none shadow-sm placeholder:text-slate-300"
                            {...field}
                            value={field.value && typeof field.value === 'string' ? field.value : ""}
                        />
                    </FormControl>
                </FormItem>
            )}
        />
    );
}

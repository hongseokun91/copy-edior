"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { leafletFormSchema } from "@/lib/schemas";
// import { leafletGoals, leafletIndustries, leafletIndustryClusters } from "@/lib/leaflet/leaflet-constants";
// import { FlyerType } from "@/types/flyer";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    // FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { InlineError } from "@/components/inline-error";
import { Loader2 } from "lucide-react";
// import { cn } from "@/lib/utils";
import { normalizeInput, checkFactCompleteness, MissingFact } from "@/lib/facts";
import { ClarificationModal } from "@/components/clarification-modal";
import { LeafletModuleSelector } from "@/components/leaflet-module-selector";
import { LeafletMapOrchestrator } from "@/components/leaflet/leaflet-map-orchestrator"; // V33
import { FLAGS } from "@/lib/flags"; // V33

interface LeafletFormProps {
    defaultCategory?: string;
    onSubmit?: (values: z.infer<typeof leafletFormSchema>) => void;
    isLoading?: boolean;
    onCategoryChange?: (category: string) => void;
}

export function LeafletForm({
    defaultCategory,
    onSubmit,
    isLoading = false,
    onCategoryChange
}: LeafletFormProps) {
    const form = useForm<z.infer<typeof leafletFormSchema>>({
        resolver: zodResolver(leafletFormSchema),
        defaultValues: {
            category: defaultCategory || "",
            goal: "브랜드정체성",
            name: "",
            contactType: "phone",
            contactValue: "",
            additionalBrief: "",
            brandStory: "",
            brandSubject: "",
            serviceDetails: "",
            trustPoints: "",
            locationTip: "",
            websiteUrl: "",
            instagramId: "",
            businessAddress: "",
            officePhone: "",
        },
        mode: "onChange",
    });

    const watchCategory = useWatch({
        control: form.control,
        name: "category",
    });

    useEffect(() => {
        if (onCategoryChange && watchCategory) {
            onCategoryChange(watchCategory);
        }
    }, [watchCategory, onCategoryChange]);

    const watchContactType = useWatch({
        control: form.control,
        name: "contactType",
    });
    useEffect(() => {
        form.setValue("contactValue", "");
    }, [watchContactType, form]);

    const [showModal, setShowModal] = useState(false);
    const [missingFacts, setMissingFacts] = useState<MissingFact[]>([]);

    function handleSubmit(values: z.infer<typeof leafletFormSchema>) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const brief = normalizeInput(values as any); // Cast for legacy utility
        const missing = checkFactCompleteness(brief);

        if (missing.length > 0) {
            setMissingFacts(missing);
            setShowModal(true);
            return;
        }

        if (onSubmit) {
            onSubmit(values);
        }
    }

    const handleClarificationConfirm = (answers: Record<string, string>) => {
        const currentBrief = form.getValues("additionalBrief") || "";
        const newFacts = Object.entries(answers)
            .map(([key, val]) => {
                const factLabel = missingFacts.find(m => m.id === key)?.label || key;
                return `[정보확인] ${factLabel}: ${val}`;
            })
            .join("\n");

        if (newFacts.trim().length > 0) {
            const updatedBrief = currentBrief ? `${currentBrief}\n${newFacts}` : newFacts;
            form.setValue("additionalBrief", updatedBrief, { shouldDirty: true });
        }

        setShowModal(false);
        const updatedValues = form.getValues();
        if (onSubmit) onSubmit(updatedValues);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
                        e.preventDefault();
                    }
                }}
            >
                {/* 1. Brand Identity Group (Consolidated) */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">🆔</span>
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight">브랜드 정체성 (Brand Identity)</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Leaflet Type Selection */}
                        <FormField
                            control={form.control}
                            name="leafletType"
                            render={({ field }) => (
                                <FormItem className="col-span-full mb-2">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Badge variant="outline" className="text-[10px] h-5 bg-indigo-50 border-indigo-200 text-indigo-600">NEW</Badge>
                                        <FormLabel className="text-[11px] font-bold text-slate-500">리플렛 형태 (접지 방식)</FormLabel>
                                    </div>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="grid grid-cols-3 gap-3"
                                        >
                                            {["2단", "3단", "4단", "N_FOLD", "GATE_FOLD"].map((type) => (
                                                <FormItem key={type} className="flex-1 min-w-[30%]">
                                                    <FormControl>
                                                        <RadioGroupItem value={type} className="peer sr-only" />
                                                    </FormControl>
                                                    <FormLabel className="flex flex-col items-center justify-center rounded-xl border-2 border-slate-100 bg-white p-2 hover:bg-slate-50 hover:border-slate-200 peer-data-[state=checked]:border-indigo-600 peer-data-[state=checked]:text-indigo-600 [&:has([data-state=checked])]:border-indigo-600 cursor-pointer transition-all h-28 shadow-sm peer-data-[state=checked]:shadow-md peer-data-[state=checked]:bg-indigo-50/10 group text-center">
                                                        <div className="mb-2 text-slate-300 group-hover:text-indigo-400 peer-data-[state=checked]:text-indigo-600 transition-colors">
                                                            {/* Icons for each type */}
                                                            {type === "2단" && (
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /><line x1="12" y1="4" x2="12" y2="20" /></svg>
                                                            )}
                                                            {type === "3단" && (
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16M15 4v16" /></svg>
                                                            )}
                                                            {type === "4단" && (
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M7 4v16M12 4v16M17 4v16" /></svg>
                                                            )}
                                                            {type === "N_FOLD" && (
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V4l5.333 16L14.667 4 20 20" /></svg>
                                                            )}
                                                            {type === "GATE_FOLD" && (
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16M15 4v16" /></svg>
                                                            )}
                                                        </div>
                                                        <span className="text-xs font-bold leading-tight">
                                                            {type === "N_FOLD" ? "N-Fold" : type === "GATE_FOLD" ? "Gate Fold" : type}
                                                        </span>
                                                        {(type === "N_FOLD" || type === "GATE_FOLD") && (
                                                            <span className="text-[9px] text-indigo-500 font-medium mt-1">NEW</span>
                                                        )}
                                                    </FormLabel>
                                                </FormItem>
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Industry */}
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="outline" className="text-[10px] h-5 bg-white border-slate-200 text-slate-400">필수</Badge>
                                        <FormLabel className="text-[11px] font-bold text-slate-500">업종 (분야)</FormLabel>
                                    </div>
                                    <FormControl>
                                        <Input
                                            placeholder="예: 법률사무소, 프리미엄 피트니스 등"
                                            {...field}
                                            className="bg-white border-slate-200 text-slate-900 h-11 placeholder:text-slate-300"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[11px]" />
                                </FormItem>
                            )}
                        />

                        {/* Brand Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="outline" className="text-[10px] h-5 bg-white border-slate-200 text-slate-400">필수</Badge>
                                        <FormLabel className="text-[11px] font-bold text-slate-500">브랜드/업체명</FormLabel>
                                    </div>
                                    <FormControl>
                                        <Input placeholder="예: 라이트빈" {...field} className="bg-white border-slate-200 text-slate-900 h-11 placeholder:text-slate-300" />
                                    </FormControl>
                                    <FormMessage className="text-[11px]" />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Core Subject (Full Width) */}
                    <FormField
                        control={form.control}
                        name="brandSubject"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="outline" className="text-[10px] h-5 bg-white border-slate-200 text-slate-400">필수</Badge>
                                    <FormLabel className="text-[11px] font-bold text-slate-500">핵심 주제 (서비스/제품명)</FormLabel>
                                </div>
                                <FormControl>
                                    <Input placeholder="예: 상속 전문 법률 서비스, 프리미엄 1:1 PT" {...field} className="bg-white border-slate-200 text-slate-900 h-11 text-sm shadow-sm" />
                                </FormControl>
                                <FormMessage className="text-[10px]" />
                            </FormItem>
                        )}
                    />
                </div>

                {/* 5. Modular Selector OR V33 Orchestrator */}
                {FLAGS.ENTERPRISE_ORCHESTRATION ? (
                    <LeafletMapOrchestrator form={form} />
                ) : (
                    <LeafletModuleSelector form={form} />
                )}

                {/* Detailed Brief */}
                <CollapsibleBrief form={form} />

                <Button
                    type="submit"
                    size="lg"
                    className="w-full h-14 text-lg font-black shadow-[0_5px_20px_rgba(147,51,234,0.3)] transition-all duration-300 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border-none"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                            <span>AI가 문구를 작성 중입니다...</span>
                        </>
                    ) : (
                        "문구 만들기 (AI)"
                    )}
                </Button>
            </form>

            <ClarificationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                missingFacts={missingFacts}
                onConfirm={handleClarificationConfirm}
                isLoading={isLoading}
            />
        </Form >
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CollapsibleBrief({ form }: { form: any }) {
    const [isOpen, setIsOpen] = useState(true);
    const briefValue = form.watch("additionalBrief");
    const hasValue = briefValue && briefValue.length > 0;

    return (
        <div className="border border-slate-100 bg-slate-50 rounded-2xl transition-all duration-300 overflow-hidden">
            <div
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-100"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2">
                    <span className="text-purple-600">✨</span>
                    <span className="font-bold text-slate-700 text-sm">상세 요청사항 (선택)</span>
                    {hasValue && !isOpen && (
                        <Badge variant="outline" className="bg-purple-100 text-purple-600 border-purple-200 text-xs">작성됨</Badge>
                    )}
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-400 hover:text-black" type="button">
                    {isOpen ? "접기" : "펼치기"}
                </Button>
            </div>

            {isOpen && (
                <div className="px-5 pb-5 animate-in slide-in-from-top-2 fade-in duration-200">
                    <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                        꼭 포함되어야 할 내용을 적어주세요.
                    </p>
                    <FormField
                        control={form.control}
                        name="additionalBrief"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <textarea
                                        className="flex min-h-[100px] w-full rounded-xl border border-purple-100 bg-purple-50/30 px-4 py-3 text-sm text-purple-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 placeholder:text-purple-200 resize-none shadow-inner"
                                        placeholder="여기에 적으신 내용은 AI가 최우선으로 반영합니다."
                                        {...field}
                                    />
                                </FormControl>
                                <InlineError message={form.formState.errors.additionalBrief?.message} />
                            </FormItem>
                        )}
                    />
                </div>
            )}
        </div>
    );
}

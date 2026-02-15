// src/components/brochure/BrochureForm.tsx

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { INDUSTRY_PROFILES } from "@/lib/brochure-profiles";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { brochureFormSchema, BrochureFormValues } from "@/lib/brochure-schemas";
import { BROCHURE_KINDS } from "@/lib/brochure-kinds";
import { BROCHURE_BLOCK_TEMPLATES } from "@/lib/brochure-blocks";

import { BrochureBlockPlan, BrochureBlockType } from "@/types/brochure";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { BrochureBlockBuilder } from "./BrochureBlockBuilder";
import { Loader2, ChevronRight, ChevronLeft, Sparkles, AlertCircle, Shield, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { deriveModuleIdsForQuestions } from "@/lib/brochure-questions/derive";
import { buildQuestionPacks } from "@/lib/brochure-questions/router";
import { Textarea } from "@/components/ui/textarea";

interface BrochureFormProps {
    onSubmit: (values: BrochureFormValues, blocks: BrochureBlockPlan[]) => void;
    isLoading?: boolean;
}

type Step = "KIND" | "ORCHESTRATOR" | "QUESTIONS";






export function BrochureForm({ onSubmit, isLoading }: BrochureFormProps) {
    const [step, setStep] = useState<Step>("KIND");
    const [currentPackIdx, setCurrentPackIdx] = useState(0);
    const [blocks, setBlocks] = useState<BrochureBlockPlan[]>([]);
    const [volume, setVolume] = useState<"standard" | "compact">("standard");
    const [selectedCategory, setSelectedCategory] = useState<"CORPORATE" | "PUBLIC">("CORPORATE");

    const form = useForm<BrochureFormValues>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(brochureFormSchema) as any,
        defaultValues: {
            kindId: "",
            brandName: "",
            format: "A4",
            language: "ko",
            brandTone: "official",
            brandStory: "",
            contactPhone: "",
            websiteUrl: "",
            industryContext: undefined,
            intentId: undefined,
            problemStatement: "",
            claimPolicyMode: "standard",
            dynamicAnswers: {},
            audience: "",
            stage: "",
            totalPages: 4,
        },
    });

    const [watchKindId, currentIndustry, claimPolicyMode] = useWatch({
        control: form.control,
        name: ["kindId", "industryContext", "claimPolicyMode"],
    });

    // Sync default blocks when Kind changes
    useEffect(() => {
        if (watchKindId) {
            const kind = BROCHURE_KINDS.find(k => k.id === watchKindId);
            if (kind) {
                if (volume === "compact") {
                    // 4-Page Compact Mode: Use single specialized block
                    const template = BROCHURE_BLOCK_TEMPLATES.find(t => t.type === "BLOCK_ISOLATED_COMPACT_4P")!;
                    const compactBlock: BrochureBlockPlan = {
                        blockId: `block-compact-${Math.random().toString(36).substr(2, 5)}`,
                        type: "BLOCK_ISOLATED_COMPACT_4P",
                        pages: template.pageRoles.map((role, pIdx) => ({
                            pageId: `P${pIdx + 1}` as `P${number}`,
                            role: role,
                            recommendedModuleIds: template.defaultModuleIdsByRole[role] || [],
                        })),
                    };
                    // eslint-disable-next-line react-hooks/set-state-in-effect
                    setBlocks([compactBlock]);
                    form.setValue("totalPages", 4);
                } else {
                    // Standard Mode: Use default blocks from Kind
                    const initialBlocks = kind.defaultBlocks.map((type, bIdx) => {
                        const template = BROCHURE_BLOCK_TEMPLATES.find(t => t.type === type)!;
                        return {
                            blockId: `block-${bIdx}-${Math.random().toString(36).substr(2, 5)}`,
                            type: type,
                            pages: template.pageRoles.map((role, pIdx) => ({
                                pageId: `P${bIdx * 4 + pIdx + 1}` as `P${number}`,
                                role: role,
                                recommendedModuleIds: template.defaultModuleIdsByRole[role] || [],
                            })),
                        };
                    }) as BrochureBlockPlan[];
                    setBlocks(initialBlocks);
                    form.setValue("totalPages", initialBlocks.length * 4);
                }
            }
        }

    }, [watchKindId, volume, form]);

    const handleAddBlock = (type: BrochureBlockType) => {
        const template = BROCHURE_BLOCK_TEMPLATES.find(t => t.type === type)!;
        setBlocks(prev => {
            const newBlock: BrochureBlockPlan = {
                blockId: `block-${prev.length}-${Math.random().toString(36).substr(2, 5)}`,
                type: type,
                pages: template.pageRoles.map((role) => ({
                    pageId: "P0" as `P${number}`, // Temporary placeholder, recalculated immediately
                    role: role,
                    recommendedModuleIds: template.defaultModuleIdsByRole[role] || [],
                })),
                guidance: { detail: "", mustInclude: [] }
            };

            const list = [...prev];
            // Insert before the last block (which is always the Back block)
            list.splice(list.length - 1, 0, newBlock);

            // Recalculate Page IDs for the entire list
            const updated = list.map((b, bIdx) => ({
                ...b,
                pages: b.pages.map((p, pIdx) => ({
                    ...p,
                    pageId: `P${bIdx * 4 + pIdx + 1}` as `P${number}`
                }))
            }));

            form.setValue("totalPages", updated.length * 4);
            return updated;
        });
    };

    const handleRemoveBlock = (index: number) => {
        setBlocks(prev => {
            const list = prev.filter((_, i) => i !== index);
            const updated = list.map((b, bIdx) => ({
                ...b,
                pages: b.pages.map((p, pIdx) => ({
                    ...p,
                    pageId: `P${bIdx * 4 + pIdx + 1}` as `P${number}`
                }))
            }));
            form.setValue("totalPages", updated.length * 4);
            return updated;
        });
    };

    const handleMoveBlock = (index: number, direction: "up" | "down") => {
        const targetIndex = direction === "up" ? index - 1 : index + 1;

        // Prevent moving fixed blocks (Front 0, Back Last)
        if (index === 0 || index === blocks.length - 1) return;
        if (targetIndex <= 0 || targetIndex >= blocks.length - 1) return;

        setBlocks(prev => {
            const list = [...prev];
            [list[index], list[targetIndex]] = [list[targetIndex], list[index]];

            // Recalculate Page IDs after swap
            return list.map((b, bIdx) => ({
                ...b,
                pages: b.pages.map((p, pIdx) => ({
                    ...p,
                    pageId: `P${bIdx * 4 + pIdx + 1}` as `P${number}`
                }))
            }));
        });
    };

    const handleUpdateBlock = (index: number, updates: Partial<BrochureBlockPlan>) => {
        setBlocks(prev => {
            const list = [...prev];
            list[index] = { ...list[index], ...updates };
            return list;
        });
    };

    // --- Enterprise Grade Reliability Fixes ---
    // 1. Sync Blocks State to Form: Ensure 'blocks' in schema matches visual 'blocks' state
    useEffect(() => {
        form.setValue("blocks", blocks, { shouldValidate: true });
    }, [blocks, form]);

    // 2. Robust Error Handling: Never fail silently
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onInvalid = (errors: any) => {
        console.error("Form Validation Failed:", errors);
        const missingFields = Object.keys(errors).join(", ");
        toast.error(`입력 정보를 확인해주세요: ${missingFields}`, {
            description: "필수 항목이 누락되었습니다."
        });

        // Detailed debug for developers
        if (errors.brandName) toast.error("브랜드/상호명이 누락되었습니다.");
        if (errors.blocks) toast.error("최소 1개 이상의 블록 구성이 필요합니다.");
    };

    const handleNext = async () => {
        if (step === "KIND") {
            // Validate Kind Step including new BrandName
            const isValid = await form.trigger(["kindId", "brandName", "audience", "stage"]);
            if (isValid) setStep("ORCHESTRATOR");
        } else if (step === "ORCHESTRATOR") {
            setStep("QUESTIONS");
            setCurrentPackIdx(0);
        } else if (step === "QUESTIONS") {
            const currentPack = packs[currentPackIdx];
            const fieldsToTrigger = currentPack.questions.map(q =>
                q.mapsTo?.factsKey ? q.mapsTo.factsKey : `dynamicAnswers.${q.id}`
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ) as any[];

            const isValid = await form.trigger(fieldsToTrigger);
            if (isValid) {
                if (currentPackIdx < packs.length - 1) {
                    setCurrentPackIdx(currentPackIdx + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    // 3. Chain Error Handler
                    form.handleSubmit(
                        (v) => onSubmit(v as unknown as BrochureFormValues, blocks),
                        onInvalid
                    )();
                }
            }
        }
    };

    const handleBack = () => {
        if (step === "ORCHESTRATOR") setStep("KIND");
        else if (step === "QUESTIONS") {
            if (currentPackIdx > 0) {
                setCurrentPackIdx(currentPackIdx - 1);
            } else {
                setStep("ORCHESTRATOR");
            }
        }
    };

    // --- Dynamic Question Logic ---
    const matchedProfile = currentIndustry
        ? INDUSTRY_PROFILES.find(p =>
            p.industry.l1 === currentIndustry.l1 &&
            p.industry.l2 === currentIndustry.l2
        )
        : undefined;

    const derivedModuleIds = deriveModuleIdsForQuestions({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        kindId: watchKindId as any,
        selectedBlocks: blocks.map(b => b.type),
    });

    const packs = buildQuestionPacks({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        kindId: watchKindId as any,
        claimPolicyMode: claimPolicyMode,
        selectedBlocks: blocks.map(b => b.type),
        derivedModuleIds,
        requiredEvidence: matchedProfile?.requiredEvidence,
    });

    const currentPack = packs[currentPackIdx];

    const handleStepJump = (targetStep: Step) => {
        const stepOrder: Step[] = ["KIND", "ORCHESTRATOR", "QUESTIONS"];
        const currentIdx = stepOrder.indexOf(step);
        const targetIdx = stepOrder.indexOf(targetStep);

        // Allow backward navigation freely
        if (targetIdx < currentIdx) {
            setStep(targetStep);

            // If jumping back to Questions, start from the beginning or keep state?
            // Resetting to 0 is safer for consistent flow
            if (targetStep === "QUESTIONS") setCurrentPackIdx(0);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(v => onSubmit(v as unknown as BrochureFormValues, blocks))} className="space-y-8">

                {/* Industrial Stepper (Leaflet Standard) */}
                <div className="flex items-center justify-between px-8 py-7 bg-[#050508] rounded-[32px] border border-white/5 shadow-2xl relative overflow-hidden group/stepper">
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover/stepper:opacity-10 transition-opacity">
                        <Sparkles className="h-16 w-16 text-white" />
                    </div>
                    {["전략 설정", "구성 및 기획", "지시서 생성"].map((label, i) => {
                        const stepOrder: Step[] = ["KIND", "ORCHESTRATOR", "QUESTIONS"];
                        const targetStep = stepOrder[i];
                        const currentIdx = stepOrder.indexOf(step);
                        const active = i <= currentIdx;
                        const isPast = i < currentIdx;

                        // Determine if specific step is clickable (only past steps)
                        const isClickable = i < currentIdx;

                        return (
                            <div
                                key={label}
                                onClick={() => isClickable && handleStepJump(targetStep)}
                                className={cn(
                                    "flex flex-col items-center gap-3 flex-1 relative z-10 transition-all",
                                    isClickable ? "cursor-pointer hover:opacity-80" : "cursor-default"
                                )}
                            >
                                <div className={cn(
                                    "w-11 h-11 rounded-2xl flex items-center justify-center text-[13px] font-black transition-all duration-300 border shadow-inner relative",
                                    isPast ? "bg-indigo-600 border-indigo-500 text-white" :
                                        active ? "bg-white border-white/20 text-slate-950 shadow-lg ring-4 ring-indigo-500/20" :
                                            "bg-[#12121e] border-white/5 text-slate-500"
                                )}>
                                    {isPast ? <ChevronRight className="h-5 w-5" /> : i + 1}
                                    {active && !isPast && (
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 border-2 border-[#050508] animate-pulse" />
                                    )}
                                </div>
                                <span className={cn(
                                    "text-[10px] font-black uppercase tracking-[0.1em] transition-colors",
                                    active ? "text-white" : "text-slate-500"
                                )}>{label}</span>
                                {i < 2 && <div className={cn(
                                    "absolute left-[calc(50%+32px)] top-[22px] w-[calc(100%-64px)] h-[1.5px] transition-all duration-500",
                                    isPast ? "bg-indigo-600 shadow-[0_0_8px_rgba(99,102,241,0.5)]" : "bg-white/5"
                                )} />}
                            </div>
                        );
                    })}
                </div>


                <AnimatePresence mode="wait">
                    {step === "KIND" && (
                        <motion.div
                            key="step-kind"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-12"
                        >
                            <div className="space-y-10">



                                <div className="space-y-2">
                                    <Label className="text-[15px] font-black text-slate-500 uppercase tracking-widest pl-1">브랜드/서비스명 <span className="text-red-500">*</span></Label>
                                    <Input
                                        {...form.register("brandName")}
                                        placeholder="기업명 혹은 서비스명을 입력하세요 (예: 삼성전자, 토스)"
                                        className="h-14 text-[16px] font-bold bg-white border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all placeholder:font-normal"
                                    />
                                    {form.formState.errors.brandName && (
                                        <p className="text-[11px] font-bold text-red-500 pl-1">
                                            {form.formState.errors.brandName.message}
                                        </p>
                                    )}
                                </div>



                                <div className="h-px bg-slate-100 mx-1" />

                                <div className="space-y-6">
                                    <div className="flex items-start gap-3 px-1">
                                        <div className="w-1.5 h-4 bg-indigo-600 rounded-full mt-1" />
                                        <h3 className="text-[15px] font-black text-slate-500 uppercase tracking-[0] leading-tight">
                                            브로슈어 유형 설정
                                            <span className="block text-[10px] font-normal text-slate-400 pt-1">Brochure Type Setting</span>
                                        </h3>
                                    </div>
                                    <FormField
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        control={form.control as any}
                                        name="kindId"
                                        render={({ field }) => (
                                            <FormItem>
                                                {/* Category Toggle */}
                                                <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6 shadow-inner">
                                                    {(["CORPORATE", "PUBLIC"] as const).map((cat) => (
                                                        <button
                                                            key={cat}
                                                            type="button"
                                                            onClick={() => setSelectedCategory(cat)}
                                                            className={cn(
                                                                "flex-1 py-4 text-[14px] font-black tracking-wide rounded-xl transition-all duration-300",
                                                                selectedCategory === cat
                                                                    ? "bg-white text-indigo-700 shadow-lg ring-1 ring-indigo-500/10 scale-[1.02]"
                                                                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
                                                            )}
                                                        >
                                                            {cat === "CORPORATE" ? "기업 / 비즈니스" : "공공기관 / 관공서"}
                                                            <span className="block text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">
                                                                {cat === "CORPORATE" ? "Corporate & Business" : "Public Institution"}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <AnimatePresence mode="popLayout">
                                                        {BROCHURE_KINDS.filter(k => k.category === selectedCategory).map((kind) => (
                                                            <motion.div
                                                                key={kind.id}
                                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                exit={{ opacity: 0, scale: 0.9 }}
                                                                transition={{ duration: 0.2 }}
                                                            >
                                                                <Card
                                                                    className={cn(
                                                                        "p-6 cursor-pointer transition-all border relative overflow-hidden group shadow-sm rounded-2xl h-full",
                                                                        field.value === kind.id
                                                                            ? "border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-600/10 shadow-md transform -translate-y-1"
                                                                            : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5"
                                                                    )}
                                                                    onClick={() => field.onChange(kind.id)}
                                                                >
                                                                    <div className="flex flex-col justify-between h-full relative z-10">
                                                                        <div className="space-y-4">
                                                                            <p className={cn(
                                                                                "font-black text-[15px] tracking-tight group-hover:text-indigo-600 transition-colors leading-snug break-keep",
                                                                                field.value === kind.id ? "text-indigo-700" : "text-slate-800"
                                                                            )}>{kind.label}</p>
                                                                            <p className="text-[11px] leading-relaxed text-slate-500 font-medium break-keep opacity-80">{kind.description}</p>
                                                                        </div>
                                                                        {field.value === kind.id && (
                                                                            <div className="flex justify-end mt-4">
                                                                                <div className="bg-indigo-600 p-1.5 rounded-full shadow-lg shadow-indigo-600/20 animate-in zoom-in duration-300">
                                                                                    <Check className="w-3 h-3 text-white" />
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    {field.value === kind.id && (
                                                                        <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-600/5 rounded-bl-full -mr-6 -mt-6 pointer-events-none" />
                                                                    )}
                                                                </Card>
                                                            </motion.div>
                                                        ))}
                                                    </AnimatePresence>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {matchedProfile?.requiredEvidence && (
                                        <div className="p-6 bg-slate-900 border border-white/5 rounded-[24px] shadow-2xl space-y-3 relative overflow-hidden group/evidence">
                                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                                <Shield className="h-12 w-12 text-white" />
                                            </div>
                                            <div className="flex items-center gap-3 text-indigo-400 font-black text-[11px] uppercase tracking-[0.15em] relative z-10">
                                                <AlertCircle className="h-4 w-4" />
                                                컴플라이언스: 근거 자료 확인 필요
                                            </div>
                                            <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-wide relative z-10">
                                                선택한 세그먼트는 높은 신뢰성을 위해 구체적인 증빙 자료가 필요합니다:
                                                <span className="text-white ml-2 italic tracking-widest">{matchedProfile.requiredEvidence.join(", ")}</span>
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-slate-100">
                                    <FormField
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        control={form.control as any}
                                        name="audience"
                                        render={({ field }) => (
                                            <FormItem className="space-y-4">
                                                <div className="flex items-start gap-3 px-1">
                                                    <div className="w-1.5 h-4 bg-indigo-600 rounded-full mt-1" />
                                                    <FormLabel className="text-[15px] font-black text-slate-500 uppercase tracking-[0] mb-0 leading-tight">
                                                        타겟
                                                        <span className="block text-[10px] font-normal text-slate-400 pt-1">Target</span>
                                                    </FormLabel>
                                                </div>
                                                <Select onValueChange={field.onChange} defaultValue={field.value || matchedProfile?.audience}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-12 border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 rounded-xl bg-white text-slate-900 font-medium px-4">
                                                            <SelectValue placeholder="타겟을 선택하세요" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                                                        <SelectItem value="B2B_STAFF" className="py-3 focus:bg-indigo-50 focus:text-indigo-600 font-bold uppercase text-[10px] tracking-widest">기업 실무자 / 담당자</SelectItem>
                                                        <SelectItem value="EXECUTIVE" className="py-3 focus:bg-indigo-50 focus:text-indigo-600 font-bold uppercase text-[10px] tracking-widest">경영진 (C-Level)</SelectItem>
                                                        <SelectItem value="GOVERNMENT" className="py-3 focus:bg-indigo-50 focus:text-indigo-600 font-bold uppercase text-[10px] tracking-widest">정부 / 공공기관</SelectItem>
                                                        <SelectItem value="INVESTOR" className="py-3 focus:bg-indigo-50 focus:text-indigo-600 font-bold uppercase text-[10px] tracking-widest">투자 심사역</SelectItem>
                                                        <SelectItem value="CONSUMER" className="py-3 focus:bg-indigo-50 focus:text-indigo-600 font-bold uppercase text-[10px] tracking-widest">일반 소비자 / 시민</SelectItem>
                                                        <SelectItem value="RECRUIT" className="py-3 focus:bg-indigo-50 focus:text-indigo-600 font-bold uppercase text-[10px] tracking-widest">채용 지원자</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        control={form.control as any}
                                        name="stage"
                                        render={({ field }) => (
                                            <FormItem className="space-y-4">
                                                <div className="flex items-start gap-3 px-1">
                                                    <div className="w-1.5 h-4 bg-indigo-600 rounded-full mt-1" />
                                                    <FormLabel className="text-[15px] font-black text-slate-500 uppercase tracking-[0] mb-0 leading-tight">
                                                        구매 목적
                                                        <span className="block text-[10px] font-normal text-slate-400 pt-1">Purchase Purpose</span>
                                                    </FormLabel>
                                                </div>
                                                <Select onValueChange={field.onChange} defaultValue={field.value || matchedProfile?.stage}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-12 border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 rounded-xl bg-white text-slate-900 font-medium px-4">
                                                            <SelectValue placeholder="도입 단계를 선택하세요" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                                                        <SelectItem value="AWARENESS" className="py-3 focus:bg-indigo-50 focus:text-indigo-600 font-bold uppercase text-[10px] tracking-widest">인지 (Awareness)</SelectItem>
                                                        <SelectItem value="CONSIDERATION" className="py-3 focus:bg-indigo-50 focus:text-indigo-600 font-bold uppercase text-[10px] tracking-widest">기술 검토 (Consideration)</SelectItem>
                                                        <SelectItem value="DECISION" className="py-3 focus:bg-indigo-50 focus:text-indigo-600 font-bold uppercase text-[10px] tracking-widest">의사결정 (Decision)</SelectItem>
                                                        <SelectItem value="PROCUREMENT" className="py-3 focus:bg-indigo-50 focus:text-indigo-600 font-bold uppercase text-[10px] tracking-widest">계약 및 조달 (Procurement)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        control={form.control as any}
                                        name="brandTone"
                                        render={({ field }) => (
                                            <FormItem className="space-y-4">
                                                <div className="flex items-start gap-3 px-1">
                                                    <div className="w-1.5 h-4 bg-indigo-600 rounded-full mt-1" />
                                                    <FormLabel className="text-[15px] font-black text-slate-500 uppercase tracking-[0] mb-0 leading-tight">
                                                        톤앤매너
                                                        <span className="block text-[10px] font-normal text-slate-400 pt-1">Tone & Manner</span>
                                                    </FormLabel>
                                                </div>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-12 border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 rounded-xl bg-white text-slate-900 font-medium px-4">
                                                            <SelectValue placeholder="톤앤매너 선택" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                                                        <SelectItem value="official" className="py-3 focus:bg-indigo-50 focus:text-indigo-600 font-bold uppercase text-[10px] tracking-widest">신뢰 / 비즈니스 (Official)</SelectItem>
                                                        <SelectItem value="premium" className="py-3 focus:bg-indigo-50 focus:text-indigo-600 font-bold uppercase text-[10px] tracking-widest">프리미엄 / 미니멀 (Premium)</SelectItem>
                                                        <SelectItem value="friendly" className="py-3 focus:bg-indigo-50 focus:text-indigo-600 font-bold uppercase text-[10px] tracking-widest">친근 / 협력적 (Friendly)</SelectItem>
                                                        <SelectItem value="tech" className="py-3 focus:bg-indigo-50 focus:text-indigo-600 font-bold uppercase text-[10px] tracking-widest">혁신 / 테크 (Tech)</SelectItem>
                                                        <SelectItem value="investor" className="py-3 focus:bg-indigo-50 focus:text-indigo-600 font-bold uppercase text-[10px] tracking-widest">전략 / 분석 (Investor)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-slate-100">
                                    <FormField
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        control={form.control as any}
                                        name="format"
                                        render={({ field }) => (
                                            <FormItem className="space-y-4">
                                                <div className="flex items-start gap-3 px-1">
                                                    <div className="w-1.5 h-4 bg-indigo-600 rounded-full mt-1" />
                                                    <FormLabel className="text-[15px] font-black text-slate-500 uppercase tracking-[0] mb-0 leading-tight">
                                                        판형
                                                        <span className="block text-[10px] font-normal text-slate-400 pt-1">Format</span>
                                                    </FormLabel>
                                                </div>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-12 border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 rounded-xl bg-white text-slate-900 font-medium px-4">
                                                            <SelectValue placeholder="판형을 선택하세요" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                                                        <SelectItem value="A4" className="py-3 focus:bg-indigo-50 focus:text-indigo-600 font-bold uppercase text-[10px] tracking-widest">A4 (표준형)</SelectItem>
                                                        <SelectItem value="A5" className="py-3 focus:bg-indigo-50 focus:text-indigo-600 font-bold uppercase text-[10px] tracking-widest">A5 (컴팩트)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3 px-1">
                                            <div className="w-1.5 h-4 bg-indigo-600 rounded-full mt-1" />
                                            <label className="text-[15px] font-black text-slate-500 uppercase tracking-[0] mb-0 leading-tight">
                                                분량 및 구성
                                                <span className="block text-[10px] font-normal text-slate-400 pt-1">Volume & Composition</span>
                                            </label>
                                        </div>
                                        <Select onValueChange={(v) => setVolume(v as "standard" | "compact")} defaultValue={volume}>
                                            <SelectTrigger className="h-12 border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 rounded-xl bg-white text-slate-900 font-medium px-4">
                                                <SelectValue placeholder="분량 선택" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                                                <SelectItem value="standard" className="py-3 focus:bg-indigo-50 focus:text-indigo-600 font-bold uppercase text-[10px] tracking-widest">
                                                    Standard (8P+ 기본형)
                                                </SelectItem>
                                                <SelectItem value="compact" className="py-3 focus:bg-indigo-50 focus:text-indigo-600 font-bold uppercase text-[10px] tracking-widest">
                                                    Compact (4P 올인원)
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <FormField
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        control={form.control as any}
                                        name="language"
                                        render={({ field }) => (
                                            <FormItem className="space-y-4">
                                                <div className="flex items-start gap-3 px-1">
                                                    <div className="w-1.5 h-4 bg-indigo-600 rounded-full mt-1" />
                                                    <FormLabel className="text-[15px] font-black text-slate-500 uppercase tracking-[0] mb-0 leading-tight">
                                                        제작 언어
                                                        <span className="block text-[10px] font-normal text-slate-400 pt-1">Language</span>
                                                    </FormLabel>
                                                </div>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-12 border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 rounded-xl bg-white text-slate-900 font-medium px-4">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                                                        <SelectItem value="ko" className="py-3 focus:bg-indigo-50 focus:text-indigo-600 font-bold uppercase text-[10px] tracking-widest">한국어 (국내 표준)</SelectItem>
                                                        <SelectItem value="en" className="py-3 focus:bg-indigo-50 focus:text-indigo-600 font-bold uppercase text-[10px] tracking-widest">영어 (글로벌 표준)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    control={form.control as any}
                                    name="coreNarrative"
                                    render={({ field }) => (
                                        <FormItem className="space-y-4 py-8">
                                            <div className="flex items-start gap-3 px-1">
                                                <div className="w-1.5 h-4 bg-indigo-600 rounded-full mt-1" />
                                                <FormLabel className="text-[15px] font-black text-slate-500 uppercase tracking-[0] mb-0 leading-tight">
                                                    핵심 가이드
                                                    <span className="block text-[10px] font-normal text-slate-400 pt-1">Core Guide</span>
                                                </FormLabel>
                                            </div>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    placeholder="제품의 고유한 특징, 차별화 포인트, 또는 반드시 포함되어야 할 미션 등 AI 엔진이 반영할 구체적인 내러티브를 입력하세요..."
                                                    className="min-h-[140px] p-6 border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 rounded-2xl bg-white text-slate-900 font-medium leading-relaxed resize-none shadow-sm"
                                                />
                                            </FormControl>
                                            <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">
                                                <span>표준 NLP 파서 대기 중</span>
                                                <span>{field.value?.length || 0} / 2000 글자</span>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-end pb-12">
                                    <Button
                                        type="button"
                                        size="lg"
                                        onClick={handleNext}
                                        className="h-14 px-10 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white rounded-[20px] font-black text-[13px] uppercase tracking-[0.2em] shadow-xl hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 border-t border-white/20"
                                    >
                                        오케스트레이터 초기화
                                        <ChevronRight className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === "ORCHESTRATOR" && (
                        <motion.div
                            key="step-orchestrator"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            <BrochureBlockBuilder
                                blocks={blocks}
                                onAddBlock={handleAddBlock}
                                onRemoveBlock={handleRemoveBlock}
                                onMoveBlock={handleMoveBlock}
                                onUpdateBlock={handleUpdateBlock}
                            />
                            <div className="flex justify-between items-center bg-white p-6 rounded-[32px] border border-slate-200 shadow-xl mt-8">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleBack}
                                    className="h-12 px-8 text-slate-500 font-bold text-[11px] uppercase tracking-[0.2em] gap-2 hover:border-indigo-600 hover:text-indigo-600 border-slate-200"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    전략 설정으로 돌아가기
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleNext}
                                    className="h-14 px-10 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white rounded-[20px] font-black text-[13px] uppercase tracking-[0.2em] shadow-xl hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 border-t border-white/20"
                                >
                                    상세 지시서 작성
                                    <ChevronRight className="h-5 w-5" />
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === "QUESTIONS" && currentPack && (
                        <motion.div
                            key={`step-questions-${currentPackIdx}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-12"
                        >
                            <div className="flex flex-col gap-2 border-l-4 border-indigo-600 pl-6 py-1">
                                <h3 className="text-[20px] font-black text-slate-900 tracking-tight uppercase leading-tight">{currentPack.step.title}</h3>
                                {currentPack.step.description && <p className="text-[10px] text-slate-500 font-bold leading-relaxed">{currentPack.step.description}</p>}
                            </div>

                            <div className="space-y-10">
                                {currentPack.questions.map((q) => {
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    const name = q.mapsTo?.factsKey ? (q.mapsTo.factsKey as any) : `dynamicAnswers.${q.id}`;
                                    return (
                                        <FormField
                                            key={q.id}
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            control={form.control as any}
                                            name={name}
                                            render={({ field }) => (
                                                <FormItem className="space-y-5 p-8 bg-white border border-slate-100 rounded-[24px] shadow-sm relative overflow-hidden group/question">
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-12 -mt-12 pointer-events-none transition-colors group-hover/question:bg-indigo-50/50" />
                                                    <div className="space-y-2 relative z-10">
                                                        <FormLabel className="text-[14px] font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-[12px] font-black border border-indigo-100">
                                                                {q.depth}
                                                            </div>
                                                            {q.title}
                                                            {q.requiredBase && <span className="text-red-500 font-black">*</span>}
                                                        </FormLabel>
                                                        <p className="text-[11px] text-slate-500 font-bold leading-relaxed">{q.prompt}</p>
                                                        {q.help && (
                                                            <div className="flex items-center gap-2 text-[9px] text-indigo-400 font-black uppercase tracking-widest italic">
                                                                <AlertCircle className="h-3 w-3" />
                                                                전략 가이드: {q.help}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <FormControl>
                                                        {q.answerType === "textarea" ? (
                                                            <Textarea
                                                                placeholder={q.example || "답변을 입력하세요..."}
                                                                className="min-h-[140px] bg-slate-50/50 border-slate-200 text-slate-900 rounded-2xl focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 font-medium leading-relaxed shadow-inner transition-all p-5"
                                                                {...field}
                                                                value={field.value || ""}
                                                            />
                                                        ) : q.answerType === "select" || q.answerType === "multiselect" ? (
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <SelectTrigger className="h-12 bg-white border-slate-200 text-slate-900 rounded-xl focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 font-medium transition-all shadow-sm px-4">
                                                                    <SelectValue placeholder="선택이 필요합니다..." />
                                                                </SelectTrigger>
                                                                <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                                                                    {q.options?.map(opt => (
                                                                        <SelectItem key={opt.value} value={opt.value} className="py-3 focus:bg-indigo-50 focus:text-indigo-600 font-bold uppercase text-[10px] tracking-widest">{opt.label}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        ) : (
                                                            <div className="relative group/input">
                                                                <Input
                                                                    placeholder={q.example || "답변을 입력하세요..."}
                                                                    className="h-12 bg-white border-slate-200 text-slate-900 rounded-xl focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 font-medium shadow-sm transition-all"
                                                                    {...field}
                                                                    value={field.value || ""}
                                                                />
                                                            </div>
                                                        )}
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    );
                                })}
                            </div>

                            <div className="flex justify-between items-center bg-white p-6 rounded-[32px] border border-slate-200 shadow-xl mt-8">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleBack}
                                    className="h-12 px-8 text-slate-500 font-bold text-[11px] uppercase tracking-[0.2em] gap-2 hover:border-indigo-600 hover:text-indigo-600 border-slate-200"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    {currentPackIdx === 0 ? "구성 수정" : "이전 단계"}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={isLoading}
                                    className="h-14 px-10 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white rounded-[20px] font-black text-[13px] uppercase tracking-[0.2em] shadow-xl hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 border-t border-white/20"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            내용 합성 중...
                                        </>
                                    ) : (
                                        <>
                                            {currentPackIdx < packs.length - 1 ? "다음 핵심 질문" : "최종 브로슈어 생성"}
                                            <Sparkles className="h-5 w-5" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
        </Form>
    );
}

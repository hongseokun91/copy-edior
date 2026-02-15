"use client";

import { PosterMetaState } from "@/lib/poster/poster-types";
import { POSTER_INTENTS, CHANNEL_PACKS, DENSITY_PROFILES } from "@/lib/poster/poster-constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { posterMetaSchema, PosterMetaValues } from "@/lib/poster/poster-schemas";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Settings2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface PosterMetaConfirmProps {
    initialMeta: PosterMetaState;
    onConfirm: (meta: PosterMetaState) => void;
    onBack?: () => void;
}

export function PosterMetaConfirm({ initialMeta, onConfirm, onBack }: PosterMetaConfirmProps) {
    const form = useForm<PosterMetaValues>({
        resolver: zodResolver(posterMetaSchema),
        defaultValues: {
            ...initialMeta,
            intentId: initialMeta.intentId || "INT_PROMO_OFFER",
            headlineType: initialMeta.headlineType || "HL_OFFER_FIRST",
            channelPack: initialMeta.channelPack || "PACK_SNS_1_1",
            densityProfile: initialMeta.densityProfile || "DENSITY_STANDARD",
            claimPolicyMode: "standard",
            facts: initialMeta.facts || {
                who: "",
                what: "",
                why: "",
                tone: "",
                keywords: []
            }
        },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { control } = form;
    // const currentIntent = POSTER_INTENTS.find(i => i.id === selectedIntentId); // Unused for now

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
        const val = e.target.value;
        const arr = val.split(",").map(s => s.trim()).filter(Boolean);
        field.onChange(arr);
    };

    return (
        <div className="w-full max-w-6xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                    <Settings2 className="w-6 h-6 text-indigo-400" />
                    <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        전략 확정 (Strategy Confirmation)
                    </span>
                </h2>
                <p className="text-slate-400">
                    AI가 분석한 핵심 전략입니다. 팩트(Fact)가 정확한지 확인해주세요.
                </p>
            </div>

            <Form {...form}>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <form onSubmit={form.handleSubmit(onConfirm as any)} className="space-y-6">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* LEFT: FACT SHEET (The Strategy) */}
                        {/* LEFT: FACT SHEET (The Strategy) */}
                        <div className="space-y-6 h-full">
                            <div className="bg-[#12121e] border border-indigo-500/30 rounded-2xl p-6 shadow-lg shadow-indigo-500/10 h-full">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-indigo-400" />
                                    핵심 팩트 (Fact Sheet)
                                </h3>
                                <p className="text-xs text-slate-500 mb-6">
                                    이 정보들은 카피 생성의 <strong>절대적인 기준</strong>이 됩니다.
                                </p>

                                <div className="space-y-4">
                                    {/* 1. Who */}
                                    <FormField
                                        control={form.control}
                                        name="facts.who"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-indigo-300 font-bold text-xs uppercase tracking-wide">타겟 (Who)</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="예: 2030 직장인, 강남역 통근자" className="bg-[#0B0F1A] border-slate-700 text-white" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    {/* 2. What */}
                                    <FormField
                                        control={form.control}
                                        name="facts.what"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-indigo-300 font-bold text-xs uppercase tracking-wide">핵심 내용 (What)</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="예: 아메리카노 1+1 이벤트" className="bg-[#0B0F1A] border-slate-700 text-white" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    {/* 3. Why */}
                                    <FormField
                                        control={form.control}
                                        name="facts.why"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-indigo-300 font-bold text-xs uppercase tracking-wide">목적 (Why)</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="예: 신규 고객 유입, 재고 소진" className="bg-[#0B0F1A] border-slate-700 text-white" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    {/* 4. Tone */}
                                    <FormField
                                        control={form.control}
                                        name="facts.tone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-indigo-300 font-bold text-xs uppercase tracking-wide">분위기 (Tone)</FormLabel>
                                                <FormControl>
                                                    <Input {...field} placeholder="예: 고급스러운, 활기찬" className="bg-[#0B0F1A] border-slate-700 text-white" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    {/* 5. Keywords */}
                                    <FormField
                                        control={form.control}
                                        name="facts.keywords"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-indigo-300 font-bold text-xs uppercase tracking-wide">필수 키워드 (Keywords)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        value={field.value?.join(", ") || ""}
                                                        onChange={(e) => handleKeywordsChange(e, field)}
                                                        placeholder="예: 기간한정, 100%무료"
                                                        className="bg-[#0B0F1A] border-slate-700 text-white"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>


                        {/* RIGHT: TECHNICAL SETTINGS */}
                        <div className="space-y-6 h-full">
                            <div className="bg-[#12121e] border border-white/5 rounded-2xl p-6 h-full">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Settings2 className="w-5 h-5 text-slate-400" />
                                    기술 설정 (Specs)
                                </h3>

                                <div className="space-y-6">
                                    {/* Intent Select */}
                                    <FormField
                                        control={form.control}
                                        name="intentId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-400 text-xs uppercase tracking-wider font-bold">포스터 목적 (Intent)</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-12 bg-[#0B0F1A] border-slate-700 text-white">
                                                            <SelectValue placeholder="Select intent" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-[#12121e] border-slate-700 text-white">
                                                        {POSTER_INTENTS.map(intent => (
                                                            <SelectItem key={intent.id} value={intent.id} className="focus:bg-slate-800 focus:text-white">
                                                                <span className="font-bold">{intent.label}</span>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Channel Select */}
                                    <FormField
                                        control={form.control}
                                        name="channelPack"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-400 text-xs uppercase tracking-wider font-bold">매체 (Channel)</FormLabel>
                                                <div className="grid grid-cols-2 gap-2 mt-2">
                                                    {CHANNEL_PACKS.map(pack => (
                                                        <div
                                                            key={pack.id}
                                                            onClick={() => field.onChange(pack.id)}
                                                            className={cn(
                                                                "cursor-pointer rounded-lg border p-3 transition-all",
                                                                field.value === pack.id
                                                                    ? "bg-indigo-500/20 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500/50"
                                                                    : "bg-[#0B0F1A] border-white/5 text-slate-500 hover:border-white/20"
                                                            )}
                                                        >
                                                            <div className="font-bold text-sm">{pack.label}</div>

                                                        </div>
                                                    ))}
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    {/* Density Profile (Formerly Distance) */}
                                    <FormField
                                        control={form.control}
                                        name="densityProfile"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-400 text-xs uppercase tracking-wider font-bold">정보 밀도 (Density)</FormLabel>
                                                <div className="flex flex-col gap-2">
                                                    {DENSITY_PROFILES.map(profile => (
                                                        <div
                                                            key={profile.id}
                                                            onClick={() => field.onChange(profile.id)}
                                                            className={cn(
                                                                "cursor-pointer rounded-lg border p-3 flex items-center justify-between transition-all",
                                                                field.value === profile.id
                                                                    ? "bg-indigo-500/20 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500/50"
                                                                    : "bg-[#0B0F1A] border-white/5 text-slate-500 hover:border-white/20"
                                                            )}
                                                        >
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-sm text-white">{profile.label}</span>
                                                                <span className="text-xs opacity-70">{profile.desc}</span>
                                                            </div>
                                                            {field.value === profile.id && <ShieldCheck className="w-4 h-4 text-indigo-400" />}
                                                        </div>
                                                    ))}
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                        {onBack && (
                            <Button type="button" variant="ghost" onClick={onBack} className="text-slate-500 hover:text-white hover:bg-slate-800">
                                다시 분석하기
                            </Button>
                        )}
                        <Button
                            type="submit"
                            size="lg"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-14 px-8 rounded-xl shadow-lg shadow-indigo-500/20"
                        >
                            <span className="flex flex-col items-start text-left mr-2">
                                <span className="text-xs font-normal opacity-80">Fact 확정 및</span>
                                <span>크리에이티브 생성 시작</span>
                            </span>
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>

                </form>
            </Form>
        </div>
    );
}

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { posterBriefSchema, PosterBriefValues } from "@/lib/poster/poster-schemas";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Sparkles } from "lucide-react";
// import { cn } from "@/lib/utils";

interface PosterBriefEntryProps {
    onSubmit: (brief: string) => void;
}

export function PosterBriefEntry({ onSubmit }: PosterBriefEntryProps) {
    const form = useForm<PosterBriefValues>({
        resolver: zodResolver(posterBriefSchema),
        defaultValues: {
            brief: "",
        },
    });

    const handleSubmit = (values: PosterBriefValues) => {
        onSubmit(values.brief);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="bg-[#0B0F1A] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    Create with One Sentence
                </h2>
                <p className="text-slate-400 text-sm mb-6">
                    어떤 포스터를 만들고 싶으신가요? 업종, 목적, 핵심 혜택, 기간 등을 자유롭게 적어주세요.
                </p>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 relative z-10">
                        <FormField
                            control={form.control}
                            name="brief"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="relative">
                                            <Textarea
                                                placeholder="예: 카페 신메뉴 출시, 2월 한정, 아메리카노+디저트 세트 20% 할인, 서울 강남점"
                                                className="min-h-[140px] bg-[#12121e] border-slate-700/50 text-white placeholder:text-slate-600 rounded-xl resize-none text-lg leading-relaxed focus:border-indigo-500 transition-colors p-5 shadow-inner"
                                                {...field}
                                            />
                                            <div className="absolute bottom-4 right-4 text-xs text-slate-500">
                                                {field.value.length}/200
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 group/btn"
                        >
                            <span className="group-hover/btn:translate-x-1 transition-transform">
                                분석 및 디자인 제안 받기
                            </span>
                            <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                    </form>
                </Form>
            </div>

            {/* Examples */}
            <div className="mt-8 flex flex-col gap-3 text-center">
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Example Briefs</p>
                <div className="flex flex-wrap justify-center gap-2">
                    {[
                        "공공기관 지원사업 안내, 접수 2/10~2/28, 대상 소상공인",
                        "수제버거 런칭 이벤트, 소진 시 조기종료, 100% 한우 패티",
                        "주말 플리마켓 셀러 모집, 이번 주말까지, 선착순 20팀"
                    ].map((ex, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => form.setValue("brief", ex)}
                            className="text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-colors border border-white/5"
                        >
                            {ex}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

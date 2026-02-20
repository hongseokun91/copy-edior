"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
// import { ArrowRight, Sparkles, Zap, Smartphone, Globe, Briefcase, ShoppingBag, Utensils, GraduationCap, Loader2 } from "lucide-react";
import { ArrowRight, Loader2 } from "lucide-react";
// import { POSTER_INDUSTRIES } from "@/lib/poster/constants";
import { PosterCategorySelector } from "@/components/poster/ui/PosterCategorySelector";

interface PosterGatewaySearchProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onAnalyze: (brief: string, industry: string, referenceUrl?: string) => Promise<any>;
}

export function PosterGatewaySearch({ onAnalyze }: PosterGatewaySearchProps) {
    const [brief, setBrief] = useState("");
    const [industry, setIndustry] = useState("");
    const [referenceUrl, setReferenceUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!brief.trim()) return;

        setIsLoading(true);
        try {
            await onAnalyze(brief, industry, referenceUrl);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4">
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

                <div className="relative bg-[#0F111A] border border-white/10 rounded-xl p-4 shadow-2xl flex flex-col gap-4">
                    {/* Industry Selector */}
                    {/* Industry Selector */}
                    <PosterCategorySelector value={industry} onValueChange={setIndustry} />

                    {/* Brief Input */}
                    <div className="flex-1 relative">
                        <Textarea
                            value={brief}
                            onChange={(e) => setBrief(e.target.value)}
                            placeholder="어떤 포스터가 필요하신가요? (예: 홍대 카페 오픈 20% 할인 이벤트)"
                            className="w-full bg-transparent border-none text-lg text-white placeholder:text-slate-400 focus-visible:ring-0 resize-none min-h-[80px] leading-relaxed p-2"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                        />
                    </div>
                    {/* Reference URL Input */}
                    <div className="flex-none pt-2 border-t border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                            {/* <span className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Visual Reference</span> */}
                            <span className="text-[10px] text-slate-500">참고할 URL (선택): AI가 디자인/톤을 분석합니다</span>
                        </div>
                        <Input
                            value={referenceUrl}
                            onChange={(e) => setReferenceUrl(e.target.value)}
                            placeholder="참고할 웹사이트/SNS URL (선택항목)"
                            className="bg-white/5 border-white/10 text-xs h-9 text-white placeholder:text-slate-600 focus-visible:ring-indigo-500/50"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-center gap-2">
                <Button
                    type="submit"
                    size="lg"
                    disabled={!brief.trim() || !industry || isLoading}
                    className="h-14 px-8 rounded-full text-lg font-bold bg-white text-black hover:bg-slate-200 transition-all hover:scale-105"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            분석 중...
                        </>
                    ) : (
                        <>
                            포스터 기획 시작하기 <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}

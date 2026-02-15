/* eslint-disable */
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FlyerForm } from "@/components/flyer-form";
import { LeafletForm } from "@/components/leaflet/leaflet-form";
import { BrochureForm } from "@/components/brochure/BrochureForm";
import { BrochurePreview } from "@/components/brochure/BrochurePreview";
import { PosterGenerator } from "@/components/poster/PosterGenerator";
import { StyleSelector } from "@/components/style-selector";
import * as z from "zod";
import { flyerFormSchema, leafletFormSchema } from "@/lib/schemas";
import { FlyerResult } from "@/components/flyer-result";
import { GenerateResponse } from "@/types/flyer";
import { BrochureOutput, BrochureBlockPlan } from "@/types/brochure";
import { toast } from "sonner";

function MakePageContent() {
    const searchParams = useSearchParams();
    const defaultCategory = searchParams.get("category") || "";
    const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
    const [selectedProduct, setSelectedProduct] = useState<"flyer" | "leaflet" | "brochure" | "poster">("flyer");
    const [selectedStyleId, setSelectedStyleId] = useState("");
    const [selectedTone, setSelectedTone] = useState<"friendly" | "premium" | "direct">("friendly");

    const [result, setResult] = useState<GenerateResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleCategoryChange = (val: string) => {
        setSelectedCategory(val);
    };

    const [debugError, setDebugError] = useState<string | null>(null);

    const handleFormSubmit = async (values: any, extra?: any) => {
        toast.info("생성형 AI로 문구를 생성 중입니다. 대략 30초 정도 소요됩니다.");
        setIsLoading(true);
        setResult(null);
        setDebugError(null);

        // Client-Side Timeout (60s) for Real AI Latency
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000); // 120s for full pipeline

        try {
            const endpoint = selectedProduct === "brochure" ? "/api/generate/brochure" : "/api/generate";
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: selectedProduct,
                    tone: selectedTone,
                    styleId: selectedStyleId || "default", // Fallback
                    inputs: values,
                    extra: extra // Used for Brochure Block structure
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            const data = await res.json();

            if (!res.ok) {
                const msg = data.message || "Server Error";
                setDebugError(`Server Error (${res.status}): ${msg}`);
                toast.error(msg);
                setIsLoading(false);
                return;
            }

            // SUCCESS
            setIsLoading(false); // Stop Spinner

            // Delay Rendering
            setTimeout(() => {
                try {
                    setResult(data as GenerateResponse);
                    setTimeout(() => {
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                    }, 100);
                } catch (renderError: any) {
                    console.error("Render Error:", renderError);
                    setDebugError(`UI Render Error: ${renderError.message}`);
                }
            }, 50);

        } catch (e: unknown) {
            console.error(e);
            clearTimeout(timeoutId);
            setIsLoading(false); // Ensure stop on error

            const err = e as Error;
            if (err.name === 'AbortError') {
                setDebugError("Client Error: Request Timed Out (120s). Server took too long.");
                toast.error("요청 시간이 초과되었습니다.");
            } else {
                setDebugError(`Client Error: ${err.message}\n${err.stack}`);
                toast.error("네트워크/로직 오류");
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="sticky top-0 z-50 glass-card px-4 py-4 flex items-center justify-between shadow-sm mb-6">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Flyer Copy
                    </h1>
                </div>

                <Tabs value={selectedProduct} onValueChange={(v) => setSelectedProduct(v as "flyer" | "leaflet" | "brochure" | "poster")} className="hidden md:block">
                    <TabsList className="bg-purple-100/50 border border-purple-200 h-9">
                        <TabsTrigger value="flyer" className="text-xs data-[state=active]:bg-purple-600 data-[state=active]:text-white">전단지</TabsTrigger>
                        <TabsTrigger value="leaflet" className="text-xs data-[state=active]:bg-purple-600 data-[state=active]:text-white">리플렛</TabsTrigger>
                        <TabsTrigger value="brochure" className="text-xs data-[state=active]:bg-purple-600 data-[state=active]:text-white">브로슈어</TabsTrigger>
                        <TabsTrigger value="poster" className="text-xs data-[state=active]:bg-purple-600 data-[state=active]:text-white">포스터</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex items-center gap-2">
                    <Select value={selectedTone} onValueChange={(v) => setSelectedTone(v as "friendly" | "premium" | "direct")}>
                        <SelectTrigger className="w-[110px] h-9 text-xs bg-purple-50 border-purple-100 text-purple-900 hover:bg-purple-100 transition-colors">
                            <SelectValue placeholder="톤" />
                        </SelectTrigger>
                        <SelectContent className="glass-card text-purple-900 border-purple-100">
                            <SelectItem value="friendly">친근하게</SelectItem>
                            <SelectItem value="premium">고급스럽게</SelectItem>
                            <SelectItem value="direct">직설적으로</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </header>

            {/* Main Content */}
            {selectedProduct === 'poster' ? (
                <div className="w-full">
                    <PosterGenerator />
                </div>
            ) : (
                <main className={`${selectedProduct === 'brochure' ? 'max-w-3xl' : 'max-w-md'} mx-auto px-4 py-8`}>
                    {/* Form Section */}
                    <section className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 p-6">
                        <div className="md:hidden mb-6">
                            <Tabs value={selectedProduct} onValueChange={(v) => setSelectedProduct(v as "flyer" | "leaflet" | "brochure" | "poster")}>
                                <TabsList className="bg-purple-100/50 border border-purple-200 h-9 w-full grid grid-cols-4">
                                    <TabsTrigger value="flyer" className="text-xs data-[state=active]:bg-purple-600 data-[state=active]:text-white">전단지</TabsTrigger>
                                    <TabsTrigger value="leaflet" className="text-xs data-[state=active]:bg-purple-600 data-[state=active]:text-white">리플렛</TabsTrigger>
                                    <TabsTrigger value="brochure" className="text-xs data-[state=active]:bg-purple-600 data-[state=active]:text-white">브로슈어</TabsTrigger>
                                    <TabsTrigger value="poster" className="text-xs data-[state=active]:bg-purple-600 data-[state=active]:text-white">포스터</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        <h2 className="text-xl font-bold mb-6 text-purple-900 flex items-center gap-2">
                            <span className="text-purple-600">✨</span> {selectedProduct === 'flyer' ? '전단지' : selectedProduct === 'leaflet' ? '리플렛' : selectedProduct === 'brochure' ? '브로슈어' : '포스터'}의 내용을 넣어볼까요?
                        </h2>
                        {selectedProduct === 'leaflet' ? (
                            <LeafletForm
                                defaultCategory={defaultCategory}
                                onCategoryChange={handleCategoryChange}
                                onSubmit={handleFormSubmit}
                                isLoading={isLoading}
                            />
                        ) : selectedProduct === 'brochure' ? (
                            <BrochureForm
                                onSubmit={(values, blocks) => handleFormSubmit(values, { blocks })}
                                isLoading={isLoading}
                            />
                        ) : (
                            <FlyerForm
                                defaultCategory={defaultCategory}
                                productType={selectedProduct}
                                onCategoryChange={handleCategoryChange}
                                onSubmit={handleFormSubmit}
                                isLoading={isLoading}
                            />
                        )}
                    </section>

                    {/* Result Section (P1-2: Strict UI Policy) */}
                    <section className="mt-8 pt-8 border-t border-slate-200">
                        {result ? (
                            selectedProduct === 'brochure' ? (
                                <BrochurePreview data={(result as any).output || result} warnings={(result as any).gate?.warnings || (result as any).warnings} />
                            ) : (
                                <FlyerResult
                                    data={result as GenerateResponse}
                                    productType={selectedProduct}
                                    onRetry={() => {
                                        setResult(null);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                />
                            )
                        ) : debugError ? (
                            // Error Card (P1-2)
                            <div className="p-8 border-2 border-red-100 rounded-xl bg-red-50 text-center">
                                <div className="text-4xl mb-3">⚠️</div>
                                <h3 className="text-lg font-bold text-red-900 mb-2">생성 실패 (Server Error)</h3>
                                <p className="text-sm text-red-700 mb-4">
                                    일시적인 시스템 오류로 문구를 생성하지 못했습니다.<br />
                                    잠시 후 다시 시도해주세요.
                                </p>
                                <div className="text-xs font-mono text-red-500 bg-white/50 p-2 rounded mb-4 overflow-x-auto max-w-full">
                                    {debugError}
                                </div>
                                <Button
                                    variant="outline"
                                    className="border-red-200 text-red-700 hover:bg-red-100"
                                    onClick={() => handleFormSubmit(selectedCategory)} // Simple retry logic if form still valid
                                >
                                    다시 시도하기
                                </Button>
                            </div>
                        ) : (
                            // Default Placeholder
                            <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-center text-slate-400">
                                <p>👆 위 내용을 입력하면<br />규격에 딱 맞는 문구가 나옵니다.</p>
                            </div>
                        )}
                    </section>
                </main>
            )}
        </div>
    );
}

export default function MakePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MakePageContent />
        </Suspense>
    );
}

"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FlyerForm } from "@/components/flyer-form";
import { StyleSelector } from "@/components/style-selector";
import * as z from "zod";
import { flyerFormSchema } from "@/lib/schemas";
import { FlyerResult } from "@/components/flyer-result";
import { GenerateResponse } from "@/types/flyer";
import { toast } from "sonner";

function MakePageContent() {
    const searchParams = useSearchParams();
    const defaultCategory = searchParams.get("category") || "";
    const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
    const [selectedStyleId, setSelectedStyleId] = useState("");
    const [selectedTone, setSelectedTone] = useState<"friendly" | "premium" | "direct">("friendly");

    const [result, setResult] = useState<GenerateResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleCategoryChange = (val: string) => {
        setSelectedCategory(val);
    };

    const handleFormSubmit = async (values: z.infer<typeof flyerFormSchema>) => {
        setIsLoading(true);
        setResult(null);

        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: "flyer",
                    tone: selectedTone,
                    styleId: selectedStyleId || "default", // Fallback
                    inputs: values
                })
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 429) {
                    toast.error(data.message || "이용량이 많습니다. 잠시 후 시도해주세요.");
                } else {
                    toast.error("생성에 실패했습니다. 다시 시도해주세요.");
                }
                return;
            }

            setResult(data as GenerateResponse);
            // Scroll to result (simple impl)
            setTimeout(() => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }, 100);

        } catch (e) {
            console.error(e);
            toast.error("네트워크 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                    <Tabs defaultValue="flyer" className="w-[140px]">
                        <TabsList className="grid w-full grid-cols-1">
                            <TabsTrigger value="flyer">전단지 (1면)</TabsTrigger>
                            {/* <TabsTrigger value="leaflet" disabled>3단 (준비중)</TabsTrigger> */}
                        </TabsList>
                    </Tabs>
                </div>

                <div className="flex items-center gap-2">
                    <Select value={selectedTone} onValueChange={(v) => setSelectedTone(v as "friendly" | "premium" | "direct")}>
                        <SelectTrigger className="w-[100px] h-9 text-xs">
                            <SelectValue placeholder="톤" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="friendly">친근하게</SelectItem>
                            <SelectItem value="premium">고급스럽게</SelectItem>
                            <SelectItem value="direct">직설적으로</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-md mx-auto p-4 space-y-6">

                {/* Style Section */}
                <section className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                    <StyleSelector
                        category={selectedCategory}
                        selectedStyleId={selectedStyleId}
                        onSelect={setSelectedStyleId}
                    />
                </section>

                {/* Form Section */}
                <section className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold mb-4 text-slate-800">
                        어떤 내용을 넣을까요?
                    </h2>
                    <FlyerForm
                        defaultCategory={defaultCategory}
                        onCategoryChange={handleCategoryChange}
                        onSubmit={handleFormSubmit}
                        isLoading={isLoading}
                    />
                </section>

                {/* Result Section */}
                <section className="mt-8 pt-8 border-t border-slate-200">
                    {result ? (
                        <FlyerResult
                            data={result}
                            onRetry={() => {
                                setResult(null);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        />
                    ) : (
                        <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-center text-slate-400">
                            <p>👆 위 내용을 입력하면<br />규격에 딱 맞는 문구가 나옵니다.</p>
                        </div>
                    )}
                </section>
            </main>
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

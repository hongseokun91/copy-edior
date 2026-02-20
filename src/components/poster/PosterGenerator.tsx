"use client";

import { useState } from "react";
import { PosterResult, PosterSlotId } from "@/types/poster";
import { PosterGatewaySearch } from "./steps/PosterGatewaySearch";
import { PosterMetaConfirm } from "./steps/PosterMetaConfirm";
import { PosterFactSheet } from "@/lib/poster/poster-types";
import { PosterHeadlineSelector } from "./steps/PosterHeadlineSelector";
import { BlueprintChecklist } from "./steps/BlueprintChecklist";
import { PosterPreviewExporter } from "./steps/PosterPreviewExporter";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

export function PosterGenerator() {
    const [step, setStep] = useState<"ENTRY" | "META_CONFIRM" | "HEADLINE" | "BLUEPRINT" | "PREVIEW">("ENTRY");

    // Core State
    const [brief, setBrief] = useState("");
    const [posterResult, setPosterResult] = useState<PosterResult | null>(null);

    // UI Loading States
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isGeneratingHeadlines, setIsGeneratingHeadlines] = useState(false);
    const [isGeneratingBody, setIsGeneratingBody] = useState(false);

    // Step 0 -> 1: Analyze Brief
    const handleBriefAnalyze = async (inputBrief: string, industry: string, referenceUrl?: string) => {
        setBrief(inputBrief);
        setIsAnalyzing(true);
        try {
            const response = await fetch("/api/poster/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ brief: inputBrief, industry, referenceUrl })
            });

            if (!response.ok) throw new Error("Analysis failed");

            const detectedMeta: PosterFactSheet = await response.json();
            // setBrief(detectedMeta); // Removed erroneous call

            // Initialize result with meta, others empty
            setPosterResult({
                meta: {
                    ...detectedMeta,
                    industryHint: industry,
                    brief: inputBrief,
                    intentId: detectedMeta.intentId || "INT_PROMO_OFFER",
                    headlineType: detectedMeta.headlineType || "HL_OFFER_FIRST",
                    channelPack: detectedMeta.channelPack || "PACK_SNS_1_1",
                    densityProfile: detectedMeta.densityProfile || "DENSITY_STANDARD",
                    claimPolicyMode: detectedMeta.claimPolicyMode || "standard",
                    referenceUrl: referenceUrl // Persist referenceUrl in meta
                },
                headlineCandidates: { setA: [], setB: [], setC: [], recommendedTop3: [] },
                blueprint: { intentId: detectedMeta.intentId || "INT_PROMO_OFFER", requiredSlots: [], recommendedSlots: [], slotOrder: [] }, // temporary
                content: {},
                compliance: { warnings: [], requiredDisclaimers: [] }
            });
            setStep("META_CONFIRM");
        } catch (error) {
            console.error(error);
            alert("분석 중 오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Step 1 -> 2: Confirm Meta & Generate Headlines
    const handleMetaConfirm = async (confirmedMeta: PosterFactSheet) => {
        setIsGeneratingHeadlines(true);
        try {
            const response = await fetch("/api/poster/headlines", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ meta: confirmedMeta })
            });

            if (!response.ok) throw new Error("Headline generation failed");

            const resultWithHeadlines = await response.json();
            setPosterResult(resultWithHeadlines);
            setStep("HEADLINE");
        } catch (error) {
            console.error(error);
            alert("헤드카피 생성 중 오류가 발생했습니다.");
        } finally {
            setIsGeneratingHeadlines(false);
        }
    };

    // Step 2 -> 3: Select Headline -> Blueprint
    const handleHeadlineSelect = (selectedIds: string[]) => {
        if (!posterResult) return;

        // Save selected headline text to content for now
        // In reality, we'd query by ID. Here we assume the mock returned matching IDs.
        const selectedHeadline = posterResult.headlineCandidates.setA.find(h => h.id === selectedIds[0])?.text
            || posterResult.headlineCandidates.recommendedTop3.find(h => h.id === selectedIds[0])?.text
            || "Selected Headline";

        setPosterResult(prev => prev ? ({
            ...prev,
            content: { ...prev.content, "S_HEADLINE": selectedHeadline }
        }) : null);

        setStep("BLUEPRINT");
    };

    // Step 3 -> 4: Confirm Blueprint -> Generate Body -> Preview
    const handleBlueprintConfirm = async (finalSlots: PosterSlotId[]) => {
        if (!posterResult) return;

        setIsGeneratingBody(true);
        try {
            // Generate full body copy
            const response = await fetch("/api/poster/body", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    meta: posterResult.meta,
                    selectedHeadline: posterResult.content["S_HEADLINE"] || "",
                    blueprint: posterResult.blueprint
                })
            });

            if (!response.ok) throw new Error("Body generation failed");

            const bodyContent = await response.json();

            // Merge with existing content
            setPosterResult(prev => prev ? ({
                ...prev,
                content: { ...prev.content, ...bodyContent }
            }) : null);

            setStep("PREVIEW");
        } catch (error) {
            console.error("Body Gen Error:", error);
            alert("포스터 카피 생성 중 오류가 발생했습니다.");
        } finally {
            setIsGeneratingBody(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                    Enterprise Poster Generator
                </h1>
                <p className="text-slate-400">
                    한 줄 요약으로 전문가급 포스터 기획/구성/카피를 완성하세요.
                </p>
            </header>

            <div className="max-w-6xl mx-auto relative min-h-[600px]">
                {/* Global Loader Overlay */}
                {/* Global Loader Overlay */}
                {(isAnalyzing || isGeneratingHeadlines || isGeneratingBody) && (
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050508]/80 backdrop-blur-sm rounded-3xl">
                        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                        <p className="text-lg font-bold text-white">
                            {isAnalyzing && "Brief 내용을 분석하고 있습니다..."}
                            {isGeneratingHeadlines && "헤드카피 전략을 수립하는 중..."}
                            {isGeneratingBody && "최적의 포스터 카피를 생성하고 있습니다..."}
                        </p>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {step === "ENTRY" && (
                        <motion.div
                            key="entry"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <PosterGatewaySearch onAnalyze={handleBriefAnalyze} />
                        </motion.div>
                    )}

                    {step === "META_CONFIRM" && posterResult && (
                        <motion.div
                            key="meta"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {/* We reuse the existing component but might need to cast props or ensure compatibility */}
                            <PosterMetaConfirm
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                initialMeta={posterResult.meta as any}
                                onConfirm={handleMetaConfirm}
                                onBack={() => setStep("ENTRY")}
                            />
                        </motion.div>
                    )}

                    {step === "HEADLINE" && posterResult && (
                        <motion.div
                            key="headline"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <PosterHeadlineSelector
                                intentId={posterResult.meta.intentId}
                                candidates={posterResult.headlineCandidates}
                                onSelect={handleHeadlineSelect}
                            />
                        </motion.div>
                    )}

                    {step === "BLUEPRINT" && posterResult && (
                        <motion.div
                            key="blueprint"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <BlueprintChecklist
                                blueprint={posterResult.blueprint}
                                onConfirm={handleBlueprintConfirm}
                            />
                        </motion.div>
                    )}

                    {step === "PREVIEW" && posterResult && (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <PosterPreviewExporter result={posterResult} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

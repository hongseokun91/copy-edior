"use client";

import { useState } from "react";
// import { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
// import { DialogHeader, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LEAFLET_MODULES, LeafletModuleDef } from "@/lib/leaflet-modules";
import { cn } from "@/lib/utils";
import { Sparkles, Check, Lightbulb, PenTool } from "lucide-react";
// import { X, MessageSquare, Loader2 } from "lucide-react";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { Loader2 } from "lucide-react";
// import { X, MessageSquare } from "lucide-react";
import { Star } from "lucide-react";

interface LeafletWriterModalProps {
    isOpen: boolean;
    moduleId: string | null;
    onClose: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: any;
}

export function LeafletWriterModal({ isOpen, moduleId, onClose, form }: LeafletWriterModalProps) {
    const moduleDef = moduleId ? LEAFLET_MODULES.find(m => m.id === moduleId) : null;
    const [isGenerating, setIsGenerating] = useState(false);

    if (!moduleId || !moduleDef) return null;

    // Simulate AI Generation
    const handleAiGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            const currentVal = form.getValues(`moduleData.${moduleId}.text`) || "";
            const newVal = currentVal
                ? `${currentVal}\n\n[AI가 다듬은 문장]\n더욱 매력적이고 신뢰감을 주는 표현으로 수정되었습니다.`
                : `[AI 자동 생성]\n${moduleDef.label}에 적합한 추천 문구입니다.\n고객의 마음을 움직이는 핵심 메시지를 담고 있습니다.`;

            form.setValue(`moduleData.${moduleId}.text`, newVal);
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl h-[600px] flex flex-col p-0 gap-0 bg-slate-50 overflow-hidden z-[100]">
                {/* Header */}
                <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl border border-indigo-100">
                            {moduleDef.icon}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-slate-100 text-slate-500">
                                    {moduleDef.category}
                                </Badge>
                                <span className="text-[10px] text-slate-400 font-medium">콘텐츠 작성을 위한 집중 공간</span>
                            </div>
                            <DialogTitle className="text-lg font-bold text-slate-900 mt-0.5">
                                {moduleDef.label} 작성
                            </DialogTitle>
                        </div>
                    </div>
                </div>

                {/* Body (2-Column) */}
                <div className="flex-1 flex overflow-hidden">
                    {/* LEFT: AI Guide (40%) */}
                    <div className="w-[35%] bg-slate-50 border-r border-slate-200 p-6 overflow-y-auto">
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Lightbulb className="w-3 h-3 text-yellow-500" />
                            작성 가이드
                        </h4>

                        <div className="space-y-4">
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <h5 className="text-sm font-bold text-slate-800 mb-2">💡 팁: {moduleDef.label} 잘 쓰는 법</h5>
                                <p className="text-xs text-slate-600 leading-relaxed word-break-keep">
                                    {getGuideText(moduleDef)}
                                </p>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <h5 className="text-sm font-bold text-slate-800 mb-3">질문 리스트</h5>
                                <ul className="space-y-2">
                                    {getQuestions(moduleDef).map((q, idx) => (
                                        <li key={idx} className="flex gap-2 text-xs text-slate-600">
                                            <span className="text-indigo-500 font-bold">{idx + 1}.</span>
                                            <span>{q}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Editor (65%) */}
                    <div className="flex-1 bg-white p-6 overflow-y-auto flex flex-col">
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <PenTool className="w-3 h-3 text-indigo-500" />
                            에디터
                        </h4>

                        <div className="flex-1 flex flex-col gap-4">
                            {/* Specialized Controls (e.g. Stars for Review) */}
                            {moduleId === 'customer_review' && (
                                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 flex items-center gap-4">
                                    <span className="text-sm font-bold text-yellow-800">추천 별점</span>
                                    {renderStarRating(form, moduleId)}
                                </div>
                            )}

                            {/* Specialized Controls (e.g. Map Address) */}
                            {moduleId === 'detailed_map' && renderMapInputs(form, moduleId)}

                            {/* Main Text Area */}
                            <FormField
                                control={form.control}
                                name={`moduleData.${moduleId}.text`}
                                render={({ field }) => (
                                    <FormItem className="flex-1 flex flex-col h-full">
                                        <FormControl>
                                            <textarea
                                                placeholder={getPlaceholder(moduleDef)}
                                                className="flex-1 w-full resize-none p-4 rounded-xl border border-slate-200 bg-white text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-300"
                                                {...field}
                                                value={field.value || ""}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Generator Toolbar */}
                            <div className="flex items-center justify-between pt-2">
                                <span className="text-xs text-slate-400">
                                    키워드만 적고 AI에게 맡겨보세요.
                                </span>
                                <Button
                                    size="sm"
                                    type="button"
                                    onClick={handleAiGenerate}
                                    disabled={isGenerating}
                                    className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                                            작성 중...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            AI 문장 다듬기
                                        </>
                                    )}
                                </Button>
                                {/* Generator Toolbar removed as per user request to remove AI Refine button */}
                            </div>
                        </div>
                    </div>

                </div>
                {/* Footer */}
                <div className="bg-white border-t border-slate-100 px-6 py-4 flex justify-end gap-3 shrink-0">
                    <Button variant="ghost" onClick={onClose} type="button">취소</Button>
                    <Button onClick={onClose} type="button" className="bg-slate-900 text-white hover:bg-slate-800">
                        <Check className="w-4 h-4 mr-2" />
                        저장 및 적용
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Helpers
function getGuideText(def: LeafletModuleDef) {
    if (def.category === "브랜드소개") return "화려한 미사여구보다는 진심이 담긴 이야기를 들려주세요. 고객은 '무엇'을 파는지보다 '왜' 파는지에 공감합니다.";
    if (def.category === "신뢰/입증") return "구체적인 수치나 실제 고객의 목소리를 담는 것이 가장 강력합니다. '최고'라는 말보다 '재구매율 98%'가 더 믿음직스럽습니다.";
    if (def.category === "이용가이드") return "초등학생도 이해할 수 있을 만큼 쉽고 명확하게 설명해주세요. 단계별(Step 1, 2, 3)로 나누어 적으면 더 좋습니다.";
    return "핵심 내용을 간결하게 작성해주세요.";
}

function getQuestions(def: LeafletModuleDef) {
    if (def.id === "ceo_message") return ["회사를 설립하게 된 계기는?", "고객에게 꼭 하고 싶은 말은?", "앞으로의 목표는?"];
    if (def.id === "brand_story") return ["브랜드 이름에 담긴 뜻은?", "어떤 문제를 해결하고 싶었나요?", "우리가 추구하는 가치는?"];
    if (def.id === "customer_review") return ["가장 기억에 남는 칭찬은?", "고객들이 자주 하는 말은?", "재방문하는 이유는?"];
    if (def.id === "detailed_map") return ["찾아오기 쉬운 랜드마크는?", "주차는 어디에 하나요?", "대중교통 이용 팁은?"];
    return ["이 모듈에서 가장 강조하고 싶은 점은?", "고객이 이 정보를 보고 어떤 행동을 하길 원하나요?", "꼭 포함되어야 할 키워드는?"];
}

function getPlaceholder(def: LeafletModuleDef) {
    return `여기에 ${def.label} 내용을 자유롭게 적어주세요.\n\n또는 왼쪽의 질문을 보고 힌트를 얻어보세요.\n대충 적고 'AI 문장 다듬기'를 누르면 멋지게 완성해드립니다!`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderStarRating(form: any, moduleId: string) {
    const { watch, setValue } = form;
    const stars = watch(`moduleData.${moduleId}.stars`) || 5;
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
                <Star
                    key={s}
                    className={cn(
                        "w-5 h-5 cursor-pointer transition-all",
                        s <= stars ? "fill-yellow-400 text-yellow-400" : "text-slate-200 hover:text-yellow-200"
                    )}
                    onClick={() => setValue(`moduleData.${moduleId}.stars`, s)}
                />
            ))}
        </div>
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderMapInputs(form: any, moduleId: string) {
    const { control } = form;
    return (
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={control}
                name={`moduleData.${moduleId}.address`}
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Input placeholder="📍 정확한 매장 주소" className="bg-white" {...field} value={field.value || ""} />
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
                            <Input placeholder="🚗 주차 팁 (예: 건물 뒤편)" className="bg-white" {...field} value={field.value || ""} />
                        </FormControl>
                    </FormItem>
                )}
            />
        </div>
    );
}

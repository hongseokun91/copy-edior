
import React from "react";
import { BrochureBlockPlan, BrochureBlockType } from "@/types/brochure";
import { BROCHURE_BLOCK_TEMPLATES } from "@/lib/brochure-blocks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Plus, Trash2, ArrowUp, ArrowDown, Sparkles,
    Search, Zap, Layers, FileCheck, Award, Clock,
    CreditCard, TrendingUp, Users, HelpCircle,
    UserCircle, ShieldCheck, Shield, Smartphone, Monitor
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BrochureBlockBuilderProps {
    blocks: BrochureBlockPlan[];
    onAddBlock: (type: BrochureBlockType) => void;
    onRemoveBlock: (index: number) => void;
    onMoveBlock: (index: number, direction: "up" | "down") => void;
    onUpdateBlock: (index: number, updates: Partial<BrochureBlockPlan>) => void;
}

export function BrochureBlockBuilder({
    blocks,
    onAddBlock,
    onRemoveBlock,
    onMoveBlock,
    onUpdateBlock
}: BrochureBlockBuilderProps) {
    const [expandedGuidance, setExpandedGuidance] = React.useState<Record<string, boolean>>({});
    const [isLeafletMode, setIsLeafletMode] = React.useState(false); // Renamed for clarity, represents Flyer/Leaflet mode

    const toggleGuidance = (blockId: string) => {
        setExpandedGuidance(prev => ({ ...prev, [blockId]: !prev[blockId] }));
    };

    const QUICK_CHIPS: Record<string, string[]> = {
        BLOCK_FRONT_IDENTITY: ["프리미엄 브랜드 보이스", "기업 정체성 강조", "혁신 내러티브", "글로벌 권위"],
        BLOCK_PROBLEM_INSIGHT: ["시장 페인포인트", "수익 손실 분석", "운영 효율성 격차", "핵심 취약점"],
        BLOCK_SOLUTION_DEEPDIVE: ["독자적 아키텍처", "확장성 중심", "AI 기반 최적화", "생태계 통합"],
        BLOCK_PRODUCT_LINEUP: ["기능 계층 구조", "등급별 제품군", "엔터프라이즈 스위트", "서비스 모듈화"],
        BLOCK_SPECS_COMPLIANCE: ["제로 트러스트 보안", "ISO 표준 준수", "규제 대응", "기술적 엄격함"],
        BLOCK_CASE_STUDIES: ["ROI 검증", "고객 성공 사례", "변화 지표", "산업적 임팩트"],
        BLOCK_PROCESS_TIMELINE: ["신속한 배포", "애자일 로드맵", "라이프사이클 관리", "전략적 단계"],
        BLOCK_PRICING_PACKAGES: ["TCO 절감", "대량 구매 전략", "유연한 가격 책정", "전략적 투자"],
        BLOCK_IMPACT_METRICS: ["KPI 가속화", "데이터 기반 성장", "시장 성과", "운영 우수성"],
        BLOCK_BACK_TRUST_CONTACT: ["다음 단계 안내", "전략적 파트너십", "상담 라우팅", "컴플라이언스 정보"],
        BLOCK_ISOLATED_COMPACT_4P: ["핵심 가치 요약", "문제와 해결", "차별화 포인트", "신속한 행동 유도"]
    };

    const DEFAULT_CHIPS = ["전략적 상세", "간결한 전달", "지표 중심", "핵심 요약"];

    const BLOCK_ICONS: Record<BrochureBlockType, React.ElementType> = {
        BLOCK_FRONT_IDENTITY: UserCircle,
        BLOCK_BACK_TRUST_CONTACT: ShieldCheck,
        BLOCK_PROBLEM_INSIGHT: Search,
        BLOCK_SOLUTION_DEEPDIVE: Zap,
        BLOCK_PRODUCT_LINEUP: Layers,
        BLOCK_SPECS_COMPLIANCE: FileCheck,
        BLOCK_CASE_STUDIES: Award,
        BLOCK_PROCESS_TIMELINE: Clock,
        BLOCK_PRICING_PACKAGES: CreditCard,
        BLOCK_IMPACT_METRICS: TrendingUp,
        BLOCK_TEAM_GOVERNANCE: Users,
        BLOCK_FAQ_OBJECTIONS: HelpCircle,
        BLOCK_ISOLATED_COMPACT_4P: Sparkles,
    };

    return (
        <div className="relative min-h-[700px] w-full max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500 font-sans pb-12">
            {/* 1. Universal Layout Shell (Leaflet Standard) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start relative z-10">

                {/* [LEFT] Block Repository */}
                <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-8">
                    {/* Header: Proportional Recovery Shell */}
                    <div className="flex flex-col bg-[#050508] text-white p-6 rounded-[32px] shadow-2xl border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Layers className="h-12 w-12 text-white" />
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-[#12121e] border border-white/10 flex items-center justify-center text-lg shrink-0 shadow-inner">
                                <span className="opacity-80">📦</span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-[14px] font-black tracking-tight text-white/90 leading-tight">
                                    추가 블록<br />
                                    선택하기
                                </h3>
                                <p className="text-[8px] font-black text-indigo-400/70 uppercase tracking-[0.2em]">전략 모듈</p>
                            </div>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(blocks.length * 20, 100)}%` }}
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                            />
                        </div>
                        <p className="text-[9px] text-slate-500 font-bold mt-2 uppercase tracking-tighter italic">
                            {blocks.length * 4}페이지 분량의 내러티브 구성됨
                        </p>
                    </div>

                    {/* Block Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button type="button" className="w-full h-14 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 hover:shadow-md transition-all text-left px-3 flex items-center justify-between outline-none focus:ring-2 focus:ring-indigo-500/20 group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100 group-hover:bg-indigo-100 transition-colors">
                                        <Plus className="h-4 w-4 text-indigo-600" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[12px] font-black text-slate-700 uppercase tracking-tight group-hover:text-indigo-700">새 블록 추가...</span>
                                        <span className="text-[9px] text-slate-400 font-bold">목록에서 선택하여 하단에 생성</span>
                                    </div>
                                </div>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[320px] max-h-[400px] p-1" align="start">
                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="text-[10px] text-slate-400 font-black uppercase tracking-widest px-2 py-2">사용 가능한 전략 블록</DropdownMenuLabel>
                                {BROCHURE_BLOCK_TEMPLATES
                                    .filter(t => !["BLOCK_FRONT_IDENTITY", "BLOCK_BACK_TRUST_CONTACT"].includes(t.type))
                                    .map(t => {
                                        const Icon = BLOCK_ICONS[t.type] || Plus;
                                        return (
                                            <DropdownMenuItem
                                                key={t.type}
                                                onSelect={() => onAddBlock(t.type)}
                                                className="py-3 px-3 focus:bg-indigo-50 rounded-md cursor-pointer mb-1 h-auto whitespace-normal"
                                            >
                                                <div className="flex items-center gap-3 w-full">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-white">
                                                        <Icon className="h-4 w-4 text-slate-500" />
                                                    </div>
                                                    <div className="flex flex-col text-left flex-1 min-w-0">
                                                        <span className="text-[12px] font-bold text-slate-700 leading-tight mb-0.5">{t.label}</span>
                                                        <span className="text-[9px] text-slate-400 leading-none truncate opacity-80">{t.description}</span>
                                                    </div>
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Plus className="h-3 w-3 text-indigo-400" />
                                                    </div>
                                                </div>
                                            </DropdownMenuItem>
                                        );
                                    })}
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* [RIGHT] Composition Canvas */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Header: Proportional Recovery Shell */}
                    <div className="flex items-center justify-between bg-[#050508] text-white p-5 rounded-[32px] shadow-2xl border border-white/5 relative overflow-hidden mb-2">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="w-12 h-12 rounded-full bg-[#12121e] border border-white/10 flex items-center justify-center text-xl shrink-0 shadow-inner">
                                <span className="opacity-80">📐</span>
                            </div>
                            <div className="space-y-1.5 min-w-0">
                                <h2 className="text-[17px] font-black text-white leading-tight tracking-tight uppercase">
                                    컴포지션<br />
                                    전략 캔버스
                                </h2>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] text-indigo-400 font-black uppercase tracking-[0.2em] whitespace-nowrap">통합 산업 워크플로우</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex bg-[#0f0f18] p-1 rounded-xl border border-white/5 items-center mr-2">
                                <button
                                    type="button"
                                    onClick={() => setIsLeafletMode(false)}
                                    className={cn(
                                        "p-2 rounded-lg transition-all",
                                        !isLeafletMode ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:text-slate-300"
                                    )}
                                    title="Brochure Mode (Wide)"
                                >
                                    <Monitor className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsLeafletMode(true)}
                                    className={cn(
                                        "p-2 rounded-lg transition-all",
                                        isLeafletMode ? "bg-indigo-600 text-white shadow-md" : "text-slate-500 hover:text-slate-300"
                                    )}
                                    title="Flyer/Leaflet Mode (Portrait)"
                                >
                                    <Smartphone className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex bg-[#0f0f18] p-1.5 rounded-[22px] border border-white/5 items-center shrink-0 shadow-inner">
                                <div className="px-5 py-2.5 rounded-[18px] bg-white text-slate-950 shadow-lg flex flex-col items-center justify-center gap-0.5 min-w-[100px]">
                                    <span className="text-xl font-black leading-none tabular-nums">{blocks.length * 4}</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 opacity-80">총 페이지 수</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Draggable Blocks Container */}
                    <div className={cn(
                        "space-y-6 relative transition-all duration-500 ease-in-out",
                        isLeafletMode ? "w-full max-w-[480px] mx-auto border-2 border-dashed border-slate-300 bg-slate-100/50 rounded-3xl px-4 py-8 mt-6" : "w-full min-w-0"
                    )}>
                        {/* Flyer Mode Indicator */}
                        {isLeafletMode && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 -translate-y-full mb-2">
                                <div className="bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest py-1.5 px-3 rounded-full shadow-lg whitespace-nowrap flex items-center gap-1.5">
                                    <Smartphone className="w-3 h-3" />
                                    Leaflet Simulation (Portrait 480px)
                                </div>
                            </div>
                        )}
                        <AnimatePresence mode="popLayout">
                            {blocks.map((block, index) => {
                                const isFixed = ["BLOCK_FRONT_IDENTITY", "BLOCK_BACK_TRUST_CONTACT", "BLOCK_ISOLATED_COMPACT_4P"].includes(block.type);
                                const Icon = BLOCK_ICONS[block.type] || Plus;
                                return (
                                    <motion.div
                                        key={block.blockId}
                                        layout="position"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="relative"
                                    >
                                        <Card className={cn(
                                            "relative overflow-hidden transition-all duration-300 border border-slate-200 shadow-sm group/card bg-white rounded-2xl",
                                            isFixed ? "bg-slate-50/80 grayscale-[0.3]" : "hover:shadow-md hover:border-indigo-300"
                                        )}>
                                            <div className={cn(
                                                "transition-all duration-500 ease-in-out",
                                                isLeafletMode
                                                    ? "flex flex-col items-start gap-5 p-6"
                                                    : "flex items-center justify-between p-6"
                                            )}>
                                                {/* Left Content (Block Info) */}
                                                <div className={cn(
                                                    "flex items-center gap-6",
                                                    isLeafletMode ? "w-full" : "w-auto"
                                                )}>
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-xl flex items-center justify-center text-[15px] font-black shadow-sm relative transition-all duration-300 border shrink-0",
                                                        isFixed ? "bg-slate-200 text-slate-500 border-slate-300" : "bg-white text-indigo-600 border-indigo-100 group-hover/card:bg-indigo-600 group-hover/card:text-white group-hover/card:border-indigo-600"
                                                    )}>
                                                        {index + 1}
                                                    </div>

                                                    <div className="space-y-1.5 flex-1 min-w-0">
                                                        <div className="flex flex-wrap items-center gap-3">
                                                            <div className={cn(
                                                                "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border transition-colors",
                                                                isFixed ? "bg-slate-100 text-slate-400 border-slate-200" : "bg-slate-50 text-indigo-600 border-slate-100 group-hover/card:bg-indigo-50 group-hover/card:border-indigo-200"
                                                            )}>
                                                                <Icon className="h-4.5 w-4.5" />
                                                            </div>
                                                            <h4 className="text-[16px] font-black text-slate-800 tracking-tight transition-colors truncate max-w-[150px] sm:max-w-none uppercase">
                                                                {BROCHURE_BLOCK_TEMPLATES.find(t => t.type === block.type)?.label || block.type}
                                                            </h4>
                                                            {isFixed ? (
                                                                <span className="text-[8px] px-2.5 py-1 rounded-md bg-slate-200 text-slate-500 font-black uppercase tracking-widest border border-slate-300">필수 구성 블록</span>
                                                            ) : (
                                                                <span className="text-[8px] px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-600 font-black uppercase tracking-widest border border-indigo-100">내러티브 모듈</span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-5">
                                                            <div className="flex items-center gap-2 bg-slate-50 px-2 rounded-md border border-slate-100 h-5">
                                                                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">규격</span>
                                                                <span className="text-[10px] text-slate-700 font-black">04P</span>
                                                            </div>
                                                            <div className="flex gap-1.5 items-center">
                                                                {block.pages.map((p, i) => (
                                                                    <div
                                                                        key={i}
                                                                        title={p.role}
                                                                        className={cn(
                                                                            "w-2 h-2 rounded-full",
                                                                            p.role === "ROLE_COVER" && "bg-indigo-400",
                                                                            p.role === "ROLE_NARRATIVE" && "bg-purple-400",
                                                                            p.role === "ROLE_VALUE" && "bg-blue-400",
                                                                            p.role === "ROLE_PROOF" && "bg-slate-400",
                                                                            p.role === "ROLE_ACTION" && "bg-indigo-700",
                                                                        )}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right Content (Actions) */}
                                                <div className={cn(
                                                    "flex items-center gap-3",
                                                    isLeafletMode ? "w-full justify-between pt-4 border-t border-slate-100" : "flex-shrink-0"
                                                )}>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => toggleGuidance(block.blockId)}
                                                        className={cn(
                                                            "h-10 px-4 text-[10px] font-black gap-2.5 transition-all rounded-xl border uppercase tracking-[0.2em]",
                                                            (block.guidance?.detail || block.guidance?.mustInclude?.length)
                                                                ? "text-indigo-600 bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
                                                                : "bg-white text-slate-400 border-slate-200 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 shadow-sm"
                                                        )}
                                                    >
                                                        <Sparkles className={cn("h-3.5 w-3.5", (block.guidance?.detail || block.guidance?.mustInclude?.length) && "text-indigo-600")} />
                                                        {block.guidance?.detail || block.guidance?.mustInclude?.length ? "지시서 적용됨" : "로직 맞춤 설정"}
                                                    </Button>

                                                    {!isFixed && (
                                                        <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-slate-400 hover:text-indigo-600"
                                                                disabled={index <= 1}
                                                                onClick={() => onMoveBlock(index, "up")}
                                                            >
                                                                <ArrowUp className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-slate-400 hover:text-indigo-600"
                                                                disabled={index >= blocks.length - 2}
                                                                onClick={() => onMoveBlock(index, "down")}
                                                            >
                                                                <ArrowDown className="h-4 w-4" />
                                                            </Button>
                                                            <div className="w-[1px] h-4 bg-slate-200 mx-1" />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-slate-400 hover:text-red-500"
                                                                onClick={() => onRemoveBlock(index)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <AnimatePresence>
                                                {/* Expanded Guidance Logic - Same as before but inside structure is responsive automatically due to generic divs */}
                                                {expandedGuidance[block.blockId] && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden bg-slate-50 border-t border-slate-100"
                                                    >
                                                        <div className="p-8 space-y-8">
                                                            <div className="space-y-4">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-1.5 h-3 bg-indigo-600 rounded-full" />
                                                                        <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">전략 문맥 프리셋</h5>
                                                                    </div>
                                                                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">간편 로직 주입</span>
                                                                </div>
                                                                <div className="flex flex-wrap gap-2.5">
                                                                    {(QUICK_CHIPS[block.type] || DEFAULT_CHIPS).map((chip: string) => (
                                                                        <button
                                                                            key={chip}
                                                                            type="button"
                                                                            onClick={() => {
                                                                                const currentDetail = block.guidance?.detail || "";
                                                                                const freshDetail = currentDetail.includes(chip)
                                                                                    ? currentDetail
                                                                                    : (currentDetail ? `${currentDetail}, ${chip}` : chip);
                                                                                onUpdateBlock(index, {
                                                                                    guidance: { ...(block.guidance || { detail: "", mustInclude: [] }), detail: freshDetail }
                                                                                });
                                                                            }}
                                                                            className="text-[10px] font-black bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-slate-600 hover:border-indigo-600 hover:text-indigo-600 hover:shadow-sm transition-all shadow-[0_2px_4px_rgba(0,0,0,0.02)]"
                                                                        >
                                                                            {chip}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-1.5 h-3 bg-indigo-600 rounded-full" />
                                                                    <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">세부 지시서 오버라이드</h5>
                                                                </div>
                                                                <div className="relative">
                                                                    <textarea
                                                                        placeholder="구체적인 지표(예: '120% 성장'), 강조 키워드, 혹은 이 내러티브 유닛에 반영할 전략적 지시사항을 입력하세요..."
                                                                        className="w-full text-[13px] p-5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 outline-none resize-none bg-white text-slate-700 min-h-[140px] font-medium leading-relaxed placeholder:text-slate-400 shadow-inner transition-all"
                                                                        value={block.guidance?.detail || ""}
                                                                        onChange={(e) => onUpdateBlock(index, {
                                                                            guidance: { ...(block.guidance || { detail: "", mustInclude: [] }), detail: e.target.value }
                                                                        })}
                                                                    />
                                                                    <div className="absolute bottom-4 right-4 text-[9px] text-slate-400 font-bold uppercase tracking-widest italic flex items-center gap-1.5">
                                                                        <div className="w-1 h-1 rounded-full bg-indigo-400" />
                                                                        산업용 NLP 엔진 활성화됨
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Canvas Status Bar: Proportional Recovery Standard */}
                    <div className="flex items-center gap-6 p-6 rounded-[32px] bg-[#050508] text-white border border-white/5 shadow-2xl relative overflow-hidden group/status">
                        <div className="absolute inset-y-0 left-0 w-1 bg-indigo-600" />
                        <div className="w-12 h-12 rounded-full bg-[#12121e] border border-white/10 flex items-center justify-center shrink-0 shadow-inner relative z-10 transition-transform group-hover/status:scale-110">
                            <Shield className="h-6 w-6 text-indigo-400" />
                        </div>
                        <div className="space-y-1 relative z-10">
                            <div className="flex items-center gap-3">
                                <h5 className="text-[14px] font-black text-white/90 uppercase tracking-tight">산업용 정밀 모드 작동 중</h5>
                                <Badge variant="outline" className="text-[8px] h-4 px-1.5 border-indigo-500/50 text-indigo-400 font-black uppercase tracking-widest rounded-full bg-indigo-500/5">
                                    v3.2 동기화 완료
                                </Badge>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-relaxed font-bold max-w-2xl uppercase tracking-wider italic">
                                시스템이 Leaflet 디자인 토큰과 동기화되었습니다. 내러티브 유닛이 04P 고전환 스프레드에 최적화되었으며, 브랜드 일관성이 잠금되었습니다.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* eslint-disable */
import { getRecommendationsForIndustry } from "@/lib/leaflet-recommendations";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LeafletWriterModal } from "./leaflet-writer-modal";
import { LEAFLET_MODULES, LeafletModuleDef } from "@/lib/leaflet-modules";
import { UseFormReturn } from "react-hook-form";
import { getPanels } from "@/lib/leaflet-utils";

interface LeafletMapOrchestratorProps {
    form: UseFormReturn<any>;
}

const PanelSlot = ({
    id,
    label,
    subLabel,
    isLast,
    assignedModules,
    activeSlot,
    editingModuleId,
    activeSurface,
    isActive,
    onEditModule,
    onRemoveAssignment,
    onSetActiveSlot,
    onAssign,
    recommendations
}: {
    id: string;
    label: string;
    subLabel: string;
    isLast?: boolean;
    assignedModules: LeafletModuleDef[];
    activeSlot: string | null;
    editingModuleId: string | null;
    activeSurface: "OUTSIDE" | "INSIDE";
    isActive: boolean;
    onEditModule: (moduleId: string, e: React.MouseEvent) => void;
    onRemoveAssignment: (panelId: string, moduleId: string) => void;
    onSetActiveSlot: (id: string | null) => void;
    onAssign: (moduleId: string) => void;
    recommendations: { essential: string[]; recommended: string[] };
}) => {
    const isEditingAny = assignedModules.some(m => m.id === editingModuleId);
    const isFront = id === "P1";
    const isBack = ["P4", "P6", "P8"].includes(id) && activeSurface === "OUTSIDE"; // Dynamic Back Logic
    const hasContactMod = assignedModules.some(m => ["detailed_map", "contact_channels"].includes(m.id));
    const showContactWarning = isBack && !hasContactMod && !isActive;

    return (
        <div className="flex-1 relative group h-[22rem] min-w-0">
            <div
                className={cn(
                    "w-full h-full text-left transition-all duration-300 relative border-y first:border-l last:border-r p-3 flex flex-col",
                    isActive ? "bg-white ring-2 ring-indigo-600 z-10 shadow-xl scale-[1.02] border-transparent" : "hover:bg-indigo-50/30 border-slate-200",
                    !isActive && !isEditingAny && isFront && "bg-indigo-50/40 border-indigo-100",
                    !isActive && !isEditingAny && isBack && "bg-slate-100/50 border-slate-200",
                    !isActive && !isEditingAny && !isFront && !isBack && "bg-white"
                )}
            >
                {(isFront || isBack) && (
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:8px_8px]" />
                )}

                {/* Panel Header */}
                <div className="h-6 flex items-center mb-2 pointer-events-none w-full shrink-0">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                        <Badge variant="outline" className={cn(
                            "text-[9px] h-4 px-1.5 font-bold tracking-wider rounded-sm shrink-0",
                            isActive ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-500 border-slate-200",
                            isFront && !isActive && "bg-indigo-100 text-indigo-700 border-indigo-200",
                            isBack && !isActive && "bg-slate-200 text-slate-600 border-slate-300"
                        )}>
                            {id}
                        </Badge>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate">{label}</span>
                    </div>
                </div>

                {/* Contact Warning */}
                {showContactWarning && (
                    <div className="absolute top-8 left-3 right-3 animate-pulse z-0">
                        <Badge variant="outline" className="w-full justify-center bg-orange-50 text-orange-600 border-orange-200 text-[8px] font-bold py-1">
                            ⚠️ 필수 정보(연락처/지도) 누락
                        </Badge>
                    </div>
                )}

                {/* Module List */}
                <div className="flex-1 flex flex-col gap-2 relative z-10 min-h-0">
                    {assignedModules.map((module) => (
                        <motion.div
                            key={module.id}
                            layoutId={`module-${id}-${module.id}`}
                            className={cn(
                                "relative bg-white border rounded-lg p-2.5 shadow-sm group/card transition-all cursor-pointer flex items-center gap-3 shrink-0",
                                editingModuleId === module.id ? "border-indigo-500 ring-1 ring-indigo-500 shadow-md z-10" : "border-slate-200 hover:border-indigo-300 hover:shadow-md"
                            )}
                            onClick={(e) => onEditModule(module.id, e)}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-md flex items-center justify-center text-lg shrink-0",
                                editingModuleId === module.id ? "bg-indigo-100 text-indigo-700" : "bg-slate-50 text-slate-900 group-hover/card:bg-indigo-50"
                            )}>
                                {module.icon}
                            </div>
                            <div className="min-w-0 flex-1 text-left">
                                <h5 className="text-[11px] font-bold text-slate-800 truncate leading-tight">{module.label}</h5>
                                <p className="text-[9px] text-slate-400 truncate">{module.description}</p>
                            </div>
                            {editingModuleId === module.id && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />}
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onRemoveAssignment(id, module.id); }}
                                className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 shadow-sm opacity-0 group-hover/card:opacity-100 transition-opacity z-20"
                            >
                                <X className="w-2.5 h-2.5" />
                            </button>
                        </motion.div>
                    ))}

                    {/* Add Button */}
                    {assignedModules.length < 3 && (
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onSetActiveSlot(isActive ? null : id); }}
                            className={cn(
                                "flex-1 min-h-[40px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-1 transition-all group/add w-full",
                                isActive ? "border-indigo-300 bg-indigo-50/50" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                                "box-border"
                            )}
                        >
                            <div className="w-5 h-5 rounded-full bg-white border border-slate-300 flex items-center justify-center text-slate-400 group-hover/add:border-indigo-400 group-hover/add:text-indigo-500">
                                <span className="text-xs leading-none mb-0.5">+</span>
                            </div>
                            <span className="text-[9px] font-bold text-slate-400 group-hover/add:text-slate-600">
                                {assignedModules.length === 0 ? subLabel : "모듈 추가"}
                            </span>
                        </button>
                    )}
                </div>
            </div>

            {/* Popup Menu - Centered Overlay with Backdrop */}
            {isActive && !editingModuleId && (
                <>
                    {/* Backdrop: Click to Close */}
                    <div
                        className="fixed inset-0 z-[99] bg-black/5 cursor-default"
                        onClick={(e) => {
                            e.stopPropagation();
                            onSetActiveSlot(null);
                        }}
                    />

                    {/* Popup Content */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] w-[340px]">
                        <div className="bg-white rounded-xl shadow-2xl border border-indigo-100 p-1 animate-in zoom-in-95 fade-in duration-200 ring-4 ring-black/5">
                            <div className="bg-slate-50/50 rounded-lg p-3 border-b border-slate-100/50 mb-1 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Badge className="bg-indigo-600 text-white border-none h-5 px-1.5 text-[10px]">{id}</Badge>
                                    <span className="text-[12px] font-bold text-slate-700">모듈 선택</span>
                                </div>
                                <button type="button" onClick={(e) => { e.stopPropagation(); onSetActiveSlot(null); }} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200/50 transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="p-1 grid grid-cols-1 gap-1 max-h-[320px] overflow-y-auto custom-scrollbar">
                                {LEAFLET_MODULES.sort((a, b) => {
                                    const aEss = recommendations.essential.includes(a.id);
                                    const bEss = recommendations.essential.includes(b.id);
                                    if (aEss && !bEss) return -1;
                                    if (!aEss && bEss) return 1;
                                    return 0;
                                }).map(m => {
                                    const isAlreadyAssigned = assignedModules.some(am => am.id === m.id);
                                    const isEssential = recommendations.essential.includes(m.id);
                                    const isRecommended = recommendations.recommended.includes(m.id);
                                    return (
                                        <button
                                            type="button"
                                            key={m.id}
                                            disabled={isAlreadyAssigned}
                                            onClick={(e) => { e.stopPropagation(); onAssign(m.id); }}
                                            className={cn(
                                                "flex items-center gap-3 p-3 rounded-lg text-left group/item transition-colors",
                                                isAlreadyAssigned ? "opacity-40 cursor-not-allowed bg-slate-50" : "hover:bg-indigo-50 cursor-pointer"
                                            )}
                                        >
                                            <div className="w-9 h-9 rounded-md bg-white border border-slate-100 flex items-center justify-center text-lg shadow-sm group-hover/item:border-indigo-100 group-hover/item:text-indigo-600 shrink-0">{m.icon}</div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="text-[12px] font-bold text-slate-800">{m.label}</div>
                                                    {isEssential && <Badge className="bg-indigo-600 text-white border-none text-[9px] h-4 px-1.5">필수</Badge>}
                                                    {isRecommended && !isEssential && <Badge variant="outline" className="text-indigo-600 border-indigo-200 text-[9px] h-4 px-1.5">장려</Badge>}
                                                </div>
                                                <div className="text-[10px] text-slate-500 leading-normal mt-0.5">{m.description}</div>
                                            </div>
                                            {isAlreadyAssigned && <Check className="ml-auto w-4 h-4 text-slate-400" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Fold Line (Dashed) - Right Side */}
            {!isLast && (
                <div className="absolute top-2 bottom-2 -right-px w-[1px] bg-slate-300/50 z-20 pointer-events-none border-r border-dashed border-slate-300"></div>
            )}
        </div>
    );
};



export function LeafletMapOrchestrator({ form }: LeafletMapOrchestratorProps) {
    // 1. Core State
    const [activeSurface, setActiveSurface] = useState<"OUTSIDE" | "INSIDE">("OUTSIDE");
    const [assignments, setAssignments] = useState<Record<string, string[]>>({});
    const [activeSlot, setActiveSlot] = useState<string | null>(null);
    const [editingModuleId, setEditingModuleId] = useState<string | null>(null);

    // 2. Preview State (Unused but kept for structure)
    // const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    // const [previewStep, setPreviewStep] = useState(0);

    // 3. Derived Data
    const industry = form.watch("category") || "";
    const leafletType = form.watch("leafletType") || "3단";
    const recommendations = getRecommendationsForIndustry(industry);

    // 4. Panel Definitions based on Fold Type (Moved outside or use simple logic)
    const currentPanels = getPanels(leafletType, activeSurface);

    // 4.1 State Management (Reset & Escape)
    useEffect(() => {
        setActiveSlot(null);
         
    }, [activeSurface, leafletType]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setActiveSlot(null);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // 5. Helper Functions
    const getModulesForPanel = (panelId: string) => {
        let modIds = assignments[panelId] || [];
        if (typeof modIds === 'string') modIds = [modIds];
        if (!Array.isArray(modIds)) return [];
        return modIds.map(id => LEAFLET_MODULES.find(m => m.id === id)).filter(Boolean) as LeafletModuleDef[];
    };

    const handleAssign = (moduleId: string) => {
        if (!activeSlot) return;
        setAssignments(prev => {
            let current = prev[activeSlot] || [];
            if (typeof current === 'string') current = [current];
            if (current.length >= 3) return prev;
            if (current.includes(moduleId)) return prev;
            return { ...prev, [activeSlot]: [...current, moduleId] };
        });
        const currentSelected = form.getValues("selectedModules") || [];
        if (!currentSelected.includes(moduleId)) {
            form.setValue("selectedModules", [...currentSelected, moduleId]);
        }
        setActiveSlot(null);
        setEditingModuleId(moduleId);
    };

    const handleRemoveAssignment = (panelId: string, moduleId: string) => {
        setAssignments(prev => {
            const current = prev[panelId] || [];
            return { ...prev, [panelId]: current.filter(id => id !== moduleId) };
        });
        if (editingModuleId === moduleId) setEditingModuleId(null);
    };

    const handleEditModule = (moduleId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingModuleId(moduleId);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 w-full overflow-visible">
            {/* Header */}
            <div className="flex items-center justify-between bg-[#050508] text-white p-4.5 rounded-[32px] shadow-2xl border border-white/5 relative">
                <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#12121e] border border-white/10 flex items-center justify-center text-lg shrink-0 shadow-inner">
                        <div className="opacity-80">🗺️</div>
                    </div>
                    <div className="space-y-2.5 min-w-0">
                        <div className="leading-[1.25]">
                            <h3 className="text-[15px] font-black tracking-tight text-white/90">
                                전개도 배치 시스템
                            </h3>
                            <p className="text-[10px] text-slate-400 font-medium">
                                {leafletType} 접지 ({leafletType === '2단' ? '4면' : leafletType === '4단' ? '8면' : '6면'})
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex bg-[#0f0f18] p-1 rounded-[22px] border border-white/5 items-center shrink-0 ml-3">
                    <button
                        type="button"
                        onClick={() => setActiveSurface("OUTSIDE")}
                        className={cn(
                            "w-[76px] h-18 rounded-[20px] transition-all duration-300 flex flex-col items-center justify-center gap-0.5 px-1",
                            activeSurface === "OUTSIDE"
                                ? "bg-white text-slate-950 shadow-lg scale-100"
                                : "text-slate-500 hover:text-slate-300 opacity-60"
                        )}
                    >
                        <span className="text-xs font-black tracking-tight whitespace-nowrap">겉면</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveSurface("INSIDE")}
                        className={cn(
                            "w-[76px] h-18 rounded-[20px] transition-all duration-300 flex flex-col items-center justify-center gap-0.5 px-1",
                            activeSurface === "INSIDE"
                                ? "bg-white text-slate-950 shadow-lg scale-100"
                                : "text-slate-500 hover:text-slate-300 opacity-60"
                        )}
                    >
                        <span className="text-xs font-black tracking-tight whitespace-nowrap">안쪽면</span>
                    </button>
                </div>
            </div>

            {/* Canvas */}
            <div className="relative mx-2 group perspective-1000 pb-20"> {/* pb-20 added for dropdown space */}
                <div className="bg-slate-200 p-[1px] rounded-lg shadow-2xl overflow-visible">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${leafletType}-${activeSurface}`}
                            initial={{ opacity: 0, rotateX: 20 }}
                            animate={{ opacity: 1, rotateX: 0 }}
                            exit={{ opacity: 0, rotateX: -20 }}
                            transition={{ duration: 0.4, ease: "backOut" }}
                            className={cn(
                                "flex rounded-lg overflow-visible",
                                activeSurface === "OUTSIDE" ? "bg-slate-50" : "bg-white"
                            )}
                        >
                            {currentPanels.map((panel, idx) => (
                                <PanelSlot
                                    key={panel.id}
                                    {...panel}
                                    isLast={idx === currentPanels.length - 1}
                                    assignedModules={getModulesForPanel(panel.id)}
                                    activeSlot={activeSlot}
                                    editingModuleId={editingModuleId}
                                    activeSurface={activeSurface}
                                    isActive={activeSlot === panel.id}
                                    onEditModule={handleEditModule}
                                    onRemoveAssignment={handleRemoveAssignment}
                                    onSetActiveSlot={setActiveSlot}
                                    onAssign={handleAssign}
                                    recommendations={recommendations}
                                />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex justify-between mt-3 px-2">
                    <div className="text-[10px] text-slate-400 font-medium">
                        {activeSurface === "OUTSIDE" ? "👈 종이를 접었을 때 바깥쪽입니다." : "👐 종이를 펼쳤을 때 안쪽입니다."}
                    </div>
                </div>
            </div>

            <LeafletWriterModal isOpen={!!editingModuleId} moduleId={editingModuleId} onClose={() => setEditingModuleId(null)} form={form} />
        </div>
    );
}

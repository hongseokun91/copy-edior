/* eslint-disable */
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Rotate3d } from "lucide-react";
import { LeafletModuleDef } from "@/lib/leaflet-modules";

interface LeafletBlueprintProps {
    selectedModuleIds: string[];
    activeModuleId: string | null;
    moduleDefs: LeafletModuleDef[];
    onModuleClick?: (id: string) => void;
}

interface PanelProps {
    num: number;
    label: string;
    showFoldRight?: boolean;
    module: LeafletModuleDef | undefined;
    isActive: boolean;
    isSelected: boolean;
    onModuleClick?: (id: string) => void;
}

const Panel = ({
    num,
    label,
    showFoldRight,
    module,
    isActive,
    isSelected,
    onModuleClick
}: PanelProps) => {
    return (
        <div
            onClick={() => isSelected && module && onModuleClick?.(module.id)}
            className={cn(
                "relative flex-1 group transition-all duration-300",
                "h-64 border-y border-slate-200",
                num === 1 || num === 6
                    ? "bg-slate-50 shadow-inner"
                    : "bg-white",
                num === 2 || num === 3 ? "rounded-l-sm" : "",
                num === 1 || num === 5 ? "rounded-r-sm" : "",
                isActive ? "z-20 ring-1 ring-slate-900 shadow-2xl" : "hover:bg-slate-50/50",
                isSelected ? "cursor-pointer" : "cursor-default border-dashed border-slate-100"
            )}
        >
            {/* V26 Pattern Overlay for Covers */}
            {(num === 1 || num === 6) && (
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: `repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)`,
                        backgroundSize: '10px 10px'
                    }}
                />
            )}

            {/* V26 Authoritative Vertical Stamp */}
            {(num === 1 || num === 6) && (
                <div className="absolute top-1/2 -translate-y-1/2 left-2 pointer-events-none select-none opacity-20">
                    <div className="text-[7px] font-black text-slate-900 tracking-[0.3em] vertical-rl rotate-180 uppercase whitespace-nowrap">
                        {num === 1 ? "— MAIN FRONT COVER —" : "— FINAL BACK COVER —"}
                    </div>
                </div>
            )}

            {/* Panel Label (Editorial Style) */}
            <div className="absolute top-4 left-6 flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                <span className="text-[9px] font-bold text-slate-900 tracking-widest uppercase">{label}</span>
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-[8px] font-medium text-slate-400 uppercase tracking-tighter">P_0{num}</span>
            </div>

            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                {module ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all shadow-sm",
                            isActive ? "bg-slate-900 text-white shadow-xl" : "bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-slate-900 group-hover:shadow-md"
                        )}>
                            {module.icon}
                        </div>
                        <div className="space-y-1">
                            <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-tighter leading-tight">
                                {module.label}
                            </h5>
                            {isActive && (
                                <div className="flex justify-center">
                                    <div className="h-[2px] w-4 bg-slate-900 rounded-full" />
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="opacity-10 group-hover:opacity-20 transition-opacity">
                        <div className="w-10 h-10 border-2 border-dashed border-slate-300 rounded-xl mb-2 mx-auto" />
                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] italic">Empty Slot</span>
                    </div>
                )}
            </div>

            {/* Fold Line Visualization */}
            {showFoldRight && (
                <div className="absolute top-0 right-0 w-px h-full bg-slate-200/50 z-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent blur-[1px]" />
                </div>
            )}

            {/* Active Indicator (Sharp/Ink Blue) */}
            {isActive && (
                <div className="absolute inset-0 bg-indigo-600/5 pointer-events-none border-b-2 border-indigo-600 animate-in fade-in duration-500" />
            )}
        </div>
    );
};

export function LeafletBlueprint({
    selectedModuleIds,
    activeModuleId,
    moduleDefs,
    onModuleClick
}: LeafletBlueprintProps) {
    const [side, setSide] = React.useState<"outside" | "inside">("inside");

    const getModuleAtPanel = (panelNum: number) => {
        const moduleId = selectedModuleIds[panelNum - 1];
        return moduleDefs.find(m => m.id === moduleId);
    };

    const renderPanel = (num: number, label: string, showFoldRight?: boolean) => {
        const module = getModuleAtPanel(num);
        const isActive = activeModuleId === module?.id;
        const isSelected = !!module;

        return (
            <Panel
                key={num}
                num={num}
                label={label}
                showFoldRight={showFoldRight}
                module={module}
                isActive={isActive}
                isSelected={isSelected}
                onModuleClick={onModuleClick}
            />
        );
    };

    return (
        <div className="pt-2 pb-8 overflow-hidden">
            <div className="space-y-6 animate-in fade-in duration-700">
                {/* Premium Workspace Header */}
                <div className="flex items-end justify-between px-4 border-b border-slate-100 pb-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-slate-900 text-[8px] h-4 px-1.5 font-bold uppercase tracking-widest rounded-none">V24</Badge>
                            <h4 className="text-sm font-black text-slate-900 tracking-tighter uppercase">Physical Layout Canvas</h4>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium italic">실제 리플렛 제작 규격에 맞춘 1:1 기획 워크스페이스</p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setSide(side === "inside" ? "outside" : "inside")}
                        className="group flex items-center gap-2 pr-4 pl-2 py-1.5 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                    >
                        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white transition-transform group-hover:rotate-180 duration-500 shadow-lg">
                            <Rotate3d className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                            <div className="text-[10px] font-black text-slate-900 leading-none">FLIP SURFACE</div>
                            <div className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">to {side === "inside" ? "Outside" : "Inside"}</div>
                        </div>
                    </button>
                </div>

                {/* Integrated Trifold Paper Surface */}
                <div className="relative group mx-2">
                    {/* Paper Shadow Depth */}
                    <div className="absolute inset-0 -bottom-4 translate-y-2 bg-black/5 blur-3xl opacity-50 rounded-[1rem] pointer-events-none" />

                    <div className="flex shadow-2xl rounded-sm overflow-hidden border border-slate-200 bg-white">
                        {side === "outside" ? (
                            <>
                                {renderPanel(2, "Inner Flap", true)}
                                {renderPanel(6, "Back Cover", true)}
                                {renderPanel(1, "Front Cover")}
                            </>
                        ) : (
                            <>
                                {renderPanel(3, "Left Panel", true)}
                                {renderPanel(4, "Main Center", true)}
                                {renderPanel(5, "Right Panel")}
                            </>
                        )}
                    </div>
                </div>

                <div className="px-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-1">
                            {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 rounded-full border border-slate-200 bg-white" />)}
                        </div>
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Ink & Paper Simulation Activated</span>
                    </div>
                    <Badge variant="outline" className="text-[9px] text-slate-400 font-bold border-slate-100 rounded-none bg-slate-50/50">
                        {side === "outside" ? "Surface_B / Flap & Covers" : "Surface_A / Core Contents"}
                    </Badge>
                </div>
            </div>
        </div>
    );
}

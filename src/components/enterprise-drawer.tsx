"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
// import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EnterpriseDrawerProps {
     
    id: string;
    icon: string;
    label: string;
    description: string;
    isSelected: boolean;
    onClose: () => void;
    onSelect: () => void;
}

export function EnterpriseDrawer({ id, icon, label, description, isSelected, onClose, onSelect }: EnterpriseDrawerProps) {
    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="col-span-1 sm:col-span-3 overflow-hidden"
        >
            <div className="py-4">
                <div className="bg-slate-50 border-t border-b border-purple-100 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 shadow-inner relative overflow-hidden">
                    {/* Background Decor */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                    />

                    {/* Left: Icon & Title */}
                    <div className="flex flex-col items-center sm:items-start gap-4 sm:w-1/4 min-w-[150px] relative z-10">
                        <span className="text-6xl bg-white p-4 rounded-3xl shadow-sm border border-slate-100 shrink-0">
                            {icon}
                        </span>
                        <h3 className="text-2xl font-bold text-slate-900 text-center sm:text-left leading-tight">
                            {label}
                        </h3>
                    </div>

                    {/* Middle: Content */}
                    <div className="flex-1 relative z-10 border-l border-slate-200/50 pl-0 sm:pl-8 flex flex-col justify-center">
                        <p className="text-[17px] leading-relaxed text-slate-700 font-medium">
                            {description}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-2">
                            <div className="bg-purple-100/50 text-purple-700 text-xs font-bold px-3 py-1 rounded-full border border-purple-100">
                                Enterprise Grade
                            </div>
                            <div className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
                                Verified
                            </div>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col justify-center gap-3 sm:w-1/6 relative z-10 min-w-[140px]">
                        <Button
                            size="lg"
                            onClick={onSelect}
                            className={cn(
                                "w-full shadow-lg transition-all text-sm font-bold",
                                isSelected
                                    ? "bg-red-500 hover:bg-red-600 text-white"
                                    : "bg-purple-600 hover:bg-purple-500 text-white"
                            )}
                        >
                            {isSelected ? "선택 해제" : "선택하기"}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="w-full text-slate-400 hover:text-slate-600"
                        >
                            닫기
                        </Button>
                    </div>

                    {/* Close X Top Right */}
                    <div className="absolute top-4 right-4">
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
// import { Check, Edit2 } from "lucide-react"; 
import { Check } from "lucide-react";

interface EnterpriseCardProps {
     
    id: string;
    icon: string;
    label: string;
     
    description: string;
    isSelected: boolean;
    onClick: () => void;
}

export function EnterpriseCard({ id, icon, label, description, isSelected, onClick, className }: EnterpriseCardProps & { className?: string }) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "group relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer",
                isSelected
                    ? "bg-slate-900 border-slate-900 shadow-lg"
                    : "bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50/80",
                className
            )}
        >
            <div className="flex items-center gap-3 p-3">
                {/* Ultra-Precision Icon (Left) */}
                <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-xl transition-all shrink-0 shadow-inner",
                    isSelected
                        ? "bg-white/10 text-white"
                        : "bg-slate-50 text-slate-400 group-hover:text-slate-900 group-hover:bg-white group-hover:shadow-sm"
                )}>
                    {icon}
                </div>

                {/* Maximum Visibility Text (Right) */}
                <div className="flex-1 min-w-0">
                    <h4 className={cn(
                        "text-[12.5px] font-black leading-tight tracking-tight transition-colors break-keep",
                        isSelected ? "text-white" : "text-slate-700 group-hover:text-slate-900"
                    )}>
                        {label}
                    </h4>
                </div>

                {/* Minimal Selection Marker */}
                {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center animate-in zoom-in-50 duration-300">
                        <Check className="h-3 w-3 text-white" />
                    </div>
                )}
            </div>
        </div>
    );
}

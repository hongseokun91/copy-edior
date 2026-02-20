"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

interface QualityBadgeProps {
    score: number;
    pass: boolean;
    hardFail: boolean;
    onClick?: () => void;
    className?: string;
}

export function QualityBadge({ score, pass, hardFail, onClick, className }: QualityBadgeProps) {
    const getColors = () => {
        if (hardFail) return "bg-red-500 text-white hover:bg-red-600 border-red-200 shadow-red-100";
        if (!pass) return "bg-amber-500 text-white hover:bg-amber-600 border-amber-200 shadow-amber-100";
        return "bg-emerald-500 text-white hover:bg-emerald-600 border-emerald-200 shadow-emerald-100";
    };

    const Icon = hardFail ? AlertCircle : (pass ? CheckCircle2 : Sparkles);

    return (
        <Badge
            variant="secondary"
            className={cn(
                "cursor-pointer px-2.5 py-1 gap-1.5 font-black text-[11px] uppercase tracking-wider transition-all hover:scale-105 shadow-lg flex items-center border-2",
                getColors(),
                className
            )}
            onClick={(e) => {
                e.stopPropagation();
                onClick?.();
            }}
        >
            <Icon className="w-3.5 h-3.5" />
            <span>{score} pts</span>
            <span className="opacity-60 font-medium">·</span>
            <span>{hardFail ? "Critical" : (pass ? "Level 90" : "Weak")}</span>
        </Badge>
    );
}

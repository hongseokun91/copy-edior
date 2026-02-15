"use client";

import { useState } from "react";
import { Check, ChevronRight, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogHeader,
    DialogDescription
} from "@/components/ui/dialog";
import { POSTER_INDUSTRIES } from "@/lib/poster/poster-constants";

interface PosterCategorySelectorProps {
    value?: string;
    onValueChange: (value: string) => void;
}

export function PosterCategorySelector({ value, onValueChange }: PosterCategorySelectorProps) {
    const [open, setOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string>(POSTER_INDUSTRIES[0].category);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between bg-[#1A1D2B] border-white/10 text-white hover:bg-[#252836] hover:text-white h-12 rounded-xl transition-all shadow-sm"
                >
                    <div className="flex items-center gap-2 truncate">
                        <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                        {value ? (
                            <span className="font-medium text-indigo-100">{value}</span>
                        ) : (
                            <span className="text-slate-400 font-normal">업종/카테고리를 선택해주세요 (필수)</span>
                        )}
                    </div>
                    {/* Visual chevron is optional in Dialog trigger, but nice to have */}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[700px] p-0 bg-[#0F111A] border-white/10 text-white shadow-2xl overflow-hidden rounded-xl gap-0">
                <DialogHeader className="sr-only">
                    <DialogTitle>업종 선택</DialogTitle>
                    <DialogDescription>포스터 제작을 위한 업종과 상세 카테고리를 선택해주세요.</DialogDescription>
                </DialogHeader>

                <div className="flex h-[400px]">
                    {/* Left Column: Main Categories */}
                    <div className="w-[220px] border-r border-white/5 bg-[#141620] flex flex-col">
                        <div className="p-3 border-b border-white/5">
                            <h4 className="text-xs font-bold text-slate-500">대분류</h4>
                        </div>
                        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent p-2 space-y-1">
                            {POSTER_INDUSTRIES.map((group) => (
                                <button
                                    key={group.category}
                                    onClick={() => setActiveCategory(group.category)}
                                    className={cn(
                                        "w-full text-left px-3 py-3 rounded-lg text-sm transition-all flex items-center justify-between group",
                                        activeCategory === group.category
                                            ? "bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30"
                                            : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
                                    )}
                                >
                                    <span>{group.category}</span>
                                    {activeCategory === group.category && (
                                        <ChevronRight className="w-3 h-3 text-indigo-400" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Sub Items */}
                    <div className="flex-1 bg-[#0F111A] flex flex-col">
                        <div className="p-3 border-b border-white/5 bg-[#0F111A]">
                            <h4 className="text-xs font-bold text-slate-500">
                                {activeCategory} 상세 카테고리
                            </h4>
                        </div>
                        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent p-4">
                            <div className="grid grid-cols-1 gap-1">
                                {POSTER_INDUSTRIES.find(g => g.category === activeCategory)?.items.map((item) => {
                                    const fullValue = `${activeCategory} > ${item}`;
                                    const isSelected = value === fullValue || (value && value.includes(item));

                                    return (
                                        <button
                                            key={item}
                                            onClick={() => {
                                                onValueChange(fullValue);
                                                setOpen(false);
                                            }}
                                            className={cn(
                                                "w-full text-left px-4 py-3 rounded-lg text-sm transition-all flex items-center justify-between border border-transparent group",
                                                isSelected
                                                    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                                                    : "text-slate-300 hover:bg-white/5 hover:text-white hover:border-white/5"
                                            )}
                                        >
                                            <span className="group-hover:translate-x-1 transition-transform duration-200">{item}</span>
                                            {isSelected && (
                                                <Check className="w-4 h-4 text-emerald-400" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

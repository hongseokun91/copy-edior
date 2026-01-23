"use client";

import { useState, useMemo } from "react";
import { STYLES, Style } from "@/lib/styles";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

interface StyleSelectorProps {
    category: string;
    selectedStyleId: string;
    onSelect: (styleId: string) => void;
}

export function StyleSelector({ category, selectedStyleId, onSelect }: StyleSelectorProps) {
    const [showAll, setShowAll] = useState(false);

    const recommendedStyles = useMemo(() => {
        // Simple recommendation engine
        const recs = STYLES.filter((s) => s.recommendedFor?.includes(category));

        // Fallback to top 3 if no specific recommendations or too few
        if (recs.length < 3) {
            const others = STYLES.filter((s) => !recs.includes(s)).slice(0, 3 - recs.length);
            return [...recs, ...others];
        }
        return recs.slice(0, 3);
    }, [category]);

    const visibleStyles = showAll ? STYLES : recommendedStyles;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-800">어떤 스타일로 쓸까요?</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAll(!showAll)}
                    className="text-xs text-slate-500 h-8"
                >
                    {showAll ? (
                        <>
                            접기 <ChevronUp className="ml-1 h-3 w-3" />
                        </>
                    ) : (
                        <>
                            더보기 <ChevronDown className="ml-1 h-3 w-3" />
                        </>
                    )}
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {visibleStyles.map((style) => {
                    const isSelected = selectedStyleId === style.id;
                    return (
                        <Card
                            key={style.id}
                            className={cn(
                                "cursor-pointer transition-all duration-200 border-2 relative overflow-hidden group hover:shadow-md",
                                isSelected
                                    ? "border-slate-900 bg-slate-50"
                                    : "border-transparent bg-white hover:border-slate-200"
                            )}
                            onClick={() => onSelect(style.id)}
                        >
                            {isSelected && (
                                <div className="absolute top-2 right-2 text-slate-900 z-10">
                                    <CheckCircle2 className="h-5 w-5 fill-white" />
                                </div>
                            )}

                            {/* Thumbnail Placeholder */}
                            <div
                                className="h-20 w-full"
                                style={{ backgroundColor: style.previewColor }}
                            />

                            <div className="p-3">
                                <div className="font-bold text-sm text-slate-900 mb-1">
                                    {style.name}
                                </div>
                                <p className="text-xs text-slate-500 line-clamp-1 mb-2">
                                    {style.description}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {style.tags.slice(0, 2).map((tag) => (
                                        <span key={tag} className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

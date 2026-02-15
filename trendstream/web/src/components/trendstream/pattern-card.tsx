
import { PlayCircle, Instagram, Video, ArrowUpRight } from "lucide-react";

interface PatternCardProps {
    title: string;
    abstract: string;
    score: number;
    platform: 'youtube' | 'instagram' | 'tiktok';
    trendVelocity?: 'high' | 'medium' | 'low';
}

const ICONS = {
    youtube: PlayCircle,
    instagram: Instagram,
    tiktok: Video,
};

const COLORS = {
    youtube: "text-red-500",
    instagram: "text-pink-500",
    tiktok: "text-cyan-500",
};

export function PatternCard({ title, abstract, score, platform, trendVelocity }: PatternCardProps) {
    const Icon = ICONS[platform];
    const colorClass = COLORS[platform];

    return (
        <div className="group relative bg-slate-900/40 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/30 hover:bg-slate-900/60 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-3">
                <div className={`p-2 rounded-lg bg-slate-950 border border-slate-800 ${colorClass}`}>
                    <Icon className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-2">
                    {trendVelocity === 'high' && (
                        <span className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/20">
                            <ArrowUpRight className="h-3 w-3" /> Rising
                        </span>
                    )}
                    <div className="text-2xl font-bold text-slate-200">{score}</div>
                </div>
            </div>

            <h3 className="font-semibold text-slate-100 mb-2 line-clamp-2 group-hover:text-indigo-300 transition-colors">
                {title}
            </h3>
            <p className="text-sm text-slate-400 line-clamp-3">
                {abstract}
            </p>

            <div className="mt-4 pt-4 border-t border-slate-800/50 flex justify-between items-center text-xs text-slate-500">
                <span>Detected 2h ago</span>
                <span className="group-hover:translate-x-1 transition-transform">View Analysis &rarr;</span>
            </div>
        </div>
    );
}

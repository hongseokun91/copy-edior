"use client";

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import { GraphData } from '@/lib/intelligence/graph';

// Dynamically import ForceGraph2D with no SSR
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
    ssr: false,
    loading: () => <div className="h-[500px] flex items-center justify-center text-slate-500">Loading Graph Engine...</div>
});

export function TrendGraph({ data }: { data: GraphData }) {
    const [width, setWidth] = useState(600);
    const [height, setHeight] = useState(500);

    useEffect(() => {
        // Responsive update
        const updateSize = () => {
            const container = document.getElementById('graph-container');
            if (container) {
                setWidth(container.clientWidth);
                setHeight(container.clientHeight);
            }
        };
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    return (
        <div id="graph-container" className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 min-h-[500px] relative">
            <ForceGraph2D
                width={width}
                height={height}
                graphData={data}
                nodeLabel="name"
                nodeColor={(node: any) => node.type === 'cluster' ? '#818cf8' : '#cbd5e1'}
                nodeRelSize={6}
                linkColor={() => '#475569'}
                backgroundColor="#020617" // slate-950
            />
            <div className="absolute top-4 left-4 bg-slate-900/80 p-3 rounded-lg border border-slate-700 backdrop-blur-sm text-xs text-slate-300">
                <div className="font-semibold mb-1 text-white">Legend</div>
                <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-indigo-400"></span> Pattern Cluster</div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-300"></span> Keyword/Concept</div>
            </div>
        </div>
    );
}

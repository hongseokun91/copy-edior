
export interface GraphNode {
    id: string;
    group: number;
    val: number; // size
    name: string;
    type: 'cluster' | 'keyword' | 'entity';
}

export interface GraphLink {
    source: string;
    target: string;
    value: number; // weight
}

export interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
}

export async function fetchTrendGraph(): Promise<GraphData> {
    // Mock Data
    return {
        nodes: [
            { id: 'c-hook-01', group: 1, val: 20, name: "The 'Unexpected Expert' Hook", type: 'cluster' },
            { id: 'c-struct-02', group: 2, val: 15, name: "ASMR Unboxing Reversal", type: 'cluster' },
            { id: 'c-visual-03', group: 3, val: 10, name: "Carousel Storytelling", type: 'cluster' },

            { id: 'k-expert', group: 1, val: 5, name: "Authority Bias", type: 'keyword' },
            { id: 'k-contrarian', group: 1, val: 5, name: "Contrarian", type: 'keyword' },

            { id: 'k-sound', group: 2, val: 5, name: "Sound Design", type: 'keyword' },
            { id: 'k-rewind', group: 2, val: 5, name: "Reverse Edit", type: 'keyword' },

            { id: 'k-swipe', group: 3, val: 5, name: "Swipe UI", type: 'keyword' },
        ],
        links: [
            { source: 'c-hook-01', target: 'k-expert', value: 5 },
            { source: 'c-hook-01', target: 'k-contrarian', value: 3 },

            { source: 'c-struct-02', target: 'k-sound', value: 5 },
            { source: 'c-struct-02', target: 'k-rewind', value: 4 },

            { source: 'c-visual-03', target: 'k-swipe', value: 5 },

            // Cross-pollination
            { source: 'c-hook-01', target: 'c-struct-02', value: 1 }, // Slight relation
        ]
    };
}

import { FlyerSlots } from "./flyer";

export type LeafletPageId = "P1" | "P2" | "P3" | "P4" | "P5" | "P6";

export interface LeafletSection {
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: Record<string, any>; // Flexible structure for different section types
}

export interface LeafletPage {
    page_id: LeafletPageId;
    role: string;
    sections: LeafletSection[];
}

export interface LeafletVariant {
    pages: LeafletPage[];
    meta?: {
        template_id?: string;
        layout_id?: "A" | "B";
    };
}

// Unified type for generated content
export type VariantContent = FlyerSlots | LeafletVariant;

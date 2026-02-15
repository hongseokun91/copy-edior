
// @ts-ignore
import PptxGenJS from "pptxgenjs";
import { ReportConfig } from "@/lib/enterprise/reports";

export async function generatePptx(report: ReportConfig): Promise<Buffer> {
    const pptx = new PptxGenJS();

    // 1. Theme Setup
    pptx.layout = "LAYOUT_16x9";
    pptx.defineSlideMaster({
        title: "MASTER_SLIDE",
        background: { color: "0F172A" }, // Slate 950
        objects: [
            { rect: { x: 0, y: 0, w: "100%", h: 0.15, fill: { color: "6366F1" } } }, // Indigo Bar
            { text: { text: "Trendstream™ Enterprise Intelligence", options: { x: 0.5, y: 0.05, w: 5, h: 0.25, fontSize: 10, color: "E2E8F0" } } },
            { text: { text: report.dateRange, options: { x: 11, y: 0.05, w: 2, h: 0.25, fontSize: 10, color: "94A3B8", align: "right" } } }
        ]
    });

    // 2. Cover Slide
    const slide1 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
    slide1.addText(report.title, { x: 1, y: 2.5, w: "80%", fontSize: 36, color: "FFFFFF", bold: true });
    slide1.addText("Confidential Strategy Report", { x: 1, y: 3.5, w: "50%", fontSize: 18, color: "94A3B8" });

    // 3. Executive Summary
    const slide2 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
    slide2.addText("Executive Summary", { x: 0.5, y: 0.5, fontSize: 24, color: "FFFFFF", bold: true });

    slide2.addText(
        [
            { text: "• 3 Rising Patterns identified in Beauty & Tech sectors.\n", options: { breakLine: true } },
            { text: "• 'Unexpected Expert' hook showing +124% lift.\n", options: { breakLine: true } },
            { text: "• Recommended Action: Adopt 'Visual Carousel' format immediately.", options: { breakLine: true } }
        ],
        { x: 1, y: 1.5, w: "80%", h: 4, fontSize: 18, color: "E2E8F0", bullet: true }
    );

    // 4. Data Slide (Mock Chart Placeholder)
    const slide3 = pptx.addSlide({ masterName: "MASTER_SLIDE" });
    slide3.addText("Cluster Performance", { x: 0.5, y: 0.5, fontSize: 24, color: "FFFFFF", bold: true });

    // Add a shape to represent a chart
    slide3.addShape(pptx.ShapeType.rect, { x: 1, y: 1.5, w: 3, h: 4, fill: { color: "10B981" } }); // Emerald Bar
    slide3.addShape(pptx.ShapeType.rect, { x: 5, y: 2.5, w: 3, h: 3, fill: { color: "F59E0B" } }); // Amber Bar
    slide3.addShape(pptx.ShapeType.rect, { x: 9, y: 3.5, w: 3, h: 2, fill: { color: "3B82F6" } }); // Blue Bar

    slide3.addText("Hook", { x: 1, y: 5.6, w: 3, align: "center", fontSize: 14, color: "CBD5E1" });
    slide3.addText("Structure", { x: 5, y: 5.6, w: 3, align: "center", fontSize: 14, color: "CBD5E1" });
    slide3.addText("Visual", { x: 9, y: 5.6, w: 3, align: "center", fontSize: 14, color: "CBD5E1" });

    // Generate buffer
    return await pptx.write({ outputType: "nodebuffer" }) as Buffer;
}

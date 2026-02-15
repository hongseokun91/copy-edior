
import { NextRequest, NextResponse } from "next/server";
import { generatePptx } from "@/lib/reports/pptx-builder";
import { fetchReports } from "@/lib/enterprise/reports";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const reportId = params.id;
    const reports = await fetchReports();
    const report = reports.find(r => r.id === reportId);

    if (!report) {
        return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    try {
        const buffer = await generatePptx(report);

        return new NextResponse(buffer as any, {
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                "Content-Disposition": `attachment; filename="${report.title.replace(/\s+/g, '_')}.pptx"`,
            },
        });
    } catch (error) {
        console.error("PPTX Generation Error:", error);
        return NextResponse.json({ error: "Failed to generate PPTX" }, { status: 500 });
    }
}

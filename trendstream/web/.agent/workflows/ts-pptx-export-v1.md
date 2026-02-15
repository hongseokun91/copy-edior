---
description: Trendstream Phase 3 - PPTX Export
---

# PPTX Export V1

## Goal
Downloadable Strategy Deck.

## Steps
1. **Library**:
   - Install `pptxgenjs`.
2. **Builder**:
   - `src/lib/reports/pptx-builder.ts`.
   - Map `Report` data to slides (Cover, Trend 1, Trend 2, Summary).
3. **API**:
   - `GET /api/reports/:id/pptx`.
   - Stream file download.

## Verification
- Generate a report.
- Click "Export PPTX".
- Open file in PowerPoint.

---
description: Trendstream Phase 0 - Testing Strategy
---

# Testing Strategy

## Scope
- Unit tests for utils (normalization).
- Integration tests for Ingest Action.

## Steps
1. Install ecosystem: `vitest` or `jest`.
   - Recommended: `npm install -D vitest @vitejs/plugin-react jsdom`
2. Create `vitest.config.ts`.
3. Create `src/lib/normalization.test.ts`.
   - Test case: "youtube.com/watch?v=..." -> platform: 'youtube'.
4. Run `npm test`.

## CI/CD
- Ensure tests pass before commit (husky pre-commit hook optional for MVP).

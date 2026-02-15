
// v0.9 Feature Flags System
// Default: OFF (false) in Prod, but can be toggled via Env vars.

export const FLAGS = {
    PRO_COPY_V09: process.env.NEXT_PUBLIC_FF_PRO_COPY_V09 === 'true',
    FLYER_TYPES: process.env.NEXT_PUBLIC_FF_FLYER_TYPES === 'true',
    SIMILARITY_GUARD: process.env.NEXT_PUBLIC_FF_SIMILARITY_GUARD === 'true',
    EXTRA_MODULES: process.env.NEXT_PUBLIC_FF_EXTRA_MODULES === 'true',
    // V33: Leaflet Orchestration (Safe Rollback)
    ENTERPRISE_ORCHESTRATION: true,
};

// Local Dev Helper: Force ON if local and specific flag is missing (Optional)
if (process.env.NODE_ENV === 'development' && !process.env.VERCEL) {
    // Optionally enable all for local dev if desired
    // Object.keys(FLAGS).forEach(k => FLAGS[k] = true); 
}

console.log(`[FF] Feature Flags:`, FLAGS);

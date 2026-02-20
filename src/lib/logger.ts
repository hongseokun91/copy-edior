export type LogLevel = 'info' | 'warn' | 'error';
export type LogType =
    | 'GEN_SUCCESS'
    | 'GEN_FAIL_SAFETY'
    | 'GEN_FAIL_LIMIT'
    | 'GEN_INVALID_INPUT'
    | 'GEN_QUALITY_WARN'
    | 'API_ERROR'
    | 'SYSTEM'
    | 'GEN_AI_FAIL'
    | 'GEN_FALLBACK'
    | 'GEN_SIMILARITY_WARN'
    | 'GEN_AI_DRAFT_FAIL'
    | 'GEN_EDITOR_FAIL'
    | 'GEN_BRIEF_RECEIVED'
    | 'GEN_BRIEF_EMPTY'
    // [NEW] v3.0 Stabilization Types
    | 'GEN_INVALID'
    | 'GEN_FAIL_FINAL'
    | 'GEN_ERROR'
    | 'SECURITY_EVENT' // [NEW]
    | 'GEN_SCHEMA_FAIL' // [NEW]
    | 'GEN_VARIANT_START' // [NEW] Leaflet Multi-Variant
    | 'GEN_VARIANT_FAIL' // [NEW] Leaflet Multi-Variant
    | 'ECO_PASS1_START'
    | 'ECO_PASS2_START'
    | 'GEN_SCRAPE'
    | 'GEN_SCRAPE_FAIL';

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    type: LogType;
    message: string;
    meta?: Record<string, unknown>;
}

// [HARDENING] PII Masker
function maskPII(msg: string): string {
    if (!msg) return "";
    // Mask Phone: 010-xxxx-xxxx, 02-xxx-xxxx, etc.
    let masked = msg.replace(/(010|02|0[3-6][1-5]|070)-\d{3,4}-(\d{4})/g, "$1-****-$2");
    // Mask Email: a***@domain.com
    masked = masked.replace(/([a-zA-Z0-9._-]+)(@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g, (match, user, domain) => {
        return user.length > 2 ? user.slice(0, 2) + "***" + domain : user + "***" + domain;
    });
    return masked;
}

export const logger = {
    log: (level: LogLevel, type: LogType, message: string, meta?: Record<string, unknown>) => {
        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level,
            type,
            message,
            meta,
        };
        // In production, this would go to a file or log service.
        // For now, we print JSON string to stdout for structured capturing.
        // [HARDENING] Mask PII in logs
        entry.message = maskPII(entry.message);
        if (entry.meta) {
            entry.meta = JSON.parse(maskPII(JSON.stringify(entry.meta)));
        }
        console.log(JSON.stringify(entry));
    },

    info: (type: LogType, message: string, meta?: Record<string, unknown>) => {
        logger.log('info', type, message, meta);
    },

    warn: (type: LogType, message: string, meta?: Record<string, unknown>) => {
        logger.log('warn', type, message, meta);
    },

    error: (type: LogType, message: string, meta?: Record<string, unknown>) => {
        logger.log('error', type, message, meta);
    },
};

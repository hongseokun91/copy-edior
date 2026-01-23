
export type LogLevel = 'info' | 'warn' | 'error';
export type LogType = 'GEN_SUCCESS' | 'GEN_FAIL_SAFETY' | 'GEN_FAIL_LIMIT' | 'GEN_INVALID_INPUT' | 'API_ERROR' | 'SYSTEM';

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    type: LogType;
    message: string;
    meta?: Record<string, unknown>;
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

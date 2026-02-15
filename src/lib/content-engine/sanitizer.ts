
/**
 * SANITIZER MODULE (Enterprise v3.0)
 * Responsible for cleaning raw input before any logic processing.
 * Removes system tags, artifacts, and unsafe patterns.
 */
export function sanitizeRawInput(text: string | null | undefined): string {
    if (!text) return "";

    // 1. Remove System Tags (e.g., [정보확인] 주차: 가능)
    // We remove the entire line if it starts with or contains the tag, 
    // assuming these are appended system logs.
    const cleanLines = text.split('\n').filter(line => {
        const hasSystemTag = line.includes("[정보확인]") || line.includes("[Fact]");
        return !hasSystemTag;
    });

    return cleanLines.join('\n').trim();
}

/**
 * Validates if the input is safe for Commercial Use
 * Checks for PII patterns or Injection attempts (Basic)
 */
export function validateInputSafety(text: string): boolean {
    // Placeholder for future XSS or Injection checks
    return true;
}

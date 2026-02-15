export function normalizeContact(contact: string): string {
    if (!contact) return "";

    // 01012345678 -> 010-1234-5678
    const clean = contact.replace(/[^0-9]/g, "");
    if (clean.length === 11 && clean.startsWith("010")) {
        return `${clean.slice(0, 3)}-${clean.slice(3, 7)}-${clean.slice(7)}`;
    }
    return contact; // Return original if not standard mobile format
}

export function normalizePeriod(period: string): string {
    if (!period) return "";
    return period.trim();
}

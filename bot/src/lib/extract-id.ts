export function extractMessageIDFromSlackURL(url: string): string | null {
    try {
        const path = new URL(url).pathname;
        const segment = path.split("/").pop();

        if (!segment) return null;

        // slack expects seconds.microseconds not p<seconds><microseconds>
        if (/^p\d+$/.test(segment)) {
            const ts = segment.slice(1);
            const seconds = ts.slice(0, -6);
            const micro = ts.slice(-6);
            return `${seconds}.${micro}`;
        }

        // if already in seconds.microseconds format
        if (/^\d+\.\d+$/.test(segment)) return segment;

        return null;
    } catch {
        return null;
    }
}
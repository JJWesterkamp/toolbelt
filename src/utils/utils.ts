export function show(x: any): string {
    try {
        return JSON.stringify(x)
    } catch (error: unknown) {
        return String(x)
    }
}

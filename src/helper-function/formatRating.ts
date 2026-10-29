export default function formatRating(
    average: number | null,
    count: number
): string {
    if (average === null || count === 0) return "No ratings yet"

    const noun = count === 1 ? "rating" : "ratings"
    return `${average.toFixed(1)} / 5 (${count} ${noun})`
}

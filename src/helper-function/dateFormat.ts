function dateFormat(date: string): string {
    const posT: number = date.search("T")
    if (posT === -1) return date
    return date.slice(0, posT)
}

export default dateFormat

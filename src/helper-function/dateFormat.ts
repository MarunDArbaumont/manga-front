function dateFormat(date: string): string {
    let posT: number = date.search("T")
    let formattedDate: string = date.slice(0, posT)
    return formattedDate
}


export default dateFormat
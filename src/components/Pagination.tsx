type PaginationProps = {
    count: number
    limit: number
    offset: number
    onOffsetChange: (offset: number) => void
    disabled?: boolean
}

function Pagination({
    count,
    limit,
    offset,
    onOffsetChange,
    disabled = false,
}: PaginationProps) {
    if (count <= limit) return null

    const totalPages = Math.max(1, Math.ceil(count / limit))
    const currentPage = Math.min(totalPages, Math.floor(offset / limit) + 1)
    const canGoBack = offset > 0
    const canGoForward = offset + limit < count

    return (
        <div className="pagination" role="navigation" aria-label="Pagination">
            <button
                type="button"
                onClick={() => onOffsetChange(Math.max(0, offset - limit))}
                disabled={disabled || !canGoBack}
            >
                Previous
            </button>
            <span aria-live="polite">
                Page {currentPage} of {totalPages} ({count} results)
            </span>
            <button
                type="button"
                onClick={() => onOffsetChange(offset + limit)}
                disabled={disabled || !canGoForward}
            >
                Next
            </button>
        </div>
    )
}

export default Pagination

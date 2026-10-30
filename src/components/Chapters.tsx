import { useCallback, useState, type FormEvent } from 'react'
import { Link } from "react-router-dom"
import { fetchChaptersPage, type Chapter } from "../api/chapters"
import { getApiErrorMessage, type ResultPagination } from "../api/api"
import { useApiResource } from "../hooks/useApiResource"
import dateFormat from "../helper-function/dateFormat"
import formatRating from "../helper-function/formatRating"
import ErrorMessage from './ErrorMessage'
import Loading from './Loading'
import EmptyState from './EmptyState'
import Pagination from './Pagination'

const PAGE_SIZE = 10

type ChapterFilters = {
    manga: string
    number: string
    ordering: string
}

const defaultFilters = (): ChapterFilters => ({
    manga: "",
    number: "",
    ordering: "first_published",
})

function AllChapters() {
    const [filters, setFilters] = useState<ChapterFilters>(defaultFilters)
    const [draft, setDraft] = useState<ChapterFilters>(defaultFilters)
    const [offset, setOffset] = useState(0)

    const loadChapters = useCallback(() => fetchChaptersPage({
        limit: PAGE_SIZE,
        offset,
        manga: filters.manga || undefined,
        number: filters.number ? Number(filters.number) : undefined,
        ordering: filters.ordering || undefined,
    }), [filters, offset])

    const { data, error, loading } = useApiResource<ResultPagination<Chapter>>(loadChapters)
    const results = data?.results ?? []

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setFilters({
            ...draft,
            manga: draft.manga.trim(),
            number: draft.number.trim(),
        })
        setOffset(0)
    }

    const handleReset = () => {
        const reset = defaultFilters()
        setDraft(reset)
        setFilters(reset)
        setOffset(0)
    }

    return (
        <>
            <form className="filter-form" onSubmit={handleSubmit}>
                <label>
                    Manga ID
                    <input
                        type="number"
                        min="1"
                        value={draft.manga}
                        onChange={(event) => setDraft({ ...draft, manga: event.target.value })}
                        placeholder="Any"
                    />
                </label>
                <label>
                    Chapter number
                    <input
                        type="number"
                        min="1"
                        value={draft.number}
                        onChange={(event) => setDraft({ ...draft, number: event.target.value })}
                        placeholder="Any"
                        step="any"
                    />
                </label>
                <label>
                    Sort
                    <select
                        value={draft.ordering}
                        onChange={(event) => setDraft({ ...draft, ordering: event.target.value })}
                    >
                        <option value="first_published">Oldest first</option>
                        <option value="-first_published">Newest first</option>
                        <option value="manga">Series ID ascending</option>
                        <option value="-manga">Series ID descending</option>
                        <option value="-average_rating">Highest rank</option>
                        <option value="average_rating">Lowest rank</option>
                    </select>
                </label>
                <div className="filter-actions">
                    <button type="submit" disabled={loading}>Apply</button>
                    <button type="button" onClick={handleReset}>Clear</button>
                </div>
            </form>

            {loading ? (
                <Loading message="Loading chapters..." />
            ) : error ? (
                <ErrorMessage message={getApiErrorMessage(error, { fallback: "Failed to load chapters." })} />
            ) : results.length === 0 ? (
                <EmptyState message="No chapters match these filters." />
            ) : (
                <ul className="chapter-list">
                    {results.map((chapter) => (
                        <li key={chapter.id} className="chapter-list-item">
                            <h3>
                                <Link to={`/chapters/${chapter.id}`}>
                                    Chapter {chapter.number}: {chapter.name}
                                </Link>
                            </h3>
                            <p>
                                Series:{" "}
                                <Link to={`/series/${chapter.manga.id}`}>
                                    {chapter.manga.title}
                                </Link>
                            </p>
                            <p>Published: {dateFormat(chapter.first_published)}</p>
                            <p>{formatRating(chapter.average_rating, chapter.count_rating)}</p>
                        </li>
                    ))}
                </ul>
            )}

            {error || loading ? null : (
                <Pagination
                    count={data?.count ?? 0}
                    limit={PAGE_SIZE}
                    offset={offset}
                    onOffsetChange={setOffset}
                />
            )}
        </>
    )
}

export default AllChapters

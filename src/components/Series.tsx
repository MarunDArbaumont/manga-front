import { useCallback, useState, type FormEvent } from 'react'
import { fetchSeriesPage, type Serie } from "../api/series"
import { getApiErrorMessage, type ResultPagination } from "../api/api"
import ErrorMessage from './ErrorMessage'
import Loading from './Loading'
import EmptyState from './EmptyState'
import Pagination from './Pagination'
import SerieCard from './SerieCard'
import { useApiResource } from "../hooks/useApiResource"

const PAGE_SIZE = 10

type SeriesFilters = {
    title: string
    genre: string
    ongoing: "" | "true" | "false"
    ordering: string
}

const defaultFilters = (): SeriesFilters => ({
    title: "",
    genre: "",
    ongoing: "",
    ordering: "title",
})

function Series() {
    const [filters, setFilters] = useState<SeriesFilters>(defaultFilters)
    const [draft, setDraft] = useState<SeriesFilters>(defaultFilters)
    const [offset, setOffset] = useState(0)

    const loadSeries = useCallback(() => fetchSeriesPage({
        limit: PAGE_SIZE,
        offset,
        title: filters.title || undefined,
        genre: filters.genre || undefined,
        ongoing: filters.ongoing === "" ? undefined : filters.ongoing === "true",
        ordering: filters.ordering || undefined,
    }), [filters, offset])

    const { data, error, loading } = useApiResource<ResultPagination<Serie>>(loadSeries)
    const results = data?.results ?? []

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setFilters({
            ...draft,
            title: draft.title.trim(),
            genre: draft.genre.trim(),
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
                    Title
                    <input
                        type="text"
                        value={draft.title}
                        onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                        placeholder="Exact title"
                    />
                </label>
                <label>
                    Genre
                    <select
                        value={draft.genre}
                        onChange={(event) => setDraft({ ...draft, genre: event.target.value })}
                    >
                        <option value="">All</option>
                        <option value="shonen">Shonen</option>
                        <option value="seinen">Seinen</option>
                        <option value="shojo">Shojo</option>
                    </select>
                </label>
                <label>
                    Status
                    <select
                        value={draft.ongoing}
                        onChange={(event) => setDraft({
                            ...draft,
                            ongoing: event.target.value as SeriesFilters["ongoing"],
                        })}
                    >
                        <option value="">All</option>
                        <option value="true">Ongoing</option>
                        <option value="false">Completed</option>
                    </select>
                </label>
                <label>
                    Sort
                    <select
                        value={draft.ordering}
                        onChange={(event) => setDraft({ ...draft, ordering: event.target.value })}
                    >
                        <option value="title">Title A-Z</option>
                        <option value="-title">Title Z-A</option>
                        <option value="first_published">Oldest first</option>
                        <option value="-first_published">Newest first</option>
                    </select>
                </label>
                <div className="filter-actions">
                    <button type="submit" disabled={loading}>Apply</button>
                    <button type="button" onClick={handleReset}>Clear</button>
                </div>
            </form>

            {loading ? (
                <Loading message="Loading series..." />
            ) : error ? (
                <ErrorMessage message={getApiErrorMessage(error, { fallback: "Failed to load series." })} />
            ) : results.length === 0 ? (
                <EmptyState message="No series match these filters." />
            ) : (
                <div className="serie-list">
                    {results.map((serie) => (
                        <SerieCard key={serie.id} serie={serie} />
                    ))}
                </div>
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

export default Series

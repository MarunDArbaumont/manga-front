import { useCallback, useState, type FormEvent } from 'react'
import { Link } from "react-router-dom"
import { fetchAuthorsPage, type Author } from "../api/authors"
import { getApiErrorMessage, type ResultPagination } from "../api/api"
import { mediaUrl } from "../api/variables"
import { useApiResource } from "../hooks/useApiResource"
import dateFormat from "../helper-function/dateFormat"
import defaultProfilePicture from "../assets/img/Pandaman_Oda.jpg"
import ErrorMessage from './ErrorMessage'
import Loading from './Loading'
import EmptyState from './EmptyState'
import Pagination from './Pagination'

const PAGE_SIZE = 10

type AuthorFilters = {
    name: string
    ordering: string
}

const defaultFilters = (): AuthorFilters => ({
    name: "",
    ordering: "name",
})

function AllAuthors() {
    const [filters, setFilters] = useState<AuthorFilters>(defaultFilters)
    const [draft, setDraft] = useState<AuthorFilters>(defaultFilters)
    const [offset, setOffset] = useState(0)

    const loadAuthors = useCallback(() => fetchAuthorsPage({
        limit: PAGE_SIZE,
        offset,
        name: filters.name || undefined,
        ordering: filters.ordering || undefined,
    }), [filters, offset])

    const { data, error, loading } = useApiResource<ResultPagination<Author>>(loadAuthors)
    const results = data?.results ?? []

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setFilters({ ...draft, name: draft.name.trim() })
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
                    Name
                    <input
                        type="text"
                        value={draft.name}
                        onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                        placeholder="Exact name"
                    />
                </label>
                <label>
                    Sort
                    <select
                        value={draft.ordering}
                        onChange={(event) => setDraft({ ...draft, ordering: event.target.value })}
                    >
                        <option value="name">Name A-Z</option>
                        <option value="-name">Name Z-A</option>
                        <option value="birth_day">Oldest first</option>
                        <option value="-birth_day">Youngest first</option>
                    </select>
                </label>
                <div className="filter-actions">
                    <button type="submit" disabled={loading}>Apply</button>
                    <button type="button" onClick={handleReset}>Clear</button>
                </div>
            </form>

            {loading ? (
                <Loading message="Loading authors..." />
            ) : error ? (
                <ErrorMessage message={getApiErrorMessage(error, { fallback: "Failed to load authors." })} />
            ) : results.length === 0 ? (
                <EmptyState message="No authors match these filters." />
            ) : (
                <div className="author-list">
                    {results.map((author) => (
                        <Link key={author.id} to={`/authors/${author.id}`} className="author-card">
                            <img
                                src={mediaUrl(author.image, defaultProfilePicture)}
                                alt={`Portrait of ${author.name}`}
                            />
                            <div>
                                <h3>{author.name}</h3>
                                <p>{author.series.length} series</p>
                                <p>Born {dateFormat(author.birth_day)}</p>
                            </div>
                        </Link>
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

export default AllAuthors

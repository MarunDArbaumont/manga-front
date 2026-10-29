import { useCallback } from 'react'
import { Link } from "react-router-dom"
import { fetchSingleSerie, type SerieSingle } from "../api/series"
import { getApiErrorMessage } from '../api/api'
import { mediaUrl } from '../api/variables'
import { useApiResource } from '../hooks/useApiResource'
import dateFormat from '../helper-function/dateFormat'
import formatRating from '../helper-function/formatRating'
import EmptyState from './EmptyState'
import ErrorMessage from './ErrorMessage'
import Loading from './Loading'
import defaultCover from '../assets/img/Pandaman_Oda.jpg'

function SingleSerie( {id}: { id: string }) {
    const loadSerie = useCallback(() => fetchSingleSerie(id), [id])
    const { data: serie, error, loading } = useApiResource<SerieSingle>(loadSerie)

    if (loading) return <Loading message="Loading series..." />
    if (error) return <ErrorMessage message={getApiErrorMessage(error, { fallback: "Failed to load this series." })} />
    if (!serie) return <h2>This series doesn't exist</h2>

    return (
        <>
            <div className="serie-detail-header">
                <img
                    src={mediaUrl(serie.cover, defaultCover)}
                    alt={`Cover of ${serie.title}`}
                    className="serie-cover"
                />
                <div>
                    <h1>{serie.title}</h1>
                    <p>Status: {serie.last_published ? `Completed on ${dateFormat(serie.last_published)}` : "Ongoing"}</p>
                    <p>First published: {dateFormat(serie.first_published)}</p>
                    {serie.genre ? <p>Genre: {serie.genre}</p> : null}
                    <p>Rating: {formatRating(serie.average_rating, serie.count_rating)}</p>
                    <p>
                        Authors:{" "}
                        {serie.authors.length > 0
                            ? serie.authors.map((author, index) => (
                                <span key={author.id}>
                                    {index > 0 ? ", " : null}
                                    <Link to={`/authors/${author.id}`}>{author.name}</Link>
                                </span>
                            ))
                            : "Unknown author"}
                    </p>
                    <p className="serie-description">{serie.description || "No description yet."}</p>
                </div>
            </div>

            <h2>Chapters ({serie.chapters.length})</h2>
            {serie.chapters.length === 0 ? (
                <EmptyState message="No chapters have been added to this series yet." />
            ) : (
                <ul className="chapter-list">
                    {serie.chapters.map((chapter) => (
                        <li key={chapter.id} className="chapter-list-item">
                            <h3>
                                <Link to={`/chapters/${chapter.id}`}>
                                    Chapter {chapter.number}: {chapter.name}
                                </Link>
                            </h3>
                            <p>Published: {dateFormat(chapter.first_published)}</p>
                            <p>{formatRating(chapter.average_rating, chapter.count_rating)}</p>
                        </li>
                    ))}
                </ul>
            )}
        </>
    )
}
export default SingleSerie

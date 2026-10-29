import { useCallback } from 'react'
import { fetchSingleAuthor, type Author } from "../api/authors"
import { getApiErrorMessage } from '../api/api'
import { mediaUrl } from '../api/variables'
import { useApiResource } from '../hooks/useApiResource'
import dateFormat from "../helper-function/dateFormat"
import defaultProfilePicture from '../assets/img/Pandaman_Oda.jpg'
import EmptyState from './EmptyState'
import ErrorMessage from './ErrorMessage'
import Loading from './Loading'
import SerieCard from './SerieCard'

function SingleAuthor( {id}: { id: string }) {
    const loadAuthor = useCallback(() => fetchSingleAuthor(id), [id])
    const { data: author, error, loading } = useApiResource<Author>(loadAuthor)

    if (loading) return <Loading message="Loading author..." />
    if (error) return <ErrorMessage message={getApiErrorMessage(error, { fallback: "Failed to load this author." })} />
    if (!author) return <h2>This author doesn't exist</h2>

    return (
        <>
            <div className="author-detail-header">
                <img
                    src={mediaUrl(author.image, defaultProfilePicture)}
                    alt={`Portrait of ${author.name}`}
                    className="single-author-image"
                />
                <div>
                    <h1>{author.name}</h1>
                    <p>Born on: {dateFormat(author.birth_day)}</p>
                    {author.death_date ? (
                        <p>Died on: {dateFormat(author.death_date)}</p>
                    ) : null}
                    <p>{author.series.length} manga series</p>
                </div>
            </div>

            <h2>Manga series</h2>
            {author.series.length === 0 ? (
                <EmptyState message="No manga series are listed for this author yet." />
            ) : (
                <div className="serie-list">
                    {author.series.map((serie) => (
                        <SerieCard key={serie.id} serie={serie} />
                    ))}
                </div>
            )}
        </>
    )
}
export default SingleAuthor

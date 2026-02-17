import { useEffect, useState } from 'react'
import { fetchSingleAuthor, type Author } from "../api/authors"
import ErrorMessage from './ErrorMessage'
import Loading from './Loading'

function SingleAuthor( {id}: { id: string }) {
    const [author, setAuthor] = useState<Author | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        
        async function load() {
            try {
                const data = await fetchSingleAuthor(id)
                setAuthor(data)
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message)
                }
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [id])

    if (loading) return <Loading message="Loading series..." />
    if (error) return <ErrorMessage message={error} />
    if (!author) return <h2>Is null</h2>

    return (
        <>
            <h3>{author.name}</h3>
            <p>born on: {author.birth_day}</p>
        </>
    )
}
export default SingleAuthor
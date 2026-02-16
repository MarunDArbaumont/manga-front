import { useEffect, useState } from 'react'
import { fetchAllAuthors } from "../api/authors"
import type { Author } from "../api/authors"
import Loading from './Loading'
import ErrorMessage from './ErrorMessage'

function AllAuhtors() {
    const [authors, setAuthors] = useState<Author[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            try {
                const data = await fetchAllAuthors()
                setAuthors(data)
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message)
                }
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    if (loading) return <Loading message="Loading authors..." />
    if (error) return <ErrorMessage message={error} />
    
    return (
        <>
            <h2>Manga auhtors</h2>
            {authors.map((author) => (
                <div>
                <h3>{author.name}</h3>
                <p>Born in: {author.birth_day}</p>
                </div>
            ))}
        </>
  )
}

export default AllAuhtors
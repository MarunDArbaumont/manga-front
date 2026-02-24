import { useEffect, useState } from 'react'
import { fetchAllChapters } from "../api/chapters"
import type { Chapter } from "../api/chapters"
import Loading from './Loading'
import ErrorMessage from './ErrorMessage'

function AllChapters() {
    const [chapters, setChapters] = useState<Chapter[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

   useEffect(() => {
        async function load() {
            try {
                const data = await fetchAllChapters()
                console.log(data)
                setChapters(data)
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

    if (loading) return <Loading message="Loading chapters..." />
    if (error) return <ErrorMessage message={error} />

    return (
        <>
            <h2>Manga chapters</h2>
            {chapters.map((chapter) => (
                <a key={chapter.id} href={"/chapters/" + chapter.id}>
                    <h3>{chapter.name}</h3>
                </a>
            ))}
        </>
  )
}

export default AllChapters
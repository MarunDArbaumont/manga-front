import { useEffect, useState } from 'react'
import { fetchProfileByUserID, fetchUserByID, type SingleProfile, type UserType } from '../api/users'
import ErrorMessage from './ErrorMessage'
import Loading from './Loading'
import ReviewComponent from './Review'
import RemoveFromCollection from './RemoveFromCollection'

function ProfileComponent( {id}: { id: string }) {
    const [profile, setProfile] = useState<SingleProfile | null>(null)
    const [profileUser, setUserProfile] = useState<UserType | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => { 
        async function load() {
            try {
                const data = await fetchProfileByUserID(id)
                setProfile(data)
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

    useEffect(() => {

        async function loadUser() {
            if (!profile) return
            const results = await fetchUserByID(profile.user.toString())
            setUserProfile(results)
        }

        loadUser()
    }, [profile])

    if (loading) return <Loading message="Loading series..." />
    if (error) return <ErrorMessage message={error} />
    if (!profile) return <h2>This user doesn't have a profile or doesn't exist</h2>
    
    async function loadProfile() {
        const data = await fetchProfileByUserID(id)
        setProfile(data)
    }
    const reset = () => {
        loadProfile()
    }

    return (
        <>
            <h1>Welcome to {profileUser?.username}'s profile</h1>
            <p>Bio: {profile.bio}</p>
            <h3>Collection: </h3>
            <ul>
                {profile.mangas.map((chapter) => (
                    <li key={chapter.id}>
                        <a href={"/chapters/" + chapter.id}>Number {chapter.number}: {chapter.name}</a>
                        <RemoveFromCollection chapter={chapter.id} resetFunc={reset}/>
                    </li>
                ))}
            </ul>
            <ReviewComponent id={profile.user.toString()} review_type={"user"} />
        </>
    )
}
export default ProfileComponent
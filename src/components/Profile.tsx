import { useEffect, useMemo, useState } from 'react'
import { fetchProfileByUserID, fetchUserByID, type SingleProfile, type UserType } from '../api/users'
import ErrorMessage from './ErrorMessage'
import Loading from './Loading'
import ReviewComponent from './Review'
import RemoveFromCollection from './RemoveFromCollection'
import { useAuth } from '../hooks/useAuth'
import EditProfileBio from './EditProfileBio'
import EditProfilePicture from './EditProfilePicture'
import { Link } from "react-router-dom"
import type { Serie } from '../api/series'
import type { Chapter } from '../api/chapters'

type ProfileCollection = {
    [mangaId: number]: {
        serie: Serie
        chapters: Chapter[];
    };
};

function ProfileComponent( {id}: { id: string }) {
    const { user } = useAuth()
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

    const collection = useMemo(() => {
        const grouped: ProfileCollection = {}

        if (!profile) return grouped

        profile.mangas.forEach((chapter) => {
            if (!grouped[chapter.manga.id]) {
                grouped[chapter.manga.id] = {
                    serie: chapter.manga,
                    chapters: [],
                };
            }

            grouped[chapter.manga.id].chapters.push(chapter)
        });

        return grouped
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

    const isConnected = user && profile.user.toString() == user.id
    return (
        <>
            <h1>Welcome to {profileUser?.username}'s profile</h1>
            <div className="pp-container">
                {profile.profile_picture != null? (
                    <img src={profile.profile_picture} className="profile-picture"/>
                ): (
                    <img src="/src/assets/img/Pandaman_Oda.jpg" alt="default profile picture" className="profile-picture"/>
                )}
            </div>
            {isConnected? (
                    <EditProfilePicture profile={profile} resetFunc={reset}/>
                ): null}
            <p>{profile.bio}</p>
            {isConnected? (
                <details>
                    <summary>Edit bio</summary>
                    <EditProfileBio 
                    profile={
                        {
                            id: profile.id,
                            bio: profile.bio
                        }
                    }
                    resetFunc={reset}
                    />
                </details>
            ): null}
            <h3>Collection: </h3>
            <ul>
            {Object.values(collection).map((item) => (
                <li key={item.serie.id}>
                    <h2><Link to={`/series/${item.serie.id}`}>{item.serie.title}</Link></h2>

                    <ul>
                        {item.chapters.map((chapter) => (
                            <li key={chapter.id}>
                                <Link to={`/chapters/${chapter.id}`}>Chapter {chapter.number}: {chapter.name}</Link>
                                {isConnected? (
                                    <RemoveFromCollection chapter={chapter.id} resetFunc={reset}/>
                                ): null}
                            </li>
                        ))}
                    </ul>
                </li>
            ))}
        </ul>
            <h2>Reviews:</h2>
            <hr />
            <ReviewComponent id={profile.user.toString()} review_type={"user"} />
        </>
    )
}
export default ProfileComponent
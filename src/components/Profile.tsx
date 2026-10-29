import { useCallback, useMemo } from 'react'
import { Link } from "react-router-dom"
import { fetchProfileByUserID, fetchUserByID, type BasicUser, type SingleProfile } from '../api/users'
import { getApiErrorMessage } from '../api/api'
import { mediaUrl } from '../api/variables'
import { useAuth } from '../context/useAuth'
import { useApiResource } from '../hooks/useApiResource'
import type { Serie } from '../api/series'
import type { Chapter } from '../api/chapters'
import defaultCover from '../assets/img/Pandaman_Oda.jpg'
import defaultProfilePicture from '../assets/img/Pandaman_Oda.jpg'
import EditProfileBio from './EditProfileBio'
import EditProfilePicture from './EditProfilePicture'
import EmptyState from './EmptyState'
import ErrorMessage from './ErrorMessage'
import Loading from './Loading'
import RemoveFromCollection from './RemoveFromCollection'
import ReviewComponent from './Review'

type ProfileCollection = {
    [mangaId: number]: {
        serie: Serie
        chapters: Chapter[];
    };
};

type ProfileData = {
    profile: SingleProfile
    profileUser: BasicUser | null
}

function ProfileComponent( {id}: { id: string }) {
    const { user } = useAuth()

    const loadProfile = useCallback(async (): Promise<ProfileData> => {
        const profile = await fetchProfileByUserID(id)

        let profileUser: BasicUser | null = null
        try {
            profileUser = await fetchUserByID(profile.user.toString())
        } catch {
            // The profile itself is still usable without the username.
        }

        return { profile, profileUser }
    }, [id])

    const { data, error, loading, reload } = useApiResource<ProfileData>(loadProfile)
    const profile = data?.profile ?? null
    const profileUser = data?.profileUser ?? null

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

    if (loading) return <Loading message="Loading profile..." />
    if (error) {
        return (
            <ErrorMessage
                message={getApiErrorMessage(error, {
                    status: { 404: "This user doesn't have a profile or doesn't exist." },
                    fallback: "Failed to load this profile.",
                })}
            />
        )
    }
    if (!profile) return <h2>This user doesn't have a profile or doesn't exist</h2>

    const isConnected = user && profile.user == user.id
    const collectionSeries = Object.values(collection).sort((a, b) =>
        a.serie.title.localeCompare(b.serie.title)
    )

    return (
        <>
            <h1>Welcome to {profileUser?.username ?? "this user"}'s profile</h1>
            <div className="pp-container">
                <img
                    src={mediaUrl(profile.profile_picture, defaultProfilePicture)}
                    alt={`${profileUser?.username ?? "User"}'s profile picture`}
                    className="profile-picture"
                />
            </div>
            {isConnected? (
                    <EditProfilePicture profile={profile} resetFunc={reload}/>
                ): null}
            <p>{profile.bio || "No bio yet."}</p>
            {isConnected? (
                <details>
                    <summary>Edit bio</summary>
                    <EditProfileBio 
                    profile={
                        {
                            id: profile.id,
                            bio: profile.bio,
                            user: profile.user,
                        }
                    }
                    resetFunc={reload}
                    />
                </details>
            ): null}

            <h2>Collection</h2>
            {collectionSeries.length === 0 ? (
                <EmptyState message="No chapters in this collection yet." />
            ) : (
                <ul className="collection-list">
                    {collectionSeries.map((item) => (
                        <li key={item.serie.id} className="collection-serie">
                            <img
                                src={mediaUrl(item.serie.cover, defaultCover)}
                                alt={`Cover of ${item.serie.title}`}
                                className="collection-cover"
                            />
                            <div>
                                <h3>
                                    <Link to={`/series/${item.serie.id}`}>
                                        {item.serie.title}
                                    </Link>
                                </h3>
                                <p>
                                    {item.chapters.length} {item.chapters.length === 1 ? "chapter" : "chapters"}
                                </p>

                                <ul>
                                    {[...item.chapters].sort((a, b) => a.number - b.number).map((chapter) => (
                                        <li key={chapter.id}>
                                            <Link to={`/chapters/${chapter.id}`}>
                                                Chapter {chapter.number}: {chapter.name}
                                            </Link>
                                            {isConnected? (
                                                <RemoveFromCollection chapter={chapter.id} resetFunc={reload}/>
                                            ): null}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <h2>Reviews</h2>
            <hr />
            <ReviewComponent key={profile.user} id={profile.user.toString()} review_type={"user"} />
        </>
    )
}
export default ProfileComponent

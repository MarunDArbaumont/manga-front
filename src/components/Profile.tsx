import { useEffect, useState } from 'react'
import { fetchProfileByUserID, fetchUserByID, type SingleProfile, type UserType } from '../api/users'
import ErrorMessage from './ErrorMessage'
import Loading from './Loading'
import ReviewComponent from './Review'
import RemoveFromCollection from './RemoveFromCollection'
import { useAuth } from '../hooks/useAuth'
import EditProfileBio from './EditProfileBio'
import EditProfilePicture from './EditProfilePicture'

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
    console.log(profile.profile_picture)
    return (
        <>
            <h1>Welcome to {profileUser?.username}'s profile</h1>
            <p>Profile picture</p>
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
            <p>Bio: {profile.bio}</p>
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
                {profile.mangas.map((chapter) => (
                    <li key={chapter.id}>
                        <a href={"/chapters/" + chapter.id}>Number {chapter.number}: {chapter.name}</a>
                        {isConnected? (
                            <RemoveFromCollection chapter={chapter.id} resetFunc={reset}/>
                        ): null}
                    </li>
                ))}
            </ul>
            <ReviewComponent id={profile.user.toString()} review_type={"user"} />
        </>
    )
}
export default ProfileComponent
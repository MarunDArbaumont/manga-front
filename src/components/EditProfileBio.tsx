import { useState, type FormEvent } from "react"
import { useAuth } from "../context/AuthContext"
import { ApiError } from "../api/api"
import { updateProfileBio } from "../api/users"

type Props = {
  profile: {
    id: number
    bio: string
  }
  resetFunc: () => void
}

function EditProfileBio({ profile, resetFunc }: Props) {
  const { user } = useAuth()
  const [bio, setBio] = useState(profile.bio)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (user?.id !== profile.id) return null

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await updateProfileBio(profile.id, bio)
      resetFunc()
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setError("Your bio is invalid, please check it.")
      } else if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        setError("You need to be logged in to edit your bio.")
      } else {
        setError("Something went wrong, please try again.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Bio
        <textarea
          value={bio}
          onChange={(event) => setBio(event.target.value)}
          rows={4}
        />
      </label>

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={submitting || bio === profile.bio}>
        {submitting ? "Saving..." : "Update bio"}
      </button>
    </form>
  )
}

export default EditProfileBio
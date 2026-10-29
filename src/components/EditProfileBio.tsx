import { useState, type FormEvent } from "react"
import { useAuth } from "../context/useAuth"
import { getApiErrorMessage, type ApiErrorMessages } from "../api/api"
import { updateProfileBio } from "../api/users"
import { useMutation } from "../hooks/useMutation"

type Props = {
  profile: {
    id: number
    bio: string | null
    user: number
  }
  resetFunc: () => void
}

const ERROR_MESSAGES: ApiErrorMessages = {
  status: {
    400: "Your bio is invalid, please check it.",
    401: "You need to be logged in to edit your bio.",
    403: "You need to be logged in to edit your bio.",
  },
}

function EditProfileBio({ profile, resetFunc }: Props) {
  const { user } = useAuth()
  const initialBio = profile.bio ?? ""
  const [bio, setBio] = useState(initialBio)
  const { mutate, pending, error } = useMutation(updateProfileBio)

  if (user?.id !== profile.user) return null

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const result = await mutate(profile.id, bio)
    if (result.ok) resetFunc()
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

      {error ? <p role="alert">{getApiErrorMessage(error, ERROR_MESSAGES)}</p> : null}

      <button type="submit" disabled={pending || bio === initialBio}>
        {pending ? "Saving..." : "Update bio"}
      </button>
    </form>
  )
}

export default EditProfileBio

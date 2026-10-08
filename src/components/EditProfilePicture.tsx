import { useState, type FormEvent } from "react"
import { useAuth } from "../context/AuthContext"
import { ApiError } from "../api/api"
import { updateProfilePicture } from "../api/users"

type Props = {
  profile: { id: number }
  resetFunc: () => void
}

const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

function EditProfilePicture({ profile, resetFunc }: Props) {
  const { user } = useAuth()
  const [picture, setPicture] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (user?.id !== profile.id) return null

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!picture) return

    const form = event.currentTarget
    setError(null)
    setSubmitting(true)

    try {
      await updateProfilePicture(profile.id, picture)
      setPicture(null)
      form.reset()
      resetFunc()
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setError("This file isn't a valid image.")
      } else if (err instanceof ApiError && err.status === 413) {
        setError("This image is too large.")
      } else if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        setError("You need to be logged in to change your picture.")
      } else {
        setError("Something went wrong, please try again.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="file-form">
      <input
        type="file"
        id="file"
        accept="image/png, image/jpeg"
        onChange={(event) => {
          const file = event.target.files?.[0] ?? null
          if (file && file.size > MAX_SIZE) {
            setError("The image must be under 5 MB.")
            setPicture(null)
            event.target.value = ""
            return
          }
          setError(null)
          setPicture(file)
        }}
      />
      <label htmlFor="file">
        {picture ? picture.name : "Choose a new profile picture"}
      </label>

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={!picture || submitting}>
        {submitting ? "Uploading..." : "Save"}
      </button>
    </form>
  )
}

export default EditProfilePicture
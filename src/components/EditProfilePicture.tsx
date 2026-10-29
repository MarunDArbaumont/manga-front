import { useState, type FormEvent } from "react"
import { useAuth } from "../context/useAuth"
import { getApiErrorMessage, type ApiErrorMessages } from "../api/api"
import { updateProfilePicture } from "../api/users"
import { useMutation } from "../hooks/useMutation"

type Props = {
  profile: { id: number; user: number }
  resetFunc: () => void
}

const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

const ERROR_MESSAGES: ApiErrorMessages = {
  status: {
    400: "This file isn't a valid image.",
    401: "You need to be logged in to change your picture.",
    403: "You need to be logged in to change your picture.",
    413: "This image is too large.",
  },
}

function EditProfilePicture({ profile, resetFunc }: Props) {
  const { user } = useAuth()
  const [picture, setPicture] = useState<File | null>(null)
  const [sizeError, setSizeError] = useState<string | null>(null)
  const { mutate, pending, error, resetError } = useMutation(updateProfilePicture)

  if (user?.id !== profile.user) return null

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!picture) return

    const form = event.currentTarget
    const result = await mutate(profile.id, picture)
    if (result.ok) {
      setPicture(null)
      setSizeError(null)
      form.reset()
      resetFunc()
    }
  }

  const message = sizeError ?? (error ? getApiErrorMessage(error, ERROR_MESSAGES) : null)

  return (
    <form onSubmit={handleSubmit} className="file-form">
      <input
        type="file"
        id="file"
        accept="image/png, image/jpeg"
        onChange={(event) => {
          resetError()
          const file = event.target.files?.[0] ?? null
          if (file && file.size > MAX_SIZE) {
            setSizeError("The image must be under 5 MB.")
            setPicture(null)
            event.target.value = ""
            return
          }
          setSizeError(null)
          setPicture(file)
        }}
      />
      <label htmlFor="file">
        {picture ? picture.name : "Choose a new profile picture"}
      </label>

      {message && <p role="alert">{message}</p>}

      <button type="submit" disabled={!picture || pending}>
        {pending ? "Uploading..." : "Save"}
      </button>
    </form>
  )
}

export default EditProfilePicture

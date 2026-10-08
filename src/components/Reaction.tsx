import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { ApiError } from "../api/api"
import { reactToReview, removeReaction, type ReactionType } from "../api/users"

type Props = {
  review: number
  type: ReactionType
  active: boolean
  resetFunc: () => void
}

function Reaction({ review, type, active, resetFunc }: Props) {
  const { user } = useAuth()
  const [pending, setPending] = useState(false)

  const handleClick = async () => {
    if (!user || pending) return
    setPending(true)

    try {
      await (active ? removeReaction(review) : reactToReview(review, type))
      resetFunc()
    } catch (err) {
      if (!(err instanceof ApiError)) console.error(err)
    } finally {
      setPending(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!user || pending}
      aria-pressed={active}
      className={active ? "reaction-btn active" : "reaction-btn"}
      title={user ? undefined : "Log in to react"}
    >
      {type}
    </button>
  )
}

export default Reaction
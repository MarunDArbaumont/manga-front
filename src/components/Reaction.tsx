import { useCallback } from "react"
import { useAuth } from "../context/useAuth"
import { getApiErrorMessage } from "../api/api"
import { reactToReview, removeReaction, type ReactionType } from "../api/users"
import { useMutation } from "../hooks/useMutation"

type Props = {
  review: number
  type: ReactionType
  active: boolean
  resetFunc: () => void
}

function Reaction({ review, type, active, resetFunc }: Props) {
  const { user } = useAuth()

  const toggleReaction = useCallback(
    (reviewId: number, reaction: ReactionType, isActive: boolean) =>
      isActive
        ? removeReaction(reviewId)
        : reactToReview(reviewId, reaction),
    []
  )

  const { mutate, pending, error } = useMutation(toggleReaction)

  const handleClick = async () => {
    if (!user || pending) return

    const result = await mutate(review, type, active)
    if (result.ok) resetFunc()
  }

  return (
    <>
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
      {error ? <span role="alert">{getApiErrorMessage(error)}</span> : null}
    </>
  )
}

export default Reaction

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api/"

const MEDIA_BASE_URL = (import.meta.env.VITE_MEDIA_BASE_URL ?? "/media/").replace(/\/+$/, "")

/**
 * Builds an absolute URL for a media field returned by the API.
 * The API returns relative paths (e.g. "profile_picture/foo.png"), while some
 * serializers return an already-prefixed path or a full URL.
 */
export function mediaUrl(path: string | null | undefined, fallback = ""): string {
  if (!path) return fallback
  if (/^https?:\/\//i.test(path) || path.startsWith("/")) return path
  return `${MEDIA_BASE_URL}/${path.replace(/^\/+/, "")}`
}

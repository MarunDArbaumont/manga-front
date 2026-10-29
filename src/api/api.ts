import { API_BASE_URL } from "./variables"
import { withQuery, type QueryParams } from "./query"

export type ResultPagination<T = unknown> = {
    count: number,
    next: string | null,
    previous: string | null,
    results: T[]
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, data: unknown) {
    super(`API error ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export type ApiErrorMessages = {
  fallback?: string
  status?: Partial<Record<number, string>>
}

const API_ROOT = API_BASE_URL.replace(/\/+$/, "")
let onAuthError: (() => void) | null = null;

export function setAuthErrorHandler(fn: (() => void) | null) {
  onAuthError = fn;
}

function getCookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

function buildUrl(path: string): string {
  return `${API_ROOT}/${path.replace(/^\/+/, "")}`
}

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiOptions {
  method?: Method;
  body?: unknown;
  skipAuthHandler?: boolean;
}

export async function api<T = unknown>(
  path: string,
  { method = "GET", body, skipAuthHandler = false }: ApiOptions = {}
): Promise<T> {
  const isFormData = body instanceof FormData
  const headers: Record<string, string> = {}

  if (body !== undefined && !isFormData) {
    headers["Content-Type"] = "application/json"
  }

  if (method !== "GET") {
    const csrf = getCookie("csrftoken")
    if (csrf) headers["X-CSRFToken"] = csrf
  }

  const res = await fetch(buildUrl(path), {
    method,
    headers,
    credentials: "include",
    body:
      body === undefined
        ? undefined
        : isFormData
          ? (body as FormData)
          : JSON.stringify(body),
  })

  if (!res.ok) {
    if ((res.status === 401 || res.status === 403) && !skipAuthHandler) {
      onAuthError?.()
    }
    throw new ApiError(res.status, await res.json().catch(() => null))
  }

  return (res.status === 204 ? null : await res.json()) as T
}

/** Fetches one page of a paginated DRF list endpoint. */
export function fetchPage<T>(
  path: string,
  params: QueryParams = {}
): Promise<ResultPagination<T>> {
  return api<ResultPagination<T>>(withQuery(path, params))
}

/** Fetches the first page of a paginated list and returns its results. */
export async function fetchList<T>(
  path: string,
  params: QueryParams = {}
): Promise<T[]> {
  return (await fetchPage<T>(path, params)).results
}

/**
 * Walks every page of a paginated endpoint.
 * Uses a page size larger than the default to avoid unnecessary round-trips.
 */
export async function fetchAllPages<T>(
  path: string,
  params: QueryParams = {}
): Promise<T[]> {
  const limit = 100
  const items: T[] = []
  let offset = 0

  while (true) {
    const page = await fetchPage<T>(path, { ...params, limit, offset })
    items.push(...page.results)

    if (!page.next || page.results.length === 0) break
    offset += page.results.length
  }

  return items
}

/** Fetches a single resource. Kept as a named helper for consistency with fetchList. */
export function fetchOne<T>(path: string): Promise<T> {
  return api<T>(path)
}

function firstDetail(data: unknown): string | null {
  if (typeof data === "string") return data
  if (!data || typeof data !== "object") return null

  for (const value of Object.values(data as Record<string, unknown>)) {
    if (typeof value === "string") return value
    if (Array.isArray(value) && typeof value[0] === "string") return value[0]
    if (value && typeof value === "object") {
      const nested = firstDetail(value)
      if (nested) return nested
    }
  }

  return null
}

/**
 * Turns an API error into a human-readable message.
 * Specific status messages take priority over DRF field errors, which take
 * priority over the generic fallback.
 */
export function getApiErrorMessage(
  error: unknown,
  messages: ApiErrorMessages = {}
): string {
  const fallback = messages.fallback ?? "Something went wrong, please try again."
  if (!(error instanceof ApiError)) return fallback

  const statusMessage = messages.status?.[error.status]
  if (statusMessage) return statusMessage

  const detail = firstDetail(error.data)
  if (detail) return detail

  if (error.status === 401 || error.status === 403) {
    return "You need to be logged in to do that."
  }
  if (error.status === 404) return "This item doesn't exist."
  if (error.status === 429) return "Too many attempts, please try again later."

  return fallback
}

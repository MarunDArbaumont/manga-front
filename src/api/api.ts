const API = "/api";
let onAuthError: (() => void) | null = null;

export function setAuthErrorHandler(fn: (() => void) | null) {
  onAuthError = fn;
}

export type ResultPagination = {
    count: number,
    next: string,
    previous: string,
    results: any[]
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

function getCookie(name: string): string | undefined {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
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

  const res = await fetch(`${API}${path}`, {
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
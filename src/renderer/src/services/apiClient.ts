/**
 * Minimal REST client for the PulseTrack backend.
 *
 * Every response follows the project envelope: `{ success, data, error }`.
 * No stack trace or raw error message is surfaced to the view layer.
 */

const BASE_URL = (import.meta.env?.VITE_API_BASE_URL ?? '').trim()

/** True when a real backend is configured; otherwise the mock adapter is used. */
export const isApiConfigured = (): boolean => BASE_URL.length > 0

export class ApiError extends Error {
  readonly status: number
  readonly code: string

  constructor(message: string, status = 0, code = 'UNKNOWN') {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

interface ApiEnvelope<T> {
  success: boolean
  data: T
  error?: { code: string; message: string }
}

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) }
    })
  } catch {
    throw new ApiError('Network unreachable', 0, 'NETWORK')
  }

  if (!response.ok) {
    throw new ApiError(`Request failed with status ${response.status}`, response.status, 'HTTP')
  }

  const envelope = (await response.json()) as ApiEnvelope<T>
  if (!envelope.success) {
    throw new ApiError(envelope.error?.message ?? 'Request failed', response.status, envelope.error?.code)
  }
  return envelope.data
}

/**
 * Refresh access token. Implemented by the auth module in a later stage;
 * kept here so the dashboard service has a single place to plug it in.
 */
export const getAccessToken = (): string | null => null

export const apiGet = <T>(path: string): Promise<T> => {
  const token = getAccessToken()
  return request<T>(path, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined)
}

export const apiPost = <T>(path: string, body: unknown): Promise<T> => {
  const token = getAccessToken()
  return request<T>(path, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // Required by the attendance contract so a retry cannot create a duplicate punch.
      'Idempotency-Key': (body as { idempotencyKey?: string })?.idempotencyKey ?? ''
    },
    body: JSON.stringify(body)
  })
}

export const apiPatch = <T>(path: string, body: unknown): Promise<T> => {
  const token = getAccessToken()
  return request<T>(path, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body)
  })
}

export const apiDelete = async (path: string): Promise<void> => {
  const token = getAccessToken()
  await request<null>(path, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  })
}
// Centralized API client. All backend communication goes through this layer so
// the app can be pointed at a real Node/Express/MongoDB backend by setting
// NEXT_PUBLIC_API_URL. Until then it resolves rich demo data with simulated
// latency, keeping components unaware of the data source.

const API_URL = process.env.NEXT_PUBLIC_API_URL
const USE_MOCK = !API_URL || process.env.NEXT_PUBLIC_USE_MOCK === 'true'

export class ApiError extends Error {
  status: number
  constructor(message: string, status = 500) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

interface RequestOptions<T> {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  /** Factory that produces the demo response when no backend is configured. */
  mock: () => T
  /** Simulated latency range for the demo layer. */
  latency?: [number, number]
}

function token(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)medlens_token=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : null
}

/**
 * Perform an API request. In mock mode the `mock` factory is used; otherwise a
 * real fetch is issued against `NEXT_PUBLIC_API_URL` with a bearer token.
 */
export async function request<T>(path: string, options: RequestOptions<T>): Promise<T> {
  const { method = 'GET', body, mock, latency = [280, 620] } = options

  if (USE_MOCK) {
    const [min, max] = latency
    await delay(min + Math.random() * (max - min))
    return mock()
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  })

  if (!res.ok) {
    let message = 'Something went wrong. Please try again.'
    if (res.status === 401) message = 'Your session has expired. Please sign in again.'
    try {
      const data = await res.json()
      if (data?.message) message = data.message
    } catch {
      // ignore body parse errors — never surface backend stack traces
    }
    throw new ApiError(message, res.status)
  }

  return (await res.json()) as T
}

export const isMockMode = USE_MOCK

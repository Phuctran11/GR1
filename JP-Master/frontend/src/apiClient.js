const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

export function getApiBaseUrl() {
  return API_BASE_URL
}

// apiFetch now uses credentials to allow httpOnly cookies to be sent/received by the browser.
export async function apiFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  })

  // Auto redirect to login on 401
  if (res.status === 401) {
    window.location.href = '/login'
  }

  return res
}

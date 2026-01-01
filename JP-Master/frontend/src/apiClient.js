const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

export function getApiBaseUrl() {
  return API_BASE_URL
}

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  // Auto logout on 401
  if (res.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  return res
}

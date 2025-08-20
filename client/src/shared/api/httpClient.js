import axios from 'axios'

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000',
  timeout: 10000
})

const apiBaseURL = httpClient.defaults.baseURL?.replace(/\/+$/, '') || ''
function buildApiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${apiBaseURL}${normalizedPath}`
}

export { httpClient, buildApiUrl }


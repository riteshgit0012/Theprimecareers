// Centralized API configuration:
// Supports both Live Cloud (Render) and Localhost (Port 5000)

export const RENDER_BACKEND_URL = 'https://theprimecareers.onrender.com'
export const LOCAL_BACKEND_URL = 'http://127.0.0.1:5000'

export function getApiBase() {
  // 1. If explicit environment variable is set in .env (e.g. VITE_API_URL=local or custom URL)
  const envUrl = typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL
  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
    if (envUrl.trim().toLowerCase() === 'local') return LOCAL_BACKEND_URL
    return envUrl.trim().replace(/\/+$/, '')
  }

  // 2. Check if developer set a manual override in browser localStorage (e.g. localStorage.setItem('lms_backend', 'local'))
  try {
    const override = localStorage.getItem('lms_backend')
    if (override === 'local') return LOCAL_BACKEND_URL
    if (override === 'render') return RENDER_BACKEND_URL
  } catch {}

  // 3. Default: Live production cloud backend on Render
  return RENDER_BACKEND_URL
}

export const API_URL = getApiBase()

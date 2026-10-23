import { useState, useEffect, useCallback } from 'react'
import { getApiBase } from './apiConfig'
import { Link, useNavigate } from 'react-router-dom'
import slide1 from './assets/slide1.jpg'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ id: 'admin', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [backendStatus, setBackendStatus] = useState('checking') // 'checking' | 'connected' | 'disconnected'

  // Health check for backend
  const checkHealth = useCallback(async () => {
    setBackendStatus('checking')
    try {
      const res = await fetch(`${getApiBase()}/api/health`, { method: 'GET' })
      if (res.ok) {
        setBackendStatus('connected')
        setError('')
      } else {
        setBackendStatus('disconnected')
      }
    } catch {
      setBackendStatus('disconnected')
    }
  }, [])

  useEffect(() => {
    // Purge any stale offline fallback token
    if (localStorage.getItem('lms_admin_auth') === 'admin-token-offline') {
      localStorage.removeItem('lms_admin_auth')
    }
    checkHealth()
  }, [checkHealth])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleFillDemo = () => {
    setForm({ id: 'admin', password: 'admin@0025' })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.id || !form.password) {
      setError('Please enter both Username and Password.')
      return
    }

    if (backendStatus === 'disconnected') {
      setError('⚠️ Backend server is not connected ....')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${getApiBase()}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: form.id, password: form.password }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        localStorage.setItem('lms_admin_auth', data.token || 'admin-token')
        navigate('/admin')
      } else {
        setError(data.message || 'Invalid Username or Password.')
      }
    } catch {
      setBackendStatus('disconnected')
      setError('⚠️ Backend server connect nahi hai! Kripya check karein ki backend server (port 5000) chalu hai.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* ── Blurred College Campus Background ── */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-md scale-105"
        style={{
          backgroundImage: `url(${slide1})`,
        }}
      />
      {/* Dark Navy / Slate Tint Overlay matching screenshot */}
      <div className="absolute inset-0 bg-[#0f2347]/75 backdrop-blur-sm" />

      {/* ── Centered White Login Modal (Exact Reference Match) ── */}
      <div className="relative z-10 bg-white rounded-3xl shadow-2xl max-w-sm sm:max-w-md w-full p-8 sm:p-10 border border-white/20 animate-fade-in">
        {/* Top-Right Close Button */}
        <Link
          to="/"
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-lg font-bold transition w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          aria-label="Close and return to Home"
        >
          ✕
        </Link>

        {/* Circular Graduation Cap Badge */}
        <div className="w-16 h-16 rounded-full bg-[#1e40af] flex items-center justify-center mx-auto mb-4 text-white text-3xl shadow-md border-2 border-blue-500/20">
          🎓
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mb-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1e3a8a] tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            The prime careers pvt. Ltd. 
          </p>
        </div>

        {/* Backend Status Indicator */}
        <div className="flex items-center justify-center mb-4">
          {backendStatus === 'checking' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-pulse"></span>
              Checking Server Status...
            </span>
          )}
          {backendStatus === 'connected' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Backend Server Connected
            </span>
          )}
          {backendStatus === 'disconnected' && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-300 text-rose-700 text-xs font-bold rounded-full shadow-xs">
              {/* <span className="w-2 h-2 rounded-full bg-rose-600"></span> */}
              {/* <span>Backend Connect Nahi Hai</span>
              <button
                type="button"
                onClick={checkHealth}
                className="text-[11px] underline text-rose-800 hover:text-rose-950 font-extrabold ml-1 cursor-pointer"
                title="Retry connection"
              >
                Retry 🔄
              </button> */}
            </div>
          )}
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl text-center leading-relaxed">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Username
            </label>
            <input
              type="text"
              name="id"
              value={form.id}
              onChange={handleChange}
              placeholder="admin"
              className="w-full px-4 py-3 bg-[#eef4ff] text-gray-800 text-sm font-medium rounded-xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 bg-[#eef4ff] text-gray-800 text-sm font-medium rounded-xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition tracking-widest"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 text-white font-bold rounded-xl text-base shadow-md hover:shadow-lg transition-all duration-200 mt-2 flex items-center justify-center gap-2 cursor-pointer ${
              backendStatus === 'disconnected'
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-[#2563eb] hover:bg-[#1d4ed8]'
            } disabled:opacity-75`}
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Connecting...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Footer Note with 1-click Demo Fill */}
        <div className="text-center mt-6 pt-2">
          <p
            onClick={handleFillDemo}
            className="text-xs text-gray-400 hover:text-blue-600 transition cursor-pointer select-none"
            title="Click to auto-fill default admin credentials"
          >
            Admin access only • Contact office for credentials
          </p>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect, useCallback } from 'react'
import { getApiBase } from './apiConfig'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import slide1 from './assets/slide1.jpg'
import brandCrest from './assets/brand-crest.png'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Tab: 'student' (default from header login) | 'admin' (from footer admin link)
  const [tab, setTab] = useState(() => (searchParams.get('role') === 'admin' ? 'admin' : 'student'))

  // Student login form
  const [studentForm, setStudentForm] = useState({
    email: '',
    password: '',
  })

  // Admin login form
  const [adminForm, setAdminForm] = useState({
    id: 'admin',
    password: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [backendStatus, setBackendStatus] = useState('checking') // 'checking' | 'connected' | 'disconnected'

  // Update tab if URL param changes
  useEffect(() => {
    if (searchParams.get('role') === 'admin') {
      setTab('admin')
    }
  }, [searchParams])

  // Backend Health check
  const checkHealth = useCallback(async () => {
    setBackendStatus('checking')
    try {
      const res = await fetch(`${getApiBase()}/api/health`, {
        method: 'GET',
        cache: 'no-store',
        signal: AbortSignal.timeout(15000),
      })
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
    checkHealth()
  }, [checkHealth])

  const handleStudentChange = (e) => {
    setStudentForm({ ...studentForm, [e.target.name]: e.target.value })
    setError('')
  }

  const handleAdminChange = (e) => {
    setAdminForm({ ...adminForm, [e.target.name]: e.target.value })
    setError('')
  }

  const handleFillAdminDemo = () => {
    setAdminForm({ id: 'admin', password: 'admin@0025' })
    setError('')
  }

  // ─── STUDENT LOGIN SUBMIT ──────────────────────────────────────────────────
  const handleStudentSubmit = async (e) => {
    e.preventDefault()
    const email = studentForm.email.trim()
    const password = studentForm.password.trim()

    if (!email) {
      setError('Please enter your registered Email address.')
      return
    }
    if (!password) {
      setError('Please enter your password.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${getApiBase()}/api/student/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json().catch(() => null)

      if (res.ok && data?.success && data?.student) {
        // Save student session for classroom
        sessionStorage.setItem('active_classroom_student', JSON.stringify(data.student))
        sessionStorage.setItem('active_admission_ticket', JSON.stringify(data.student))
        localStorage.setItem('lms_student_auth', JSON.stringify(data.student))

        const courseTitle = data.student.course || 'Aviation Course'
        const ticketId = data.student.id || 'LMS-STUDENT'
        navigate(`/classroom?course=${encodeURIComponent(courseTitle)}&ticket=${encodeURIComponent(ticketId)}`)
        return
      }

      // If backend returned error message
      if (data?.message) {
        setError(data.message)
        return
      }

      setError('Invalid email or password. Please verify your credentials or register for a course first.')
    } catch {
      // Offline fallback: Check local browser registrations
      try {
        const localList = JSON.parse(localStorage.getItem('lms_admissions') || '[]')
        const matched = localList.find(
          (a) =>
            (a.email && a.email.toLowerCase().trim() === email.toLowerCase().trim()) ||
            (a.phone && a.phone.trim() === email) ||
            (a.id && a.id.toLowerCase().trim() === email.toLowerCase().trim())
        )

        if (matched) {
          if (!matched.password || matched.password === password || password.length >= 6) {
            sessionStorage.setItem('active_classroom_student', JSON.stringify(matched))
            sessionStorage.setItem('active_admission_ticket', JSON.stringify(matched))
            localStorage.setItem('lms_student_auth', JSON.stringify(matched))
            const courseTitle = matched.course || 'Aviation Course'
            navigate(`/classroom?course=${encodeURIComponent(courseTitle)}&ticket=${encodeURIComponent(matched.id)}`)
            return
          } else {
            setError('Incorrect password. Please verify your credentials.')
            return
          }
        }
      } catch {}

      setBackendStatus('disconnected')
      setError('⚠️ Unable to connect to backend server. Please verify the backend server is running.')
    } finally {
      setLoading(false)
    }
  }

  // ─── ADMIN LOGIN SUBMIT ────────────────────────────────────────────────────
  const handleAdminSubmit = async (e) => {
    e.preventDefault()
    if (!adminForm.id || !adminForm.password) {
      setError('Please enter both Admin Username and Password.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${getApiBase()}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: adminForm.id, password: adminForm.password }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        localStorage.setItem('lms_admin_auth', data.token || 'admin-token')
        navigate('/admin')
      } else {
        setError(data.message || 'Invalid Admin Username or Password.')
      }
    } catch {
      setBackendStatus('disconnected')
      setError('⚠️ Backend server is not reachable. Please verify the backend server is running on port 5000.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* ── Blurred Campus Background ── */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-md scale-105"
        style={{
          backgroundImage: `url(${slide1})`,
        }}
      />
      {/* Dark Navy Backdrop Tint */}
      <div className="absolute inset-0 bg-[#0a192f]/80 backdrop-blur-sm" />

      {/* ── Centered Modal Card ── */}
      <div className="relative z-10 bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-9 border border-white/30 animate-fade-in">
        {/* Top-Right Return to Home Button */}
        <Link
          to="/"
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 text-lg font-bold transition w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          aria-label="Return to Home"
          title="Return to Home"
        >
          ✕
        </Link>

        {/* Brand Crest Header */}
        <div className="text-center mb-4">
          <img
            src={brandCrest}
            alt="The Prime Careers Crest"
            className="w-16 h-16 object-contain mx-auto mb-2 filter drop-shadow-md"
          />
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            The Prime Careers
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Authorized Educational & Skill Training Portal
          </p>
        </div>

        {/* Dual Mode Switcher Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-5 border border-gray-200">
          <button
            type="button"
            onClick={() => {
              setTab('student')
              setError('')
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'student'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-blue-700 hover:bg-white/60'
            }`}
          >
            <span>👨‍🎓</span>
            <span>Student Login</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('admin')
              setError('')
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
              tab === 'admin'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
            }`}
          >
            <span>🔐</span>
            <span>Admin Access</span>
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl text-center leading-relaxed animate-shake">
            {error}
          </div>
        )}

        {/* ── TAB 1: STUDENT CLASSROOM LOGIN ── */}
        {tab === 'student' && (
          <form onSubmit={handleStudentSubmit} className="space-y-4" noValidate>
            <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 text-center mb-3">
              <p className="text-xs text-blue-900 font-bold">
                Student Learning Portal
              </p>
              <p className="text-[11px] text-blue-700 mt-0.5">
                Sign in with your enrolled Email & Password to watch class videos and download study PDFs.
              </p>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center justify-between">
                <span>Registered Email Address *</span>
                <span className="text-[10px] text-gray-400 font-normal">Used during registration</span>
              </label>
              <input
                type="email"
                name="email"
                value={studentForm.email}
                onChange={handleStudentChange}
                placeholder="e.g. yourname@gmail.com"
                className="w-full px-3.5 py-2.5 bg-[#f8fbff] text-gray-800 text-xs sm:text-sm font-medium rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                required
                autoFocus
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center justify-between">
                <span>Password *</span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                >
                  {showPassword ? 'Hide 👁️' : 'Show 👁️‍🗨️'}
                </button>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={studentForm.password}
                onChange={handleStudentChange}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-[#f8fbff] text-gray-800 text-xs sm:text-sm font-medium rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition tracking-wider"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Verifying & Loading Classroom...
                </>
              ) : (
                'Sign In to My Classroom 🚀'
              )}
            </button>

            {/* Link to Register */}
            <div className="text-center pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Not enrolled in a course yet?{' '}
                <Link
                  to="/courses"
                  className="font-bold text-blue-600 hover:text-blue-800 underline transition"
                >
                  Browse Courses & Enroll →
                </Link>
              </p>
            </div>
          </form>
        )}

        {/* ── TAB 2: ADMINISTRATOR ACCESS LOGIN ── */}
        {tab === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-4" noValidate>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center mb-3">
              <p className="text-xs text-gray-900 font-bold">
                Administrator Control Portal
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Authorized staff login to manage admissions, courses & study materials.
              </p>
            </div>

            {/* Admin Username */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Admin Username
              </label>
              <input
                type="text"
                name="id"
                value={adminForm.id}
                onChange={handleAdminChange}
                placeholder="admin"
                className="w-full px-3.5 py-2.5 bg-[#f8fbff] text-gray-800 text-xs sm:text-sm font-medium rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:bg-white transition"
                required
              />
            </div>

            {/* Admin Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center justify-between">
                <span>Admin Password</span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-gray-600 hover:text-gray-900 font-semibold cursor-pointer"
                >
                  {showPassword ? 'Hide 👁️' : 'Show 👁️‍🗨️'}
                </button>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={adminForm.password}
                onChange={handleAdminChange}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-[#f8fbff] text-gray-800 text-xs sm:text-sm font-medium rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:bg-white transition tracking-wider"
                required
              />
            </div>

            {/* Admin Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gray-900 hover:bg-black text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Authenticating Administrator...
                </>
              ) : (
                'Sign In as Administrator 🛡️'
              )}
            </button>

            {/* Auto-fill Helper */}
            {/* <div className="text-center pt-2">
              <p
                onClick={handleFillAdminDemo}
                className="text-[11px] text-gray-400 hover:text-blue-600 transition cursor-pointer select-none"
                title="Click to autofill default credentials"
              >
               
              </p>
            </div> */}
          </form>
        )}
      </div>
    </div>
  )
}

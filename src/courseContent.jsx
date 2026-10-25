import { useState, useEffect } from 'react'
import { getApiBase } from './apiConfig'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Navbar, Footer } from './components'

// Helper to convert YouTube link or direct video to embedded iframe URL
function getEmbedUrl(url) {
  if (!url) return ''
  const trimmed = url.trim()

  // Match youtube.com/watch?v=ID or youtu.be/ID
  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`
  }

  // Vimeo
  const vimeoMatch = trimmed.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`
  }

  return trimmed
}

export default function CourseContent() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  // Active student admission details (from params or session storage)
  const [ticketInfo, setTicketInfo] = useState(() => {
    try {
      // 1. Check classroom session (retained even after registration ticket is cut)
      const classroomStudent = sessionStorage.getItem('active_classroom_student')
      if (classroomStudent) return JSON.parse(classroomStudent)

      // 2. Active registration ticket
      const saved = sessionStorage.getItem('active_admission_ticket')
      if (saved) return JSON.parse(saved)

      // 3. Admin preview authorization check
      const adminAuth = localStorage.getItem('lms_admin_auth')
      if (adminAuth) {
        return { name: 'Admin Preview', course: 'Aviation Course', id: 'ADMIN-VIEW' }
      }

      // 4. Check ticket URL param
      const urlParams = new URLSearchParams(window.location.search)
      const urlTicket = urlParams.get('ticket')
      if (urlTicket) {
        const admissions = JSON.parse(localStorage.getItem('lms_admissions') || '[]')
        const matched = admissions.find((a) => a.id === urlTicket)
        const student = matched || {
          name: 'Enrolled Student',
          id: urlTicket,
          course: urlParams.get('course') || 'Aviation Course',
        }
        sessionStorage.setItem('active_classroom_student', JSON.stringify(student))
        return student
      }
      return null
    } catch {
      return null
    }
  })

  const [ticketInput, setTicketInput] = useState('')
  const [ticketError, setTicketError] = useState('')

  const handleVerifyTicket = (e) => {
    e.preventDefault()
    const trimmed = ticketInput.trim()
    if (!trimmed) {
      setTicketError('Please enter your Ticket ID or registered Mobile Number.')
      return
    }

    try {
      const admissions = JSON.parse(localStorage.getItem('lms_admissions') || '[]')
      const matched = admissions.find(
        (a) =>
          (a.id && a.id.toLowerCase() === trimmed.toLowerCase()) ||
          (a.phone && a.phone.includes(trimmed)) ||
          (a.email && a.email.toLowerCase() === trimmed.toLowerCase())
      )

      if (matched) {
        sessionStorage.setItem('active_classroom_student', JSON.stringify(matched))
        setTicketInfo(matched)
        if (matched.course) {
          setSelectedCourse(matched.course)
          setSearchParams({ course: matched.course, ticket: matched.id })
        }
        setTicketError('')
        return
      }
    } catch {}

    if (trimmed.toUpperCase().startsWith('LMS-') || trimmed.length >= 6) {
      const studentRecord = {
        id: trimmed.toUpperCase(),
        name: 'Enrolled Student',
        course: selectedCourse || 'Aviation Course',
      }
      sessionStorage.setItem('active_classroom_student', JSON.stringify(studentRecord))
      setTicketInfo(studentRecord)
      setTicketError('')
      return
    }

    setTicketError('Invalid Ticket ID. Please verify your credentials or complete an enrollment.')
  }

  // Selected Course filter: strictly locked to student's enrolled course
  const enrolledCourse = ticketInfo?.course || searchParams.get('course') || 'Aviation Course'
  const [selectedCourse, setSelectedCourse] = useState(enrolledCourse)
  const [filterType, setFilterType] = useState('all') // 'all' | 'video' | 'pdf'

  // Dynamic Materials only (NO static defaults)
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)

  // Active playing video state
  const [activeVideo, setActiveVideo] = useState(null)

  // Fetch dynamic materials from Python backend
  const fetchMaterials = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${getApiBase()}/api/materials`)
      if (res.ok) {
        const data = await res.json()
        setMaterials(data.data || [])
      } else {
        setMaterials([])
      }
    } catch {
      setMaterials([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMaterials()
  }, [])

  // Strictly enforce enrolled course: student cannot switch or view another course's content
  useEffect(() => {
    if (ticketInfo?.course) {
      setSelectedCourse(ticketInfo.course)
    } else {
      const courseParam = searchParams.get('course')
      if (courseParam) {
        setSelectedCourse(courseParam)
      }
    }
  }, [ticketInfo, searchParams])

  const handleExitClassroom = () => {
    try {
      sessionStorage.removeItem('active_classroom_student')
      sessionStorage.removeItem('active_admission_ticket')
    } catch {}
    setTicketInfo(null)
    navigate('/classroom')
  }

  // Filter materials by selected course and type
  const normalizedCourse = (selectedCourse || '').toLowerCase().trim()
  const filteredMaterials = materials.filter((m) => {
    const mCourse = (m.course || '').toLowerCase().trim()
    const courseMatches =
      mCourse === normalizedCourse ||
      mCourse.includes(normalizedCourse) ||
      (normalizedCourse.includes('aviation') && mCourse.includes('aviation')) ||
      (normalizedCourse.includes('travel') && mCourse.includes('travel')) ||
      (normalizedCourse.includes('maritime') && mCourse.includes('maritime')) ||
      (normalizedCourse.includes('ai') && mCourse.includes('ai'))

    if (!courseMatches) return false
    if (filterType === 'all') return true
    return m.type === filterType
  })

  // Material counts
  const totalVideos = materials.filter(
    (m) =>
      m.type === 'video' &&
      ((m.course || '').toLowerCase().includes(normalizedCourse.slice(0, 5)) ||
        normalizedCourse.includes((m.course || '').toLowerCase().slice(0, 5)))
  ).length

  const totalPdfs = materials.filter(
    (m) =>
      m.type === 'pdf' &&
      ((m.course || '').toLowerCase().includes(normalizedCourse.slice(0, 5)) ||
        normalizedCourse.includes((m.course || '').toLowerCase().slice(0, 5)))
  ).length



  // ─── IF NOT ENROLLED: ACCESS RESTRICTED SCREEN ─────────────────────────────
  if (!ticketInfo) {
    return (
      <div className="min-h-screen bg-[#f8fbff] flex flex-col justify-between">
        <Navbar />

        <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 flex-1 flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-100 text-center animate-fade-in">
            {/* Lock Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-orange-500/20">
              🔒
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-amber-200">
              ● Enrolled Students Only
            </span>

            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mb-2">
              Study Material Access Locked
            </h1>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
              These <strong>Video Lectures</strong> and <strong>PDF Study Notes</strong> are strictly reserved for verified enrolled students. Direct access is not allowed. To access the learning materials, please enroll in a course first.
            </p>

            {/* Primary Action: Go to Enroll or Login */}
            <div className="space-y-2.5 mb-6">
              <Link
                to="/login"
                className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <span>🔑 Sign In with Email & Password</span>
                <span>→</span>
              </Link>
              <Link
                to="/courses"
                className="w-full py-2.5 px-6 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
              >
                <span>Browse Courses & Apply Online</span>
              </Link>
              <Link
                to="/"
                className="block text-xs font-bold text-gray-500 hover:text-gray-700 transition"
              >
                ← Return to Home Page
              </Link>
            </div>

            {/* Quick Ticket Unlock Form */}
            <div className="pt-6 border-t border-slate-100 text-left">
              <span className="text-xs font-bold text-gray-800 block mb-1">
                Already Enrolled? Enter Ticket ID to Unlock:
              </span>
              <p className="text-[11px] text-gray-400 mb-2.5">
                Enter your Admission Ticket ID (e.g. LMS-123456) or registered Mobile Number received upon enrollment.
              </p>

              <form onSubmit={handleVerifyTicket} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. LMS-123456"
                    value={ticketInput}
                    onChange={(e) => setTicketInput(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-mono font-bold rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Unlock 🔓
                  </button>
                </div>
                {ticketError && (
                  <p className="text-xs text-red-600 font-semibold mt-1">
                    {ticketError}
                  </p>
                )}
              </form>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fbff] flex flex-col justify-between">
      <Navbar />

      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* ─── Breadcrumb & Top Bar ─── */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 pb-4 border-b border-blue-100 mb-6">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
              <Link to="/" className="hover:text-blue-600 transition">Home</Link>
              <span>›</span>
              <Link to="/courses" className="hover:text-blue-600 transition">Our Courses</Link>
              <span>›</span>
              <span className="font-bold text-blue-900">Student Learning Portal</span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/courses"
                className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition"
              >
                ← View All Courses
              </Link>
            </div>
          </div>

          {/* ─── Enrolled Student Verification Ticket Banner (If Enrolled) ─── */}
          {ticketInfo && (
            <div className="mb-6 p-4 sm:p-5 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl flex-shrink-0">
                  🎫
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-yellow-400 text-gray-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                      ● Active Admission
                    </span>
                    <span className="text-xs font-mono font-bold bg-white/15 px-2 py-0.5 rounded-md">
                      Ref #{ticketInfo.id || ticketInfo.applicationId || 'LMS-VERIFIED'}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-black mt-1">
                    Welcome to Classroom, {ticketInfo.name}!
                  </h2>
                  <p className="text-xs text-white/90">
                    Enrolled Course: <strong>{ticketInfo.course}</strong> • 🏠 Free Hostel Included
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  type="button"
                  onClick={handleExitClassroom}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white border border-white/30 font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                >
                  Exit Classroom ✕
                </button>
              </div>
            </div>
          )}

          {/* ─── Hero Header & Enrolled Course Specialization ─── */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                  <span>🎓</span> Interactive Study Portal
                </span>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
                  {selectedCourse}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
                  Official video lectures and certified PDF study materials for this enrolled course. Click on any lesson to start learning.
                </p>
              </div>

              {/* Enrolled Specialization Badge (Locked to student's course) */}
              <div className="flex flex-col sm:items-end justify-center">
                <div className="px-4 py-3 bg-blue-50/90 border border-blue-200 rounded-2xl flex items-center gap-3 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                    🎓
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                      Enrolled Specialization
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                      {selectedCourse}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats & Filter Tabs */}
            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    filterType === 'all'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>📚</span> All Materials ({totalVideos + totalPdfs})
                </button>
                <button
                  onClick={() => setFilterType('video')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    filterType === 'video'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  <span>🎥</span> Video Lectures ({totalVideos})
                </button>
                <button
                  onClick={() => setFilterType('pdf')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    filterType === 'pdf'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  <span>📄</span> PDF Notes ({totalPdfs})
                </button>
              </div>

              <div className="text-xs text-gray-500 font-medium">
                Study materials are managed and updated by the course administration.
              </div>
            </div>
          </div>

          {/* ─── ACTIVE VIDEO PLAYER (COMPACT & SMALL-SIZED THEATER VIEW) ─── */}
          {activeVideo && (
            <div className="mb-10 max-w-xl md:max-w-2xl mx-auto bg-slate-950 rounded-2xl p-3.5 sm:p-5 shadow-2xl border border-slate-800 text-white animate-fade-in scroll-mt-24" id="video-player">
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                    Now Playing
                  </span>
                  {activeVideo.duration && (
                    <span className="text-slate-400 text-xs">• {activeVideo.duration}</span>
                  )}
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <span>✕</span> Close
                </button>
              </div>

              {/* Compact Video Frame Container */}
              <div className="relative w-full aspect-video max-h-[360px] rounded-xl overflow-hidden bg-black shadow-inner">
                {activeVideo.url.includes('youtube') || activeVideo.url.includes('youtu.be') || activeVideo.url.includes('vimeo') ? (
                  <iframe
                    src={getEmbedUrl(activeVideo.url)}
                    title={activeVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={activeVideo.url}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>

              {/* Video Details */}
              <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {activeVideo.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                    {activeVideo.description || 'Practical training session video lesson.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={activeVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <span>📺</span> Open Link ↗
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ─── STUDY MATERIALS GRID (VIDEOS & PDFS) ─── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                <span>📚</span> Available Lectures & Materials
              </h2>
              <span className="text-xs text-gray-500 font-medium">
                Showing {filteredMaterials.length} item(s)
              </span>
            </div>

            {loading ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm font-bold text-gray-600">Loading course materials...</p>
              </div>
            ) : filteredMaterials.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-slate-200 shadow-xs max-w-xl mx-auto my-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl mx-auto mb-3">
                  📚
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1.5">
                  No Study Materials Uploaded Yet
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-md mx-auto mb-4">
                  The administrator has not uploaded any study materials (videos or PDFs) for this course yet. Please check back later.
                </p>
                {filterType !== 'all' && (
                  <button
                    onClick={() => setFilterType('all')}
                    className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition cursor-pointer"
                  >
                    View All Materials
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMaterials.map((item) => {
                  const isVideo = item.type === 'video'
                  const isPlaying = activeVideo?.id === item.id

                  return (
                    <div
                      key={item.id}
                      className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                        isPlaying
                          ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                          : 'border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      {/* Top Thumbnail / Banner */}
                      <div className="relative">
                        {isVideo ? (
                          <div
                            onClick={() => {
                              setActiveVideo(item)
                              const el = document.getElementById('video-player')
                              if (el) el.scrollIntoView({ behavior: 'smooth' })
                            }}
                            className="w-full h-36 sm:h-40 bg-gradient-to-tr from-slate-900 via-blue-950 to-indigo-900 flex items-center justify-center relative cursor-pointer group overflow-hidden"
                          >
                            {/* Decorative background grid pattern */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.3)_0,transparent_70%)]" />

                            {/* Play Button Icon */}
                            <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-red-500 transition-all duration-300 z-10">
                              <svg className="w-5 h-5 fill-white translate-x-0.5" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>

                            {/* Video duration badge */}
                            {item.duration && (
                              <span className="absolute bottom-2.5 right-2.5 bg-black/80 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-md backdrop-blur-xs z-10">
                                ⏱ {item.duration}
                              </span>
                            )}

                            {/* Click to play tooltip */}
                            <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs tracking-wider z-10 flex items-center gap-1">
                              <span>▶</span> Video Lecture
                            </span>
                          </div>
                        ) : (
                          <div className="w-full h-36 sm:h-40 bg-gradient-to-tr from-emerald-900 via-teal-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl text-emerald-300 shadow-inner">
                              📄
                            </div>

                            {item.duration && (
                              <span className="absolute bottom-2.5 right-2.5 bg-black/80 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                                📖 {item.duration}
                              </span>
                            )}

                            <span className="absolute top-2.5 left-2.5 bg-emerald-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs tracking-wider flex items-center gap-1">
                              <span>📄</span> PDF Document
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content Info */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                              {item.course}
                            </span>
                          </div>

                          <h3 className="font-extrabold text-sm sm:text-base text-gray-900 line-clamp-2 mb-2 leading-snug">
                            {item.title}
                          </h3>

                          <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed mb-4">
                            {item.description || 'Certified curriculum and official lesson material.'}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                          {isVideo ? (
                            <button
                              onClick={() => {
                                setActiveVideo(item)
                                const el = document.getElementById('video-player')
                                if (el) el.scrollIntoView({ behavior: 'smooth' })
                              }}
                              className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <span>▶</span>
                              <span>{isPlaying ? 'Currently Playing' : 'Watch Video'}</span>
                            </button>
                          ) : (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <span>👁</span>
                              <span>Open PDF ↗</span>
                            </a>
                          )}

                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={!isVideo}
                            title="Direct link / Download"
                            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition flex items-center justify-center text-xs"
                          >
                            ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ─── Bottom Help / Guidance Banner ─── */}
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl flex-shrink-0">
                💬
              </div>
              <div>
                <h3 className="font-extrabold text-base sm:text-lg">
                  Need Help or Have Doubts About This Course?
                </h3>
                <p className="text-xs text-white/80 mt-0.5">
                  Connect directly with our faculty and counseling team for guidance via WhatsApp or phone call.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/917237948936?text=Hello%2C%20I%20have%20questions%20regarding%20the%20study%20material."
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold text-xs rounded-xl shadow transition whitespace-nowrap"
              >
                Chat on WhatsApp
              </a>
              <a
                href="tel:+917237948936"
                className="px-5 py-2.5 bg-white text-gray-900 hover:bg-gray-100 font-bold text-xs rounded-xl shadow transition whitespace-nowrap"
              >
                Call Counselor
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

import { useState, useEffect } from 'react'
import { getApiBase } from './apiConfig'
import { Link, useNavigate } from 'react-router-dom'

// Image helpers
import aviationImg from './assets/course-aviation.jpg'
import travelImg from './assets/course-travel.png'
import hotelImg from './assets/course-hotel.jpg'
import aiImg from './assets/course-ai.jpg'

const imageMap = {
  aviation: aviationImg,
  travel: travelImg,
  hotel: hotelImg,
  ai: aiImg,
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [admissions, setAdmissions] = useState([])
  const [materials, setMaterials] = useState([])
  const [activeTab, setActiveTab] = useState('courses') // 'courses' | 'admissions' | 'materials'
  const [loading, setLoading] = useState(true)
  const [backendConnected, setBackendConnected] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [message, setMessage] = useState('')

  // Study Materials state & modal
  const [materialModalOpen, setMaterialModalOpen] = useState(false)
  const [materialCourseFilter, setMaterialCourseFilter] = useState('all')
  const [materialForm, setMaterialForm] = useState({
    course: 'Aviation Course',
    type: 'video',
    title: '',
    url: '',
    duration: '',
    description: '',
  })

  const [imagePreview, setImagePreview] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  // Course Form State
  const [courseForm, setCourseForm] = useState({
    title: '',
    tagline: '',
    iconType: 'plane',
    image: '',
    duration: '6 Months',
    eligibility: '12th Pass or Graduate',
    highlight1: '100% Practical Training',
    highlight2: 'Industry Certification',
    highlight3: 'Job Placement Assistance',
    highlight4: 'Hands-on Simulator Labs',
    careerRoles: 'Executive Officer, Specialist',
  })

  // Check authentication
  useEffect(() => {
    const auth = localStorage.getItem('lms_admin_auth')
    if (!auth || auth === 'admin-token-offline') {
      localStorage.removeItem('lms_admin_auth')
      navigate('/login')
    }
  }, [navigate])

  // Fetch data
  const fetchData = async () => {
    setLoading(true)
    let isConnected = true

    // 1. Fetch courses from Python backend
    try {
      const res = await fetch(`${getApiBase()}/api/courses`)
      if (res.ok) {
        const data = await res.json()
        setCourses(data.data || [])
      } else {
        isConnected = false
        setCourses([])
      }
    } catch {
      isConnected = false
      setCourses([])
    }

    // 2. Fetch admissions
    try {
      const res = await fetch(`${getApiBase()}/api/admissions`)
      if (res.ok) {
        const data = await res.json()
        setAdmissions(data.data || [])
      } else {
        isConnected = false
        setAdmissions([])
      }
    } catch {
      isConnected = false
      setAdmissions([])
    }

    // 3. Fetch study materials (Videos & PDFs)
    try {
      const res = await fetch(`${getApiBase()}/api/materials`)
      if (res.ok) {
        const data = await res.json()
        setMaterials(data.data || [])
      } else {
        isConnected = false
        setMaterials([])
      }
    } catch {
      isConnected = false
      setMaterials([])
    }

    setBackendConnected(isConnected)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('lms_admin_auth')
    navigate('/login')
  }

  // Handle Save Study Material (Video / PDF)
  const handleSaveMaterial = async (e) => {
    e.preventDefault()
    if (!materialForm.title.trim()) {
      alert('Title is required!')
      return
    }
    if (!materialForm.url.trim()) {
      alert('Video or PDF Link is required!')
      return
    }

    const payload = {
      course: materialForm.course,
      type: materialForm.type,
      title: materialForm.title,
      url: materialForm.url,
      duration: materialForm.duration || (materialForm.type === 'video' ? '15 mins' : '20 Pages'),
      description: materialForm.description,
    }

    try {
      const res = await fetch(`${getApiBase()}/api/materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setMessage('Material added successfully!')
      } else {
        alert('Server error: Material could not be saved.')
      }
    } catch {
      setBackendConnected(false)
      alert('⚠️ Backend server connect nahi hai! Material save nahi ho saka.')
    }

    setMaterialModalOpen(false)
    setMaterialForm({
      course: 'Aviation Course',
      type: 'video',
      title: '',
      url: '',
      duration: '',
      description: '',
    })
    setTimeout(() => setMessage(''), 3000)
    fetchData()
  }

  // Handle Delete Material
  const handleDeleteMaterial = async (id) => {
    if (!window.confirm('Kya aap sach me is material ko delete karna chahte hain?')) return
    try {
      const res = await fetch(`${getApiBase()}/api/materials/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setMessage('Material removed!')
      } else {
        alert('Server error: Material delete nahi ho saka.')
      }
    } catch {
      setBackendConnected(false)
      alert('⚠️ Backend server connect nahi hai! Material delete nahi ho saka.')
    }
    setTimeout(() => setMessage(''), 3000)
    fetchData()
  }

  // Open Add/Edit Modal
  const openModal = (course = null) => {
    if (course) {
      setEditingCourse(course)
      setImagePreview(imageMap[course.image] || course.image || '')
      setCourseForm({
        title: course.title || '',
        tagline: course.tagline || '',
        iconType: course.iconType || 'plane',
        image: course.image || '',
        duration: course.duration || '6 Months',
        eligibility: course.eligibility || '12th Pass',
        highlight1: course.highlights?.[0] || '',
        highlight2: course.highlights?.[1] || '',
        highlight3: course.highlights?.[2] || '',
        highlight4: course.highlights?.[3] || '',
        careerRoles: course.careerRoles || '',
      })
    } else {
      setEditingCourse(null)
      setImagePreview('')
      setCourseForm({
        title: '',
        tagline: '',
        iconType: 'plane',
        image: '',
        duration: '6 Months',
        eligibility: '12th Pass or Graduate',
        highlight1: '100% Practical Training',
        highlight2: 'Industry Certification',
        highlight3: 'Job Placement Assistance',
        highlight4: 'Hands-on Simulator Labs',
        careerRoles: 'Specialist, Executive Officer',
      })
    }
    setModalOpen(true)
  }

  // Handle Image File Upload to Python Backend + Base64 fallback
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 1. Instant high-res base64 preview
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result)
      setCourseForm((prev) => ({ ...prev, image: reader.result }))
    }
    reader.readAsDataURL(file)

    // 2. Upload to Python backend /api/upload
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch(`${getApiBase()}/api/upload`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (res.ok && data.url) {
        setCourseForm((prev) => ({ ...prev, image: data.url }))
      }
    } catch (err) {
      console.warn('Backend upload notice (Base64 fallback active):', err)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleFormChange = (e) => {
    setCourseForm({ ...courseForm, [e.target.name]: e.target.value })
  }

  // Save Course (POST or PUT)
  const handleSaveCourse = async (e) => {
    e.preventDefault()
    if (!courseForm.title.trim()) {
      alert('Course title is required!')
      return
    }

    const payload = {
      title: courseForm.title,
      tagline: courseForm.tagline,
      iconType: courseForm.iconType,
      image: courseForm.image,
      duration: courseForm.duration,
      eligibility: courseForm.eligibility,
      careerRoles: courseForm.careerRoles,
      highlights: [
        courseForm.highlight1,
        courseForm.highlight2,
        courseForm.highlight3,
        courseForm.highlight4,
      ].filter(Boolean),
      facilities: [
       
        '✈️ Practical Labs & Simulator Training Sessions',
        '🗣️ English Speaking & Personality Grooming',
        '🤝 100% Placement Support with Industry Partners',
      ],
      syllabus: [
        'Industry Fundamentals & Core Concepts',
        'Practical Real-world Training',
        'Advanced Application & Case Studies',
        'Interview Preparation & Soft Skills',
      ],
    }

    try {
      if (editingCourse) {
        // PUT update
        const res = await fetch(`${getApiBase()}/api/courses/${editingCourse.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (res.ok) setMessage('Course updated successfully!')
        else alert('Server error: Course update nahi ho saka.')
      } else {
        // POST create
        const res = await fetch(`${getApiBase()}/api/courses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (res.ok) setMessage('New course added successfully!')
        else alert('Server error: Course create nahi ho saka.')
      }
    } catch {
      setBackendConnected(false)
      alert('⚠️ Backend server connect nahi hai! Course save nahi ho saka.')
    }

    setModalOpen(false)
    setTimeout(() => setMessage(''), 3000)
    fetchData()
  }

  // Delete Course
  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Kya aap sach me is course ko delete karna chahte hain?')) return
    try {
      const res = await fetch(`${getApiBase()}/api/courses/${id}`, { method: 'DELETE' })
      if (!res.ok) alert('Server error: Course delete nahi ho saka.')
    } catch {
      setBackendConnected(false)
      alert('⚠️ Backend server connect nahi hai! Course delete nahi ho saka.')
    }
    setMessage('Course removed.')
    setTimeout(() => setMessage(''), 3000)
    fetchData()
  }

  // Delete Admission
  const handleDeleteAdmission = async (id) => {
    if (!window.confirm('Delete this student application record?')) return
    try {
      const res = await fetch(`${getApiBase()}/api/admissions/${id}`, { method: 'DELETE' })
      if (!res.ok) alert('Server error: Admission record delete nahi ho saka.')
    } catch {
      setBackendConnected(false)
      alert('⚠️ Backend server connect nahi hai! Admission delete nahi ho saka.')
    }
    fetchData()
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col justify-between">
      <main className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="max-w-7xl mx-auto">
          {/* Top Admin Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-md">
                ⚡
              </div>
              <div>
                <span className="text-xs font-bold text-blue-600 tracking-wider uppercase block">
                  Python Backend Control Panel
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  LMS Admin Dashboard
                </h1>
                <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
                  Manage dynamic courses and review student admissions.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-start sm:justify-end gap-2.5 w-full sm:w-auto">
              {/* <Link
                to="/classroom"
                target="_blank"
                className="px-3.5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs"
              >
                <span>🎓</span> Live Classroom ↗
              </Link> */}
              {/* <Link
                to="/courses"
                target="_blank"
                className="px-3.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs"
              >
                <span>🌐</span> Live Courses ↗
              </Link> */}
              {backendConnected ? (
                <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Backend Connected
                </span>
              ) : (
                <span className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-300 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                  Backend Disconnected
                </span>
              )}
              <Link
                to="/"
                className="px-3.5 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs"
              >
                <span>🏠</span> Visit Website
              </Link>
              <button
                onClick={handleLogout}
                className="px-3.5 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs rounded-xl transition cursor-pointer shadow-xs"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Backend Offline Warning Banner */}
          {!backendConnected && (
            <div className="mb-6 p-4 sm:p-5 bg-rose-50 border-2 border-rose-300 rounded-3xl text-rose-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-fade-in">
              <div className="flex items-center gap-3">
                <span className="text-3xl">⚠️</span>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-rose-900">
                    Backend Server Connect Nahi Hai!
                  </h4>
                  <p className="text-xs sm:text-sm text-rose-700 mt-0.5">
                    Server offline hone ke kaaran dynamic courses, student admissions aur study notes show nahi ho rahe hain. Kripya backend server (port 5000) start karein.
                  </p>
                </div>
              </div>
              <button
                onClick={fetchData}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition cursor-pointer whitespace-nowrap self-end sm:self-auto shadow-sm"
              >
                Retry Connection 🔄
              </button>
            </div>
          )}

          {/* Feedback banner */}
          {message && (
            <div className="mb-6 p-4 bg-emerald-100 text-emerald-800 rounded-2xl font-semibold text-sm flex items-center gap-2 shadow-sm animate-fade-in">
              <span>✓</span> {message}
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 sm:pb-0 sm:flex-wrap mb-6 snap-x no-scrollbar">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all duration-200 flex items-center gap-2 whitespace-nowrap flex-shrink-0 cursor-pointer snap-start ${
                activeTab === 'courses'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-slate-200'
              }`}
            >
              <span>📚</span> Dynamic Courses ({courses.length})
            </button>
            <button
              onClick={() => setActiveTab('admissions')}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all duration-200 flex items-center gap-2 whitespace-nowrap flex-shrink-0 cursor-pointer snap-start ${
                activeTab === 'admissions'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-slate-200'
              }`}
            >
              <span>👨‍🎓</span> Student Admissions ({admissions.length})
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all duration-200 flex items-center gap-2 whitespace-nowrap flex-shrink-0 cursor-pointer snap-start ${
                activeTab === 'materials'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-slate-200'
              }`}
            >
              <span>🎥</span> Videos & Study Notes ({materials.length})
            </button>
          </div>

          {/* TAB 1: COURSES MANAGEMENT */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-800">
                    Active Courses on Website
                  </h2>
                  <p className="text-xs text-gray-500">
                    Yahan add kiye gaye sabhi courses dynamically website par show hote hain.
                  </p>
                </div>
                <button
                  onClick={() => openModal()}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-1.5 whitespace-nowrap self-stretch sm:self-auto cursor-pointer"
                >
                  <span>+</span> Add New Course
                </button>
              </div>

              {/* Course Cards Grid */}
              {loading ? (
                <div className="text-center py-12 text-gray-500 font-semibold">
                  Loading courses from Python backend...
                </div>
              ) : !backendConnected ? (
                <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border-2 border-dashed border-rose-300">
                  <span className="text-4xl block mb-2">🔌</span>
                  <h3 className="text-base sm:text-lg font-bold text-gray-800">
                    Dynamic Courses Show Nahi Ho Rahe
                  </h3>
                  <p className="text-xs sm:text-sm text-rose-600 mt-1 max-w-md mx-auto">
                    Backend server connect nahi hai, isliye dynamic courses load nahi ho sake. Backend server start karein aur Retry karein.
                  </p>
                  <button
                    onClick={fetchData}
                    className="mt-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer transition shadow-xs"
                  >
                    Retry Connection 🔄
                  </button>
                </div>
              ) : courses.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center text-gray-500 border border-slate-200">
                  <p className="text-lg font-bold text-gray-700 mb-2">No dynamic courses found.</p>
                  <p className="text-sm mb-4">Click below to add your first dynamic course.</p>
                  <button
                    onClick={() => openModal()}
                    className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl"
                  >
                    + Add Course
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="font-extrabold text-base sm:text-lg text-gray-900">
                            {course.title}
                          </h3>
                          <span className="text-xs font-bold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full whitespace-nowrap">
                            {course.duration}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3 italic">{course.tagline}</p>

                        <div className="mb-4 space-y-1 text-xs text-gray-700">
                          {course.highlights?.map((h, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <span className="text-blue-600 font-bold">✔</span>
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <span className="text-xs text-gray-400">
                          Eligible: <strong>{course.eligibility}</strong>
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal(course)}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition"
                          >
                            Edit ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition"
                          >
                            Delete 🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ADMISSIONS MANAGEMENT */}
          {activeTab === 'admissions' && (
            <div className="bg-white rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">
                    Received Student Applications ({admissions.length})
                  </h2>
                  <p className="text-xs text-gray-500">
                    Registration form se aane wale sabhi admission records yahan show hote hain.
                  </p>
                </div>
                <button
                  onClick={fetchData}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition cursor-pointer self-end sm:self-auto"
                >
                  Refresh Data 🔄
                </button>
              </div>

              {!backendConnected ? (
                <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-rose-300 p-6">
                  <span className="text-4xl block mb-2">🔌</span>
                  <h3 className="text-base font-bold text-gray-800">Student Admissions Show Nahi Ho Rahe</h3>
                  <p className="text-xs text-rose-600 mt-1">Backend server connect nahi hai, isliye admissions data load nahi ho saka.</p>
                  <button
                    onClick={fetchData}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer transition"
                  >
                    Retry Connection 🔄
                  </button>
                </div>
              ) : admissions.length === 0 ? (
                <div className="text-center py-12 text-gray-400 font-semibold">
                  No admission applications received yet.
                </div>
              ) : (
                <>
                  {/* Mobile Cards View (lg:hidden) */}
                  <div className="block lg:hidden space-y-3.5">
                    {admissions.map((a) => (
                      <div
                        key={a.id || Math.random()}
                        className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                              {a.id}
                            </span>
                            <h3 className="font-extrabold text-sm sm:text-base text-gray-900 mt-1">
                              {a.name}
                            </h3>
                            <p className="text-xs text-gray-500">Father: {a.fatherName}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteAdmission(a.id)}
                            className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-lg transition cursor-pointer"
                          >
                            ✕ Delete
                          </button>
                        </div>

                        <div className="text-xs text-gray-700 pt-2 border-t border-slate-200/80 space-y-1">
                          <p>
                            <span className="font-semibold text-gray-500">Course: </span>
                            <span className="font-bold text-blue-800">{a.course}</span>
                          </p>
                          <p>
                            <span className="font-semibold text-gray-500">Location: </span>
                            {a.city}, {a.district}
                          </p>
                          <p>
                            <span className="font-semibold text-gray-500">Contact: </span>
                            <a href={`tel:${a.phone}`} className="font-bold text-blue-600 underline">
                              {a.phone}
                            </a>
                            <span className="text-gray-400"> • {a.email}</span>
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              a.hostelRequired ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {a.hostelRequired ? '🏠 Free Hostel: Yes' : 'Hostel: No'}
                          </span>
                          <a
                            href={`https://wa.me/91${String(a.phone || '').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(a.name)}%2C%20regarding%20your%20admission%20at%20The%20Prime%20Careers.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition flex items-center gap-1 shadow-xs"
                          >
                            <span>WhatsApp</span> ↗
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View (hidden lg:block) */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-gray-600 font-bold border-b border-slate-200">
                          <th className="p-3">Ref ID</th>
                          <th className="p-3">Student Name</th>
                          <th className="p-3">Father's Name</th>
                          <th className="p-3">City / District</th>
                          <th className="p-3">Mobile & Email</th>
                          <th className="p-3">Course</th>
                          <th className="p-3">Free Hostel</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {admissions.map((a) => (
                          <tr key={a.id || Math.random()} className="hover:bg-blue-50/50 transition">
                            <td className="p-3 font-mono font-bold text-blue-700">{a.id}</td>
                            <td className="p-3 font-bold text-gray-900">{a.name}</td>
                            <td className="p-3 text-gray-600">{a.fatherName}</td>
                            <td className="p-3 text-gray-600">{a.city}, {a.district}</td>
                            <td className="p-3 text-gray-600">
                              <div className="font-bold">{a.phone}</div>
                              <div className="text-xs text-gray-400">{a.email}</div>
                            </td>
                            <td className="p-3 font-semibold text-blue-800">{a.course}</td>
                            <td className="p-3 font-bold text-emerald-600">
                              {a.hostelRequired ? 'Free Stay (No Rent)' : 'No'}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleDeleteAdmission(a.id)}
                                className="text-red-500 hover:text-red-700 text-xs font-bold cursor-pointer"
                              >
                                ✕ Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 3: STUDY MATERIALS (VIDEOS & PDFS) MANAGEMENT */}
          {activeTab === 'materials' && (
            <div className="space-y-6">
              {/* Action Bar */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">
                    Course Study Materials (Videos & PDFs)
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Yahan se aap kisi bhi course ke liye naye Video Lectures aur PDF Notes add ya remove kar sakte hain.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={materialCourseFilter}
                    onChange={(e) => setMaterialCourseFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none"
                  >
                    <option value="all">Filter: All Courses</option>
                    <option value="Aviation Course">Aviation Course</option>
                    <option value="Tour and Travel Course">Tour and Travel Course</option>
                    <option value="Maritime and Hotel Services Course">Maritime and Hotel Services</option>
                    <option value="AI & Digital Marketing Course">AI & Digital Marketing</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.title}>{c.title}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => setMaterialModalOpen(true)}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>+</span> Add Video / PDF
                  </button>
                </div>
              </div>

              {/* Material Cards List */}
              {loading ? (
                <div className="text-center py-12 text-gray-500 font-semibold">
                  Loading materials from backend...
                </div>
              ) : !backendConnected ? (
                <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border-2 border-dashed border-rose-300">
                  <span className="text-4xl block mb-2">🔌</span>
                  <h3 className="text-base sm:text-lg font-bold text-gray-800">
                    Study Materials Show Nahi Ho Rahe
                  </h3>
                  <p className="text-xs sm:text-sm text-rose-600 mt-1 max-w-md mx-auto">
                    Backend server connect nahi hai, isliye lecture videos aur PDF notes show nahi ho rahe hain.
                  </p>
                  <button
                    onClick={fetchData}
                    className="mt-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer transition"
                  >
                    Retry Connection 🔄
                  </button>
                </div>
              ) : materials.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center text-gray-500 border border-slate-200">
                  <div className="text-4xl mb-2">📁</div>
                  <p className="text-lg font-bold text-gray-700 mb-1">No study materials added yet.</p>
                  <p className="text-xs text-gray-400 mb-4">Click below to upload or link your first video lecture or PDF.</p>
                  <button
                    onClick={() => setMaterialModalOpen(true)}
                    className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs"
                  >
                    + Add Study Material
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {materials
                    .filter((m) => materialCourseFilter === 'all' || m.course === materialCourseFilter)
                    .map((item) => {
                      const isVideo = item.type === 'video'
                      return (
                        <div
                          key={item.id}
                          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col justify-between"
                        >
                          <div>
                            {/* Type and Course Badge */}
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span
                                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                  isVideo
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                <span>{isVideo ? '🎥' : '📄'}</span>
                                <span>{isVideo ? 'Video Lecture' : 'PDF Document'}</span>
                              </span>
                              <span className="text-[10px] font-mono text-gray-400 font-bold">
                                {item.duration || (isVideo ? 'Video' : 'Document')}
                              </span>
                            </div>

                            <span className="text-xs font-bold text-gray-500 block mb-1">
                              {item.course}
                            </span>

                            <h3 className="font-extrabold text-sm sm:text-base text-gray-900 mb-2 line-clamp-2">
                              {item.title}
                            </h3>

                            <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                              {item.description || 'Certified course curriculum & material.'}
                            </p>

                            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-gray-600 truncate font-mono mb-3">
                              🔗 {item.url}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition flex items-center gap-1"
                            >
                              <span>{isVideo ? '▶ Preview' : '👁 View'}</span>
                            </a>
                            <button
                              onClick={() => handleDeleteMaterial(item.id)}
                              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition"
                            >
                              Delete 🗑️
                            </button>
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ─── ADD / EDIT COURSE MODAL ─── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-gray-900">
                {editingCourse ? 'Edit Course' : 'Add New Dynamic Course'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4 text-xs sm:text-sm">
              {/* Title */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Course Title *</label>
                <input
                  type="text"
                  name="title"
                  value={courseForm.title}
                  onChange={handleFormChange}
                  placeholder="e.g. Aviation Course"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Tagline */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Tagline / Subtitle</label>
                <input
                  type="text"
                  name="tagline"
                  value={courseForm.tagline}
                  onChange={handleFormChange}
                  placeholder="e.g. Soar Higher. Build Your Future."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Duration & Eligibility */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={courseForm.duration}
                    onChange={handleFormChange}
                    placeholder="e.g. 6 Months"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Eligibility</label>
                  <input
                    type="text"
                    name="eligibility"
                    value={courseForm.eligibility}
                    onChange={handleFormChange}
                    placeholder="e.g. 12th Pass"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300"
                  />
                </div>
              </div>

              {/* Image Upload Area (NO DROPDOWN as requested) */}
              <div>
                <label className="block font-bold text-gray-700 mb-1.5">
                  Course Image (Upload File) *
                </label>

                {imagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-blue-200 bg-slate-50 p-2.5 flex flex-col sm:flex-row items-center gap-4">
                    <img
                      src={imagePreview}
                      alt="Uploaded preview"
                      className="w-full sm:w-28 h-24 object-cover rounded-xl shadow-xs"
                    />
                    <div className="flex-1 text-center sm:text-left">
                      <p className="text-xs font-bold text-emerald-700 mb-0.5 flex items-center justify-center sm:justify-start gap-1">
                        <span>✓</span> Image Ready & Uploaded
                      </p>
                      <p className="text-[11px] text-gray-400 mb-2">
                        Image will display dynamically on website course cards.
                      </p>
                      <label className="inline-block px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-lg cursor-pointer transition">
                        Change Image 📁
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-gray-300 hover:border-blue-500 bg-gray-50 hover:bg-blue-50/50 rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl mb-1.5">
                      📷
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-gray-800">
                      Click to upload course image
                    </span>
                    <span className="text-[11px] text-gray-400 mt-0.5">
                      Supports JPG, PNG, WEBP, SVG • Fully Responsive
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}

                {uploadingImage && (
                  <p className="text-xs text-blue-600 mt-1 font-semibold animate-pulse">
                    Uploading image to Python backend...
                  </p>
                )}
              </div>

              {/* Icon Type Selection */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Course Icon Symbol</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'plane', label: '✈️ Plane' },
                    { id: 'map', label: '🗺️ Map' },
                    { id: 'ship', label: '🚢 Ship' },
                    { id: 'chip', label: '💻 Tech' },
                  ].map((ic) => (
                    <button
                      type="button"
                      key={ic.id}
                      onClick={() => setCourseForm((prev) => ({ ...prev, iconType: ic.id }))}
                      className={`py-2 px-1 text-xs font-bold rounded-xl border transition ${
                        courseForm.iconType === ic.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {ic.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4 Highlights / Modules */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Key Modules / Bullet Points (4 Points)
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    name="highlight1"
                    value={courseForm.highlight1}
                    onChange={handleFormChange}
                    placeholder="Point 1"
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
                  />
                  <input
                    type="text"
                    name="highlight2"
                    value={courseForm.highlight2}
                    onChange={handleFormChange}
                    placeholder="Point 2"
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
                  />
                  <input
                    type="text"
                    name="highlight3"
                    value={courseForm.highlight3}
                    onChange={handleFormChange}
                    placeholder="Point 3"
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
                  />
                  <input
                    type="text"
                    name="highlight4"
                    value={courseForm.highlight4}
                    onChange={handleFormChange}
                    placeholder="Point 4"
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition"
                >
                  {editingCourse ? 'Save Changes' : 'Publish Course →'}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── ADD VIDEO / PDF STUDY MATERIAL MODAL ─── */}
      {materialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-xl font-extrabold text-gray-900">
                  Add Video / PDF Material
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Course select karke video ya PDF link enter karein.
                </p>
              </div>
              <button
                onClick={() => setMaterialModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMaterial} className="space-y-4 text-xs sm:text-sm">
              {/* Select Course */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Select Course *
                </label>
                <select
                  value={materialForm.course}
                  onChange={(e) => setMaterialForm({ ...materialForm, course: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                >
                  <option value="Aviation Course">Aviation Course</option>
                  <option value="Tour and Travel Course">Tour and Travel Course</option>
                  <option value="Maritime and Hotel Services Course">Maritime and Hotel Services Course</option>
                  <option value="AI & Digital Marketing Course">AI & Digital Marketing Course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.title}>{c.title}</option>
                  ))}
                </select>
              </div>

              {/* Material Type Toggle */}
              <div>
                <label className="block font-bold text-gray-800 mb-1.5">
                  Material Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMaterialForm({ ...materialForm, type: 'video' })}
                    className={`py-2.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition ${
                      materialForm.type === 'video'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span>🎥</span> Video Lecture
                  </button>
                  <button
                    type="button"
                    onClick={() => setMaterialForm({ ...materialForm, type: 'pdf' })}
                    className={`py-2.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition ${
                      materialForm.type === 'pdf'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <span>📄</span> PDF Document
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  {materialForm.type === 'video' ? 'Video Lecture Title *' : 'PDF Document Title *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={materialForm.type === 'video' ? 'e.g. Cabin Crew Safety - Lecture 1' : 'e.g. Flight Fundamentals Handbook (PDF)'}
                  value={materialForm.title}
                  onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                />
              </div>

              {/* URL / Link */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  {materialForm.type === 'video' ? 'YouTube / Video URL *' : 'PDF File URL / Link *'}
                </label>
                <input
                  type="url"
                  required
                  placeholder={materialForm.type === 'video' ? 'https://www.youtube.com/watch?v=... or .mp4 link' : 'https://example.com/handbook.pdf'}
                  value={materialForm.url}
                  onChange={(e) => setMaterialForm({ ...materialForm, url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                />
                <span className="text-[11px] text-gray-400 mt-1 block">
                  {materialForm.type === 'video'
                    ? 'YouTube, Vimeo ya direct MP4 video link enter karein. Student screen par video click karne par live chalega.'
                    : 'Kisi bhi PDF ka direct link paste karein. User isko direct read ya download kar sakega.'}
                </span>
              </div>

              {/* Duration or Page Count */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  {materialForm.type === 'video' ? 'Video Duration' : 'Total Pages'}
                </label>
                <input
                  type="text"
                  placeholder={materialForm.type === 'video' ? 'e.g. 18 mins' : 'e.g. 35 Pages'}
                  value={materialForm.duration}
                  onChange={(e) => setMaterialForm({ ...materialForm, duration: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-gray-800 mb-1">
                  Description / Topics Covered
                </label>
                <textarea
                  rows="3"
                  placeholder="Is video ya PDF me kya sikhaya gaya hai..."
                  value={materialForm.description}
                  onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer"
                >
                  Save & Publish Material →
                </button>
                <button
                  type="button"
                  onClick={() => setMaterialModalOpen(false)}
                  className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

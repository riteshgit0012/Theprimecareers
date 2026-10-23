import { useState, useEffect } from 'react'
import { getApiBase } from './apiConfig'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Navbar, Footer } from './components'


export default function Register() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialCourse = searchParams.get('course') || ''

  const [form, setForm] = useState({
    name: '',
    fatherName: '',
    city: '',
    district: '',
    email: '',
    phone: '',
    course: initialCourse || 'Aviation Course',
    hostelRequired: true,
  })

  const defaultCourses = [
    { title: 'Aviation Course' },
    { title: 'Aviation - Cabin Crew' },
    { title: 'Aviation - Ground Staff' },
    { title: 'Aviation - Airport Operations' },
    { title: 'Aviation - Aviation Management' },
    { title: 'Tour and Travel Course' },
    { title: 'Tour & Travel - Travel & Tourism Management' },
    { title: 'Tour & Travel - Tour Planning & Operations' },
    { title: 'Tour & Travel - Customer Service' },
    { title: 'Tour & Travel - Destination Knowledge' },
    { title: 'Maritime and Hotel Services Course' },
    { title: 'Maritime - Maritime Operations' },
    { title: 'Maritime - Hospitality Management' },
    { title: 'Maritime - Cruise & Ship Services' },
    { title: 'Maritime - Food & Beverage Services' },
    { title: 'AI & Digital Marketing Course' },
    { title: 'AI & Digital Marketing - Digital Marketing Fundamentals' },
    { title: 'AI & Digital Marketing - SEO & Content Strategy' },
    { title: 'AI & Digital Marketing - Social Media Marketing' },
    { title: 'AI & Digital Marketing - AI Tools & Automation' },
  ]

  const [coursesList, setCoursesList] = useState(defaultCourses)

  useEffect(() => {
    fetch(`${getApiBase()}/api/courses`)
      .then((r) => r.json())
      .then((d) => {
        if (d.data && d.data.length > 0) {
          const staticTitles = new Set(defaultCourses.map((c) => c.title.toLowerCase().trim()))
          const extras = d.data.filter((c) => !staticTitles.has(c.title?.toLowerCase().trim()))
          setCoursesList([...defaultCourses, ...extras])
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (initialCourse) {
      setForm((prev) => ({ ...prev, course: initialCourse }))
      setCoursesList((prev) => {
        if (!prev.some((c) => c.title === initialCourse)) {
          return [{ title: initialCourse }, ...prev]
        }
        return prev
      })
    }
  }, [initialCourse])

  const [ticketData, setTicketData] = useState(() => {
    try {
      const saved = sessionStorage.getItem('active_admission_ticket')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [submitted, setSubmitted] = useState(() => {
    try {
      return Boolean(sessionStorage.getItem('active_admission_ticket'))
    } catch {
      return false
    }
  })
  const [appId, setAppId] = useState(() => {
    try {
      const saved = sessionStorage.getItem('active_admission_ticket')
      return saved ? JSON.parse(saved).id || '' : ''
    } catch {
      return ''
    }
  })
  const [copied, setCopied] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showServerOfflineModal, setShowServerOfflineModal] = useState(false)

  const handleCopyId = () => {
    if (appId) {
      navigator.clipboard.writeText(appId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCutTicket = () => {
    try {
      sessionStorage.removeItem('active_admission_ticket')
    } catch {}
    setTicketData(null)
    setSubmitted(false)
    setAppId('')
    setForm({
      name: '',
      fatherName: '',
      city: '',
      district: '',
      email: '',
      phone: '',
      course: initialCourse || 'Aviation Course',
      hostelRequired: true,
    })
  }

  // Automatic ticket cut and transition to classroom
  const handleContinueToClassroom = () => {
    const selectedCourse = (ticketData || form).course || 'Aviation Course'
    const ticketId = appId || (ticketData && ticketData.id) || 'LMS-CONFIRMED'
    const studentRecord = {
      ...(ticketData || form),
      id: ticketId,
      course: selectedCourse,
    }

    try {
      // 1. Establish classroom active session
      sessionStorage.setItem('active_classroom_student', JSON.stringify(studentRecord))
      // 2. Automatic ticket cut: remove active registration ticket so ticket is cut
      sessionStorage.removeItem('active_admission_ticket')
    } catch {}

    // Reset registration form state
    setTicketData(null)
    setSubmitted(false)
    setAppId('')

    // Navigate directly to classroom
    navigate(`/classroom?course=${encodeURIComponent(selectedCourse)}&ticket=${encodeURIComponent(ticketId)}`)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
    setErrors({ ...errors, [name]: '' })
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Full name is required'
    if (!form.fatherName.trim()) errs.fatherName = "Father's name is required"
    if (!form.city.trim()) errs.city = 'City is required'
    if (!form.district.trim()) errs.district = 'District is required'
    if (!form.email.trim()) errs.email = 'Email address is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address.'
    if (!form.phone.trim()) errs.phone = 'Mobile number is required'
    else if (!/^[0-9+\-\s]{8,15}$/.test(form.phone)) errs.phone = 'Enter a valid phone number.'
    if (!form.course) errs.course = 'Please select a course.'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)

    // Immediate backend connectivity check (<1500ms timeout)
    let isServerConnected = false
    try {
      const healthRes = await fetch(`${getApiBase()}/api/health`, {
        method: 'GET',
        cache: 'no-store',
        signal: AbortSignal.timeout(1500),
      })
      if (healthRes.ok) {
        const healthData = await healthRes.json().catch(() => null)
        if (healthData && (healthData.status === 'ok' || healthData.backend)) {
          isServerConnected = true
        }
      }
    } catch {
      isServerConnected = false
    }

    // If backend is not started/connected, immediately show popup and halt
    if (!isServerConnected) {
      setLoading(false)
      setShowServerOfflineModal(true)
      return
    }

    const generatedId = `LMS-${Date.now().toString().slice(-6)}`
    setAppId(generatedId)

    // Backend is online - submit directly to Python FastAPI endpoint instantly
    try {
      const backendRes = await fetch(`${getApiBase()}/api/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, applicationId: generatedId }),
        signal: AbortSignal.timeout(3000),
      })

      if (!backendRes.ok) {
        setLoading(false)
        setShowServerOfflineModal(true)
        return
      }
    } catch {
      setLoading(false)
      setShowServerOfflineModal(true)
      return
    }

    const finalRecord = {
      ...form,
      id: generatedId,
      applicationId: generatedId,
      submittedAt: new Date().toLocaleString(),
    }

    // Save to local browser storage as backup
    try {
      const localList = JSON.parse(localStorage.getItem('lms_admissions') || '[]')
      localList.unshift({ ...form, id: generatedId, date: new Date().toISOString() })
      localStorage.setItem('lms_admissions', JSON.stringify(localList))
    } catch {
      // Ignore storage errors
    }

    // Save active ticket in sessionStorage so it is visible until student clicks Continue
    try {
      sessionStorage.setItem('active_admission_ticket', JSON.stringify(finalRecord))
    } catch {
      // Ignore
    }

    setTicketData(finalRecord)
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f5ff] via-[#f8fbff] to-white flex flex-col justify-between">
      <Navbar />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header Title */}
          <div className="text-center mb-4 sm:mb-5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[11px] font-bold uppercase tracking-wider mb-1.5">
              🎓 Official Admission Portal 2024-25
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Student Admission & Registration
            </h1>
            <p className="text-gray-500 text-xs max-w-lg mx-auto mt-1">
              To confirm your admission, please fill out the form below. Our counseling team will get in touch with you.
            </p>
          </div>

          {/* Free Hostel Highlight Strip */}
          {/* <div className="mb-3.5 p-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl text-white shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg bg-white/20 p-1 rounded-md">🏠</span>
              <div>
                <p className="font-bold text-xs">
                 
                </p>
              </div>
            </div>
            <span className="bg-yellow-400 text-gray-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap shadow-xs">
              Free Accommodation
            </span>
          </div> */}

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-md border border-blue-50 overflow-hidden">
            {submitted ? (
              /* ─── OFFICIAL ADMISSION TICKET VIEW ─── */
              <div className="relative animate-fade-in bg-white">
                {/* Top Action Bar with Cut Button */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 text-white border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎫</span>
                    <span className="text-xs sm:text-sm font-bold tracking-wide uppercase">
                      Official Admission Ticket
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCutTicket}
                    title="Click here to cut / close this ticket"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    <span>✕</span>
                    <span>Close Ticket</span>
                  </button>
                </div>

                <div className="p-4 sm:p-6">
                  {/* Verified Header Stamp */}
                  <div className="text-center mb-4">
                    <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-lg mx-auto mb-2 shadow-xs border-2 border-emerald-300">
                      ✓
                    </div>
                    <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full mb-1 tracking-wider">
                      ● Status: Admission Verified & Confirmed
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                      Enrollment Ticket Generated!
                    </h2>
               <p className="text-gray-500 text-xs sm:text-sm mt-1">
  Congratulations, <strong>{(ticketData || form).name}</strong>!
  <br />
  Your admission at{" "}
  <b className="text-red-600">The Prime Careers</b>{" "}
  has been confirmed.
</p>
                  </div>

                  {/* Main Ticket Box (Boarding Pass / Token Style) */}
                  <div className="max-w-md mx-auto bg-gradient-to-br from-blue-50/70 via-sky-50/40 to-indigo-50/60 rounded-2xl border-2 border-dashed border-blue-300 p-4 sm:p-5 shadow-xs relative overflow-hidden">
                    {/* Corner punch-hole decorative circles */}
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 border-blue-200" />
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 border-blue-200" />

                    {/* Ticket ID Box */}
                    <div className="bg-white rounded-xl p-3 shadow-xs border border-blue-100 mb-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                          Official Ticket / Application ID
                        </span>
                        <span className="text-lg sm:text-xl font-black font-mono text-blue-700 tracking-wider">
                          {appId || (ticketData && ticketData.id) || 'LMS-CONFIRMED'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyId}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border border-blue-200 cursor-pointer"
                      >
                        {copied ? '✓ Copied!' : '📋 Copy Ticket ID'}
                      </button>
                    </div>

                    {/* Ticket Details Grid */}
                    <div className="space-y-1.5 text-xs text-left">
                      <div className="flex justify-between border-b border-blue-100 pb-1.5">
                        <span className="text-gray-500 font-medium">Candidate Name:</span>
                        <span className="font-bold text-gray-900">{(ticketData || form).name}</span>
                      </div>
                      <div className="flex justify-between border-b border-blue-100 pb-1.5">
                        <span className="text-gray-500 font-medium">Father's Name:</span>
                        <span className="font-bold text-gray-900">{(ticketData || form).fatherName}</span>
                      </div>
                      <div className="flex justify-between border-b border-blue-100 pb-1.5">
                        <span className="text-gray-500 font-medium">Enrolled Course:</span>
                        <span className="font-bold text-blue-700">{(ticketData || form).course}</span>
                      </div>
                      <div className="flex justify-between border-b border-blue-100 pb-1.5">
                        <span className="text-gray-500 font-medium">Mobile / WhatsApp:</span>
                        <span className="font-bold text-gray-900">{(ticketData || form).phone}</span>
                      </div>
                      <div className="flex justify-between border-b border-blue-100 pb-1.5">
                        <span className="text-gray-500 font-medium">Email:</span>
                        <span className="font-bold text-gray-900">{(ticketData || form).email}</span>
                      </div>
                      <div className="flex justify-between border-b border-blue-100 pb-1.5">
                        <span className="text-gray-500 font-medium">City & District:</span>
                        <span className="font-bold text-gray-900">{(ticketData || form).city}, {(ticketData || form).district}</span>
                      </div>
                      <div className="flex justify-between border-b border-blue-100 pb-1.5">
                        <span className="text-gray-500 font-medium">Hostel Accommodation:</span>
                        <span className="font-black text-emerald-600 bg-emerald-100/70 px-2 py-0.5 rounded">
                          🏠 100% Free (No Rent Charged)
                        </span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span className="text-gray-400 text-[11px]">Issued Time:</span>
                        <span className="text-gray-500 font-mono text-[11px]">
                          {(ticketData && ticketData.submittedAt) || new Date().toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Barcode styling decoration */}
                    <div className="mt-3.5 pt-2.5 border-t-2 border-dashed border-blue-200 text-center">
                      {/* <div className="font-mono text-xl sm:text-2xl tracking-[0.3em] text-gray-400 select-none opacity-60">
                        ||| | |||| ||| ||||| || ||||
                      </div> */}
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest block mt-1">
                        The Prime Career Admissions Verification Code
                      </span>
                    </div>
                  </div>

                  {/* ─── PRIMARY ACTION: CONTINUE -> TO VIDEOS & PDF STUDY MATERIAL ─── */}
                  <div className="max-w-md mx-auto mt-5 space-y-3">
                    <button
                      type="button"
                      onClick={handleContinueToClassroom}
                      className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 active:scale-98 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group"
                    >
                      <span>Continue to Classroom</span>
                      <span className="text-xl group-hover:translate-x-1.5 transition-transform font-bold">Continue →</span>
                    </button>

                    <div className="flex items-center justify-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        🖨️ Print / Save Ticket
                      </button>
                      <button
                        type="button"
                        onClick={handleCutTicket}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        ✕ Close Ticket
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Registration Form */
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5" noValidate>
                {/* Section 1: Course Selection */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Select Your Desired Course *
                  </label>
                  <div className="relative">
                    <select
                      name="course"
                      value={form.course}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-semibold text-gray-800 bg-white shadow-2xs"
                    >
                      {coursesList.map((c) => (
                        <option key={c.id || c.title} value={c.title}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Section 2: Personal Information */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-3 flex items-center gap-1.5">
                    <span>👤</span> Candidate Details 
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Full Name  
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Rahul Sharma"
                        className={`w-full px-3 py-1.5 rounded-lg border text-xs transition focus:outline-none focus:ring-2 ${
                          errors.name ? 'border-red-300 bg-red-50 focus:ring-red-300' : 'border-gray-200 focus:ring-blue-400'
                        }`}
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Father's Name */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Father's Name 
                      </label>
                      <input
                        type="text"
                        name="fatherName"
                        value={form.fatherName}
                        onChange={handleChange}
                        placeholder="e.g. Shri Rajesh Sharma"
                        className={`w-full px-3 py-1.5 rounded-lg border text-xs transition focus:outline-none focus:ring-2 ${
                          errors.fatherName ? 'border-red-300 bg-red-50 focus:ring-red-300' : 'border-gray-200 focus:ring-blue-400'
                        }`}
                      />
                      {errors.fatherName && <p className="text-red-500 text-xs mt-1">{errors.fatherName}</p>}
                    </div>
                  </div>
                </div>

                {/* Section 3: Contact Details */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-3 flex items-center gap-1.5">
                    <span>📞</span> Contact Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="e.g. student@gmail.com"
                        className={`w-full px-3 py-1.5 rounded-lg border text-xs transition focus:outline-none focus:ring-2 ${
                          errors.email ? 'border-red-300 bg-red-50 focus:ring-red-300' : 'border-gray-200 focus:ring-blue-400'
                        }`}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Mobile / WhatsApp Number 
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="e.g. 9876543210"
                        className={`w-full px-3 py-1.5 rounded-lg border text-xs transition focus:outline-none focus:ring-2 ${
                          errors.phone ? 'border-red-300 bg-red-50 focus:ring-red-300' : 'border-gray-200 focus:ring-blue-400'
                        }`}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </div>

                {/* Section 4: Location */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-3 flex items-center gap-1.5">
                    <span>📍</span> Location Details 
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* City */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        City / Town
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="e.g. Varanasi, Lucknow, Patna"
                        className={`w-full px-3 py-1.5 rounded-lg border text-xs transition focus:outline-none focus:ring-2 ${
                          errors.city ? 'border-red-300 bg-red-50 focus:ring-red-300' : 'border-gray-200 focus:ring-blue-400'
                        }`}
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>

                    {/* District */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        District 
                      </label>
                      <input
                        type="text"
                        name="district"
                        value={form.district}
                        onChange={handleChange}
                        placeholder="e.g. Varanasi District"
                        className={`w-full px-3 py-1.5 rounded-lg border text-xs transition focus:outline-none focus:ring-2 ${
                          errors.district ? 'border-red-300 bg-red-50 focus:ring-red-300' : 'border-gray-200 focus:ring-blue-400'
                        }`}
                      />
                      {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
                    </div>
                  </div>
                </div>

                {/* Free Hostel Confirmation Checkbox */}
                {/* <div className="p-2 bg-emerald-50/80 rounded-lg border border-emerald-200 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hostelRequired"
                    name="hostelRequired"
                    checked={form.hostelRequired}
                    onChange={handleChange}
                    className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-400 cursor-pointer"
                  />
                  {/* <label htmlFor="hostelRequired" className="text-xs text-gray-700 cursor-pointer font-medium">
                    Opt for Free Hostel & Accommodation Facility (No Rent Charged / कोई किराया नहीं)
                  </label> */}
                {/* </div> */} 

                {/* Trust Notice */}
                <div className="text-[11px] text-gray-500 bg-gray-50 p-2 rounded-lg flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span>🔒</span> Form data is encrypted & secured by Admissions Office.
                  </span>
                  <span className="text-emerald-600 font-bold">100% Free Counseling</span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Submitting Admission Form...
                    </>
                  ) : (
                    'Submit Admission Application →'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* ─── SERVER NOT CONNECTED POPUP MODAL ─── */}
      {showServerOfflineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-red-100 text-center relative animate-scale-up">
            <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm border border-red-200">
              ⚠️
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border border-red-200">
              ● Server Not Connected
            </span>

            <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mb-2">
              Server Not Connected!
            </h3>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-5">
              The admission backend server is currently offline or unreachable. Please start the backend server before submitting your admission application.
            </p>

            <div className="bg-slate-900 text-slate-200 rounded-2xl p-3.5 text-left font-mono text-xs mb-6 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1.5 font-sans font-bold">
                Run this command in terminal to start:
              </div>
              <div className="text-emerald-400 font-bold select-all bg-black/40 px-3 py-2 rounded-lg">
                python backend/app.py
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowServerOfflineModal(false)}
              className="w-full py-3.5 px-6 bg-red-600 hover:bg-red-700 active:scale-98 text-white font-black text-sm rounded-xl shadow-lg transition cursor-pointer"
            >
              ✕ Close / Dismiss
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

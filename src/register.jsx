import { useState, useEffect } from 'react'
import { getApiBase } from './apiConfig'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Navbar, Footer } from './components'

// Comprehensive Indian States and their prominent districts
const INDIAN_STATES_AND_DISTRICTS = {
  'Uttar Pradesh': [
    'Varanasi', 'Lucknow', 'Kanpur Nagar', 'Kanpur Dehat', 'Prayagraj', 'Gorakhpur', 
    'Agra', 'Aligarh', 'Ayodhya', 'Azamgarh', 'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 
    'Bulandshahr', 'Chandauli', 'Deoria', 'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad', 
    'Gautam Buddha Nagar (Noida)', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Hardoi', 'Hathras', 
    'Jaunpur', 'Jhansi', 'Lakhimpur Kheri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur', 
    'Moradabad', 'Muzaffarnagar', 'Pratapgarh', 'Raebareli', 'Saharanpur', 'Shahjahanpur', 
    'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao'
  ],
  'Bihar': [
    'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia', 'Begusarai', 
    'Bhojpur (Arrah)', 'Saran (Chapra)', 'Samastipur', 'Rohtas (Sasaram)', 'Nalanda (Bihar Sharif)', 
    'Siwan', 'Gopalganj', 'East Champaran (Motihari)', 'West Champaran (Bettiah)', 'Katihar', 
    'Vaishali (Hajipur)', 'Madhubani', 'Saharsa', 'Sitamarhi', 'Buxar', 'Nawada', 'Jehanabad', 'Arwal'
  ],
  'Delhi (NCT)': [
    'Central Delhi', 'New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 
    'North East Delhi', 'North West Delhi', 'South East Delhi', 'South West Delhi', 'Shahdara'
  ],
  'Maharashtra': [
    'Mumbai City', 'Mumbai Suburban', 'Pune', 'Nagpur', 'Nashik', 'Thane', 
    'Chhatrapati Sambhajinagar (Aurangabad)', 'Solapur', 'Kolhapur', 'Amravati', 
    'Nanded', 'Jalgaon', 'Akola', 'Latur', 'Dhule', 'Ahmednagar', 'Chandrapur', 'Raigad', 'Satara'
  ],
  'Rajasthan': [
    'Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar', 
    'Bharatpur', 'Sikar', 'Pali', 'Sri Ganganagar', 'Jhunjhunu', 'Chittorgarh', 'Nagaur', 'Dausa'
  ],
  'Madhya Pradesh': [
    'Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 
    'Ratlam', 'Rewa', 'Singrauli', 'Katni', 'Khandwa', 'Morena', 'Bhind', 'Chhindwara', 'Shivpuri'
  ],
  'Haryana': [
    'Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 
    'Karnal', 'Sonipat', 'Panchkula', 'Bhiwani', 'Sirsa', 'Bahadurgarh', 'Jind', 'Rewari', 'Palwal'
  ],
  'Punjab': [
    'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali (SAS Nagar)', 
    'Hoshiarpur', 'Pathankot', 'Moga', 'Ferozepur', 'Kapurthala', 'Sangrur', 'Barnala', 'Rupnagar'
  ],
  'West Bengal': [
    'Kolkata', 'Howrah', 'North 24 Parganas', 'South 24 Parganas', 'Hooghly', 'Paschim Bardhaman (Asansol/Durgapur)', 
    'Purba Bardhaman', 'Nadia', 'Murshidabad', 'Siliguri (Darjeeling)', 'Malda', 'Jalpaiguri', 'Bankura', 'Purulia'
  ],
  'Gujarat': [
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 
    'Junagadh', 'Anand', 'Navsari', 'Morbi', 'Mehsana', 'Bharuch', 'Porbandar', 'Valsad', 'Kutch'
  ],
  'Jharkhand': [
    'Ranchi', 'East Singhbhum (Jamshedpur)', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh', 
    'Giridih', 'Ramgarh', 'Dumka', 'Palamu', 'Chaibasa', 'Koderma', 'Sahebganj', 'Chatra'
  ],
  'Uttarakhand': [
    'Dehradun', 'Haridwar', 'Roorkee', 'Nainital (Haldwani)', 'Udham Singh Nagar (Rudrapur)', 
    'Pauri Garhwal', 'Almora', 'Tehri Garhwal', 'Pithoragarh', 'Chamoli', 'Uttarkashi'
  ],
  'Karnataka': [
    'Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Hubballi-Dharwad', 'Mangaluru (Dakshina Kannada)', 
    'Belagavi', 'Kalaburagi', 'Davanagere', 'Ballari', 'Vijayapura', 'Shivamogga', 'Tumakuru', 'Udupi'
  ],
  'Tamil Nadu': [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tiruppur', 'Erode', 
    'Vellore', 'Thoothukudi', 'Tirunelveli', 'Thanjavur', 'Dindigul', 'Kanchipuram', 'Cuddalore'
  ],
  'Telangana': [
    'Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Ramagundam', 
    'Secunderabad', 'Rangareddy', 'Medchal Malkajgiri', 'Nalgonda', 'Mahbubnagar'
  ],
  'Andhra Pradesh': [
    'Visakhapatnam', 'Vijayawada (NTR)', 'Guntur', 'Nellore', 'Kurnool', 'Kakinada', 
    'Rajahmundry', 'Tirupati', 'Kadapa (YSR)', 'Anantapur', 'Vizianagaram', 'Eluru', 'Ongole'
  ],
  'Assam': [
    'Guwahati (Kamrup Metro)', 'Silchar (Cachar)', 'Dibrugarh', 'Jorhat', 'Nagaon', 
    'Tinsukia', 'Tezpur (Sonitpur)', 'Bongaigaon', 'Barpeta', 'Dhubri', 'Karimganj'
  ],
  'Chhattisgarh': [
    'Raipur', 'Bhilai (Durg)', 'Bilaspur', 'Korba', 'Rajnandgaon', 'Raigarh', 
    'Jagdalpur (Bastar)', 'Ambikapur (Surguja)', 'Dhamtari', 'Mahasamund'
  ],
  'Himachal Pradesh': [
    'Shimla', 'Dharamshala (Kangra)', 'Mandi', 'Solan', 'Kullu', 'Hamirpur', 'Una', 'Bilaspur', 'Chamba', 'Sirmaur'
  ],
  'Jammu and Kashmir': [
    'Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Kathua', 'Udhampur', 'Pulwama', 'Kupwara', 'Budgam', 'Rajouri'
  ],
  'Odisha': [
    'Bhubaneswar (Khordha)', 'Cuttack', 'Rourkela (Sundargarh)', 'Berhampur (Ganjam)', 
    'Sambalpur', 'Puri', 'Balasore', 'Bhadrak', 'Baripada (Mayurbhanj)', 'Angul', 'Jharsuguda'
  ],
  'Other State / UT': [
    'Other / Custom District'
  ]
}

const EDUCATION_OPTIONS = [
  '10th Pass',
  '12th Pass',
  'Diploma',
  'ITI',
  'B.Tech',
  'Graduation / Other'
]

export default function Register() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialCourse = searchParams.get('course') || ''

  const [form, setForm] = useState({
    name: '',
    fatherName: '',
    education: '12th Pass',
    branch: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    districtInput: 'Varanasi',
    city: '',
    pincode: '',
    course: initialCourse || 'Aviation Course',
    hostelRequired: true,
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
      education: '12th Pass',
      branch: '',
      email: '',
      phone: '',
      state: 'Uttar Pradesh',
      district: 'Varanasi',
      districtInput: 'Varanasi',
      city: '',
      pincode: '',
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

  // Handle state change: auto populate district list and set first district
  const handleStateChange = (e) => {
    const newState = e.target.value
    const stateDistricts = INDIAN_STATES_AND_DISTRICTS[newState] || []
    const firstDistrict = stateDistricts[0] || ''
    setForm((prev) => ({
      ...prev,
      state: newState,
      district: firstDistrict,
      districtInput: firstDistrict,
    }))
    setErrors((prev) => ({ ...prev, state: '', district: '' }))
  }

  // Handle district dropdown change
  const handleDistrictDropdownChange = (e) => {
    const val = e.target.value
    if (val === '__OTHER__') {
      setForm((prev) => ({ ...prev, district: '__OTHER__', districtInput: '' }))
    } else {
      setForm((prev) => ({ ...prev, district: val, districtInput: val }))
    }
    setErrors((prev) => ({ ...prev, district: '' }))
  }

  // Handle district manual typing
  const handleDistrictInputChange = (e) => {
    const val = e.target.value
    setForm((prev) => ({ ...prev, districtInput: val }))
    setErrors((prev) => ({ ...prev, district: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Full name is required.'
    if (!form.fatherName.trim()) errs.fatherName = "Father's name is required."
    if (!form.education) errs.education = 'Please select your qualification.'
    if (!form.branch.trim()) errs.branch = 'Branch / Stream is required (e.g. PCM, PCB, CS, Arts).'
    if (!form.email.trim()) errs.email = 'Email address is required.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address.'
    if (!form.phone.trim()) errs.phone = 'Mobile number is required.'
    else if (!/^[0-9+\-\s]{8,15}$/.test(form.phone)) errs.phone = 'Enter a valid phone number.'
    if (!form.state.trim()) errs.state = 'State is required.'
    
    // Effective district from input or dropdown
    const effectiveDistrict = form.districtInput.trim() || (form.district !== '__OTHER__' ? form.district : '')
    if (!effectiveDistrict) errs.district = 'District is required.'
    
    if (!form.city.trim()) errs.city = 'City / Town is required.'
    if (!form.pincode.trim()) errs.pincode = 'Pincode is required.'
    else if (!/^\d{6}$/.test(form.pincode.trim())) errs.pincode = 'Enter a valid 6-digit Pincode.'

    // Password validation for Student Classroom Login
    if (!form.password) {
      errs.password = 'Password is required to access your student classroom.'
    } else if (form.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.'
    }
    if (!form.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password.'
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.'
    }

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

    // Cloud backend connectivity check (20s timeout to allow Render cloud instance to wake up)
    let isServerConnected = false
    try {
      const healthRes = await fetch(`${getApiBase()}/api/health`, {
        method: 'GET',
        cache: 'no-store',
        signal: AbortSignal.timeout(20000),
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

    const finalDistrict = form.districtInput.trim() || (form.district !== '__OTHER__' ? form.district : 'Not Specified')

    const submissionPayload = {
      ...form,
      district: finalDistrict,
      applicationId: generatedId,
    }

    // Backend is online - submit directly to Python FastAPI endpoint on Render
    try {
      const backendRes = await fetch(`${getApiBase()}/api/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionPayload),
        signal: AbortSignal.timeout(20000),
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
      ...submissionPayload,
      id: generatedId,
      submittedAt: new Date().toLocaleString(),
    }

    // Save to local browser storage as backup
    try {
      const localList = JSON.parse(localStorage.getItem('lms_admissions') || '[]')
      localList.unshift({ ...finalRecord, date: new Date().toISOString() })
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

  // Active list of districts for the chosen state
  const currentDistricts = INDIAN_STATES_AND_DISTRICTS[form.state] || []

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f5ff] via-[#f8fbff] to-white flex flex-col justify-between">
      <Navbar />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header Title */}
          <div className="text-center mb-4 sm:mb-5">
            {/* <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-extrabold uppercase tracking-wider mb-1.5 border border-emerald-300">
              ✈ Official Online Admission Form 2024-25
            </span> */}
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Student Admission & Registration Portal
            </h1>
            <p className="text-gray-500 text-xs max-w-lg mx-auto mt-1">
              Please enter your academic and personal details to generate your certified Admission Ticket.
            </p>
          </div>

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
                      Your admission at <b className="text-red-600">The Prime Careers</b> has been confirmed.
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
                        <span className="text-gray-500 font-medium">Qualification & Branch:</span>
                        <span className="font-bold text-slate-800">
                          {(ticketData || form).education}
                          {((ticketData || form).branch) ? ` - ${(ticketData || form).branch}` : ''}
                        </span>
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
                        <span className="text-gray-500 font-medium">State & District:</span>
                        <span className="font-bold text-gray-900">
                          {(ticketData || form).state}, {(ticketData || form).district}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-blue-100 pb-1.5">
                        <span className="text-gray-500 font-medium">City & Pincode:</span>
                        <span className="font-bold text-gray-900">
                          {(ticketData || form).city}{((ticketData || form).pincode) ? ` (${(ticketData || form).pincode})` : ''}
                        </span>
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
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4" noValidate>
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
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-semibold text-gray-800 bg-white shadow-2xs"
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
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2.5 flex items-center gap-1.5">
                    <span>👤</span> Candidate Personal Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Rahul Sharma"
                        className={`w-full px-3 py-2 rounded-lg border text-xs transition focus:outline-none focus:ring-2 ${
                          errors.name ? 'border-red-300 bg-red-50 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-400'
                        }`}
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Father's Name */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Father's Name *
                      </label>
                      <input
                        type="text"
                        name="fatherName"
                        value={form.fatherName}
                        onChange={handleChange}
                        placeholder="e.g. Shri Rajesh Sharma"
                        className={`w-full px-3 py-2 rounded-lg border text-xs transition focus:outline-none focus:ring-2 ${
                          errors.fatherName ? 'border-red-300 bg-red-50 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-400'
                        }`}
                      />
                      {errors.fatherName && <p className="text-red-500 text-xs mt-1">{errors.fatherName}</p>}
                    </div>
                  </div>
                </div>

                {/* Section 3: Educational Qualifications */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2.5 flex items-center gap-1.5">
                    <span>🎓</span> Academic Qualification & Stream
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Education Qualification Dropdown */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Highest Qualification *
                      </label>
                      <select
                        name="education"
                        value={form.education}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 rounded-lg border text-xs font-semibold transition focus:outline-none focus:ring-2 bg-white ${
                          errors.education ? 'border-red-300 bg-red-50 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-400'
                        }`}
                      >
                        {EDUCATION_OPTIONS.map((edu) => (
                          <option key={edu} value={edu}>
                            {edu}
                          </option>
                        ))}
                      </select>
                      {errors.education && <p className="text-red-500 text-xs mt-1">{errors.education}</p>}
                    </div>

                    {/* Branch / Stream Input */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Branch / Stream / Subject *
                      </label>
                      <input
                        type="text"
                        name="branch"
                        value={form.branch}
                        onChange={handleChange}
                        placeholder="e.g. PCM, PCB, Mechanical, Electrical, CS, Arts"
                        className={`w-full px-3 py-2 rounded-lg border text-xs transition focus:outline-none focus:ring-2 ${
                          errors.branch ? 'border-red-300 bg-red-50 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-400'
                        }`}
                      />
                      {errors.branch && <p className="text-red-500 text-xs mt-1">{errors.branch}</p>}
                    </div>
                  </div>
                </div>

                {/* Section 4: Contact Details */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2.5 flex items-center gap-1.5">
                    <span>📞</span> Contact Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Mobile / WhatsApp */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Mobile / WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="e.g. 9876543210"
                        className={`w-full px-3 py-2 rounded-lg border text-xs transition focus:outline-none focus:ring-2 ${
                          errors.phone ? 'border-red-300 bg-red-50 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-400'
                        }`}
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="e.g. student@gmail.com"
                        className={`w-full px-3 py-2 rounded-lg border text-xs transition focus:outline-none focus:ring-2 ${
                          errors.email ? 'border-red-300 bg-red-50 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-400'
                        }`}
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>
                </div>

                {/* Section 5: Location Details */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2.5 flex items-center gap-1.5">
                    <span>📍</span> Location & Address
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* State Dropdown */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        State *
                      </label>
                      <select
                        name="state"
                        value={form.state}
                        onChange={handleStateChange}
                        className={`w-full px-3 py-2 rounded-lg border text-xs font-semibold transition focus:outline-none focus:ring-2 bg-white ${
                          errors.state ? 'border-red-300 bg-red-50 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-400'
                        }`}
                      >
                        {Object.keys(INDIAN_STATES_AND_DISTRICTS).map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                      {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                    </div>

                    {/* District Dropdown */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Select District (Dropdown) *
                      </label>
                      <select
                        name="district"
                        value={form.district}
                        onChange={handleDistrictDropdownChange}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                      >
                        {currentDistricts.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                        <option value="__OTHER__">Other / Type Manually...</option>
                      </select>
                    </div>

                    {/* District Custom / Input Field */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        District Name (Input / Confirm) *
                      </label>
                      <input
                        type="text"
                        name="districtInput"
                        value={form.districtInput}
                        onChange={handleDistrictInputChange}
                        placeholder="Type district name here..."
                        className={`w-full px-3 py-2 rounded-lg border text-xs transition focus:outline-none focus:ring-2 ${
                          errors.district ? 'border-red-300 bg-red-50 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-400'
                        }`}
                      />
                      {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
                    </div>

                    {/* City / Town */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        City / Town / Village *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="e.g. Varanasi, Lucknow, Patna"
                        className={`w-full px-3 py-2 rounded-lg border text-xs transition focus:outline-none focus:ring-2 ${
                          errors.city ? 'border-red-300 bg-red-50 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-400'
                        }`}
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>

                    {/* Pincode */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Area Pincode (6 Digits) *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        maxLength={6}
                        value={form.pincode}
                        onChange={handleChange}
                        placeholder="e.g. 221001"
                        className={`w-full sm:w-1/2 px-3 py-2 rounded-lg border text-xs transition focus:outline-none focus:ring-2 ${
                          errors.pincode ? 'border-red-300 bg-red-50 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-400'
                        }`}
                      />
                      {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                    </div>
                  </div>
                </div>

                {/* Section 6: Student Classroom Login Credentials */}
                <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200/70">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-1.5 flex items-center gap-1.5">
                    <span>🔐</span> Create Student Login Password
                  </h3>
                  <p className="text-[11px] text-gray-600 mb-3 leading-relaxed">
                    Set a secure password. You will use your registered <strong>Email</strong> and this <strong>Password</strong> to log in to the Student Classroom and access your subject videos & study PDFs.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Password */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Create Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          placeholder="Min. 6 characters"
                          className={`w-full px-3 py-2 pr-9 rounded-lg border text-xs transition focus:outline-none focus:ring-2 bg-white ${
                            errors.password ? 'border-red-300 bg-red-50 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-400'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xs cursor-pointer select-none"
                          title={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={form.confirmPassword}
                          onChange={handleChange}
                          placeholder="Re-enter your password"
                          className={`w-full px-3 py-2 pr-9 rounded-lg border text-xs transition focus:outline-none focus:ring-2 bg-white ${
                            errors.confirmPassword ? 'border-red-300 bg-red-50 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-400'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xs cursor-pointer select-none"
                          title={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>

                {/* Trust Notice */}
                <div className="text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-lg flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span>🔒</span> Verified secure submission to Admissions Registrar.
                  </span>
                  <span className="text-emerald-600 font-bold">100% Free Hostel & Counseling</span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Verifying & Submitting Admission Application...
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

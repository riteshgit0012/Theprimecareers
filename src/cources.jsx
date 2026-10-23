import { useState, useEffect } from 'react'
import { getApiBase } from './apiConfig'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar, Footer } from './components'

// Course imagery (human style)
import aviationImg from './assets/course-aviation.jpg'
import travelImg from './assets/course-travel.png'
import hotelImg from './assets/course-hotel.jpg'
import aiImg from './assets/course-ai.jpg'

export const imageMap = {
  aviation: aviationImg,
  travel: travelImg,
  hotel: hotelImg,
  ai: aiImg,
}

export const specializedCourses = [
  {
      theme: {
      bgGradient: 'from-sky-100/90 via-blue-50/50 to-white',
      cardBorder: 'border-sky-200/80',
      iconBg: 'bg-[#0284c7]',
      btnBg: 'bg-[#0284c7] hover:bg-[#0369a1]',
      checkColor: 'text-[#0284c7]',
      accentBadge: 'bg-sky-100 text-sky-800 border-sky-200',
    },
    id: 'aviation',
    title: 'Aviation Course',
    tagline: 'Soar Higher. Build Your Future.',
    iconType: 'plane',
    image: aviationImg,
    imageAlt: 'Aviation Cabin Crew & Airport Operations',
    highlights: [
      'Cabin Crew Training',
      'Ground Staff Training',
      'Airport Operations',
      'Aviation Management',
    ],
    duration: '6 to 12 Months',
    eligibility: '12th Pass or Any Graduate',
    facilities: [
      
      '✈️ Practical Mock Aircraft & Cabin Simulator Training',
      '🗣️ Personality Grooming, Spoken English & In-flight Etiquette Sessions',
      '👔 Free Professional Uniform, Badges & Grooming Kits Provided',
      '📜 IATA-Standard Curriculum & Govt. Recognized Certification',
      '🤝 100% Placement Support with Indigo, Air India, SpiceJet & International Airlines',
    ],
    syllabus: [
      'Aviation Fundamentals & Flight Safety Regulations',
      'Passenger Handling, Ticketing & Boarding Gate Operations',
      'Emergency Procedures, In-flight Medical Aid & First Aid',
      'Customer Care, Aviation Soft Skills & Interview Preparation',
    ],
    careerRoles: 'Cabin Crew, Air Hostess, Flight Steward, Airport Ground Staff, Guest Service Officer',
  },
  {
    id: 'travel',
    title: 'Tour and Travel Course',
    tagline: 'Explore the World. Create Unforgettable Experiences.',
    theme: {
      bgGradient: 'from-amber-100/90 via-orange-50/40 to-white',
      cardBorder: 'border-amber-200/80',
      iconBg: 'bg-[#ea580c]',
      btnBg: 'bg-[#ea580c] hover:bg-[#c2410c]',
      checkColor: 'text-[#ea580c]',
      accentBadge: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    iconType: 'map',
    image: travelImg,
    imageAlt: 'Tour and Travel Industry Experience',
    highlights: [
      'Travel & Tourism Management',
      'Tour Planning & Operations',
      'Customer Service',
      'Destination Knowledge',
    ],
    duration: '4 to 6 Months',
    eligibility: '10th / 12th Pass or Any Graduate',
    facilities: [
      
      '🗺️ GDS Flight & Hotel Ticketing Software (Amadeus / Galileo) Live Training',
      '🌍 Field Exposure Trips & Destination Site Visits',
      '📚 Free Course Study Materials, Guides & Tour Kits',
      '📜 Ministry of Tourism Aligned Industry Certification',
      '🤝 100% Placement Assistance with MakeMyTrip, Thomas Cook, Yatra & Luxury Resorts',
    ],
    syllabus: [
      'World Geography, Popular Destinations & Travel Logistics',
      'Visa Processing, Forex Management & Passport Assistance',
      'Itinerary Planning, Custom Tour Packages & Budgeting',
      'Hospitality Etiquettes, Sales Techniques & Client Handling',
    ],
    careerRoles: 'Tour Manager, Travel Consultant, Reservation Specialist, Destination Expert, Tour Escort',
  },
  {
    id: 'maritime',
    title: 'Maritime and Hotel Services Course',
    tagline: 'Global Careers. Hospitality & Beyond.',
    theme: {
      bgGradient: 'from-teal-100/90 via-emerald-50/40 to-white',
      cardBorder: 'border-teal-200/80',
      iconBg: 'bg-[#0d9488]',
      btnBg: 'bg-[#0d9488] hover:bg-[#0f766e]',
      checkColor: 'text-[#0d9488]',
      accentBadge: 'bg-teal-100 text-teal-800 border-teal-200',
    },
    iconType: 'ship',
    image: hotelImg,
    imageAlt: 'Maritime Cruise Liner & Hotel Services',
    highlights: [
      'Maritime Operations',
      'Hospitality Management',
      'Hotel Front Office & Housekeeping',
      'Food & Beverage Services',
    ],
    duration: '6 to 12 Months',
    eligibility: '10th / 12th Pass or Any Degree',
    facilities: [
      
      '🚢 International Luxury Cruise Liner Protocol & STCW Safety Training',
      '🏨 Hands-on Practical Sessions in 5-Star Hotel Setup Labs',
      '👔 Complete Professional Hotelier / Cruise Service Uniform Kit Included',
      '📜 Globally Valid Maritime & Hospitality Certificate',
      '🤝 Placement Opportunities in Luxury Cruises & 5-Star Hotel Chains (Taj, Marriott, Hyatt)',
    ],
    syllabus: [
      'Front Office Systems, Reception & Guest Hospitality Management',
      'Food & Beverage Operations, Fine Dining Etiquette & Bar Management',
      'Housekeeping Standards, Room Management & Quality Control',
      'Shipboard Safety, Maritime Customs & International Port Formalities',
    ],
    careerRoles: 'Cruise Hospitality Crew, Hotel Front Office Executive, Guest Relations Officer, F&B Supervisor',
  },
  {
    id: 'ai-marketing',
    title: 'AI & Digital Marketing Course',
    tagline: 'Learn Today. Lead Tomorrow.',
    theme: {
      bgGradient: 'from-indigo-100/90 via-purple-50/40 to-white',
      cardBorder: 'border-indigo-200/80',
      iconBg: 'bg-[#4f46e5]',
      btnBg: 'bg-[#4f46e5] hover:bg-[#4338ca]',
      checkColor: 'text-[#4f46e5]',
      accentBadge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    },
    iconType: 'chip',
    image: aiImg,
    imageAlt: 'AI and Digital Marketing on modern laptop',
    highlights: [
      'Digital Marketing Fundamentals',
      'SEO & Content Strategy',
      'Social Media Marketing',
      'AI Tools & Automation',
    ],
    duration: '4 to 6 Months',
    eligibility: '12th Pass or Any Graduate / College Students',
    facilities: [
    
      '🤖 Practical Training with Top AI Tools (ChatGPT, Midjourney, Claude, Make.com)',
      '📈 Live Ad Campaigns with Real Budgets on Google, Meta & LinkedIn',
      '💻 High-Speed Computer Lab & Lifetime LMS Video Recordings Access',
      '📜 Google, Meta & HubSpot Recognized Industry Certifications',
      '🤝 100% Placement Support & Paid Client Internship Opportunities',
    ],
    syllabus: [
      'Search Engine Optimization (SEO) & High-Ranking Content Strategy',
      'Performance Marketing: Google Search, Display & YouTube Ads',
      'Social Media Marketing (Instagram, Facebook, LinkedIn Growth)',
      'AI-Powered Copywriting, Graphic Generation & Marketing Automation',
    ],
    careerRoles: 'Digital Marketing Specialist, SEO Analyst, Social Media Manager, AI Content Strategist, Media Buyer',
  },
]

// ─── SVG ICONS HELPER ───────────────────────────────────────────────────────────
function CourseIcon({ type }) {
  if (type === 'plane') {
    return (
      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
      </svg>
    )
  }
  if (type === 'map') {
    return (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    )
  }
  if (type === 'ship') {
    return (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 18l2.5-1.5L8 18l2.5-1.5L13 18l2.5-1.5L18 18l2.5-1.5L21 18M4 14l1.5-7h13L20 14M9 7V4h6v3M12 4v3" />
      </svg>
    )
  }
  return (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  )
}

// ─── COURSE DETAILS MODAL ─────────────────────────────────────────────────────
function CourseModal({ course, onClose }) {
  const navigate = useNavigate()
  if (!course) return null

  const handleEnrollClick = () => {
    onClose()
    navigate(`/register?course=${encodeURIComponent(course.title)}`)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-lg font-bold transition"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className={`p-6 sm:p-8 bg-gradient-to-r ${course.theme.bgGradient} border-b border-gray-100`}>
          <div className="flex items-center gap-4 mb-3">
            <div className={`w-12 h-12 rounded-2xl ${course.theme.iconBg} flex items-center justify-center shadow-md`}>
              <CourseIcon type={course.iconType} />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Specialized Program</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                {course.title}
              </h2>
            </div>
          </div>
          <p className="text-gray-600 text-sm sm:text-base font-medium">{course.tagline}</p>
        </div>

        {/* Special Free Hostel Banner */}
        <div className="mx-6 sm:mx-8 my-5 p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-start gap-3 shadow-sm">
          <div className="text-2xl">🏠</div>
          <div>
            {/* <h4 className="text-emerald-900 font-extrabold text-sm sm:text-base">
              Special Facility: Free Hostel & Accommodation Included (No Rent)
            </h4> */}
            {/* <p className="text-emerald-700 text-xs sm:text-sm mt-0.5 leading-relaxed">
              Sabhi enrolled students ko course ke dauran rehne ke liye <strong>Free Hostel Room</strong> provide kiya jata hai. Iska koi bhi rent ya monthly charge nahi lagta!
            </p> */}
          </div>
        </div>

        {/* Modal Content */}
        <div className="px-6 sm:px-8 pb-8 space-y-6">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-400 block font-medium">Duration</span>
              <span className="text-sm font-bold text-gray-800">{course.duration}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-400 block font-medium">Eligibility</span>
              <span className="text-sm font-bold text-gray-800">{course.eligibility}</span>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <span className="text-xs text-gray-400 block font-medium">Placement</span>
              <span className="text-sm font-bold text-emerald-600">100% Support</span>
            </div>
          </div>

          {/* Key Facilities */}
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span>✨</span> Course Facilities & Benefits 
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {course.facilities.map((fac, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs sm:text-sm text-gray-700 flex items-start gap-2"
                >
                  <span className="text-blue-600 font-bold">✔</span>
                  <span>{fac}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Syllabus */}
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2.5 flex items-center gap-2">
              <span>📚</span> Modules Covered in this Course
            </h3>
            <ul className="space-y-1.5">
              {course.syllabus.map((item, idx) => (
                <li key={idx} className="text-xs sm:text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Career Roles */}
          <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-100 text-xs sm:text-sm">
            <span className="font-bold text-blue-900 block mb-0.5">Career Opportunities:</span>
            <span className="text-blue-800/90">{course.careerRoles}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleEnrollClick}
              className={`flex-1 py-3.5 px-6 ${course.theme.btnBg} text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center flex items-center justify-center gap-2 text-sm sm:text-base`}
            >
              Enroll Now for this Course →
            </button>
            <button
              onClick={onClose}
              className="py-3.5 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition text-sm text-center"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN COURSES PAGE ────────────────────────────────────────────────────────
export default function Courses() {
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [coursesList, setCoursesList] = useState(specializedCourses)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${getApiBase()}/api/courses`)
        if (res.ok) {
          const data = await res.json()
          if (data.data && data.data.length > 0) {
            const mapped = data.data.map((c) => ({
              ...c,
              image: imageMap[c.image] || c.image || aviationImg,
              theme: c.theme || {
                bgGradient: 'from-blue-100/90 via-sky-50/50 to-white',
                cardBorder: 'border-blue-200/80',
                iconBg: 'bg-[#0284c7]',
                btnBg: 'bg-[#0284c7] hover:bg-[#0369a1]',
                checkColor: 'text-[#0284c7]',
              },
            }))
            // Always keep 4 static courses permanent, append any new dynamic courses
            const staticTitles = new Set(specializedCourses.map((c) => c.title.toLowerCase().trim()))
            const dynamicCourses = mapped.filter((c) => !staticTitles.has(c.title?.toLowerCase().trim()))
            setCoursesList([...specializedCourses, ...dynamicCourses])
          }
        }
      } catch {
        // Fallback to local storage if present
        const local = JSON.parse(localStorage.getItem('lms_dynamic_courses') || '[]')
        if (local.length > 0) {
          const mapped = local.map((c) => ({
            ...c,
            image: imageMap[c.image] || c.image || aviationImg,
          }))
          const staticTitles = new Set(specializedCourses.map((c) => c.title.toLowerCase().trim()))
          const dynamicCourses = mapped.filter((c) => !staticTitles.has(c.title?.toLowerCase().trim()))
          setCoursesList([...specializedCourses, ...dynamicCourses])
        }
      }
    }
    fetchCourses()
  }, [])

  return (
    <div className="min-h-screen bg-[#f8fbff] flex flex-col justify-between">
      <Navbar />

      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ─── Top Header Section (Exact Reference Layout) ─── */}
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="text-[11px] sm:text-xs font-bold tracking-widest text-slate-500 uppercase block mb-1.5">
              BUILD YOUR SKILLS &nbsp;•&nbsp; EXPLORE NEW OPPORTUNITIES
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1a2b49] tracking-tight mb-2.5">
              Our Courses
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
              Choose from our specialized courses and take the next step towards a successful career in your dream industry.
            </p>
            {/* Blue accent indicator bar */}
            <div className="w-10 h-1 bg-[#0284c7] rounded-full mx-auto mt-3" />
          </div>

          {/* ─── Rent Free Facility Notification ─── */}
          {/* <div className="max-w-4xl mx-auto mb-8 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-blue-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3"> */}
            {/* <div className="flex items-center gap-2.5">
              <span className="text-2xl">🏠</span>
              <div>
                <p className="font-extrabold text-blue-950 text-xs sm:text-sm">
                  Special Facility: 100% Free Hostel & Accommodation (No Rent Charged / कोई किराया नहीं)
                </p>
              </div>
            </div> */}
          {/* </div> */}

          {/* ─── Courses 2x2 Grid (Dynamic, Sleek Human Style Layout) ─── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 max-w-4xl mx-auto">
            {coursesList.map((course) => (
              <div
                key={course.id}
                className={`bg-gradient-to-r ${course.theme?.bgGradient || 'from-blue-50 to-white'} rounded-2xl p-4 sm:p-4.5 shadow-xs hover:shadow-md transition-all duration-300 border ${course.theme?.cardBorder || 'border-blue-100'} flex flex-col sm:flex-row items-center justify-between gap-3.5 group overflow-hidden relative`}
              >
                {/* Left Column: Course Information */}
                <div className="flex-1 w-full z-10">
                  {/* Round Icon */}
                  <div
                    className={`w-9 h-9 ${course.theme.iconBg} rounded-xl flex items-center justify-center shadow-xs mb-2.5 group-hover:scale-105 transition-transform`}
                  >
                    <CourseIcon type={course.iconType} />
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-0.5 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium mb-2.5">
                    {course.tagline}
                  </p>

                  {/* Checkmarked Bullet Points */}
                  <ul className="space-y-1 mb-3.5">
                    {course.highlights.map((point, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-700 font-medium">
                        <span className={`w-3 h-3 rounded-full flex items-center justify-center font-bold text-[10px] ${course.theme.checkColor}`}>
                          ✓
                        </span>
                        <span className="leading-tight">{point}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-2 items-center pt-0.5">
                    <button
                      onClick={() => {
                        const title = course.title?.toLowerCase() || ''
                        const id = course.id?.toLowerCase() || ''
                        if (id === 'aviation' || title.includes('aviation')) {
                          navigate('/courses/aviation')
                        } else if (id === 'travel' || title.includes('travel') || title.includes('tour')) {
                          navigate('/courses/travel')
                        } else if (id === 'maritime' || title.includes('maritime') || title.includes('hotel')) {
                          navigate('/av3')
                        } else if (id === 'ai-marketing' || title.includes('ai') || title.includes('digital')) {
                          navigate('/av4')
                        } else {
                          setSelectedCourse(course)
                        }
                      }}
                      className={`px-3.5 py-1.5 ${course.theme.btnBg} text-white font-bold text-xs rounded-lg shadow-xs hover:shadow transition-all flex items-center gap-1 cursor-pointer`}
                    >
                      Explore Course →
                    </button>
                    <button
                      onClick={() => navigate(`/register?course=${encodeURIComponent(course.title)}`)}
                      className="px-3 py-1.5 bg-white/95 hover:bg-white text-gray-800 font-semibold text-xs rounded-lg border border-gray-200 shadow-xs transition cursor-pointer"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>

                {/* Right Column: Human-Style Image Mask (Compact & Proportional) */}
                <div className="w-full sm:w-32 md:w-36 h-32 sm:h-36 flex-shrink-0 relative overflow-hidden rounded-xl shadow-inner">
                  <img
                    src={course.image}
                    alt={course.imageAlt}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle edge blend overlay */}
                  <div className="hidden sm:block absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-white/35 to-transparent pointer-events-none" />
                </div>
              </div>
            ))}
          </div>

          {/* ─── Bottom Counseling Help CTA ─── */}
          <div className="mt-16 text-center bg-white rounded-3xl p-8 sm:p-10 border border-blue-100 max-w-4xl mx-auto shadow-sm">
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">
              Need Help Choosing the Right Career Path?
            </h3>
            <p className="text-gray-500 text-sm max-w-xl mx-auto mb-6">
              Our expert career counselors provide free 1-on-1 guidance, complete syllabus walkthrough, and hostel allotment details.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/register"
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition text-sm"
              >
                Apply for Admission →
              </Link>
              <Link
                to="/contact"
                className="px-8 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl border border-gray-200 transition text-sm"
              >
                Talk to Counselor
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Modal for Course Details & Facilities */}
      <CourseModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />

      <Footer />
    </div>
  )
}

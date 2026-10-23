import { Link, useNavigate } from 'react-router-dom'
import { Navbar, Footer } from './components'
import aviationHeroImg from './assets/course-aviation.jpg'

export default function Aviation() {
  const navigate = useNavigate()

  const aviationPrograms = [
    {
      id: 'cabin-crew',
      title: 'Cabin Crew',
      tagline: 'Fly, Serve, Create Memorable Journeys',
      iconBg: 'bg-blue-600',
      badgeColor: 'text-blue-600 bg-blue-50',
      borderColor: 'border-blue-200',
      btnColor: 'bg-blue-600 hover:bg-blue-700',
      role: 'Cabin crew are responsible for ensuring passenger safety, comfort and a smooth flying experience. They handle in-flight services, emergency procedures and customer assistance.',
      responsibilities: [
        'Ensure passenger safety & security',
        'Provide in-flight services and assistance',
        'Handle emergencies and follow safety protocols',
      ],
      salaryMonth: '₹25,000 – ₹60,000',
      salaryExp: '₹1.5 LPA – ₹5 LPA',
      image: 'https://images.unsplash.com/photo-1540339832862-474599807836?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'ground-staff',
      title: 'Ground Staff',
      tagline: 'Keep Airports Moving',
      iconBg: 'bg-emerald-600',
      badgeColor: 'text-emerald-600 bg-emerald-50',
      borderColor: 'border-emerald-200',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700',
      role: 'Ground staff manage day-to-day operations at the airport, helping with check-in, boarding, baggage handling, security and passenger support.',
      responsibilities: [
        'Check-in and boarding assistance',
        'Baggage handling and documentation',
        'Coordination with airline and airport teams',
      ],
      salaryMonth: '₹20,000 – ₹45,000',
      salaryExp: '₹1.2 LPA – ₹4 LPA',
      image: 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'airport-operations',
      title: 'Airport Operations',
      tagline: 'Manage. Coordinate. Keep It Moving.',
      iconBg: 'bg-indigo-600',
      badgeColor: 'text-indigo-600 bg-indigo-50',
      borderColor: 'border-indigo-200',
      btnColor: 'bg-indigo-600 hover:bg-indigo-700',
      role: 'Airport operations professionals ensure smooth and safe functioning of airport activities, including flight scheduling, runway management, and coordination with different departments.',
      responsibilities: [
        'Monitor flight schedules and runway operations',
        'Coordinate with airlines, ATC and ground teams',
        'Ensure safety, security and smooth passenger flow',
      ],
      salaryMonth: '₹35,000 – ₹70,000',
      salaryExp: '₹2 LPA – ₹7 LPA',
      image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'aviation-management',
      title: 'Aviation Management',
      tagline: 'Build the Future of Aviation',
      iconBg: 'bg-amber-600',
      badgeColor: 'text-amber-600 bg-amber-50',
      borderColor: 'border-amber-200',
      btnColor: 'bg-amber-600 hover:bg-amber-700',
      role: 'Aviation management professionals plan, organize and manage various aspects of the aviation industry, including operations, finance, marketing and human resources.',
      responsibilities: [
        'Oversee airline and airport operations',
        'Manage teams and resources',
        'Handle business and financial planning',
      ],
      salaryMonth: '₹40,000 – ₹90,000',
      salaryExp: '₹3 LPA – ₹10 LPA',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    },
  ]

  const handleEnroll = (programTitle) => {
    navigate(`/register?course=${encodeURIComponent(`Aviation - ${programTitle}`)}`)
  }

  return (
    <div className="min-h-screen bg-[#f8fbff] flex flex-col justify-between">
      <Navbar />

      <main className="pt-20 pb-20">
        {/* ─── Breadcrumb ─── */}
        <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-4 pb-2 text-xs sm:text-sm text-gray-500 flex items-center gap-2">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          <span>›</span>
          <Link to="/courses" className="hover:text-blue-600 transition">Our Courses</Link>
          <span>›</span>
          <span className="text-gray-900 font-semibold">Aviation</span>
        </div>

        {/* ─── Hero Section (Exact Image 2 Reference) ─── */}
        <section className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12">
          <div className="bg-gradient-to-r from-sky-50 via-blue-50/80 to-white rounded-3xl border border-sky-100 shadow-sm p-6 sm:p-10 lg:p-12 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column */}
              <div className="lg:col-span-7 z-10">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">✈</span>
                  AVIATION COURSES
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-[#1a2b49] tracking-tight leading-tight mb-3">
                  Launch Your Career in Aviation
                </h1>

                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-5 max-w-xl">
                  From cabin crew to airport operations, discover a range of aviation courses designed to give you the skills, knowledge and global opportunities you need to fly high.
                </p>

                {/* 3 Value Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                  <div className="flex items-center gap-2.5 p-3 bg-white/90 rounded-2xl border border-blue-100/80 shadow-xs">
                    <span className="text-2xl">📦</span>
                    <span className="text-xs font-bold text-gray-800 leading-tight">
                      Industry Focused Curriculum
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 bg-white/90 rounded-2xl border border-blue-100/80 shadow-xs">
                    <span className="text-2xl">👨‍🏫</span>
                    <span className="text-xs font-bold text-gray-800 leading-tight">
                      Expert Trainers & Mentors
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 bg-white/90 rounded-2xl border border-blue-100/80 shadow-xs">
                    <span className="text-2xl">🌐</span>
                    <span className="text-xs font-bold text-gray-800 leading-tight">
                      Global Career Opportunities
                    </span>
                  </div>
                </div>

                {/* Free Stay Notice */}
                {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold">
                  <span>🏠</span>
                  <span>Free Hostel & Stay Facility Allotted (No Rent Charged / कोई किराया नहीं)</span>
                </div> */}
              </div>

              {/* Right Column: Hero Visual Mask */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden shadow-md border-2 border-white bg-gradient-to-br from-blue-100 to-indigo-100 aspect-[16/10] lg:aspect-auto lg:h-72 max-w-sm mx-auto">
                  <img
                    src={aviationHeroImg}
                    alt="Aviation Air Hostess and Commercial Aircraft"
                    className="w-full h-full object-cover object-center"
                  />
                  {/* Floating callout */}
                  {/* <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-sky-100 text-right">
                    <span className="text-xs font-extrabold text-blue-900 block font-handwriting">
                      Your Journey Begins Here ✈
                    </span>
                    <span className="text-[9px] text-gray-400 font-semibold">100% Placement Support</span>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Sub-Courses Section Heading ─── */}
        <section className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 mt-4 mb-8 text-center">
          <h2 className="text-xl sm:text-3xl font-extrabold text-[#1a2b49] tracking-tight mb-1.5">
            Explore Aviation Courses
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm max-w-xl mx-auto">
            Choose your path and build a future in the dynamic world of aviation.
          </p>
          <div className="w-10 h-1 bg-[#0284c7] rounded-full mx-auto mt-2.5" />
        </section>

        {/* ─── 4 Aviation Sub-Programs Grid (Exact Image 2 Reference) ─── */}
        <section className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {aviationPrograms.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header with Icon, Title, and Visual */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-xl ${p.iconBg} text-white flex items-center justify-center text-lg shadow-xs`}>
                        ✈
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                          {p.title}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium">{p.tagline}</p>
                      </div>
                    </div>

                    {/* Small thumbnail */}
                    <div className="w-14 h-12 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 shadow-inner">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  {/* Job Role */}
                  <div className="mb-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      👤 Job Role
                    </span>
                    <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      {p.role}
                    </p>
                  </div>

                  {/* Key Responsibilities */}
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                      ✔ Key Responsibilities
                    </span>
                    <ul className="space-y-1">
                      {p.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                          <span className="text-blue-600 font-bold">✔</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Expected Salary Box */}
                  <div className="p-2.5 bg-gradient-to-r from-blue-50/60 to-emerald-50/60 rounded-xl border border-blue-100/70 mb-4 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">
                        💵 Expected Salary (Entry Level)
                      </span>
                      <span className="text-sm font-extrabold text-gray-900">
                        {p.salaryMonth} <span className="text-[10px] text-gray-500 font-normal">/ mo</span>
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">
                        With Experience
                      </span>
                      <span className="text-xs font-bold text-emerald-700">
                        {p.salaryExp}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Enroll Button */}
                <button
                  onClick={() => handleEnroll(p.title)}
                  className={`w-full py-2.5 px-4 ${p.btnColor} text-white font-bold text-xs rounded-xl shadow-xs hover:shadow transition flex items-center justify-center gap-1.5 cursor-pointer`}
                >
                  <span>Enroll in {p.title} Courses</span>
                  <span>→</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Bottom CTA Banner (Exact Image 2 Reference) ─── */}
        {/* <section className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 mt-10">
          <div className="bg-gradient-to-r from-[#172554] via-[#1e3a8a] to-[#1d4ed8] rounded-2xl p-5 sm:p-7 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
            <div className="flex items-center gap-3 z-10">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-xl flex-shrink-0">
                🚀
              </div>
              {/* <div>
                <h3 className="text-base sm:text-xl font-extrabold tracking-tight">
                  Your Aviation Career Starts Here
                </h3>
                <p className="text-white/80 text-xs mt-0.5">
                  Choose your course, gain in-demand skills and take the first step towards a global career.
                </p>
              </div> */}
            {/* </div> */}

            {/* <button
              onClick={() => navigate('/register?course=Aviation%20Course')}
              className="z-10 px-5 py-2.5 bg-white text-blue-900 hover:bg-blue-50 font-black rounded-xl text-xs shadow transition whitespace-nowrap cursor-pointer"
            >
              Explore All Aviation Courses →
            </button> */}
          {/* </div> */}
        {/* </section> */} */
      </main>

      <Footer />
    </div>
  )
}

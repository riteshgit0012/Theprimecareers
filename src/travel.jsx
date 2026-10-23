import { Link, useNavigate } from 'react-router-dom'
import { Navbar, Footer } from './components'
import travelHeroImg from './assets/course-travel.png'

export default function Travel() {
  const navigate = useNavigate()

  const travelPrograms = [
    {
      id: 'travel-management',
      title: 'Travel & Tourism Management',
      tagline: 'Plan Experiences. Create Memories.',
      iconBg: 'bg-amber-500',
      badgeColor: 'text-amber-600 bg-amber-50',
      borderColor: 'border-amber-200',
      btnColor: 'bg-amber-500 hover:bg-amber-600',
      role: 'Manage travel operations, plan itineraries, coordinate with suppliers, and ensure smooth travel experiences for clients.',
      responsibilities: [
        'Itinerary planning & travel coordination',
        'Supplier and vendor management',
        'Customer service & issue resolution',
        'Marketing and promotion of travel packages',
      ],
      salaryMonth: '₹20,000 – ₹40,000',
      salaryExp: '₹4 LPA – ₹8 LPA',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'tour-planning',
      title: 'Tour Planning & Operations',
      tagline: 'Design Journeys. Deliver Experiences.',
      iconBg: 'bg-teal-600',
      badgeColor: 'text-teal-600 bg-teal-50',
      borderColor: 'border-teal-200',
      btnColor: 'bg-teal-600 hover:bg-teal-700',
      role: 'Create and manage tour packages, handle bookings, coordinate logistics, and ensure customer satisfaction during travel.',
      responsibilities: [
        'Develop tour itineraries and packages',
        'Coordinate transport, hotels and activities',
        'Handle customer queries and support',
        'Work with local guides and service providers',
      ],
      salaryMonth: '₹18,000 – ₹35,000',
      salaryExp: '₹3.5 LPA – ₹7 LPA',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'customer-service',
      title: 'Customer Service',
      tagline: 'Support Today. Build Loyalty Tomorrow.',
      iconBg: 'bg-purple-600',
      badgeColor: 'text-purple-600 bg-purple-50',
      borderColor: 'border-purple-200',
      btnColor: 'bg-purple-600 hover:bg-purple-700',
      role: 'Assist travelers with inquiries, bookings, travel information, and resolve issues to ensure a positive experience.',
      responsibilities: [
        'Handle customer queries (phone, email, chat)',
        'Resolve complaints and provide solutions',
        'Maintain customer records and bookings',
        'Ensure high service quality and satisfaction',
      ],
      salaryMonth: '₹15,000 – ₹28,000',
      salaryExp: '₹3 LPA – ₹5.5 LPA',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'destination-knowledge',
      title: 'Destination Knowledge',
      tagline: 'Know More. Help More.',
      iconBg: 'bg-rose-600',
      badgeColor: 'text-rose-600 bg-rose-50',
      borderColor: 'border-rose-200',
      btnColor: 'bg-rose-600 hover:bg-rose-700',
      role: 'Provide destination information, suggest travel options, create better itineraries, and guide clients about culture, places and local experiences.',
      responsibilities: [
        'Study destinations, culture and attractions',
        'Provide travel advice and recommendations',
        'Stay updated on visa, health and travel rules',
        'Support sales and marketing efforts',
      ],
      salaryMonth: '₹16,000 – ₹32,000',
      salaryExp: '₹3.5 LPA – ₹6.5 LPA',
      image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=600&q=80',
    },
  ]

  const handleEnroll = (programTitle) => {
    navigate(`/register?course=${encodeURIComponent(`Tour & Travel - ${programTitle}`)}`)
  }

  return (
    <div className="min-h-screen bg-[#f8fbff] flex flex-col justify-between">
      <Navbar />

      <main className="pt-20 pb-20">
        {/* Breadcrumb */}
        <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-4 pb-2 text-xs text-gray-500 flex items-center gap-2">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          <span>›</span>
          <Link to="/courses" className="hover:text-blue-600 transition">Our Courses</Link>
          <span>›</span>
          <span className="text-gray-900 font-semibold">Tour & Travel</span>
        </div>

        {/* Hero Section */}
        <section className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-10">
          <div className="bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-white rounded-3xl border border-amber-100 shadow-sm p-6 sm:p-8 lg:p-10 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">🌍</span>
                  TOUR & TRAVEL COURSES
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-[#1a2b49] tracking-tight leading-tight mb-3">
                  Explore the World, Build Your Career
                </h1>

                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-5 max-w-xl">
                  Turn your passion for travel into a rewarding career. Our tour & travel courses equip you with the skills and knowledge to work in the global travel industry, create amazing travel experiences and explore endless opportunities.
                </p>

                {/* 4 Pillars */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
                  <div className="p-2.5 bg-white/95 rounded-xl border border-amber-100/80 text-center shadow-xs">
                    <span className="text-xl block mb-0.5">🧳</span>
                    <span className="text-[11px] font-bold text-gray-800 leading-tight">Hands-on Training</span>
                  </div>
                  <div className="p-2.5 bg-white/95 rounded-xl border border-amber-100/80 text-center shadow-xs">
                    <span className="text-xl block mb-0.5">🧑‍🏫</span>
                    <span className="text-[11px] font-bold text-gray-800 leading-tight">Industry Experts</span>
                  </div>
                  <div className="p-2.5 bg-white/95 rounded-xl border border-amber-100/80 text-center shadow-xs">
                    <span className="text-xl block mb-0.5">🌐</span>
                    <span className="text-[11px] font-bold text-gray-800 leading-tight">Global Career Opps</span>
                  </div>
                  <div className="p-2.5 bg-white/95 rounded-xl border border-amber-100/80 text-center shadow-xs">
                    <span className="text-xl block mb-0.5">🤝</span>
                    <span className="text-[11px] font-bold text-gray-800 leading-tight">Placement Support</span>
                  </div>
                </div>

                {/* Free Hostel Badge */}
                {/* <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold">
                  <span>🏠</span>
                  <span>Free Hostel Facility Allotted (No Rent Charged / कोई किराया नहीं)</span>
                </div> */}
              </div>

              {/* Right Hero Image */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-white aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-80">
                  <img
                    src={travelHeroImg}
                    alt="Tour and Travel Guide"
                    className="w-full h-full object-cover object-center"
                  />
                  {/* <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-amber-100 text-right">
                    <span className="text-xs font-black text-amber-900 block">
                      Travel Learn Grow ✈
                    </span>
                    <span className="text-[9px] text-gray-400 font-semibold">100% Placement Support</span>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sub-Courses Heading */}
        <section className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 mt-4 mb-8 text-center">
          <h2 className="text-xl sm:text-3xl font-extrabold text-[#1a2b49] tracking-tight mb-1.5">
            Explore Tour & Travel Courses
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm max-w-xl mx-auto">
            Choose your path and gain the skills to build a successful career in the travel and tourism industry.
          </p>
          <div className="w-10 h-1 bg-amber-500 rounded-full mx-auto mt-2.5" />
        </section>

        {/* 4 Cards Grid */}
        <section className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {travelPrograms.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${p.iconBg} text-white flex items-center justify-center text-xl shadow-xs`}>
                        🌍
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                          {p.title}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium">{p.tagline}</p>
                      </div>
                    </div>

                    <div className="w-16 h-14 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 shadow-inner">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                      👤 Job Role
                    </span>
                    <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      {p.role}
                    </p>
                  </div>

                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                      ✔ Key Responsibilities
                    </span>
                    <ul className="space-y-1">
                      {p.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                          <span className="text-amber-600 font-bold">✔</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Salary Box */}
                  <div className="p-3 bg-gradient-to-r from-amber-50/60 to-orange-50/60 rounded-xl border border-amber-100/70 mb-4 flex items-center justify-between text-xs">
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
                      <span className="text-xs font-bold text-amber-700">
                        {p.salaryExp}
                      </span>
                    </div>
                  </div>
                </div>

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

        {/* Bottom Banner */}
        <section className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 mt-10">
          {/* <div className="bg-gradient-to-r from-[#0c4a6e] via-[#0284c7] to-[#0369a1] rounded-2xl p-5 sm:p-7 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4"> */}
            {/* <div className="flex items-center gap-3"> */}
              {/* <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-xl flex-shrink-0">
                🧭
              </div> */}
              {/* <div>
                <h3 className="text-base sm:text-xl font-extrabold tracking-tight">
                  Your Journey in Travel & Tourism Starts Here
                </h3>
                <p className="text-white/80 text-xs mt-0.5">
                  Gain the skills, get certified and step into a world of global opportunities.
                </p>
              </div> */}
            {/* </div> */}

            {/* <button
              onClick={() => navigate('/register?course=Tour%20and%20Travel%20Course')}
              className="px-5 py-2.5 bg-white text-sky-900 hover:bg-sky-50 font-black rounded-xl text-xs shadow transition whitespace-nowrap cursor-pointer"
            >
              Explore All Tour & Travel Courses →
            </button> */}
          {/* </div> */}
        </section>
      </main>

      <Footer />
    </div>
  )
}

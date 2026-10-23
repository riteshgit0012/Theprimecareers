import { Link, useNavigate } from 'react-router-dom'
import { Navbar, Footer } from './components'
import maritimeHeroImg from './assets/course-hotel.jpg'

export default function Maritime() {
  const navigate = useNavigate()

  const maritimePrograms = [
    {
      id: 'maritime-operations',
      title: 'Maritime Operations',
      tagline: 'Work on the Ocean. Build a Global Career.',
      iconBg: 'bg-sky-700',
      badgeColor: 'text-sky-700 bg-sky-50',
      borderColor: 'border-sky-200',
      btnColor: 'bg-sky-700 hover:bg-sky-800',
      role: 'Manage ship operations, ensure safety, handle navigation, and coordinate with the crew and port authorities.',
      responsibilities: [
        'Monitor vessel operations and safety protocols',
        'Navigation and communication',
        'Maintain logs and reports',
        'Ensure compliance with maritime regulations',
      ],
      salaryMonth: '₹25,000 – ₹60,000',
      salaryExp: '₹6 LPA – ₹12 LPA',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'hospitality-management',
      title: 'Hospitality Management',
      tagline: 'Create Memorable Experiences.',
      iconBg: 'bg-emerald-600',
      badgeColor: 'text-emerald-600 bg-emerald-50',
      borderColor: 'border-emerald-200',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700',
      role: 'Oversee hotel operations, manage staff, ensure guest satisfaction and maintain service standards.',
      responsibilities: [
        'Front office and guest relations',
        'Housekeeping and maintenance',
        'Food & beverage operations',
        'Team management and service quality',
      ],
      salaryMonth: '₹20,000 – ₹45,000',
      salaryExp: '₹3.5 LPA – ₹8 LPA',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'cruise-ship-services',
      title: 'Cruise & Ship Services',
      tagline: 'Explore. Work. Travel the World.',
      iconBg: 'bg-indigo-700',
      badgeColor: 'text-indigo-700 bg-indigo-50',
      borderColor: 'border-indigo-200',
      btnColor: 'bg-indigo-700 hover:bg-indigo-800',
      role: 'Provide customer service, manage guest activities, handle onboard operations, and ensure a smooth cruise experience.',
      responsibilities: [
        'Guest assistance and customer service',
        'Food & beverage service',
        'Entertainment and recreational activities',
        'Safety and emergency procedures',
      ],
      salaryMonth: '₹30,000 – ₹70,000',
      salaryExp: '₹5 LPA – ₹15 LPA',
      image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'food-beverage-services',
      title: 'Food & Beverage Services',
      tagline: 'Great Food. Excellent Service.',
      iconBg: 'bg-amber-600',
      badgeColor: 'text-amber-600 bg-amber-50',
      borderColor: 'border-amber-200',
      btnColor: 'bg-amber-600 hover:bg-amber-700',
      role: 'Serve food and beverages, manage dining areas, ensure guest satisfaction and follow hygiene standards.',
      responsibilities: [
        'Table service and guest interaction',
        'Menu knowledge and upselling',
        'Maintain hygiene and food safety',
        'Work with kitchen and service teams',
      ],
      salaryMonth: '₹18,000 – ₹40,000',
      salaryExp: '₹3 LPA – ₹7 LPA',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    },
  ]

  const handleEnroll = (programTitle) => {
    navigate(`/register?course=${encodeURIComponent(`Maritime - ${programTitle}`)}`)
  }

  return (
    <div className="min-h-screen bg-[#f8fbff] flex flex-col justify-between">
      <Navbar />

      <main className="pt-20 pb-20">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 text-xs text-gray-500 flex items-center gap-2">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          <span>›</span>
          <Link to="/courses" className="hover:text-blue-600 transition">Our Courses</Link>
          <span>›</span>
          <span className="text-gray-900 font-semibold">Maritime & Hotel Services</span>
        </div>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <div className="bg-gradient-to-r from-teal-50/90 via-emerald-50/50 to-white rounded-3xl border border-teal-100 shadow-sm p-6 sm:p-8 lg:p-10 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                  <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px]">🚢</span>
                  MARITIME & HOTEL SERVICES COURSES
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-[#1a2b49] tracking-tight leading-tight mb-3">
                  Set Sail for a Global Career
                </h1>

                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-5 max-w-xl">
                  Explore exciting opportunities in the maritime and hospitality industry. Our courses equip you with the right skills, industry knowledge and practical training to help you build a successful career at sea or on land.
                </p>

                {/* 4 Pillars */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
                  <div className="p-2.5 bg-white/95 rounded-xl border border-teal-100/80 text-center shadow-xs">
                    <span className="text-xl block mb-0.5">🎓</span>
                    <span className="text-[11px] font-bold text-gray-800 leading-tight">World-Class Training</span>
                  </div>
                  <div className="p-2.5 bg-white/95 rounded-xl border border-teal-100/80 text-center shadow-xs">
                    <span className="text-xl block mb-0.5">👨‍💼</span>
                    <span className="text-[11px] font-bold text-gray-800 leading-tight">Expert Faculty</span>
                  </div>
                  <div className="p-2.5 bg-white/95 rounded-xl border border-teal-100/80 text-center shadow-xs">
                    <span className="text-xl block mb-0.5">🌐</span>
                    <span className="text-[11px] font-bold text-gray-800 leading-tight">Global Career Opps</span>
                  </div>
                  <div className="p-2.5 bg-white/95 rounded-xl border border-teal-100/80 text-center shadow-xs">
                    <span className="text-xl block mb-0.5">🤝</span>
                    <span className="text-[11px] font-bold text-gray-800 leading-tight">Placement Support</span>
                  </div>
                </div>

                {/* Free Stay Notice */}
                {/* <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold">
                  <span>🏠</span>
                  <span>Free Hostel & Stay Allotted (Zero Rent / कोई किराया नहीं)</span>
                </div> */}
              </div>

              {/* Right Hero Image */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-white aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-80">
                  <img
                    src={maritimeHeroImg}
                    alt="Maritime Luxury Cruise & Hospitality"
                    className="w-full h-full object-cover object-center"
                  />
                  {/* <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-teal-100 text-right">
                    <span className="text-xs font-black text-teal-900 block">
                      Career at Sea & Ashore ⚓
                    </span>
                    <span className="text-[9px] text-gray-400 font-semibold">Luxury Cruise Placement</span>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sub-Courses Heading */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-8 text-center">
          <h2 className="text-xl sm:text-3xl font-extrabold text-[#1a2b49] tracking-tight mb-1.5">
            Explore Maritime & Hotel Services Courses
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm max-w-xl mx-auto">
            Choose your path and gain the skills to work in one of the world's most dynamic and rewarding industries.
          </p>
          <div className="w-10 h-1 bg-teal-600 rounded-full mx-auto mt-2.5" />
        </section>

        {/* 4 Cards Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {maritimePrograms.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${p.iconBg} text-white flex items-center justify-center text-xl shadow-xs`}>
                        ⚓
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
                          <span className="text-teal-600 font-bold">✔</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Salary Box */}
                  <div className="p-3 bg-gradient-to-r from-teal-50/60 to-emerald-50/60 rounded-xl border border-teal-100/70 mb-4 flex items-center justify-between text-xs">
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
                      <span className="text-xs font-bold text-teal-700">
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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          {/* <div className="bg-gradient-to-r from-[#0f766e] via-[#0d9488] to-[#115e59] rounded-2xl p-5 sm:p-7 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4"> */}
            {/* <div className="flex items-center gap-3"> */}
              {/* <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-xl flex-shrink-0">
                🌊
              </div>
              <div>
                <h3 className="text-base sm:text-xl font-extrabold tracking-tight">
                  Your Future in Maritime & Hospitality Awaits
                </h3>
                <p className="text-white/80 text-xs mt-0.5">
                  Gain hands-on skills, get certified and step into a world of exciting career opportunities.
                </p>
              </div> */}
            {/* </div> */}

            {/* <button
              onClick={() => navigate('/register?course=Maritime%20and%20Hotel%20Services%20Course')}
              className="px-5 py-2.5 bg-white text-teal-950 hover:bg-teal-50 font-black rounded-xl text-xs shadow transition whitespace-nowrap cursor-pointer"
            >
              Explore All Maritime & Hotel Courses →
            </button> */}
          {/* </div> */}
        </section>
      </main>

      <Footer />
    </div>
  )
}

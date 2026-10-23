import { Link, useNavigate } from 'react-router-dom'
import { Navbar, Footer } from './components'
import aiHeroImg from './assets/course-ai.jpg'

export default function AIMarketing() {
  const navigate = useNavigate()

  const aiPrograms = [
    {
      id: 'digital-marketing-fundamentals',
      title: 'Digital Marketing Fundamentals',
      tagline: 'Learn the core concepts and strategies to grow brands online.',
      iconBg: 'bg-indigo-600',
      badgeColor: 'text-indigo-600 bg-indigo-50',
      borderColor: 'border-indigo-200',
      btnColor: 'bg-indigo-600 hover:bg-indigo-700',
      role: 'Digital Marketing Executive / Specialist',
      responsibilities: [
        'Manage social media & ad campaigns',
        'Create and optimize content',
        'Track performance & generate reports',
        'Work on SEO, email and paid marketing',
      ],
      salaryMonth: '₹15,000 – ₹40,000',
      salaryExp: '₹4 LPA – ₹8 LPA',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'seo-content-strategy',
      title: 'SEO & Content Strategy',
      tagline: 'Get found. Drive traffic. Build brands.',
      iconBg: 'bg-emerald-600',
      badgeColor: 'text-emerald-600 bg-emerald-50',
      borderColor: 'border-emerald-200',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700',
      role: 'SEO Specialist / Content Strategist',
      responsibilities: [
        'Keyword research & on-page/off-page SEO',
        'Create optimized content (blogs, articles, etc.)',
        'Analyze website performance',
        'Build backlinks & improve rankings',
      ],
      salaryMonth: '₹20,000 – ₹50,000',
      salaryExp: '₹4 LPA – ₹10 LPA',
      image: 'https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'social-media-marketing',
      title: 'Social Media Marketing',
      tagline: 'Create content. Build communities. Turn followers into customers.',
      iconBg: 'bg-rose-500',
      badgeColor: 'text-rose-600 bg-rose-50',
      borderColor: 'border-rose-200',
      btnColor: 'bg-rose-500 hover:bg-rose-600',
      role: 'Social Media Manager / Executive',
      responsibilities: [
        'Plan and create engaging content',
        'Manage brand accounts & communities',
        'Run ad campaigns & track results',
        'Analyze engagement and growth',
      ],
      salaryMonth: '₹15,000 – ₹35,000',
      salaryExp: '₹3 LPA – ₹7 LPA',
      image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'ai-tools-automation',
      title: 'AI Tools & Automation',
      tagline: 'Work smarter. Save time. Boost results.',
      iconBg: 'bg-blue-600',
      badgeColor: 'text-blue-600 bg-blue-50',
      borderColor: 'border-blue-200',
      btnColor: 'bg-blue-600 hover:bg-blue-700',
      role: 'AI Tools Specialist / Marketing Automation Assistant',
      responsibilities: [
        'Use AI tools for content, design and research',
        'Automate repetitive marketing tasks',
        'Analyze data and improve efficiency',
        'Support campaign planning and execution',
      ],
      salaryMonth: '₹18,000 – ₹45,000',
      salaryExp: '₹4 LPA – ₹9 LPA',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    },
  ]

  const handleEnroll = (programTitle) => {
    navigate(`/register?course=${encodeURIComponent(`AI & Digital Marketing - ${programTitle}`)}`)
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
          <span className="text-gray-900 font-semibold">AI & Digital Marketing</span>
        </div>

        {/* Hero Section */}
        <section className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-10">
          <div className="bg-gradient-to-r from-indigo-50/90 via-purple-50/50 to-white rounded-3xl border border-indigo-100 shadow-sm p-6 sm:p-8 lg:p-10 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">🤖</span>
                  AI & DIGITAL MARKETING COURSES
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-[#1a2b49] tracking-tight leading-tight mb-3">
                  Learn Today, Lead Tomorrow
                </h1>

                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-5 max-w-xl">
                  Gain in-demand skills in AI and digital marketing, and build a career in the fast-growing online world. From content creation to automation, our courses help you stay ahead, get certified and achieve your goals.
                </p>

                {/* 4 Pillars */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
                  <div className="p-2.5 bg-white/95 rounded-xl border border-indigo-100/80 text-center shadow-xs">
                    <span className="text-xl block mb-0.5">💻</span>
                    <span className="text-[11px] font-bold text-gray-800 leading-tight">Hands-on Training</span>
                  </div>
                  <div className="p-2.5 bg-white/95 rounded-xl border border-indigo-100/80 text-center shadow-xs">
                    <span className="text-xl block mb-0.5">🧑‍💻</span>
                    <span className="text-[11px] font-bold text-gray-800 leading-tight">Industry Expert Faculty</span>
                  </div>
                  <div className="p-2.5 bg-white/95 rounded-xl border border-indigo-100/80 text-center shadow-xs">
                    <span className="text-xl block mb-0.5">🌐</span>
                    <span className="text-[11px] font-bold text-gray-800 leading-tight">Global Career Opps</span>
                  </div>
                  <div className="p-2.5 bg-white/95 rounded-xl border border-indigo-100/80 text-center shadow-xs">
                    <span className="text-xl block mb-0.5">🚀</span>
                    <span className="text-[11px] font-bold text-gray-800 leading-tight">Placement Support</span>
                  </div>
                </div>

                {/* Free Stay Notice */}
                {/* <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold">
                  <span>🏠</span>
                  <span>Free Hostel Accommodation Allotted (Zero Rent / कोई किराया नहीं)</span>
                </div> */}
              </div>

              {/* Right Hero Image */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-white aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-80">
                  <img
                    src={aiHeroImg}
                    alt="AI and Digital Marketing Professional"
                    className="w-full h-full object-cover object-center"
                  />
                  {/* <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-indigo-100 text-right">
                    <span className="text-xs font-black text-indigo-900 block">
                      Build Your Digital Future ↗
                    </span>
                    <span className="text-[9px] text-gray-400 font-semibold">CREATE • MARKET • ANALYZE</span>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sub-Courses Heading */}
        <section className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 mt-4 mb-8 text-center">
          <h2 className="text-xl sm:text-3xl font-extrabold text-[#1a2b49] tracking-tight mb-1.5">
            Explore Our AI & Digital Marketing Courses
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm max-w-xl mx-auto">
            Choose your path and gain the skills to build a successful career in the digital world.
          </p>
          <div className="w-10 h-1 bg-indigo-600 rounded-full mx-auto mt-2.5" />
        </section>

        {/* 4 Cards Grid */}
        <section className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {aiPrograms.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${p.iconBg} text-white flex items-center justify-center text-xl shadow-xs`}>
                        🤖
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
                          <span className="text-indigo-600 font-bold">✔</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Salary Box */}
                  <div className="p-3 bg-gradient-to-r from-indigo-50/60 to-purple-50/60 rounded-xl border border-indigo-100/70 mb-4 flex items-center justify-between text-xs">
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
                      <span className="text-xs font-bold text-indigo-700">
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
          {/* <div className="bg-gradient-to-r from-[#312e81] via-[#3730a3] to-[#4338ca] rounded-2xl p-5 sm:p-7 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4"> */}
            {/* <div className="flex items-center gap-3"> */}
              {/* <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-xl flex-shrink-0">
                📊
              </div>
              <div>
                <h3 className="text-base sm:text-xl font-extrabold tracking-tight">
                  Your Digital Career Starts Here
                </h3>
                <p className="text-white/80 text-xs mt-0.5">
                  Build in-demand skills in AI and digital marketing, get certified and step into a future full of opportunities.
                </p>
              </div> */}
            {/* </div> */}

            {/* <button
              onClick={() => navigate('/register?course=AI%20%26%20Digital%20Marketing%20Course')}
              className="px-5 py-2.5 bg-white text-indigo-950 hover:bg-indigo-50 font-black rounded-xl text-xs shadow transition whitespace-nowrap cursor-pointer"
            >
              Explore All AI & Digital Marketing Courses →
            </button>
          </div> */}
        </section>
      </main>

      <Footer />
    </div>
  )
}

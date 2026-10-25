import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Footer } from './components'

// ─── HERO SLIDER IMAGES ────────────────────────────────────────────────────────
import myImage1 from './assets/my-slide1.png'
import myImage2 from './assets/my-slide2.png'
import myImage3 from './assets/my-slide3.png'
import myImage4 from './assets/my-slide4.png'
const slides = [
  { image: myImage1, title: 'Course 1' },
  { image: myImage2, title: 'Course 2' },
  { image: myImage3, title: 'Course 3' },
  { image: myImage4, title: 'Course 4' },
]

// ─── HERO SECTION ─────────────────────────────────────────────────────────────
function Hero() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  const hasSlides = slides && slides.length > 0

  const goTo = useCallback((idx) => {
    if (!hasSlides || animating) return
    setAnimating(true)
    setTimeout(() => {
      setCurrent(idx)
      setAnimating(false)
    }, 350)
  }, [animating, hasSlides])

  const next = useCallback(() => {
    if (!hasSlides) return
    goTo((current + 1) % slides.length)
  }, [current, goTo, hasSlides])

  const prev = useCallback(() => {
    if (!hasSlides) return
    goTo((current - 1 + slides.length) % slides.length)
  }, [current, goTo, hasSlides])

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (!hasSlides || isPaused) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next, isPaused, hasSlides])

  const minSwipeDistance = 50
  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }
  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    if (distance > minSwipeDistance) {
      next()
    } else if (distance < -minSwipeDistance) {
      prev()
    }
  }

  // Graceful placeholder if no slides
  if (!hasSlides) {
    return (
      <section className="relative w-full pt-14 2xl:pt-16 bg-gradient-to-b from-slate-900 to-slate-950 text-white select-none">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="p-8 sm:p-12 border-2 border-dashed border-blue-500/40 rounded-3xl bg-white/5 backdrop-blur-xs shadow-lg">
            <div className="text-4xl mb-3">🖼️</div>
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
              Hero Slider Area (Images Removed)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mb-4 leading-relaxed">
              Slide images remove kar di gayi hain. Aap jab chahein <code className="bg-blue-900/60 text-blue-200 px-2 py-0.5 rounded font-mono text-xs">src/home.jsx</code> me <code className="bg-blue-900/60 text-blue-200 px-2 py-0.5 rounded font-mono text-xs">slides</code> array ke andar apni images add kar sakte hain.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      className="relative w-full pt-14 2xl:pt-16 bg-slate-950 overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* 
        Responsive container:
        • Laptop (< 1536px, e.g. 1366x768, 1440x900): Restored to the exact original compact height 
          (sm:h-[65vh] lg:h-[72vh] min-h-[210px] max-h-[560px]) so slides are not zoomed in or cut off.
        • Desktop (>= 1536px, 2xl:, e.g. 1920x1080 & 2560px): Grand full viewport height 
          (2xl:h-[calc(100vh-4rem)] 2xl:min-h-[780px] 2xl:max-h-[1440px]) as requested.
      */}
      <div className="relative w-full aspect-[2.35/1] sm:aspect-[2.35/1] md:aspect-[2.35/1] lg:aspect-[2.35/1] xl:aspect-[2.35/1] max-h-[820px] 2xl:max-h-[calc(100vh-4rem)] overflow-hidden select-none bg-slate-950">
        {slides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              i === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={s.image}
              alt={s.title || `slide-${i + 1}`}
              loading={i === 0 ? 'eager' : 'lazy'}
              className="w-full h-full object-cover object-center select-none"
            />
          </div>
        ))}

        {/* Sleek bottom controls: Prev/Next buttons integrated alongside dots so slide text is NEVER covered */}
        {slides.length > 1 && (
          <>
            <div className="absolute bottom-2 sm:bottom-4 2xl:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-3 bg-black/60 backdrop-blur-md px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full border border-white/20 shadow-xl">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  prev()
                }}
                aria-label="Previous slide"
                className="w-5 h-5 sm:w-7 sm:h-7 2xl:w-8 2xl:h-8 rounded-full bg-white/20 hover:bg-white/40 active:scale-90 text-white flex items-center justify-center text-xs sm:text-base font-black transition cursor-pointer"
              >
                ‹
              </button>

              <div className="flex items-center gap-1 sm:gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      goTo(i)
                    }}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      i === current
                        ? 'w-4 sm:w-7 2xl:w-9 h-1.5 sm:h-2 2xl:h-2.5 bg-sky-400 shadow-xs'
                        : 'w-1.5 sm:w-2 2xl:w-2.5 h-1.5 sm:h-2 2xl:h-2.5 bg-white/60 hover:bg-white'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  next()
                }}
                aria-label="Next slide"
                className="w-5 h-5 sm:w-7 sm:h-7 2xl:w-8 2xl:h-8 rounded-full bg-white/20 hover:bg-white/40 active:scale-90 text-white flex items-center justify-center text-xs sm:text-base font-black transition cursor-pointer"
              >
                ›
              </button>
            </div>

            {/* Slide counter */}
            <div className="hidden sm:block absolute bottom-4 2xl:bottom-6 right-4 2xl:right-8 z-20 text-white/80 text-xs 2xl:text-sm font-semibold bg-black/45 backdrop-blur-md px-2.5 sm:px-3 2xl:px-4 py-1 2xl:py-1.5 rounded-full border border-white/15">
              {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

// ─── STATS SECTION ────────────────────────────────────────────────────────────
function Stats() {
  const stats = [
    { icon: '👨‍🎓', number: '5000+', label: 'Students Enrolled' },
    { icon: '📚', number: '4+', label: 'Courses Available' },
    { icon: '👨‍🏫', number: '7+', label: 'Expert Instructors' },
    { icon: '🏆', number: '5+', label: 'Years of Excellence' },
  ]

  const marqueeItems = [...stats, ...stats, ...stats]

  return (
    <section
      className="py-4 sm:py-5 2xl:py-8 border-y border-blue-100/80 overflow-hidden select-none"
      style={{ backgroundColor: 'rgb(237, 243, 255)' }}
    >
      <marquee
        behavior="scroll"
        direction="left"
        scrollamount="7"
        onMouseEnter={(e) => e.currentTarget.stop()}
        onMouseLeave={(e) => e.currentTarget.start()}
        className="cursor-pointer"
      >
        <div className="inline-flex items-center gap-12 sm:gap-20 2xl:gap-36 py-1">
          {marqueeItems.map((stat, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-4 sm:gap-4 2xl:gap-5 px-2"
            >
              <span className="text-3xl sm:text-4xl 2xl:text-5xl">{stat.icon}</span>
              <div className="text-left">
                <div className="text-xl sm:text-3xl 2xl:text-5xl font-extrabold text-blue-950 leading-tight">
                  {stat.number}
                </div>
                <div className="text-blue-800 font-bold text-xs sm:text-sm 2xl:text-lg whitespace-nowrap">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </marquee>
    </section>
  )
}

// ─── FEATURES SECTION ─────────────────────────────────────────────────────────
function Features() {
  const features = [
    {
      icon: '🎥',
      title: 'Live & Recorded Classes',
      desc: 'Attend live interactive sessions or watch recorded lectures at your own pace anytime, anywhere.',
      color: 'bg-blue-50 border-blue-100',
      iconBg: 'bg-blue-100',
    },
    {
      icon: '📜',
      title: 'Govt. Recognized Certificates',
      desc: 'Earn certificates that are recognized by leading institutions and employers across India.',
      color: 'bg-indigo-50 border-indigo-100',
      iconBg: 'bg-indigo-100',
    },
    {
      icon: '🧑‍💻',
      title: 'Expert Faculty',
      desc: 'Learn from highly qualified and experienced educators with proven track records.',
      color: 'bg-purple-50 border-purple-100',
      iconBg: 'bg-purple-100',
    },
    {
      icon: '📱',
      title: 'Learn on Any Device',
      desc: 'Access your courses seamlessly on mobile, tablet, or desktop — fully responsive platform.',
      color: 'bg-green-50 border-green-100',
      iconBg: 'bg-green-100',
    },
    {
      icon: '🤝',
      title: 'Placement Assistance',
      desc: 'Get dedicated support with job placement, resume building, and interview preparation.',
      color: 'bg-orange-50 border-orange-100',
      iconBg: 'bg-orange-100',
    },
    {
      icon: '💰',
      title: 'Affordable Fee Structure',
      desc: 'Quality education at pocket-friendly prices with flexible EMI options available.',
      color: 'bg-teal-50 border-teal-100',
      iconBg: 'bg-teal-100',
    },
  ]

  return (
    <section className="py-8 sm:py-14 2xl:py-24 bg-white">
      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="text-center mb-8 2xl:mb-16">
          <span className="text-blue-600 font-semibold text-sm 2xl:text-base uppercase tracking-widest">
            Why Choose Us
          </span>
          <h2 className="text-2xl sm:text-3xl 2xl:text-5xl font-extrabold text-gray-900 mt-1 mb-2.5 2xl:mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-gray-500 max-w-xl 2xl:max-w-3xl mx-auto text-xs sm:text-sm 2xl:text-lg">
            We provide a complete learning ecosystem that empowers every student to reach their full potential.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 2xl:gap-10">
          {features.map((f) => (
            <div
              key={f.title}
              className={`p-4 sm:p-6 2xl:p-9 rounded-2xl 2xl:rounded-3xl border-2 ${f.color} hover:shadow-lg transition-all duration-300 group`}
            >
              <div
                className={`w-11 h-11 2xl:w-16 2xl:h-16 ${f.iconBg} rounded-xl 2xl:rounded-2xl flex items-center justify-center text-xl 2xl:text-3xl mb-3 2xl:mb-4 group-hover:scale-110 transition-transform`}
              >
                {f.icon}
              </div>
              <h3 className="text-base 2xl:text-2xl font-bold text-gray-800 mb-1.5">{f.title}</h3>
              <p className="text-gray-500 text-xs 2xl:text-base leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
function Testimonials() {
  const testimonials = [
    {
      name: 'Rahul Sharma',
      role: 'DCA Graduate, 2024',
      text: 'The Prime Careers changed my life! The DCA course was well-structured and the faculty was extremely helpful. I got placed in a good company within 2 months of completing the course.',
      avatar: 'RS',
      rating: 5,
      color: 'bg-blue-600',
    },
    {
      name: 'Priya Singh',
      role: 'Web Dev Student',
      text: 'The Full Stack Development course is absolutely brilliant. Live classes are very interactive and the doubt sessions are very helpful. Highly recommend to everyone!',
      avatar: 'PS',
      rating: 5,
      color: 'bg-pink-500',
    },
    {
      name: 'Amit Kumar',
      role: 'Tally Course, 2023',
      text: 'I learned Tally with GST here and now I handle accounts for a CA firm. The practical approach and real-world examples made learning very easy and effective.',
      avatar: 'AK',
      rating: 5,
      color: 'bg-green-600',
    },
  ]

  return (
    <section className="py-12 2xl:py-24 bg-white">
      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="text-center mb-8 2xl:mb-16">
          <span className="text-blue-600 font-semibold text-sm 2xl:text-base uppercase tracking-widest">
            Student Reviews
          </span>
          <h2 className="text-2xl sm:text-3xl 2xl:text-5xl font-extrabold text-gray-900 mt-1 mb-2.5">
            What Our Students Say
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 2xl:gap-10">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-gray-50 rounded-2xl 2xl:rounded-3xl p-5 sm:p-6 2xl:p-9 border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg 2xl:text-2xl">★</span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm 2xl:text-lg leading-relaxed mb-6 italic">"{t.text}"</p>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 2xl:w-14 2xl:h-14 ${t.color} rounded-full flex items-center justify-center text-white font-bold text-sm 2xl:text-lg`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm 2xl:text-lg">{t.name}</p>
                  <p className="text-gray-400 text-xs 2xl:text-sm">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA BANNER ───────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <section className="py-8 sm:py-12 2xl:py-24 relative overflow-hidden bg-[rgb(237,243,255)]">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 2xl:w-96 2xl:h-96 bg-black rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-48 2xl:w-80 2xl:h-80 bg-white rounded-full blur-2xl"></div>
      </div>
      <div className="max-w-4xl 2xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 text-center relative z-10">
        <h2 className="text-xl sm:text-2xl 2xl:text-5xl font-extrabold text-black mb-2 2xl:mb-4">
          Start Your Learning Journey Today!
        </h2>
        <p className="text-gray-700 text-xs sm:text-sm 2xl:text-lg mb-6 2xl:mb-8 max-w-xl 2xl:max-w-3xl mx-auto leading-relaxed">
          Join over 5000+ students who have transformed their careers with The prime Careers. 
          Enroll now and take the first step towards your dream career.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 2xl:gap-5 justify-center max-w-xs sm:max-w-none mx-auto">
          <Link
            to="/courses"
            className="w-full sm:w-auto px-6 py-2.5 sm:py-3 2xl:px-10 2xl:py-4.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl 2xl:rounded-2xl hover:shadow-md transition-all text-xs sm:text-sm 2xl:text-lg text-center"
          >
            Browse Courses
          </Link>
          <Link
            to="/contact"
            className="w-full sm:w-auto px-6 py-2.5 sm:py-3 2xl:px-10 2xl:py-4.5 bg-white text-blue-700 font-bold rounded-xl 2xl:rounded-2xl border border-blue-200 hover:bg-blue-50 transition-all text-xs sm:text-sm 2xl:text-lg text-center"
          >
            Talk to Counselor
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── HOME PAGE (Main Export) ───────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <Testimonials />
      <CTABanner />
      <Footer />
    </>
  )
}

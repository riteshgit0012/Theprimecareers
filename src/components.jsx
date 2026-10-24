import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import brandCrest from './assets/brand-crest.png'

// ─── SHARED NAVBAR ────────────────────────────────────────────────────────────
export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Our Courses', path: '/courses' },
    { name: 'FAQs', path: '/faqs' },
    { name: 'Contact', path: '/contact' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-md shadow-sm'
      }`}
    >
      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="flex items-center justify-between h-14 2xl:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 2xl:gap-3 group">
            <img
              src={brandCrest}
              alt="The Prime Career Logo"
              className="w-9 h-9 sm:w-10 sm:h-10 2xl:w-12 2xl:h-12 object-contain transition-transform duration-200 group-hover:scale-105 filter drop-shadow-sm"
            />
            <div className="leading-tight">
              <span className="text-blue-700 font-extrabold text-base 2xl:text-xl tracking-tight">The</span>
              <span className="text-indigo-500 font-extrabold text-base 2xl:text-xl tracking-tight"> Prime Career</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 2xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 2xl:px-4 2xl:py-2 rounded-lg 2xl:rounded-xl text-xs 2xl:text-base font-semibold transition-all duration-200 ${
                  location.pathname === link.path
                    ? 'text-blue-700 bg-blue-50 font-bold'
                    : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-2 2xl:gap-3">
            <Link
              to="/login"
              className="px-3 py-1.5 2xl:px-4 2xl:py-2 text-xs 2xl:text-base font-semibold text-blue-700 border border-blue-600 rounded-lg 2xl:rounded-xl hover:bg-blue-50 transition-all duration-200"
            >
              Login
            </Link>
            {/* Online Admission text link with green & red blinking animation & tilted stylish angle */}
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 px-2 py-1 text-xs 2xl:text-base font-extrabold animate-blink-green-red transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer transform -rotate-3 hover:-rotate-1"
              title="Apply for Online Admission"
            >
              {/* <span className="text-sm 2xl:text-lg transform -rotate-12">
                ✈
              </span> */}
              <span className="font-extrabold tracking-wide italic inline-block">
                Online Admission
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-gray-100">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-3 text-sm font-semibold rounded-lg mb-1 transition-all ${
                  location.pathname === link.path
                    ? 'text-blue-700 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex gap-3 mt-3 px-4">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex-1 py-2 text-sm font-semibold text-blue-700 border-2 border-blue-600 rounded-lg hover:bg-blue-50 text-center"
              >
                Login
              </Link>
              
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="flex-1 py-2 text-sm font-extrabold animate-blink-green-red text-center flex items-center justify-center gap-1.5 hover:scale-105 transition-transform transform -rotate-2 italic"
              >
                <span className="text-base transform -rotate-12">✈</span>
                <span>Online Admission</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// ─── SHARED FOOTER ────────────────────────────────────────────────────────────
export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-9 2xl:px-12 py-10 2xl:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 2xl:gap-12">
          {/* Brand Tag: Big Emblem Icon + "The Prime Careers" text underneath */}
          <div className="pl-0 sm:pl-1 2xl:pl-1.5 -mt-1 sm:-mt-2">
            <Link
              to="/"
              className="inline-flex flex-col items-center group mb-3.5 -ml-0.5 sm:-ml-1"
              title="The Prime Careers"
            >
              {/* Crest Icon - Big and fully responsive */}
              <img
                src={brandCrest}
                alt="The Prime Careers Official Crest"
                className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-30 lg:h-30 2xl:w-44 2xl:h-44 object-contain filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-all duration-300 mb-2"
              />
              {/* Title underneath the icon */}
              <span className="text-white font-serif font-bold text-sm sm:text-base 2xl:text-lg tracking-widest uppercase text-center group-hover:text-amber-200 transition-colors whitespace-nowrap">
                The Prime Careers
              </span>
            </Link>
            <p className="text-xs 2xl:text-sm text-gray-400 leading-relaxed mb-3">
              Empowering students with quality education and skill-based training since 2009.
            </p>
            {/* Social Media Links with Official SVG Icons */}
            <div className="flex gap-2.5 items-center mt-1">
              {[
                {
                  title: 'Facebook',
                  href: '#',
                  hoverBg: 'hover:bg-[#1877F2]',
                  icon: (
                    <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  ),
                },
                {
                  title: 'LinkedIn',
                  href: '#',
                  hoverBg: 'hover:bg-[#0A66C2]',
                  icon: (
                    <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  ),
                },
                {
                  title: 'YouTube',
                  href: '#',
                  hoverBg: 'hover:bg-[#FF0000]',
                  icon: (
                    <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  ),
                },
                {
                  title: 'Twitter / X',
                  href: '#',
                  hoverBg: 'hover:bg-black',
                  icon: (
                    <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                },
              ].map((s) => (
                <a
                  key={s.title}
                  href={s.href}
                  title={s.title}
                  aria-label={s.title}
                  className={`w-8 h-8 rounded-lg bg-gray-800 text-gray-400 ${s.hoverBg} hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-1.5">
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/about' },
                { name: 'Courses', path: '/courses' },
                { name: 'FAQs', path: '/faqs' },
                { name: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-xs text-gray-400 hover:text-blue-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Courses */}
          <div>
            <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Popular Courses</h4>
            <ul className="space-y-1.5">
              {['Aviation Course', 'Tour & Travel', 'Maritime & Hotel', 'AI & Digital Marketing'].map(
                (course) => (
                  <li key={course}>
                    <Link to="/courses" className="text-xs text-gray-400 hover:text-blue-400 transition-colors">
                      {course}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="flex items-start gap-2">
                <span className="mt-0.5">📍</span>
                <span>01, H-44, Sector 63, Noida - 201301 , Uttar Pradesh</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <a href="tel:+919876543210" className="hover:text-blue-400 transition-colors">
                  +91 72379 48936
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span>
                <a href="mailto:theprimecareers@gmail.com" className="hover:text-blue-400 transition-colors">
                  theprimecareers@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>🕐</span>
                <span>Mon–Sat: 9:00 AM – 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      {/* <div className="border-t border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>© 2024 The prime Careers. All rights reserved.</p>
          <p>Designed with ❤️ for Students of India</p>
        </div>
      </div> */}
    </footer>
  )
}

// ─── FLOATING WHATSAPP & CALL BUTTONS ──────────────────────────────────────────
export function FloatingContactButtons() {
  const location = useLocation()
  if (location.pathname === '/admin' || location.pathname === '/login') {
    return null
  }

  const phone = '7237948936'
  const whatsappUrl = `https://wa.me/91${phone}?text=Hello%20The%20Prime%20Careers%2C%20I%20am%20interested%20in%20your%20courses.`
  const callUrl = `tel:+91${phone}`

  return (
    <div
      className="fixed bottom-5 right-4 sm:bottom-7 sm:right-6 z-50 flex flex-col items-center gap-3 select-none"
      aria-label="Direct Contact Actions"
    >
      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        title="WhatsApp"
        className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
      >
        {/* Animated pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />
        <span className="absolute -inset-1 rounded-full border-2 border-[#25D366]/40 pointer-events-none" />

        {/* WhatsApp Icon */}
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 fill-white relative z-10"
          viewBox="0 0 24 24"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      </a>

      {/* Call Button */}
      <a
        href={callUrl}
        aria-label="Call"
        title="Call"
        className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#f59e0b] hover:bg-[#ea580c] text-white flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
      >
        <span className="absolute -inset-1 rounded-full border-2 border-[#f59e0b]/40 pointer-events-none" />

        {/* Phone Receiver Icon */}
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 fill-white relative z-10"
          viewBox="0 0 24 24"
        >
          <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
        </svg>
      </a>
    </div>
  )
}

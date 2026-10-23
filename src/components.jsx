import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import planeLogo from './assets/plane-logo.png'

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
      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 lg:gap-3 group">
            <img
              src={planeLogo}
              alt="The Prime Career Logo"
              className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <div className="leading-tight">
              <span className="text-blue-700 font-extrabold text-base sm:text-lg lg:text-xl tracking-tight">The</span>
              <span className="text-indigo-500 font-extrabold text-base sm:text-lg lg:text-xl tracking-tight"> Prime Career</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 lg:px-3.5 lg:py-2 rounded-lg lg:rounded-xl text-xs lg:text-sm xl:text-base font-semibold transition-all duration-200 ${
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
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <Link
              to="/login"
              className="px-3 py-1.5 lg:px-4 lg:py-2 text-xs lg:text-sm xl:text-base font-semibold text-blue-700 border border-blue-600 rounded-lg lg:rounded-xl hover:bg-blue-50 transition-all duration-200"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-3.5 py-1.5 lg:px-5 lg:py-2 text-xs lg:text-sm xl:text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg lg:rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-xs hover:shadow-md transition-all duration-200"
            >
              Enroll Now
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
                className="flex-1 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-center"
              >
                Enroll Now
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
      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 lg:py-16 xl:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10 xl:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3.5">
              <img src={planeLogo} alt="The Prime Career Logo" className="w-8 h-8 lg:w-10 lg:h-10 object-contain" />
              <div>
                <span className="text-white font-extrabold text-base lg:text-lg xl:text-xl">The</span>
                <span className="text-blue-400 font-extrabold text-base lg:text-lg xl:text-xl"> Prime Career</span>
              </div>
            </div>
            <p className="text-xs lg:text-sm text-gray-400 leading-relaxed mb-4">
              Empowering students with quality education and skill-based training since 2009.
            </p>
            <div className="flex gap-2">
              {[
                { label: 'f', title: 'Facebook' },
                { label: 'in', title: 'LinkedIn' },
                { label: 'yt', title: 'YouTube' },
                { label: 'tw', title: 'Twitter' },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  title={s.title}
                  className="w-7 h-7 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center text-[11px] font-bold transition-colors"
                >
                  {s.label}
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
                <span>J9HG+JM3 Noida , Uttar Pradesh</span>
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

import { useState } from 'react'
import { Navbar, Footer } from './components'

function ContactHero() {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-white relative overflow-hidden">
      <div className="absolute top-10 right-0 w-72 h-72 bg-indigo-100 rounded-full opacity-40 blur-3xl"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">Get In Touch</span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-3">
          We'd Love to{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Hear From You
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
          Have questions about our courses? Want to enroll? Our team is ready to help you take the next step.
        </p>
      </div>
    </section>
  )
}

function ContactMain() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const contactInfo = [
    {
      icon: '📍',
      title: 'Visit Us',
      lines: ['J9HG+JM3 Noida , Uttar Pradesh - 231301'],
      color: 'bg-blue-50 border-blue-100',
      iconBg: 'bg-blue-100',
    },
    {
      icon: '📞',
      title: 'Call Us',
      lines: ['++91 72379 48936'],
      color: 'bg-green-50 border-green-100',
      iconBg: 'bg-green-100',
    },
    {
      icon: '✉️',
      title: 'Email Us',
      lines: ['theprimecareers@gmail.com'],
      color: 'bg-indigo-50 border-indigo-100',
      iconBg: 'bg-indigo-100',
    },
    {
      icon: '🕐',
      title: 'Working Hours',
      lines: ['Monday – Saturday', '9:00 AM – 6:00 PM'],
      color: 'bg-orange-50 border-orange-100',
      iconBg: 'bg-orange-100',
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info) => (
            <div
              key={info.title}
              className={`p-6 rounded-2xl border-2 ${info.color} text-center hover:shadow-lg transition-all duration-300`}
            >
              <div className={`w-12 h-12 ${info.iconBg} rounded-xl flex items-center justify-center text-2xl mx-auto mb-3`}>
                {info.icon}
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{info.title}</h3>
              {info.lines.map((line, i) => (
                <p key={i} className="text-gray-500 text-sm">{line}</p>
              ))}
            </div>
          ))}
        </div>

        {/* Form + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Send Us a Message</h2>
            <p className="text-gray-500 text-sm mb-6">Fill in the form and we'll get back to you within 24 hours.</p>

            {submitted ? (
              <div className="text-center py-10">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Message Sent!</h3>
                <p className="text-gray-500 text-sm">
                  Thank you for reaching out. Our team will contact you shortly.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }) }}
                  className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm text-gray-600"
                  >
                    <option value="">Select a topic</option>
                    <option>Course Enquiry</option>
                    <option>Admission Process</option>
                    <option>Fee Structure</option>
                    <option>Placement Support</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Write your message here..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white text-sm resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Send Message →
                </button>
              </form>
            )}
          </div>

          {/* Google Maps Location */}
          <div className="flex flex-col h-full">
            <div className="flex-1 w-full rounded-3xl overflow-hidden shadow-xl border-2 border-slate-200 min-h-[380px] bg-slate-100 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3502.0248746133225!2d77.37410357550074!3d28.629016575666576!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjjCsDM3JzQ0LjUiTiA3N8KwMjInMzYuMCJF!5e0!3m2!1sen!2sin!4v1792732871080!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '380px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Office Location Map"
                className="w-full h-full min-h-[380px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Contact() {
  return (
    <>
      <Navbar />
      <ContactHero />
      <ContactMain />
      <Footer />
    </>
  )
}

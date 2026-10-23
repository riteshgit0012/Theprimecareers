import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Footer } from './components'

const faqData = [
  {
    category: 'Admission & Enrollment',
    icon: '📋',
    faqs: [
      {
        q: 'How can I enroll in a course at The prime Careers?',
        a: 'You can enroll by visiting our center directly, calling us at +91 98765 43210, or by filling out the contact form on our website. Our counselors will guide you through the admission process.',
      },
      {
        q: 'What is the minimum qualification required for admission?',
        a: 'Most of our computer and skill courses require a minimum of 10th pass. Some advanced courses may require 12th or graduation. Our counselors will help you choose the right course based on your qualification.',
      },
      {
        q: 'Is there an entrance exam for admission?',
        a: 'No, there is no entrance exam. Admissions are based on your educational qualification and a simple counseling session to understand your goals.',
      },
      {
        q: 'Can I enroll online or do I need to visit in person?',
        a: 'You can start the enrollment process online by filling our contact form. However, document verification and fee submission may require a one-time visit to our center.',
      },
    ],
  },
  {
    category: 'Courses & Curriculum',
    icon: '📚',
    faqs: [
      {
        q: 'What types of courses does The prime Careers offer?',
        a: 'We offer a wide range of courses including Computer Applications, Programming, Digital Marketing, Graphic Design, Tally with GST, Ethical Hacking, and many more. All courses are designed to provide practical, job-ready skills.',
      },
      {
        q: 'Are the courses available online or only offline?',
        a: 'We offer both modes — offline (at our centers) and online (live classes via our platform). Some courses also have hybrid options combining both.',
      },
      {
        q: 'How are the classes conducted?',
        a: 'Classes are conducted by expert faculty through live interactive sessions. Recorded lectures are also available for revision. Regular assessments and practical sessions ensure complete learning.',
      },
      {
        q: 'Can I switch courses after enrollment?',
        a: 'Yes, you can switch to a different course within the first 7 days of enrollment. Please contact our counselors for assistance with the transfer process.',
      },
    ],
  },
  {
    category: 'Fee & Payment',
    icon: '💰',
    faqs: [
      {
        q: 'What is the fee structure?',
        a: 'Fees vary by course, starting from ₹2,000 for short-term programs to ₹20,000 for advanced long-term courses. You can check individual course fees on our Courses page or contact us for a detailed fee structure.',
      },
      {
        q: 'Is EMI or installment payment available?',
        a: 'Yes! We offer flexible EMI options for courses above ₹5,000. You can pay in 2–4 easy installments without any interest. Contact our admission office for details.',
      },
      {
        q: 'Are there any scholarships available?',
        a: 'Yes, we offer merit-based scholarships for deserving students. Special discounts are also available for students from economically weaker sections. Contact us to learn more.',
      },
      {
        q: 'What is the refund policy?',
        a: 'If you withdraw within 7 days of enrollment, 75% of the fee is refunded. No refund is applicable after 7 days. The registration fee is non-refundable.',
      },
    ],
  },
  {
    category: 'Certification & Placement',
    icon: '🏆',
    faqs: [
      {
        q: 'Are the certificates recognized?',
        a: 'Yes! Our certificates are recognized by leading employers and institutions across India. Many courses offer government-recognized and industry-standard certifications.',
      },
      {
        q: 'Does The prime Careers provide placement assistance?',
        a: 'Absolutely! We provide dedicated placement support including resume building, interview preparation, and job referrals. We have tie-ups with 500+ companies across India.',
      },
      {
        q: 'What is the placement rate?',
        a: 'We have a 98% placement rate for students who complete our courses and utilize our placement services. Our alumni are working in top companies across various sectors.',
      },
      {
        q: 'How long does it take to get a certificate after course completion?',
        a: 'Certificates are issued within 15–30 days of successfully completing the course and passing the final assessment. Digital certificates are provided immediately.',
      },
    ],
  },
]

function FAQsHero() {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-white relative overflow-hidden">
      <div className="absolute top-10 right-0 w-72 h-72 bg-blue-100 rounded-full opacity-40 blur-3xl"></div>
      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 text-center">
        <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">Got Questions?</span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-3">
          Frequently Asked{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Questions
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
          Find answers to the most common questions about our courses, admissions, fees, and more.
        </p>
      </div>
    </section>
  )
}

function AccordionItem({ q, a, isOpen, onToggle }) {
  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${isOpen ? 'border-blue-200 shadow-md' : 'border-gray-100 hover:border-blue-100'}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 text-left bg-white hover:bg-blue-50/40 transition-colors"
        aria-expanded={isOpen}
      >
        <span className={`font-semibold text-sm sm:text-base leading-snug pr-4 ${isOpen ? 'text-blue-700' : 'text-gray-800'}`}>
          {q}
        </span>
        <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${isOpen ? 'bg-blue-600 text-white rotate-45' : 'bg-gray-100 text-gray-500'}`}>
          +
        </span>
      </button>
      {isOpen && (
        <div className="px-6 pb-5 bg-blue-50/30 border-t border-blue-100">
          <p className="text-gray-600 text-sm leading-relaxed pt-3">{a}</p>
        </div>
      )}
    </div>
  )
}

function FAQsList() {
  const [openItem, setOpenItem] = useState(null)

  const toggle = (key) => setOpenItem(openItem === key ? null : key)

  return (
    <section className="py-12 pb-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {faqData.map((section) => (
          <div key={section.category} className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">{section.icon}</span>
              <h2 className="text-xl font-extrabold text-gray-900">{section.category}</h2>
            </div>
            <div className="space-y-3">
              {section.faqs.map((faq, idx) => {
                const key = `${section.category}-${idx}`
                return (
                  <AccordionItem
                    key={key}
                    q={faq.q}
                    a={faq.a}
                    isOpen={openItem === key}
                    onToggle={() => toggle(key)}
                  />
                )
              })}
            </div>
          </div>
        ))}

        {/* Still have questions */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-center text-white">
          <div className="text-5xl mb-4">💬</div>
          <h3 className="text-2xl font-extrabold mb-2">Still Have Questions?</h3>
          <p className="text-blue-100 mb-6 text-sm">
            Can't find what you're looking for? Our team is happy to help you personally.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="px-8 py-3 bg-white text-blue-700 font-bold rounded-xl hover:shadow-lg hover:bg-blue-50 transition-all"
            >
              Contact Us
            </Link>
            <a
              href="tel:+919876543210"
              className="px-8 py-3 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all"
            >
              📞 Call Now
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function FAQs() {
  return (
    <>
      <Navbar />
      <FAQsHero />
      <FAQsList />
      <Footer />
    </>
  )
}

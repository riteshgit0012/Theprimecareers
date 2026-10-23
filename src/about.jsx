import { Link } from 'react-router-dom'
import { Navbar, Footer } from './components'
import aboutImg from './assets/about.jpeg'

function AboutHero() {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-white relative overflow-hidden">
      <div className="absolute top-10 right-0 w-72 h-72 bg-blue-100 rounded-full opacity-40 blur-3xl"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">About Us</span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mt-2 mb-3 leading-tight">
            Educating India's{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Next Generation
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            Since 2009, The prime Careers has been committed to delivering world-class education and
            skill development programs that transform lives and build successful careers.
          </p>
        </div>
      </div>
    </section>
  )
}

function OurStory() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Image side */}
          <div className="relative flex items-center justify-center">
            <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-br from-emerald-50/40 via-teal-50/30 to-blue-50/30 flex items-center justify-center p-2 sm:p-3 group">
              <img
                src={aboutImg}
                alt="The Prime Careers Student"
                className="w-full h-auto max-h-[460px] object-contain rounded-2xl group-hover:scale-[1.03] transition-transform duration-500"
              />
            </div>
          </div>

          {/* Content side */}
          <div>
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">Our Story</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1.5 mb-3">
              Shaping Futures Since 2009
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-3">
              The prime Careers was founded with a single mission — to make quality education accessible to every
              student in India. What started as a small computer training center has now grown into a
              full-fledged learning platform with 200+ courses.
            </p>
            <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-4">
              We believe every student deserves the best guidance. Our expert faculty, practical curriculum,
              and placement support ensure that our students don't just learn — they excel in their careers.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: '50+', label: 'Students Trained' },
                { num: '4+', label: 'Courses Offered' },
                { num: '10+', label: 'Expert Faculty' },
                { num: '99%', label: 'Placement Rate' },
              ].map((item) => (
                <div key={item.label} className="bg-blue-50 rounded-xl p-4">
                  <p className="text-2xl font-extrabold text-blue-700">{item.num}</p>
                  <p className="text-sm text-gray-500 font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Mission() {
  const cards = [
    {
      icon: '🎯',
      title: 'Our Mission',
      desc: 'To provide affordable, high-quality education that equips students with the skills needed to thrive in the modern digital economy.',
      bg: 'bg-blue-600',
    },
    {
      icon: '👁️',
      title: 'Our Vision',
      desc: 'To become India\'s most trusted learning platform by creating a generation of skilled, confident, and successful professionals.',
      bg: 'bg-indigo-600',
    },
    {
      icon: '💎',
      title: 'Our Values',
      desc: 'We stand for excellence, integrity, innovation, and student-first approach in everything we do at The prime Careers.',
      bg: 'bg-purple-600',
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">What Drives Us</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
            Mission, Vision & Values
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div
              key={card.title}
              className={`${card.bg} rounded-2xl p-8 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="text-5xl mb-5">{card.icon}</div>
              <h3 className="text-xl font-bold mb-3">{card.title}</h3>
              <p className="text-white/80 text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Team() {
  const team = [
    { name: 'Dr. Rajesh Verma', role: 'Founder & Director', emoji: '👨‍💼', exp: '20+ yrs exp' },
    { name: 'Prof. Sunita Sharma', role: 'Academic Head', emoji: '👩‍🏫', exp: '15+ yrs exp' },
    { name: 'Mr. Anil Gupta', role: 'Computer Science Faculty', emoji: '👨‍💻', exp: '12+ yrs exp' },
    { name: 'Ms. Pooja Mehta', role: 'Placement Officer', emoji: '👩‍💼', exp: '10+ yrs exp' },
  ]

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">Meet the Team</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-4">
            Our Expert Faculty
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Learn from the best — our faculty brings decades of industry and teaching experience.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member) => (
            <div
              key={member.name}
              className="text-center bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 group-hover:scale-110 transition-transform">
                {member.emoji}
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{member.name}</h3>
              <p className="text-blue-600 text-sm font-medium mb-1">{member.role}</p>
              <p className="text-gray-400 text-xs">{member.exp}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AboutCTA() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-700 to-indigo-700">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-extrabold text-white mb-4">
          Ready to Start Learning?
        </h2>
        <p className="text-blue-100 mb-8 text-lg">
          Join thousands of students who have already begun their journey with The prime Careers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/courses"
            className="px-8 py-4 bg-white text-blue-700 font-bold rounded-xl hover:shadow-lg hover:bg-blue-50 transition-all"
          >
            Explore Courses
          </Link>
          <Link
            to="/contact"
            className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function About() {
  return (
    <>
      <Navbar />
      <AboutHero />
      <OurStory />
      <Mission />
      <Team />
      <AboutCTA />
      <Footer />
    </>
  )
}

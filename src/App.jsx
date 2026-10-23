import { Routes, Route } from 'react-router-dom'
import { FloatingContactButtons } from './components'
import Home from './home'
import About from './about'
import Contact from './contact'
import Courses from './cources'
import Aviation from './aviation'
import Travel from './travel'
import Maritime from './maritime'
import AIMarketing from './aiMarketing'
import FAQs from './faqs'
import Login from './login'
import Register from './register'
import AdminDashboard from './admin'
import CourseContent from './courseContent'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/aviation" element={<Aviation />} />
        <Route path="/aviation" element={<Aviation />} />
        <Route path="/courses/travel" element={<Travel />} />
        <Route path="/travel" element={<Travel />} />
        <Route path="/courses/maritime" element={<Maritime />} />
        <Route path="/maritime" element={<Maritime />} />
        <Route path="/av3" element={<Maritime />} />
        <Route path="/courses/ai-marketing" element={<AIMarketing />} />
        <Route path="/ai-marketing" element={<AIMarketing />} />
        <Route path="/av4" element={<AIMarketing />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/classroom" element={<CourseContent />} />
        <Route path="/course-content" element={<CourseContent />} />
        <Route path="/learn" element={<CourseContent />} />
      </Routes>
      <FloatingContactButtons />
    </>
  )
}

export default App

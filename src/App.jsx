import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Services from './pages/Services.jsx'
import ClientIntake from './pages/ClientIntake.jsx'
import Contact from './pages/Contact.jsx'
import Members from './pages/Members.jsx'
import Vlog from './pages/Vlog.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/client-intake" element={<ClientIntake />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/members" element={<Members />} />
          <Route path="/vlog" element={<Vlog />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

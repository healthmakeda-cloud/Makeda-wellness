import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Services from './pages/Services.jsx'
import ServiceDetail from './pages/ServiceDetail.jsx'
import ClientIntake from './pages/ClientIntake.jsx'
import Shop from './pages/Shop.jsx'
import ShopSuccess from './pages/ShopSuccess.jsx'
import Contact from './pages/Contact.jsx'
import Members from './pages/Members.jsx'
import Vlog from './pages/Vlog.jsx'
import Admin from './pages/Admin.jsx'
import Privacy from './pages/Privacy.jsx'
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
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/client-intake" element={<ClientIntake />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/success" element={<ShopSuccess />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/members" element={<Members />} />
          <Route path="/vlog" element={<Vlog />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import VetListing from './pages/VetListing'
import VetProfile from './pages/VetProfile'
import BookAppointment from './pages/BookAppointment'
import Login from './pages/Login'
import Register from './pages/Register'
import MyAppointments from './pages/MyAppointments'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/vets" element={<VetListing />} />
              <Route path="/vets/:id" element={<VetProfile />} />
              <Route path="/book/:vetId" element={<BookAppointment />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/my-appointments" element={<MyAppointments />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

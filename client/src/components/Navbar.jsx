import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <div>
              <span className="text-xl font-bold text-green-700">PawCare</span>
              <span className="text-xs text-gray-500 block leading-none">Delhi NCR</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/vets"
              className={`text-sm font-medium transition-colors ${isActive('/vets') ? 'text-green-600' : 'text-gray-600 hover:text-green-600'}`}
            >
              Find a Vet
            </Link>
            {user && (
              <Link
                to="/my-appointments"
                className={`text-sm font-medium transition-colors ${isActive('/my-appointments') ? 'text-green-600' : 'text-gray-600 hover:text-green-600'}`}
              >
                My Appointments
              </Link>
            )}
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Hi, <strong>{user.name.split(' ')[0]}</strong></span>
                <button
                  onClick={handleLogout}
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm btn-primary"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-2">
            <Link to="/vets" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>Find a Vet</Link>
            {user && (
              <Link to="/my-appointments" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>My Appointments</Link>
            )}
            {user ? (
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">Logout</button>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="block px-4 py-2 text-sm text-green-700 font-medium hover:bg-green-50 rounded-lg" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

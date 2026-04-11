import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🐾</span>
              <span className="text-white text-lg font-bold">PawCare Delhi NCR</span>
            </div>
            <p className="text-sm text-gray-400">
              Delhi NCR's most trusted veterinary booking platform. Find verified vets across Gurugram, Noida, Delhi, Faridabad & Ghaziabad.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/vets" className="hover:text-white transition-colors">Find a Vet</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Create Account</Link></li>
              <li><Link to="/my-appointments" className="hover:text-white transition-colors">My Appointments</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Areas Served</h4>
            <ul className="space-y-1 text-sm text-gray-400">
              <li>Gurugram (Gurgaon)</li>
              <li>Noida & Greater Noida</li>
              <li>South & West Delhi</li>
              <li>East Delhi</li>
              <li>Faridabad & Ghaziabad</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-500">
          © 2025 PawCare Delhi NCR. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../utils/api'
import VetCard from '../components/VetCard'

const AREAS = ['Gurugram', 'Noida', 'South Delhi', 'Dwarka', 'Faridabad', 'Ghaziabad', 'East Delhi']
const PET_TYPES = ['Dogs', 'Cats', 'Birds', 'Rabbits', 'Reptiles', 'Guinea Pigs', 'Horses']

export default function Home() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [area, setArea] = useState('')
  const [featuredVets, setFeaturedVets] = useState([])

  useEffect(() => {
    api.get('/vets?sort=rating').then(res => setFeaturedVets(res.data.slice(0, 3))).catch(() => {})
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (area) params.set('area', area)
    navigate(`/vets?${params.toString()}`)
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="text-5xl mb-4">🐾</div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Find the Best Vets<br />
            <span className="text-green-200">Across Delhi NCR</span>
          </h1>
          <p className="text-lg md:text-xl text-green-100 mb-10 max-w-2xl mx-auto">
            Book appointments with top-rated veterinarians in Gurugram, Noida, Delhi, Faridabad &amp; Ghaziabad — instantly, online.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-xl p-3 flex flex-col md:flex-row gap-3 max-w-3xl mx-auto">
            <input
              type="text"
              placeholder="Search by vet name, specialty, or clinic..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 text-gray-800 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
            />
            <select
              value={area}
              onChange={e => setArea(e.target.value)}
              className="px-4 py-3 text-gray-700 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm bg-white"
            >
              <option value="">All Areas</option>
              {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors text-sm">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Verified Vets', value: '12+', icon: '🏥' },
              { label: 'Areas Covered', value: '7+', icon: '📍' },
              { label: 'Happy Pets', value: '5000+', icon: '🐾' },
              { label: 'Specializations', value: '10+', icon: '🔬' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-3xl mb-1">{s.icon}</div>
                <div className="text-2xl font-extrabold text-green-700">{s.value}</div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pet type quick filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Find Vets by Pet Type</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {PET_TYPES.map(pt => (
            <Link
              key={pt}
              to={`/vets?pet_type=${pt}`}
              className="flex flex-col items-center bg-white hover:bg-green-50 border border-gray-200 hover:border-green-300 rounded-xl px-6 py-4 transition-all duration-200 group"
            >
              <span className="text-3xl mb-1">
                {pt === 'Dogs' ? '🐶' : pt === 'Cats' ? '🐱' : pt === 'Birds' ? '🦜' : pt === 'Rabbits' ? '🐰' : pt === 'Reptiles' ? '🦎' : pt === 'Guinea Pigs' ? '🐹' : '🐴'}
              </span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">{pt}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Vets */}
      {featuredVets.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Top Rated Vets</h2>
            <Link to="/vets" className="text-green-600 hover:text-green-700 text-sm font-medium">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredVets.map(v => <VetCard key={v.id} vet={v} />)}
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="bg-green-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">How PawCare Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', icon: '🔍', title: 'Search & Filter', desc: 'Find vets by area, specialization, or pet type across Delhi NCR.' },
              { step: '2', icon: '📅', title: 'Pick a Slot', desc: 'Browse real-time availability and choose a convenient date and time.' },
              { step: '3', icon: '✅', title: 'Confirm & Go', desc: 'Instant booking confirmation. Just show up at the clinic.' },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-green-700 to-emerald-600 text-white py-14 text-center">
        <h2 className="text-3xl font-extrabold mb-3">Your Pet Deserves the Best Care</h2>
        <p className="text-green-100 mb-8 text-lg">Join thousands of pet owners in Delhi NCR who trust PawCare.</p>
        <Link to="/vets" className="inline-block bg-white text-green-700 font-bold px-10 py-3 rounded-xl hover:bg-green-50 transition-colors text-lg shadow-lg">
          Book an Appointment
        </Link>
      </section>
    </div>
  )
}

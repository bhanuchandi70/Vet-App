import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../utils/api'
import VetCard from '../components/VetCard'

const AREAS = ['all', 'Gurugram', 'Noida Sector 18', 'Noida Sector 62', 'Noida Extension (Greater Noida West)', 'Saket, South Delhi', 'Hauz Khas, South Delhi', 'Dwarka Sector 12', 'Dwarka Sector 23', 'Preet Vihar, East Delhi', 'Faridabad', 'Ghaziabad', 'Cyber City, Gurugram']
const PET_TYPES = ['all', 'Dogs', 'Cats', 'Birds', 'Rabbits', 'Reptiles', 'Guinea Pigs', 'Hamsters', 'Horses', 'Cattle']
const SORT_OPTIONS = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'experience', label: 'Most Experienced' },
  { value: 'fee_asc', label: 'Fee: Low to High' },
  { value: 'fee_desc', label: 'Fee: High to Low' },
]

export default function VetListing() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [vets, setVets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [area, setArea] = useState(searchParams.get('area') || 'all')
  const [petType, setPetType] = useState(searchParams.get('pet_type') || 'all')
  const [sort, setSort] = useState('rating')

  const fetchVets = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (area && area !== 'all') params.set('area', area)
      if (petType && petType !== 'all') params.set('pet_type', petType)
      params.set('sort', sort)
      const res = await api.get(`/vets?${params}`)
      setVets(res.data)
    } catch {
      setError('Failed to load vets. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [search, area, petType, sort])

  useEffect(() => {
    fetchVets()
  }, [fetchVets])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    fetchVets()
  }

  const clearFilters = () => {
    setSearch('')
    setArea('all')
    setPetType('all')
    setSort('rating')
    setSearchParams({})
  }

  const hasFilters = search || area !== 'all' || petType !== 'all'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Find a Vet in Delhi NCR</h1>
      <p className="text-gray-500 mb-6">Browse {vets.length} verified veterinarians</p>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Search vet name, clinic, specialty..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field flex-1"
          />
          <select value={area} onChange={e => setArea(e.target.value)} className="input-field md:w-56">
            {AREAS.map(a => (
              <option key={a} value={a}>{a === 'all' ? 'All Areas' : a}</option>
            ))}
          </select>
          <select value={petType} onChange={e => setPetType(e.target.value)} className="input-field md:w-44">
            {PET_TYPES.map(pt => (
              <option key={pt} value={pt}>{pt === 'all' ? 'All Pets' : pt}</option>
            ))}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} className="input-field md:w-48">
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button type="submit" className="btn-primary whitespace-nowrap">
            Search
          </button>
        </form>

        {hasFilters && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-gray-500">Active filters:</span>
            {search && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">"{search}"</span>}
            {area !== 'all' && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">{area}</span>}
            {petType !== 'all' && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">{petType}</span>}
            <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 underline ml-1">Clear all</button>
          </div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full" />
        </div>
      ) : error ? (
        <div className="text-center py-16 text-red-500">{error}</div>
      ) : vets.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No vets found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters or search term.</p>
          <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vets.map(v => <VetCard key={v.id} vet={v} />)}
        </div>
      )}
    </div>
  )
}

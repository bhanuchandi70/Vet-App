import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../utils/api'
import StarRating from '../components/StarRating'

const PET_ICONS = {
  Dogs: '🐶', Cats: '🐱', Birds: '🦜', Rabbits: '🐰',
  'Guinea Pigs': '🐹', Hamsters: '🐹', Reptiles: '🦎',
  Cattle: '🐄', Horses: '🐴', Goats: '🐐', Sheep: '🐑',
}

export default function VetProfile() {
  const { id } = useParams()
  const [vet, setVet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/vets/${id}`)
      .then(res => setVet(res.data))
      .catch(() => setError('Vet not found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="flex justify-center items-center min-h-64">
      <div className="animate-spin w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full" />
    </div>
  )

  if (error || !vet) return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">😿</div>
      <h2 className="text-xl font-bold text-gray-700">Vet not found</h2>
      <Link to="/vets" className="btn-primary mt-4 inline-block">Browse Vets</Link>
    </div>
  )

  const initials = vet.name.split(' ').slice(1, 3).map(n => n[0]).join('')

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link to="/vets" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile card */}
          <div className="card p-6">
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{vet.name}</h1>
                <p className="text-green-700 font-semibold text-lg">{vet.specialization}</p>
                <div className="mt-1">
                  <StarRating rating={vet.rating} count={vet.review_count} size="lg" />
                </div>
                <p className="text-sm text-gray-500 mt-2">{vet.qualifications}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 border-t border-gray-100 pt-5">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">{vet.experience_years}</div>
                <div className="text-xs text-gray-500">Years Exp.</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">{vet.review_count}</div>
                <div className="text-xs text-gray-500">Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">₹{vet.consultation_fee}</div>
                <div className="text-xs text-gray-500">Fee</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">{vet.slot_duration}m</div>
                <div className="text-xs text-gray-500">Per Visit</div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">About</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{vet.about}</p>
          </div>

          {/* Pet types treated */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Pets Treated</h2>
            <div className="flex flex-wrap gap-3">
              {vet.pet_types.map(pt => (
                <div key={pt} className="flex flex-col items-center bg-green-50 rounded-xl px-5 py-3">
                  <span className="text-2xl">{PET_ICONS[pt] || '🐾'}</span>
                  <span className="text-xs text-green-700 font-medium mt-1">{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          {vet.reviews?.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Patient Reviews</h2>
              <div className="space-y-4">
                {vet.reviews.map((r, i) => (
                  <div key={i} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-gray-800">{r.user_name}</span>
                      <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString('en-IN')}</span>
                    </div>
                    <StarRating rating={r.rating} />
                    {r.comment && <p className="text-sm text-gray-600 mt-1">{r.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column - Booking card */}
        <div className="space-y-4">
          <div className="card p-5 sticky top-20">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Book an Appointment</h3>

            <div className="space-y-3 text-sm mb-5">
              <div className="flex items-start gap-2 text-gray-600">
                <svg className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                </svg>
                <span>{vet.clinic_name}</span>
              </div>
              <div className="flex items-start gap-2 text-gray-600">
                <svg className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span className="text-xs leading-relaxed">{vet.address}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${vet.phone}`} className="hover:text-green-700">{vet.phone}</a>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-xs">{vet.languages}</span>
              </div>
            </div>

            {/* Available days */}
            <div className="mb-5">
              <p className="text-xs text-gray-500 mb-2">Available on:</p>
              <div className="flex flex-wrap gap-1">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => {
                  const fullMap = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' }
                  const isAvail = vet.available_days.includes(fullMap[d])
                  return (
                    <span key={d} className={`text-xs px-2 py-1 rounded ${isAvail ? 'bg-green-100 text-green-700 font-medium' : 'bg-gray-100 text-gray-400'}`}>
                      {d}
                    </span>
                  )
                })}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Consultation fee</span>
                <span className="font-bold text-gray-900">₹{vet.consultation_fee}</span>
              </div>
            </div>

            <Link
              to={`/book/${vet.id}`}
              className="block w-full btn-primary text-center"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

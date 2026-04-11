import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

const PET_TYPES = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Guinea Pig', 'Hamster', 'Reptile', 'Horse', 'Cattle', 'Other']

function getTodayString() {
  const d = new Date()
  return d.toISOString().split('T')[0]
}

function getMaxDateString() {
  const d = new Date()
  d.setDate(d.getDate() + 60)
  return d.toISOString().split('T')[0]
}

export default function BookAppointment() {
  const { vetId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [vet, setVet] = useState(null)
  const [loadingVet, setLoadingVet] = useState(true)
  const [slots, setSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const [petName, setPetName] = useState('')
  const [petType, setPetType] = useState('')
  const [petAge, setPetAge] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [reason, setReason] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    api.get(`/vets/${vetId}`)
      .then(res => setVet(res.data))
      .catch(() => setError('Vet not found'))
      .finally(() => setLoadingVet(false))
  }, [vetId])

  useEffect(() => {
    if (!date) return
    setLoadingSlots(true)
    setTime('')
    api.get(`/vets/${vetId}/slots?date=${date}`)
      .then(res => {
        if (res.data.available) {
          setSlots(res.data.slots)
        } else {
          setSlots([])
        }
      })
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false))
  }, [date, vetId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate(`/login?redirect=/book/${vetId}`)
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const res = await api.post('/appointments', {
        vet_id: parseInt(vetId),
        pet_name: petName,
        pet_type: petType,
        pet_age: petAge,
        appointment_date: date,
        appointment_time: time,
        reason,
      })
      setSuccess(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingVet) return (
    <div className="flex justify-center items-center min-h-64">
      <div className="animate-spin w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full" />
    </div>
  )

  if (!vet) return (
    <div className="text-center py-20">
      <p className="text-red-500">{error || 'Vet not found'}</p>
      <Link to="/vets" className="btn-primary mt-4 inline-block">Browse Vets</Link>
    </div>
  )

  if (success) return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Confirmed!</h2>
      <p className="text-gray-600 mb-6">Your booking has been confirmed. See you at the clinic!</p>
      <div className="card p-5 text-left space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Vet</span>
          <span className="font-semibold">{success.vet_name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Clinic</span>
          <span className="font-semibold">{success.clinic_name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Date</span>
          <span className="font-semibold">{new Date(success.appointment_date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Time</span>
          <span className="font-semibold">{success.appointment_time}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Pet</span>
          <span className="font-semibold">{success.pet_name} ({success.pet_type})</span>
        </div>
        <div className="flex justify-between text-sm border-t pt-3">
          <span className="text-gray-500">Fee</span>
          <span className="font-bold text-green-700">₹{success.consultation_fee}</span>
        </div>
      </div>
      <div className="flex gap-3 justify-center">
        <Link to="/my-appointments" className="btn-primary">View Appointments</Link>
        <Link to="/vets" className="btn-secondary">Find More Vets</Link>
      </div>
    </div>
  )

  const initials = vet.name.split(' ').slice(1, 3).map(n => n[0]).join('')

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to={`/vets/${vetId}`} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to profile
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Book an Appointment</h1>

      {/* Vet summary */}
      <div className="card p-4 mb-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
          {initials}
        </div>
        <div>
          <p className="font-bold text-gray-900">{vet.name}</p>
          <p className="text-green-700 text-sm">{vet.specialization}</p>
          <p className="text-gray-500 text-xs">{vet.clinic_name} · {vet.area}</p>
        </div>
        <div className="ml-auto text-right">
          <div className="text-lg font-bold text-gray-900">₹{vet.consultation_fee}</div>
          <div className="text-xs text-gray-500">consultation</div>
        </div>
      </div>

      {!user && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-5 text-sm text-yellow-800">
          <strong>Please log in</strong> to book an appointment.{' '}
          <Link to={`/login?redirect=/book/${vetId}`} className="underline font-medium">Login here</Link>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-5 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        {/* Pet details */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Pet Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pet Name *</label>
              <input
                type="text"
                value={petName}
                onChange={e => setPetName(e.target.value)}
                placeholder="e.g. Buddy"
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pet Type *</label>
              <select value={petType} onChange={e => setPetType(e.target.value)} required className="input-field">
                <option value="">Select pet type</option>
                {PET_TYPES.map(pt => <option key={pt} value={pt}>{pt}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pet Age</label>
              <input
                type="text"
                value={petAge}
                onChange={e => setPetAge(e.target.value)}
                placeholder="e.g. 3 years, 6 months"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div className="border-t border-gray-100 pt-5">
          <h3 className="font-semibold text-gray-900 mb-4">Appointment Date & Time</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                min={getTodayString()}
                max={getMaxDateString()}
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot *</label>
              {!date ? (
                <div className="input-field bg-gray-50 text-gray-400 cursor-not-allowed">Select a date first</div>
              ) : loadingSlots ? (
                <div className="input-field bg-gray-50 text-gray-400">Loading slots...</div>
              ) : slots.length === 0 ? (
                <div className="input-field bg-red-50 text-red-500 text-xs">No slots available for this date</div>
              ) : (
                <select value={time} onChange={e => setTime(e.target.value)} required className="input-field">
                  <option value="">Select time</option>
                  {slots.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Reason */}
        <div className="border-t border-gray-100 pt-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Briefly describe the issue or reason for the visit..."
            rows={3}
            className="input-field resize-none"
          />
        </div>

        <div className="border-t border-gray-100 pt-4">
          <button
            type="submit"
            disabled={submitting || !user}
            className="w-full btn-primary py-3 text-base"
          >
            {submitting ? 'Confirming...' : `Confirm Booking — ₹${vet.consultation_fee}`}
          </button>
          <p className="text-xs text-gray-400 text-center mt-2">Payment is collected at the clinic.</p>
        </div>
      </form>
    </div>
  )
}

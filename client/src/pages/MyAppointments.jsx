import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

const STATUS_STYLES = {
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
  completed: 'bg-gray-100 text-gray-600',
}

export default function MyAppointments() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelling, setCancelling] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/my-appointments')
      return
    }
    api.get('/appointments')
      .then(res => setAppointments(res.data))
      .catch(() => setError('Failed to load appointments'))
      .finally(() => setLoading(false))
  }, [user, navigate])

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return
    setCancelling(id)
    try {
      await api.patch(`/appointments/${id}/cancel`)
      setAppointments(prev =>
        prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a)
      )
    } catch (err) {
      alert(err.response?.data?.error || 'Could not cancel appointment')
    } finally {
      setCancelling(null)
    }
  }

  const now = new Date()

  const filtered = appointments.filter(a => {
    if (filter === 'upcoming') {
      return a.status === 'confirmed' && new Date(`${a.appointment_date}T${a.appointment_time}`) >= now
    }
    if (filter === 'past') {
      return a.status !== 'cancelled' && new Date(`${a.appointment_date}T${a.appointment_time}`) < now
    }
    if (filter === 'cancelled') return a.status === 'cancelled'
    return true
  })

  if (loading) return (
    <div className="flex justify-center items-center min-h-64">
      <div className="animate-spin w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full" />
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-500 text-sm mt-1">Hi {user?.name?.split(' ')[0]}, here are your bookings</p>
        </div>
        <Link to="/vets" className="btn-primary text-sm">Book New</Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {[
          { key: 'all', label: 'All' },
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'past', label: 'Past' },
          { key: 'cancelled', label: 'Cancelled' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`pb-3 px-1 text-sm font-medium border-b-2 -mb-px transition-colors ${filter === f.key ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && <div className="text-red-500 text-center py-8">{error}</div>}

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📅</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {filter === 'all' ? 'No appointments yet' : `No ${filter} appointments`}
          </h3>
          <p className="text-gray-500 mb-5 text-sm">Book your pet's first vet appointment today!</p>
          <Link to="/vets" className="btn-primary">Find a Vet</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(appt => {
            const apptTime = new Date(`${appt.appointment_date}T${appt.appointment_time}`)
            const isPast = apptTime < now
            const canCancel = appt.status === 'confirmed' && !isPast

            return (
              <div key={appt.id} className="card p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900">{appt.vet_name}</h3>
                        <p className="text-green-700 text-sm">{appt.specialization}</p>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[appt.status] || 'bg-gray-100 text-gray-600'}`}>
                        {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                      <div>
                        <div className="text-xs text-gray-400">Date</div>
                        <div className="text-sm font-medium text-gray-800">
                          {new Date(appt.appointment_date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Time</div>
                        <div className="text-sm font-medium text-gray-800">{appt.appointment_time}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Pet</div>
                        <div className="text-sm font-medium text-gray-800">{appt.pet_name} ({appt.pet_type})</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Fee</div>
                        <div className="text-sm font-medium text-green-700">₹{appt.consultation_fee}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-3">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {appt.clinic_name}, {appt.area}
                    </div>

                    {appt.reason && (
                      <p className="text-xs text-gray-500 mt-2 bg-gray-50 px-3 py-2 rounded-lg">
                        <span className="font-medium">Reason:</span> {appt.reason}
                      </p>
                    )}
                  </div>

                  <div className="flex sm:flex-col gap-2 sm:items-end justify-end">
                    <Link to={`/vets/${appt.vet_id}`} className="btn-secondary text-xs py-1.5 px-3">
                      View Vet
                    </Link>
                    {canCancel && (
                      <button
                        onClick={() => handleCancel(appt.id)}
                        disabled={cancelling === appt.id}
                        className="text-xs text-red-600 hover:text-red-700 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {cancelling === appt.id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

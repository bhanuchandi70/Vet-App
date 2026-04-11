import { Link } from 'react-router-dom'
import StarRating from './StarRating'

const PET_ICONS = {
  Dogs: '🐶', Cats: '🐱', Birds: '🦜', Rabbits: '🐰',
  'Guinea Pigs': '🐹', Hamsters: '🐹', Reptiles: '🦎',
  Cattle: '🐄', Horses: '🐴', Goats: '🐐', Sheep: '🐑',
}

export default function VetCard({ vet }) {
  const initials = vet.name.split(' ').slice(1, 3).map(n => n[0]).join('')

  return (
    <div className="card hover:shadow-md transition-shadow duration-200 flex flex-col">
      <div className="p-5 flex-1">
        {/* Header */}
        <div className="flex gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-lg leading-tight truncate">{vet.name}</h3>
            <p className="text-green-700 text-sm font-medium">{vet.specialization}</p>
            <StarRating rating={vet.rating} count={vet.review_count} />
          </div>
        </div>

        {/* Clinic & Location */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
            </svg>
            <span className="font-medium text-gray-800">{vet.clinic_name}</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{vet.area}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>{vet.experience_years} years experience</span>
          </div>
        </div>

        {/* Pet types */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {vet.pet_types.map(pt => (
            <span key={pt} className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">
              {PET_ICONS[pt] || '🐾'} {pt}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5 flex items-center justify-between border-t border-gray-50 pt-4">
        <div>
          <span className="text-xs text-gray-500">Consultation</span>
          <div className="text-lg font-bold text-gray-900">₹{vet.consultation_fee}</div>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/vets/${vet.id}`}
            className="btn-secondary text-sm py-2 px-3"
          >
            View Profile
          </Link>
          <Link
            to={`/book/${vet.id}`}
            className="btn-primary text-sm py-2 px-3"
          >
            Book
          </Link>
        </div>
      </div>
    </div>
  )
}

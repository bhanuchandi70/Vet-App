export default function StarRating({ rating, count, size = 'sm' }) {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    )
  }
  return (
    <span className={`flex items-center gap-1 ${size === 'lg' ? 'text-xl' : 'text-base'}`}>
      {stars}
      <span className={`text-gray-600 font-medium ${size === 'lg' ? 'text-base' : 'text-xs'}`}>
        {rating.toFixed(1)}
      </span>
      {count !== undefined && (
        <span className={`text-gray-400 ${size === 'lg' ? 'text-sm' : 'text-xs'}`}>
          ({count} reviews)
        </span>
      )}
    </span>
  )
}

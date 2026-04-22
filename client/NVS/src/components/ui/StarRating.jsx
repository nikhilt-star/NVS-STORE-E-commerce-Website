import { Star } from 'lucide-react'

function StarRating({ rating, reviewCount }) {
  return (
    <div className="flex items-center gap-2 text-sm text-nvs-brown/75">
      <div className="flex items-center gap-1 text-[#f3b93f]">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={14}
            fill={index < Math.round(rating) ? 'currentColor' : 'transparent'}
            strokeWidth={1.8}
          />
        ))}
      </div>
      <span className="font-semibold">{rating}</span>
      <span>({reviewCount} reviews)</span>
    </div>
  )
}

export default StarRating

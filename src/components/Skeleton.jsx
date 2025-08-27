

const Skeleton = ({ className = '', ...props }) => (
  <div className={`animate-pulse bg-gray-300 rounded ${className}`} {...props} />
)

export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} />
    ))}
  </div>
)

export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
    <Skeleton className="h-48 w-full mb-4" />
    <SkeletonText lines={2} />
    <div className="flex justify-between items-center mt-4">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-8 w-24" />
    </div>
  </div>
)

export const SkeletonGrid = ({ items = 6, className = '' }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
    {Array.from({ length: items }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
)

export default Skeleton

import { useState, useRef, useEffect } from 'react'

const OptimizedImage = ({
  src,
  alt,
  className = '',
  fallbackSrc = '/images/placeholder.svg',
  lazy = true,
  sizes = '100vw',
  placeholder = 'blur',
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [inView, setInView] = useState(!lazy)
  const imgRef = useRef(null)
  const observerRef = useRef(null)

  // Intersection Observer для lazy loading
  useEffect(() => {
    if (!lazy || inView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
      observerRef.current = observer
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [lazy, inView])

  // Генерування responsive src
  const generateSrcSet = baseSrc => {
    if (!baseSrc || baseSrc.includes('placeholder')) return ''

    const ext = baseSrc.split('.').pop()
    const basePath = baseSrc.replace(`.${ext}`, '')

    return [
      `${basePath}_400w.${ext} 400w`,
      `${basePath}_800w.${ext} 800w`,
      `${basePath}_1200w.${ext} 1200w`,
      `${basePath}.${ext} 1600w`,
    ].join(', ')
  }

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  const imageSrc = hasError ? fallbackSrc : src

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`} {...props}>
      {/* Placeholder */}
      {!isLoaded && placeholder === 'blur' && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
      )}

      {!isLoaded && placeholder === 'skeleton' && (
        <div className="absolute inset-0 bg-gray-200">
          <div className="animate-pulse bg-gray-300 h-full w-full" />
        </div>
      )}

      {/* Основне зображення */}
      {inView && (
        <img
          src={imageSrc}
          srcSet={generateSrcSet(imageSrc)}
          sizes={sizes}
          alt={alt}
          loading={lazy ? 'lazy' : 'eager'}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}

      {/* WebP підтримка */}
      {inView && !hasError && (
        <picture style={{ display: 'none' }}>
          <source
            srcSet={generateSrcSet(src?.replace(/\.(jpg|jpeg|png)$/, '.webp'))}
            type="image/webp"
          />
          <source srcSet={generateSrcSet(src)} type={`image/${src?.split('.').pop()}`} />
        </picture>
      )}
    </div>
  )
}

export default OptimizedImage

// Компонент для hero зображення з пріоритетом
export const HeroImage = ({ src, alt, className = '', ...props }) => {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      lazy={false}
      placeholder="skeleton"
      sizes="100vw"
      className={className}
      {...props}
    />
  )
}

// Компонент для галереї з lazy loading
export const GalleryImage = ({ src, alt, className = '', ...props }) => {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      lazy={true}
      placeholder="blur"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className={className}
      {...props}
    />
  )
}

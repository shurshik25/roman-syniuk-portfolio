import { useEffect, useRef, useCallback } from 'react'
import {
  initAnalytics,
  trackPageView,
  trackEvent,
  trackScroll,
  trackVideoInteraction,
  trackFormInteraction,
  trackSearch,
  trackOutboundLink,
  trackDownload,
} from '../utils/analytics'

// Основний хук аналітики
export const useAnalytics = (options = {}) => {
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current && !options.DISABLED) {
      initAnalytics(options)
      initialized.current = true
    }
  }, [options])

  // Повертаємо заглушки якщо вимкнено
  if (options.DISABLED) {
    return {
      trackPageView: () => {},
      trackEvent: () => {},
      trackScroll: () => {},
      trackVideoInteraction: () => {},
      trackFormInteraction: () => {},
      trackSearch: () => {},
      trackOutboundLink: () => {},
      trackDownload: () => {},
    }
  }

  return {
    trackPageView,
    trackEvent,
    trackScroll,
    trackVideoInteraction,
    trackFormInteraction,
    trackSearch,
    trackOutboundLink,
    trackDownload,
  }
}

// Хук для трекінгу скролу
export const useScrollTracking = (thresholds = [25, 50, 75, 90, 100]) => {
  const trackedThresholds = useRef(new Set())
  const { trackScroll } = useAnalytics()

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = Math.round((scrollTop / docHeight) * 100)

      thresholds.forEach(threshold => {
        if (scrollPercent >= threshold && !trackedThresholds.current.has(threshold)) {
          trackedThresholds.current.add(threshold)
          trackScroll(threshold)
        }
      })
    }

    const throttledHandleScroll = throttle(handleScroll, 500)
    window.addEventListener('scroll', throttledHandleScroll)

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
    }
  }, [thresholds, trackScroll])
}

// Хук для трекінгу часу перегляду секцій
export const useSectionViewTracking = (sectionName, threshold = 0.5) => {
  const sectionRef = useRef(null)
  const viewStartTime = useRef(null)
  const hasTrackedView = useRef(false)
  const { trackEvent } = useAnalytics()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
          if (!hasTrackedView.current) {
            trackEvent('section_view', 'engagement', sectionName)
            hasTrackedView.current = true
          }
          viewStartTime.current = Date.now()
        } else if (viewStartTime.current) {
          const viewTime = Math.round((Date.now() - viewStartTime.current) / 1000)
          if (viewTime > 3) {
            // Тільки якщо переглядали більше 3 секунд
            trackEvent('section_time', 'engagement', sectionName, viewTime)
          }
          viewStartTime.current = null
        }
      },
      { threshold }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [sectionName, threshold, trackEvent])

  return sectionRef
}

// Хук для трекінгу кліків
export const useClickTracking = (category = 'interaction') => {
  const { trackEvent } = useAnalytics()

  const trackClick = useCallback(
    (action, label = '', value = 0) => {
      trackEvent(action, category, label, value)
    },
    [trackEvent, category]
  )

  return { trackClick }
}

// Хук для трекінгу форм
export const useFormTracking = formName => {
  const { trackFormInteraction } = useAnalytics()

  const trackFormStart = useCallback(() => {
    trackFormInteraction('start', formName)
  }, [trackFormInteraction, formName])

  const trackFormSubmit = useCallback(() => {
    trackFormInteraction('submit', formName)
  }, [trackFormInteraction, formName])

  const trackFormError = useCallback(
    error => {
      trackFormInteraction('error', `${formName}_${error}`)
    },
    [trackFormInteraction, formName]
  )

  const trackFormComplete = useCallback(() => {
    trackFormInteraction('complete', formName)
  }, [trackFormInteraction, formName])

  return {
    trackFormStart,
    trackFormSubmit,
    trackFormError,
    trackFormComplete,
  }
}

// Хук для трекінгу медіа
export const useMediaTracking = (mediaTitle, mediaType = 'video') => {
  const { trackVideoInteraction } = useAnalytics()

  const trackPlay = useCallback(
    (currentTime = 0) => {
      trackVideoInteraction('play', mediaTitle, currentTime)
    },
    [trackVideoInteraction, mediaTitle]
  )

  const trackPause = useCallback(
    (currentTime = 0) => {
      trackVideoInteraction('pause', mediaTitle, currentTime)
    },
    [trackVideoInteraction, mediaTitle]
  )

  const trackEnd = useCallback(
    (currentTime = 0) => {
      trackVideoInteraction('complete', mediaTitle, currentTime)
    },
    [trackVideoInteraction, mediaTitle]
  )

  const trackProgress = useCallback(
    (percentage, currentTime = 0) => {
      trackVideoInteraction(`progress_${percentage}%`, mediaTitle, currentTime)
    },
    [trackVideoInteraction, mediaTitle]
  )

  return {
    trackPlay,
    trackPause,
    trackEnd,
    trackProgress,
  }
}

// Хук для трекінгу пошуку
export const useSearchTracking = () => {
  const { trackSearch } = useAnalytics()
  const searchHistory = useRef([])

  const trackSearchQuery = useCallback(
    (query, category = 'general', results = 0) => {
      // Додаємо в історію
      searchHistory.current.push({
        query,
        category,
        results,
        timestamp: Date.now(),
      })

      // Обмежуємо історію до 50 записів
      if (searchHistory.current.length > 50) {
        searchHistory.current = searchHistory.current.slice(-50)
      }

      trackSearch(query, category)
    },
    [trackSearch]
  )

  const getSearchHistory = useCallback(() => {
    return searchHistory.current
  }, [])

  return {
    trackSearchQuery,
    getSearchHistory,
  }
}

// Хук для трекінгу продуктивності
export const usePerformanceTracking = () => {
  const { trackEvent } = useAnalytics()

  useEffect(() => {
    // Трекінг часу завантаження
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0]
          if (perfData) {
            const loadTime = Math.round(perfData.loadEventEnd - perfData.loadEventStart)
            const domTime = Math.round(
              perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart
            )

            trackEvent('page_load_time', 'performance', 'total', loadTime)
            trackEvent('dom_load_time', 'performance', 'dom', domTime)
          }
        }, 1000)
      })
    }

    // Трекінг помилок ресурсів
    const handleResourceError = event => {
      if (event.target && event.target !== window) {
        const resourceType = event.target.tagName.toLowerCase()
        const resourceSrc = event.target.src || event.target.href || 'unknown'

        trackEvent('resource_error', 'performance', `${resourceType}: ${resourceSrc}`)
      }
    }

    window.addEventListener('error', handleResourceError, true)

    return () => {
      window.removeEventListener('error', handleResourceError, true)
    }
  }, [trackEvent])
}

// Utility функція для throttling
function throttle(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

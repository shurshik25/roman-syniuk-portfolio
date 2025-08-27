// Імпорти будуть динамічними через web-vitals

// Конфігурація аналітики
const ANALYTICS_CONFIG = {
  // Google Analytics 4
  GA4_MEASUREMENT_ID: 'G-XXXXXXXXXX', // Замініть на реальний ID

  // Web Vitals tracking
  VITALS_ENDPOINT: '/api/vitals',

  // Error tracking
  ERROR_ENDPOINT: '/api/errors',

  // User events
  EVENTS_ENDPOINT: '/api/events',

  // Debug mode
  DEBUG: import.meta.env.DEV,
  
  // Відключаємо відправку на сервер для dev/preview
  DISABLE_SERVER_TRACKING: import.meta.env.DEV || window.location.hostname === 'localhost'
}

// Ініціалізація Google Analytics 4
export const initGA4 = (measurementId = ANALYTICS_CONFIG.GA4_MEASUREMENT_ID) => {
  if (typeof window === 'undefined' || !measurementId) return

  // Завантажуємо gtag
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)

  // Ініціалізуємо gtag
  window.dataLayer = window.dataLayer || []
  window.gtag = function () {
    window.dataLayer.push(arguments)
  }

  window.gtag('js', new Date())
  window.gtag('config', measurementId, {
    page_title: document.title,
    page_location: window.location.href,
    custom_map: {
      custom_parameter_1: 'portfolio_section',
    },
  })

  if (ANALYTICS_CONFIG.DEBUG) {
    console.log('GA4 initialized with ID:', measurementId)
  }
}

// Трекінг сторінок
export const trackPageView = (page_title, page_location = window.location.href) => {
  if (typeof window.gtag !== 'function') return

  window.gtag('config', ANALYTICS_CONFIG.GA4_MEASUREMENT_ID, {
    page_title,
    page_location,
  })

  if (ANALYTICS_CONFIG.DEBUG) {
    console.log('Page view tracked:', { page_title, page_location })
  }
}

// Трекінг подій
export const trackEvent = (action, category = 'general', label = '', value = 0) => {
  if (typeof window.gtag !== 'function') return

  const eventData = {
    event_category: category,
    event_label: label,
    value,
  }

  window.gtag('event', action, eventData)

  // Додатковий логінг для розробки
  if (ANALYTICS_CONFIG.DEBUG) {
    console.log('Event tracked:', { action, ...eventData })
  }

  // Відправляємо на власний endpoint для детального аналізу
  sendCustomEvent({
    action,
    category,
    label,
    value,
    timestamp: Date.now(),
    url: window.location.href,
    userAgent: navigator.userAgent,
  })
}

// Трекінг користувацьких подій
const sendCustomEvent = async eventData => {
  if (ANALYTICS_CONFIG.DISABLE_SERVER_TRACKING) {
    if (ANALYTICS_CONFIG.DEBUG) {
      console.log('Event tracked (local only):', eventData)
    }
    return
  }
  
  try {
    await fetch(ANALYTICS_CONFIG.EVENTS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    })
  } catch (error) {
    if (ANALYTICS_CONFIG.DEBUG) {
      console.warn('Failed to send custom event:', error)
    }
  }
}

// Трекінг Web Vitals
export const trackWebVitals = () => {
  if ('web-vital' in window) return // Уникаємо подвійної ініціалізації

  import('web-vitals').then(vitals => {
    const { getCLS, getFID, getFCP, getLCP, getTTFB } = vitals.default || vitals
    
    const sendToAnalytics = metric => {
      // Відправляємо в GA4
      if (typeof window.gtag === 'function') {
        window.gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          non_interaction: true,
        })
      }

      // Відправляємо на власний endpoint
      if (ANALYTICS_CONFIG.DISABLE_SERVER_TRACKING) {
        console.log('📊 Web Vitals (local):', metric)
      } else {
        sendVitalsData(metric)
      }

      if (ANALYTICS_CONFIG.DEBUG) {
        console.log('Web Vital tracked:', metric)
      }
    }

    if (getCLS && getFID && getFCP && getLCP && getTTFB) {
      getCLS(sendToAnalytics)
      getFID(sendToAnalytics)
      getFCP(sendToAnalytics)
      getLCP(sendToAnalytics)
      getTTFB(sendToAnalytics)
      
      window['web-vital'] = true
    }
  }).catch(error => {
    console.warn('⚠️ Web Vitals not available:', error)
  })
}

const sendVitalsData = async metric => {
  if (ANALYTICS_CONFIG.DISABLE_SERVER_TRACKING) {
    if (ANALYTICS_CONFIG.DEBUG) {
      console.log('Vitals tracked (local only):', metric)
    }
    return
  }
  
  try {
    await fetch(ANALYTICS_CONFIG.VITALS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...metric,
        url: window.location.href,
        timestamp: Date.now(),
      }),
    })
  } catch (error) {
    if (ANALYTICS_CONFIG.DEBUG) {
      console.warn('Failed to send vitals data:', error)
    }
  }
}

// Трекінг помилок
export const trackError = (error, errorInfo = {}) => {
  const errorData = {
    message: error.message || String(error),
    stack: error.stack || '',
    url: window.location.href,
    userAgent: navigator.userAgent,
    timestamp: Date.now(),
    ...errorInfo,
  }

  // Відправляємо в GA4
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'exception', {
      description: errorData.message,
      fatal: false,
    })
  }

  // Відправляємо на власний endpoint
  sendErrorData(errorData)

  if (ANALYTICS_CONFIG.DEBUG) {
    console.error('Error tracked:', errorData)
  }
}

const sendErrorData = async errorData => {
  if (ANALYTICS_CONFIG.DISABLE_SERVER_TRACKING) {
    if (ANALYTICS_CONFIG.DEBUG) {
      console.log('Error tracked (local only):', errorData)
    }
    return
  }
  
  try {
    await fetch(ANALYTICS_CONFIG.ERROR_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorData),
    })
  } catch (error) {
    if (ANALYTICS_CONFIG.DEBUG) {
      console.warn('Failed to send error data:', error)
    }
  }
}

// Трекінг скролу
export const trackScroll = percentage => {
  trackEvent('scroll', 'engagement', `${percentage}%`, percentage)
}

// Трекінг часу на сторінці
export const trackTimeOnPage = () => {
  const startTime = Date.now()

  const sendTimeData = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000)
    trackEvent('time_on_page', 'engagement', '', timeSpent)
  }

  // Відправляємо дані при виході
  window.addEventListener('beforeunload', sendTimeData)
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      sendTimeData()
    }
  })
}

// Трекінг кліків по зовнішніх посиланнях
export const trackOutboundLink = (url, label = '') => {
  trackEvent('click', 'outbound', label || url)
}

// Трекінг завантажень
export const trackDownload = (filename, type = '') => {
  trackEvent('download', 'file', `${type}: ${filename}`)
}

// Трекінг взаємодії з відео
export const trackVideoInteraction = (action, videoTitle = '', currentTime = 0) => {
  trackEvent(`video_${action}`, 'media', videoTitle, Math.round(currentTime))
}

// Трекінг взаємодії з формами
export const trackFormInteraction = (action, formName = '') => {
  trackEvent(`form_${action}`, 'forms', formName)
}

// Трекінг пошуку
export const trackSearch = (query, category = 'general') => {
  trackEvent('search', 'navigation', query)

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'search', {
      search_term: query,
      content_type: category,
    })
  }
}

// Ініціалізація всіх трекерів
export const initAnalytics = (options = {}) => {
  const config = { ...ANALYTICS_CONFIG, ...options }

  // Ініціалізуємо GA4
  if (config.GA4_MEASUREMENT_ID) {
    initGA4(config.GA4_MEASUREMENT_ID)
  }

  // Ініціалізуємо Web Vitals
  trackWebVitals()

  // Ініціалізуємо трекінг часу
  trackTimeOnPage()

  // Глобальний обробник помилок
  window.addEventListener('error', event => {
    trackError(event.error, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    })
  })

  // Обробник для Promise rejections
  window.addEventListener('unhandledrejection', event => {
    trackError(event.reason, {
      type: 'unhandledrejection',
    })
  })

  if (config.DEBUG) {
    console.log('Analytics initialized with config:', config)
  }
}

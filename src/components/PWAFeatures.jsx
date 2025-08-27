import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Компонент для install prompt
export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Перевіряємо чи застосунок вже встановлено
    const checkIfInstalled = () => {
      if (
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true
      ) {
        setIsInstalled(true)
      }
    }

    checkIfInstalled()

    // Слухач для beforeinstallprompt
    const handleBeforeInstallPrompt = e => {
      e.preventDefault()
      setDeferredPrompt(e)

      // Показуємо банер через 5 секунд після завантаження
      setTimeout(() => {
        if (!isInstalled) {
          setShowInstallBanner(true)
        }
      }, 5000)
    }

    // Слухач для appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallBanner(false)
      setDeferredPrompt(null)

      // Показуємо повідомлення про успішне встановлення
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification('Додаток встановлено!', {
            body: 'Тепер ви можете використовувати портфоліо як додаток',
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-72x72.png',
          })
        })
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [isInstalled])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      const result = await deferredPrompt.prompt()

      if (result.outcome === 'accepted') {
        setShowInstallBanner(false)
        setDeferredPrompt(null)
      }
    } catch (error) {
      console.error('Error during installation:', error)
    }
  }

  const handleDismiss = () => {
    setShowInstallBanner(false)
    // Не показувати знову протягом 24 годин
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  // Перевіряємо чи було відхилено нещодавно
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) {
      const dismissedTime = parseInt(dismissed)
      const now = Date.now()
      const dayInMs = 24 * 60 * 60 * 1000

      if (now - dismissedTime < dayInMs) {
        setShowInstallBanner(false)
      }
    }
  }, [])

  if (isInstalled || !showInstallBanner) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
      >
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <img src="/icons/icon-72x72.png" alt="App icon" className="w-12 h-12 rounded-lg" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900">Встановити додаток</h3>
              <p className="text-xs text-gray-600 mt-1">
                Отримайте швидкий доступ до портфоліо прямо з головного екрану
              </p>

              <div className="flex space-x-2 mt-3">
                <button
                  onClick={handleInstallClick}
                  className="flex-1 bg-purple-600 text-white text-xs font-medium py-2 px-3 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Встановити
                </button>
                <button
                  onClick={handleDismiss}
                  className="text-gray-500 text-xs font-medium py-2 px-3 hover:text-gray-700 transition-colors"
                >
                  Пізніше
                </button>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Компонент для offline повідомлень
export const OfflineIndicator = () => {
  const [showOfflineMessage, setShowOfflineMessage] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setShowOfflineMessage(false)
    }

    const handleOffline = () => {
      setShowOfflineMessage(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!showOfflineMessage) return null

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-orange-500 text-white px-4 py-2 text-center text-sm"
    >
      📡 Ви працюєте офлайн. Деякі функції можуть бути недоступні.
    </motion.div>
  )
}

// Компонент для update notifications
export const PWAUpdateNotification = () => {
  const [showUpdateAvailable, setShowUpdateAvailable] = useState(false)
  const [registration, setRegistration] = useState(null)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(reg => {
        setRegistration(reg)

        // Слухач для нових версій
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setShowUpdateAvailable(true)
            }
          })
        })
      })

      // Слухач для controllerchange
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload()
      })
    }
  }, [])

  const handleUpdate = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
  }

  const handleDismiss = () => {
    setShowUpdateAvailable(false)
  }

  if (!showUpdateAvailable) return null

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
    >
      <div className="bg-blue-600 text-white rounded-lg shadow-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-1">
            <h3 className="text-sm font-semibold">Оновлення доступне</h3>
            <p className="text-xs opacity-90 mt-1">Нова версія додатку готова до встановлення</p>

            <div className="flex space-x-2 mt-3">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-white text-blue-600 text-xs font-medium py-2 px-3 rounded-md hover:bg-gray-100 transition-colors"
              >
                Оновити
              </button>
              <button
                onClick={handleDismiss}
                className="text-white text-xs font-medium py-2 px-3 hover:bg-blue-700 rounded-md transition-colors"
              >
                Пізніше
              </button>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// Головний компонент PWA
export const PWAManager = ({ children }) => {
  return (
    <>
      {children}
      <PWAInstallPrompt />
      <OfflineIndicator />
      <PWAUpdateNotification />
    </>
  )
}

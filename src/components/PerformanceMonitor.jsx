import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Компонент для відображення метрик продуктивності (тільки в dev режимі)
export const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({})
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  // Показуємо тільки в development режимі
  const isDev = import.meta.env.DEV

  useEffect(() => {
    if (!isDev) return

    const updateMetrics = () => {
      const perfData = performance.getEntriesByType('navigation')[0]
      const paintEntries = performance.getEntriesByType('paint')

      const newMetrics = {
        // Основні метрики
        loadTime: perfData ? Math.round(perfData.loadEventEnd - perfData.loadEventStart) : 0,
        domReady: perfData
          ? Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart)
          : 0,
        ttfb: perfData ? Math.round(perfData.responseStart - perfData.requestStart) : 0,

        // Paint метрики
        fcp: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
        lcp: 0, // Будемо оновлювати через Web Vitals

        // Мережа
        transferSize: perfData ? Math.round(perfData.transferSize / 1024) : 0, // KB

        // Memory (якщо доступно)
        memoryUsed: performance.memory
          ? Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)
          : 0, // MB
        memoryLimit: performance.memory
          ? Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
          : 0, // MB

        // FPS (приблизно)
        fps: 0,

        // Timestamp
        lastUpdated: Date.now(),
      }

      setMetrics(newMetrics)
    }

    // Початкове оновлення
    setTimeout(updateMetrics, 2000)

    // FPS моніторинг
    let frameCount = 0
    let lastTime = performance.now()

    const measureFPS = () => {
      frameCount++
      const currentTime = performance.now()

      if (currentTime >= lastTime + 1000) {
        setMetrics(prev => ({
          ...prev,
          fps: Math.round((frameCount * 1000) / (currentTime - lastTime)),
        }))
        frameCount = 0
        lastTime = currentTime
      }

      requestAnimationFrame(measureFPS)
    }

    measureFPS()

    // Web Vitals для LCP
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
              setMetrics(prev => ({
                ...prev,
                lcp: Math.round(entry.startTime),
              }))
            }
          }
        })

        observer.observe({ entryTypes: ['largest-contentful-paint'] })

        return () => observer.disconnect()
      } catch (error) {
        console.warn('PerformanceObserver not supported:', error)
      }
    }
  }, [isDev])

  // Клавіатурний скорочення для показу/приховування
  useEffect(() => {
    if (!isDev) return

    const handleKeyDown = event => {
      if (event.ctrlKey && event.shiftKey && event.key === 'P') {
        event.preventDefault()
        setIsVisible(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDev])

  if (!isDev) return null

  const getMetricColor = (metric, value) => {
    const thresholds = {
      loadTime: { good: 1000, poor: 3000 },
      domReady: { good: 500, poor: 1500 },
      ttfb: { good: 200, poor: 600 },
      fcp: { good: 1800, poor: 3000 },
      lcp: { good: 2500, poor: 4000 },
      fps: { good: 55, poor: 30 },
    }

    const threshold = thresholds[metric]
    if (!threshold) return 'text-gray-600'

    if (metric === 'fps') {
      return value >= threshold.good
        ? 'text-green-600'
        : value >= threshold.poor
          ? 'text-yellow-600'
          : 'text-red-600'
    } else {
      return value <= threshold.good
        ? 'text-green-600'
        : value <= threshold.poor
          ? 'text-yellow-600'
          : 'text-red-600'
    }
  }

  const formatMetric = (metric, value) => {
    switch (metric) {
      case 'memoryUsed':
      case 'memoryLimit':
        return `${value} MB`
      case 'transferSize':
        return `${value} KB`
      case 'fps':
        return `${value} FPS`
      default:
        return `${value} ms`
    }
  }

  return (
    <>
      {/* Toggle button - removed, only keyboard shortcut */}

      {/* Performance panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-16 right-4 z-50 bg-white rounded-lg shadow-xl border border-gray-200 min-w-[300px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Performance Monitor</h3>
              <div className="flex space-x-1">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded"
                  title={isExpanded ? 'Згорнути' : 'Розгорнути'}
                >
                  {isExpanded ? '📊' : '📈'}
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded"
                  title="Закрити"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Metrics */}
            <div className="p-3 space-y-2">
              {/* Основні метрики */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className={`${getMetricColor('loadTime', metrics.loadTime)}`}>
                  <span className="text-gray-500">Load:</span>{' '}
                  {formatMetric('loadTime', metrics.loadTime)}
                </div>
                <div className={`${getMetricColor('domReady', metrics.domReady)}`}>
                  <span className="text-gray-500">DOM:</span>{' '}
                  {formatMetric('domReady', metrics.domReady)}
                </div>
                <div className={`${getMetricColor('ttfb', metrics.ttfb)}`}>
                  <span className="text-gray-500">TTFB:</span> {formatMetric('ttfb', metrics.ttfb)}
                </div>
                <div className={`${getMetricColor('fps', metrics.fps)}`}>
                  <span className="text-gray-500">FPS:</span> {formatMetric('fps', metrics.fps)}
                </div>
              </div>

              {/* Розширені метрики */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-gray-200 pt-2 mt-2 space-y-2"
                >
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className={`${getMetricColor('fcp', metrics.fcp)}`}>
                      <span className="text-gray-500">FCP:</span> {formatMetric('fcp', metrics.fcp)}
                    </div>
                    <div className={`${getMetricColor('lcp', metrics.lcp)}`}>
                      <span className="text-gray-500">LCP:</span> {formatMetric('lcp', metrics.lcp)}
                    </div>
                    <div className="text-gray-600">
                      <span className="text-gray-500">Size:</span>{' '}
                      {formatMetric('transferSize', metrics.transferSize)}
                    </div>
                    {metrics.memoryUsed > 0 && (
                      <div className="text-gray-600">
                        <span className="text-gray-500">Memory:</span>{' '}
                        {formatMetric('memoryUsed', metrics.memoryUsed)}
                      </div>
                    )}
                  </div>

                  {/* Memory usage bar */}
                  {metrics.memoryLimit > 0 && (
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">Memory Usage</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min((metrics.memoryUsed / metrics.memoryLimit) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 text-right">
                        {metrics.memoryUsed} / {metrics.memoryLimit} MB
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Інструкції */}
              <div className="text-xs text-gray-400 border-t border-gray-200 pt-2">
                Ctrl+Shift+P для toggle
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}



export default PerformanceMonitor

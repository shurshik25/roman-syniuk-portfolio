import { useState, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { useContent } from './hooks/useContent'
import { ThemeProvider } from './contexts/ThemeContext'
import { useToast } from './hooks/useToast'
import { ToastContainer } from './components/Toast'
import SEO from './components/SEO'
import { PWAManager } from './components/PWAFeatures'
import { SkipToContent } from './components/AccessibleComponents'
import { useAccessibilityPreferences } from './hooks/useAccessibility'
import { useAnalytics, useScrollTracking, usePerformanceTracking } from './hooks/useAnalytics'
import PerformanceMonitor from './components/PerformanceMonitor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Portfolio from './components/Portfolio'
import Repertoire from './components/Repertoire'
import Contact from './components/Contact'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import AdminPanel from './components/AdminPanel/index.jsx'

function AppContent() {
  const [isLoading, setIsLoading] = useState(true)
  const { content } = useContent()
  const { toasts, removeToast } = useToast()
  const { prefersReducedMotion } = useAccessibilityPreferences()

  // Ініціалізуємо аналітику тільки у production
  const { trackPageView } = useAnalytics({
    GA4_MEASUREMENT_ID: import.meta.env.PROD ? 'G-XXXXXXXXXX' : '', // Замініть на реальний ID
    DEBUG: import.meta.env.DEV,
    DISABLED: import.meta.env.DEV, // Вимикаємо в development
  })

  // Трекінг скролу та продуктивності тільки у production
  useScrollTracking(import.meta.env.DEV ? [] : [25, 50, 75, 90, 100])
  usePerformanceTracking(import.meta.env.DEV ? { disabled: true } : {})

  useEffect(() => {
    const timer = setTimeout(
      () => {
        setIsLoading(false)
        // Трекаємо завершення завантаження
        trackPageView('Портфоліо актора - Головна')
      },
      prefersReducedMotion ? 100 : 1000
    )
    return () => clearTimeout(timer)
  }, [prefersReducedMotion, trackPageView])

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-xl">Завантаження...</p>
        </div>
      </div>
    )
  }

  return (
    <HelmetProvider>
      <PWAManager>
        <div className="App">
          <SEO
            title={content?.hero?.name}
            description={content?.hero?.description}
            author={content?.hero?.name}
            personalInfo={content?.about?.personalInfo}
          />
          <SkipToContent />
          <Navbar />
          <main id="main-content" className="pt-16 lg:pt-0">
            <Hero />
            <About />
            <Portfolio />
            <Repertoire />
            <Contact />
          </main>
          <Footer />
          <BackToTop />
          <AdminPanel />
          <ToastContainer toasts={toasts} removeToast={removeToast} />
          <PerformanceMonitor />
        </div>
      </PWAManager>
    </HelmetProvider>
  )
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App

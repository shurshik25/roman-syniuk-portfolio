import { useEffect, useRef, useState } from 'react'

// Хук для управління фокусом
export const useFocusManagement = () => {
  const trapRef = useRef(null)

  const trapFocus = event => {
    if (!trapRef.current) return

    const focusableElements = trapRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus()
          event.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus()
          event.preventDefault()
        }
      }
    }

    if (event.key === 'Escape') {
      const closeButton = trapRef.current.querySelector('[data-close]')
      if (closeButton) {
        closeButton.click()
      }
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', trapFocus)
    return () => document.removeEventListener('keydown', trapFocus)
  }, [])

  return trapRef
}

// Хук для анонсів screen reader
export const useScreenReader = () => {
  const [announcement, setAnnouncement] = useState('')

  const announce = (message) => {
    setAnnouncement('')
    setTimeout(() => setAnnouncement(message), 100)
  }

  return {
    announcement,
    announce,
    AnnouncementComponent: () => (
      <div aria-live="polite" aria-atomic="true" className="sr-only" role="status">
        {announcement}
      </div>
    ),
  }
}

// Хук для управління клавіатурними скороченнями
export const useKeyboardShortcuts = shortcuts => {
  useEffect(() => {
    const handleKeyDown = event => {
      const key = event.key.toLowerCase()
      const hasCtrl = event.ctrlKey
      const hasShift = event.shiftKey
      const hasAlt = event.altKey

      Object.entries(shortcuts).forEach(([shortcut, handler]) => {
        const [keys, ...modifiers] = shortcut.split('+').reverse()

        const matchesKey = keys === key
        const matchesCtrl = modifiers.includes('ctrl') ? hasCtrl : !hasCtrl
        const matchesShift = modifiers.includes('shift') ? hasShift : !hasShift
        const matchesAlt = modifiers.includes('alt') ? hasAlt : !hasAlt

        if (matchesKey && matchesCtrl && matchesShift && matchesAlt) {
          event.preventDefault()
          handler(event)
        }
      })
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

// Хук для перевірки налаштувань доступності
export const useAccessibilityPreferences = () => {
  const [preferences, setPreferences] = useState({
    prefersReducedMotion: false,
    prefersHighContrast: false,
    prefersDarkMode: false,
  })

  useEffect(() => {
    const checkPreferences = () => {
      setPreferences({
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
        prefersDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      })
    }

    checkPreferences()

    // Слухачі для змін
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const contrastQuery = window.matchMedia('(prefers-contrast: high)')
    const themeQuery = window.matchMedia('(prefers-color-scheme: dark)')

    motionQuery.addEventListener('change', checkPreferences)
    contrastQuery.addEventListener('change', checkPreferences)
    themeQuery.addEventListener('change', checkPreferences)

    return () => {
      motionQuery.removeEventListener('change', checkPreferences)
      contrastQuery.removeEventListener('change', checkPreferences)
      themeQuery.removeEventListener('change', checkPreferences)
    }
  }, [])

  return preferences
}

// Хук для skip-links
export const useSkipLinks = () => {
  const skipLinkRef = useRef(null)

  const focusSkipLink = () => {
    skipLinkRef.current?.focus()
  }

  const SkipLink = ({ href, children }) => (
    <a
      ref={skipLinkRef}
      href={href}
      className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-md focus:no-underline"
      onFocus={() => skipLinkRef.current?.scrollIntoView()}
    >
      {children}
    </a>
  )

  return { SkipLink, focusSkipLink }
}

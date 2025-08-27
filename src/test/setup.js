import '@testing-library/jest-dom'
import { expect, afterEach, beforeAll, afterAll } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup після кожного тесту
afterEach(() => {
  cleanup()
})

// Mock для IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}

  observe() {
    return null
  }

  disconnect() {
    return null
  }

  unobserve() {
    return null
  }
}

// Mock для ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}

  observe() {
    return null
  }

  disconnect() {
    return null
  }

  unobserve() {
    return null
  }
}

// Mock для matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// Mock для scrollTo
global.scrollTo = () => {}

// Mock для localStorage
const localStorageMock = {
  getItem: key => {
    return localStorageMock[key] || null
  },
  setItem: (key, value) => {
    localStorageMock[key] = value
  },
  removeItem: key => {
    delete localStorageMock[key]
  },
  clear: () => {
    Object.keys(localStorageMock).forEach(key => {
      if (key !== 'getItem' && key !== 'setItem' && key !== 'removeItem' && key !== 'clear') {
        delete localStorageMock[key]
      }
    })
  },
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock для fetch
global.fetch = () =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })

// Mock для performance
Object.defineProperty(window, 'performance', {
  writable: true,
  value: {
    now: () => Date.now(),
    getEntriesByType: () => [],
    getEntriesByName: () => [],
    mark: () => {},
    measure: () => {},
    navigation: {
      loadEventEnd: 1000,
      loadEventStart: 900,
      domContentLoadedEventEnd: 800,
      domContentLoadedEventStart: 700,
    },
  },
})

// Mock для gtag (Google Analytics)
global.gtag = () => {}
global.dataLayer = []

// Console warnings для незареєстрованих моків
const originalConsoleWarn = console.warn
console.warn = (...args) => {
  // Приховуємо певні попередження у тестах
  if (
    args[0]?.includes?.('Warning: ReactDOM.render is no longer supported') ||
    args[0]?.includes?.('Warning: validateDOMNesting') ||
    args[0]?.includes?.('Warning: Each child in a list should have a unique "key" prop')
  ) {
    return
  }
  originalConsoleWarn(...args)
}

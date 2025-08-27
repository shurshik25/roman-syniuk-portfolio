import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HelmetProvider } from 'react-helmet-async'
import { ThemeProvider } from '../contexts/ThemeContext'

// Провайдери для тестування
const AllTheProviders = ({ children }) => {
  return (
    <HelmetProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </HelmetProvider>
  )
}

// Кастомна функція render з провайдерами
const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options })

// Хелпери для тестування
export const createMockContent = (overrides = {}) => ({
  hero: {
    name: 'Test Actor',
    title: 'Test Title',
    description: 'Test Description',
    profileImage: '/test-image.jpg',
    stats: {
      roles: '10+',
      experience: '5+',
      availability: '100%',
    },
  },
  about: {
    biography: 'Test biography',
    education: [],
    experience: [],
    skills: [],
    achievements: [],
  },
  portfolio: {
    categories: [
      { id: 'all', label: 'Всі роботи' },
      { id: 'theater', label: 'Театр' },
    ],
    works: [
      {
        id: 1,
        title: 'Test Work',
        category: 'theater',
        image: '/test-work.jpg',
        description: 'Test work description',
      },
    ],
  },
  videoRepertoire: {
    categories: [{ id: 'theater', label: 'Театр', icon: '🎭' }],
    videos: [
      {
        id: 1,
        title: 'Test Video',
        category: 'theater',
        youtubeUrl: 'https://youtube.com/watch?v=test',
        thumbnail: '/test-thumbnail.jpg',
      },
    ],
  },
  contact: {
    email: 'test@example.com',
    phone: '+380123456789',
    location: 'Test City',
    availability: true,
    socialMedia: [],
    services: [],
    note: '',
  },
  ...overrides,
})

// Mock для useContent hook
export const mockUseContent = (contentOverrides = {}) => {
  const mockContent = createMockContent(contentOverrides)

  return {
    content: mockContent,
    isLoading: false,
    updateContent: vi.fn(),
    reloadContent: vi.fn(),
  }
}

// Mock для framer-motion
export const mockFramerMotion = () => {
  vi.mock('framer-motion', () => ({
    motion: {
      div: ({ children, ...props }) => <div {...props}>{children}</div>,
      section: ({ children, ...props }) => <section {...props}>{children}</section>,
      h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
      h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
      p: ({ children, ...props }) => <p {...props}>{children}</p>,
      button: ({ children, ...props }) => <button {...props}>{children}</button>,
      img: ({ children, ...props }) => <img {...props}>{children}</img>,
    },
    AnimatePresence: ({ children }) => children,
    useAnimation: () => ({
      start: vi.fn(),
      stop: vi.fn(),
      set: vi.fn(),
    }),
    useInView: () => true,
  }))
}

// Mock для react-helmet-async
export const mockHelmet = () => {
  vi.mock('react-helmet-async', () => ({
    Helmet: ({ children }) => children,
    HelmetProvider: ({ children }) => children,
  }))
}

// Утиліти для тестування доступності
export const axeAccessibilityTest = async container => {
  const { axe, toHaveNoViolations } = await import('jest-axe')
  expect.extend(toHaveNoViolations)

  const results = await axe(container)
  expect(results).toHaveNoViolations()
}

// Утиліти для тестування форм
export const fillForm = async formData => {
  const user = userEvent.setup()

  for (const [fieldName, value] of Object.entries(formData)) {
    const field = screen.getByLabelText(new RegExp(fieldName, 'i'))
    if (field.type === 'checkbox' || field.type === 'radio') {
      if (value) {
        await user.click(field)
      }
    } else {
      await user.clear(field)
      await user.type(field, value)
    }
  }
}

// Утиліти для тестування медіа
export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = vi.fn()
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  })

  window.IntersectionObserver = mockIntersectionObserver
  window.IntersectionObserverEntry = vi.fn()
}

// Утиліти для тестування анімацій
export const waitForAnimation = (duration = 100) => {
  return new Promise(resolve => setTimeout(resolve, duration))
}

// Утиліти для тестування лейзі лоадингу
export const triggerIntersection = (element, isIntersecting = true) => {
  const mockObserver = element._observer
  if (mockObserver && mockObserver.callback) {
    mockObserver.callback([
      {
        target: element,
        isIntersecting,
        intersectionRatio: isIntersecting ? 1 : 0,
      },
    ])
  }
}

// Експортуємо все необхідне
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
export { customRender as render }

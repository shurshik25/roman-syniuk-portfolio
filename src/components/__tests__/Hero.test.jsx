import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '../../test/test-utils'
import Hero from '../Hero'
import { mockUseContent, mockFramerMotion } from '../../test/test-utils'

// Mock useContent hook
vi.mock('../../hooks/useContent', () => ({
  useContent: () => mockUseContent(),
}))

// Mock framer-motion
mockFramerMotion()

describe('Hero Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders hero section with actor name and title', () => {
    render(<Hero />)

    expect(screen.getByText('Test Actor')).toBeInTheDocument()
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('displays statistics correctly', () => {
    render(<Hero />)

    expect(screen.getByText('10+')).toBeInTheDocument()
    expect(screen.getByText('5+')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('renders profile image with correct alt text', () => {
    render(<Hero />)

    const profileImage = screen.getByAltText('Test Actor')
    expect(profileImage).toBeInTheDocument()
    expect(profileImage).toHaveAttribute('src', '/test-image.jpg')
  })

  it('has proper semantic structure', () => {
    render(<Hero />)

    const heroSection = screen.getByRole('banner')
    expect(heroSection).toBeInTheDocument()

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Test Actor')
  })

  it('renders CTA buttons', () => {
    render(<Hero />)

    const portfolioButton = screen.getByRole('link', { name: /портфоліо/i })
    const contactButton = screen.getByRole('link', { name: /контакти/i })

    expect(portfolioButton).toBeInTheDocument()
    expect(contactButton).toBeInTheDocument()

    expect(portfolioButton).toHaveAttribute('href', '#portfolio')
    expect(contactButton).toHaveAttribute('href', '#contact')
  })

  it('handles missing content gracefully', () => {
    vi.mock('../../hooks/useContent', () => ({
      useContent: () => ({
        content: {
          hero: {
            name: '',
            title: '',
            description: '',
            profileImage: '',
            stats: {},
          },
        },
        isLoading: false,
      }),
    }))

    render(<Hero />)

    // Компонент повинен рендеритися без помилок навіть з порожнім контентом
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('applies gradient background correctly', () => {
    const { container } = render(<Hero />)

    const heroSection = container.querySelector('section')
    expect(heroSection).toHaveClass('gradient-bg')
  })

  it('has responsive design classes', () => {
    const { container } = render(<Hero />)

    const heroSection = container.querySelector('section')
    expect(heroSection).toHaveClass('min-h-screen')

    // Перевіряємо наявність responsive класів
    const contentDiv = container.querySelector('.container-custom')
    expect(contentDiv).toBeInTheDocument()
  })
})

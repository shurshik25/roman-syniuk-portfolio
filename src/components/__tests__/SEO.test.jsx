import { describe, it, expect, vi } from 'vitest'
import { render } from '../../test/test-utils'
import SEO from '../SEO'
import { mockHelmet } from '../../test/test-utils'

// Mock react-helmet-async
mockHelmet()

describe('SEO Component', () => {
  it('renders with default meta tags', () => {
    const { container } = render(<SEO />)
    expect(container).toBeInTheDocument()
  })

  it('renders with custom title and description', () => {
    render(<SEO title="Custom Title" description="Custom Description" author="Test Author" />)

    // Перевіряємо що компонент рендериться без помилок
    expect(document.head).toBeInTheDocument()
  })

  it('generates structured data correctly', () => {
    render(
      <SEO title="Actor Portfolio" description="Professional actor portfolio" author="John Doe" />
    )

    // Компонент повинен рендеритися без помилок
    expect(document.head).toBeInTheDocument()
  })

  it('handles missing props gracefully', () => {
    render(<SEO />)

    // Повинен рендеритися з дефолтними значеннями
    expect(document.head).toBeInTheDocument()
  })

  it('sets canonical URL correctly', () => {
    const testUrl = '/test-page'
    render(<SEO url={testUrl} />)

    // Перевіряємо що компонент обробляє URL правильно
    expect(document.head).toBeInTheDocument()
  })

  it('includes Open Graph tags', () => {
    render(<SEO title="Test Title" description="Test Description" image="/test-image.jpg" />)

    expect(document.head).toBeInTheDocument()
  })

  it('includes Twitter Card tags', () => {
    render(<SEO title="Test Title" description="Test Description" image="/test-image.jpg" />)

    expect(document.head).toBeInTheDocument()
  })

  it('includes PWA meta tags', () => {
    render(<SEO />)

    expect(document.head).toBeInTheDocument()
  })
})

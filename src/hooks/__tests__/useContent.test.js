import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useContent } from '../useContent'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock fetch
global.fetch = vi.fn()

describe('useContent Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    fetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          hero: {
            name: 'Fetched Actor',
            title: 'Fetched Title',
          },
        }),
    })
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('returns initial loading state', () => {
    const { result } = renderHook(() => useContent())

    expect(result.current.isLoading).toBe(true)
    expect(result.current.content).toBeDefined()
  })

  it('loads content from localStorage when available', async () => {
    const savedContent = {
      hero: {
        name: 'Saved Actor',
        title: 'Saved Title',
      },
    }

    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedContent))

    const { result } = renderHook(() => useContent())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.content.hero.name).toBe('Saved Actor')
    expect(localStorageMock.getItem).toHaveBeenCalledWith('portfolio-content')
  })

  it('fetches content from API when localStorage is empty', async () => {
    localStorageMock.getItem.mockReturnValue(null)

    const { result } = renderHook(() => useContent())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(fetch).toHaveBeenCalledWith('/content.json')
    expect(result.current.content.hero.name).toBe('Fetched Actor')
  })

  it('uses fallback data when both localStorage and API fail', async () => {
    localStorageMock.getItem.mockReturnValue(null)
    fetch.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useContent())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Повинен використовувати fallback дані
    expect(result.current.content).toBeDefined()
    expect(result.current.content.hero).toBeDefined()
  })

  it('updateContent function works correctly', async () => {
    const { result } = renderHook(() => useContent())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const newValue = 'Updated Name'
    result.current.updateContent('hero', 'name', newValue)

    expect(result.current.content.hero.name).toBe(newValue)
    expect(localStorageMock.setItem).toHaveBeenCalled()
  })

  it('handles malformed localStorage data gracefully', async () => {
    localStorageMock.getItem.mockReturnValue('invalid json')

    const { result } = renderHook(() => useContent())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Повинен перейти до fallback даних
    expect(result.current.content).toBeDefined()
    expect(fetch).toHaveBeenCalledWith('/content.json')
  })

  it('saveContent function persists data to localStorage', async () => {
    const { result } = renderHook(() => useContent())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    result.current.saveContent()

    expect(localStorageMock.setItem).toHaveBeenCalledWith('portfolio-content', expect.any(String))
  })

  it('reloadContent function clears cache and reloads', async () => {
    const { result } = renderHook(() => useContent())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    result.current.reloadContent()

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('portfolio-content')
    expect(result.current.isLoading).toBe(true)
  })

  it('handles API 404 responses correctly', async () => {
    localStorageMock.getItem.mockReturnValue(null)
    fetch.mockResolvedValue({
      ok: false,
      status: 404,
    })

    const { result } = renderHook(() => useContent())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Повинен використовувати fallback дані
    expect(result.current.content).toBeDefined()
  })
})

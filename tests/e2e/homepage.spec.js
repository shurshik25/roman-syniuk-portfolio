import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load homepage successfully', async ({ page }) => {
    // Перевіряємо що сторінка завантажилася
    await expect(page).toHaveTitle(/Портфоліо Актора/)
    
    // Перевіряємо наявність основних секцій
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })

  test('should display hero section correctly', async ({ page }) => {
    // Очікуємо завантаження hero секції
    await page.waitForSelector('[data-testid="hero-section"]', { timeout: 10000 })
    
    // Перевіряємо наявність основних елементів
    const heroSection = page.locator('[data-testid="hero-section"]')
    await expect(heroSection).toBeVisible()
    
    // Перевіряємо наявність тексту (може бути fallback дані)
    await expect(heroSection.locator('h1')).toBeVisible()
    await expect(heroSection.locator('p')).toBeVisible()
  })

  test('should navigate between sections', async ({ page }) => {
    // Перевіряємо навігацію
    const navbar = page.locator('nav')
    await expect(navbar).toBeVisible()

    // Клікаємо на портфоліо
    await page.click('a[href="#portfolio"]')
    await page.waitForURL('*#portfolio')
    
    // Перевіряємо що секція портфоліо видима
    const portfolioSection = page.locator('#portfolio')
    await expect(portfolioSection).toBeInViewport()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Встановлюємо мобільний viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Перевіряємо що контент адаптується
    await expect(page.locator('main')).toBeVisible()
    
    // Перевіряємо мобільну навігацію (якщо є)
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
  })

  test('should have accessible navigation', async ({ page }) => {
    // Перевіряємо клавіатурну навігацію
    await page.keyboard.press('Tab')
    
    // Перевіряємо skip link
    const skipLink = page.locator('a[href="#main-content"]')
    if (await skipLink.isVisible()) {
      await expect(skipLink).toBeFocused()
    }
  })

  test('should load without JavaScript errors', async ({ page }) => {
    const errors = []
    page.on('pageerror', error => errors.push(error))
    
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Не повинно бути критичних помилок
    const criticalErrors = errors.filter(error => 
      !error.message.includes('Warning') && 
      !error.message.includes('DevTools')
    )
    expect(criticalErrors).toHaveLength(0)
  })

  test('should have proper meta tags', async ({ page }) => {
    // Перевіряємо SEO meta теги
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/)
    await expect(page.locator('meta[name="keywords"]')).toHaveAttribute('content', /.+/)
    
    // Перевіряємо Open Graph теги
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /.+/)
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /.+/)
  })

  test('should handle offline state', async ({ page, context }) => {
    // Симулюємо офлайн режим
    await context.setOffline(true)
    
    await page.goto('/')
    
    // Перевіряємо що сторінка все ще працює (завдяки PWA)
    await expect(page.locator('main')).toBeVisible()
    
    // Повертаємо онлайн
    await context.setOffline(false)
  })
})

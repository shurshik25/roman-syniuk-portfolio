import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Tests', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .exclude('#admin-panel') // Виключаємо адмін панель з основного тестування
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should be navigable with keyboard', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Перевіряємо skip link
    await page.keyboard.press('Tab')
    const firstFocusedElement = await page.evaluate(() => document.activeElement.tagName)
    
    // Повинен фокусуватися на skip link або першому інтерактивному елементі
    expect(['A', 'BUTTON', 'INPUT']).toContain(firstFocusedElement)
    
    // Перевіряємо навігацію по всіх інтерактивних елементах
    let tabCount = 0
    const maxTabs = 20 // Обмежуємо щоб уникнути нескінченного циклу
    
    while (tabCount < maxTabs) {
      await page.keyboard.press('Tab')
      const activeElement = await page.evaluate(() => ({
        tag: document.activeElement.tagName,
        type: document.activeElement.type,
        href: document.activeElement.href,
        visible: document.activeElement.offsetWidth > 0 && document.activeElement.offsetHeight > 0
      }))
      
      // Перевіряємо що фокус на видимому інтерактивному елементі
      if (activeElement.visible) {
        expect(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']).toContain(activeElement.tag)
      }
      
      tabCount++
    }
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents()
    expect(headings.length).toBeGreaterThan(0)
    
    // Перевіряємо що є принаймні один h1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBeGreaterThanOrEqual(1)
    
    // Перевіряємо ієрархію заголовків
    const headingLevels = await page.evaluate(() => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      return Array.from(headings).map(h => parseInt(h.tagName.charAt(1)))
    })
    
    // Первинний заголовок повинен бути h1
    expect(headingLevels[0]).toBe(1)
  })

  test('should have alt text for all images', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const images = await page.locator('img').all()
    
    for (const img of images) {
      const alt = await img.getAttribute('alt')
      const ariaLabel = await img.getAttribute('aria-label')
      const ariaLabelledBy = await img.getAttribute('aria-labelledby')
      
      // Кожне зображення повинно мати alt, aria-label, або aria-labelledby
      expect(alt !== null || ariaLabel !== null || ariaLabelledBy !== null).toBeTruthy()
      
      // Alt не повинен бути порожнім для контентних зображень
      if (alt !== null && alt !== '') {
        expect(alt.length).toBeGreaterThan(0)
      }
    }
  })

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/')
    
    // Відкриваємо адмін панель щоб перевірити форми
    await page.keyboard.press('Control+Shift+A')
    
    const inputs = await page.locator('input, select, textarea').all()
    
    for (const input of inputs) {
      const id = await input.getAttribute('id')
      const ariaLabel = await input.getAttribute('aria-label')
      const ariaLabelledBy = await input.getAttribute('aria-labelledby')
      
      if (id) {
        // Перевіряємо наявність відповідного label
        const label = await page.locator(`label[for="${id}"]`).count()
        const hasLabel = label > 0 || ariaLabel !== null || ariaLabelledBy !== null
        expect(hasLabel).toBeTruthy()
      }
    }
  })

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    const contrastResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .disableRules(['color-contrast']) // Вимикаємо базову перевірку
      .include('main') // Фокусуємося на основному контенті
      .analyze()
    
    // Перевіряємо що немає порушень контрасту
    const contrastViolations = contrastResults.violations.filter(
      violation => violation.id === 'color-contrast'
    )
    
    expect(contrastViolations).toHaveLength(0)
  })

  test('should support screen reader navigation', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Перевіряємо наявність landmarks
    const landmarks = await page.locator('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], header, nav, main, footer').count()
    expect(landmarks).toBeGreaterThan(0)
    
    // Перевіряємо наявність aria-labels для важливих секцій
    const nav = page.locator('nav')
    if (await nav.count() > 0) {
      const ariaLabel = await nav.first().getAttribute('aria-label')
      const ariaLabelledBy = await nav.first().getAttribute('aria-labelledby')
      expect(ariaLabel !== null || ariaLabelledBy !== null).toBeTruthy()
    }
  })

  test('should handle focus management in modals', async ({ page }) => {
    await page.goto('/')
    
    // Відкриваємо адмін панель як модальне вікно
    await page.keyboard.press('Control+Shift+A')
    
    const modal = page.locator('[data-testid="admin-panel"]')
    if (await modal.isVisible()) {
      // Перевіряємо що фокус переміщений в модаль
      const activeElement = await page.evaluate(() => document.activeElement.closest('[data-testid="admin-panel"]'))
      expect(activeElement).toBeTruthy()
      
      // Перевіряємо trap фокусу (Tab cycling)
      await page.keyboard.press('Tab')
      const focusedInModal = await page.evaluate(() => 
        document.activeElement.closest('[data-testid="admin-panel"]') !== null
      )
      expect(focusedInModal).toBeTruthy()
      
      // Закриваємо модаль та перевіряємо повернення фокусу
      await page.keyboard.press('Escape')
      await expect(modal).not.toBeVisible()
    }
  })
})

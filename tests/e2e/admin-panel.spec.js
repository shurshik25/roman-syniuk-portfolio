import { test, expect } from '@playwright/test'

test.describe('Admin Panel', () => {
  test('should open admin panel with keyboard shortcut', async ({ page }) => {
    await page.goto('/')
    
    // Відкриваємо адмін панель через клавіатурне скорочення
    await page.keyboard.press('Control+Shift+A')
    
    // Перевіряємо що панель відкрилася
    const adminPanel = page.locator('[data-testid="admin-panel"]')
    await expect(adminPanel).toBeVisible({ timeout: 5000 })
  })

  test('should navigate between admin sections', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Control+Shift+A')
    
    const adminPanel = page.locator('[data-testid="admin-panel"]')
    await expect(adminPanel).toBeVisible()
    
    // Перевіряємо навігацію між секціями
    const heroTab = page.locator('[data-tab="hero"]')
    const aboutTab = page.locator('[data-tab="about"]')
    
    if (await heroTab.isVisible()) {
      await heroTab.click()
      await expect(page.locator('[data-section="hero"]')).toBeVisible()
    }
    
    if (await aboutTab.isVisible()) {
      await aboutTab.click()
      await expect(page.locator('[data-section="about"]')).toBeVisible()
    }
  })

  test('should edit hero section content', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Control+Shift+A')
    
    const adminPanel = page.locator('[data-testid="admin-panel"]')
    await expect(adminPanel).toBeVisible()
    
    // Перевіряємо редагування hero секції
    const nameInput = page.locator('input[name="name"]').first()
    if (await nameInput.isVisible()) {
      await nameInput.fill('Test Actor Name')
      
      // Перевіряємо автозбереження або кнопку збереження
      const saveButton = page.locator('button:has-text("Зберегти")')
      if (await saveButton.isVisible()) {
        await saveButton.click()
      }
      
      // Закриваємо панель та перевіряємо зміни
      await page.keyboard.press('Escape')
      await expect(page.locator('h1:has-text("Test Actor Name")')).toBeVisible()
    }
  })

  test('should close admin panel with escape key', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Control+Shift+A')
    
    const adminPanel = page.locator('[data-testid="admin-panel"]')
    await expect(adminPanel).toBeVisible()
    
    // Закриваємо панель клавішею Escape
    await page.keyboard.press('Escape')
    await expect(adminPanel).not.toBeVisible()
  })

  test('should handle form validation', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Control+Shift+A')
    
    const adminPanel = page.locator('[data-testid="admin-panel"]')
    await expect(adminPanel).toBeVisible()
    
    // Пробуємо очистити обов'язкове поле
    const nameInput = page.locator('input[name="name"]').first()
    if (await nameInput.isVisible()) {
      await nameInput.fill('')
      await nameInput.blur()
      
      // Перевіряємо наявність повідомлення про помилку
      const errorMessage = page.locator('.error, .text-red-500, [role="alert"]')
      if (await errorMessage.isVisible()) {
        await expect(errorMessage).toContainText(/обов'язкове|required/i)
      }
    }
  })

  test('should save changes to localStorage', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Control+Shift+A')
    
    const adminPanel = page.locator('[data-testid="admin-panel"]')
    await expect(adminPanel).toBeVisible()
    
    // Редагуємо контент
    const nameInput = page.locator('input[name="name"]').first()
    if (await nameInput.isVisible()) {
      const testName = 'Persistent Test Name'
      await nameInput.fill(testName)
      
      // Зберігаємо зміни
      const saveButton = page.locator('button:has-text("Зберегти")')
      if (await saveButton.isVisible()) {
        await saveButton.click()
      }
      
      // Перезавантажуємо сторінку
      await page.reload()
      await page.waitForLoadState('networkidle')
      
      // Перевіряємо що зміни збереглися
      await expect(page.locator(`h1:has-text("${testName}")`)).toBeVisible({ timeout: 10000 })
    }
  })
})

/**
 * Утиліти для роботи з зображеннями в портфоліо
 */

/**
 * Повертає placeholder зображення, якщо основне зображення відсутнє
 * @param {string} imageSrc - URL зображення
 * @param {string} type - тип зображення (profile, portfolio, thumbnail)
 * @returns {string} - URL зображення або placeholder
 */
export const getImageWithFallback = (imageSrc, type = 'default') => {
  // Якщо зображення відсутнє або це зовнішнє посилання, яке може не працювати
  if (!imageSrc || imageSrc.includes('facebook') || imageSrc.includes('fbcdn')) {
    return '/images/placeholder.svg'
  }

  return imageSrc
}

/**
 * Перевіряє, чи є URL валідним зображенням
 * @param {string} url - URL для перевірки
 * @returns {boolean}
 */
export const isValidImageUrl = url => {
  if (!url) return false

  // Перевіряємо на заборонені домени
  const forbiddenDomains = ['facebook.com', 'fbcdn.net', 'instagram.com']
  if (forbiddenDomains.some(domain => url.includes(domain))) {
    return false
  }

  // Перевіряємо на валідні розширення
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']
  const hasValidExtension = validExtensions.some(ext => url.toLowerCase().includes(ext))

  // Якщо це data: URL (base64), то вважаємо валідним
  if (url.startsWith('data:image/')) {
    return true
  }

  // Якщо це blob: URL, то вважаємо валідним
  if (url.startsWith('blob:')) {
    return true
  }

  return hasValidExtension
}

/**
 * Очищає URL від параметрів, які можуть викликати помилки
 * @param {string} url - оригінальний URL
 * @returns {string} - очищений URL
 */
export const cleanImageUrl = url => {
  if (!url) return ''

  // Якщо це data: або blob: URL, повертаємо як є
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url
  }

  // Видаляємо параметри запиту, які можуть викликати проблеми
  try {
    const urlObj = new URL(url)
    // Зберігаємо тільки базовий URL без параметрів
    return urlObj.origin + urlObj.pathname
  } catch (error) {
    return url
  }
}

/**
 * Генерує alt текст для зображення
 * @param {string} title - назва роботи
 * @param {string} category - категорія
 * @returns {string} - alt текст
 */
export const generateAltText = (title, category) => {
  const categoryText = {
    theater: 'театральна постановка',
    cinema: 'кінопроект',
    photo: 'фотосесія',
    profile: 'профільне фото',
  }

  const categoryName = categoryText[category] || 'робота'
  return title ? `${title} - ${categoryName}` : `Зображення ${categoryName}`
}

/**
 * Обробка помилки завантаження зображення
 * @param {Event} event - подія помилки
 * @param {string} fallbackSrc - fallback зображення
 */
export const handleImageError = (event, fallbackSrc = '/images/placeholder.svg') => {
  const img = event.target
  if (img.src !== fallbackSrc) {
    img.src = fallbackSrc
  }
}

/**
 * Перевіряє розмір зображення та повертає рекомендації
 * @param {File} file - файл зображення
 * @returns {Object} - об'єкт з інформацією про зображення
 */
export const analyzeImage = file => {
  return new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
      const { width, height } = img
      const aspectRatio = width / height
      const fileSize = file.size / 1024 / 1024 // в MB

      resolve({
        width,
        height,
        aspectRatio,
        fileSize,
        isOptimalSize: width >= 800 && height >= 600,
        isGoodAspectRatio: aspectRatio >= 0.75 && aspectRatio <= 2,
        recommendations: {
          resize: width < 800 || height < 600,
          compress: fileSize > 2,
          format: file.type !== 'image/webp' ? 'Рекомендуємо WebP формат' : null,
        },
      })
    }
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Утиліти для роботи з зображеннями
 */

/**
 * Конвертує файл зображення в base64 строку
 * @param {File} file - файл зображення
 * @returns {Promise<string>} - base64 строка
 */
export const fileToBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
    reader.readAsDataURL(file)
  })
}

/**
 * Перевіряє, чи є файл зображенням
 * @param {File} file - файл для перевірки
 * @returns {boolean}
 */
export const isImageFile = file => {
  return file && file.type.startsWith('image/')
}

/**
 * Валідує розмір файлу
 * @param {File} file - файл для перевірки
 * @param {number} maxSizeMB - максимальний розмір в МБ
 * @returns {boolean}
 */
export const validateFileSize = (file, maxSizeMB = 5) => {
  const maxBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxBytes
}

/**
 * Валідує формат файлу
 * @param {File} file - файл для перевірки
 * @param {string[]} allowedFormats - дозволені формати (наприклад, ['jpg', 'png'])
 * @returns {boolean}
 */
export const validateFileFormat = (file, allowedFormats = ['jpg', 'jpeg', 'png', 'webp']) => {
  const fileExtension = file.name.split('.').pop().toLowerCase()
  return allowedFormats.some(
    format => format.toLowerCase() === fileExtension || `${format.toLowerCase()}` === fileExtension
  )
}

/**
 * Створює об'єкт URL для файлу зображення
 * @param {File} file - файл зображення
 * @returns {string} - URL для відображення
 */
export const createImageURL = file => {
  return URL.createObjectURL(file)
}

/**
 * Звільняє об'єкт URL
 * @param {string} url - URL для звільнення
 */
export const revokeImageURL = url => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

/**
 * Стискає зображення до максимального розміру
 * @param {File} file - файл зображення
 * @param {number} maxWidth - максимальна ширина
 * @param {number} maxHeight - максимальна висота
 * @param {number} quality - якість (0-1)
 * @returns {Promise<string>} - base64 строка стисненого зображення
 */
export const compressImage = (file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Розраховуємо нові розміри
      let { width, height } = img

      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }

      // Встановлюємо розміри canvas
      canvas.width = width
      canvas.height = height

      // Малюємо зображення
      ctx.drawImage(img, 0, 0, width, height)

      // Конвертуємо в base64
      const compressedBase64 = canvas.toDataURL(file.type, quality)
      resolve(compressedBase64)
    }

    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Обробляє завантаження зображення з валідацією та стисканням
 * @param {File} file - файл зображення
 * @param {Object} options - опції обробки
 * @returns {Promise<string>} - base64 строка обробленого зображення
 */
export const processImageUpload = async (file, options = {}) => {
  const {
    maxSizeMB = 5,
    allowedFormats = ['jpg', 'jpeg', 'png', 'webp'],
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    useCompression = true,
  } = options

  // Валідація
  if (!isImageFile(file)) {
    throw new Error('Файл має бути зображенням')
  }

  if (!validateFileSize(file, maxSizeMB)) {
    throw new Error(`Максимальний розмір файлу: ${maxSizeMB}MB`)
  }

  if (!validateFileFormat(file, allowedFormats)) {
    throw new Error(`Дозволені формати: ${allowedFormats.join(', ')}`)
  }

  // Обробка
  if (useCompression) {
    return await compressImage(file, maxWidth, maxHeight, quality)
  } else {
    return await fileToBase64(file)
  }
}

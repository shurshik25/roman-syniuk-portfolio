/**
 * Утиліти для роботи з YouTube посиланнями
 */

/**
 * Отримує YouTube ID з різних форматів посилань
 * @param {string} url - YouTube посилання
 * @returns {string|null} - YouTube ID або null
 */
export const getYouTubeId = url => {
  if (!url) return null

  // Різні формати YouTube посилань
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }

  return null
}

/**
 * Створює embed URL для YouTube
 * @param {string} youtubeId - YouTube ID
 * @returns {string} - Embed URL
 */
export const getYouTubeEmbedUrl = youtubeId => {
  if (!youtubeId) return ''
  return `https://www.youtube.com/embed/${youtubeId}`
}

/**
 * Створює thumbnail URL для YouTube
 * @param {string} youtubeId - YouTube ID
 * @param {string} quality - Якість (default, hq, mq, sd, maxres)
 * @returns {string} - Thumbnail URL
 */
export const getYouTubeThumbnail = (youtubeId, quality = 'hq') => {
  if (!youtubeId) return ''

  const qualities = {
    default: 'default',
    hq: 'hqdefault',
    mq: 'mqdefault',
    sd: 'sddefault',
    maxres: 'maxresdefault',
  }

  const selectedQuality = qualities[quality] || qualities.hq
  return `https://img.youtube.com/vi/${youtubeId}/${selectedQuality}.jpg`
}

/**
 * Перевіряє, чи є посилання YouTube
 * @param {string} url - URL для перевірки
 * @returns {boolean} - true якщо це YouTube посилання
 */
export const isYouTubeUrl = url => {
  if (!url) return false
  return url.includes('youtube.com') || url.includes('youtu.be')
}

/**
 * Отримує коротку форму YouTube посилання
 * @param {string} url - Повне YouTube посилання
 * @returns {string} - Коротка форма
 */
export const getShortYouTubeUrl = url => {
  const id = getYouTubeId(url)
  if (!id) return url
  return `https://youtu.be/${id}`
}

/**
 * Валідує YouTube посилання
 * @param {string} url - URL для валідації
 * @returns {object} - Результат валідації
 */
export const validateYouTubeUrl = url => {
  if (!url) {
    return { isValid: false, error: 'URL не може бути порожнім' }
  }

  if (!isYouTubeUrl(url)) {
    return { isValid: false, error: 'Це не YouTube посилання' }
  }

  const id = getYouTubeId(url)
  if (!id) {
    return { isValid: false, error: 'Неправильний формат YouTube посилання' }
  }

  return { isValid: true, id, embedUrl: getYouTubeEmbedUrl(id) }
}

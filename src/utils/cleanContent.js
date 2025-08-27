/**
 * Утиліта для очищення контенту від недійсних зображень
 */

/**
 * Очищає об'єкт контенту від зовнішніх посилань та недійсних URL
 * @param {Object} content - об'єкт контенту
 * @returns {Object} - очищений об'єкт контенту
 */
export const cleanContent = content => {
  const cleaned = JSON.parse(JSON.stringify(content)) // глибока копія

  // Функція для очищення зображень
  const cleanImage = imageUrl => {
    if (!imageUrl) return ''

    // Видаляємо зовнішні посилання Facebook/Instagram
    if (
      imageUrl.includes('facebook') ||
      imageUrl.includes('fbcdn') ||
      imageUrl.includes('instagram') ||
      imageUrl.includes('scontent')
    ) {
      return ''
    }

    return imageUrl
  }

  // Очищаємо профільне зображення
  if (cleaned.hero?.profileImage) {
    cleaned.hero.profileImage = cleanImage(cleaned.hero.profileImage)
  }

  // Очищаємо зображення портфоліо
  if (cleaned.portfolio?.works && Array.isArray(cleaned.portfolio.works)) {
    cleaned.portfolio.works = cleaned.portfolio.works.map(work => ({
      ...work,
      image: cleanImage(work.image),
    }))
  }

  // Очищаємо превью відео
  if (cleaned.videoRepertoire?.videos && Array.isArray(cleaned.videoRepertoire.videos)) {
    cleaned.videoRepertoire.videos = cleaned.videoRepertoire.videos.map(video => ({
      ...video,
      thumbnail: cleanImage(video.thumbnail),
    }))
  }

  return cleaned
}

/**
 * Очищає localStorage від недійсних посилань
 */
export const cleanLocalStorage = () => {
  try {
    const saved = localStorage.getItem('portfolio-content')
    if (saved) {
      const content = JSON.parse(saved)
      const cleanedContent = cleanContent(content)
      localStorage.setItem('portfolio-content', JSON.stringify(cleanedContent))
      console.log('✅ LocalStorage очищено від недійсних посилань')
      return true
    }
  } catch (error) {
    console.error('Помилка очищення localStorage:', error)
    return false
  }
  return false
}

/**
 * Скидає localStorage до початкового стану
 */
export const resetToCleanState = () => {
  localStorage.removeItem('portfolio-content')
  console.log('🔄 LocalStorage скинуто до початкового стану')
}

/**
 * Менеджер для роботи з blob URLs
 * Відслідковує створені URLs та очищає їх при потребі
 */

class BlobManager {
  constructor() {
    this.activeBlobs = new Set()
  }

  /**
   * Створює blob URL та додає до списку активних
   * @param {File} file - файл для створення URL
   * @returns {string} - blob URL
   */
  createBlobURL(file) {
    const url = URL.createObjectURL(file)
    this.activeBlobs.add(url)
    console.log('📸 Створено blob URL:', url)
    return url
  }

  /**
   * Очищає конкретний blob URL
   * @param {string} url - URL для очищення
   */
  revokeBlobURL(url) {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url)
      this.activeBlobs.delete(url)
      console.log('🗑️ Очищено blob URL:', url)
    }
  }

  /**
   * Очищає всі активні blob URLs
   */
  revokeAllBlobs() {
    this.activeBlobs.forEach(url => {
      URL.revokeObjectURL(url)
    })
    console.log(`🧹 Очищено ${this.activeBlobs.size} blob URLs`)
    this.activeBlobs.clear()
  }

  /**
   * Повертає кількість активних blob URLs
   * @returns {number}
   */
  getActiveBlobCount() {
    return this.activeBlobs.size
  }

  /**
   * Повертає список всіх активних blob URLs
   * @returns {string[]}
   */
  getActiveBlobs() {
    return Array.from(this.activeBlobs)
  }
}

// Глобальний інстанс менеджера
export const blobManager = new BlobManager()

// Очищення при перезавантаженні сторінки
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    blobManager.revokeAllBlobs()
  })
}

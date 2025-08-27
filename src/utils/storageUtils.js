/**
 * Утиліти для роботи з localStorage та моніторингу розміру
 */

/**
 * Отримує розмір localStorage в байтах
 * @returns {number} - розмір в байтах
 */
export const getLocalStorageSize = () => {
  let total = 0
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length
    }
  }
  return total
}

/**
 * Форматує розмір у зручному вигляді
 * @param {number} bytes - розмір в байтах
 * @returns {string} - відформатований рядок
 */
export const formatSize = bytes => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Перевіряє, чи можна зберегти дані в localStorage
 * @param {string} data - дані для збереження
 * @param {string} key - ключ для збереження
 * @returns {boolean} - чи можна зберегти
 */
export const canStoreInLocalStorage = (data, key = 'test') => {
  try {
    const testKey = `__storage_test_${key}`
    localStorage.setItem(testKey, data)
    localStorage.removeItem(testKey)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Отримує статистику використання localStorage
 * @returns {object} - об'єкт зі статистикою
 */
export const getStorageStats = () => {
  const totalSize = getLocalStorageSize()
  const maxSize = 10 * 1024 * 1024 // 10MB приблизний ліміт
  const usagePercent = Math.round((totalSize / maxSize) * 100)

  const itemsStats = []
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      const itemSize = localStorage[key].length + key.length
      itemsStats.push({
        key,
        size: itemSize,
        formattedSize: formatSize(itemSize),
      })
    }
  }

  // Сортуємо за розміром
  itemsStats.sort((a, b) => b.size - a.size)

  return {
    totalSize,
    formattedTotalSize: formatSize(totalSize),
    maxSize,
    formattedMaxSize: formatSize(maxSize),
    usagePercent,
    itemsCount: itemsStats.length,
    items: itemsStats,
  }
}

/**
 * Очищає найбільші елементи localStorage
 * @param {number} count - кількість елементів для видалення
 */
export const cleanLargestItems = (count = 1) => {
  const stats = getStorageStats()
  const itemsToDelete = stats.items.slice(0, count)

  itemsToDelete.forEach(item => {
    localStorage.removeItem(item.key)
    console.log(`🗑️ Видалено ${item.key} (${item.formattedSize})`)
  })

  return itemsToDelete
}

/**
 * Логує статистику localStorage в консоль
 */
export const logStorageStats = () => {
  const stats = getStorageStats()

  console.group('📊 localStorage Statistics')
  console.log(
    `📦 Загальний розмір: ${stats.formattedTotalSize} / ${stats.formattedMaxSize} (${stats.usagePercent}%)`
  )
  console.log(`📄 Кількість елементів: ${stats.itemsCount}`)

  if (stats.items.length > 0) {
    console.group('📋 Найбільші елементи:')
    stats.items.slice(0, 5).forEach((item, index) => {
      console.log(`${index + 1}. ${item.key}: ${item.formattedSize}`)
    })
    console.groupEnd()
  }

  if (stats.usagePercent > 80) {
    console.warn('⚠️ localStorage майже заповнений! Розгляньте очищення.')
  }

  console.groupEnd()
}

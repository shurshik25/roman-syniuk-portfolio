export const adminTabs = [
  {
    id: 'hero',
    label: 'Головна секція',
    icon: '🏠',
    description: 'Основна інформація та профільне фото',
  },
  {
    id: 'about',
    label: 'Про мене',
    icon: '👤',
    description: 'Біографія, освіта, досвід та досягнення',
  },
  {
    id: 'portfolio',
    label: 'Портфоліо',
    icon: '🖼️',
    description: 'Фотороботи та проекти',
  },
  {
    id: 'videoRepertoire',
    label: 'Відео-репертуар',
    icon: '🎬',
    description: 'Театральні та кіно роботи',
  },
  {
    id: 'contact',
    label: 'Контакти',
    icon: '📞',
    description: 'Контактна інформація та соціальні мережі',
  },
  {
    id: 'export',
    label: 'Експорт/Імпорт',
    icon: '📦',
    description: 'Резервне копіювання та відновлення даних',
  },
]

export const portfolioCategories = [
  { id: 'all', label: 'Всі роботи', icon: '📋' },
  { id: 'photo', label: 'Фотосесії', icon: '📸' },
  { id: 'theater', label: 'Театр', icon: '🎭' },
  { id: 'cinema', label: 'Кіно', icon: '🎬' },
]

export const videoCategories = [
  { id: 'all', label: 'Всі відео', icon: '📹' },
  { id: 'theater', label: 'Театр', icon: '🎭' },
  { id: 'cinema', label: 'Кіно', icon: '🎬' },
  { id: 'tv', label: 'Телебачення', icon: '📺' },
]

export const quickActions = [
  { id: 'save', label: 'Зберегти', icon: '💾', shortcut: 'Ctrl+S' },
  { id: 'undo', label: 'Скасувати', icon: '↶', shortcut: 'Ctrl+Z' },
  { id: 'redo', label: 'Повторити', icon: '↷', shortcut: 'Ctrl+Shift+Z' },
  { id: 'search', label: 'Пошук', icon: '🔍', shortcut: 'Ctrl+F' },
  { id: 'preview', label: 'Перегляд', icon: '👁️', shortcut: 'Esc' },
]

export const fieldTypes = {
  TEXT: 'text',
  TEXTAREA: 'textarea',
  EMAIL: 'email',
  URL: 'url',
  NUMBER: 'number',
  IMAGE: 'image',
  ARRAY: 'array',
  OBJECT: 'object',
  BOOLEAN: 'boolean',
  SELECT: 'select',
}

export const validationRules = {
  required: value => value && value.trim() !== '',
  email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  url: value => {
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  },
  maxLength: max => value => !value || value.length <= max,
  minLength: min => value => !value || value.length >= min,
  number: value => !isNaN(Number(value)),
  positiveNumber: value => !isNaN(Number(value)) && Number(value) > 0,
}

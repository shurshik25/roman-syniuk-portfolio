import { useState, useEffect } from 'react'

// Початкові дані як fallback
const fallbackData = {
  hero: {
    name: 'Роман Синюк',
    title: 'Актор театру та кіно • Автор цифрового контенту',
    description:
      'Професійний актор з Хмельницького, спеціалізується на театральних постановках та кіноролях.',
    profileImage: '',
    stats: {
      roles: '50+',
      experience: '10+',
      availability: '100%',
    },
  },
  about: {
    biography: 'Роман Синюк - талановитий актор та автор цифрового контенту з Хмельницького.',
    education: [],
    experience: [],
    skills: [],
    achievements: [],
  },
  portfolio: {
    categories: [
      { id: 'all', label: 'Всі роботи' },
      { id: 'theater', label: 'Театр' },
      { id: 'cinema', label: 'Кіно' },
      { id: 'photo', label: 'Фотосесії' },
    ],
    works: [],
  },
  videoRepertoire: {
    categories: [
      { id: 'theater', label: 'Театр', icon: '🎭' },
      { id: 'cinema', label: 'Кіно', icon: '🎬' },
      { id: 'tv', label: 'Телебачення', icon: '📺' },
    ],
    videos: [],
  },
  contact: {
    location: 'Хмельницький, Україна',
    email: 'roma.sinuk@example.com',
    phone: '+380 XX XXX XX XX',
    social: {
      facebook: {
        url: 'https://facebook.com/roma.sinuk',
        username: '@roma.sinuk',
        followers: '2,4 тис. читачів',
      },
      instagram: {
        url: 'https://instagram.com/roma_vodoliy',
        username: '@roma_vodoliy',
        followers: 'Instagram профіль',
      },
      tiktok: {
        url: 'https://tiktok.com/@romavodoliy',
        username: '@romavodoliy',
        followers: 'TikTok профіль',
      },
    },
    projectAvailability: [],
    note: '',
  },
}

export const useContent = () => {
  const [content, setContent] = useState(fallbackData)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  // Функція для завантаження даних
  const loadContent = async () => {
    try {
      // Спочатку пробуємо завантажити з localStorage
      const saved = localStorage.getItem('portfolio-content')
      if (saved) {
        const parsedContent = JSON.parse(saved)
        console.log('useContent hook - завантажено з localStorage:', parsedContent)
        setContent(parsedContent)
        setIsLoading(false)
        return
      }

      // Якщо немає в localStorage, пробуємо завантажити з файлу
      try {
        const response = await fetch('/roman-syniuk-portfolio/content.json')
        if (response.ok) {
          const contentData = await response.json()
          console.log('useContent hook - завантажено з файлу:', contentData)
          setContent(contentData)
        } else {
          console.log('useContent hook - не вдалося завантажити файл, використовую fallback')
          setContent(fallbackData)
        }
      } catch (error) {
        console.log('useContent hook - помилка завантаження файлу, використовую fallback:', error)
        setContent(fallbackData)
      }
    } catch (error) {
      console.error('useContent hook - критична помилка:', error)
      setContent(fallbackData)
    } finally {
      setIsLoading(false)
    }
  }

  // Функція для ручного завантаження даних
  const reloadContent = async () => {
    setIsLoading(true)
    localStorage.removeItem('portfolio-content')
    await loadContent()
  }

  // Функція для оновлення контенту
  const updateContent = (field, value) => {
    setContent(prev => {
      // Визначаємо, в якій секції знаходиться поле
      let section = null
      
      // Перевіряємо різні секції
      if (prev.hero && prev.hero[field] !== undefined) {
        section = 'hero'
      } else if (prev.about && prev.about[field] !== undefined) {
        section = 'about'
      } else if (prev.portfolio && prev.portfolio[field] !== undefined) {
        section = 'portfolio'
      } else if (prev.videoRepertoire && prev.videoRepertoire[field] !== undefined) {
        section = 'videoRepertoire'
      } else if (prev.contact && prev.contact[field] !== undefined) {
        section = 'contact'
      }
      
      // Якщо поле не знайдено, за замовчуванням оновлюємо hero
      if (!section) {
        section = 'hero'
      }
      
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }
    })
  }

  // Функція для оновлення вкладених полів
  const updateNestedContent = (field, subField, value) => {
    console.log('updateNestedContent викликано:', { field, subField, value })
    
    setContent(prev => {
      // Розбиваємо subField на частини (наприклад: "facebook.url" -> ["facebook", "url"])
      const subFieldParts = subField.split('.')
      console.log('subFieldParts:', subFieldParts)
      
      // Визначаємо, в якій секції знаходиться поле
      let section = null
      
      // Перевіряємо різні секції
      if (prev.hero && prev.hero[field] !== undefined) {
        section = 'hero'
      } else if (prev.about && prev.about[field] !== undefined) {
        section = 'about'
      } else if (prev.portfolio && prev.portfolio[field] !== undefined) {
        section = 'portfolio'
      } else if (prev.videoRepertoire && prev.videoRepertoire[field] !== undefined) {
        section = 'videoRepertoire'
      } else if (prev.contact && prev.contact[field] !== undefined) {
        section = 'contact'
      }
      
      // Якщо поле не знайдено, за замовчуванням оновлюємо contact
      if (!section) {
        section = 'contact'
      }
      
      if (subFieldParts.length === 1) {
        // Простий випадок: field.subField
        console.log('Простий випадок:', { field, subField, value, section })
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: {
              ...prev[section][field],
              [subField]: value,
            },
          },
        }
      } else {
        // Складний випадок: field.subField1.subField2 (наприклад: "facebook.url")
        const [firstPart, secondPart] = subFieldParts
        console.log('Складний випадок:', { field, firstPart, secondPart, value, section })
        
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: {
              ...prev[section][field],
              [firstPart]: {
                ...prev[section][field]?.[firstPart],
                [secondPart]: value,
              },
            },
          },
        }
      }
    })
  }

  // Функція для оновлення масивів
  const updateArrayContent = (field, index, value) => {
    setContent(prev => {
      // Визначаємо, в якій секції знаходиться поле
      let section = null
      let sectionKey = null
      
      // Перевіряємо різні секції
      if (prev.portfolio && prev.portfolio[field] && Array.isArray(prev.portfolio[field])) {
        section = 'portfolio'
        sectionKey = field
      } else if (prev.contact && prev.contact[field] && Array.isArray(prev.contact[field])) {
        section = 'contact'
        sectionKey = field
      } else if (prev.about && prev.about[field] && Array.isArray(prev.about[field])) {
        section = 'about'
        sectionKey = field
      } else if (prev.videoRepertoire && prev.videoRepertoire[field] && Array.isArray(prev.videoRepertoire[field])) {
        section = 'videoRepertoire'
        sectionKey = field
      }
      
      if (!section) {
        console.warn(`updateArrayContent: ${field} не знайдено в жодній секції або не є масивом`)
        return prev
      }

      return {
        ...prev,
        [section]: {
          ...prev[section],
          [sectionKey]: prev[section][sectionKey].map((item, i) =>
            i === index ? { ...item, ...value } : item
          ),
        },
      }
    })
  }

  // Функція для додавання нового елемента в масив
  const addArrayItem = (field, newItem) => {
    setContent(prev => {
      // Визначаємо, в якій секції знаходиться поле
      let section = null
      
      // Перевіряємо різні секції
      if (prev.portfolio && (prev.portfolio[field] || field === 'works' || field === 'categories')) {
        section = 'portfolio'
      } else if (prev.contact && (prev.contact[field] || field === 'projectAvailability')) {
        section = 'contact'
      } else if (prev.about && (prev.about[field] || field === 'education' || field === 'experience' || field === 'skills' || field === 'achievements')) {
        section = 'about'
      } else if (prev.videoRepertoire && (prev.videoRepertoire[field] || field === 'videos' || field === 'categories')) {
        section = 'videoRepertoire'
      }
      
      if (!section) {
        console.warn(`addArrayItem: ${field} не знайдено в жодній секції`)
        return prev
      }

      if (!prev[section][field]) {
        // Якщо поле не існує, створюємо його як масив
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: [newItem],
          },
        }
      }

      if (!Array.isArray(prev[section][field])) {
        console.warn(`addArrayItem: ${field} не є масивом`)
        return prev
      }

      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: [...prev[section][field], newItem],
        },
      }
    })
  }

  // Функція для видалення елемента з масиву
  const removeArrayItem = (field, index) => {
    setContent(prev => {
      // Визначаємо, в якій секції знаходиться поле
      let section = null
      let sectionKey = null
      
      // Перевіряємо різні секції
      if (prev.portfolio && prev.portfolio[field] && Array.isArray(prev.portfolio[field])) {
        section = 'portfolio'
        sectionKey = field
      } else if (prev.contact && prev.contact[field] && Array.isArray(prev.contact[field])) {
        section = 'contact'
        sectionKey = field
      } else if (prev.about && prev.about[field] && Array.isArray(prev.about[field])) {
        section = 'about'
        sectionKey = field
      } else if (prev.videoRepertoire && prev.videoRepertoire[field] && Array.isArray(prev.videoRepertoire[field])) {
        section = 'videoRepertoire'
        sectionKey = field
      }
      
      if (!section) {
        console.warn(`removeArrayItem: ${field} не знайдено в жодній секції або не є масивом`)
        return prev
      }

      return {
        ...prev,
        [section]: {
          ...prev[section],
          [sectionKey]: prev[section][sectionKey].filter((_, i) => i !== index),
        },
      }
    })
  }

  // Функція для збереження змін в localStorage та GitHub
  const saveChanges = async () => {
    try {
      // Зберігаємо в localStorage
      localStorage.setItem('portfolio-content', JSON.stringify(content))
      
      // Зберігаємо в content.json (для GitHub) через GitHub API
      try {
        const response = await fetch('https://api.github.com/repos/shurshik25/roman-syniuk-portfolio/dispatches', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
          },
          body: JSON.stringify({
            event_type: 'content-updated',
            client_payload: {
              content: JSON.stringify(content, null, 2)
            }
          })
        })
        
        if (response.ok) {
          console.log('✅ Контент відправлено на оновлення в GitHub')
        } else {
          console.warn('⚠️ Не вдалося оновити GitHub, але localStorage оновлено')
        }
      } catch (error) {
        console.warn('⚠️ GitHub API недоступний, зберігаю тільки в localStorage:', error)
      }
      
      setIsEditing(false)
      return true
    } catch (error) {
      console.error('❌ Помилка збереження:', error)
      return false
    }
  }

  // Функція для завантаження збережених змін
  const loadSavedChanges = () => {
    try {
      const saved = localStorage.getItem('portfolio-content')
      if (saved) {
        const parsedContent = JSON.parse(saved)
        setContent(parsedContent)
        return true
      }
    } catch (error) {
      console.error('Помилка завантаження:', error)
    }
    return false
  }

  // Функція для скидання до початкового стану
  const resetToDefault = () => {
    setContent(fallbackData)
    localStorage.removeItem('portfolio-content')
    setIsEditing(false)
  }

  // Завантажуємо дані при ініціалізації
  useEffect(() => {
    loadContent()
  }, [])

  return {
    content,
    isLoading,
    isEditing,
    setIsEditing,
    updateContent,
    updateNestedContent,
    updateArrayContent,
    addArrayItem,
    removeArrayItem,
    saveChanges,
    loadSavedChanges,
    resetToDefault,
    reloadContent,
  }
}

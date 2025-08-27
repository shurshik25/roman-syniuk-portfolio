import { useState, useEffect } from 'react'

// API base URL - для тестування використовуємо localhost
const API_BASE = 'http://localhost:3001'

// Початкові дані як fallback
const fallbackData = {
  hero: {
    name: 'Роман Синюк',
    title: 'Актор театру та кіно • Автор цифрового контенту',
    description:
      'Професійний актор з Хмельницького, спеціалізується на театральних постановках та кіноролях.',
    profileImage: '',
    stats: [
      { label: 'Ролей', value: '50+' },
      { label: 'Досвіду', value: '10+' },
      { label: 'Доступність', value: '100%' },
    ],
  },
  about: {
    biography: 'Роман Синюк - талановитий актор та автор цифрового контенту з Хмельницького.',
    education: ['Театральний університет', 'Курси акторської майстерності'],
    experience: ['Театр імені Шевченка', 'Кіностудія Довженка'],
    skills: ['Акторська майстерність', 'Сценічна мова', 'Пластика', 'Вокал'],
    achievements: ['Лауреат театральних фестивалів', 'Нагороди за найкращі ролі'],
  },
  portfolio: {
    categories: [
      { id: 'all', label: 'Всі роботи' },
      { id: 'theater', label: 'Театр' },
      { id: 'cinema', label: 'Кіно' },
      { id: 'photo', label: 'Фотосесії' },
    ],
    works: [
      {
        id: 1,
        title: 'Гамлет',
        description: 'Головна роль у виставі "Гамлет"',
        image: '/roman-syniuk-portfolio/images/theater/492004700_9329654113830678_7770632857348615682_n.jpg',
        category: 'theater'
      },
      {
        id: 2,
        title: 'Король Лір',
        description: 'Роль Едгара у виставі "Король Лір"',
        image: '/roman-syniuk-portfolio/images/theater/492057926_9329654067164016_4594880287050514130_n.jpg',
        category: 'theater'
      }
    ],
  },
  videoRepertoire: {
    categories: [
      { id: 'theater', label: 'Театр', icon: '🎭' },
      { id: 'cinema', label: 'Кіно', icon: '🎬' },
      { id: 'tv', label: 'Телебачення', icon: '📺' },
    ],
    videos: [
      {
        id: 1,
        title: 'Приклад театральної ролі',
        author: 'Автор',
        theater: 'Театр',
        year: '2023',
        director: 'Режисер',
        role: 'Роль',
        category: 'theater',
        description: 'Опис ролі',
        videoUrl: '',
        youtubeUrl: '',
        videoType: 'local',
        thumbnail: '',
        duration: '3:00',
        tags: ['театр', 'роль'],
      },
    ],
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
    projectAvailability: ['Театральні постановки', 'Кінофільми', 'Телесеріали'],
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
      // Спочатку пробуємо завантажити з API
      try {
        const response = await fetch(`${API_BASE}/api/content`)
        if (response.ok) {
          const contentData = await response.json()
          console.log('useContent hook - завантажено з API:', contentData)
          setContent(contentData)
          setIsLoading(false)
          return
        }
      } catch (error) {
        console.log('useContent hook - не вдалося завантажити з API, пробую localStorage:', error)
      }

      // Якщо API не працює, пробуємо localStorage
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
  const updateContent = async (section, field, value) => {
    try {
      // Оновлюємо локально
      setContent(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }))

      // Зберігаємо в API
      try {
        const response = await fetch(`${API_BASE}/api/content/${section}/${field}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value })
        })
        
        if (response.ok) {
          console.log('API: контент оновлено успішно')
        } else {
          console.warn('API: помилка оновлення контенту')
        }
      } catch (error) {
        console.warn('API недоступний, зберігаю в localStorage:', error)
        // Fallback до localStorage
        localStorage.setItem('portfolio-content', JSON.stringify(content))
      }
    } catch (error) {
      console.error('Помилка оновлення контенту:', error)
    }
  }

  // Функція для оновлення вкладених полів
  const updateNestedContent = async (section, field, subField, value) => {
    try {
      // Оновлюємо локально
      setContent(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: {
            ...prev[section][field],
            [subField]: value,
          },
        },
      }))

      // Зберігаємо в API
      try {
        const response = await fetch(`${API_BASE}/api/content/${section}/${field}/${subField}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value })
        })
        
        if (response.ok) {
          console.log('API: вкладений контент оновлено успішно')
        } else {
          console.warn('API: помилка оновлення вкладеного контенту')
        }
      } catch (error) {
        console.warn('API недоступний, зберігаю в localStorage:', error)
        localStorage.setItem('portfolio-content', JSON.stringify(content))
      }
    } catch (error) {
      console.error('Помилка оновлення вкладеного контенту:', error)
    }
  }

  // Функція для оновлення масивів
  const updateArrayContent = async (section, field, index, value) => {
    try {
      // Оновлюємо локально
      setContent(prev => {
        if (!prev[section] || !prev[section][field] || !Array.isArray(prev[section][field])) {
          console.warn(`updateArrayContent: ${field} не є масивом або не існує`)
          return prev
        }

        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: prev[section][field].map((item, i) =>
              i === index ? { ...item, ...value } : item
            ),
          },
        }
      })

      // Зберігаємо в API
      try {
        const response = await fetch(`${API_BASE}/api/content/${section}/${field}/${index}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value })
        })
        
        if (response.ok) {
          console.log('API: елемент масиву оновлено успішно')
        } else {
          console.warn('API: помилка оновлення елемента масиву')
        }
      } catch (error) {
        console.warn('API недоступний, зберігаю в localStorage:', error)
        localStorage.setItem('portfolio-content', JSON.stringify(content))
      }
    } catch (error) {
      console.error('Помилка оновлення елемента масиву:', error)
    }
  }

  // Функція для додавання нового елемента в масив
  const addArrayItem = async (section, field, newItem) => {
    try {
      // Оновлюємо локально
      setContent(prev => {
        if (!prev[section]) {
          console.warn(`addArrayItem: секція ${section} не існує`)
          return prev
        }

        if (!prev[section][field]) {
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

      // Зберігаємо в API
      try {
        const response = await fetch(`${API_BASE}/api/content/${section}/${field}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ item: newItem })
        })
        
        if (response.ok) {
          console.log('API: елемент додано успішно')
        } else {
          console.warn('API: помилка додавання елемента')
        }
      } catch (error) {
        console.warn('API недоступний, зберігаю в localStorage:', error)
        localStorage.setItem('portfolio-content', JSON.stringify(content))
      }
    } catch (error) {
      console.error('Помилка додавання елемента:', error)
    }
  }

  // Функція для видалення елемента з масиву
  const removeArrayItem = async (section, field, index) => {
    try {
      // Оновлюємо локально
      setContent(prev => {
        if (!prev[section] || !prev[section][field] || !Array.isArray(prev[section][field])) {
          console.warn(`removeArrayItem: ${field} не є масивом або не існує`)
          return prev
        }

        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: prev[section][field].filter((_, i) => i !== index),
          },
        }
      })

      // Зберігаємо в API
      try {
        const response = await fetch(`${API_BASE}/api/content/${section}/${field}/${index}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          console.log('API: елемент видалено успішно')
        } else {
          console.warn('API: помилка видалення елемента')
        }
      } catch (error) {
        console.warn('API недоступний, зберігаю в localStorage:', error)
        localStorage.setItem('portfolio-content', JSON.stringify(content))
      }
    } catch (error) {
      console.error('Помилка видалення елемента:', error)
    }
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
        // console.log('useContent hook - завантажено з localStorage:', parsedContent)
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
    // console.log('useContent hook - скидаю до початкового стану')
    setContent(fallbackData)
    localStorage.removeItem('portfolio-content')
    setIsEditing(false)
  }

  // Завантажуємо дані при ініціалізації
  useEffect(() => {
    // console.log('useContent hook - useEffect викликано')
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

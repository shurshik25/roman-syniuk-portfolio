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
        console.log('Contact section:', parsedContent.contact)
        console.log('Social data:', parsedContent.contact?.social)
        setContent(parsedContent)
        setIsLoading(false)
        return
      }

      // Якщо немає в localStorage, пробуємо завантажити з файлу
      try {
        const response = await fetch('/content.json')
        if (response.ok) {
          const contentData = await response.json()
          console.log('useContent hook - завантажено з файлу:', contentData)
          console.log('File contact section:', contentData.contact)
          console.log('File social data:', contentData.contact?.social)
          setContent(contentData)
        } else {
          console.log('useContent hook - не вдалося завантажити файл, використовую fallback')
          console.log('Fallback contact section:', fallbackData.contact)
          console.log('Fallback social data:', fallbackData.contact?.social)
          setContent(fallbackData)
        }
      } catch (error) {
        console.log('useContent hook - помилка завантаження файлу, використовую fallback:', error)
        console.log('Fallback contact section:', fallbackData.contact)
        console.log('Fallback social data:', fallbackData.contact?.social)
        setContent(fallbackData)
      }
    } catch (error) {
      console.error('useContent hook - критична помилка:', error)
      console.log('Fallback contact section:', fallbackData.contact)
      console.log('Fallback social data:', fallbackData.contact?.social)
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
    setContent(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value,
      },
    }))
  }

  // Функція для оновлення вкладених полів
  const updateNestedContent = (field, subField, value) => {
    setContent(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: {
          ...prev.contact[field],
          [subField]: value,
        },
      },
    }))
  }

  // Функція для оновлення масивів
  const updateArrayContent = (field, index, value) => {
    setContent(prev => {
      // Перевіряємо, чи існує секція та поле
      if (!prev.portfolio || !prev.portfolio[field] || !Array.isArray(prev.portfolio[field])) {
        console.warn(`updateArrayContent: ${field} не є масивом або не існує`)
        return prev
      }

      return {
        ...prev,
        portfolio: {
          ...prev.portfolio,
          [field]: prev.portfolio[field].map((item, i) =>
            i === index ? { ...item, ...value } : item
          ),
        },
      }
    })
  }

  // Функція для додавання нового елемента в масив
  const addArrayItem = (field, newItem) => {
    setContent(prev => {
      // Перевіряємо, чи існує секція та поле
      if (!prev.portfolio) {
        console.warn(`addArrayItem: секція portfolio не існує`)
        return prev
      }

      if (!prev.portfolio[field]) {
        // Якщо поле не існує, створюємо його як масив
        return {
          ...prev,
          portfolio: {
            ...prev.portfolio,
            [field]: [newItem],
          },
        }
      }

      if (!Array.isArray(prev.portfolio[field])) {
        console.warn(`addArrayItem: ${field} не є масивом`)
        return prev
      }

      return {
        ...prev,
        portfolio: {
          ...prev.portfolio,
          [field]: [...prev.portfolio[field], newItem],
        },
      }
    })
  }

  // Функція для видалення елемента з масиву
  const removeArrayItem = (field, index) => {
    setContent(prev => {
      // Перевіряємо, чи існує секція та поле
      if (!prev.portfolio || !prev.portfolio[field] || !Array.isArray(prev.portfolio[field])) {
        console.warn(`removeArrayItem: ${field} не є масивом або не існує`)
        return prev
      }

      return {
        ...prev,
        portfolio: {
          ...prev.portfolio,
          [field]: prev.portfolio[field].filter((_, i) => i !== index),
        },
      }
    })
  }

  // Функція для збереження змін в localStorage
  const saveChanges = () => {
    try {
      localStorage.setItem('portfolio-content', JSON.stringify(content))
      setIsEditing(false)
      return true
    } catch (error) {
      console.error('Помилка збереження:', error)
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

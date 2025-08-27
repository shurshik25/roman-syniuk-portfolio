import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useContent } from '../../hooks/useContent'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'
import AdminContent from './AdminContent'
import AdminActions from './AdminActions'
import SearchAndFilter from './SearchAndFilter'
import ChangeHistory from './ChangeHistory'

import { adminTabs } from './constants'
import './AdminPanel.css'

const AdminPanel = () => {
  // Основні стейти
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('hero')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [changeHistory, setChangeHistory] = useState([])
  const [undoStack, setUndoStack] = useState([])
  const [redoStack, setRedoStack] = useState([])
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
  const [lastSaved, setLastSaved] = useState(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [originalContent, setOriginalContent] = useState(null)

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Фільтри та підтаби
  const [portfolioSubTab, setPortfolioSubTab] = useState('all')
  const [videoRepertoireCategory, setVideoRepertoireCategory] = useState('all')


  const autoSaveTimer = useRef(null)

  const { content, isLoading, updateContent, updateNestedContent, reloadContent } = useContent()

  // Встановлюємо початковий контент при першому завантаженні
  useEffect(() => {
    if (content && !originalContent) {
      setOriginalContent(JSON.stringify(content))
      setHasChanges(false)
    }
  }, [content, originalContent])

  // Відслідковуємо зміни в контенті
  useEffect(() => {
    if (content && originalContent) {
      const currentContentString = JSON.stringify(content)
      setHasChanges(currentContentString !== originalContent)
    }
  }, [content, originalContent])


  // Функція updateNestedContent приходить з хуку useContent

  const updateArrayContent = useCallback((section, field, index, value) => {
    const array = [...(content[section][field] || [])]
    array[index] = value
    updateContent(section, field, array)
  }, [updateContent, content])

  const addArrayItem = useCallback((section, field, item) => {
    const array = [...(content[section][field] || []), item]
    updateContent(section, field, array)
  }, [updateContent, content])

  const removeArrayItem = useCallback((section, field, index) => {
    const array = [...(content[section][field] || [])]
    array.splice(index, 1)
    updateContent(section, field, array)
  }, [updateContent, content])

  const saveChanges = useCallback(() => {
    localStorage.setItem('portfolio-content', JSON.stringify(content))
    setLastSaved(new Date())
    setOriginalContent(JSON.stringify(content))
    setHasChanges(false)
  }, [content])

  const resetToDefault = useCallback(() => {
    localStorage.removeItem('portfolio-content')
    reloadContent()

  }, [reloadContent])

  // Обробка історії змін
  const addToHistory = useCallback(
    (action, details) => {
      const historyItem = {
        id: Date.now(),
        timestamp: new Date(),
        action,
        details,
      }
      setChangeHistory(prev => [historyItem, ...prev.slice(0, 49)]) // Зберігаємо останні 50
    },
    []
  )

  // Збереження
  const handleSave = useCallback(async () => {
    try {
      await saveChanges()
      setLastSaved(new Date())
      addToHistory('save', 'Зміни збережено')
    } catch (error) {
      console.error('Помилка збереження:', error)
      addToHistory('error', `Помилка збереження: ${error.message}`)
    }
  }, [saveChanges, addToHistory])

  // Клавіатурні скорочення та секретні способи доступу
  useEffect(() => {
    let clickCount = 0
    let clickTimer = null
    
    const handleKeyDown = (event) => {
      // Ctrl+Shift+A - відкрити/закрити адмін панель
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault()
        setIsVisible(prev => !prev)
      }
      
      // Escape - закрити панель
      if (event.key === 'Escape' && isVisible) {
        event.preventDefault()
        setIsVisible(false)
      }
      
      // Ctrl+S - зберегти (тільки якщо панель відкрита)
      if (event.ctrlKey && event.key === 's' && isVisible) {
        event.preventDefault()
        handleSave()
      }
    }

    const handleDoubleClick = (event) => {
      // Ignore clicks from navigation menu, admin panel, buttons, or any interactive elements
      if (event.target.closest('nav') || 
          event.target.closest('.admin-panel-container') ||
          event.target.closest('[data-navbar]') ||
          event.target.closest('button') ||
          event.target.closest('a') ||
          event.target.closest('input') ||
          event.target.closest('textarea') ||
          event.target.closest('select') ||
          event.target.closest('[role="button"]') ||
          event.target.closest('[tabindex]') ||
          isVisible) { // Don't trigger when admin panel is already open
        return
      }

      clickCount++
      if (clickCount === 1) {
        clickTimer = setTimeout(() => {
          clickCount = 0
        }, 300)
      } else if (clickCount === 2) {
        clearTimeout(clickTimer)
        clickCount = 0
        // Подвійний клік на логотипі або імені відкриває панель
        if (event.target.closest('header') || event.target.closest('.hero-name')) {
          setIsVisible(prev => !prev)
        }
      }
    }

    // Обробник секретної події з логотипу
    const handleLogoSecret = () => {
      setIsVisible(true)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('click', handleDoubleClick)
    window.addEventListener('openAdminPanel', handleLogoSecret)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('click', handleDoubleClick)
      window.removeEventListener('openAdminPanel', handleLogoSecret)
      if (clickTimer) clearTimeout(clickTimer)
    }
  }, [isVisible, handleSave])

  // Управління body класом для блокування скролу
  useEffect(() => {
    if (isVisible) {
      document.body.classList.add('admin-panel-open')
      document.body.style.overflow = 'hidden'
    } else {
      document.body.classList.remove('admin-panel-open')
      document.body.style.overflow = ''
    }

    return () => {
      document.body.classList.remove('admin-panel-open')
      document.body.style.overflow = ''
    }
  }, [isVisible])

  // Автозбереження
  useEffect(() => {
    if (autoSaveEnabled && isVisible) {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current)
      }

      autoSaveTimer.current = setTimeout(() => {
        handleSave()
      }, 30000) // Автозбереження кожні 30 секунд
    }

    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current)
      }
    }
  }, [content, autoSaveEnabled, isVisible, handleSave])



  // Функція для обробки завантаження зображень
  const handleImageUpload = useCallback(
    async (file, target) => {
      if (!file) {
        // Видалення зображення
        if (target.section && target.field) {
          if (target.index !== undefined) {
            // Оновлення зображення в масиві (портфоліо, відео)
            const sectionData = content[target.section]
            const fieldData = sectionData?.[target.field]

            if (Array.isArray(fieldData) && fieldData[target.index]) {
              const currentItem = fieldData[target.index]
              const imageField = target.field === 'videos' ? 'thumbnail' : 'image'
              updateArrayContent(target.section, target.field, target.index, {
                ...currentItem,
                [imageField]: '',
              })
            }
          } else {
            // Оновлення зображення в об'єкті (профільне фото)
            updateContent(target.section, target.field, '')
          }
          if (addToHistory) addToHistory('image_delete', `Видалено зображення з ${target.section}`)
        }
        return
      }

      try {
        // Імпортуємо утиліти для роботи з зображеннями
        const { processImageUpload } = await import('../../utils/imageUtils')

        // Обробляємо зображення з максимальним стисканням
        const processedImageData = await processImageUpload(file, {
          maxSizeMB: 0.5, // Зменшили до 500KB
          allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
          maxWidth: target.imageType === 'profile' ? 400 : 800, // Зменшили розміри
          maxHeight: target.imageType === 'profile' ? 400 : 600,
          quality: 0.6, // Зменшили якість для економії місця
          useCompression: true,
        })

        if (target.section && target.field) {
          if (target.index !== undefined) {
            // Оновлення зображення в масиві (портфоліо, відео)
            const sectionData = content[target.section]
            const fieldData = sectionData?.[target.field]

            if (Array.isArray(fieldData) && fieldData[target.index]) {
              const currentItem = fieldData[target.index]
              const imageField = target.field === 'videos' ? 'thumbnail' : 'image'

              updateArrayContent(target.section, target.field, target.index, {
                ...currentItem,
                [imageField]: processedImageData,
              })
            } else {

              return
            }
          } else {
            // Оновлення зображення в об'єкті (профільне фото)
            updateContent(target.section, target.field, processedImageData)
          }
          if (addToHistory) addToHistory('image_upload', `Завантажено зображення: ${file.name}`)
        }
      } catch (error) {
        console.error('Помилка завантаження зображення:', error)
        throw error
      }
    },
    [content, updateContent, updateArrayContent, addToHistory]
  )

  // Функції undo/redo
  const handleUndo = useCallback(() => {
    if (undoStack.length > 0) {
      const [lastAction, ...restUndo] = undoStack
      setRedoStack(prev => [lastAction, ...prev])
      setUndoStack(restUndo)

      // Відновлюємо попередній стан
      // TODO: Реалізувати відновлення попереднього стану
      // console.log('Undo:', lastAction.action)
    }
  }, [undoStack])

  const handleRedo = useCallback(() => {
    if (redoStack.length > 0) {
      const [lastAction, ...restRedo] = redoStack
      setUndoStack(prev => [lastAction, ...prev])
      setRedoStack(restRedo)

      // console.log('Redo:', lastAction.action)
    }
  }, [redoStack])



  // Швидкі дії
  const handleQuickAction = useCallback(
    action => {
      switch (action) {
        case 'save':
          handleSave()
          break
        case 'undo':
          handleUndo()
          break
        case 'redo':
          handleRedo()
          break
        case 'search':
          setIsSearchVisible(!isSearchVisible)
          break
        case 'preview':
      
          break
        default:
          break
      }
    },
    [handleSave, handleUndo, handleRedo, isSearchVisible]
  )



  // Функція фільтрації контенту для пошуку
  const getFilteredContent = useCallback(() => {
    if (!searchQuery.trim()) return null

    const query = searchQuery.toLowerCase()
    const results = []

    // Пошук в різних секціях
    adminTabs.forEach(tab => {
      const section = content[tab.id]
      if (section) {
        const matches = searchInSection(section, query, tab.label)
        if (matches.length > 0) {
          results.push({
            section: tab.label,
            matches,
          })
        }
      }
    })

    return results
  }, [searchQuery, content])

  const searchInSection = (section, query) => {
    const matches = []

    const searchInObject = (obj, path = '') => {
      if (typeof obj === 'string' && obj.toLowerCase().includes(query)) {
        matches.push({ path, value: obj })
      } else if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          if (typeof item === 'string' && item.toLowerCase().includes(query)) {
            matches.push({ path: `${path}[${index}]`, value: item })
          } else if (typeof item === 'object') {
            searchInObject(item, `${path}[${index}]`)
          }
        })
      } else if (typeof obj === 'object' && obj !== null) {
        Object.entries(obj).forEach(([key, value]) => {
          const newPath = path ? `${path}.${key}` : key
          searchInObject(value, newPath)
        })
      }
    }

    searchInObject(section)
    return matches
  }



  return (
    <>


      {/* Адмін-панель */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            data-testid="admin-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999]"
            onClick={(e) => {
              // Закрити панель при кліку на фон (не на вміст)
              if (e.target === e.currentTarget) {
                setIsVisible(false)
              }
            }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="h-full flex admin-panel-container"
        >
          {/* Mobile Sidebar Overlay */}
          <div className={`mobile-sidebar-overlay ${isMobileSidebarOpen ? 'active' : ''}`} 
               onClick={() => setIsMobileSidebarOpen(false)} />

          {/* Sidebar */}
          <AdminSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
            searchQuery={searchQuery}
            searchResults={getFilteredContent()}
            isMobileOpen={isMobileSidebarOpen}
            setIsMobileOpen={setIsMobileSidebarOpen}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col bg-white content">
            {/* Header */}
            <AdminHeader
              onClose={() => setIsVisible(false)}
              lastSaved={lastSaved}
              autoSaveEnabled={autoSaveEnabled}
              setAutoSaveEnabled={setAutoSaveEnabled}
              onQuickAction={handleQuickAction}
              canUndo={undoStack.length > 0}
              canRedo={redoStack.length > 0}
              onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
            />

            {/* Search Bar */}
            <AnimatePresence>
              {isSearchVisible && (
                <SearchAndFilter
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onClose={() => setIsSearchVisible(false)}
                  searchResults={getFilteredContent()}
                  onResultClick={() => {
                    // TODO: Реалізувати навігацію до результату пошуку
                  }}
                />
              )}
            </AnimatePresence>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 overflow-y-auto p-3 md:p-6">
                <AdminContent
                  activeTab={activeTab}
                  content={content}
                  updateContent={updateContent}
                  updateNestedContent={updateNestedContent}
                  updateArrayContent={updateArrayContent}
                  addArrayItem={addArrayItem}
                  removeArrayItem={removeArrayItem}
                  portfolioSubTab={portfolioSubTab}
                  setPortfolioSubTab={setPortfolioSubTab}
                  videoRepertoireCategory={videoRepertoireCategory}
                  setVideoRepertoireCategory={setVideoRepertoireCategory}
                  onImageUpload={handleImageUpload}
                  addToHistory={addToHistory}
                />
              </div>

              {/* Change History Sidebar - hidden on mobile */}
              <div className="hidden lg:block">
                <ChangeHistory
                  history={changeHistory}
                  onRevert={historyItem => {
                    // console.log('Revert to:', historyItem)
                    addToHistory('revert', `Повернено до стану: ${historyItem.action}`)
                  }}
                />
              </div>
            </div>

            {/* Actions */}
            <AdminActions
              onSave={handleSave}
              onReset={() => {
                if (confirm('Ви впевнені, що хочете скинути всі зміни?')) {
                  resetToDefault()
                  addToHistory('reset', 'Скинуто до початкових налаштувань')
                }
              }}
              onReload={() => {
                reloadContent()
                addToHistory('reload', 'Перезавантажено контент')
              }}
              isLoading={isLoading}
              hasChanges={hasChanges}
              autoSaveEnabled={autoSaveEnabled}
            />
          </div>


        </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default AdminPanel
